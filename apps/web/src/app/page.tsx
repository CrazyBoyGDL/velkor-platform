'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import InfraTopology from '@/components/InfraTopology'
import ServicePanel, { type ServicePanelData } from '@/components/ServicePanel'
import OperationalArtifacts from '@/components/OperationalArtifacts'
import ServiceEcosystem from '@/components/ServiceEcosystem'
import { trackCTA } from '@/components/Analytics'

const NetworkBg = dynamic(() => import('@/components/NetworkBg'), { ssr: false })

// ─── Motion helpers ───────────────────────────────────────────────────────────
// easeOutExpo — fast deceleration that reads as expensive and intentional
const EASE = [0.16, 1, 0.3, 1] as const

// For below-fold content: triggers when element enters viewport
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.35, ease: EASE, delay },
})

// For above-fold hero content: animate on mount, don't wait for scroll
const heroUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.30, ease: EASE, delay },
})

// ─── DATA ────────────────────────────────────────────────────────────────────
const STATS = [
  { val: 50,  suf: '+',  label: 'Clientes activos',      sub: 'Pymes y corporativos',          color: '#3b82f6' },
  { val: 8,   suf: 'yr', label: 'Años de experiencia',   sub: 'Fundados en 2016',              color: '#64748b' },
  { val: 24,  suf: 'h',  label: 'Propuesta técnica',     sub: 'Diagnóstico inicial incluido',  color: '#22c55e', prefix: '<' },
  { val: 100, suf: '%',  label: 'Proyectos documentados', sub: 'KPIs verificados al cierre',   color: '#3b82f6' },
]

const SERVICES: ServicePanelData[] = [
  {
    icon: '⬡', title: 'Redes & Ciberseguridad',
    desc: 'Segmentación y hardening de red para eliminar movimiento lateral. FortiGate NGFW, VLANs y Zero Trust arquitecturados desde el primer día, no adaptados después.',
    outcome: 'Proyecto: 0 incidentes · 14 meses · Red distribuidora 85 hosts',
    hex: '#3b82f6', uptime: 99.7, incidents: 0,
    tags: ['FortiGate NGFW', 'VLAN', 'Zero Trust', 'VPN', 'IPS/IDS'],
    sparkline: [99.2, 99.5, 99.7, 99.6, 99.8, 99.9, 99.7, 99.8, 99.7, 99.9],
    href: '/servicios/ciberseguridad',
  },
  {
    icon: '◉', title: 'CCTV & Videovigilancia',
    desc: 'Visibilidad total de tus instalaciones con detección de incidentes en tiempo real. Cámaras 4K, NVR centralizado y analítica con IA para actuar antes de que escalen.',
    outcome: 'Proyecto: −34% robos · 96 cámaras · Retail 8 sucursales',
    hex: '#06b6d4', uptime: 99.5, incidents: 1,
    tags: ['Axis', 'NVR 4K', 'IA Analytics', 'PoE+', 'ONVIF'],
    sparkline: [99.1, 99.3, 99.5, 99.2, 99.6, 99.4, 99.5, 99.7, 99.5, 99.6],
    href: '/servicios/videovigilancia',
  },
  {
    icon: '⬢', title: 'Microsoft 365 & Cloud',
    desc: 'Microsoft 365 en producción completa en menos de 5 días hábiles: correo, colaboración y cumplimiento. Sin migraciones incompletas ni usuarios sin configurar.',
    hex: '#3b82f6', uptime: 99.9, incidents: 0,
    tags: ['Exchange', 'Teams', 'SharePoint', 'Entra ID', 'OneDrive'],
    sparkline: [99.7, 99.8, 99.9, 99.9, 99.8, 99.9, 100, 99.9, 99.9, 100],
    href: '/servicios/identidad-acceso',
  },
  {
    icon: '⬟', title: 'Intune & Entra ID',
    desc: 'Gobernanza total de dispositivos e identidades. Ningún endpoint sin gestionar. Ninguna credencial sin MFA. Acceso condicional por política, no por excepción.',
    outcome: 'Proyecto: NOM-024 en 6 semanas · 62 usuarios · Salud',
    hex: '#22c55e', uptime: 99.8, incidents: 0,
    tags: ['MDM', 'MFA', 'Autopilot', 'PIM', 'Conditional Access'],
    sparkline: [99.5, 99.7, 99.8, 99.9, 99.8, 99.9, 99.8, 99.9, 99.8, 99.9],
    href: '/servicios/identidad-acceso',
  },
  {
    icon: '◈', title: 'Continuidad & Soporte',
    desc: 'Revisiones proactivas periódicas y respuesta a incidentes antes de que afecten la operación. Sin contrato mínimo ni permanencia forzada.',
    hex: '#64748b', uptime: 99.9, incidents: 0,
    tags: ['Soporte activo', 'Revisiones', 'Atención incidentes', 'Documentación', 'Fortinet'],
    sparkline: [99.7, 99.8, 99.9, 99.8, 99.9, 99.9, 100, 99.9, 99.9, 99.9],
    href: '/assessments',
  },
  {
    icon: '◇', title: 'Consultoría & Diagnóstico',
    desc: 'Mapa técnico completo de tu infraestructura en 24 horas: brechas documentadas, riesgos priorizados y propuesta de remediación con costos reales.',
    hex: '#06b6d4', uptime: 100, incidents: 0,
    tags: ['Auditoría', 'Propuesta 24h', 'Sin costo', 'Ingenieros Fortinet'],
    sparkline: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    href: '/assessments',
  },
]

const STEPS = [
  { n: '01', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  title: 'Diagnóstico',      desc: 'Evaluamos tu infraestructura: redes, identidades, dispositivos y seguridad. Informe técnico en 24 h.' },
  { n: '02', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  title: 'Propuesta',        desc: 'Plan de trabajo con alcance, tecnologías, cronograma y cotización detallada. Sin letra pequeña.' },
  { n: '03', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   title: 'Implementación',   desc: 'Ingenieros especializados en campo, documentación de cada cambio y transferencia de conocimiento a tu equipo.' },
]

const TESTIMONIALS = [
  { quote: 'Rediseñaron nuestra red y migraron 80 usuarios a Microsoft 365 en un fin de semana. Cero interrupciones, documentación entregada el lunes.', author: 'Director de Operaciones', role: 'Empresa de distribución · Monterrey', color: '#f59e0b', initials: 'DO' },
  { quote: 'Implementaron Intune y acceso condicional en 3 semanas. Ahora tenemos visibilidad total de 150 dispositivos desde un solo panel.', author: 'IT Manager', role: 'Grupo de salud · CDMX', color: '#f59e0b', initials: 'IT' },
  { quote: 'El sistema CCTV con analítica de video detectó un incidente antes de que llegara el equipo de seguridad. El ROI fue evidente en el primer mes.', author: 'Gerente General', role: 'Cadena de retail · Guadalajara', color: '#f59e0b', initials: 'GG' },
]

const DIFFERENTIATORS = [
  { label: 'Entregables firmados',    sub: 'Alcance, costos y cronograma acordados antes de iniciar' },
  { label: 'Zero Trust por diseño',   sub: 'Arquitectura segura desde el primer día, no adaptada después' },
  { label: 'Proyecto documentado',    sub: 'Estado y entregables visibles en cada fase' },
  { label: 'KPIs comprometidos',      sub: 'Métricas acordadas y verificadas al cierre' },
  { label: 'Ingenieros especializados', sub: 'Experiencia directa en Fortinet, Microsoft 365 y redes IP' },
  { label: 'Sin lock-in',             sub: 'Mes a mes, sin permanencia mínima' },
]

// Technology specializations — platforms we implement, not badge claims
const CERTS = [
  { name: 'Fortinet FortiGate', dot: '#f59e0b' },
  { name: 'Microsoft 365',      dot: '#f59e0b' },
  { name: 'Axis · Hikvision',   dot: '#f59e0b' },
  { name: 'Cisco · HP Aruba',   dot: '#f59e0b' },
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
function SectionHeader({ eyebrow, title, sub, align = 'center' }: {
  eyebrow: string; title: React.ReactNode; sub?: string; align?: 'center' | 'left'
}) {
  const cls = align === 'left' ? 'text-left mb-16' : 'text-center mb-16'
  const subCls = align === 'left' ? 'text-zinc-500 mt-4 max-w-xl text-base leading-relaxed' : 'text-zinc-500 mt-4 max-w-xl mx-auto text-base leading-relaxed'
  return (
    <div className={cls}>
      <motion.span {...fadeUp(0)}    className="label block mb-4">{eyebrow}</motion.span>
      <motion.h2  {...fadeUp(0.06)} className="text-3xl sm:text-[2.6rem] font-black text-noc-white leading-tight tracking-heading">{title}</motion.h2>
      {sub && <motion.p {...fadeUp(0.12)} className={subCls}>{sub}</motion.p>}
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
          HERO — cinematic viewport, commanding editorial composition
      ════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        {/* ── Layered atmospheric backgrounds ── */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          {/* Cool blue bloom — upper-left: calm enterprise depth */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 100% 70% at 15% 20%, rgba(37,99,235,0.015) 0%, transparent 55%)',
          }} />
          {/* Cool depth — lower-right: recessive atmospheric pressure */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 80% 60% at 85% 85%, rgba(59,130,246,0.012) 0%, transparent 55%)',
          }} />
          {/* Topology dot texture — subtle infrastructure motif */}
          <div className="absolute inset-0 bg-topology opacity-60" />
          <NetworkBg />
          {/* Bottom fade — transitions smoothly to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-surface-dark to-transparent" />
        </motion.div>

        {/* ── Hero content — asymmetric editorial layout ── */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_540px] gap-16 lg:gap-12 xl:gap-16 items-center py-28 sm:py-32 lg:py-36"
        >
          {/* Left: editorial copy — animate on mount (above fold) */}
          <div>
            {/* Eyebrow — with decorative accent line */}
            <motion.div {...heroUp(0)} className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px flex-shrink-0" style={{ background: 'rgba(100,116,139,0.30)' }} />
              <span className="label text-zinc-500">CONSULTORÍA TECNOLÓGICA EMPRESARIAL</span>
            </motion.div>

            {/* Display headline — commanding, tight, editorial */}
            <motion.h1 {...heroUp(0.06)}
              className="text-[clamp(3rem,7vw,5rem)] font-black leading-[0.97] tracking-display mb-8"
            >
              Tu operación,<br />
              sin puntos<br />
              <span className="text-gradient-amber">de falla.</span>
            </motion.h1>

            <motion.p {...heroUp(0.11)} className="text-zinc-400 text-[1.0625rem] leading-[1.78] max-w-[28rem] mb-10">
              Redes, ciberseguridad y gestión de identidad para empresas que no pueden permitirse interrupciones.
            </motion.p>

            {/* CTAs */}
            <motion.div {...heroUp(0.16)} className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link href="/assessments" className="btn-amber text-[15px] px-8 py-4"
                onClick={() => trackCTA('Hero — Solicitar diagnóstico')}>
                Solicitar diagnóstico gratis
              </Link>
              <Link href="/servicios" className="btn-ghost text-[15px] px-8 py-4"
                onClick={() => trackCTA('Hero — Ver servicios')}>
                Ver servicios →
              </Link>
            </motion.div>

            <motion.p {...heroUp(0.20)} className="text-xs font-medium text-zinc-600 flex items-center gap-2 mb-9">
              <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-slow inline-block" />
              Sin contrato mínimo · Diagnóstico técnico sin costo
            </motion.p>

            {/* Social proof */}
            <motion.div {...heroUp(0.24)} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(n => (
                  <div key={n} className="w-8 h-8 rounded-full border-2 border-surface-dark flex items-center justify-center"
                    style={{ background: 'rgba(100,116,139,0.10)', boxShadow: 'none' }}>
                    <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(100,116,139,0.25)' }} />
                  </div>
                ))}
              </div>
              <p className="text-zinc-500 text-sm">
                <span className="text-zinc-200 font-semibold">+50 empresas</span> confían en Velkor
              </p>
            </motion.div>
          </div>

          {/* Right: Infrastructure topology — architectural visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.18 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Layered atmospheric depth behind topology */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(59,130,246,0.03) 0%, transparent 65%)' }} />
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 55% 45% at 58% 38%, rgba(37,99,235,0.012) 0%, transparent 60%)' }} />
            </div>
            <InfraTopology />
          </motion.div>
        </motion.div>

        {/* ── Editorial scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2.5"
        >
          <span className="text-zinc-700 text-[9px] font-mono tracking-[0.28em] uppercase">Explorar</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 2 }}
            className="w-px h-7 bg-gradient-to-b from-zinc-600 via-zinc-700 to-transparent"
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PARTNERS
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-5 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-8 overflow-x-auto scrollbar-none">
          <span className="label flex-shrink-0 text-zinc-700">TECNOLOGÍAS</span>
          <div className="w-px h-4 bg-surface-border flex-shrink-0" />
          <div className="flex items-center gap-10 flex-shrink-0">
            {CERTS.map(({ name }) => (
              <div key={name} className="flex items-center gap-2 cursor-default flex-shrink-0">
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                <span className="text-zinc-500 text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" />

      {/* ════════════════════════════════════════════════════════════════
          BENTO STATS — editorial large-number hierarchy
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Architectural section label — minimal, editorial */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-10">
            <span className="label">Resultados verificados</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map(({ val, suf, label, sub, color, prefix }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.04 + 0.04)}
                className="card p-7 sm:p-9"
              >
                <div className="text-[2.6rem] sm:text-5xl font-black mb-3 leading-none tabular-nums tracking-[-0.03em]" style={{ color }}>
                  <Counter val={val} suf={suf} prefix={prefix ?? ''} />
                </div>
                <div className="text-zinc-200 text-sm font-semibold mb-1">{label}</div>
                <div className="text-zinc-600 text-xs leading-relaxed">{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Micro CTA after stats ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
        <CtaStrip
          text="Cada proyecto incluye documentación técnica, entregables verificados y KPIs acordados desde el inicio."
          cta="Ver casos de éxito"
          href="/casos"
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-28 px-4 sm:px-8 relative overflow-hidden">
        {/* Topology motif — subtle infrastructure grid */}
        <div className="absolute inset-0 bg-topology opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <motion.span {...fadeUp(0)} className="label block mb-4">Lo que hacemos</motion.span>
              <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-[2.5rem] font-black text-noc-white leading-tight tracking-heading">
                Infraestructura IT<br />
                <span className="text-gradient-white">de principio a fin</span>
              </motion.h2>
            </div>
            <motion.div {...fadeUp(0.1)}>
              <Link href="/servicios" className="btn-ghost text-sm whitespace-nowrap">Catálogo completo →</Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.title} {...fadeUp(i * 0.04)}>
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
          POR QUÉ VELKOR — Differentiators grid
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-28 px-4 sm:px-8 relative overflow-hidden section-deep">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">

            {/* Left: editorial statement */}
            <div className="lg:sticky lg:top-32">
              <motion.span {...fadeUp(0)} className="label block mb-5">Por qué elegirnos</motion.span>
              <motion.h2 {...fadeUp(0.06)}
                className="text-3xl sm:text-[2.6rem] font-black text-noc-white leading-tight tracking-heading mb-6">
                Sin compromisos<br />vacíos.<br />
                <span className="text-gradient-green">Solo resultados.</span>
              </motion.h2>
              <motion.p {...fadeUp(0.12)} className="text-zinc-500 text-base leading-relaxed mb-10 max-w-sm">
                Comprometemos entregables antes de iniciar y los verificamos al cierre. Sin promesas vagas, sin compromisos que no podemos cumplir.
              </motion.p>
              <motion.div {...fadeUp(0.18)}>
                <Link href="/nosotros" className="btn-ghost text-sm">
                  Conocer al equipo →
                </Link>
              </motion.div>
            </div>

            {/* Right: differentiator list — editorial, not card grid */}
            <div>
              {DIFFERENTIATORS.map(({ label, sub }, i) => (
                <motion.div key={label} {...fadeUp(i * 0.04)}
                  className="flex items-start gap-5 py-5 group"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}
                >
                  {/* Architectural accent mark */}
                  <div className="w-4 h-px mt-[11px] flex-shrink-0 transition-all duration-300"
                    style={{ background: 'rgba(34,197,94,0.35)' }} />
                  <div>
                    <div className="text-zinc-100 font-semibold text-[15px] leading-snug mb-1.5 group-hover:text-white transition-colors">{label}</div>
                    <div className="text-zinc-500 text-sm leading-relaxed">{sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SERVICE ECOSYSTEM — operational layer dependency map
          Shows how services form an integrated platform, not silo services.
          Positioned between differentiators and process for logical flow.
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <ServiceEcosystem />

      {/* ════════════════════════════════════════════════════════════════
          PROCESS
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-28 px-4 sm:px-8 section-arch">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Proceso"
            title="Cómo trabajamos"
            sub="Desde el primer contacto hasta la operación continua, en tres pasos con fechas y entregables claros."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Dashed architectural connector */}
            <div className="hidden md:block absolute top-[2.6rem] left-[calc(16.67%+22px)] right-[calc(16.67%+22px)] h-px pointer-events-none"
              style={{ borderTop: '1px dashed rgba(100,116,139,0.12)' }} />

            {STEPS.map(({ n, color, bg, border, title, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.1)} className="card p-8 relative overflow-hidden">
                {/* Large typographic step number — editorial depth element */}
                <div className="absolute right-5 top-3 font-mono font-black leading-none select-none pointer-events-none tabular-nums"
                  style={{ fontSize: '5.5rem', color, opacity: 0.045 }}>
                  {n}
                </div>
                {/* Horizontal step indicator */}
                <div className="flex items-center gap-3 mb-7">
                  <span className="font-mono text-xs font-bold" style={{ color }}>{n}</span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}38, transparent)` }} />
                </div>
                <h3 className="text-noc-white font-bold text-[17px] mb-3 tracking-title">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          OPERATIONAL ARTIFACTS — enterprise evidence layer
          Sanitized project deliverables between process + testimonials:
          shows what we actually produce, not marketing promises.
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <OperationalArtifacts />

      {/* ════════════════════════════════════════════════════════════════
          TESTIMONIALS — warm amber atmosphere
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <section className="py-28 px-4 sm:px-8 relative overflow-hidden section-warm">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Clientes"
            title={<>Resultados reales,<br /><span className="text-gradient-amber">no promesas</span></>}
            sub="Cada caso tiene métricas documentadas. No publicamos testimonios sin datos."
          />

          {/* Asymmetric editorial layout — featured + two compact */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">

            {/* Featured testimonial — primary, left 3/5 */}
            <motion.div {...fadeUp(0)} className="md:col-span-3 card p-9 flex flex-col">
              <div className="text-[3.5rem] font-black leading-none text-amber/18 mb-5 select-none">&ldquo;</div>
              <p className="text-zinc-300 text-[15px] leading-[1.75] flex-1 mb-8">{TESTIMONIALS[0].quote}</p>
              <div className="flex items-center gap-3 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: 'rgba(100,116,139,0.09)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.18)' }}>
                  {TESTIMONIALS[0].initials}
                </div>
                <div>
                  <div className="text-zinc-200 text-sm font-semibold">{TESTIMONIALS[0].author}</div>
                  <div className="text-zinc-600 text-xs mt-0.5">{TESTIMONIALS[0].role}</div>
                </div>
              </div>
            </motion.div>

            {/* Secondary testimonials — right 2/5, stacked */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {TESTIMONIALS.slice(1).map(({ quote, author, role, initials }, i) => (
                <motion.div key={author} {...fadeUp((i + 1) * 0.09)} className="card p-6 flex flex-col flex-1">
                  <div className="text-2xl font-black leading-none text-amber/18 mb-3 select-none">&ldquo;</div>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-5">{quote}</p>
                  <div className="flex items-center gap-2.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: 'rgba(100,116,139,0.07)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.12)' }}>
                      {initials}
                    </div>
                    <div>
                      <div className="text-zinc-300 text-sm font-semibold">{author}</div>
                      <div className="text-zinc-600 text-[11px] mt-0.5">{role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

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
      <section className="py-36 px-4 sm:px-8 relative overflow-hidden">
        {/* Ambient bloom */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.025)_0%,transparent_65%)]" />
        </div>

        <motion.div {...fadeUp(0)} className="relative max-w-xl mx-auto text-center">
          <span className="label block mb-5">¿Listo para empezar?</span>

          <h2 className="text-4xl sm:text-5xl font-black text-noc-white mb-6 leading-[0.98] tracking-display">
            Diagnóstico gratis<br />
            <span className="text-gradient-amber">en 24 horas.</span>
          </h2>

          <p className="text-zinc-500 mb-8 leading-relaxed text-base">
            Nuestros ingenieros evalúan tu infraestructura y entregan un informe técnico con recomendaciones y costos reales.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/assessments" className="btn-amber text-[15px] px-10 py-4"
              onClick={() => trackCTA('Final CTA — Solicitar diagnóstico')}>
              Solicitar diagnóstico →
            </Link>
            <Link href="/casos" className="btn-ghost text-[15px] px-10 py-4"
              onClick={() => trackCTA('Final CTA — Ver casos')}>
              Ver casos de éxito
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              'Sin contrato mínimo',
              'Respuesta < 24 h',
              'Ingenieros especializados',
              'Propuesta sin costo',
            ].map((text) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-zinc-500 text-xs">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}
