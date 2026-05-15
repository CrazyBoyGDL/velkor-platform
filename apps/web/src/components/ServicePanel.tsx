'use client'
import { motion, useMotionTemplate } from 'framer-motion'
import Link from 'next/link'
import { useOperationalHover } from '@/lib/motion/operationalMotion'

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
  const hover = useOperationalHover<HTMLDivElement>(1.1)
  const { glowX, glowY, ...hoverStyle } = hover.style
  const sheen = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.022) 0%, transparent 55%)`

  return (
    <motion.div
      ref={hover.ref}
      {...hover.handlers}
      style={hoverStyle}
      whileHover={{ scale: 1.004 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
      className="relative rounded-lg overflow-hidden cursor-default group h-full"
    >
      {/* Card base — midnight navy */}
      <div className="absolute inset-0 rounded-lg service-panel-surface" />

      {/* Domain accent line — top edge, very subtle */}
      <div className="absolute top-0 left-5 right-5 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}38, transparent)` }}
      />

      {/* Mouse-tracking specular */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: sheen,
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
