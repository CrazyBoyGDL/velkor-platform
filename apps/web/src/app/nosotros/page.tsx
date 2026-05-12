'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const STATS = [
  { val: '2016',  label: 'Año de fundación',       color: '#f59e0b' },
  { val: '50+',   label: 'Clientes activos',        color: '#22c55e' },
  { val: '24/7',  label: 'Monitoreo activo',        color: '#3b82f6' },
  { val: '<4 h',  label: 'Respuesta en incidentes', color: '#06b6d4' },
]

const VALUES = [
  {
    color: '#f59e0b',
    title: 'Respuesta inmediata',
    desc: 'SLA documentado de menos de 4 horas para incidentes críticos. Centro NOC activo las 24 horas, los 365 días del año.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    color: '#3b82f6',
    title: 'Seguridad por diseño',
    desc: 'Cada implementación sigue el principio de least privilege y el modelo Zero Trust. Seguridad integrada desde la arquitectura.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.563 2 12.162 2 7a11.8 11.8 0 01.104-1.589.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.749z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    color: '#22c55e',
    title: 'Transparencia total',
    desc: 'Dashboards en tiempo real con acceso del cliente, reportes mensuales con métricas y visibilidad completa del estado de tu infraestructura.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
      </svg>
    ),
  },
  {
    color: '#06b6d4',
    title: 'Resultados medibles',
    desc: 'Comprometemos KPIs antes de firmar. Cada proyecto tiene métricas de éxito definidas, medidas y documentadas al cierre.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V1.75A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM3 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H3.75A.75.75 0 013 8zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 8zm-6.828 2.172a.75.75 0 010 1.06L6.11 12.294a.75.75 0 01-1.06-1.06l1.06-1.062a.75.75 0 011.06 0zm3.656 0a.75.75 0 011.06 0l1.062 1.06a.75.75 0 11-1.061 1.062l-1.06-1.061a.75.75 0 010-1.061zM10 11a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
      </svg>
    ),
  },
]

const CERTS = [
  { label: 'Fortinet NSE4', color: '#ef4444' },
  { label: 'Microsoft Partner',       color: '#3b82f6' },
  { label: 'Cisco CCNA', color: '#3b82f6' },
  { label: 'Axis ACSR', color: '#22c55e' },
  { label: 'CompTIA Security+', color: '#f59e0b' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

export default function NosotrosPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-12">
          <span className="label">Quiénes somos</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-6 leading-tight">
            El equipo detrás<br />
            <span className="text-gradient-amber">de Velkor</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            Desde 2018 operamos como el departamento de IT externo para más de 50 empresas. Combinamos expertise técnico certificado con respuesta operacional real, no solo consultoría.
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {STATS.map(({ val, label, color }) => (
            <div key={label} className="card p-5 text-center hover:border-zinc-700 transition-colors">
              <div className="text-3xl font-black font-mono mb-1" style={{ color }}>{val}</div>
              <div className="text-zinc-600 text-xs">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div {...fadeUp(0.15)} className="mb-4">
          <span className="label block mb-6">Nuestros valores</span>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {VALUES.map(({ color, title, desc, icon }, i) => (
            <motion.div
              key={title}
              {...fadeUp(i * 0.07 + 0.18)}
              className="card p-6 hover:border-zinc-700 transition-all duration-300 group"
              style={{ borderLeftColor: color, borderLeftWidth: 3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: color + '20', color }}>
                  {icon}
                </div>
                <h3 className="text-noc-white font-semibold">{title}</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Certs */}
        <motion.div {...fadeUp(0.3)} className="mb-16">
          <span className="label block mb-5">Certificaciones</span>
          <div className="flex flex-wrap gap-3">
            {CERTS.map(({ label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-border bg-surface-card hover:border-zinc-700 transition-colors"
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-zinc-300 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.35)} className="text-center border-t border-surface-border pt-14">
          <h3 className="text-2xl font-black text-noc-white mb-3">¿Listo para trabajar juntos?</h3>
          <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
            Empieza con un diagnóstico gratuito. Sin compromiso, con resultados claros.
          </p>
          <Link href="/assessments" className="btn-amber px-10 py-4 text-[15px]">
            Solicitar diagnóstico →
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
