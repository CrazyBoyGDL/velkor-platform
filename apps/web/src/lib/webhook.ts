// ─── Velkor Automation Pipeline — Webhook Dispatcher ────────────────────────
// Fires structured events to the configured webhook endpoint (n8n / Make / etc.)
// Set ASSESSMENT_WEBHOOK_URL in Railway environment to enable.
// Dispatch reports delivery status so the web app can alert operations without
// blocking the user flow.

export type WebhookEvent =
  | 'assessment.started'
  | 'assessment.completed'
  | 'assessment.pdf_generated'
  | 'lead.scored'
  | 'lead.classified'
  | 'lead.critical'
  | 'lead.enterprise'
  | 'lead.contact'
  | 'lead.storage_failed'
  | 'email.delivery_failed'
  | 'followup.scheduled'

export interface WebhookPayload {
  event:     WebhookEvent
  timestamp: string            // ISO-8601
  source:    'velkor-web'
  version:   '1'
  data:      Record<string, unknown>
}

const WEBHOOK_URL    = process.env.ASSESSMENT_WEBHOOK_URL
const WEBHOOK_SECRET = process.env.ASSESSMENT_WEBHOOK_SECRET  // optional HMAC
const ALLOW_PRIVATE_WEBHOOKS = process.env.ALLOW_PRIVATE_WEBHOOKS === 'true'

export interface WebhookDispatchResult {
  ok: boolean
  configured: boolean
  status?: number
  error?: string
}

async function computeSignature(body: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function isPrivateHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '0.0.0.0' ||
    hostname === '::1' ||
    hostname.startsWith('127.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
    hostname.endsWith('.internal')
  )
}

function validateWebhookUrl(url: string): { ok: boolean; reason?: string } {
  try {
    const parsed = new URL(url)
    const isProduction = process.env.NODE_ENV === 'production'
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return { ok: false, reason: 'unsupported protocol' }
    }
    if (isProduction && parsed.protocol !== 'https:' && !ALLOW_PRIVATE_WEBHOOKS) {
      return { ok: false, reason: 'webhook must use https in production' }
    }
    if (isProduction && isPrivateHostname(parsed.hostname) && !ALLOW_PRIVATE_WEBHOOKS) {
      return { ok: false, reason: 'private webhook host blocked in production' }
    }
    return { ok: true }
  } catch {
    return { ok: false, reason: 'invalid webhook url' }
  }
}

export async function dispatchWebhook(event: WebhookEvent, data: Record<string, unknown>): Promise<WebhookDispatchResult> {
  if (!WEBHOOK_URL) {
    return { ok: false, configured: false, error: 'ASSESSMENT_WEBHOOK_URL not configured' }
  }
  const urlValidation = validateWebhookUrl(WEBHOOK_URL)
  if (!urlValidation.ok) {
    return { ok: false, configured: true, error: urlValidation.reason }
  }

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    source:    'velkor-web',
    version:   '1',
    data,
  }

  const body = JSON.stringify(payload)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (WEBHOOK_SECRET) {
    headers['X-Velkor-Signature'] = await computeSignature(body, WEBHOOK_SECRET)
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method:  'POST',
      headers,
      body,
      signal:  AbortSignal.timeout(4000), // 4-second timeout
    })
    if (!res.ok) {
      return { ok: false, configured: true, status: res.status, error: `Webhook ${res.status}` }
    }
    return { ok: true, configured: true, status: res.status }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'webhook network error'
    return { ok: false, configured: true, error }
  }
}

// ─── Structured event builders ───────────────────────────────────────────────

export function buildAssessmentCompletedPayload(params: {
  leadId?:        unknown
  company:        string
  email:          string
  segment:        string
  engagementType: string
  priority:       string
  overallScore:   number
  criticalFlags:  number
  highFlags:      number
  maturity:       string
  exposure:       string
  urgency:        string
  source?:        string
  utm?:           string
}): Record<string, unknown> {
  return {
    ...params,
    eventTime: new Date().toISOString(),
  }
}
