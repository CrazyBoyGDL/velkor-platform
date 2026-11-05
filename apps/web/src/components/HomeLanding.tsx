'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AdaptiveCTA from '@/components/AdaptiveCTA'
import InfraTopology from '@/components/InfraTopology'
import RiskExposure from '@/components/RiskExposure'
import TrustValidationLayer from '@/components/TrustValidationLayer'
import HumanConsultiveLayer from '@/components/HumanConsultiveLayer'
import { trackCTA } from '@/components/Analytics'
import { EASE, reveal as fadeUp, enter as heroUp } from '@/lib/motion'
import { useLowPowerMotion } from '@/lib/motion/operationalMotion'

export type FeaturedCaseSummary = {
  sector: string
  title: string
  summary: string
  outcomes: string[]
  href: string
}

const HERO_EVIDENCE = [
  { label: 'Red', value: 'VLAN segmentada', meta: '6 zonas activas' },
  { label: 'Firewall', value: 'FortiGate hardened', meta: 'políticas aplicadas' },
  { label: 'Identidad', value: 'MFA obligatorio', meta: '100% cumplimiento' },
  { label: 'Rollback', value: 'Ventana protegida', meta: 'retorno listo' },
]

const HERO_STATES = [
  { label: 'Monitoreo continuo', tone: 'sync' },
  { label: 'Cambios trazables', tone: 'route' },
  { label: 'Rollback listo', tone: 'safe' },
]

const WORKFLOW = [
  {
    step: '01',
    title: 'Ubicar el riesgo real',
    detail: 'Red plana, cuentas sin MFA, VPN abierta, cámaras expuestas o equipos sin inventario.',
  },
  {
    step: '02',
    title: 'Priorizar cambios seguros',
    detail: 'Qué se corrige primero, qué se deja fuera, quién aprueba y cómo se regresa si algo falla.',
  },
  {
    step: '03',
    title: 'Dejar evidencia operable',
    detail: 'Reglas, excepciones, responsables, pendientes y handoff para que el equipo pueda operar.',
  },
]

const PROCESS_PROOF = [
  'Riesgos priorizados',
  'Cambios con dueño',
  'Evidencia usable',
]

const DECISION_LINE = [
  {
    label: 'Qué hacemos',
    value: 'Protegemos redes, accesos, equipos y sistemas de videovigilancia.',
  },
  {
    label: 'Para quién',
    value: 'Empresas que necesitan reducir riesgos y mantener sus operaciones en marcha.',
  },
  {
    label: 'Qué entregamos',
    value: 'Un plan claro con prioridades, responsables y resultados documentados.',
  },
  {
    label: 'Cómo empieza',
    value: 'Cuéntanos qué necesitas y revisaremos contigo los siguientes pasos.',
  },
] as const

const AVOIDED_PATTERNS = [
  'MFA parcial sin excepciones documentadas',
  'Segmentación superficial sin reglas entre zonas',
  'Monitoreo que no dispara responsables reales',
]

const ENTERPRISE_ASSURANCE = [
  {
    step: '01',
    tone: 'scope',
    label: 'Alcance',
    title: 'Mapa de exposición',
    detail: 'Qué está en riesgo, qué depende de operación y qué no se toca sin ventana.',
  },
  {
    step: '02',
    tone: 'control',
    label: 'Control',
    title: 'Cambio con dueño',
    detail: 'Responsables, aprobaciones, restricciones y rutas de rollback antes de mover producción.',
  },
  {
    step: '03',
    tone: 'evidence',
    label: 'Evidencia',
    title: 'Entrega verificable',
    detail: 'Reglas, excepciones, hallazgos, pendientes y decisiones sanitizadas para auditoría interna.',
  },
  {
    step: '04',
    tone: 'handoff',
    label: 'Continuidad',
    title: 'Siguiente paso operable',
    detail: 'Qué queda cerrado, qué requiere fase dos y qué puede operar tu equipo sin improvisar.',
  },
] as const

const ENTERPRISE_PROMISES = [
  'Sin vendor lock-in forzado',
  'Rollback antes de producción',
  'Evidencia bajo NDA',
] as const

function Hero() {
  const lowPowerMotion = useLowPowerMotion(true)

  return (
    <section
      className="relative flex items-start lg:items-center overflow-hidden hero-depth-stage spatial-hero-field"
      data-flow-region="hero"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-atmospheric-layer" />
        <div className="absolute bottom-0 left-0 right-0 h-56 hero-bottom-fade" />
      </div>

      {!lowPowerMotion && (
        <motion.div
          className="hero-topology-plane absolute inset-0 hidden lg:flex items-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.94 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
        >
          <motion.div
            className="hero-topology-field"
            animate={{ y: [0, -2, 0], x: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 36, ease: 'easeInOut' }}
          >
            <InfraTopology />
          </motion.div>
          <div className="hero-evidence-summary">
            <div className="hero-evidence-heading">
              <span>Controles de ejemplo</span>
              <strong>infraestructura protegida</strong>
            </div>
            <div className="hero-evidence-grid">
              {HERO_EVIDENCE.map(item => (
                <div key={item.label} className="hero-evidence-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <em>{item.meta}</em>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="hero-content-plane relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="lg:max-w-[41rem] py-14 sm:py-[4.75rem] lg:py-24">
          <motion.div {...heroUp(0)} className="flex items-center gap-3 mb-6">
            <div className="w-5 h-px flex-shrink-0 bg-white/[0.10]" />
            <span className="label">Infraestructura operacional</span>
          </motion.div>

          <motion.h1 {...heroUp(0.02)} className="display-heading mb-6 max-w-[44rem]">
            Redes y ciberseguridad para que tu empresa <span className="hero-heading-accent">siga operando.</span>
          </motion.h1>

          <motion.p {...heroUp(0.04)} className="editorial-lede mb-8 max-w-[34rem]">
            Ayudamos a empresas a proteger sus redes, accesos y equipos. Revisamos tu situación,
            priorizamos los riesgos y te acompañamos en los cambios.
          </motion.p>

          <motion.div {...heroUp(0.06)} className="flex flex-col sm:flex-row gap-3 mb-9">
            <AdaptiveCTA intent="operational-review" location="hero" compact className="adaptive-cta-hero" />
            <Link
              href="/casos"
              className="btn-ghost text-[14px] px-7 py-3.5"
              onClick={() => trackCTA('Hero - Casos reales', 'hero')}
            >
              Ver casos reales
            </Link>
          </motion.div>

          <motion.div {...heroUp(0.07)} className="hero-operational-states" aria-label="Estados operacionales">
            {HERO_STATES.map(state => (
              <span key={state.label} className={`hero-operational-state hero-operational-state--${state.tone}`}>
                <i aria-hidden="true" />
                {state.label}
              </span>
            ))}
          </motion.div>

          <motion.div {...heroUp(0.08)} className="hero-evidence-summary hero-evidence-summary--mobile lg:hidden">
            <div className="hero-evidence-heading">
              <span>Controles de ejemplo</span>
              <strong>infraestructura protegida</strong>
            </div>
            <div className="hero-evidence-grid">
              {HERO_EVIDENCE.map(item => (
                <div key={item.label} className="hero-evidence-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <em>{item.meta}</em>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  return (
    <section className="home-section px-4 sm:px-8 continuity-section" data-flow-region="workflow">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[0.76fr_1.24fr] gap-12 lg:gap-20 items-start">
          <motion.div {...fadeUp(0)}>
            <span className="label block mb-5">Cómo trabaja Velkor</span>
            <h2 className="section-heading max-w-xl mb-5">Primero entendemos la presión. Luego ordenamos el cambio.</h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-md">
              La primera conversación separa urgencia, dependencia y riesgo aceptable.
            </p>
          </motion.div>

          <div className="home-process">
            {WORKFLOW.map(({ step, title, detail }) => (
              <motion.div key={step} {...fadeUp(0)} className="home-process-row">
                <span className="font-mono text-[11px] text-zinc-700 tabular-nums">{step}</span>
                <div>
                  <h3 className="text-zinc-100 text-[16px] font-semibold mb-2">{title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{detail}</p>
                </div>
              </motion.div>
            ))}
            <div className="home-process-proof">
              {PROCESS_PROOF.map(item => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="home-avoidance">
              <span>Lo que evitamos</span>
              {AVOIDED_PATTERNS.map(item => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DecisionLineSection() {
  return (
    <section className="px-4 sm:px-8 continuity-section home-decision-section" data-flow-region="decision-line">
      <div className="max-w-7xl mx-auto">
        <div className="home-decision-line" aria-label="Resumen de decisión Velkor">
          {DECISION_LINE.map(item => (
            <div key={item.label} className="home-decision-item">
              <span>{item.label}</span>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EnterpriseAssuranceSection() {
  return (
    <section
      className="enterprise-assurance-section px-4 sm:px-8 continuity-section"
      data-flow-region="enterprise-assurance"
      data-mobile-sticky-avoid="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="enterprise-assurance-layout">
          <motion.div {...fadeUp(0)} className="enterprise-assurance-copy">
            <span className="label block mb-5">Consultoría enterprise</span>
            <h2 className="section-heading mb-5 max-w-2xl">
              Un camino visible antes de tocar producción.
            </h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-xl">
              Velkor no vende una plataforma SaaS: guía decisiones técnicas con evidencia, límites claros
              y una ruta de cambio que el negocio puede aprobar.
            </p>
            <div className="enterprise-assurance-promises" aria-label="Compromisos de trabajo">
              {ENTERPRISE_PROMISES.map(item => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.03)} className="enterprise-assurance-map" aria-label="Ruta visual de consultoría Velkor">
            <div className="enterprise-assurance-route" aria-hidden="true" />
            {ENTERPRISE_ASSURANCE.map(item => (
              <div key={item.step} className={`enterprise-assurance-node enterprise-assurance-node--${item.tone}`}>
                <span className="enterprise-assurance-step">{item.step}</span>
                <div>
                  <small>{item.label}</small>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturedCaseSection({ featuredCase }: { featuredCase: FeaturedCaseSummary }) {
  return (
    <section className="home-section px-4 sm:px-8 section-arch continuity-section" data-flow-region="case">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp(0)}>
            <span className="label block mb-5">Caso destacado</span>
            <h2 className="section-heading mb-5 max-w-2xl">{featuredCase.title}</h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-xl">{featuredCase.summary}</p>
          </motion.div>

          <motion.div {...fadeUp(0.02)} className="home-case-panel proximity-surface">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <div className="text-[10px] font-mono text-zinc-700 mb-2">SECTOR</div>
                <div className="text-zinc-200 font-semibold">{featuredCase.sector}</div>
              </div>
              <Link
                href={featuredCase.href}
                className="text-[12px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                onClick={() => trackCTA('Featured case - Ver casos', 'featured-case')}
              >
                Ver caso completo →
              </Link>
            </div>
            <div className="grid gap-0">
              {featuredCase.outcomes.map((outcome) => (
                <div key={outcome} className="home-case-row">
                  <span className="w-1.5 h-1.5 rounded-full bg-[rgba(99,143,169,0.65)] mt-2 flex-shrink-0" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function HomeLanding({ featuredCase }: { featuredCase: FeaturedCaseSummary }) {
  return (
    <div className="home-flow">
      <Hero />
      <DecisionLineSection />
      <EnterpriseAssuranceSection />
      <div className="section-flow-bridge" aria-hidden="true" />
      <RiskExposure />
      <div className="section-flow-bridge section-flow-bridge--quiet" aria-hidden="true" />
      <WorkflowSection />
      <FeaturedCaseSection featuredCase={featuredCase} />
      <HumanConsultiveLayer />
      <TrustValidationLayer />
    </div>
  )
}
