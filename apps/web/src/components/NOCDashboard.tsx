'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CAPABILITIES = [
  {
    id: 'monitoring',
    label: 'Monitoreo continuo',
    detail: '24 × 7 × 365',
    badge: 'NOC',
    badgeColor: 'text-noc-green bg-noc-green-bg',
    barColor: 'bg-noc-green',
    barWidth: 100,
  },
  {
    id: 'response',
    label: 'Tiempo de respuesta',
    detail: '< 15 min',
    badge: 'SLA',
    badgeColor: 'text-amber bg-amber-bg',
    barColor: 'bg-amber',
    barWidth: 85,
  },
  {
    id: 'coverage',
    label: 'Cobertura de red',
    detail: 'Firewall · VPN · LAN',
    badge: 'FORTINET',
    badgeColor: 'text-noc-blue bg-noc-blue-bg',
    barColor: 'bg-noc-blue',
    barWidth: 90,
  },
  {
    id: 'cloud',
    label: 'Gestión en la nube',
    detail: 'M365 · Entra ID · Intune',
    badge: 'MICROSOFT',
    badgeColor: 'text-noc-green bg-noc-green-bg',
    barColor: 'bg-noc-green',
    barWidth: 88,
  },
]

const SERVICES_TICKER = [
  { level: 'ok',   msg: 'Gestión de firewalls Fortinet y Cisco',    src: 'Infraestructura de red' },
  { level: 'ok',   msg: 'Administración Microsoft 365 y Entra ID',  src: 'Cloud & Identidad'      },
  { level: 'ok',   msg: 'Monitoreo y respuesta ante incidentes',    src: 'NOC 24/7'               },
  { level: 'ok',   msg: 'Despliegue Intune y Windows Autopilot',    src: 'Endpoint Management'    },
  { level: 'ok',   msg: 'Instalación y gestión CCTV IP',            src: 'Videovigilancia'        },
  { level: 'ok',   msg: 'Auditorías de seguridad y cumplimiento',   src: 'Consultoría IT'         },
]

const DOT = ({ level }: { level: string }) => (
  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${
    level === 'ok' ? 'bg-noc-green' : level === 'warn' ? 'bg-amber' : 'bg-noc-blue'
  }`} />
)

export default function NOCDashboard() {
  const [clock, setClock] = useState('')

  useEffect(() => {
    const update = () =>
      setClock(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-card noc-scan select-none">

      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-dark border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber/80" />
          <span className="w-3 h-3 rounded-full bg-noc-green/80" />
          <span className="ml-2 text-zinc-600 text-xs font-mono">velkor-noc / capacidades</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-slow" />
          <span className="text-noc-green text-[11px] font-mono font-bold tracking-widest">OPERACIONAL</span>
          {clock && <span className="text-zinc-700 text-[10px] font-mono ml-2">{clock}</span>}
        </div>
      </div>

      {/* Capabilities grid */}
      <div className="grid grid-cols-2 border-b border-surface-border">
        {CAPABILITIES.map(({ id, label, detail, badge, badgeColor, barColor, barWidth }, i) => (
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
            <div className="text-noc-white text-sm font-mono font-semibold mb-2 truncate">
              {detail}
            </div>
            <div className="progress-track">
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

      {/* Services list */}
      <div className="p-4 space-y-3">
        {SERVICES_TICKER.map(({ level, msg, src }, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 + 0.6 }}
            className="flex items-start gap-2.5"
          >
            <DOT level={level} />
            <div className="flex-1 min-w-0">
              <div className="text-zinc-200 text-xs font-medium truncate">{msg}</div>
              <div className="text-zinc-600 text-[11px] font-mono">{src}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
