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

// ─── Cloudflare Turnstile verification ───────────────────────────────────────
// Only active if TURNSTILE_SECRET_KEY is set in the environment.
// Falls through (returns true) if not configured, so Turnstile is opt-in.

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string | undefined, remoteIp: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true   // not configured — allow through
  if (!token)            return false

  try {
    const res = await fetch(TURNSTILE_VERIFY, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, remoteip: remoteIp }).toString(),
      signal:  AbortSignal.timeout(5000),
    })
    const data = await res.json() as { success: boolean }
    return data.success === true
  } catch {
    // If Turnstile is unreachable, fail open (don't block legitimate users)
    return true
  }
}

// ─── Audit log entry ─────────────────────────────────────────────────────────
// Structured log for security events. In production, send to Logtail/Datadog.

export interface AuditEntry {
  type:      'submission' | 'rejection' | 'rate-limited' | 'honeypot' | 'disposable-email'
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
