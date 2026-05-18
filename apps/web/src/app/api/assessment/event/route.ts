import { NextRequest, NextResponse } from 'next/server'
import { dispatchWebhook, type WebhookEvent } from '@/lib/webhook'
import { getRequestIp, logAuditEvent } from '@/lib/security'

const ALLOWED_EVENTS = new Set<WebhookEvent>([
  'assessment.started',
  'assessment.pdf_generated',
  'followup.scheduled',
])

const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 20

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

function sanitize(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/<[^>]*>/g, '').slice(0, max)
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req)
  if (isRateLimited(ip)) {
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
