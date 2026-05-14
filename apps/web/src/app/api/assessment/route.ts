import { NextRequest, NextResponse } from 'next/server'
import { strapi }                    from '@/lib/strapi'
import { scoreAssessment }           from '@/lib/scoring'
import { classifyLead }              from '@/lib/classification'
import { dispatchWebhook, buildAssessmentCompletedPayload } from '@/lib/webhook'
import { isHoneypotFilled, isDisposableEmail, verifyTurnstile, logAuditEvent } from '@/lib/security'

// ─── Rate limiter ─────────────────────────────────────────────────────────────

const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 3   // stricter for full assessment (heavier processing)

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_MAX) return true
  entry.count++
  return false
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ─── Sanitization ─────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function san(v: unknown, max: number): string {
  if (typeof v !== 'string') return ''
  return v.trim().replace(/<[^>]*>/g, '').slice(0, max)
}

function sanArr(v: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(v)) return []
  return (v as unknown[])
    .slice(0, maxItems)
    .map((x: unknown) => san(x, maxLen))
    .filter(Boolean)
}

// ─── POST /api/assessment ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    logAuditEvent({ type: 'rate-limited', ip, timestamp: new Date().toISOString() })
    return NextResponse.json({ ok: true }, { status: 200 }) // silent — don't leak rate-limit info
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // ── Honeypot check ──
  if (isHoneypotFilled(body._hp)) {
    logAuditEvent({ type: 'honeypot', ip, email: san(body.email, 200), timestamp: new Date().toISOString() })
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // ── Turnstile (optional — only active if TURNSTILE_SECRET_KEY is set) ──
  const turnstileOk = await verifyTurnstile(san(body._ts, 2048), ip)
  if (!turnstileOk) {
    return NextResponse.json({ error: 'Verificación de seguridad fallida. Recarga la página.' }, { status: 403 })
  }

  // ── Contact validation ──
  const name    = san(body.name, 200)
  const email   = san(body.email, 200)
  const company = san(body.company, 200)
  const phone   = san(body.phone, 30)

  if (!name)                           return NextResponse.json({ error: 'name requerido' },    { status: 400 })
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'email inválido' },    { status: 400 })
  if (!company)                        return NextResponse.json({ error: 'empresa requerida' }, { status: 400 })

  if (isDisposableEmail(email)) {
    logAuditEvent({ type: 'disposable-email', ip, email, timestamp: new Date().toISOString() })
    return NextResponse.json({ error: 'Por favor usa tu correo corporativo.' }, { status: 400 })
  }

  // ── Step extraction ──
  const r1 = (body.step1 ?? {}) as Record<string, unknown>
  const r2 = (body.step2 ?? {}) as Record<string, unknown>
  const r3 = (body.step3 ?? {}) as Record<string, unknown>
  const r4 = (body.step4 ?? {}) as Record<string, unknown>
  const r5 = (body.step5 ?? {}) as Record<string, unknown>

  const answers = {
    name, email, company, phone,
    source: san(body.source, 100),
    utm:    san(body.utm, 200),
    step1: {
      industry:        san(r1.industry, 50),
      companySize:     san(r1.companySize, 20),
      locations:       san(r1.locations, 20),
      remoteWorkforce: san(r1.remoteWorkforce, 20),
      microsoft365:    san(r1.microsoft365, 20),
      infrastructure:  san(r1.infrastructure, 20),
    },
    step2: {
      vlanSegmentation:  san(r2.vlanSegmentation, 20),
      firewall:          san(r2.firewall, 20),
      vpn:               san(r2.vpn, 20),
      backup:            san(r2.backup, 20),
      wifiSegmentation:  san(r2.wifiSegmentation, 20),
      endpointInventory: san(r2.endpointInventory, 20),
      edrAv:             san(r2.edrAv, 20),
    },
    step3: {
      entraId:           san(r3.entraId, 20),
      mfa:               san(r3.mfa, 20),
      conditionalAccess: san(r3.conditionalAccess, 20),
      intune:            san(r3.intune, 20),
      privilegedAccess:  san(r3.privilegedAccess, 20),
      onboarding:        san(r3.onboarding, 20),
    },
    step4: {
      documentation:    san(r4.documentation, 20),
      monitoring:       san(r4.monitoring, 20),
      ticketing:        san(r4.ticketing, 20),
      lastAudit:        san(r4.lastAudit, 20),
      compliance:       sanArr(r4.compliance, 10, 30),
      changeManagement: san(r4.changeManagement, 20),
    },
    step5: {
      painPoint:       san(r5.painPoint, 50),
      urgency:         san(r5.urgency, 20),
      complianceNeeds: sanArr(r5.complianceNeeds, 10, 30),
      projectGoals:    sanArr(r5.projectGoals, 10, 30),
      notes:           san(r5.notes, 2000),
    },
  }

  // ── Scoring & classification ──
  const scores         = scoreAssessment(answers)
  const classification = classifyLead(answers, scores)
  const reportRef      = `VLK-${Date.now().toString(36).toUpperCase().slice(-6)}`

  // ── Strapi storage ──
  const assessmentSummary = [
    `[EVALUACIÓN OPERACIONAL v2 · ${reportRef}]`,
    `Madurez: ${scores.maturityLabel} (${scores.overall}/100) · Exposición: ${scores.exposureLabel}`,
    `Infra: ${scores.infrastructure} · Identidad: ${scores.identity} · Ops: ${scores.operations}`,
    `Hallazgos: ${scores.criticalCount} críticos · ${scores.highCount} altos`,
    `Segmento: ${classification.segment} · ${classification.engagementLabel}`,
    `Prioridad: ${classification.priorityLabel}`,
    '',
    scores.flags.slice(0, 3).map(f => `[${f.severity.toUpperCase()}] ${f.finding}`).join('\n'),
    answers.step5.notes ? `\nNota: ${answers.step5.notes}` : '',
  ].join('\n').trim()

  const SIZE_ENUM: Record<string, string> = {
    '1-25':   'size_1_10', '26-100':  'size_11_50',
    '101-500':'size_51_200', '500+':  'size_200_plus',
  }

  await strapi.post('/leads', {
    name, email, company,
    phone:       phone || undefined,
    companySize: SIZE_ENUM[answers.step1.companySize] ?? 'size_1_10',
    services:    [classification.engagementType],
    urgency:     (answers.step5.urgency === 'critical' || answers.step5.urgency === 'urgent') ? 'high' : 'normal',
    notes:       assessmentSummary,
    status:      'new',
    source:      `assessment-v2-${answers.source || 'direct'}`,
  })

  // ── Webhook events ──
  await dispatchWebhook('assessment.completed', buildAssessmentCompletedPayload({
    company, email,
    segment:        classification.segment,
    engagementType: classification.engagementType,
    priority:       classification.priority,
    overallScore:   scores.overall,
    criticalFlags:  scores.criticalCount,
    highFlags:      scores.highCount,
    maturity:       scores.maturity,
    exposure:       scores.exposureLevel,
    urgency:        answers.step5.urgency,
    source:         answers.source,
    utm:            answers.utm,
  }))

  if (scores.criticalCount > 0 || classification.priority === 'critical') {
    await dispatchWebhook('lead.critical', {
      company, email, reportRef,
      flags: scores.flags.filter(f => f.severity === 'critical').map(f => f.id),
    })
  }

  if (classification.segment === 'Enterprise' || classification.priority === 'critical') {
    await dispatchWebhook('lead.enterprise', { company, email, segment: classification.segment, reportRef })
  }

  logAuditEvent({ type: 'submission', ip, email, company, timestamp: new Date().toISOString() })

  return NextResponse.json({ ok: true, reportRef, scores, classification }, { status: 201 })
}
