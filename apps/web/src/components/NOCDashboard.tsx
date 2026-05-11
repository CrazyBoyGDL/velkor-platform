'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const METRICS = [
  {
    id: 'uptime',
    label: 'Disponibilidad',
    value: 99.9,
    unit: '%',
    badge: 'ÓPTIMO',
    badgeColor: 'text-noc-green bg-noc-green-bg',
    barColor: 'bg-noc-green',
    barWidth: 99.9,
    animate: true,
  },
  {
    id: 'threats',
    label: 'Amenazas hoy',
    value: 141,
    unit: '',
    badge: 'REVISANDO',
    badgeColor: 'text-amber bg-amber-bg',
    barColor: 'bg-amber',
    barWidth: 42,
    animate: false,
  },
  {
    id: 'm365',
    label: 'Usuarios M365',
    value: 141,
    unit: '',
    badge: 'ACTIVOS',
    badgeColor: 'text-noc-blue bg-noc-blue-bg',
    barColor: 'bg-noc-blue',
    barWidth: 71,
    animate: false,
  },
  {
    id: 'backup',
    label: 'Backup',
    value: '✓ OK',
    unit: '',
    badge: 'HOY 03:00',
    badgeColor: 'text-noc-green bg-noc-green-bg',
    barColor: 'bg-noc-green',
    barWidth: 100,
    animate: false,
  },
]

const INITIAL_ACTIVITY = [
  { id: 1, level: 'warn', msg: 'Puerto 8443 con tráfico inusual', src: 'fw-core · Fortinet FG-200F', ago: 'hace 12 min' },
  { id: 2, level: 'warn', msg: '2 cuentas sin MFA activo',        src: 'Azure Active Directory',    ago: 'hace 1 h'   },
  { id: 3, level: 'ok',   msg: 'Certificado SSL renovado',         src: 'velkor-mgmt.empresa.com',  ago: 'hace 3 h'   },
]

const NEW_EVENTS = [
  { id: 10, level: 'ok',   msg: 'Backup completado exitosamente',        src: 'NAS-CORP-01',              ago: 'ahora'     },
  { id: 11, level: 'warn', msg: 'CPU firewall al 78% por 5 min',         src: 'Fortinet FG-200F',         ago: 'ahora'     },
  { id: 12, level: 'ok',   msg: 'Parche KB5034441 aplicado en 12 equip', src: 'Intune Device Management', ago: 'ahora'     },
]

const DOT = ({ level }: { level: 'ok' | 'warn' | 'info' }) => (
  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${
    level === 'ok' ? 'bg-noc-green' : level === 'warn' ? 'bg-amber' : 'bg-noc-blue'
  }`} />
)

export default function NOCDashboard() {
  const [uptime, setUptime]     = useState(99.9)
  const [activity, setActivity] = useState(INITIAL_ACTIVITY)
  const [tick, setTick]         = useState(0)
  const [clock, setClock]       = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      setUptime(u => parseFloat((u + (Math.random() - 0.5) * 0.03).toFixed(2)))
      setTick(t => t + 1)
      setClock(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 3500)
    return () => clearInterval(id)
  }, [])

  // Add a new event every 10s (tick mod 3)
  useEffect(() => {
    if (tick > 0 && tick % 3 === 0) {
      const next = NEW_EVENTS[tick % NEW_EVENTS.length]
      setActivity(prev => [{ ...next, id: Date.now(), ago: 'ahora' }, ...prev].slice(0, 4))
    }
  }, [tick])

  const displayMetrics = METRICS.map(m =>
    m.id === 'uptime' ? { ...m, value: uptime } : m
  )

  return (
    <div className="relative rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-card noc-scan select-none">

      {/* Terminal header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-dark border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber/80" />
          <span className="w-3 h-3 rounded-full bg-noc-green/80" />
          <span className="ml-2 text-zinc-600 text-xs font-mono">velkor-noc / infraestructura</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-fast" />
          <span className="text-noc-green text-[11px] font-mono font-bold tracking-widest">EN VIVO</span>
          {clock && <span className="text-zinc-700 text-[10px] font-mono ml-2">{clock}</span>}
        </div>
      </div>

      {/* 2×2 Metrics grid */}
      <div className="grid grid-cols-2 border-b border-surface-border">
        {displayMetrics.map(({ id, label, value, unit, badge, badgeColor, barColor, barWidth }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className={`p-4 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} border-surface-border`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="label text-[10px]">{label}</span>
              <span className={`badge text-[10px] ${badgeColor}`}>{badge}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-noc-white">
              {typeof value === 'number' ? (
                id === 'uptime'
                  ? <motion.span key={uptime}>{uptime.toFixed(1)}{unit}</motion.span>
                  : `${value}${unit}`
              ) : value}
            </div>
            <div className="progress-track mt-2">
              <motion.div
                className={`h-full rounded-full ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.15 + 0.4 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity log */}
      <div className="p-4 space-y-3">
        <AnimatePresence initial={false}>
          {activity.map(({ id, level, msg, src, ago }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2.5 overflow-hidden"
            >
              <DOT level={level as 'ok' | 'warn' | 'info'} />
              <div className="flex-1 min-w-0">
                <div className="text-zinc-200 text-xs font-medium truncate">{msg}</div>
                <div className="text-zinc-600 text-[11px] font-mono">{src}</div>
              </div>
              <span className="text-zinc-700 text-[10px] font-mono flex-shrink-0">{ago}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
