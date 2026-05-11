'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import NOCDashboard from '@/components/NOCDashboard'

// Load canvas animation only on client (no SSR)
const NetworkBg = dynamic(() => import('@/components/NetworkBg'), { ssr: false })

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

// ─── DATA ────────────────────────────────────────────────────────────────────
const STATS = [
  { val: 50,   suf: '+', label: 'Clientes activos',     sub: 'Pymes y corporativos', color: 'text-amber' },
  { val: 99.9, suf: '%', label: 'Uptime garantizado',   sub: 'SLA documentado',      color: 'text-noc-green' },
  { val: 4,    suf: 'h', label: 'Tiempo de respuesta',  sub: 'Incidentes críticos',  color: 'text-noc-blue', prefix: '<' },
  { val: 8,    suf: '',  label: 'Años de experiencia',  sub: 'Desde 2018',           color: 'text-noc-cyan' },
]

const SERVICES = [
  { icon: '⬡', title: 'Redes & Conectividad',   desc: 'LAN/WAN, firewall Fortinet, SD-WAN y Wi-Fi corporativo.',        color: 'text-noc-blue',  accent: 'border-l-noc-blue',  card: 'card-blue'  },
  { icon: '◉', title: 'CCTV & Videovigilancia', desc: 'Sistemas IP Axis, NVR centralizado y analítica de video IA.',    color: 'text-noc-cyan',  accent: 'border-l-noc-cyan',  card: 'card-cyan'  },
  { icon: '⬢', title: 'Microsoft 365 & Cloud',  desc: 'Tenant setup, Exchange, Teams, SharePoint y gestión de lic.',   color: 'text-noc-blue',  accent: 'border-l-noc-blue',  card: 'card-blue'  },
  { icon: '⬟', title: 'Intune & Entra ID',       desc: 'MDM, acceso condicional, MFA y gobernanza de identidades.',     color: 'text-noc-green', accent: 'border-l-noc-green', card: 'card-green' },
  { icon: '◈', title: 'Monitoreo NOC 24/7',      desc: 'Dashboard en tiempo real, alertas y SLA documentado.',          color: 'text-amber',     accent: 'border-l-amber',     card: 'card-amber' },
  { icon: '◇', title: 'Diagnóstico & Cotización',desc: 'Auditoría técnica y propuesta detallada en 24 horas.',          color: 'text-noc-cyan',  accent: 'border-l-noc-cyan',  card: 'card-cyan'  },
]

const STEPS = [
  {
    n: '01', color: 'text-amber', bg: 'bg-amber/10 border-amber/30',
    title: 'Diagnóstico',
    desc: 'Evaluamos tu infraestructura actual: redes, identidades, dispositivos y seguridad. Entregamos un informe técnico en 24 h.',
  },
  {
    n: '02', color: 'text-noc-blue', bg: 'bg-noc-blue/10 border-noc-blue/30',
    title: 'Propuesta',
    desc: 'Diseñamos un plan de trabajo con alcance, tecnologías recomendadas, cronograma y cotización detallada sin letra pequeña.',
  },
  {
    n: '03', color: 'text-noc-green', bg: 'bg-noc-green/10 border-noc-green/30',
    title: 'Implementación',
    desc: 'Ejecutamos con ingenieros certificados, documentamos cada cambio y transferimos conocimiento a tu equipo interno.',
  },
]

const PARTNERS = [
  { name: 'Fortinet NSE4', dot: '#ef4444' },
  { name: 'Microsoft Gold', dot: '#3b82f6' },
  { name: 'Cisco CCNA',    dot: '#3b82f6' },
  { name: 'Axis ACSR',     dot: '#22c55e' },
  { name: 'CompTIA Sec+',  dot: '#f59e0b' },
]

// ─── Scroll-triggered animated counter ───────────────────────────────────────
function Counter({ val, suf, prefix = '' }: { val: number; suf: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const ran = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !ran.current) {
        ran.current = true
        const dur = 1400
        const start = Date.now()
        const end = typeof val === 'number' && val % 1 !== 0 ? val : Math.round(val)
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCount(parseFloat((eased * end).toFixed(val % 1 !== 0 ? 1 : 0)))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [val])

  return (
    <div ref={ref} className="font-mono font-extrabold tabular-nums">
      {prefix}{count}{suf}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-100px)] flex items-center overflow-hidden"
      >
        {/* Canvas network animation (parallax bg) */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <NetworkBg />
          {/* Amber glow at top center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                          bg-[radial-gradient(ellipse,rgba(245,158,11,0.08)_0%,transparent_70%)]" />
          {/* Bottom fade to black */}
          <div className="absolute bottom-0 left-0 right-0 h-32
                          bg-gradient-to-t from-surface-dark to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative max-w-7xl mx-auto px-4 sm:px-8 w-full
                     grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16"
        >
          {/* ─ Left copy ─ */}
          <div>
            <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-7">
              <div className="w-8 h-px bg-amber" />
              <span className="label text-amber/80 tracking-[0.22em]">CONSULTORÍA TECNOLÓGICA EMPRESARIAL</span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-[clamp(2.6rem,6vw,4.2rem)] font-black leading-[1.04] tracking-tight mb-6"
            >
              Tu operación,<br />
              sin puntos<br />
              <span className="text-gradient-amber">de falla.</span>
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="text-zinc-400 text-lg leading-relaxed max-w-md mb-9">
              Redes, ciberseguridad y Modern Workplace para empresas que no pueden permitirse interrupciones.
            </motion.p>

            <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/assessments" className="btn-amber text-[15px] px-8 py-4">
                Solicitar diagnóstico gratuito
              </Link>
              <Link href="/services" className="btn-ghost text-[15px] px-8 py-4">
                Ver servicios →
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div {...fadeUp(0.28)} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  ['JM', '#f59e0b'], ['KR', '#3b82f6'], ['AL', '#22c55e'], ['PR', '#06b6d4'],
                ].map(([initials, color]) => (
                  <div
                    key={initials}
                    className="w-8 h-8 rounded-full border-2 border-surface-dark flex items-center justify-center text-[10px] font-bold"
                    style={{ background: color + '22', color }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-zinc-500 text-sm">
                <span className="text-zinc-200 font-semibold">+50 empresas</span> confían en Velkor
              </p>
            </motion.div>
          </div>

          {/* ─ Right: NOC Dashboard ─ */}
          <motion.div
            initial={{ opacity: 0, x: 32, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
          >
            <NOCDashboard />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PARTNERS
      ══════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-5 bg-surface-dark/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-8 overflow-x-auto scrollbar-none">
          <span className="label text-[10px] flex-shrink-0">PARTNERS /</span>
          <div className="flex items-center gap-10 flex-shrink-0">
            {PARTNERS.map(({ name, dot }) => (
              <div key={name} className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity cursor-default flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                <span className="text-zinc-400 text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════
          STATS  (scroll-triggered counters)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map(({ val, suf, label, sub, color, prefix }, i) => (
              <motion.div
                key={label}
                {...fadeUp(i * 0.07)}
                className="card p-5 sm:p-6 group hover:border-zinc-700 transition-colors"
              >
                <div className={`text-4xl sm:text-5xl font-black ${color} mb-1 leading-none`}>
                  <Counter val={val} suf={suf} prefix={prefix} />
                </div>
                <div className="text-zinc-300 text-sm font-semibold mt-1">{label}</div>
                <div className="text-zinc-600 text-xs mt-0.5">{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <motion.span {...fadeUp(0)} className="label block mb-3">Lo que hacemos</motion.span>
              <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-black text-noc-white leading-tight">
                Infraestructura IT<br />
                <span className="text-gradient-white">de principio a fin</span>
              </motion.h2>
            </div>
            <motion.div {...fadeUp(0.1)}>
              <Link href="/services" className="btn-ghost text-sm whitespace-nowrap">
                Catálogo completo →
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICES.map(({ icon, title, desc, color, card }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.05)}
                className={`${card} p-6 rounded-xl border border-l-4 transition-all duration-300 group cursor-default`}
                style={{ borderLeftColor: 'currentColor' }}
              >
                <div className={`text-2xl mb-4 ${color} font-mono leading-none`}>{icon}</div>
                <h3 className="text-noc-white font-semibold text-[15px] mb-2 group-hover:text-white transition-colors">
                  {title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                <div className={`mt-4 text-[11px] font-mono ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  VER MÁS →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PROCESS — Cómo funciona
      ══════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-20 px-4 sm:px-8 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.span {...fadeUp(0)} className="label block mb-3">Proceso</motion.span>
            <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-black text-noc-white">
              Cómo trabajamos
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-zinc-500 mt-3 max-w-md mx-auto">
              Desde el primer contacto hasta la operación continua, en tres pasos claros.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px bg-gradient-to-r from-amber/30 via-noc-blue/30 to-noc-green/30" />

            {STEPS.map(({ n, color, bg, title, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.1)} className="card p-6 hover:border-zinc-700 transition-colors relative">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${bg} ${color} font-mono font-bold text-sm mb-5`}>
                  {n}
                </div>
                <h3 className="text-noc-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-24 px-4 sm:px-8 relative overflow-hidden">
        {/* Amber ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.06)_0%,transparent_70%)]" />
        </div>

        <motion.div {...fadeUp(0)} className="relative max-w-2xl mx-auto text-center">
          <span className="label block mb-4">¿Listo para empezar?</span>
          <h2 className="text-4xl sm:text-5xl font-black text-noc-white mb-4 leading-tight">
            Diagnóstico gratuito<br />
            <span className="text-gradient-amber">en 24 horas</span>
          </h2>
          <p className="text-zinc-500 mb-10 leading-relaxed max-w-lg mx-auto">
            Nuestros ingenieros evalúan tu infraestructura y entregan un informe técnico con recomendaciones y costos. Sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessments" className="btn-amber text-[15px] px-10 py-4">
              Solicitar diagnóstico →
            </Link>
            <Link href="/casos" className="btn-ghost text-[15px] px-10 py-4">
              Ver casos de éxito
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {[
              { dot: 'bg-noc-green', text: 'Respuesta < 24 h' },
              { dot: 'bg-amber',     text: 'Sin compromiso inicial' },
              { dot: 'bg-noc-blue',  text: 'Ingenieros certificados' },
            ].map(({ dot, text }) => (
              <div key={text} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                <span className="text-zinc-500 text-xs">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}
