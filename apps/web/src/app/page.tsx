'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import NOCDashboard from '@/components/NOCDashboard'

const NetworkBg = dynamic(() => import('@/components/NetworkBg'), { ssr: false })

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

// ─── DATA ────────────────────────────────────────────────────────────────────
const STATS = [
  { val: 50,   suf: '+',  label: 'Clientes activos',    sub: 'Pymes y corporativos',  color: '#f59e0b' },
  { val: 99.9, suf: '%',  label: 'Uptime garantizado',  sub: 'SLA documentado',       color: '#22c55e' },
  { val: 4,    suf: 'h',  label: 'Tiempo de respuesta', sub: 'Incidentes críticos',   color: '#3b82f6', prefix: '<' },
  { val: 8,    suf: ' yr',label: 'Años operando',        sub: 'Desde 2018',            color: '#06b6d4' },
]

const SERVICES = [
  { icon: '⬡', title: 'Redes & Conectividad',    desc: 'LAN/WAN, firewall Fortinet, SD-WAN y Wi-Fi corporativo con QoS.',   color: 'text-noc-blue',  card: 'card-blue',  hex: '#3b82f6' },
  { icon: '◉', title: 'CCTV & Videovigilancia',  desc: 'Sistemas IP Axis/Hikvision, NVR centralizado y analítica con IA.',  color: 'text-noc-cyan',  card: 'card-cyan',  hex: '#06b6d4' },
  { icon: '⬢', title: 'Microsoft 365 & Cloud',   desc: 'Tenant setup, Exchange Online, Teams, SharePoint y licencias.',     color: 'text-noc-blue',  card: 'card-blue',  hex: '#3b82f6' },
  { icon: '⬟', title: 'Intune & Entra ID',        desc: 'MDM, acceso condicional, MFA y gobernanza de identidades.',         color: 'text-noc-green', card: 'card-green', hex: '#22c55e' },
  { icon: '◈', title: 'Monitoreo NOC 24/7',       desc: 'Centro de operaciones, alertas en tiempo real y SLA documentado.',  color: 'text-amber',     card: 'card-amber', hex: '#f59e0b' },
  { icon: '◇', title: 'Diagnóstico & Cotización', desc: 'Auditoría técnica y propuesta personalizada en menos de 24 h.',     color: 'text-noc-cyan',  card: 'card-cyan',  hex: '#06b6d4' },
]

const STEPS = [
  { n: '01', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  title: 'Diagnóstico',      desc: 'Evaluamos tu infraestructura: redes, identidades, dispositivos y seguridad. Informe técnico en 24 h.' },
  { n: '02', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  title: 'Propuesta',        desc: 'Plan de trabajo con alcance, tecnologías, cronograma y cotización detallada. Sin letra pequeña.' },
  { n: '03', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   title: 'Implementación',   desc: 'Ingenieros certificados, documentación de cada cambio y transferencia de conocimiento a tu equipo.' },
]

const TESTIMONIALS = [
  { quote: 'Velkor rediseñó nuestra red y migró 80 usuarios a Microsoft 365 en un fin de semana. Cero interrupciones.', author: 'Carlos Méndez', role: 'Director de Operaciones · Avante', color: '#f59e0b', initials: 'CM' },
  { quote: 'Implementaron Intune y acceso condicional en 3 semanas. Ahora tenemos visibilidad total de 150 dispositivos.', author: 'Ana Ruiz', role: 'IT Manager · Salud Plus', color: '#22c55e', initials: 'AR' },
  { quote: 'El sistema CCTV con analítica IA detectó un incidente antes de que llegara seguridad. ROI en el primer mes.', author: 'Roberto Leal', role: 'Gerente General · Retail Norte', color: '#3b82f6', initials: 'RL' },
]

const DIFFERENTIATORS = [
  { icon: '⚡', label: 'SLA < 4 h', sub: 'Incidentes críticos', color: '#f59e0b' },
  { icon: '🔐', label: 'Zero Trust', sub: 'Por diseño, no por moda', color: '#3b82f6' },
  { icon: '📊', label: 'Dashboard live', sub: 'Visibilidad total 24/7', color: '#22c55e' },
  { icon: '📋', label: 'KPIs firmados', sub: 'Antes de empezar', color: '#06b6d4' },
  { icon: '🏅', label: 'NSE4 + M365', sub: 'Ingenieros certificados', color: '#f59e0b' },
  { icon: '🚫', label: 'Sin contrato mínimo', sub: 'Cancela cuando quieras', color: '#22c55e' },
]

const PARTNERS = [
  { name: 'Fortinet NSE4', dot: '#ef4444' },
  { name: 'Microsoft Gold', dot: '#3b82f6' },
  { name: 'Cisco CCNA',    dot: '#3b82f6' },
  { name: 'Axis ACSR',     dot: '#22c55e' },
  { name: 'CompTIA Sec+',  dot: '#f59e0b' },
]

// ─── Scroll-triggered counter ─────────────────────────────────────────────────
function Counter({ val, suf, prefix = '' }: { val: number; suf: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const ran = useRef(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !ran.current) {
        ran.current = true
        const dur = 1600, start = Date.now()
        const decimal = val % 1 !== 0
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCount(parseFloat((eased * val).toFixed(decimal ? 1 : 0)))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [val])

  return <div ref={ref} className="font-mono font-extrabold tabular-nums">{prefix}{count}{suf}</div>
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-14">
      <motion.span {...fadeUp(0)} className="label block mb-3">{eyebrow}</motion.span>
      <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-black text-noc-white leading-tight">{title}</motion.h2>
      {sub && <motion.p {...fadeUp(0.1)} className="text-zinc-500 mt-3 max-w-md mx-auto text-sm">{sub}</motion.p>}
    </div>
  )
}

// ─── Inline CTA strip ─────────────────────────────────────────────────────────
function CtaStrip({ text, cta, href, urgency }: { text: string; cta: string; href: string; urgency?: string }) {
  return (
    <motion.div {...fadeUp(0)} className="cta-strip">
      <div>
        <p className="text-noc-white font-semibold text-[15px]">{text}</p>
        {urgency && (
          <p className="text-amber text-xs font-mono mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-fast inline-block" />
            {urgency}
          </p>
        )}
      </div>
      <Link href={href} className="btn-amber whitespace-nowrap flex-shrink-0">
        {cta} →
      </Link>
    </motion.div>
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
      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-100px)] flex items-center overflow-hidden">

        {/* Layered backgrounds */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
          <NetworkBg />
          {/* Amber glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.09)_0%,transparent_65%)]" />
          {/* Green glow (right side — where dashboard is) */}
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(34,197,94,0.05)_0%,transparent_70%)]" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface-dark to-transparent" />
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16"
        >
          {/* Left copy */}
          <div>
            {/* NOC online pill */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-fast" />
              <span className="text-noc-green text-[11px] font-mono tracking-widest">VELKOR NOC // EN LÍNEA</span>
            </motion.div>

            <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-amber" />
              <span className="label text-amber/80 tracking-[0.22em]">CONSULTORÍA TECNOLÓGICA EMPRESARIAL</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.08)}
              className="text-[clamp(2.6rem,6vw,4.4rem)] font-black leading-[1.03] tracking-tight mb-6"
            >
              Tu operación,<br />
              sin puntos<br />
              <span className="text-gradient-amber">de falla.</span>
            </motion.h1>

            <motion.p {...fadeUp(0.14)} className="text-zinc-400 text-lg leading-relaxed max-w-md mb-8">
              Redes, ciberseguridad y Modern Workplace para empresas que no pueden permitirse interrupciones.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row gap-3 mb-5">
              <Link href="/assessments" className="btn-amber text-[15px] px-8 py-4">
                Solicitar diagnóstico gratis
              </Link>
              <Link href="/services" className="btn-ghost text-[15px] px-8 py-4">
                Ver servicios →
              </Link>
            </motion.div>

            {/* Urgency */}
            <motion.p {...fadeUp(0.24)} className="text-xs font-mono text-amber/70 flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-fast inline-block" />
              Solo 4 slots disponibles este mes · Sin contrato mínimo
            </motion.p>

            {/* Social proof avatars */}
            <motion.div {...fadeUp(0.28)} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[['JM','#f59e0b'],['KR','#3b82f6'],['AL','#22c55e'],['PR','#06b6d4']].map(([i,c]) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-dark flex items-center justify-center text-[10px] font-bold"
                    style={{ background: c + '22', color: c }}>
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-zinc-500 text-sm">
                <span className="text-zinc-200 font-semibold">+50 empresas</span> confían en Velkor
              </p>
            </motion.div>
          </div>

          {/* Right: NOC Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 32, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-[radial-gradient(ellipse,rgba(34,197,94,0.07)_0%,transparent_70%)] pointer-events-none" />
            <NOCDashboard />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PARTNERS
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-4 bg-surface-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-8 overflow-x-auto scrollbar-none">
          <span className="label flex-shrink-0">PARTNERS /</span>
          <div className="flex items-center gap-10 flex-shrink-0">
            {PARTNERS.map(({ name, dot }) => (
              <div key={name} className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity cursor-default flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                <span className="text-zinc-400 text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" />

      {/* ════════════════════════════════════════════════════════════════
          BENTO STATS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map(({ val, suf, label, sub, color, prefix }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.07)}
                className="card p-6 group overflow-hidden relative"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl opacity-5"
                  style={{ background: color }} />
                <div className="text-4xl sm:text-5xl font-black mb-1 leading-none" style={{ color }}>
                  <Counter val={val} suf={suf} prefix={prefix ?? ''} />
                </div>
                <div className="text-zinc-300 text-sm font-semibold mt-1">{label}</div>
                <div className="text-zinc-600 text-xs mt-0.5">{sub}</div>
                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-px opacity-40"
                  style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Micro CTA after stats ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <CtaStrip
          text="¿Tu empresa todavía no tiene uptime documentado ni SLA firmado?"
          cta="Ver cómo lo logramos"
          href="/casos"
          urgency="3 empresas más obtuvieron diagnóstico gratis esta semana"
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════════════════════════ */}
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
              <Link href="/services" className="btn-ghost text-sm whitespace-nowrap">Catálogo completo →</Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(({ icon, title, desc, color, card, hex }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.06)}
                className={`${card} p-6 group cursor-default`}
                style={{ borderLeftColor: hex, borderLeftWidth: 3 }}
              >
                {/* Ambient glow dot */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-5 text-lg font-mono"
                  style={{ background: hex + '18', color: hex }}>
                  {icon}
                </div>
                <h3 className="text-noc-white font-semibold text-[15px] mb-2 group-hover:text-white transition-colors">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                <div className="mt-5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] font-mono" style={{ color: hex }}>VER DETALLE</span>
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" style={{ color: hex }}>
                    <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Micro CTA after services ── */}
          <motion.div {...fadeUp(0.2)} className="mt-8">
            <CtaStrip
              text="¿No sabes qué servicio necesitas? 15 minutos con un ingeniero lo aclaran."
              cta="Diagnóstico gratuito"
              href="/assessments"
              urgency="Respondemos en menos de 2 horas en horario hábil"
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          POR QUÉ VELKOR — Differentiators grid
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-20 px-4 sm:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0f0d 100%)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(34,197,94,0.04)_0%,transparent_70%)]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <SectionHeader
            eyebrow="Por qué elegirnos"
            title={<>Sin compromisos vacíos.<br /><span className="text-gradient-green">Solo resultados firmados.</span></>}
            sub="Cada cliente tiene un SLA, KPIs medibles y acceso a su dashboard en tiempo real. No vendemos promesas."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
            {DIFFERENTIATORS.map(({ icon, label, sub, color }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)}
                className="card p-5 flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: color + '15' }}>
                  {icon}
                </div>
                <div>
                  <div className="text-zinc-200 font-semibold text-sm leading-snug">{label}</div>
                  <div className="text-zinc-600 text-xs mt-0.5">{sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.25)} className="text-center">
            <Link href="/nosotros" className="btn-ghost text-sm">
              Conocer al equipo →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PROCESS
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-20 px-4 sm:px-8" style={{ background: 'linear-gradient(180deg, #0d0d0d, #0a0a0a)' }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Proceso"
            title="Cómo trabajamos"
            sub="Desde el primer contacto hasta la operación continua, en tres pasos con fechas y entregables claros."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-[28px] left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.3), rgba(59,130,246,0.3) 50%, rgba(34,197,94,0.3))' }} />

            {STEPS.map(({ n, color, bg, border, title, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.1)} className="card p-7 relative">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl border mb-6 font-mono font-bold text-sm"
                  style={{ background: bg, borderColor: border, color }}>
                  {n}
                </div>
                <h3 className="text-noc-white font-black text-xl mb-3">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                {/* Step tag */}
                <div className="mt-5 text-[10px] font-mono tracking-widest" style={{ color: color + '80' }}>
                  PASO {n} DE 03
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Clientes"
            title={<>Resultados reales,<br /><span className="text-gradient-amber">no promesas</span></>}
            sub="Cada caso tiene métricas documentadas. No publicamos testimonios sin datos."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {TESTIMONIALS.map(({ quote, author, role, color, initials }, i) => (
              <motion.div key={author} {...fadeUp(i * 0.08)}
                className="card p-6 flex flex-col gap-4"
                style={{
                  background: `linear-gradient(145deg, rgba(20,20,20,0.97), rgba(10,10,10,0.99)) padding-box, linear-gradient(135deg, ${color}28, rgba(30,30,30,0.6) 50%, ${color}08) border-box`,
                  border: '1px solid transparent',
                }}
              >
                <div className="text-5xl font-serif leading-none opacity-20" style={{ color }}>"</div>
                <p className="text-zinc-300 text-sm leading-relaxed flex-1">{quote}</p>
                <div className="flex items-center gap-3 pt-3 border-t border-surface-border">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: color + '20', color }}>
                    {initials}
                  </div>
                  <div>
                    <div className="text-zinc-200 text-sm font-semibold">{author}</div>
                    <div className="text-zinc-600 text-[11px]">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.2)}>
            <CtaStrip
              text="Tu empresa puede tener los mismos resultados. El diagnóstico es gratuito."
              cta="Solicitar ahora"
              href="/assessments"
              urgency="Respondemos en menos de 24 horas hábiles"
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-28 px-4 sm:px-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.07)_0%,transparent_65%)]" />
          </div>
        </div>

        <motion.div {...fadeUp(0)} className="relative max-w-2xl mx-auto text-center">
          <span className="label block mb-4">¿Listo para empezar?</span>

          <h2 className="text-4xl sm:text-6xl font-black text-noc-white mb-5 leading-[1.02]">
            Diagnóstico gratis<br />
            <span className="text-gradient-amber">en 24 horas.</span>
          </h2>

          <p className="text-zinc-500 mb-3 max-w-md mx-auto leading-relaxed">
            Nuestros ingenieros evalúan tu infraestructura y entregan un informe técnico con recomendaciones y costos reales.
          </p>

          {/* Scarcity */}
          <p className="text-amber text-xs font-mono mb-10 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-fast inline-block" />
            Solo 4 diagnósticos gratuitos disponibles este mes
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/assessments" className="btn-amber text-[15px] px-12 py-4">
              Solicitar diagnóstico →
            </Link>
            <Link href="/casos" className="btn-ghost text-[15px] px-12 py-4">
              Ver casos de éxito
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { dot: '#22c55e', text: 'Sin contrato mínimo' },
              { dot: '#f59e0b', text: 'Respuesta < 24 h' },
              { dot: '#3b82f6', text: 'Ingenieros certificados' },
              { dot: '#06b6d4', text: 'Sin spam' },
            ].map(({ dot, text }) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                <span className="text-zinc-500 text-xs">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}
