import { NextRequest, NextResponse } from 'next/server'
import { dispatchWebhook, type WebhookEvent } from '@/lib/webhook'
import { getRequestIp, logAuditEvent } from '@/lib/security'
import { createMemoryRateLimiter } from '@/lib/rateLimit'
import { sanitizePlainText } from '@/lib/sanitize'

const ALLOWED_EVENTS = new Set<WebhookEvent>([
  'assessment.started',
  'assessment.pdf_generated',
  'followup.scheduled',
])

const RATE_WINDOW_MS = 60_000
const RATE_MAX = 20
const checkRateLimit = createMemoryRateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_MAX })

function sanitize(value: unknown, max: number): string {
  return sanitizePlainText(value, max)
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req)
  if (checkRateLimit(ip).limited) {
    logAuditEvent({ type: 'rate-limited', ip, reason: 'assessment-event', timestamp: new Date().toISOString() })
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const event = sanitize(body.event, 80) as WebhookEvent
  if (!ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ error: 'Unsupported event' }, { status: 400 })
  }

  await dispatchWebhook(event, {
    reportRef: sanitize(body.reportRef, 80),
    company: sanitize(body.company, 200),
    source: sanitize(body.source, 120) || 'assessment-ui',
    page: sanitize(body.page, 120) || 'assessment',
    userAgent: req.headers.get('user-agent')?.slice(0, 180) ?? undefined,
  })

  return NextResponse.json({ ok: true }, { status: 202 })
}
