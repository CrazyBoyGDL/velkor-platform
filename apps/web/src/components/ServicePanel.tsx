'use client'
import { useRef, useState } from 'react'
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
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
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

  // 3-D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })
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
  const uptimeBar   = Math.round(uptime)

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative rounded-2xl overflow-hidden cursor-default group"
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${hex}50, rgba(30,30,30,0.8) 50%, ${hex}18)`,
          padding: 1,
        }}
      >
        <div className="absolute inset-[1px] rounded-[15px]"
          style={{ background: 'linear-gradient(145deg, #111118, #0a0a0e)' }} />
      </div>

      {/* Mouse-tracking specular highlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-5">

        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-mono"
              style={{ background: hex + '18', boxShadow: `0 0 12px ${hex}20` }}>
              {icon}
            </div>
            <div>
              <div className="text-noc-white font-bold text-[13px] leading-tight">{title}</div>
              <div className="text-[10px] font-mono mt-0.5" style={{ color: uptimeColor }}>
                ● {uptime}% UPTIME
              </div>
            </div>
          </div>
          {/* Live badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-mono"
            style={{ background: hex + '12', border: `1px solid ${hex}30`, color: hex }}>
            <span className="w-1 h-1 rounded-full animate-pulse-fast" style={{ background: hex }} />
            LIVE
          </div>
        </div>

        {/* Uptime bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-zinc-600 text-[10px] font-mono">DISPONIBILIDAD</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: uptimeColor }}>{uptime}%</span>
          </div>
          <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${hex}80, ${hex})` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${uptimeBar}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </div>

        {/* Sparkline + incidents */}
        <div className="flex items-end justify-between mb-4">
          <MiniSparkline values={sparkline} color={hex} />
          <div className="text-right">
            <div className="text-2xl font-black font-mono" style={{ color: incidents === 0 ? '#22c55e' : '#f59e0b' }}>
              {incidents}
            </div>
            <div className="text-zinc-600 text-[9px] font-mono">INCIDENTES / 30 días</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-500 text-xs leading-relaxed mb-4">{desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map(t => (
            <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#52525b', border: '1px solid rgba(255,255,255,0.06)' }}>
              {t}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-zinc-700 text-[10px] font-mono">Velkor NOC · activo</span>
          <Link href={href}
            className="text-[11px] font-mono font-semibold flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: hex }}>
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
