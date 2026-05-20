import { createHash } from 'node:crypto'

// ─── Velkor Security Utilities ───────────────────────────────────────────────
// Honeypot detection, disposable email filtering, Turnstile verification.
// All checks are layered — any single check can be bypassed, but combination
// makes automated abuse economically unviable.

// ─── Honeypot ─────────────────────────────────────────────────────────────────
// Server-side check: if the honeypot field contains any value, reject silently.
// Return 200 (not 400) to avoid training bots on our detection logic.

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

// ─── Disposable email blocklist ───────────────────────────────────────────────
// Top disposable/temporary email providers. Not exhaustive — supplement with
// a third-party API (Abstract, Kickbox) for production.

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net',
  'guerrillamail.org', 'spam4.me', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'dispostable.com', 'mailnull.com', 'spamgourmet.com', 'spamgourmet.net',
  'spamgourmet.org', 'spamgourmet.com', 'fakeinbox.com', 'maildrop.cc',
  'discard.email', 'throwam.com', 'tempr.email', 'mailnesia.com', 'mailzilla.com',
  'dispostable.com', 'e4ward.com', 'deadaddress.com', 'getnada.com', 'inoutmail.de',
  'mohmal.com', 'sogetthis.com', 'spamex.com', 'tempemail.net', 'urgentmail.in',
  '10minutemail.com', '10minutemail.net', '20minutemail.com', 'mailexpire.com',
  'spamfree24.org', 'fakemail.net', 'trashmail.at', 'trashmail.io', 'trashmail.xyz',
])

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  return DISPOSABLE_DOMAINS.has(domain)
}

// ─── Client IP extraction ───────────────────────────────────────────────────
// Prefer Cloudflare's original visitor headers when the zone is proxied.

export function getRequestIp(req: { headers: Headers }): string {
  return (
    req.headers.get('cf-connecting-ip')?.trim() ||
    req.headers.get('true-client-ip')?.trim() ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

// ─── Cloudflare Turnstile verification ───────────────────────────────────────
// Only active if TURNSTILE_SECRET_KEY is set in the environment.
// Falls through if not configured, so Turnstile is opt-in for local/dev.

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TURNSTILE_EXPECTED_ACTION = process.env.TURNSTILE_EXPECTED_ACTION ?? 'assessment'
const TURNSTILE_FAIL_OPEN =
  process.env.TURNSTILE_FAIL_OPEN === 'true' ||
  (process.env.NODE_ENV !== 'production' && process.env.TURNSTILE_FAIL_OPEN !== 'false')
const TURNSTILE_ALLOWED_HOSTNAMES = (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? 'velkor.com.mx,www.velkor.com.mx')
  .split(',')
  .map(host => host.trim().toLowerCase())
  .filter(Boolean)

export interface TurnstileVerificationResult {
  success: boolean
  configured: boolean
  bypassed?: 'not-configured' | 'network-fail-open'
  errorCodes?: string[]
  action?: string
  hostname?: string
}

export async function verifyTurnstile(token: string | undefined, remoteIp: string): Promise<TurnstileVerificationResult> {
  if (!TURNSTILE_SECRET) {
    return { success: true, configured: false, bypassed: 'not-configured' }
  }

  if (!token) {
    return {
      success: false,
      configured: true,
      errorCodes: ['missing-input-response'],
    }
  }

  try {
    const res = await fetch(TURNSTILE_VERIFY, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: remoteIp === 'unknown' ? undefined : remoteIp,
        idempotency_key: crypto.randomUUID(),
      }),
      signal:  AbortSignal.timeout(5000),
    })
    const data = await res.json() as {
      success: boolean
      'error-codes'?: string[]
      action?: string
      hostname?: string
    }

    const actionOk = !TURNSTILE_EXPECTED_ACTION || data.action === TURNSTILE_EXPECTED_ACTION
    const hostname = data.hostname?.toLowerCase()
    const hostnameOk = !TURNSTILE_ALLOWED_HOSTNAMES.length || (hostname ? TURNSTILE_ALLOWED_HOSTNAMES.includes(hostname) : false)
    const success = data.success === true && actionOk && hostnameOk

    return {
      success,
      configured: true,
      errorCodes: success ? undefined : [
        ...(data['error-codes'] ?? []),
        ...(!actionOk ? ['action-mismatch'] : []),
        ...(!hostnameOk ? ['hostname-mismatch'] : []),
      ],
      action: data.action,
      hostname: data.hostname,
    }
  } catch {
    return {
      success: TURNSTILE_FAIL_OPEN,
      configured: true,
      bypassed: TURNSTILE_FAIL_OPEN ? 'network-fail-open' : undefined,
      errorCodes: ['siteverify-unreachable'],
    }
  }
}

// ─── Audit log entry ─────────────────────────────────────────────────────────
// Structured log for security events. In production, send to Logtail/Datadog.

export interface AuditEntry {
  type:      'submission' | 'rejection' | 'rate-limited' | 'honeypot' | 'disposable-email' | 'turnstile-failed' | 'turnstile-bypass'
  ip:        string
  email?:    string
  company?:  string
  reason?:   string
  timestamp: string
}

const LOG_HASH_SALT = process.env.LOG_HASH_SALT || process.env.ASSESSMENT_WEBHOOK_SECRET || 'velkor-log-v1'

function hashForLog(value: string): string {
  return createHash('sha256')
    .update(`${LOG_HASH_SALT}:${value.trim().toLowerCase()}`)
    .digest('hex')
    .slice(0, 16)
}

export function redactEmailForLog(email: string | undefined): string | undefined {
  if (!email) return undefined
  const [local, domain] = email.split('@')
  if (!local || !domain) return 'invalid-email'
  return `${local.slice(0, 2)}***@${domain.toLowerCase()}`
}

function sanitizeAuditEntry(entry: AuditEntry): Record<string, unknown> {
  return {
    audit: true,
    type: entry.type,
    ipHash: entry.ip && entry.ip !== 'unknown' ? hashForLog(entry.ip) : 'unknown',
    emailHash: entry.email ? hashForLog(entry.email) : undefined,
    emailDomain: entry.email?.split('@')[1]?.toLowerCase(),
    companyHash: entry.company ? hashForLog(entry.company) : undefined,
    reason: entry.reason,
    timestamp: entry.timestamp,
  }
}

export function logAuditEvent(entry: AuditEntry): void {
  console.log(JSON.stringify(sanitizeAuditEntry(entry)))
}
