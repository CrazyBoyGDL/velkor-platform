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
    context?: string
    durationWeeks?: number
    challenge: string
    beforeState?: string[] | null
    solution: string
    phases?: { label: string; weeks: string }[] | null
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
    context: '85 hosts · 3 sedes · Red plana',
    durationWeeks: 4,
    challenge: 'Red plana sin segmentación, 3 brechas de seguridad en 6 meses con activos expuestos.',
    beforeState: [
      'Red plana sin segmentación VLAN',
      '47 reglas "any/any" en firewall legacy',
      '3 brechas de seguridad en 6 meses',
      'Sin visibilidad de tráfico norte-sur',
    ],
    solution: 'Rediseño LAN/WAN completo con VLANs, firewall Fortinet FG-100F y soporte activo.',
    phases: [
      { label: 'Auditoría de red + propuesta técnica', weeks: 'Sem 1' },
      { label: 'Diseño VLAN + migración FortiGate 100F', weeks: 'Sem 2–3' },
      { label: 'Hardening reglas + IPS/IDS activado', weeks: 'Sem 4' },
      { label: 'Soporte activo + documentación', weeks: 'Continuo' },
    ],
    result: '0 incidentes',
    resultSub: 'en 14 meses',
    hex: '#3b82f6',
    tags: ['Redes', 'FortiGate', 'VLAN', 'Zero Trust', 'Soporte'],
  },
  {
    client: 'Corporativo médico · CDMX · 62 usuarios',
    sector: 'Salud',
    year: '2025',
    context: '62 usuarios · 1 sede · Expedientes digitales',
    durationWeeks: 6,
    challenge: 'Sin MFA, 62 usuarios con acceso irrestricto a expedientes de pacientes.',
    beforeState: [
      'Cero MFA — acceso solo usuario/contraseña',
      '62 usuarios con acceso irrestricto a datos',
      'Sin gestión de dispositivos (0 visibilidad)',
      'Fuera de NOM-024 — expedientes en riesgo',
    ],
    solution: 'Entra ID + Intune + Acceso Condicional + DLP para datos sensibles de salud.',
    phases: [
      { label: 'Entra ID + Acceso Condicional + MFA', weeks: 'Sem 1–2' },
      { label: 'Intune MDM + Autopilot para endpoints', weeks: 'Sem 3' },
      { label: 'DLP + clasificación datos NOM-024', weeks: 'Sem 4–5' },
      { label: 'Testing, auditoría y documentación', weeks: 'Sem 6' },
    ],
    result: 'NOM-024',
    resultSub: 'en 6 semanas',
    hex: '#22c55e',
    tags: ['Entra ID', 'Intune', 'MFA', 'Compliance', 'DLP', 'NOM-024'],
  },
  {
    client: 'Cadena de retail · Guadalajara · 8 sucursales',
    sector: 'Retail',
    year: '2025',
    context: '96 cámaras · 8 sucursales · IP Axis',
    durationWeeks: 6,
    challenge: 'CCTV analógico obsoleto, cero visibilidad remota y pérdidas mensuales por robo.',
    beforeState: [
      'CCTV analógico — sin resolución remota',
      'Cero visibilidad entre sucursales',
      'Almacenamiento local sin redundancia',
      'Pérdidas por robo sin respaldo en video',
    ],
    solution: '96 cámaras IP Axis 4K, NVR centralizado y analítica de comportamiento con IA.',
    phases: [
      { label: 'Diseño topología IP + cableado fibra', weeks: 'Sem 1' },
      { label: 'Instalación 96 cámaras Axis 4K + PoE', weeks: 'Sem 2–4' },
      { label: 'NVR centralizado + analítica IA', weeks: 'Sem 5' },
      { label: 'Capacitación operadores + entrega', weeks: 'Sem 6' },
    ],
    result: '−34% robos',
    resultSub: 'primer trimestre',
    hex: '#06b6d4',
    tags: ['CCTV', 'Axis', 'NVR 4K', 'IA Analytics', 'PoE+'],
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
    client:        a.client    ?? '',
    sector:        a.sector    ?? '',
    year:          a.year      ?? '',
    context:       a.context,
    durationWeeks: a.durationWeeks,
    challenge:     a.challenge ?? '',
    beforeState:   Array.isArray(a.beforeState) ? a.beforeState : undefined,
    solution:      a.solution  ?? '',
    phases:        Array.isArray(a.phases) ? a.phases : undefined,
    result:        a.result    ?? '',
    resultSub:     a.resultSub ?? '',
    hex:           a.hex       || '#3b82f6',
    tags:          Array.isArray(a.tags) ? a.tags : [],
  }))
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function CasosPage() {
  const cases = await getCasos()

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <span className="label">Casos de éxito</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight tracking-heading">
            Proyectos reales,<br />
            <span className="text-zinc-500">métricas documentadas</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-sm leading-relaxed">
            KPIs comprometidos antes de iniciar, verificados al cierre. Datos anonimizados con referencias disponibles bajo NDA.
          </p>
        </div>

        <CasosContent cases={cases} />
      </div>
    </div>
  )
}
