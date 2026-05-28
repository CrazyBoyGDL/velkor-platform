import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';
import { buildDirectLeadPayload } from '@/lib/crm';
import { contactLeadEmail, sendOperationalEmail } from '@/lib/emailDelivery';
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

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;
const checkRateLimit = createMemoryRateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_MAX });
const checkEmailRateLimit = createMemoryRateLimiter({ windowMs: 10 * 60_000, max: 2 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── POST /api/contacto ────────────────────────────────────────────────────────
// Lighter contact form; saves to Strapi lead with source = 'contacto'
export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const trustedRequest = validateTrustedFormRequest(req);
  if (!trustedRequest.ok) {
    logAuditEvent({ type: 'rejection', ip, reason: `contacto:${trustedRequest.reason}`, timestamp: new Date().toISOString() });
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
    logAuditEvent({ type: 'rate-limited', ip, reason: 'contacto', timestamp: new Date().toISOString() });
    return NextResponse.json(
      { ok: false, leadStored: false, notified: false, error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    if (req.headers.get('content-type')?.includes('application/json')) {
      body = await req.json();
    } else {
      body = Object.fromEntries(await req.formData());
    }
  } catch {
    return NextResponse.json({ ok: false, leadStored: false, notified: false, error: 'Invalid request' }, { status: 400 });
  }

  if (isHoneypotFilled(body._hp)) {
    logAuditEvent({ type: 'honeypot', ip, email: sanitizePlainText(body.email, 200), timestamp: new Date().toISOString() });
    return NextResponse.json({ ok: true, leadStored: false, notified: false }, { status: 200 });
  }

  const elapsedMs = Number(body._elapsedMs);
  if (Number.isFinite(elapsedMs) && elapsedMs > 0 && elapsedMs < 1200) {
    logAuditEvent({
      type: 'spam-detected',
      ip,
      email: sanitizePlainText(body.email, 200),
      reason: `contacto:fast-submit:${Math.round(elapsedMs)}ms`,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, leadStored: false, notified: false }, { status: 200 });
  }

  const turnstile = await verifyTurnstile(sanitizePlainText(body._ts, 2048), ip, { expectedAction: 'contact' });
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

  const name    = sanitizePlainText(body.name, 200);
  const email   = sanitizePlainText(body.email, 200);
  const company = sanitizePlainText(body.company, 200);
  const phone   = sanitizePlainText(body.phone, 30);
  const message = sanitizePlainText(body.message, 2000);
  const service = sanitizePlainText(body.service, 100);

  if (!name)                           return NextResponse.json({ ok: false, leadStored: false, notified: false, error: 'name requerido' },    { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ ok: false, leadStored: false, notified: false, error: 'email inválido' },    { status: 400 });
  if (!company)                        return NextResponse.json({ ok: false, leadStored: false, notified: false, error: 'empresa requerida' }, { status: 400 });

  const emailRateLimit = checkEmailRateLimit(email.toLowerCase());
  if (emailRateLimit.limited) {
    logAuditEvent({ type: 'rate-limited', ip, email, reason: 'contacto-email', timestamp: new Date().toISOString() });
    return NextResponse.json(
      { ok: false, leadStored: false, notified: false, error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
      { status: 429, headers: { 'Retry-After': String(emailRateLimit.retryAfter) } }
    );
  }

  if (isDisposableEmail(email)) {
    logAuditEvent({ type: 'disposable-email', ip, email, timestamp: new Date().toISOString() });
    return NextResponse.json(
      { ok: false, leadStored: false, notified: false, error: 'Por favor usa tu correo corporativo.' },
      { status: 400 }
    );
  }

  const spamScore = scoreLeadSpam({ name, email, company, message, service });
  if (spamScore.spam) {
    logAuditEvent({
      type: 'spam-detected',
      ip,
      email,
      company,
      reason: `contacto:score=${spamScore.score}:${spamScore.reasons.join(',')}`,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, leadStored: false, notified: false }, { status: 200 });
  }

  const result = await strapi.post('/leads', buildDirectLeadPayload({
    name,
    email,
    company,
    phone,
    services: service ? [service] : [],
    notes: message,
    source: 'contacto',
    workflow: 'roadmap-workflow',
    nurtureStage: 'assessment-follow-up',
    operationalPriority: 'managed-roadmap',
  }));
  const leadStored = Boolean(result);

  const emailContent = contactLeadEmail({
    name,
    email,
    company,
    phone,
    service,
    message,
    source: 'contacto',
  });
  const [emailResult, webhookResult] = await Promise.all([
    sendOperationalEmail({ ...emailContent, replyTo: email }),
    dispatchWebhook('lead.contact', {
      name,
      email,
      company,
      phone,
      service,
      message,
      source: 'contacto',
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
      phone,
      source: 'contacto',
      notification: {
        emailConfigured: emailResult.configured,
        emailOk: emailResult.ok,
        webhookConfigured: webhookResult.configured,
        webhookOk: webhookResult.ok,
      },
    });
    logAuditEvent({
      type: 'rejection',
      ip,
      email,
      company,
      reason: notified ? 'strapi failed; fallback notification sent' : 'strapi and fallback notification failed',
      timestamp: new Date().toISOString(),
    });
  }

  if (!leadStored && !notified) {
    return NextResponse.json(
      { ok: false, leadStored, notified, fallbackUsed: false, error: 'No se pudo enviar. Intenta nuevamente.' },
      { status: 502 }
    );
  }

  logAuditEvent({
    type: 'submission',
    ip,
    email,
    company,
    reason: `contact lead · leadStored=${leadStored} · notified=${notified}`,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, leadStored, notified, fallbackUsed }, { status: leadStored ? 201 : 202 });
}
