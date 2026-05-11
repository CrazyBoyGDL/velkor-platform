'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const POSTS = [
  {
    slug: 'zero-trust-network-2025',
    title: 'Cómo implementar Zero Trust en tu red empresarial',
    excerpt: 'Guía práctica para migrar desde seguridad perimetral hacia un modelo Zero Trust usando Entra ID e Intune en entornos híbridos.',
    category: 'Redes',
    date: '8 May 2026',
    readTime: '8 min',
    hex: '#3b82f6',
  },
  {
    slug: 'cctv-ai-analytics',
    title: 'Analítica de video IA: más allá de la vigilancia básica',
    excerpt: 'Cómo los sistemas IP modernos con IA transforman las operaciones de seguridad: detección de movimiento hasta análisis de comportamiento.',
    category: 'CCTV',
    date: '1 May 2026',
    readTime: '6 min',
    hex: '#06b6d4',
  },
  {
    slug: 'm365-conditional-access',
    title: 'Acceso Condicional en Microsoft 365: guía completa',
    excerpt: 'Configuración paso a paso de políticas de Acceso Condicional en Entra ID: MFA, cumplimiento de dispositivos y políticas basadas en riesgo.',
    category: 'Cloud',
    date: '22 Abr 2026',
    readTime: '12 min',
    hex: '#3b82f6',
  },
  {
    slug: 'intune-windows-autopilot',
    title: 'Windows Autopilot + Intune: despliegue sin intervención IT',
    excerpt: 'Configura Windows Autopilot para enrolamiento y configuración automática de dispositivos, sin que IT tenga que tocar cada equipo.',
    category: 'Intune',
    date: '15 Abr 2026',
    readTime: '10 min',
    hex: '#22c55e',
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

export default function BlogPage() {
  const [featured, ...rest] = POSTS

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <motion.div {...fadeUp(0)} className="mb-12">
          <span className="label">Conocimiento técnico</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4">
            Blog técnico
          </h1>
          <p className="text-zinc-500">
            Guías, casos de uso y buenas prácticas de nuestros ingenieros NOC.
          </p>
        </motion.div>

        {/* Featured */}
        <motion.article
          {...fadeUp(0.08)}
          className="card p-0 overflow-hidden mb-6 hover:border-zinc-700 transition-all duration-300 cursor-pointer group"
          style={{ borderLeftColor: featured.hex, borderLeftWidth: 3 }}
        >
          <div className="p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="badge text-[10px]" style={{ color: featured.hex, backgroundColor: featured.hex + '20' }}>
                {featured.category}
              </span>
              <span className="label text-[10px] text-zinc-700">ARTÍCULO DESTACADO</span>
            </div>
            <h2 className="text-noc-white font-black text-2xl sm:text-3xl mb-4 leading-tight group-hover:text-amber transition-colors">
              {featured.title}
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed mb-6 max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-600 text-xs font-mono">
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime} de lectura</span>
              </div>
              <span className="text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: featured.hex }}>
                LEER ARTÍCULO →
              </span>
            </div>
          </div>
        </motion.article>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {rest.map(({ slug, title, excerpt, category, date, readTime, hex }, i) => (
            <motion.article
              key={slug}
              {...fadeUp(i * 0.06 + 0.15)}
              className="card p-5 hover:border-zinc-700 transition-all duration-300 cursor-pointer group flex flex-col"
              style={{ borderTopColor: hex, borderTopWidth: 2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="badge text-[10px]" style={{ color: hex, backgroundColor: hex + '20' }}>
                  {category}
                </span>
                <span className="text-zinc-700 text-[10px] font-mono">{readTime}</span>
              </div>
              <h2 className="text-noc-white font-semibold text-[15px] mb-2 leading-snug group-hover:text-white transition-colors flex-1">
                {title}
              </h2>
              <p className="text-zinc-600 text-xs leading-relaxed mb-4">
                {excerpt.slice(0, 100)}…
              </p>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-border">
                <span className="text-zinc-700 text-[10px] font-mono">{date}</span>
                <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: hex }}>
                  LEER →
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div {...fadeUp(0.3)} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-border bg-surface-card">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-slow" />
            <span className="text-zinc-600 text-xs font-mono">
              Más artículos en camino · Gestionado desde Strapi CMS
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
