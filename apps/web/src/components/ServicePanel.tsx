'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'

export interface ServicePanelData {
  icon: string
  title: string
  desc: string
  outcome?: string    // anonymized project reference — evidence footer
  hex: string
  uptime: number
  incidents: number
  tags: string[]
  sparkline: number[] // kept for interface compatibility
  href?: string
  ref?: string        // dossier reference number, e.g. VELK-NET-001
  scope?: string      // deployment scope label, e.g. "85 hosts" or "Prod · CDMX"
  sla?: string        // explicit SLA string, falls back to uptime
}

export default function ServicePanel({ data }: { data: ServicePanelData }) {
  const {
    icon, title, desc, outcome, hex, uptime, incidents, tags,
    href = '/servicios',
    ref: dossierRef = 'VELK-SVC',
    scope = 'Prod',
    sla,
  } = data

  const cardRef = useRef<HTMLDivElement>(null)

  // Subtle 3-D tilt on hover (±2.5°) — premium spring feel
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 380, damping: 36 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2.5, 2.5]), { stiffness: 380, damping: 36 })
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - left) / width - 0.5)
    mouseY.set((e.clientY - top)  / height - 0.5)
  }
  function onLeave() { mouseX.set(0); mouseY.set(0) }

  // Derived metric values
  const slaDisplay    = sla ?? `${uptime}%`
  const uptimeDisplay = `${uptime}%`

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.006 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative rounded-xl overflow-hidden cursor-default group h-full"
    >
      {/* Card base — midnight navy toned */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(145deg, #0b1120, #080e1a)',
          border:     '1px solid rgba(56,100,160,0.14)',
          boxShadow:  '0 4px 20px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.025) inset',
        }}
      />

      {/* Accent line — service domain color */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}40, transparent)` }}
      />

      {/* Mouse-tracking specular highlight */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.028) 0%, transparent 58%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">

        {/* ── Dossier header bar ────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-2.5"
          style={{ borderBottom: '1px solid rgba(56,100,160,0.09)' }}
        >
          <span
            className="text-[8.5px] font-mono tracking-widest"
            style={{ color: 'rgba(100,116,139,0.50)' }}
          >
            {dossierRef}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: hex, opacity: 0.75 }}
            />
            <span
              className="text-[8.5px] font-mono font-medium tracking-wider"
              style={{ color: hex + 'aa' }}
            >
              ACTIVO
            </span>
          </div>
        </div>

        {/* ── Icon + title ──────────────────────────────────────────────────── */}
        <div className="px-5 pt-4 pb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 flex-shrink-0"
            style={{ background: hex + '12', border: `1px solid ${hex}20`, color: hex }}
          >
            <span style={{ fontSize: '1rem' }}>{icon}</span>
          </div>
          <h3 className="text-zinc-100 font-semibold text-[14.5px] leading-snug">{title}</h3>
        </div>

        {/* ── Operational metrics row ───────────────────────────────────────── */}
        <div
          className="grid grid-cols-4 mx-5 mb-3 rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(56,100,160,0.10)', background: 'rgba(11,16,28,0.55)' }}
        >
          {[
            { k: 'UPTIME',    v: uptimeDisplay   },
            { k: 'INCID.',    v: String(incidents) },
            { k: 'SLA',       v: slaDisplay       },
            { k: 'ENTORNO',   v: scope            },
          ].map(({ k, v }, i) => (
            <div
              key={k}
              className="px-2 py-2 text-center"
              style={{ borderLeft: i > 0 ? '1px solid rgba(56,100,160,0.09)' : undefined }}
            >
              <div
                className="text-[7.5px] font-mono uppercase mb-0.5 tracking-widest"
                style={{ color: 'rgba(100,116,139,0.40)' }}
              >
                {k}
              </div>
              <div
                className="text-[10.5px] font-mono font-semibold tabular-nums leading-tight"
                style={{ color: k === 'INCID.' && v === '0' ? 'rgba(34,197,94,0.75)' : 'rgba(148,163,184,0.75)' }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>

        {/* ── Description ───────────────────────────────────────────────────── */}
        <p className="text-zinc-500 text-[13px] leading-relaxed px-5 pb-4 flex-1">{desc}</p>

        {/* ── Technology tags ───────────────────────────────────────────────── */}
        <div
          className="flex flex-wrap gap-1.5 px-5 pb-4"
          style={{ borderBottom: '1px solid rgba(56,100,160,0.07)' }}
        >
          {tags.map(t => (
            <span
              key={t}
              className="text-[9.5px] font-mono px-2 py-0.5 rounded"
              style={{
                background: 'rgba(255,255,255,0.03)',
                color:      'rgba(100,116,139,0.65)',
                border:     '1px solid rgba(255,255,255,0.055)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* ── Evidence footer + CTA ─────────────────────────────────────────── */}
        <div className="px-5 pt-3.5 pb-5">
          {outcome && (
            <div
              className="flex items-start gap-1.5 mb-3.5 text-[9px] font-mono leading-relaxed"
              style={{ color: 'rgba(100,116,139,0.55)' }}
            >
              <span style={{ color: hex + '55', flexShrink: 0 }}>↗</span>
              {outcome}
            </div>
          )}
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-colors"
            style={{ color: hex + 'bb' }}
            onMouseEnter={e => (e.currentTarget.style.color = hex)}
            onMouseLeave={e => (e.currentTarget.style.color = hex + 'bb')}
          >
            Ver detalle
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </motion.div>
  )
}
