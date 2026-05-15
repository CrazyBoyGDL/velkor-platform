import HomeLanding, { type FeaturedCaseSummary } from '@/components/HomeLanding'
import { asJsonArray } from '@/lib/contentEngine'
import { strapi } from '@/lib/strapi'

export const revalidate = 3600

type StrapiFeaturedCase = {
  data?: Array<{
    attributes?: {
      client?: string
      sector?: string
      industry?: string
      challenge?: string
      solution?: string
      result?: string
      resultSub?: string
      outcomes?: unknown
    }
  }>
}

type StrapiOutcome = {
  metric?: string
  detail?: string
  title?: string
  label?: string
  description?: string
}

const FALLBACK_FEATURED_CASE: FeaturedCaseSummary = {
  sector: 'Industrial multi-sede',
  title: 'Segmentación y acceso remoto sin detener operación',
  summary:
    'El entorno tenía firewall en producción, reglas heredadas y cuentas compartidas por turno. Se documentó topología, se retiraron reglas abiertas por prioridad y se activó MFA antes de ampliar VPN.',
  outcomes: [
    '3 sedes revisadas antes del cambio',
    '47 reglas heredadas clasificadas',
    'Excepción ERP con responsable y fecha de retiro',
  ],
  href: '/casos',
}

function cleanText(value?: string | null): string {
  return value?.trim() ?? ''
}

function outcomeToText(outcome: StrapiOutcome | string): string {
  if (typeof outcome === 'string') return cleanText(outcome)

  const primary = cleanText(outcome.metric) || cleanText(outcome.title) || cleanText(outcome.label)
  const detail = cleanText(outcome.detail) || cleanText(outcome.description)

  return [primary, detail].filter(Boolean).join(' · ')
}

async function getFeaturedCase(): Promise<FeaturedCaseSummary> {
  const data = await strapi.get<StrapiFeaturedCase>(
    '/casos?sort=publishedAt:desc&pagination[limit]=1&publicationState=live',
    3600
  )

  const attributes = data?.data?.[0]?.attributes
  if (!attributes) return FALLBACK_FEATURED_CASE

  const outcomes = asJsonArray<StrapiOutcome | string>(attributes.outcomes)
    .map(outcomeToText)
    .filter(Boolean)
    .slice(0, 3)

  const resultOutcome = [cleanText(attributes.result), cleanText(attributes.resultSub)]
    .filter(Boolean)
    .join(' · ')

  const resolvedOutcomes = outcomes.length
    ? outcomes
    : resultOutcome
      ? [resultOutcome]
      : FALLBACK_FEATURED_CASE.outcomes

  return {
    sector: cleanText(attributes.industry) || cleanText(attributes.sector) || FALLBACK_FEATURED_CASE.sector,
    title: cleanText(attributes.client) || FALLBACK_FEATURED_CASE.title,
    summary:
      cleanText(attributes.challenge) ||
      cleanText(attributes.solution) ||
      FALLBACK_FEATURED_CASE.summary,
    outcomes: resolvedOutcomes,
    href: '/casos',
  }
}

export default async function HomePage() {
  const featuredCase = await getFeaturedCase()

  return <HomeLanding featuredCase={featuredCase} />
}
