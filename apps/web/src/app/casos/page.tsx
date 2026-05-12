import type { Metadata } from 'next'
import { strapi } from '@/lib/strapi'
import CasosContent, { type CaseStudy } from '@/components/CasosContent'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Casos de Éxito | Resultados IT Documentados',
  description:
    'Proyectos reales de infraestructura IT: redes Fortinet, identidad Microsoft 365 e Intune, y videovigilancia IP con métricas documentadas y KPIs verificados.',
  alternates: { canonical: 'https://velkor.mx/casos' },
  openGraph: {
    title: 'Casos de Éxito | Velkor',
    description: 'Proyectos reales con métricas documentadas: redes, identidad y videovigilancia.',
  },
}

// ── Strapi response types (v4 format) ────────────────────────────────────────
type StrapiCase = {
  id: number
  attributes: {
    client: string
    sector: string
    year: string
    challenge: string
    solution: string
    result: string
    resultSub: string
    hex: string
    tags: string[] | null
    publishedAt: string
  }
}

// ── Fallback data (shown when Strapi is unreachable) ─────────────────────────
const FALLBACK_CASES: CaseStudy[] = [
  {
    client: 'Empresa distribuidora · Monterrey · 200 empleados',
    sector: 'Manufactura',
    year: '2024',
    challenge: 'Red plana sin segmentación, 3 brechas de seguridad en 6 meses con activos expuestos.',
    solution: 'Rediseño LAN/WAN completo con VLANs, firewall Fortinet FG-100F y soporte activo de red.',
    result: '0 incidentes',
    resultSub: 'en 14 meses',
    hex: '#3b82f6',
    tags: ['Redes', 'Fortinet', 'VLAN', 'Soporte'],
  },
  {
    client: 'Corporativo médico · CDMX · 62 usuarios',
    sector: 'Salud',
    year: '2025',
    challenge: 'Sin MFA, 62 usuarios con acceso irrestricto a expedientes de pacientes.',
    solution: 'Entra ID + Intune + Acceso Condicional + DLP para datos sensibles de salud.',
    result: 'NOM-024',
    resultSub: 'en 6 semanas',
    hex: '#22c55e',
    tags: ['Entra ID', 'Intune', 'Compliance', 'DLP'],
  },
  {
    client: 'Cadena de retail · Guadalajara · 8 sucursales',
    sector: 'Retail',
    year: '2025',
    challenge: 'CCTV analógico obsoleto, cero visibilidad remota y pérdidas mensuales por robo.',
    solution: '96 cámaras IP Axis, NVR centralizado y analítica de comportamiento con IA.',
    result: '-34% robos',
    resultSub: 'primer trimestre',
    hex: '#f59e0b',
    tags: ['CCTV', 'Axis', 'IA Analytics', 'NVR'],
  },
]

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getCasos(): Promise<CaseStudy[]> {
  const data = await strapi.get<{ data: StrapiCase[] }>(
    '/casos?sort=publishedAt:desc&pagination[limit]=20&publicationState=live',
    3600
  )

  if (!data?.data?.length) return FALLBACK_CASES

  return data.data.map(({ attributes: a }) => ({
    client:    a.client    ?? '',
    sector:    a.sector    ?? '',
    year:      a.year      ?? '',
    challenge: a.challenge ?? '',
    solution:  a.solution  ?? '',
    result:    a.result    ?? '',
    resultSub: a.resultSub ?? '',
    hex:       a.hex       || '#f59e0b',
    tags:      Array.isArray(a.tags) ? a.tags : [],
  }))
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function CasosPage() {
  const cases = await getCasos()

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <span className="label">Casos de éxito</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight">
            Resultados reales,<br />
            <span className="text-gradient-amber">métricas documentadas</span>
          </h1>
          <p className="text-zinc-500 max-w-xl">
            Proyectos con KPIs comprometidos antes de empezar y verificados al cierre.
          </p>
        </div>

        <CasosContent cases={cases} />
      </div>
    </div>
  )
}
