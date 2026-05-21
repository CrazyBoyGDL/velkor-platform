import { COMPANY, CONTACT } from '@/lib/config'
import { escapeHtml, preserveLineBreaks } from '@/lib/sanitize'

const RESEND_API = 'https://api.resend.com/emails'

export interface EmailDeliveryResult {
  ok: boolean
  configured: boolean
  id?: string
  reason?: string
}

export interface OperationalEmailInput {
  to?: string | string[]
  subject: string
  html: string
  replyTo?: string
}

function parseRecipients(value?: string): string[] {
  return (value || '')
    .split(/[;,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

function recipients(to?: string | string[]): string[] {
  const values = Array.isArray(to) ? to.flatMap(parseRecipients) : parseRecipients(to)
  const fallback = parseRecipients(process.env.LEAD_NOTIFICATION_EMAIL || CONTACT.email)
  return Array.from(new Set(values.length ? values : fallback))
}

export async function sendOperationalEmail(input: OperationalEmailInput): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY
  const to = recipients(input.to)

  if (!apiKey) {
    console.log('[EMAIL:SKIPPED]', JSON.stringify({
      recipientCount: to.length,
      reason: 'RESEND_API_KEY not configured',
    }))
    return { ok: false, configured: false, reason: 'RESEND_API_KEY not configured' }
  }

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${COMPANY.name} <${CONTACT.emailNoReply}>`,
        to,
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(5_000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => 'unknown error')
      return { ok: false, configured: true, reason: `Resend ${res.status}: ${text}` }
    }

    const data = await res.json().catch(() => ({})) as { id?: string }
    return { ok: true, configured: true, id: data.id }
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'network error'
    return { ok: false, configured: true, reason }
  }
}

export function contactLeadEmail(params: {
  name: string
  email: string
  company: string
  phone?: string
  service?: string
  message?: string
  source: string
}) {
  const safe = {
    name: escapeHtml(params.name),
    email: escapeHtml(params.email),
    company: escapeHtml(params.company),
    phone: escapeHtml(params.phone || 'No indicado'),
    service: escapeHtml(params.service || 'No especificado'),
    source: escapeHtml(params.source),
    message: preserveLineBreaks(params.message),
  }

  return {
    subject: `Nuevo contacto Velkor · ${params.company}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#080c14;color:#e5e7eb;padding:24px">
        <h1 style="font-size:20px;margin:0 0 12px">Nuevo lead de contacto</h1>
        <p style="margin:0 0 18px;color:#9ca3af">Origen: ${safe.source}</p>
        <table style="border-collapse:collapse;width:100%;max-width:680px">
          <tr><td style="padding:8px;color:#94a3b8">Nombre</td><td style="padding:8px">${safe.name}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Email</td><td style="padding:8px">${safe.email}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Empresa</td><td style="padding:8px">${safe.company}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Telefono</td><td style="padding:8px">${safe.phone}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Servicio</td><td style="padding:8px">${safe.service}</td></tr>
        </table>
        <div style="margin-top:18px;padding:16px;border-left:2px solid #638fa9;background:rgba(99,143,169,0.08)">
          ${safe.message}
        </div>
      </div>
    `,
  }
}

export function resourceLeadEmail(params: {
  name: string
  email: string
  company: string
  resourceSlug: string
}) {
  const safe = {
    name: escapeHtml(params.name),
    email: escapeHtml(params.email),
    company: escapeHtml(params.company),
    resourceSlug: escapeHtml(params.resourceSlug),
  }

  return {
    subject: `Nuevo recurso Velkor · ${params.company}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#080c14;color:#e5e7eb;padding:24px">
        <h1 style="font-size:20px;margin:0 0 12px">Nuevo lead de recurso</h1>
        <p style="margin:0 0 18px;color:#9ca3af">Origen: recurso-${safe.resourceSlug}</p>
        <table style="border-collapse:collapse;width:100%;max-width:680px">
          <tr><td style="padding:8px;color:#94a3b8">Nombre</td><td style="padding:8px">${safe.name}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Email</td><td style="padding:8px">${safe.email}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Empresa</td><td style="padding:8px">${safe.company}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Recurso</td><td style="padding:8px">${safe.resourceSlug}</td></tr>
        </table>
      </div>
    `,
  }
}

export function assessmentLeadEmail(params: {
  name: string
  email: string
  company: string
  phone?: string
  reportRef: string
  source?: string
  overallScore: number
  maturityLabel: string
  exposureLabel: string
  criticalCount: number
  highCount: number
  segment: string
  engagementLabel: string
  priorityLabel: string
  followUpLabel: string
  followUpHours: number
  recommendedPhase: string
}) {
  const safe = {
    name: escapeHtml(params.name),
    email: escapeHtml(params.email),
    company: escapeHtml(params.company),
    phone: escapeHtml(params.phone || 'No indicado'),
    reportRef: escapeHtml(params.reportRef),
    source: escapeHtml(params.source || 'direct'),
    overallScore: escapeHtml(String(params.overallScore)),
    maturityLabel: escapeHtml(params.maturityLabel),
    exposureLabel: escapeHtml(params.exposureLabel),
    criticalCount: escapeHtml(String(params.criticalCount)),
    highCount: escapeHtml(String(params.highCount)),
    segment: escapeHtml(params.segment),
    engagementLabel: escapeHtml(params.engagementLabel),
    priorityLabel: escapeHtml(params.priorityLabel),
    followUpLabel: escapeHtml(params.followUpLabel),
    followUpHours: escapeHtml(String(params.followUpHours)),
    recommendedPhase: escapeHtml(params.recommendedPhase),
  }

  return {
    subject: `Nuevo assessment Velkor · ${params.company} · ${params.reportRef}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#080c14;color:#e5e7eb;padding:24px">
        <h1 style="font-size:20px;margin:0 0 12px">Nuevo assessment completado</h1>
        <p style="margin:0 0 18px;color:#9ca3af">Reporte: ${safe.reportRef} · Origen: ${safe.source}</p>
        <table style="border-collapse:collapse;width:100%;max-width:760px">
          <tr><td style="padding:8px;color:#94a3b8">Nombre</td><td style="padding:8px">${safe.name}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Email</td><td style="padding:8px">${safe.email}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Empresa</td><td style="padding:8px">${safe.company}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Telefono</td><td style="padding:8px">${safe.phone}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Score</td><td style="padding:8px">${safe.overallScore}/100 · ${safe.maturityLabel} · ${safe.exposureLabel}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Hallazgos</td><td style="padding:8px">${safe.criticalCount} criticos · ${safe.highCount} altos</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Segmento</td><td style="padding:8px">${safe.segment} · ${safe.engagementLabel}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Prioridad</td><td style="padding:8px">${safe.priorityLabel}</td></tr>
          <tr><td style="padding:8px;color:#94a3b8">Seguimiento</td><td style="padding:8px">${safe.followUpLabel} · ${safe.followUpHours} h</td></tr>
        </table>
        <div style="margin-top:18px;padding:16px;border-left:2px solid #638fa9;background:rgba(99,143,169,0.08)">
          <strong>Fase recomendada</strong><br />
          ${safe.recommendedPhase}
        </div>
      </div>
    `,
  }
}
