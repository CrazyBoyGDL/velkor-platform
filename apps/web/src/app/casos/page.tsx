'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const CASES = [
  {
    client: 'Distribuidora Industrial del Norte',
    sector: 'Manufactura',
    year: '2024',
    challenge: 'Red plana sin segmentación, 3 brechas de seguridad en 6 meses con activos expuestos.',
    solution: 'Rediseño LAN/WAN completo con VLANs, firewall Fortinet FG-100F y monitoreo NOC activo.',
    result: '0 incidentes',
    resultSub: 'en 14 meses',
    hex: '#3b82f6',
    tags: ['Redes', 'Fortinet', 'VLAN', 'NOC'],
  },
  {
    client: 'Corporativo Médico Especialidades',
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
    client: 'Cadena de Retail · 8 sucursales',
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

export default function CasosPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-16">
          <span className="label">Casos de éxito</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight">
            Resultados reales,<br />
            <span className="text-gradient-amber">métricas documentadas</span>
          </h1>
          <p className="text-zinc-500 max-w-xl">
            Proyectos con KPIs comprometidos antes de empezar y verificados al cierre.
          </p>
        </motion.div>

        {/* Cases */}
        <div className="space-y-5">
          {CASES.map(({ client, sector, year, challenge, solution, result, resultSub, hex, tags }, i) => (
            <motion.div
              key={client}
              {...fadeUp(i * 0.1)}
              className="card p-0 overflow-hidden hover:border-zinc-700 transition-all duration-300"
              style={{ borderLeftColor: hex, borderLeftWidth: 3 }}
            >
              {/* Card header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <h3 className="text-noc-white font-semibold text-[15px]">{client}</h3>
                  <span
                    className="badge text-[10px] font-mono"
                    style={{ color: hex, backgroundColor: hex + '20' }}
                  >
                    {sector}
                  </span>
                </div>
                <span className="label text-[10px] text-zinc-700 flex-shrink-0">{year}</span>
              </div>

              {/* Card body */}
              <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-0">
                <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r border-surface-border">
                  <div className="label text-[10px] mb-2">Desafío</div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{challenge}</p>
                </div>
                <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r border-surface-border">
                  <div className="label text-[10px] mb-2">Solución implementada</div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{solution}</p>
                </div>
                {/* Result callout */}
                <div className="px-6 py-5 flex flex-col items-center justify-center text-center min-w-[140px]">
                  <div className="text-3xl font-black font-mono" style={{ color: hex }}>
                    {result}
                  </div>
                  <div className="text-zinc-600 text-xs mt-1">{resultSub}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="px-6 py-3 border-t border-surface-border flex flex-wrap gap-2">
                {tags.map(t => (
                  <span key={t} className="text-[10px] font-mono text-zinc-600 bg-surface-raised px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div {...fadeUp(0.3)} className="mt-16 card p-10 text-center border-amber/20">
          <div className="text-4xl font-black text-amber mb-2">+50</div>
          <div className="text-zinc-400 text-sm mb-6">proyectos exitosos desde 2018</div>
          <Link href="/assessments" className="btn-amber px-10 py-4 text-[15px]">
            Quiero resultados similares →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
