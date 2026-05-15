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
  description:   'Redes, ciberseguridad e identidad digital para empresas que no pueden permitirse interrupciones operacionales.',
  country:       'México',
  region:        'Monterrey, Nuevo León',
  founded:       '2022',
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
    'Microsoft Solutions Partner',
    'Fortinet NSE Partner',
    'Axis Communications Partner',
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
    { label: 'Casos de éxito',         href: '/casos' },
    { label: 'Nosotros',               href: '/nosotros' },
    { label: 'Blog técnico',           href: '/blog' },
    { label: 'Diagnóstico gratuito',   href: '/assessments' },
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
