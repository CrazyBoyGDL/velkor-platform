'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.35, ease: EASE, delay },
})

export type CasePhase = {
  label: string
  weeks: string
}

export type CaseStudy = {
  client: string
  sector: string
  year: string
  context?: string           // "85 hosts · 3 sedes · 200 empleados"
  durationWeeks?: number     // Total project weeks
  challenge: string          // One-line problem statement
  beforeState?: string[]     // Technical before-state bullets (max 4)
  solution: string           // What was implemented
  phases?: CasePhase[]       // Deployment timeline steps
  result: string             // Primary outcome metric
  resultSub: string          // Secondary metric / timeframe
  hex: string
  tags: string[]
}

// ── Before-state column ───────────────────────────────────────────────────────
function BeforeState({ items, challenge }: { items?: string[]; challenge: string }) {
  if (items?.length) {
    return (
      <div>
        <div className="label text-[9.5px] mb-3 text-zinc-700">Estado inicial</div>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] font-mono leading-snug">
              <span className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(239,68,68,0.55)' }}>✗</span>
              <span className="text-zinc-500">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <div>
      <div className="label text-[9.5px] mb-3 text-zinc-700">Desafío</div>
      <p className="text-zinc-500 text-sm leading-relaxed">{challenge}</p>
    </div>
  )
}

// ── Phases column ─────────────────────────────────────────────────────────────
function Phases({ phases, solution, hex }: { phases?: CasePhase[]; solution: string; hex: string }) {
  if (phases?.length) {
    return (
      <div>
        <div className="label text-[9.5px] mb-3 text-zinc-700">Implementación</div>
        <div className="space-y-2">
          {phases.map(({ label, weeks }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="text-[9px] font-mono font-bold flex-shrink-0 mt-0.5 tabular-nums"
                style={{ color: hex + 'aa', minWidth: '3.5rem' }}
              >
                {weeks}
              </span>
              <span className="text-[11px] font-mono text-zinc-500 leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="label text-[9.5px] mb-3 text-zinc-700">Solución implementada</div>
      <p className="text-zinc-500 text-sm leading-relaxed">{solution}</p>
    </div>
  )
}

// ── Result callout ────────────────────────────────────────────────────────────
function ResultCallout({ result, resultSub, durationWeeks, hex }: {
  result: string; resultSub: string; durationWeeks?: number; hex: string
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-1 py-2">
      <div className="text-[2rem] font-black font-mono leading-none tabular-nums" style={{ color: hex }}>
        {result}
      </div>
      <div className="text-zinc-600 text-[11px] mt-0.5">{resultSub}</div>
      {durationWeeks && (
        <div
          className="mt-3 px-2.5 py-1 rounded text-[9px] font-mono"
          style={{ background: hex + '12', color: hex + '99', border: `1px solid ${hex}22` }}
        >
          {durationWeeks} sem entrega
        </div>
      )}
    </div>
  )
}

// ── Case card ─────────────────────────────────────────────────────────────────
function CaseCard({ c, i }: { c: CaseStudy; i: number }) {
  const { client, sector, year, context, durationWeeks, challenge, beforeState, solution, phases, result, resultSub, hex, tags } = c

  return (
    <motion.article
      {...fadeUp(i * 0.06)}
      className="card overflow-hidden"
      style={{ borderLeft: `3px solid ${hex}50` }}
    >
      {/* Header row */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center flex-wrap gap-3">
          <h3 className="text-zinc-100 font-semibold text-[14px] leading-snug">{client}</h3>
          <span
            className="text-[9.5px] font-mono px-2 py-0.5 rounded"
            style={{ color: hex, background: hex + '18', border: `1px solid ${hex}28` }}
          >
            {sector}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {context && (
            <span className="text-[10px] font-mono text-zinc-700 hidden sm:block">{context}</span>
          )}
          <span className="label text-[9.5px] text-zinc-700">{year}</span>
        </div>
      </div>

      {/* Body — 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_140px] lg:grid-cols-[1fr_1fr_160px]">
        {/* Before state / challenge */}
        <div
          className="px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <BeforeState items={beforeState} challenge={challenge} />
        </div>

        {/* Phases / solution */}
        <div
          className="px-6 py-5 sm:border-l"
          style={{
            borderColor: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <Phases phases={phases} solution={solution} hex={hex} />
        </div>

        {/* Result */}
        <div
          className="px-5 py-5 sm:border-l"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <ResultCallout
            result={result}
            resultSub={resultSub}
            durationWeeks={durationWeeks}
            hex={hex}
          />
        </div>
      </div>

      {/* Footer — tags */}
      <div
        className="px-6 py-3 flex flex-wrap items-center gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        {tags.map(t => (
          <span
            key={t}
            className="text-[10px] font-mono text-zinc-600 px-2 py-0.5 rounded"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {t}
          </span>
        ))}
        {durationWeeks && (
          <span className="ml-auto text-[10px] font-mono text-zinc-700 sm:hidden">
            {durationWeeks} semanas
          </span>
        )}
      </div>
    </motion.article>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function CasosContent({ cases }: { cases: CaseStudy[] }) {
  return (
    <>
      {/* Case study list */}
      <div className="space-y-4">
        {cases.map((c, i) => (
          <CaseCard key={`${c.client}-${i}`} c={c} i={i} />
        ))}
      </div>

      {/* NDA note */}
      <motion.p
        {...fadeUp(0.2)}
        className="text-center text-[10px] font-mono mt-6"
        style={{ color: 'rgba(255,255,255,0.14)' }}
      >
        Datos de proyecto anonimizados · Referencias completas disponibles bajo NDA
      </motion.p>

      {/* Bottom CTA */}
      <motion.div
        {...fadeUp(0.28)}
        className="mt-12 card p-10 text-center"
        style={{ borderColor: 'rgba(37,99,235,0.18)' }}
      >
        <div
          className="text-4xl font-black font-mono mb-2 tabular-nums"
          style={{ color: '#3b82f6' }}
        >
          +50
        </div>
        <div className="text-zinc-500 text-sm mb-6">proyectos documentados desde 2016</div>
        <Link href="/assessments" className="btn-amber px-10 py-4 text-[15px]">
          Solicitar diagnóstico gratis →
        </Link>
      </motion.div>
    </>
  )
}
