'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import InfraTopology from '@/components/InfraTopology'
import RiskExposure from '@/components/RiskExposure'
import TrustValidationLayer from '@/components/TrustValidationLayer'
import { trackCTA } from '@/components/Analytics'
import { EASE, reveal as fadeUp, enter as heroUp } from '@/lib/motion'

const NetworkBg = dynamic(() => import('@/components/NetworkBg'), { ssr: false })

export type FeaturedCaseSummary = {
  sector: string
  title: string
  summary: string
  outcomes: string[]
  href: string
}

const HERO_SIGNALS = [
  'Redes, identidad y seguridad operables',
  'Alcance claro antes de tocar producción',
  'Evidencia y responsables al cierre',
]

const WORKFLOW = [
  {
    step: '01',
    title: 'Diagnóstico',
    detail: 'Entendemos sedes, usuarios, proveedores, sistemas críticos y riesgos que ya afectan operación.',
  },
  {
    step: '02',
    title: 'Ruta técnica',
    detail: 'Priorizamos controles, definimos exclusiones y dejamos una ruta que dirección e IT pueden revisar juntos.',
  },
  {
    step: '03',
    title: 'Implementación',
    detail: 'Ejecutamos por ventanas, con rollback, evidencia y transferencia para el equipo que queda operando.',
  },
]

function Hero() {
  return (
    <section className="relative flex items-start lg:items-center overflow-hidden lg:min-h-[82vh] hero-depth-stage">
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-atmospheric-layer" />
        <div className="absolute inset-0 bg-topology opacity-20" />
        <NetworkBg />
        <div className="absolute bottom-0 left-0 right-0 h-56 hero-bottom-fade" />
      </div>

      <motion.div
        className="absolute inset-y-0 right-0 hidden lg:flex items-center pointer-events-none"
        style={{ width: '58%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.78 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
      >
        <div className="absolute inset-y-0 left-0 z-10 hero-topology-dissolve" style={{ width: '46%' }} />
        <motion.div
          className="w-full"
          animate={{ y: [0, -2, 0], x: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 36, ease: 'easeInOut' }}
        >
          <InfraTopology />
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="lg:max-w-[43rem] py-16 sm:py-20 lg:py-28">
          <motion.div {...heroUp(0)} className="flex items-center gap-3 mb-6">
            <div className="w-5 h-px flex-shrink-0 bg-white/[0.10]" />
            <span className="label">Consultoría de infraestructura IT</span>
          </motion.div>

          <motion.h1 {...heroUp(0.02)} className="display-heading mb-6 max-w-3xl">
            Infraestructura empresarial clara, segura y documentada.
          </motion.h1>

          <motion.p {...heroUp(0.04)} className="editorial-lede mb-8 max-w-[34rem]">
            Velkor ordena redes, identidad y endpoints para operar con alcance claro, evidencia y control.
          </motion.p>

          <motion.div {...heroUp(0.06)} className="flex flex-col sm:flex-row gap-3 mb-9">
            <Link
              href="/assessments"
              className="btn-amber text-[14px] px-7 py-3.5"
              onClick={() => trackCTA('Hero - Evaluación técnica', 'hero')}
            >
              Solicitar evaluación técnica →
            </Link>
            <Link
              href="/casos"
              className="btn-ghost text-[14px] px-7 py-3.5"
              onClick={() => trackCTA('Hero - Casos técnicos', 'hero')}
            >
              Ver casos técnicos
            </Link>
          </motion.div>

          <motion.div {...heroUp(0.08)} className="hidden sm:grid sm:grid-cols-3 gap-3 max-w-3xl hero-operational-rail">
            {HERO_SIGNALS.map((signal) => (
              <div key={signal} className="home-signal">
                {signal}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  return (
    <section className="home-section px-4 sm:px-8 continuity-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[0.76fr_1.24fr] gap-12 lg:gap-20 items-start">
          <motion.div {...fadeUp(0)}>
            <span className="label block mb-5">Cómo trabaja Velkor</span>
            <h2 className="section-heading max-w-xl mb-5">Menos ruido. Más decisión técnica.</h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-md">
              La primera conversación no busca vender hardware. Busca separar lo crítico de lo conveniente y dejar claro qué puede ejecutarse sin improvisar.
            </p>
          </motion.div>

          <div className="home-process depth-0">
            {WORKFLOW.map(({ step, title, detail }) => (
              <motion.div key={step} {...fadeUp(0)} className="home-process-row">
                <span className="font-mono text-[11px] text-zinc-700 tabular-nums">{step}</span>
                <div>
                  <h3 className="text-zinc-100 text-[16px] font-semibold mb-2">{title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedCaseSection({ featuredCase }: { featuredCase: FeaturedCaseSummary }) {
  return (
    <section className="home-section px-4 sm:px-8 section-arch continuity-section">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp(0)}>
            <span className="label block mb-5">Caso destacado</span>
            <h2 className="section-heading mb-5 max-w-2xl">{featuredCase.title}</h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-xl">{featuredCase.summary}</p>
          </motion.div>

          <motion.div {...fadeUp(0.02)} className="home-case-panel depth-focus proximity-surface">
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
    <>
      <Hero />
      <div className="section-divider" />
      <RiskExposure />
      <WorkflowSection />
      <FeaturedCaseSection featuredCase={featuredCase} />
      <TrustValidationLayer />
    </>
  )
}
