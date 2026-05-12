import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

// ── In-memory rate limiter (no Redis — single Railway instance) ───────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX = 5;            // 5 submissions per IP per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_MAX) return true;
  entry.count++;
  return false;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

// ── Validation ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/<[^>]*>/g, '').slice(0, max);
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name        = sanitize(body.name, 200);
  const email       = sanitize(body.email, 200);
  const company     = sanitize(body.company, 200);
  const phone       = sanitize(body.phone, 30);
  const notes       = sanitize(body.notes, 2000);
  const companySize = sanitize(body.companySize, 20); // longest valid value: size_200_plus (13 chars)
  const urgency     = sanitize(body.urgency, 10);
  const services    = Array.isArray(body.services)
    ? body.services.map((s) => sanitize(s, 100)).filter(Boolean)
    : [];

  if (!name)                      return NextResponse.json({ error: 'name requerido' },    { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'email inválido' }, { status: 400 });
  if (!company)                   return NextResponse.json({ error: 'empresa requerida' }, { status: 400 });

  const result = await strapi.post('/leads', {
    name,
    email,
    company,
    phone:       phone || undefined,
    companySize: companySize || undefined,
    services,
    urgency:     urgency || 'normal',
    notes:       notes || undefined,
    status:      'new',
    source:      'website-assessment',
  });

  if (!result) {
    return NextResponse.json(
      { error: 'No se pudo registrar la solicitud. Intenta nuevamente.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
