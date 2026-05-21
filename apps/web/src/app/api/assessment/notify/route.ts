// ─── Velkor Systems — Assessment Notification Endpoint ────────────────────────
// POST /api/assessment/notify
// Sends the post-assessment summary email via Resend after results are shown.
// Called from the client once the assessment results page has mounted —
// NOT called automatically from the main assessment route.
//
// Email delivery is non-blocking for the user, but failures stay observable.

import { NextRequest, NextResponse } from 'next/server'
import { EMAIL_SEQUENCES, generateAssessmentEmail } from '@/lib/emailTemplate'
import type { EmailData }           from '@/lib/emailTemplate'
import { COMPANY, CONTACT }         from '@/lib/config'
import { getRequestIp, logAuditEvent, redactEmailForLog } from '@/lib/security'
import { dispatchWebhook } from '@/lib/webhook'
import { createMemoryRateLimiter } from '@/lib/rateLimit'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotifyBody {
  reportRef: string
  email:     string
  emailData: EmailData
}

// ─── Rate limiter (3 per IP per hour) ────────────────────────────────────────

const NOTIFY_WINDOW_MS = 60 * 60 * 1_000   // 1 hour
const NOTIFY_MAX       = 3
const checkNotifyRateLimit = createMemoryRateLimiter({ windowMs: NOTIFY_WINDOW_MS, max: NOTIFY_MAX })

// ─── Basic validation helpers ─────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isRiskFlag(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const flag = value as Record<string, unknown>
  return (
    typeof flag.severity === 'string' &&
    typeof flag.finding === 'string' &&
    typeof flag.recommendation === 'string'
  )
}

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function isValidEmailData(d: unknown): d is EmailData {
  if (!d || typeof d !== 'object') return false
  const o = d as Record<string, unknown>
  return (
    typeof o.recipientName    === 'string' &&
    typeof o.company          === 'string' &&
    typeof o.reportRef        === 'string' &&
    typeof o.overallScore     === 'number' &&
    typeof o.maturityLabel    === 'string' &&
    typeof o.exposureLabel    === 'string' &&
    typeof o.exposureLevel    === 'string' &&
    typeof o.criticalCount    === 'number' &&
    typeof o.highCount        === 'number' &&
    Array.isArray(o.topFlags) &&
    o.topFlags.every(isRiskFlag) &&
    isStringArray(o.quickWins) &&
    typeof o.recommendedPhase === 'string' &&
    typeof o.engagementLabel === 'string' &&
    typeof o.followUpLabel === 'string' &&
    typeof o.followUpHours === 'number'
  )
}

// ─── Resend integration ───────────────────────────────────────────────────────

const RESEND_API = 'https://api.resend.com/emails'
const FROM_ADDR  = `${COMPANY.name} <${CONTACT.email}>`

interface ResendPayload {
  from:    string
  to:      string[]
  subject: string
  html:    string
  reply_to?: string
}

async function sendViaResend(
  apiKey: string,
  to:     string,
  subject: string,
  html:   string,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const payload: ResendPayload = {
    from:    FROM_ADDR,
    to:      [to],
    subject,
    html,
    reply_to: CONTACT.email,
  }

  try {
    const res = await fetch(RESEND_API, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body:   JSON.stringify(payload),
      signal: AbortSignal.timeout(5_000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => 'unknown error')
      return { ok: false, error: `Resend ${res.status}: ${text}` }
    }

    const data = await res.json() as { id?: string }
    return { ok: true, id: data.id }
  } catch (err) {
    // Silent fail on network error — do not surface to client
    const msg = err instanceof Error ? err.message : 'network error'
    return { ok: false, error: msg }
  }
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req)

  // ── Rate limit ──
  const rateLimit = checkNotifyRateLimit(ip)
  if (rateLimit.limited) {
    logAuditEvent({ type: 'rate-limited', ip, reason: 'notify endpoint', timestamp: new Date().toISOString() })
    // Silent 200 — don't reveal rate limit details to client
    return NextResponse.json({ ok: true, sent: false, reason: 'rate-limited' }, { status: 200 })
  }

  // ── Parse body ──
  let body: Partial<NotifyBody>
  try {
    body = await req.json() as Partial<NotifyBody>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── Validate required fields ──
  const { reportRef, email, emailData } = body

  if (!reportRef || typeof reportRef !== 'string') {
    return NextResponse.json({ error: 'reportRef requerido' }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'email inválido' }, { status: 400 })
  }
  if (!isValidEmailData(emailData)) {
    return NextResponse.json({ error: 'emailData inválido o incompleto' }, { status: 400 })
  }

  // ── Observable degraded mode: no API key configured ──
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[EMAIL:SKIPPED]', JSON.stringify({
      reportRef,
      email: redactEmailForLog(email),
      reason: 'RESEND_API_KEY not configured',
    }))
    await dispatchWebhook('email.delivery_failed', {
      reportRef,
      email,
      company: emailData.company,
      reason: 'RESEND_API_KEY not configured',
      source: 'assessment-notify',
    })
    return NextResponse.json(
      { ok: true, sent: false, reason: 'RESEND_API_KEY not configured' },
      { status: 200 },
    )
  }

  // ── Build email ──
  const sequence = EMAIL_SEQUENCES['assessment-follow-up']
  const subject = `${sequence.label} · ${reportRef} · Velkor Systems`
  const html    = generateAssessmentEmail(emailData)

  // ── Send ──
  const result = await sendViaResend(apiKey, email, subject, html)

  if (!result.ok) {
    console.error('[EMAIL] Resend delivery failed:', result.error, { reportRef, email: redactEmailForLog(email) })
    await dispatchWebhook('email.delivery_failed', {
      reportRef,
      email,
      company: emailData.company,
      reason: result.error,
      source: 'assessment-notify',
    })
  }

  // ── Audit log ──
  logAuditEvent({
    type:      'submission',
    ip,
    email,
    company:   emailData.company,
    reason:    result.ok ? `email sent · id=${result.id}` : `send failed · ${result.error}`,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json(
    { ok: true, sent: result.ok, ...(result.id ? { id: result.id } : {}), ...(!result.ok ? { reason: 'delivery-failed' } : {}) },
    { status: 200 },
  )
}
