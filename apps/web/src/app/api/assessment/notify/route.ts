// ─── Velkor System — Assessment Notification Endpoint ────────────────────────
// POST /api/assessment/notify
// Sends the post-assessment summary email via Resend after results are shown.
// Called from the client once the assessment results page has mounted —
// NOT called automatically from the main assessment route.
//
// Fail-open: if RESEND_API_KEY is absent, logs and returns ok (dev-friendly).

import { NextRequest, NextResponse } from 'next/server'
import { generateAssessmentEmail } from '@/lib/emailTemplate'
import type { EmailData }           from '@/lib/emailTemplate'
import { logAuditEvent }            from '@/lib/security'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotifyBody {
  reportRef: string
  email:     string
  emailData: EmailData
}

// ─── Rate limiter (3 per IP per hour) ────────────────────────────────────────

const notifyRateMap = new Map<string, { count: number; resetAt: number }>()
const NOTIFY_WINDOW_MS = 60 * 60 * 1_000   // 1 hour
const NOTIFY_MAX       = 3

function isNotifyRateLimited(ip: string): boolean {
  const now   = Date.now()
  const entry = notifyRateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    notifyRateMap.set(ip, { count: 1, resetAt: now + NOTIFY_WINDOW_MS })
    return false
  }
  if (entry.count >= NOTIFY_MAX) return true
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

// ─── Basic validation helpers ─────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
    Array.isArray(o.quickWins)
  )
}

// ─── Resend integration ───────────────────────────────────────────────────────

const RESEND_API = 'https://api.resend.com/emails'
const FROM_ADDR  = 'Velkor System <noreply@velkor.mx>'

interface ResendPayload {
  from:    string
  to:      string[]
  subject: string
  html:    string
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
  const ip = getClientIp(req)

  // ── Rate limit ──
  if (isNotifyRateLimited(ip)) {
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

  // ── Fail-open: no API key configured ──
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('[EMAIL]', JSON.stringify({ reportRef, email, emailData }))
    return NextResponse.json(
      { ok: true, sent: false, reason: 'RESEND_API_KEY not configured' },
      { status: 200 },
    )
  }

  // ── Build email ──
  const subject = `Evaluación operacional completada · ${reportRef} · Velkor System`
  const html    = generateAssessmentEmail(emailData)

  // ── Send ──
  const result = await sendViaResend(apiKey, email, subject, html)

  if (!result.ok) {
    // Log internally but return success — don't expose delivery failures to client
    console.error('[EMAIL] Resend delivery failed:', result.error, { reportRef, email })
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
    { ok: true, sent: result.ok, ...(result.id ? { id: result.id } : {}) },
    { status: 200 },
  )
}
