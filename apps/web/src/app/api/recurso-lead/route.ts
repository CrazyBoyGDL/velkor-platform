import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';
import { buildDirectLeadPayload } from '@/lib/crm';
import { resourceLeadEmail, sendOperationalEmail } from '@/lib/emailDelivery';
import {
  getRequestIp,
  isDisposableEmail,
  isHoneypotFilled,
  logAuditEvent,
  scoreLeadSpam,
  validateTrustedFormRequest,
  verifyTurnstile,
} from '@/lib/security';
import { createMemoryRateLimiter } from '@/lib/rateLimit';
import { sanitizePlainText } from '@/lib/sanitize';
import { dispatchWebhook } from '@/lib/webhook';

// ── Rate limiter (same pattern as /api/assessment) ────────────────────────────
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;
const checkRateLimit = createMemoryRateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_MAX });
const checkEmailRateLimit = createMemoryRateLimiter({ windowMs: 10 * 60_000, max: 2 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value: unknown, max: number): string {
  return sanitizePlainText(value, max);
}

// ── POST /api/recurso-lead ────────────────────────────────────────────────────
// Body: { name, email, company, resourceSlug }
// Saves lead to Strapi with source = 'recurso-[slug]'
export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const trustedRequest = validateTrustedFormRequest(req);
  if (!trustedRequest.ok) {
    logAuditEvent({ type: 'rejection', ip, reason: `recurso:${trustedRequest.reason}`, timestamp: new Date().toISOString() });
    return NextResponse.json(
      { ok: false, leadStored: false, notified: false, error: 'Solicitud no permitida.' },
      {
        status: 403,
        headers: { 'Vary': 'Origin, Sec-Fetch-Site, Sec-Fetch-Mode' },
      }
    );
  }

  const rateLimit = checkRateLimit(ip);
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (isHoneypotFilled(body._hp)) {
    logAuditEvent({ type: 'honeypot', ip, email: sanitize(body.email, 200), timestamp: new Date().toISOString() });
    return NextResponse.json({ ok: true, leadStored: false, notified: false }, { status: 200 });
  }

  const elapsedMs = Number(body._elapsedMs);
  if (Number.isFinite(elapsedMs) && elapsedMs > 0 && elapsedMs < 1200) {
    logAuditEvent({
      type: 'spam-detected',
      ip,
      email: sanitize(body.email, 200),
      reason: `resource:fast-submit:${Math.round(elapsedMs)}ms`,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, leadStored: false, notified: false }, { status: 200 });
  }

  const turnstile = await verifyTurnstile(sanitize(body._ts, 2048), ip, { expectedAction: 'resource' });
  if (!turnstile.success) {
    logAuditEvent({
      type: 'turnstile-failed',
      ip,
      reason: turnstile.errorCodes?.join(',') || 'unknown',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { ok: false, leadStored: false, notified: false, error: 'Verificación anti-abuso fallida. Actualiza la verificación e intenta de nuevo.' },
      { status: 403 }
    );
  }

  if (turnstile.bypassed === 'network-fail-open') {
    logAuditEvent({
      type: 'turnstile-bypass',
      ip,
      reason: turnstile.errorCodes?.join(',') || 'siteverify-unreachable',
      timestamp: new Date().toISOString(),
    });
  }

  const name         = sanitize(body.name, 200);
  const email        = sanitize(body.email, 200);
  const company      = sanitize(body.company, 200);
  const resourceSlug = sanitize(body.resourceSlug, 90); // source = 'recurso-' (8) + slug (90) = 98 ≤ maxLength:100

  if (!name)                           return NextResponse.json({ error: 'name requerido' },    { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'email inválido' },    { status: 400 });
  if (!company)                        return NextResponse.json({ error: 'empresa requerida' }, { status: 400 });
  if (!resourceSlug)                   return NextResponse.json({ error: 'recurso inválido' },  { status: 400 });

  const emailRateLimit = checkEmailRateLimit(email.toLowerCase());
  if (emailRateLimit.limited) {
    logAuditEvent({ type: 'rate-limited', ip, email, reason: 'resource-email', timestamp: new Date().toISOString() });
    return NextResponse.json(
      { ok: false, leadStored: false, notified: false, error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
      { status: 429, headers: { 'Retry-After': String(emailRateLimit.retryAfter) } }
    );
  }

  if (isDisposableEmail(email)) {
    logAuditEvent({ type: 'disposable-email', ip, email, timestamp: new Date().toISOString() });
    return NextResponse.json({ error: 'Por favor usa tu correo corporativo.' }, { status: 400 });
  }

  const spamScore = scoreLeadSpam({ name, email, company, service: resourceSlug });
  if (spamScore.spam) {
    logAuditEvent({
      type: 'spam-detected',
      ip,
      email,
      company,
      reason: `resource:score=${spamScore.score}:${spamScore.reasons.join(',')}`,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, leadStored: false, notified: false }, { status: 200 });
  }

  const result = await strapi.post('/leads', buildDirectLeadPayload({
    name,
    email,
    company,
    services: [resourceSlug],
    source: `recurso-${resourceSlug}`,
    workflow: 'nurture-sequence',
    owner: 'account-development',
    nurtureStage: 'evidence-share',
    operationalPriority: 'nurture',
  }));
  const leadStored = Boolean(result);

  const emailContent = resourceLeadEmail({ name, email, company, resourceSlug });
  const [emailResult, webhookResult] = await Promise.all([
    sendOperationalEmail({ ...emailContent, replyTo: email }),
    dispatchWebhook('lead.resource', {
      name,
      email,
      company,
      resourceSlug,
      source: `recurso-${resourceSlug}`,
      leadStored,
    }),
  ]);
  const notified = emailResult.ok || webhookResult.ok;
  const fallbackUsed = !leadStored && notified;

  if (!leadStored) {
    await dispatchWebhook('lead.storage_failed', {
      name,
      email,
      company,
      source: `recurso-${resourceSlug}`,
      notification: {
        emailConfigured: emailResult.configured,
        emailOk: emailResult.ok,
        webhookConfigured: webhookResult.configured,
        webhookOk: webhookResult.ok,
      },
    });
  }

  if (!leadStored && !notified) {
    return NextResponse.json(
      { ok: false, leadStored, notified, fallbackUsed: false, error: 'No se pudo registrar. Intenta nuevamente.' },
      { status: 502 }
    );
  }

  logAuditEvent({
    type: 'submission',
    ip,
    email,
    company,
    reason: `resource lead · leadStored=${leadStored} · notified=${notified}`,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, leadStored, notified, fallbackUsed }, { status: leadStored ? 201 : 202 });
}
