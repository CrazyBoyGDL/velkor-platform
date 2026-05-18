import type { DiagnosticCtaIntent, ExposureLevel } from './scoring'

export interface ConsultiveCTAContext {
  intent?: DiagnosticCtaIntent
  service?: string
  riskLevel?: ExposureLevel
  source?: string
  pathname?: string
}

export interface ConsultiveCTA {
  intent: DiagnosticCtaIntent
  label: string
  supporting: string
  href: string
  service: string
  source: string
}

const CTA_COPY: Record<DiagnosticCtaIntent, { label: string; supporting: string; service: string }> = {
  'operational-review': {
    label: 'Revisamos tu escenario',
    supporting: 'Un especialista separa riesgos, restricciones y primer alcance.',
    service: 'operaciones',
  },
  'segmentation-validation': {
    label: 'Cuéntanos cómo está segmentada',
    supporting: 'Cruces entre zonas, reglas heredadas y rollback antes de producción.',
    service: 'ciberseguridad',
  },
  'identity-exposure-review': {
    label: 'Revisamos identidades expuestas',
    supporting: 'MFA, privilegios, sesiones y evidencia de Acceso Condicional.',
    service: 'identidad',
  },
  'endpoint-governance-check': {
    label: 'Ubicamos equipos sin dueño',
    supporting: 'Inventario, postura, BYOD y ownership de parcheo.',
    service: 'endpoint',
  },
  'mfa-gap-review': {
    label: 'Aterrizamos la brecha MFA',
    supporting: 'Excepciones, proveedores, admins y protocolos heredados.',
    service: 'identidad',
  },
  'remote-access-review': {
    label: 'Validamos acceso remoto',
    supporting: 'VPN, dispositivo, MFA y trazabilidad antes de ampliar acceso.',
    service: 'ciberseguridad',
  },
}

const DEFAULT_WHATSAPP_MESSAGE =
  'Hola, quiero contarles un escenario de infraestructura y revisar el primer paso con Velkor.'

function whatsappNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const number = raw?.replace(/[^\d]/g, '') ?? ''
  return number.length >= 10 ? number : null
}

export function getWhatsAppHref(message: string = DEFAULT_WHATSAPP_MESSAGE): string | null {
  const number = whatsappNumber()
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function getConsultiveContactTarget(source = 'consultive-contact') {
  const href = getWhatsAppHref(
    `Hola, vengo de ${source}. Queremos revisar un escenario operativo con Velkor.`
  )

  return {
    href: href ?? `/contacto?source=${encodeURIComponent(source)}`,
    external: Boolean(href),
    label: 'Cuéntanos el escenario',
    supporting: href
      ? 'WhatsApp directo con contexto técnico.'
      : 'Formulario breve para una respuesta humana.',
  }
}

function inferIntentFromPath(pathname?: string): DiagnosticCtaIntent {
  if (!pathname) return 'operational-review'
  if (pathname.includes('identidad') || pathname.includes('intune')) return 'identity-exposure-review'
  if (pathname.includes('ciberseguridad') || pathname.includes('fortinet')) return 'segmentation-validation'
  if (pathname.includes('videovigilancia') || pathname.includes('cctv')) return 'remote-access-review'
  if (pathname.includes('framework/evidence')) return 'operational-review'
  return 'operational-review'
}

function buildAssessmentHref(intent: DiagnosticCtaIntent, source: string): string {
  return `/assessments?intent=${encodeURIComponent(intent)}&source=${encodeURIComponent(source)}`
}

export function getConsultiveCTA(context: ConsultiveCTAContext = {}): ConsultiveCTA {
  const intent = context.intent ?? inferIntentFromPath(context.pathname)
  const base = CTA_COPY[intent]
  const source = context.source ?? 'adaptive-cta'
  const riskPrefix =
    context.riskLevel === 'critical' ? 'Prioridad alta: ' :
    context.riskLevel === 'high' ? 'Revisar pronto: ' :
    ''

  return {
    intent,
    label: `${riskPrefix}${base.label}`,
    supporting: base.supporting,
    href: buildAssessmentHref(intent, source),
    service: context.service ?? base.service,
    source,
  }
}
