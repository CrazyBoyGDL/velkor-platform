'use client'
import { motion } from 'framer-motion'
import { reveal as appear } from '@/lib/motion'
import { AnimeGridReveal } from '@/components/AnimeMotion'

// Three structural failure patterns observed in SMB/mid-market engagements
const RISKS = [
  {
    domain:  'Red',
    color:   '#4878b0',
    title:   'Movimiento lateral sin restricción',
    body:    'En una red plana, un equipo comprometido puede tocar servidores, controladores de dominio y respaldos. La segmentación no es lujo: es contención.',
    signals: [
      'Todo el tráfico interno en la misma subred',
      'Reglas "any-any" activas en el firewall',
      'RDP entre estaciones de trabajo sin restricción',
    ],
  },
  {
    domain:  'Identidad',
    color:   '#3a7858',
    title:   'Credenciales sin segundo factor',
    body:    'Una contraseña filtrada no debería abrir correo, archivos y sistemas críticos. MFA y acceso condicional ponen contexto antes de permitir la entrada.',
    signals: [
      'Cuentas de administrador sin MFA obligatorio',
      'Política de contraseñas sin complejidad mínima',
      'Sesiones activas sin límite de duración',
    ],
  },
  {
    domain:  'Endpoints',
    color:   '#3a7858',
    title:   'Dispositivos sin gestión centralizada',
    body:    'Sin MDM, parches e inventario viven dispersos. Cuando aparece una vulnerabilidad, nadie quiere empezar preguntando cuántos equipos existen.',
    signals: [
      'Endpoints con parches pendientes de más de 90 días',
      'Sin inventario automatizado de software instalado',
      'Dispositivos personales con acceso a recursos corporativos',
    ],
  },
]

// ── Single risk item — editorial text block, no box ───────────────────────
function RiskItem({ risk }: { risk: typeof RISKS[number] }) {
  const { domain, color, title, body, signals } = risk
  return (
    <div className="pt-7" style={{ borderTop: `1px solid rgba(255,255,255,0.045)` }}>

      {/* Domain label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color + 'bb' }} />
        <span className="text-[9px] font-mono uppercase tracking-[0.20em]" style={{ color: 'rgba(100,116,139,0.50)' }}>
          {domain}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-zinc-200 text-[14px] font-semibold leading-snug mb-2.5">{title}</h3>

      {/* Body */}
      <p className="text-zinc-500 text-[13px] leading-relaxed mb-4">{body}</p>

      {/* Observed indicators — plain text list */}
      <ul className="space-y-1">
        {signals.map((s, i) => (
          <li key={i} className="text-[11px] font-mono leading-snug" style={{ color: 'rgba(100,116,139,0.45)' }}>
            — {s}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────
export default function RiskExposure() {
  return (
    <section className="py-20 px-4 sm:px-8 relative section-deep">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <motion.span {...appear(0)} className="label">Exposición al riesgo</motion.span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">

          {/* Left: editorial statement */}
          <div className="lg:sticky lg:top-28">
            <motion.h2 {...appear(0)}
              className="text-2xl sm:text-[2rem] font-bold text-noc-white leading-tight tracking-heading mb-4">
              Las brechas que ya<br />
              <span className="text-zinc-600">existen en tu red.</span>
            </motion.h2>
            <motion.p {...appear(0.010)} className="text-zinc-600 text-sm leading-relaxed max-w-xs">
              Son patrones que vemos una y otra vez cuando una infraestructura crece sin pausas para ordenar.
            </motion.p>
          </div>

          {/* Right: three risk items as editorial text blocks */}
          <AnimeGridReveal grid={false} from="first" delay={64}>
            {RISKS.map((risk) => (
              <RiskItem key={risk.title} risk={risk} />
            ))}
          </AnimeGridReveal>

        </div>
      </div>
    </section>
  )
}
