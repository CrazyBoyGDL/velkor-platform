// ─── Velkor Platform Configuration ───────────────────────────────────────────
// Domain abstraction layer for production migration readiness.
// All canonical URLs, contact details, and trust-signal strings are
// sourced from here — never hardcoded across pages.
//
// To migrate to a new domain:
//   1. Set NEXT_PUBLIC_SITE_URL (e.g. "https://velkor.mx")
//   2. Set NEXT_PUBLIC_SITE_DOMAIN (e.g. "velkor.mx")
//   3. Redeploy — all canonicals, og:url, and mailto links update automatically.

// ─── Domain ───────────────────────────────────────────────────────────────────

export const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL    ?? 'https://velkor.mx'
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'velkor.mx'

/** Canonical URL helper — always produces an absolute URL */
export function canonical(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${clean}`
}

// ─── Company identity ─────────────────────────────────────────────────────────

export const COMPANY = {
  name:          'Velkor System',
  legalName:     'Velkor System',
  tagline:       'Consultoría tecnológica empresarial',
  description:   'Redes, ciberseguridad e identidad digital para empresas que necesitan operar sin improvisar cambios críticos.',
  country:       'México',
  region:        'Monterrey, Nuevo León',
  founded:       '2022',
  fieldExperienceSince: '2016',
  version:       'v2.2',
} as const

// ─── Contact ──────────────────────────────────────────────────────────────────

export const CONTACT = {
  /** General / sales inquiries */
  email:         `contacto@${SITE_DOMAIN}`,
  /** Technical / support */
  emailSupport:  `soporte@${SITE_DOMAIN}`,
  /** Automated (email notifications, no-reply) */
  emailNoReply:  `noreply@${SITE_DOMAIN}`,
  /** Assessment report sender */
  emailReports:  `reportes@${SITE_DOMAIN}`,
  /** WhatsApp (optional — set env var to activate) */
  whatsapp:      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  /** LinkedIn company page */
  linkedin:      process.env.NEXT_PUBLIC_LINKEDIN_URL ?? null,
} as const

// ─── Legal & Privacy ──────────────────────────────────────────────────────────

export const LEGAL = {
  privacyPolicyUrl:  '/legal/privacidad',
  termsOfServiceUrl: '/legal/terminos',
  cookiePolicyUrl:   '/legal/cookies',
  /** RFC (Registro Federal de Contribuyentes) — set when available */
  rfc:               process.env.NEXT_PUBLIC_RFC ?? null,
} as const

// ─── Trust signals ────────────────────────────────────────────────────────────

export const TRUST = {
  certifications: [
    'Implementación Microsoft 365 / Entra ID',
    'Operación FortiGate / redes multi-sede',
    'Diseño CCTV IP Axis / Hikvision',
  ],
  technologies: [
    { label: 'Fortinet FortiGate', color: '#4878b0' },
    { label: 'Microsoft 365',      color: '#3a7858' },
    { label: 'Axis · Hikvision',   color: '#3d88a5' },
    { label: 'Entra ID · Intune',  color: '#4878b0' },
  ],
  serviceRegions: [
    'Monterrey y Área Metropolitana',
    'Ciudad de México',
    'Guadalajara',
    'Nacional con ingenieros remotos',
  ],
  engagementModels: [
    'Diagnóstico técnico puntual',
    'Implementación por fases',
    'Acompañamiento mensual operativo',
  ],
  serviceBoundaries: [
    'No forzamos compra de hardware cuando el riesgo se corrige con configuración',
    'No tocamos producción sin ventana, rollback y responsable aprobado',
    'No prometemos SLA enterprise sin alcance operativo firmado',
  ],
  secureCommunications: [
    'NDA disponible para evidencia completa',
    'Intercambio de credenciales por canal seguro acordado',
    'Responsable técnico asignado durante implementación',
  ],
  responsibleDisclosure: {
    href: '/contacto',
    label: 'Canal responsable para reportar hallazgos de seguridad',
  },
} as const

// ─── Enterprise readiness ───────────────────────────────────────────────────

export const ENTERPRISE_READINESS = {
  domainStatus: 'prepared-not-finalized',
  canonicalSource: 'NEXT_PUBLIC_SITE_URL',
  cloudflare: {
    recommended: true,
    plannedControls: ['DNS', 'WAF', 'Turnstile', 'cache-rules', 'security-headers'],
  },
  email: {
    operationalSenders: [CONTACT.emailNoReply, CONTACT.emailReports, CONTACT.emailSupport],
    requiredRecords: ['SPF', 'DKIM', 'DMARC'],
  },
  legal: {
    requiredPages: [LEGAL.privacyPolicyUrl, LEGAL.termsOfServiceUrl],
    cookiePolicyPrepared: LEGAL.cookiePolicyUrl,
  },
} as const

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS = {
  servicios: [
    { label: 'Redes empresariales',   href: '/servicios' },
    { label: 'Ciberseguridad',         href: '/servicios/ciberseguridad' },
    { label: 'Identidad & Acceso',     href: '/servicios/identidad-acceso' },
    { label: 'CCTV & Vigilancia',      href: '/servicios/videovigilancia' },
  ],
  framework: [
    { label: 'Metodología',            href: '/framework' },
    { label: 'Framework operacional',  href: '/framework/operational-framework' },
    { label: 'Evidencia técnica',      href: '/framework/evidence' },
    { label: 'Motor de contenido',     href: '/framework/content-engine' },
  ],
  empresa: [
    { label: 'Casos técnicos',         href: '/casos' },
    { label: 'Nosotros',               href: '/nosotros' },
    { label: 'Blog técnico',           href: '/blog' },
    { label: 'Evaluación técnica',     href: '/assessments' },
  ],
  legal: [
    { label: 'Aviso de privacidad',    href: '/legal/privacidad' },
    { label: 'Términos de servicio',   href: '/legal/terminos' },
    { label: 'Contacto',               href: '/contacto' },
  ],
} as const

// ─── Structured data helpers ──────────────────────────────────────────────────

/** JSON-LD Organization schema — use in root layout or home page */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:       COMPANY.name,
    url:        SITE_URL,
    logo:       `${SITE_URL}/logo.png`,
    description: COMPANY.description,
    contactPoint: {
      '@type':       'ContactPoint',
      contactType:   'customer service',
      email:         CONTACT.email,
      availableLanguage: ['Spanish'],
    },
    areaServed: {
      '@type': 'Country',
      name:    'Mexico',
    },
  }
}
