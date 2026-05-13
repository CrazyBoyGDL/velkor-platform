'use client'
import { motion } from 'framer-motion'
import InfraTopology from '@/components/InfraTopology'

const EASE = [0.16, 1, 0.3, 1] as const

// Five operational layers — each mapped to an infrastructure domain
const LAYERS = [
  { id: 'RED-NGFW',  label: 'RED · NGFW',  color: '#3b82f6', coverage: 100 },
  { id: 'IDENTIDAD', label: 'IDENTIDAD',   color: '#22c55e', coverage: 100 },
  { id: 'M365',      label: 'M365',        color: '#3b82f6', coverage: 100 },
  { id: 'ENDPOINT',  label: 'ENDPOINT',    color: '#22c55e', coverage:  94 },
  { id: 'CCTV-IP',   label: 'CCTV · IP',   color: '#06b6d4', coverage: 100 },
]

// Three executive KPIs — shown in the footer bar
const METRICS = [
  { label: 'SLA',           value: '99.8%', color: '#22c55e' },
  { label: 'INCIDENTES',    value: '0',      color: '#22c55e' },
  { label: 'CAPAS ACTIVAS', value: '6 / 6',  color: '#3b82f6' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function HeroOperationalFrame() {
  return (
    <div
      className="relative rounded-xl overflow-hidden select-none w-full"
      style={{
        background: 'rgba(6,10,20,0.95)',
        border:     '1px solid rgba(56,100,160,0.14)',
        boxShadow:  '0 0 0 1px rgba(56,100,160,0.05) inset, 0 24px 64px rgba(0,0,0,0.45)',
      }}
    >
      {/* ── Status bar ───────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          borderBottom: '1px solid rgba(56,100,160,0.10)',
          background:   'rgba(11,16,24,0.80)',
        }}
      >
        <div className="flex items-center gap-2.5">
          {/* Operational pulse */}
          <motion.span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: 'rgba(34,197,94,0.9)',
              boxShadow:  '0 0 6px rgba(34,197,94,0.45)',
            }}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          />
          <span
            className="text-[9.5px] font-mono tracking-widest uppercase"
            style={{ color: 'rgba(148,163,184,0.65)' }}
          >
            Velkor Managed Platform
          </span>
          <span className="text-[9.5px] font-mono mx-0.5" style={{ color: 'rgba(56,100,160,0.4)' }}>·</span>
          <span
            className="text-[9.5px] font-mono font-semibold tracking-wider"
            style={{ color: 'rgba(34,197,94,0.80)' }}
          >
            OPERATIVO
          </span>
        </div>
        <span
          className="text-[8px] font-mono"
          style={{ color: 'rgba(100,116,139,0.40)' }}
        >
          VMP-2025-001
        </span>
      </div>

      {/* ── Infrastructure topology ───────────────────────────────────────────── */}
      <div className="relative px-2 pt-0 pb-0">
        {/* Subtle inner radial bloom behind the topology */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(37,99,235,0.04) 0%, transparent 70%)',
          }}
        />
        <InfraTopology />
      </div>

      {/* ── Layer coverage bars ───────────────────────────────────────────────── */}
      <div
        className="px-4 pb-3"
        style={{ borderTop: '1px solid rgba(56,100,160,0.08)' }}
      >
        <div className="flex items-center justify-between pt-3 mb-2.5">
          <span
            className="text-[8px] font-mono uppercase tracking-[0.20em]"
            style={{ color: 'rgba(100,116,139,0.45)' }}
          >
            Cobertura por capa
          </span>
          <span
            className="text-[8px] font-mono"
            style={{ color: 'rgba(100,116,139,0.30)' }}
          >
            Actualizado: ahora
          </span>
        </div>

        <div className="space-y-1.5">
          {LAYERS.map(({ id, label, color, coverage }, i) => (
            <div key={id} className="flex items-center gap-3">
              {/* Layer name */}
              <span
                className="text-[8px] font-mono w-[5.5rem] flex-shrink-0"
                style={{ color: 'rgba(100,116,139,0.60)' }}
              >
                {label}
              </span>

              {/* Coverage bar */}
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: '2px', background: 'rgba(255,255,255,0.055)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color }}
                  initial={{ width: '0%', opacity: 0 }}
                  animate={{ width: `${coverage}%`, opacity: 0.65 }}
                  transition={{ duration: 0.85, ease: EASE, delay: 0.40 + i * 0.07 }}
                />
              </div>

              {/* Percentage */}
              <span
                className="text-[8px] font-mono w-7 text-right flex-shrink-0 tabular-nums"
                style={{ color: color + 'aa' }}
              >
                {coverage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Executive metrics footer ──────────────────────────────────────────── */}
      <div
        className="grid grid-cols-3"
        style={{ borderTop: '1px solid rgba(56,100,160,0.10)' }}
      >
        {METRICS.map(({ label, value, color }, i) => (
          <div
            key={label}
            className="px-4 py-3 text-center"
            style={{
              borderLeft: i > 0 ? '1px solid rgba(56,100,160,0.08)' : undefined,
            }}
          >
            <div
              className="text-[8px] font-mono mb-1 uppercase tracking-widest"
              style={{ color: 'rgba(100,116,139,0.45)' }}
            >
              {label}
            </div>
            <div
              className="text-[13px] font-bold font-mono tabular-nums"
              style={{ color }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
