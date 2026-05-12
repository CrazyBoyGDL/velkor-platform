'use client'
import { motion } from 'framer-motion'

const CAPABILITIES = [
  {
    id: 'monitoring',
    label: 'Monitoreo continuo',
    detail: '24 × 7 × 365',
    badge: 'NOC',
    hex: '#22c55e',
  },
  {
    id: 'response',
    label: 'Tiempo de respuesta',
    detail: '< 15 min',
    badge: 'SLA',
    hex: '#f59e0b',
  },
  {
    id: 'coverage',
    label: 'Cobertura de red',
    detail: 'Firewall · VPN · LAN',
    badge: 'FORTINET',
    hex: '#3b82f6',
  },
  {
    id: 'cloud',
    label: 'Gestión en la nube',
    detail: 'M365 · Entra ID · Intune',
    badge: 'MICROSOFT',
    hex: '#22c55e',
  },
]

const SERVICES = [
  { msg: 'Gestión de firewalls Fortinet y Cisco',    category: 'Infraestructura de red' },
  { msg: 'Administración Microsoft 365 y Entra ID',  category: 'Cloud & Identidad'      },
  { msg: 'Monitoreo y respuesta ante incidentes',    category: 'NOC 24/7'               },
  { msg: 'Despliegue Intune y Windows Autopilot',    category: 'Endpoint Management'    },
  { msg: 'Instalación y gestión CCTV IP',            category: 'Videovigilancia'        },
  { msg: 'Auditorías de seguridad y cumplimiento',   category: 'Consultoría IT'         },
]

export default function NOCDashboard() {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden select-none"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03) inset' }}>

      {/* Header — clean enterprise style, no terminal chrome */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
        <div>
          <div className="text-zinc-200 text-sm font-semibold">Plataforma de servicios</div>
          <div className="text-zinc-600 text-[11px] mt-0.5">Velkor System · IT Consulting</div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-slow flex-shrink-0" />
          <span className="text-noc-green text-[11px] font-medium tracking-wide">Operativo</span>
        </div>
      </div>

      {/* Capabilities grid */}
      <div className="grid grid-cols-2 border-b border-surface-border">
        {CAPABILITIES.map(({ id, label, detail, badge, hex }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 + 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={`p-4 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} border-surface-border`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-600 text-[10px] font-medium uppercase tracking-wider">{label}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                style={{ color: hex, background: hex + '14', border: `1px solid ${hex}22` }}>
                {badge}
              </span>
            </div>
            <div className="text-zinc-300 text-sm font-medium">{detail}</div>
          </motion.div>
        ))}
      </div>

      {/* Services list */}
      <div className="p-4 space-y-3.5">
        {SERVICES.map(({ msg, category }, i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 + 0.4, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber/50 flex-shrink-0 mt-[5px]" />
            <div className="flex-1 min-w-0">
              <div className="text-zinc-300 text-xs font-medium leading-snug">{msg}</div>
              <div className="text-zinc-600 text-[11px] mt-0.5">{category}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
