'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'

export interface ServicePanelData {
  icon: string
  title: string
  desc: string
  hex: string
  uptime: number      // kept for interface compatibility, not rendered
  incidents: number   // kept for interface compatibility, not rendered
  tags: string[]
  sparkline: number[] // kept for interface compatibility, not rendered
  href?: string
}

export default function ServicePanel({ data }: { data: ServicePanelData }) {
  const { icon, title, desc, hex, tags, href = '/servicios' } = data
  const ref = useRef<HTMLDivElement>(null)

  // Subtle 3-D tilt on hover (±2.5°) — tighter spring for premium feel
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 380, damping: 36 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2.5, 2.5]), { stiffness: 380, damping: 36 })
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - left) / width - 0.5)
    mouseY.set((e.clientY - top)  / height - 0.5)
  }
  function onLeave() { mouseX.set(0); mouseY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.006 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative rounded-2xl overflow-hidden cursor-default group h-full"
    >
      {/* Card base */}
      <div className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, #131316, #0d0d10)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03) inset',
        }}
      />

      {/* Subtle color accent line at top */}
      <div className="absolute top-0 left-8 right-8 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}45, transparent)` }}
      />

      {/* Mouse-tracking specular highlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.035) 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base mb-5 flex-shrink-0"
          style={{ background: hex + '14', border: `1px solid ${hex}22`, color: hex }}>
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-zinc-100 font-semibold text-[15px] leading-snug mb-3">{title}</h3>

        {/* Description */}
        <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">{desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tags.map(t => (
            <span key={t}
              className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#52525b', border: '1px solid rgba(255,255,255,0.06)' }}>
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href={href}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: hex + 'cc' }}
            onMouseEnter={e => (e.currentTarget.style.color = hex)}
            onMouseLeave={e => (e.currentTarget.style.color = hex + 'cc')}
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
