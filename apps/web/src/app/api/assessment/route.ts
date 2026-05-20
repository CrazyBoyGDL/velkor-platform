import { NextRequest, NextResponse } from 'next/server'
import { strapi }                    from '@/lib/strapi'
import { scoreAssessment }           from '@/lib/scoring'
import { classifyLead }              from '@/lib/classification'
import { assignWorkflow, buildStrapiLeadPayload } from '@/lib/crm'
import { dispatchWebhook, buildAssessmentCompletedPayload } from '@/lib/webhook'
import { getRequestIp, isHoneypotFilled, isDisposableEmail, verifyTurnstile, logAuditEvent } from '@/lib/security'
import { createMemoryRateLimiter } from '@/lib/rateLimit'
import { sanitizePlainText, sanitizePlainTextArray } from '@/lib/sanitize'

// ─── Rate limiter ─────────────────────────────────────────────────────────────

const RATE_WINDOW_MS = 60_000
const RATE_MAX = 3   // stricter for full assessment (heavier processing)
const checkRateLimit = createMemoryRateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_MAX })

// ─── Sanitization ─────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function san(v: unknown, max: number): string {
  return sanitizePlainText(v, max)
}

function sanArr(v: unknown, maxItems: number, maxLen: number): string[] {
  return sanitizePlainTextArray(v, maxItems, maxLen)
}

// ─── POST /api/assessment ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req)

  const rateLimit = checkRateLimit(ip)
  if (rateLimit.limited) {
    logAuditEvent({ type: 'rate-limited', ip, timestamp: new Date().toISOString() })
    return NextResponse.json(
      { ok: false, error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    )
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

  // ── Turnstile (optional in dev, required in production when secret is set) ──
  const turnstile = await verifyTurnstile(san(body._ts, 2048), ip)
  if (!turnstile.success) {
    logAuditEvent({
      type: 'turnstile-failed',
      ip,
      reason: turnstile.errorCodes?.join(',') || 'unknown',
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(
      { error: 'Verificación anti-abuso fallida. Actualiza la verificación e intenta de nuevo.' },
      { status: 403 }
    )
  }

  if (turnstile.bypassed === 'network-fail-open') {
    logAuditEvent({
      type: 'turnstile-bypass',
      ip,
      reason: turnstile.errorCodes?.join(',') || 'siteverify-unreachable',
      timestamp: new Date().toISOString(),
    })
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

  // ── CRM workflow assignment ──
  const workflow = assignWorkflow(classification, scores)

  // ── Strapi storage (via CRM payload builder) ──
  const leadResult = await strapi.post('/leads', buildStrapiLeadPayload(answers, scores, classification, workflow, reportRef))
  const leadStored = Boolean(leadResult)

  const webhookTasks = [
    dispatchWebhook('assessment.completed', buildAssessmentCompletedPayload({
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
    })),
    dispatchWebhook('lead.scored', {
      company, email, reportRef,
      scores: {
        overall: scores.overall,
        infrastructure: scores.infrastructure,
        identity: scores.identity,
        operations: scores.operations,
        maturity: scores.maturity,
        exposure: scores.exposureLevel,
      },
      flags: {
        critical: scores.criticalCount,
        high: scores.highCount,
        total: scores.flags.length,
      },
    }),
    dispatchWebhook('lead.classified', {
      company, email, reportRef,
      segment: classification.segment,
      engagementType: classification.engagementType,
      priority: classification.priority,
      ownerRole: workflow.ownerRole,
      workflow: workflow.workflow,
      operationalPriority: workflow.operationalPriority,
    }),
    dispatchWebhook('followup.scheduled', {
      company, email, reportRef,
      workflow: workflow.workflow,
      ownerRole: workflow.ownerRole,
      slaHours: workflow.slaHours,
      firstAction: workflow.firstAction,
      escalationLevel: workflow.escalationLevel,
    }),
  ]

  if (scores.criticalCount > 0 || classification.priority === 'critical') {
    webhookTasks.push(dispatchWebhook('lead.critical', {
      company, email, reportRef,
      flags: scores.flags.filter(f => f.severity === 'critical').map(f => f.id),
    }))
  }

  if (classification.segment === 'Enterprise' || classification.priority === 'critical') {
    webhookTasks.push(dispatchWebhook('lead.enterprise', { company, email, segment: classification.segment, reportRef }))
  }

  const webhookResults = await Promise.all(webhookTasks)
  const webhookQueued = webhookResults.some(result => result.ok)

  if (!leadStored) {
    await dispatchWebhook('lead.storage_failed', {
      company,
      email,
      reportRef,
      source: 'assessment',
      workflow: workflow.workflow,
      priority: classification.priority,
      webhookQueued,
    })
  }

  const failedWebhooks = webhookResults.filter(result => result.configured && !result.ok)
  if (failedWebhooks.length > 0) {
    console.error('[WEBHOOK] Assessment dispatch degraded', { reportRef, failedWebhooks })
  }

  logAuditEvent({
    type: 'submission',
    ip,
    email,
    company,
    reason: `assessment · leadStored=${leadStored} · webhookQueued=${webhookQueued}`,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true, reportRef, scores, classification, leadStored, webhookQueued }, { status: 201 })
}
