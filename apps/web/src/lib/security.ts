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
    // If Siteverify is unreachable, fail open and audit the bypass.
    return {
      success: true,
      configured: true,
      bypassed: 'network-fail-open',
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

export function logAuditEvent(entry: AuditEntry): void {
  // Structured JSON log — Railway log aggregation picks this up automatically
  console.log(JSON.stringify({ audit: true, ...entry }))
}
