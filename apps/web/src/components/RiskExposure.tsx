'use client'
import { motion } from 'framer-motion'
import { reveal as appear } from '@/lib/motion'

// Three structural failure patterns observed in SMB/mid-market engagements
const RISKS = [
  {
    domain:  'Red',
    color:   '#4878b0',
    title:   'Red plana con demasiada confianza interna',
    body:    'Un equipo comprometido no debería alcanzar servidores, respaldos y administración. El primer control es contención.',
    control: 'Segmentos claros, administración restringida y reglas entre zonas revisables.',
    signals: [
      'Todo el tráfico interno en la misma subred',
      'Reglas "any-any" activas en el firewall',
      'RDP entre estaciones de trabajo sin restricción',
    ],
  },
  {
    domain:  'Identidad',
    color:   '#3a7858',
    title:   'Identidad sin contexto suficiente',
    body:    'Una contraseña filtrada no puede ser el único filtro para correo, archivos y sistemas críticos.',
    control: 'MFA, acceso condicional y roles administrativos temporales.',
    signals: [
      'Cuentas de administrador sin MFA obligatorio',
      'Política de contraseñas sin complejidad mínima',
      'Sesiones activas sin límite de duración',
    ],
  },
  {
    domain:  'Endpoints',
    color:   '#3a7858',
    title:   'Endpoints fuera de inventario operativo',
    body:    'Cuando aparece una vulnerabilidad, el equipo no debería empezar preguntando cuántas laptops existen.',
    control: 'Inventario activo, políticas MDM y ventanas de parcheo con responsable.',
    signals: [
      'Endpoints con parches pendientes de más de 90 días',
      'Sin inventario automatizado de software instalado',
      'Dispositivos personales con acceso a recursos corporativos',
    ],
  },
]

// ── Single risk item — editorial text block, no box ───────────────────────
function RiskItem({ risk }: { risk: typeof RISKS[number] }) {
  const { domain, color, title, body, control, signals } = risk
  return (
    <div className="pt-7" style={{ borderTop: `1px solid rgba(255,255,255,0.045)` }}>

      {/* Domain label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color + 'bb' }} />
        <span className="text-[9px] font-mono uppercase tracking-normal" style={{ color: 'rgba(100,116,139,0.50)' }}>
          {domain}
        </span>
      </div>

      <h3 className="text-zinc-200 text-[14px] font-semibold leading-snug mb-2.5">{title}</h3>

      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-5">
        <p className="text-zinc-500 text-[13px] leading-relaxed">{body}</p>
        <div className="grid gap-3">
          <div className="pl-4" style={{ borderLeft: `1px solid ${color}55` }}>
            <div className="text-[10px] font-mono text-zinc-600 mb-1">control minimo</div>
            <p className="text-zinc-400 text-[12.5px] leading-relaxed">{control}</p>
          </div>
          <div className="grid gap-1.5">
            {signals.slice(0, 2).map((s) => (
              <span key={s} className="text-[10px] font-mono leading-snug text-zinc-700">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────
export default function RiskExposure() {
  return (
    <section className="home-section px-4 sm:px-8 relative section-deep">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <motion.span {...appear(0)} className="label">Exposición al riesgo</motion.span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">

          {/* Left: editorial statement */}
          <div className="lg:sticky lg:top-28">
            <motion.h2 {...appear(0)} className="section-heading mb-4">
              Problemas reales que frenan la operación.
            </motion.h2>
            <motion.p {...appear(0.010)} className="text-zinc-600 text-sm leading-relaxed max-w-xs">
              Pocos controles, bien priorizados, suelen bajar más riesgo que otro proyecto grande sin dueño.
            </motion.p>
          </div>

          <div className="grid gap-0">
            {RISKS.map((risk) => (
              <RiskItem key={risk.title} risk={risk} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
