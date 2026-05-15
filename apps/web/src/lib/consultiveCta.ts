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
    label: 'Aterrizar diagnostico tecnico',
    supporting: 'Riesgos, restricciones y primer alcance sin inflar el proyecto.',
    service: 'operaciones',
  },
  'segmentation-validation': {
    label: 'Validar segmentacion actual',
    supporting: 'Cruces entre zonas, reglas heredadas y rollback antes de produccion.',
    service: 'ciberseguridad',
  },
  'identity-exposure-review': {
    label: 'Revisar exposicion de identidades',
    supporting: 'MFA, privilegios, sesiones y evidencia de Acceso Condicional.',
    service: 'identidad',
  },
  'endpoint-governance-check': {
    label: 'Detectar endpoints fuera de gobierno',
    supporting: 'Inventario, postura, BYOD y ownership de parcheo.',
    service: 'endpoint',
  },
  'mfa-gap-review': {
    label: 'Cerrar brecha MFA',
    supporting: 'Excepciones, proveedores, admins y protocolos heredados.',
    service: 'identidad',
  },
  'remote-access-review': {
    label: 'Evaluar acceso remoto',
    supporting: 'VPN, dispositivo, MFA y trazabilidad antes de ampliar acceso.',
    service: 'ciberseguridad',
  },
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
