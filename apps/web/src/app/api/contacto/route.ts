import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

// ── Rate limiter (same pattern as /api/assessment) ────────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/<[^>]*>/g, '').slice(0, max);
}

// ── POST /api/contacto ────────────────────────────────────────────────────────
// Lighter contact form; saves to Strapi lead with source = 'contacto'
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

  const name    = sanitize(body.name, 200);
  const email   = sanitize(body.email, 200);
  const company = sanitize(body.company, 200);
  const phone   = sanitize(body.phone, 30);
  const message = sanitize(body.message, 2000);
  const service = sanitize(body.service, 100);

  if (!name)                           return NextResponse.json({ error: 'name requerido' },    { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'email inválido' },    { status: 400 });
  if (!company)                        return NextResponse.json({ error: 'empresa requerida' }, { status: 400 });

  const result = await strapi.post('/leads', {
    name,
    email,
    company,
    phone:    phone || undefined,
    services: service ? [service] : [],
    notes:    message || undefined,
    urgency:  'normal',
    status:   'new',
    source:   'contacto',
  });

  if (!result) {
    return NextResponse.json(
      { error: 'No se pudo enviar. Intenta nuevamente.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
