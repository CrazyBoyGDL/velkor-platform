// ─── Velkor Automation Pipeline — Webhook Dispatcher ────────────────────────
// Fires structured events to the configured webhook endpoint (n8n / Make / etc.)
// Set ASSESSMENT_WEBHOOK_URL in Railway environment to enable.
// All events fail silently — never block the user flow.

export type WebhookEvent =
  | 'assessment.started'
  | 'assessment.completed'
  | 'assessment.pdf_generated'
  | 'lead.scored'
  | 'lead.classified'
  | 'lead.critical'
  | 'lead.enterprise'
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

async function computeSignature(body: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function dispatchWebhook(event: WebhookEvent, data: Record<string, unknown>): Promise<void> {
  if (!WEBHOOK_URL) return  // not configured — no-op

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
    await fetch(WEBHOOK_URL, {
      method:  'POST',
      headers,
      body,
      signal:  AbortSignal.timeout(4000), // 4-second timeout
    })
  } catch {
    // Silent fail — automation pipeline must never interrupt user flow
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
