'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'

export interface ServicePanelData {
  icon: string
  title: string
  desc: string
  hex: string
  uptime: number
  incidents: number
  tags: string[]
  sparkline: number[]
  href?: string
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const W = 72, H = 20
  const min = Math.min(...values), max = Math.max(...values)
  const range = max - min || 0.5
  const pts = values.map((v, i) =>
    `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * H}`
  ).join(' ')
  const area = `${pts} ${W},${H} 0,${H}`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ServicePanel({ data }: { data: ServicePanelData }) {
  const { icon, title, desc, hex, uptime, incidents, tags, sparkline, href = '/services' } = data
  const ref = useRef<HTMLDivElement>(null)

  // 3-D tilt — subtle (±4°)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 })
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - left) / width - 0.5)
    mouseY.set((e.clientY - top)  / height - 0.5)
  }
  function onLeave() { mouseX.set(0); mouseY.set(0) }

  const uptimeColor = uptime >= 99.5 ? '#22c55e' : uptime >= 98 ? '#f59e0b' : '#ef4444'

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.012 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative rounded-2xl overflow-hidden cursor-default group h-full"
    >
      {/* Neutral card base */}
      <div className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, #131316, #0d0d10)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset',
        }}
      />

      {/* Subtle top accent line in service color */}
      <div className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}50, transparent)` }}
      />

      {/* Mouse-tracking specular highlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.04) 0%, transparent 65%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col h-full">

        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.12)' }}>
              <span style={{ filter: 'grayscale(0.4)' }}>{icon}</span>
            </div>
            <div>
              <div className="text-zinc-100 font-semibold text-[13px] leading-tight">{title}</div>
              <div className="text-[10px] font-mono mt-0.5 flex items-center gap-1" style={{ color: uptimeColor }}>
                <span className="w-1 h-1 rounded-full inline-block" style={{ background: uptimeColor }} />
                {uptime}% uptime
              </div>
            </div>
          </div>
          {/* Live badge — neutral */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#52525b' }}>
            <span className="w-1 h-1 rounded-full animate-pulse-fast" style={{ background: uptimeColor }} />
            LIVE
          </div>
        </div>

        {/* Uptime bar */}
        <div className="mb-3">
          <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${uptimeColor}60, ${uptimeColor})` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.round(uptime)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </div>

        {/* Sparkline + incidents */}
        <div className="flex items-end justify-between mb-4">
          <MiniSparkline values={sparkline} color={uptimeColor} />
          <div className="text-right">
            <div className="text-2xl font-black font-mono"
              style={{ color: incidents === 0 ? '#22c55e' : '#f59e0b' }}>
              {incidents}
            </div>
            <div className="text-zinc-700 text-[9px] font-mono">INC / 30d</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-500 text-xs leading-relaxed mb-4 flex-1">{desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map(t => (
            <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(255,255,255,0.03)', color: '#3f3f46', border: '1px solid rgba(255,255,255,0.05)' }}>
              {t}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-zinc-700 text-[10px] font-mono">NOC · activo</span>
          <Link href={href}
            className="text-[11px] font-mono font-semibold flex items-center gap-1 text-amber hover:text-amber-light transition-colors">
            VER DETALLE
            <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
