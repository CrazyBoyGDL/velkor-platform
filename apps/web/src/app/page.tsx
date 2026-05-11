'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import NOCDashboard from '@/components/NOCDashboard'

// ─── Fade-up animation preset ───────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

// ─── Data ────────────────────────────────────────────────────────────────────
const PARTNERS = ['Fortinet NSE4', 'Microsoft Gold', 'Cisco CCNA', 'Axis ACSR', 'CompTIA Sec+']

const STATS = [
  { value: '50+',   label: 'Clientes activos',       sub: 'Pymes y corporativos' },
  { value: '99.9%', label: 'Uptime garantizado',      sub: 'SLA documentado' },
  { value: '< 4h',  label: 'Tiempo de respuesta',     sub: 'Incidentes críticos' },
  { value: '8',     label: 'Años de experiencia',     sub: 'Desde 2018' },
]

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    title: 'Redes & Conectividad',
    desc: 'LAN/WAN, firewall, SD-WAN y Wi-Fi corporativo gestionado.',
    color: 'text-noc-blue',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
    title: 'CCTV & Vigilancia',
    desc: 'Sistemas IP, analítica de video IA y monitoreo remoto 24/7.',
    color: 'text-noc-cyan',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    title: 'Microsoft 365 & Cloud',
    desc: 'Tenant setup, Exchange Online, Teams, SharePoint y licencias.',
    color: 'text-noc-blue',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Intune & Entra ID',
    desc: 'MDM, acceso condicional, MFA y gestión de identidades.',
    color: 'text-noc-green',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: 'Monitoreo NOC',
    desc: 'Alertas en tiempo real, dashboards y SLA documentado.',
    color: 'text-amber',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Diagnóstico & Cotización',
    desc: 'Auditoría técnica in-situ y propuesta detallada en 24 h.',
    color: 'text-noc-cyan',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpac = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-100px)] flex items-center overflow-hidden">

        {/* Parallax bg layer */}
        <motion.div
          style={{ y: heroY, opacity: heroOpac }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Amber glow blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-hero-glow opacity-60" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16">

          {/* Left: Copy */}
          <div>
            <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-6">
              <div className="w-6 h-px bg-amber" />
              <span className="label text-[11px] tracking-[0.25em]">CONSULTORÍA TECNOLÓGICA EMPRESARIAL</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6">
              Tu operación,<br />
              sin puntos<br />
              <span className="text-amber">de falla.</span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-zinc-400 text-lg leading-relaxed max-w-md mb-10">
              Redes, ciberseguridad y Modern Workplace para empresas que no pueden permitirse interrupciones.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/assessments" className="btn-amber text-[15px] px-8 py-3.5 text-center">
                Solicitar diagnóstico gratuito
              </Link>
              <Link href="/services" className="btn-ghost text-[15px] px-8 py-3.5 text-center">
                Ver servicios →
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div {...fadeUp(0.4)} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#3b82f6','#22c55e','#f59e0b','#ef4444'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-surface-dark flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: c + '33', color: c }}
                  >
                    {['JM','KR','AL','PG'][i]}
                  </div>
                ))}
              </div>
              <span className="text-zinc-500 text-sm">
                <span className="text-zinc-300 font-semibold">+50 empresas</span> confían en Velkor
              </span>
            </motion.div>
          </div>

          {/* Right: NOC Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="animation-float"
          >
            <NOCDashboard />
          </motion.div>
        </div>
      </section>

      {/* ── PARTNERS ──────────────────────────────────────────────────── */}
      <section className="border-y border-surface-border bg-surface-dark/60 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-8 sm:gap-16">
          <span className="label text-[10px] flex-shrink-0 hidden sm:block">PARTNERS /</span>
          <div className="flex items-center gap-8 sm:gap-14 overflow-x-auto scrollbar-none pb-1">
            {PARTNERS.map(p => (
              <span key={p} className="text-zinc-600 hover:text-zinc-400 text-sm font-medium tracking-wide flex-shrink-0 transition-colors cursor-default">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map(({ value, label, sub }, i) => (
            <motion.div key={label} {...fadeUp(i * 0.08)} className="text-center sm:text-left">
              <div className="text-4xl sm:text-5xl font-extrabold text-noc-white font-mono tracking-tight mb-1">
                {value}
              </div>
              <div className="text-zinc-300 text-sm font-semibold">{label}</div>
              <div className="text-zinc-600 text-xs mt-0.5">{sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 border-t border-surface-border">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-12">
            <span className="label">Lo que hacemos</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-noc-white mt-3">
              Servicios de infraestructura IT
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(({ icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.06)}
                className="noc-card group cursor-default"
              >
                <div className={`${color} mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}>
                  {icon}
                </div>
                <h3 className="text-noc-white font-semibold text-[15px] mb-1.5">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} className="mt-10 flex justify-center sm:justify-start">
            <Link href="/services" className="btn-ghost text-sm">
              Ver catálogo completo →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BOTTOM ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 border-t border-surface-border">
        <motion.div {...fadeUp(0)} className="max-w-2xl mx-auto text-center">
          <span className="label mb-4 block">¿Listo para empezar?</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-noc-white mb-4">
            Diagnóstico gratuito de tu infraestructura
          </h2>
          <p className="text-zinc-500 mb-8 leading-relaxed">
            Nuestros ingenieros evalúan tu infraestructura actual y entregan un informe técnico detallado con recomendaciones y costos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessments" className="btn-amber text-[15px] px-10 py-4 shadow-amber">
              Solicitar diagnóstico →
            </Link>
            <Link href="/services" className="btn-ghost text-[15px] px-10 py-4">
              Ver servicios
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  )
}
