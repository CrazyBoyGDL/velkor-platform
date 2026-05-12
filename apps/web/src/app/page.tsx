'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import NOCDashboard from '@/components/NOCDashboard'
import ServicePanel, { type ServicePanelData } from '@/components/ServicePanel'
import NOCStory from '@/components/NOCStory'

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
  { val: 99.9, suf: '%',  label: 'Uptime garantizado',  sub: 'SLA documentado',       color: '#f59e0b' },
  { val: 4,    suf: 'h',  label: 'Tiempo de respuesta', sub: 'Incidentes críticos',   color: '#f59e0b', prefix: '<' },
  { val: 8,    suf: 'yr', label: 'Años operando',        sub: 'Desde 2016',            color: '#f59e0b' },
]

const SERVICES: ServicePanelData[] = [
  {
    icon: '⬡', title: 'Redes & Conectividad',
    desc: 'LAN/WAN, firewall Fortinet, SD-WAN y Wi-Fi corporativo con QoS y segmentación por VLAN.',
    hex: '#3b82f6', uptime: 99.7, incidents: 0,
    tags: ['Fortinet', 'Cisco', 'SD-WAN', 'VLAN', 'QoS'],
    sparkline: [99.2, 99.5, 99.7, 99.6, 99.8, 99.9, 99.7, 99.8, 99.7, 99.9],
    href: '/services',
  },
  {
    icon: '◉', title: 'CCTV & Videovigilancia',
    desc: 'Sistemas IP Axis/Hikvision, NVR centralizado con retención 30 días y analítica con IA.',
    hex: '#06b6d4', uptime: 99.5, incidents: 1,
    tags: ['Axis', 'NVR 4K', 'IA Analytics', 'PoE+', 'ONVIF'],
    sparkline: [99.1, 99.3, 99.5, 99.2, 99.6, 99.4, 99.5, 99.7, 99.5, 99.6],
    href: '/services',
  },
  {
    icon: '⬢', title: 'Microsoft 365 & Cloud',
    desc: 'Tenant setup, Exchange Online, Teams, SharePoint y optimización de licencias M365.',
    hex: '#3b82f6', uptime: 99.9, incidents: 0,
    tags: ['Exchange', 'Teams', 'SharePoint', 'Entra ID', 'OneDrive'],
    sparkline: [99.7, 99.8, 99.9, 99.9, 99.8, 99.9, 100, 99.9, 99.9, 100],
    href: '/services',
  },
  {
    icon: '⬟', title: 'Intune & Entra ID',
    desc: 'MDM, acceso condicional, MFA por hardware y gobernanza de identidades Zero Trust.',
    hex: '#22c55e', uptime: 99.8, incidents: 0,
    tags: ['MDM', 'MFA', 'Autopilot', 'PIM', 'Conditional Access'],
    sparkline: [99.5, 99.7, 99.8, 99.9, 99.8, 99.9, 99.8, 99.9, 99.8, 99.9],
    href: '/services',
  },
  {
    icon: '◈', title: 'Monitoreo NOC 24/7',
    desc: 'Centro de operaciones propio: más de 200 indicadores monitoreados, alertas y SLA documentado.',
    hex: '#f59e0b', uptime: 99.9, incidents: 2,
    tags: ['SIEM', 'Alertas RTR', 'SLA 4h', 'Live Dashboard', 'Fortinet'],
    sparkline: [99.7, 99.8, 99.9, 99.8, 99.9, 99.9, 100, 99.9, 99.9, 99.9],
    href: '/services',
  },
  {
    icon: '◇', title: 'Diagnóstico & Cotización',
    desc: 'Auditoría técnica completa de tu infraestructura y propuesta personalizada en menos de 24 h.',
    hex: '#06b6d4', uptime: 100, incidents: 0,
    tags: ['Auditoría', 'Propuesta 24h', 'Sin costo', 'Ingenieros NSE4'],
    sparkline: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    href: '/assessments',
  },
]

const STEPS = [
  { n: '01', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  title: 'Diagnóstico',      desc: 'Evaluamos tu infraestructura: redes, identidades, dispositivos y seguridad. Informe técnico en 24 h.' },
  { n: '02', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  title: 'Propuesta',        desc: 'Plan de trabajo con alcance, tecnologías, cronograma y cotización detallada. Sin letra pequeña.' },
  { n: '03', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   title: 'Implementación',   desc: 'Ingenieros certificados, documentación de cada cambio y transferencia de conocimiento a tu equipo.' },
]

const TESTIMONIALS = [
  { quote: 'Rediseñaron nuestra red y migraron 80 usuarios a Microsoft 365 en un fin de semana. Cero interrupciones, documentación entregada el lunes.', author: 'Director de Operaciones', role: 'Empresa de distribución · Monterrey', color: '#f59e0b', initials: 'DO' },
  { quote: 'Implementaron Intune y acceso condicional en 3 semanas. Ahora tenemos visibilidad total de 150 dispositivos desde un solo panel.', author: 'IT Manager', role: 'Grupo de salud · CDMX', color: '#f59e0b', initials: 'IT' },
  { quote: 'El sistema CCTV con analítica de video detectó un incidente antes de que llegara el equipo de seguridad. El ROI fue evidente en el primer mes.', author: 'Gerente General', role: 'Cadena de retail · Guadalajara', color: '#f59e0b', initials: 'GG' },
]

const DIFFERENTIATORS = [
  { label: 'SLA < 4 h', sub: 'Respuesta en incidentes críticos' },
  { label: 'Zero Trust', sub: 'Arquitectura por diseño' },
  { label: 'Dashboard en tiempo real', sub: 'Visibilidad total 24/7' },
  { label: 'KPIs firmados', sub: 'Métricas acordadas antes de iniciar' },
  { label: 'Ingenieros certificados', sub: 'NSE4, Microsoft 365, CompTIA' },
  { label: 'Sin contrato mínimo', sub: 'Servicio mes a mes' },
]

const CERTS = [
  { name: 'Fortinet NSE 4', dot: '#f59e0b' },
  { name: 'Microsoft 365', dot: '#f59e0b' },
  { name: 'CompTIA Sec+',  dot: '#f59e0b' },
  { name: 'Cisco CCNA',    dot: '#f59e0b' },
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
function CtaStrip({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <motion.div {...fadeUp(0)} className="cta-strip">
      <p className="text-noc-white font-semibold text-[15px]">{text}</p>
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

            <motion.p {...fadeUp(0.24)} className="text-xs font-mono text-zinc-600 flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-fast inline-block" />
              Sin contrato mínimo · Diagnóstico técnico sin costo
            </motion.p>

            {/* Social proof avatars */}
            <motion.div {...fadeUp(0.28)} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(n => (
                  <div key={n} className="w-8 h-8 rounded-full border-2 border-surface-dark flex items-center justify-center"
                    style={{ background: 'rgba(245,158,11,0.12)', boxShadow: 'none' }}>
                    <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(245,158,11,0.3)' }} />
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
          <span className="label flex-shrink-0">CERTIFICACIONES /</span>
          <div className="flex items-center gap-10 flex-shrink-0">
            {CERTS.map(({ name, dot }) => (
              <div key={name} className="flex items-center gap-2 opacity-40 hover:opacity-60 transition-opacity cursor-default flex-shrink-0">
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
          cta="Ver casos de éxito"
          href="/casos"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.title} {...fadeUp(i * 0.07)}>
                <ServicePanel data={svc} />
              </motion.div>
            ))}
          </div>

          {/* ── Micro CTA after services ── */}
          <motion.div {...fadeUp(0.2)} className="mt-8">
            <CtaStrip
              text="¿No sabes qué servicio necesitas? 15 minutos con un ingeniero lo aclaran."
              cta="Diagnóstico gratuito"
              href="/assessments"
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          NOC STORY — Apple scroll storytelling
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <NOCStory />

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
            {DIFFERENTIATORS.map(({ label, sub }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)}
                className="card p-5 group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1 h-4 rounded-full bg-amber opacity-60 flex-shrink-0" />
                  <div className="text-zinc-200 font-semibold text-sm leading-snug">{label}</div>
                </div>
                <div className="text-zinc-600 text-xs ml-3 leading-relaxed">{sub}</div>
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
            {TESTIMONIALS.map(({ quote, author, role, initials }, i) => (
              <motion.div key={author} {...fadeUp(i * 0.08)}
                className="card p-6 flex flex-col gap-4"
              >
                <div className="text-4xl font-serif leading-none text-amber opacity-30">"</div>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1">{quote}</p>
                <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                    {initials}
                  </div>
                  <div>
                    <div className="text-zinc-300 text-sm font-semibold">{author}</div>
                    <div className="text-zinc-600 text-[11px]">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.2)}>
            <CtaStrip
              text="Podemos mostrar resultados similares en tu infraestructura. El diagnóstico no tiene costo."
              cta="Solicitar diagnóstico"
              href="/assessments"
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

          <p className="text-zinc-600 text-xs font-mono mb-10 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-fast inline-block" />
            Respuesta en menos de 24 horas · Sin compromiso
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
