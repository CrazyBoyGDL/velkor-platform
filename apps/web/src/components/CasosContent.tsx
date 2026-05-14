'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { reveal as fadeUp } from '@/lib/motion'

// ─── Data model ───────────────────────────────────────────────────────────────

export type CasePhase = {
  label:     string
  weeks:     string
  milestone?: string   // key deliverable in this phase
}

export type ArchDecision = {
  decision:  string
  rationale: string
}

export type CaseOutcome = {
  metric: string         // "100% adopción MFA"
  detail: string         // "62/62 usuarios · migración en 48 h"
}

export type CaseStudy = {
  // Header
  client:        string   // anonymized: "Empresa distribuidora · Monterrey"
  sector:        string
  year:          string
  durationWeeks: number

  // Operational context
  envSize:     string     // "200 empleados · 3 sedes"
  envEndpoints:string     // "85 endpoints Windows · 12 servidores"
  envPlatform: string     // "On-premises · ERP legacy · ISP-only firewall"

  // Problem
  challenge:    string    // one-line operational problem
  initialState: string[]  // before-state bullets (max 5)
  constraints:  string[]  // real implementation constraints (max 4)

  // Solution
  architectureDecisions: ArchDecision[]  // key technical choices
  phases: CasePhase[]                    // week-by-week timeline

  // Output
  deliverables: string[]    // what was handed off
  outcomes:     CaseOutcome[]

  // Display
  hex:  string
  tags: string[]

  // Legacy Strapi compat (rendered when new fields absent)
  context?:   string
  solution?:  string
  result?:    string
  resultSub?: string
  beforeState?: string[]
}

// ─── Section primitives ───────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] mb-3"
      style={{ color: 'rgba(255,255,255,0.22)' }}
    >
      {children}
    </div>
  )
}

function Separator() {
  return <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.046)' }} />
}

// ─── Operational context strip ────────────────────────────────────────────────

function ContextStrip({ c }: { c: CaseStudy }) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-1 px-6 py-3"
      style={{ background: 'rgba(255,255,255,0.018)', borderBottom: '1px solid rgba(255,255,255,0.046)' }}
    >
      {[
        { k: 'Personal',       v: c.envSize     },
        { k: 'Endpoints',      v: c.envEndpoints},
        { k: 'Plataforma',     v: c.envPlatform },
      ].map(({ k, v }) => v ? (
        <div key={k} className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">{k}</span>
          <span className="text-[10px] font-mono text-zinc-400">{v}</span>
        </div>
      ) : null)}
      <div className="ml-auto text-[9.5px] font-mono text-zinc-700">{c.durationWeeks} semanas</div>
    </div>
  )
}

// ─── Challenge banner ─────────────────────────────────────────────────────────

function ChallengeBanner({ text, hex }: { text: string; hex: string }) {
  return (
    <div
      className="px-6 py-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.046)', borderLeft: `3px solid ${hex}40` }}
    >
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: 'rgba(200,200,216,0.7)', fontStyle: 'italic' }}
      >
        {text}
      </p>
    </div>
  )
}

// ─── Before state + constraints (2-col) ──────────────────────────────────────

function ProblemGrid({ c }: { c: CaseStudy }) {
  const items = c.initialState?.length ? c.initialState : (c.beforeState ?? [])
  if (!items.length && !c.constraints?.length) return null

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}
    >
      {/* Initial state */}
      {items.length > 0 && (
        <div className="px-6 py-5 sm:border-r" style={{ borderColor: 'rgba(255,255,255,0.046)' }}>
          <SectionLabel>Estado inicial</SectionLabel>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-[10px] flex-shrink-0 mt-0.5 font-mono" style={{ color: 'rgba(200,70,70,0.55)' }}>✗</span>
                <span className="text-[11px] font-mono text-zinc-500 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {c.constraints?.length > 0 && (
        <div className="px-6 py-5">
          <SectionLabel>Restricciones operacionales</SectionLabel>
          <div className="space-y-2">
            {c.constraints.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-[10px] flex-shrink-0 mt-0.5 font-mono" style={{ color: 'rgba(176,120,40,0.65)' }}>⚠</span>
                <span className="text-[11px] font-mono text-zinc-500 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Architecture decisions ───────────────────────────────────────────────────

function ArchDecisions({ decisions, hex }: { decisions: ArchDecision[]; hex: string }) {
  if (!decisions?.length) return null
  return (
    <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}>
      <SectionLabel>Decisiones de arquitectura</SectionLabel>
      <div className="space-y-3">
        {decisions.map((d, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="text-[9px] font-mono font-bold flex-shrink-0 tabular-nums mt-0.5"
              style={{ color: hex + 'aa', minWidth: '1.4rem' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <span className="text-[12px] text-zinc-300 font-medium">{d.decision}</span>
              <span className="text-zinc-700 mx-2 font-mono">──</span>
              <span className="text-[11px] text-zinc-600 font-mono">{d.rationale}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Deployment timeline ──────────────────────────────────────────────────────

function Timeline({ phases, hex }: { phases: CasePhase[]; hex: string }) {
  if (!phases?.length) return null
  return (
    <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}>
      <SectionLabel>Despliegue</SectionLabel>
      <div className="flex flex-wrap gap-0 relative">
        {phases.map(({ label, weeks, milestone }, i) => (
          <div key={i} className="flex items-start gap-0 flex-1 min-w-[120px] max-w-[200px]">
            {/* Phase block */}
            <div className="flex-1 pr-3">
              <div
                className="text-[9px] font-mono font-bold mb-1 tabular-nums"
                style={{ color: hex + '88' }}
              >
                {weeks}
              </div>
              <div className="text-[11px] text-zinc-400 leading-snug">{label}</div>
              {milestone && (
                <div className="text-[10px] font-mono text-zinc-700 mt-0.5 leading-snug">{milestone}</div>
              )}
            </div>
            {/* Connector */}
            {i < phases.length - 1 && (
              <div className="flex-shrink-0 mt-3 mr-3 text-zinc-800 font-mono text-[10px]">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Deliverables + outcomes grid ────────────────────────────────────────────

function DeliverablesOutcomes({ c }: { c: CaseStudy }) {
  const hasDeliverables = c.deliverables?.length > 0
  const hasOutcomes     = c.outcomes?.length > 0

  // Legacy fallback: result + resultSub
  const legacyOutcome = c.result ? [{ metric: c.result, detail: c.resultSub ?? '' }] : []
  const outcomes      = hasOutcomes ? c.outcomes : legacyOutcome

  if (!hasDeliverables && !outcomes.length) return null

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}
    >
      {hasDeliverables && (
        <div className="px-6 py-5 sm:border-r" style={{ borderColor: 'rgba(255,255,255,0.046)' }}>
          <SectionLabel>Entregables</SectionLabel>
          <div className="space-y-2">
            {c.deliverables.map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-zinc-700 flex-shrink-0 mt-0.5">→</span>
                <span className="text-[11px] font-mono text-zinc-500 leading-snug">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {outcomes.length > 0 && (
        <div className="px-6 py-5">
          <SectionLabel>Resultados operacionales</SectionLabel>
          <div className="space-y-2.5">
            {outcomes.map(({ metric, detail }, i) => (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono" style={{ color: '#3a7858' }}>✓</span>
                  <span className="text-[12px] font-semibold text-zinc-300">{metric}</span>
                </div>
                {detail && (
                  <div className="text-[10px] font-mono text-zinc-600 ml-4 mt-0.5">{detail}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Case card ────────────────────────────────────────────────────────────────

function CaseCard({ c, i }: { c: CaseStudy; i: number }) {
  return (
    <motion.article
      {...fadeUp(i * 0.06)}
      className="overflow-hidden"
      style={{
        borderLeft: `2px solid ${c.hex}30`,
        background:   'rgba(255,255,255,0.013)',
        borderRadius: '0 12px 12px 0',
        border:       `1px solid rgba(255,255,255,0.05)`,
        borderLeftColor: c.hex + '30',
        borderLeftWidth: 2,
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center flex-wrap gap-3">
          <span
            className="text-[9.5px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-[0.1em]"
            style={{ color: c.hex, background: c.hex + '18', border: `1px solid ${c.hex}28` }}
          >
            {c.sector}
          </span>
          <h3 className="text-zinc-200 font-semibold text-[13px] leading-snug">{c.client}</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-zinc-700">{c.year}</span>
        </div>
      </div>

      {/* Operational context */}
      <ContextStrip c={c} />

      {/* Challenge */}
      <ChallengeBanner text={c.challenge} hex={c.hex} />

      {/* Before state + constraints */}
      <ProblemGrid c={c} />

      {/* Architecture decisions */}
      <ArchDecisions decisions={c.architectureDecisions} hex={c.hex} />

      {/* Timeline */}
      <Timeline phases={c.phases} hex={c.hex} />

      {/* Deliverables + outcomes */}
      <DeliverablesOutcomes c={c} />

      {/* Tags footer */}
      <div
        className="px-6 py-3 flex flex-wrap items-center gap-2"
      >
        {c.tags.map(t => (
          <span
            key={t}
            className="text-[9.5px] font-mono text-zinc-700 px-2 py-0.5 rounded"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CasosContent({ cases }: { cases: CaseStudy[] }) {
  return (
    <>
      <div className="space-y-5">
        {cases.map((c, i) => (
          <CaseCard key={`${c.client}-${i}`} c={c} i={i} />
        ))}
      </div>

      {/* NDA note */}
      <motion.p
        {...fadeUp(0)}
        className="text-center text-[10px] font-mono mt-8"
        style={{ color: 'rgba(255,255,255,0.12)' }}
      >
        Datos de proyecto anonimizados · Arquitectura, configuraciones y métricas verificadas · Referencias completas disponibles bajo NDA
      </motion.p>

      {/* CTA */}
      <motion.div
        {...fadeUp(0)}
        className="mt-10 card p-8 sm:p-10"
        style={{ borderColor: 'rgba(72,120,176,0.14)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="label text-[9.5px] mb-2">¿Tu entorno tiene condiciones similares?</div>
            <h2 className="text-xl font-black text-noc-white mb-2">
              Evaluación técnica sin compromiso
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
              15 preguntas · 10 minutos · Resultado inmediato con nivel de madurez, hallazgos y prioridades operacionales específicas.
            </p>
          </div>
          <Link
            href="/assessments"
            className="btn-amber px-8 py-3.5 text-[14px] flex-shrink-0 text-center"
          >
            Iniciar evaluación →
          </Link>
        </div>
      </motion.div>
    </>
  )
}
