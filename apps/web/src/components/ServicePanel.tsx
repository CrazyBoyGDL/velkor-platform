'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'

export interface ServicePanelData {
  icon: string
  title: string
  desc: string
  outcome?: string  // sanitized project evidence — what was delivered
  scope?: string    // implementation architecture reference
  hex: string
  tags: string[]
  href?: string
}

export default function ServicePanel({ data }: { data: ServicePanelData }) {
  const { icon, title, desc, outcome, scope, hex, tags, href = '/servicios' } = data
  const cardRef = useRef<HTMLDivElement>(null)

  // Subtle 3-D tilt on hover (±2°) — physical inertia spring
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), { stiffness: 320, damping: 40 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), { stiffness: 320, damping: 40 })
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - left) / width - 0.5)
    mouseY.set((e.clientY - top)  / height - 0.5)
  }
  function onLeave() { mouseX.set(0); mouseY.set(0) }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.004 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
      className="relative rounded-xl overflow-hidden cursor-default group h-full"
    >
      {/* Card base — midnight navy */}
      <div className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(150deg, #0a1020, #060d18)',
          border: '1px solid rgba(56,100,160,0.07)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
        }}
      />

      {/* Domain accent line — top edge, very subtle */}
      <div className="absolute top-0 left-5 right-5 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}38, transparent)` }}
      />

      {/* Mouse-tracking specular */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.022) 0%, transparent 55%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col h-full">

        {/* Icon */}
        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 flex-shrink-0"
          style={{ background: hex + '10', border: `1px solid ${hex}1e`, color: hex + 'cc' }}>
          <span style={{ fontSize: '0.95rem' }}>{icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-zinc-100 font-semibold text-[14px] leading-snug mb-2.5">{title}</h3>

        {/* Description */}
        <p className="text-zinc-500 text-[13px] leading-relaxed mb-4 flex-1">{desc}</p>

        {/* Technology tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map(t => (
            <span key={t}
              className="text-[9.5px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(100,116,139,0.65)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
              {t}
            </span>
          ))}
        </div>

        {/* Architecture scope — implementation reference */}
        {scope && (
          <div className="text-[9.5px] font-mono mb-3 leading-relaxed"
            style={{ color: 'rgba(100,116,139,0.40)' }}>
            {scope}
          </div>
        )}

        {/* Outcome — sanitized project evidence */}
        {outcome && (
          <div className="text-[10px] font-mono mb-4"
            style={{ color: 'rgba(100,116,139,0.50)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
            {outcome}
          </div>
        )}

        {/* CTA */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.875rem' }}>
          <Link href={href}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-colors duration-150"
            style={{ color: hex + 'aa' }}
            onMouseEnter={e => (e.currentTarget.style.color = hex)}
            onMouseLeave={e => (e.currentTarget.style.color = hex + 'aa')}
          >
            Ver detalle
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
