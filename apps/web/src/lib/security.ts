import { createHash } from 'node:crypto'

// ─── Velkor Security Utilities ───────────────────────────────────────────────
// Honeypot detection, request provenance, disposable email filtering, spam scoring,
// Turnstile verification.
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

// ─── Public form request provenance ─────────────────────────────────────────
// Open lead endpoints should only accept browser submissions from our own site.
// This reduces direct script abuse before more expensive CRM/email work runs.

const DEFAULT_FORM_HOSTNAMES = [
  'velkor.com.mx',
  'www.velkor.com.mx',
]

function allowedFormOrigins(): Set<string> {
  const configuredHosts = (process.env.TURNSTILE_ALLOWED_HOSTNAMES || DEFAULT_FORM_HOSTNAMES.join(','))
    .split(',')
    .map(host => host.trim().toLowerCase())
    .filter(Boolean)

  const origins = new Set<string>()
  for (const host of configuredHosts) {
    origins.add(`https://${host}`)
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000')
    origins.add('http://localhost:3100')
    origins.add('http://127.0.0.1:3000')
    origins.add('http://127.0.0.1:3100')
  }

  return origins
}

export function validateTrustedFormRequest(req: { headers: Headers }): { ok: true } | { ok: false; reason: string } {
  const origin = req.headers.get('origin')?.trim().toLowerCase()
  const secFetchSite = req.headers.get('sec-fetch-site')?.trim().toLowerCase()
  const secFetchMode = req.headers.get('sec-fetch-mode')?.trim().toLowerCase()

  if (origin && !allowedFormOrigins().has(origin)) {
    return { ok: false, reason: 'origin-mismatch' }
  }

  if (secFetchSite && !['same-origin', 'same-site', 'none'].includes(secFetchSite)) {
    return { ok: false, reason: `sec-fetch-site:${secFetchSite}` }
  }

  if (secFetchMode && !['cors', 'same-origin', 'navigate'].includes(secFetchMode)) {
    return { ok: false, reason: `sec-fetch-mode:${secFetchMode}` }
  }

  if (process.env.NODE_ENV === 'production' && !origin && !secFetchSite) {
    return { ok: false, reason: 'missing-browser-provenance' }
  }

  return { ok: true }
}

// ─── Lightweight lead spam scoring ──────────────────────────────────────────
// This is intentionally conservative: high-confidence marketing/link spam only.

const SPAM_TERMS = [
  'backlink', 'backlinks', 'link building', 'guest post', 'guest posting',
  'seo services', 'rank higher', 'search engine ranking', 'domain authority',
  'casino', 'betting', 'gambling', 'crypto', 'bitcoin', 'forex', 'nft',
  'loan', 'payday', 'viagra', 'cialis', 'porn', 'escort', 'adult traffic',
  'telegram', 'whatsapp marketing', 'bulk email', 'email list',
]

const URL_RE = /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|xyz|ru|cn|top|shop|site|online|info|biz)\b)/gi
const HTML_TAG_RE = /<\s*\/?\s*[a-z][^>]*>/i

export function scoreLeadSpam(input: {
  name?: string
  email?: string
  company?: string
  message?: string
  service?: string
}): { spam: boolean; score: number; reasons: string[] } {
  const values = [
    input.name ?? '',
    input.email ?? '',
    input.company ?? '',
    input.message ?? '',
    input.service ?? '',
  ]
  const combined = values.join('\n').toLowerCase()
  const message = (input.message ?? '').toLowerCase()
  const reasons: string[] = []
  let score = 0

  const urls = combined.match(URL_RE) ?? []
  if (urls.length >= 1) {
    score += urls.length >= 2 ? 5 : 3
    reasons.push(`urls:${urls.length}`)
  }

  if (HTML_TAG_RE.test(combined)) {
    score += 3
    reasons.push('html-tags')
  }

  const matchedTerms = SPAM_TERMS.filter(term => combined.includes(term))
  if (matchedTerms.length > 0) {
    score += Math.min(6, matchedTerms.length * 2)
    reasons.push(`terms:${matchedTerms.slice(0, 3).join('|')}`)
  }

  if (/[\u0400-\u04ff]/.test(combined) && !/(fortinet|microsoft|intune|entra|red|firewall)/i.test(combined)) {
    score += 2
    reasons.push('unexpected-script')
  }

  if (message.length > 0 && message.length < 12 && urls.length > 0) {
    score += 2
    reasons.push('short-link-message')
  }

  return {
    spam: score >= 5,
    score,
    reasons,
  }
}

// ─── Cloudflare Turnstile verification ───────────────────────────────────────
// Only active if TURNSTILE_SECRET_KEY is set in the environment.
// Falls through if not configured, so Turnstile is opt-in for local/dev.

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TURNSTILE_EXPECTED_ACTION = process.env.TURNSTILE_EXPECTED_ACTION
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

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string,
  options: { expectedAction?: string } = {}
): Promise<TurnstileVerificationResult> {
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

    const expectedAction = options.expectedAction ?? TURNSTILE_EXPECTED_ACTION
    const actionOk = !expectedAction || data.action === expectedAction
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
  type:      'submission' | 'rejection' | 'rate-limited' | 'honeypot' | 'disposable-email' | 'spam-detected' | 'turnstile-failed' | 'turnstile-bypass'
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
