'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import InfraTopology from '@/components/InfraTopology'
import ServicePanel, { type ServicePanelData } from '@/components/ServicePanel'
import OperationalArtifacts from '@/components/OperationalArtifacts'
import ServiceEcosystem from '@/components/ServiceEcosystem'
import OperationalStoryboard from '@/components/OperationalStoryboard'
import RiskExposure from '@/components/RiskExposure'
import ExecutiveDiagnostic from '@/components/ExecutiveDiagnostic'
import { AnimeGridReveal, ScrambleText } from '@/components/AnimeMotion'
import { trackCTA } from '@/components/Analytics'
import { EASE, reveal as fadeUp, enter as heroUp } from '@/lib/motion'

const NetworkBg = dynamic(() => import('@/components/NetworkBg'), { ssr: false })

// ─── DATA ────────────────────────────────────────────────────────────────────
const STATS = [
  { val: 50,  suf: '+',  label: 'Equipos atendidos',      sub: 'Pymes y corporativos que operan todos los días', color: '#4878b0' },
  { val: 8,   suf: 'yr', label: 'Años en campo',          sub: 'Redes, Microsoft 365, seguridad y soporte',       color: '#64748b' },
  { val: 24,  suf: 'h',  label: 'Ruta inicial',           sub: 'Diagnóstico, prioridades y siguiente paso',       color: '#3a7858', prefix: '<' },
  { val: 100, suf: '%',  label: 'Entregas documentadas',  sub: 'Cambios, evidencias y pendientes visibles',       color: '#4878b0' },
]

const HERO_SIGNALS = [
  { label: 'Diagnóstico sin humo', detail: 'Te decimos qué conviene corregir primero y por qué.' },
  { label: 'Implementación visible', detail: 'Cada cambio queda documentado para tu equipo.' },
  { label: 'Operación acompañada', detail: 'Soporte técnico que entiende el contexto completo.' },
  { label: 'Sin venta forzada', detail: 'Si no hace falta comprar algo, también lo decimos.' },
]

const SERVICES: ServicePanelData[] = [
  {
    icon: '⬡', title: 'Redes & Ciberseguridad',
    desc: 'Separamos lo crítico, cerramos accesos innecesarios y dejamos políticas que tu equipo puede auditar sin depender de memoria tribal.',
    outcome: 'Referencia anonimizada: red industrial · 85 hosts · 3 sedes · FortiGate 80F · 4 semanas',
    scope: 'Red plana → 4 VLANs segmentadas · política de acceso por segmento · IPS/IDS activo',
    hex: '#4878b0',
    tags: ['FortiGate NGFW', 'VLAN', 'Zero Trust', 'VPN', 'IPS/IDS'],
    href: '/servicios/ciberseguridad',
  },
  {
    icon: '◉', title: 'CCTV & Videovigilancia',
    desc: 'Diseñamos cobertura para que seguridad y operaciones vean lo que importa: accesos, perímetros, puntos ciegos y eventos que sí requieren atención.',
    outcome: 'Referencia anonimizada: retail · 8 sucursales · 96 cámaras · menos incidentes repetidos',
    scope: 'Axis P-series · Milestone NVR · PoE+ switching · analítica de intrusión perimetral',
    hex: '#3d88a5',
    tags: ['Axis', 'NVR 4K', 'IA Analytics', 'PoE+', 'ONVIF'],
    href: '/servicios/videovigilancia',
  },
  {
    icon: '⬢', title: 'Microsoft 365 & Cloud',
    desc: 'Migramos correo, colaboración y archivos con una ruta clara para usuarios, permisos y continuidad. Menos caos, más adopción real.',
    scope: 'Tenant M365 · Exchange Online · Teams · SharePoint · Defender for Office 365',
    hex: '#4878b0',
    tags: ['Exchange', 'Teams', 'SharePoint', 'Entra ID', 'OneDrive'],
    href: '/servicios/identidad-acceso',
  },
  {
    icon: '⬟', title: 'Intune & Entra ID',
    desc: 'Ordenamos identidades, MFA, dispositivos y acceso condicional para que entrar a sistemas críticos dependa de reglas, no de favores.',
    outcome: 'Referencia anonimizada: salud · 62 usuarios · gobierno de identidad · 6 semanas',
    scope: 'Entra ID · Acceso Condicional · Intune MDM · Autopilot · PIM just-in-time',
    hex: '#3a7858',
    tags: ['MDM', 'MFA', 'Autopilot', 'PIM', 'Conditional Access'],
    href: '/servicios/identidad-acceso',
  },
  {
    icon: '◈', title: 'Continuidad & Soporte',
    desc: 'Acompañamos la operación con revisiones, parches, documentación y respuesta a incidentes. La idea es que tu equipo no opere a ciegas.',
    scope: 'Revisión mensual · parcheo de endpoints · documentación técnica actualizada · multi-sede',
    hex: '#64748b',
    tags: ['Soporte activo', 'Revisiones', 'Atención incidentes', 'Documentación', 'Fortinet'],
    href: '/assessments',
  },
  {
    icon: '◇', title: 'Consultoría & Diagnóstico',
    desc: 'Nos sentamos con tu equipo, revisamos el entorno y salimos con prioridades claras, costos aterrizados y una ruta que se puede ejecutar.',
    scope: 'Auditoría LAN/WAN · inventario de endpoints · análisis de políticas IAM · informe técnico',
    hex: '#3d88a5',
    tags: ['Auditoría', 'Propuesta 24h', 'Sin costo', 'Ingenieros Fortinet'],
    href: '/assessments',
  },
]

const STEPS = [
  { n: '01', color: '#b07828', bg: 'rgba(176,120,40,0.1)',  border: 'rgba(176,120,40,0.3)',  title: 'Diagnóstico',      desc: 'Revisamos red, identidad, dispositivos y seguridad con tu equipo. El resultado: hallazgos claros, no una lista infinita.' },
  { n: '02', color: '#4878b0', bg: 'rgba(72,120,176,0.1)',  border: 'rgba(72,120,176,0.3)',  title: 'Ruta técnica',     desc: 'Definimos alcance, prioridades, tecnologías, cronograma y costos. Sin empujar compras que no resuelven el problema.' },
  { n: '03', color: '#3a7858', bg: 'rgba(58,120,88,0.1)',   border: 'rgba(58,120,88,0.3)',   title: 'Implementación',   desc: 'Ejecutamos con ingeniería en campo, evidencia de cambios y transferencia para que la operación quede en buenas manos.' },
]

const TESTIMONIALS = [
  { quote: 'Lo valioso no fue solo migrar; fue que el lunes sabíamos exactamente qué cambió, qué faltaba y a quién llamar si algo se movía.', author: 'Director de Operaciones', role: 'Distribución · Monterrey', color: '#b07828', initials: 'DO' },
  { quote: 'Pasamos de administrar dispositivos por urgencia a tener políticas claras. El equipo de IT por fin tenía visibilidad sin perseguir hojas de cálculo.', author: 'IT Manager', role: 'Salud · CDMX', color: '#b07828', initials: 'IT' },
  { quote: 'La videovigilancia dejó de ser un gasto pasivo. Ahora operaciones revisa eventos útiles y seguridad tiene evidencia cuando necesita actuar.', author: 'Gerente General', role: 'Retail · Guadalajara', color: '#b07828', initials: 'GG' },
]

const DIFFERENTIATORS = [
  { label: 'Alcance entendible',      sub: 'Antes de iniciar, sabes qué se hará, cuánto cuesta y qué queda fuera' },
  { label: 'Seguridad por diseño',    sub: 'Segmentación, identidad y dispositivos se piensan juntos, no como parches' },
  { label: 'Proyecto documentado',    sub: 'Tu equipo recibe evidencia de cambios, decisiones y pendientes' },
  { label: 'Cierre verificable',      sub: 'Acordamos métricas y revisamos el resultado contra lo prometido' },
  { label: 'Ingenieros en campo',     sub: 'Experiencia directa en Fortinet, Microsoft 365, redes IP e identidad' },
  { label: 'Relación sin candados',   sub: 'Trabajamos por confianza y claridad, no por permanencia forzada' },
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

  return <div ref={ref} className="font-mono font-semibold tabular-nums">{prefix}{count}{suf}</div>
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub, align = 'center' }: {
  eyebrow: string; title: React.ReactNode; sub?: string; align?: 'center' | 'left'
}) {
  const cls = align === 'left' ? 'text-left mb-12' : 'text-center mb-12'
  const subCls = align === 'left' ? 'text-zinc-500 mt-4 max-w-xl text-base leading-relaxed' : 'text-zinc-500 mt-4 max-w-xl mx-auto text-base leading-relaxed'
  return (
    <div className={cls}>
      <motion.span {...fadeUp(0)}     className="label block mb-4">{eyebrow}</motion.span>
      <motion.h2  {...fadeUp(0.010)} className="section-heading">{title}</motion.h2>
      {sub && <motion.p {...fadeUp(0.020)} className={subCls}>{sub}</motion.p>}
    </div>
  )
}

// ─── Inline CTA strip ─────────────────────────────────────────────────────────
function CtaStrip({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <motion.div {...fadeUp(0)}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 py-8"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <p className="text-zinc-500 text-sm leading-relaxed">{text}</p>
      <Link href={href} className="btn-ghost text-sm whitespace-nowrap flex-shrink-0">{cta} →</Link>
    </motion.div>
  )
}

function StatementBand() {
  return (
    <section className="statement-band px-4 sm:px-8 py-14">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.95fr_1.25fr] gap-10 lg:gap-16 items-center">
        <motion.div {...fadeUp(0)}>
          <span className="label block mb-5">Criterio operativo</span>
          <h2 className="section-heading max-w-3xl">
            La infraestructura madura no se vende por volumen.
            <span className="block text-gradient-steel">Se prueba con decisiones visibles.</span>
          </h2>
        </motion.div>
        <AnimeGridReveal className="grid sm:grid-cols-3 gap-0" delay={54} from="first">
          {[
            ['Evidencia', 'Cambios documentados y verificables por el equipo.'],
            ['Gobierno', 'Responsables, reglas y excepciones explícitas.'],
            ['Continuidad', 'Rutas de reversa antes de tocar servicios críticos.'],
          ].map(([label, detail]) => (
            <div key={label} className="px-0 sm:px-6 py-5 sm:border-l border-white/[0.07]">
              <div className="text-zinc-200 font-semibold text-sm mb-2">{label}</div>
              <p className="text-zinc-500 text-sm leading-relaxed">{detail}</p>
            </div>
          ))}
        </AnimeGridReveal>
      </div>
    </section>
  )
}

// ─── Service row — editorial catalog item ────────────────────────────────────
function ServiceRow({ svc }: { svc: ServicePanelData }) {
  return (
    <div
      className="group flex items-start gap-5 py-6"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="w-1.5 h-1.5 rounded-full mt-[0.55rem] flex-shrink-0"
        style={{ background: svc.hex + 'bb' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          <h3 className="text-zinc-200 font-semibold text-[14px] group-hover:text-white transition-colors duration-150">
            {svc.title}
          </h3>
          <Link href={svc.href || '/servicios'}
            className="text-[11px] font-mono flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: svc.hex + 'aa' }}>
            Ver detalle →
          </Link>
        </div>
        <p className="text-zinc-500 text-[13px] leading-relaxed mb-3">{svc.desc}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {svc.tags.slice(0, 4).map(t => (
            <span key={t} className="text-[9.5px] font-mono text-zinc-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '5%'])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0])

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          HERO — operational architecture composition
          Layout: text left ~44%, topology absolute-right ~62%,
          overlap zone creates compositional tension without a grid border.
      ════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[78vh] md:min-h-[88vh] flex items-start overflow-hidden">

        {/* ── Atmospheric depth — slow parallax ── */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 80% 60% at 10% 30%, rgba(37,99,235,0.012) 0%, transparent 55%)',
          }} />
          <div className="absolute inset-0 bg-topology opacity-45" />
          <NetworkBg />
          <div className="absolute bottom-0 left-0 right-0 h-64 hero-bottom-fade" />
        </motion.div>

        {/* ── Architecture topology — atmospheric, right side ── */}
        {/* Absolutely positioned so it can bleed past the text column edge */}
        <motion.div
          className="absolute inset-y-0 right-0 hidden lg:flex items-center pointer-events-none"
          style={{ width: '62%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: EASE, delay: 0.05 }}
        >
          {/* Radial atmosphere — depth behind the topology */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 75% 65% at 58% 50%, rgba(37,99,235,0.030) 0%, transparent 60%)',
          }} />
          {/* Left-edge dissolve — topology fades into the text field */}
          <div className="absolute inset-y-0 left-0 z-10 hero-topology-dissolve" style={{ width: '42%' }} />
          {/* Slow ambient drift — living system feel, not looping visibly */}
          <motion.div
            className="w-full"
            animate={{ y: [0, -4, 1, 3, 0], x: [0, 2, 0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 24, ease: 'easeInOut', times: [0, 0.3, 0.5, 0.75, 1] }}
          >
            <InfraTopology />
          </motion.div>
        </motion.div>

        {/* ── Editorial content — z-above topology ── */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full"
        >
          <div className="lg:max-w-[46%] pt-16 sm:pt-20 lg:pt-20 pb-10">

            {/* Eyebrow — precise, technical, no corporate bluster */}
            <motion.div {...heroUp(0)} className="flex items-center gap-3 mb-7">
              <div className="w-5 h-px flex-shrink-0" style={{ background: 'rgba(100,116,139,0.20)' }} />
              <span className="label" style={{ color: 'rgba(100,116,139,0.55)' }}>
                <ScrambleText text="Ingeniería de infraestructura" delay={120} />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...heroUp(0.03)}
              className="display-heading mb-6"
            >
              <span className="block">Infraestructura</span>
              <span className="block font-light text-zinc-400">que opera</span>
              <span className="block text-gradient-steel">con evidencia.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p {...heroUp(0.05)}
              className="editorial-lede mb-9 max-w-[28rem]"
            >
              Diagnosticamos red, identidad y endpoints para convertir incertidumbre operativa en una ruta clara, documentada y ejecutable.
            </motion.p>

            {/* CTAs */}
            <motion.div {...heroUp(0.07)} className="flex flex-col sm:flex-row gap-2.5 mb-8">
              <Link href="/assessments" className="btn-amber text-[13.5px] px-6 py-3"
                onClick={() => trackCTA('Hero — Solicitar diagnóstico')}>
                Agendar diagnóstico →
              </Link>
              <Link href="/servicios" className="btn-ghost text-[13.5px] px-6 py-3"
                onClick={() => trackCTA('Hero — Ver servicios')}>
                Ver servicios
              </Link>
            </motion.div>

            {/* Operational context */}
            <motion.p {...heroUp(0.09)}
              className="font-mono text-zinc-600 mb-6"
              style={{ fontSize: '10.5px', letterSpacing: 0 }}
            >
              <ScrambleText text="red / identidad / endpoints / evidencia" delay={260} seed={32} />
            </motion.p>

            <AnimeGridReveal
              className="hero-signal-rail max-w-[30rem]"
              delay={64}
              threshold={0.2}
              grid={false}
              from="first"
            >
              {HERO_SIGNALS.map(({ label, detail }) => (
                <div
                  key={label}
                  className="hero-signal-item"
                >
                  <div className="text-zinc-300 text-[12px] font-semibold leading-snug">{label}</div>
                  <div className="text-zinc-600 text-[11.5px] leading-relaxed">{detail}</div>
                </div>
              ))}
            </AnimeGridReveal>

          </div>
        </motion.div>

        {/* ── Scroll cue ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease: EASE }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center"
        >
          <motion.div
            animate={{ scaleY: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 3 }}
            className="w-px h-5 origin-top bg-gradient-to-b from-zinc-700 to-transparent"
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          RISK EXPOSURE — intelligence briefs on real threat patterns
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-divider" />
      <RiskExposure />
      <StatementBand />

      {/* ════════════════════════════════════════════════════════════════
          BENTO STATS — editorial large-number hierarchy
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Architectural section label — minimal, editorial */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-10">
            <span className="label">Resultados verificados</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
          </motion.div>
          {/* Editorial stat strip — numbers breathe in open space, no card boxes */}
          <AnimeGridReveal className="metric-rail grid grid-cols-2 md:grid-cols-4 gap-0" delay={70} from="center">
            {STATS.map(({ val, suf, label, sub, color, prefix }) => (
              <div key={label}
                className="metric-rail-item px-5 sm:px-8 py-9 sm:py-10"
              >
                <div className="text-4xl sm:text-5xl font-semibold mb-3 leading-none tabular-nums tracking-normal" style={{ color }}>
                  <Counter val={val} suf={suf} prefix={prefix ?? ''} />
                </div>
                <div className="text-zinc-200 text-[13px] font-semibold mb-1.5">{label}</div>
                <div className="text-zinc-600 text-xs leading-relaxed">{sub}</div>
              </div>
            ))}
          </AnimeGridReveal>
        </div>
      </section>

      {/* ── Micro CTA after stats ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-12">
          <CtaStrip
          text="Cada proyecto deja una ruta clara: qué se detectó, qué se corrigió, qué sigue y qué evidencia lo respalda."
          cta="Ver casos de éxito"
          href="/casos"
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SERVICES — editorial catalog + anchor panels
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-topology opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <motion.span {...fadeUp(0)} className="label block mb-4">Lo que hacemos</motion.span>
              <motion.h2 {...fadeUp(0.010)} className="section-heading">
                Infraestructura IT<br />
                <span className="text-gradient-white">que se puede operar</span>
              </motion.h2>
            </div>
            <motion.div {...fadeUp(0)}>
              <Link href="/servicios" className="btn-ghost text-sm whitespace-nowrap">Catálogo completo →</Link>
            </motion.div>
          </div>

          {/* Editorial catalog list + 2 anchor panels */}
          <div className="grid lg:grid-cols-[1fr_284px] gap-16 items-start">

            {/* Left: service index — all 6 as editorial rows */}
            <AnimeGridReveal grid={false} from="first" delay={54}>
              {SERVICES.map((svc) => (
                <ServiceRow key={svc.title} svc={svc} />
              ))}
            </AnimeGridReveal>

            {/* Right: 2 anchor ServicePanels — selective containment */}
            <div className="hidden lg:flex flex-col gap-5 sticky top-24">
              <ServicePanel data={SERVICES[0]} />
              <ServicePanel data={SERVICES[3]} />
            </div>
          </div>

          <CtaStrip
            text="¿No sabes por dónde empezar? En 15 minutos podemos separar urgencias, riesgos reales y mejoras que sí convienen."
            cta="Diagnóstico gratuito"
            href="/assessments"
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          POR QUÉ VELKOR — Differentiators grid
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 relative overflow-hidden section-deep">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">

            {/* Left: editorial statement */}
            <div className="lg:sticky lg:top-32">
              <motion.span {...fadeUp(0)} className="label block mb-5">Por qué elegirnos</motion.span>
              <motion.h2 {...fadeUp(0.010)}
                className="section-heading mb-6">
                Menos promesas.<br />
                Más claridad.<br />
                <span className="text-gradient-green">Mejor operación.</span>
              </motion.h2>
              <motion.p {...fadeUp(0.020)} className="text-zinc-500 text-base leading-relaxed mb-10 max-w-sm">
                La confianza se construye con decisiones visibles: alcance claro, evidencia técnica y un equipo que explica sin esconderse detrás de jerga.
              </motion.p>
              <motion.div {...fadeUp(0)}>
                <Link href="/nosotros" className="btn-ghost text-sm">
                  Conocer al equipo →
                </Link>
              </motion.div>
            </div>

            {/* Right: differentiator list — editorial, not card grid */}
            <AnimeGridReveal grid={false} from="first" delay={48}>
              {DIFFERENTIATORS.map(({ label, sub }) => (
                <div key={label}
                  className="flex items-start gap-5 py-5 group"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}
                >
                  {/* Architectural accent mark */}
                  <div className="w-4 h-px mt-[11px] flex-shrink-0 transition-all duration-300"
                    style={{ background: 'rgba(58,120,88,0.35)' }} />
                  <div>
                    <div className="text-zinc-100 font-semibold text-[15px] leading-snug mb-1.5 group-hover:text-white transition-colors">{label}</div>
                    <div className="text-zinc-500 text-sm leading-relaxed">{sub}</div>
                  </div>
                </div>
              ))}
            </AnimeGridReveal>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SERVICE ECOSYSTEM — operational layer dependency map
          Shows how services form an integrated platform, not silo services.
          Positioned between differentiators and process for logical flow.
      ════════════════════════════════════════════════════════════════ */}
      <ServiceEcosystem />
      <OperationalStoryboard />

      {/* ════════════════════════════════════════════════════════════════
          PROCESS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 section-arch">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Proceso"
            title="Cómo trabajamos"
            sub="Tres momentos simples: entender el entorno, decidir con criterio y ejecutar sin perder contexto."
          />

          <AnimeGridReveal className="grid grid-cols-1 md:grid-cols-3" delay={90} from="first">
            {STEPS.map(({ n, color, title, desc }, i) => (
              <div key={n}
                className="relative pt-8 pb-12 overflow-hidden"
                style={i > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.04)', paddingLeft: '2.75rem' } : {}}
              >
                {/* Step index + gradient rule */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-[10px] font-mono font-semibold tabular-nums" style={{ color }}>{n}</span>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}22, transparent)` }} />
                </div>

                {/* Ghost number — atmospheric depth */}
                <div className="absolute right-3 bottom-6 font-mono font-semibold select-none pointer-events-none leading-none tabular-nums"
                  style={{ fontSize: '6.5rem', color, opacity: 0.025 }}>
                  {n}
                </div>

                <h3 className="text-zinc-100 font-semibold text-[17px] mb-3 tracking-title">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </AnimeGridReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          OPERATIONAL ARTIFACTS — enterprise evidence layer
          Sanitized project deliverables between process + testimonials:
          shows what we actually produce, not marketing promises.
      ════════════════════════════════════════════════════════════════ */}
      <OperationalArtifacts />

      {/* ════════════════════════════════════════════════════════════════
          EXECUTIVE DIAGNOSTIC — consultive questions that surface gaps
      ════════════════════════════════════════════════════════════════ */}
      <ExecutiveDiagnostic />

      {/* ════════════════════════════════════════════════════════════════
          TESTIMONIALS — warm amber atmosphere
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 relative overflow-hidden section-warm">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Clientes"
            title={<>Cuando hay orden,<br /><span className="text-gradient-steel">se nota en la operación</span></>}
            sub="Comentarios anonimizados de equipos que necesitaban menos incertidumbre y más control técnico."
          />

          {/* Asymmetric editorial layout — featured + two compact, no boxes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 mb-10">

            {/* Featured testimonial — editorial open layout, no card box */}
            <motion.div {...fadeUp(0)} className="md:col-span-3 flex flex-col py-8 pr-0 md:pr-12 border-b md:border-b-0 md:border-r border-surface-border">
              <div className="text-[2.5rem] font-semibold leading-none text-zinc-700 mb-5 select-none">&ldquo;</div>
              <p className="text-zinc-300 text-[15px] leading-[1.80] flex-1 mb-8">{TESTIMONIALS[0].quote}</p>
              <div className="flex items-center gap-3 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{ background: 'rgba(100,116,139,0.09)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.18)' }}>
                  {TESTIMONIALS[0].initials}
                </div>
                <div>
                  <div className="text-zinc-200 text-sm font-semibold">{TESTIMONIALS[0].author}</div>
                  <div className="text-zinc-600 text-xs mt-0.5">{TESTIMONIALS[0].role}</div>
                </div>
              </div>
            </motion.div>

            {/* Secondary testimonials — right 2/5, minimal */}
            <div className="md:col-span-2 flex flex-col gap-0">
              {TESTIMONIALS.slice(1).map(({ quote, author, role, initials }) => (
                <motion.div key={author} {...fadeUp(0)} className="flex flex-col flex-1 py-6 pl-0 md:pl-8 border-b border-surface-border last:border-b-0">
                  <div className="text-xl font-semibold leading-none text-zinc-700 mb-3 select-none">&ldquo;</div>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-5">{quote}</p>
                  <div className="flex items-center gap-2.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
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

          <motion.div {...fadeUp(0)}>
            <CtaStrip
              text="Podemos mostrar resultados similares en tu infraestructura. El diagnóstico no tiene costo."
              cta="Agendar diagnóstico"
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
        {/* Ambient bloom */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.025)_0%,transparent_65%)]" />
        </div>

        <motion.div {...fadeUp(0)} className="relative max-w-xl mx-auto text-center">
          <span className="label block mb-5">¿Listo para empezar?</span>

          <h2 className="text-3xl sm:text-4xl font-semibold text-noc-white mb-6 leading-[1.05] tracking-heading">
            Diagnóstico claro<br />
            <span className="text-gradient-steel">en 24 horas.</span>
          </h2>

          <p className="text-zinc-500 mb-8 leading-relaxed text-base">
            Un ingeniero revisa tu infraestructura, prioriza riesgos y te entrega una ruta técnica que tu equipo puede discutir, ajustar y ejecutar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/assessments" className="btn-amber text-[15px] px-10 py-4"
              onClick={() => trackCTA('Final CTA — Solicitar diagnóstico')}>
              Agendar diagnóstico →
            </Link>
            <Link href="/casos" className="btn-ghost text-[15px] px-10 py-4"
              onClick={() => trackCTA('Final CTA — Ver casos')}>
              Ver casos de éxito
            </Link>
          </div>

          {/* Trust items — plain monospace */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {['Sin contrato mínimo', 'Respuesta < 24 h', 'Ingenieros especializados', 'Propuesta sin costo'].map(text => (
              <span key={text} className="text-zinc-600 text-[11px] font-mono">{text}</span>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}
