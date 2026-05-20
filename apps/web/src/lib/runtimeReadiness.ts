const REQUIRED = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SITE_DOMAIN',
  'STRAPI_URL',
] as const

const RECOMMENDED = [
  'RESEND_API_KEY',
  'ASSESSMENT_WEBHOOK_URL',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  'TURNSTILE_SECRET_KEY',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
] as const

export function getRuntimeReadiness() {
  const production = process.env.NODE_ENV === 'production'
  const missingRequired = production ? REQUIRED.filter(key => !process.env[key]) : []
  const missingRecommended = RECOMMENDED.filter(key => !process.env[key])
  const turnstilePartial =
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) !== Boolean(process.env.TURNSTILE_SECRET_KEY)

  return {
    ok: missingRequired.length === 0 && !turnstilePartial,
    state: missingRequired.length > 0 || turnstilePartial ? 'blocked' : missingRecommended.length > 0 ? 'degraded' : 'ready',
    missingRequired,
    missingRecommended,
    turnstilePartial,
  }
}
