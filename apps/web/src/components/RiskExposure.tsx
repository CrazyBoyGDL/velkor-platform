'use client'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 8 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, amount: 0.08 },
  transition: { duration: 0.32, ease: EASE, delay },
})

// Three risk intelligence briefs — real threat patterns observed in SMB/mid-market
const RISKS = [
  {
    id:       'NET-001',
    severity: 'CRÍTICO',
    sevColor: 'rgba(239,68,68,0.80)',
    sevBg:    'rgba(239,68,68,0.08)',
    domain:   'RED',
    domColor: '#3b82f6',
    title:    'Movimiento lateral sin restricción',
    summary:  'Redes planas — sin segmentación VLAN — permiten a un solo endpoint comprometido alcanzar servidores, controladores de dominio y NAS simultáneamente.',
    signals: [
      'Todo el tráfico interno en la misma subred /16 o /24',
      '47+ reglas "any-any" activas en el firewall',
      'Acceso RDP entre estaciones de trabajo habilitado',
    ],
    impact:   'Ransomware cifra toda la red en minutos, no en horas.',
  },
  {
    id:       'ID-002',
    severity: 'ALTO',
    sevColor: 'rgba(245,158,11,0.85)',
    sevBg:    'rgba(245,158,11,0.08)',
    domain:   'IDENTIDAD',
    domColor: '#22c55e',
    title:    'Credenciales sin segundo factor',
    summary:  'Sin MFA, una contraseña filtrada en un data breach es suficiente para obtener acceso total a correo, archivos y sistemas corporativos desde cualquier lugar del mundo.',
    signals: [
      'Cuentas de administrador sin MFA obligatorio',
      'Contraseñas reutilizadas — sin política de complejidad',
      'Sesiones persistentes sin límite de tiempo',
    ],
    impact:   'Business email compromise: promedio $50,000 USD por incidente.',
  },
  {
    id:       'OPS-003',
    severity: 'ALTO',
    sevColor: 'rgba(245,158,11,0.85)',
    sevBg:    'rgba(245,158,11,0.08)',
    domain:   'ENDPOINTS',
    domColor: '#22c55e',
    title:    'Dispositivos no gestionados en producción',
    summary:  'Laptops y PCs sin MDM activo corren versiones desactualizadas de SO y aplicaciones. Un solo CVE explotable alcanza el mismo nivel de riesgo que una brecha de red.',
    signals: [
      '23+ de 85 endpoints sin parche de OS (>90 días)',
      'Sin inventario automatizado de software instalado',
      'Dispositivos personales con acceso a recursos corporativos',
    ],
    impact:   'Vector de entrada #1 en incidentes de ransomware en 2024.',
  },
]

// ── Single risk brief card ──────────────────────────────────────────────────
function RiskCard({
  risk, delay,
}: {
  risk: typeof RISKS[number]
  delay: number
}) {
  const { id, severity, sevColor, sevBg, domain, domColor, title, summary, signals, impact } = risk

  return (
    <motion.div {...fadeUp(delay)} className="card p-5 flex flex-col h-full font-mono">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Domain tag */}
          <span
            className="text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded"
            style={{ color: domColor + 'cc', background: domColor + '14', border: `1px solid ${domColor}28` }}
          >
            {domain}
          </span>
          {/* Severity tag */}
          <span
            className="text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded"
            style={{ color: sevColor, background: sevBg }}
          >
            {severity}
          </span>
        </div>
        {/* Ref number */}
        <span className="text-[8px] tracking-widest flex-shrink-0" style={{ color: 'rgba(100,116,139,0.4)' }}>
          {id}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-zinc-200 text-[13px] font-semibold leading-snug mb-2.5 font-sans">{title}</h3>

      {/* Summary */}
      <p className="text-zinc-500 text-[11.5px] leading-relaxed mb-4 font-sans flex-1">{summary}</p>

      {/* Divider */}
      <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.04)' }} />

      {/* Observed signals */}
      <div className="space-y-1.5 mb-4">
        {signals.map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-[9.5px] leading-snug" style={{ color: 'rgba(161,161,170,0.55)' }}>
            <span className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(239,68,68,0.45)' }}>✗</span>
            {s}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.04)' }} />

      {/* Impact statement */}
      <div className="flex items-start gap-2 text-[9.5px]" style={{ color: 'rgba(245,158,11,0.65)' }}>
        <span className="flex-shrink-0">⚑</span>
        <span>{impact}</span>
      </div>
    </motion.div>
  )
}

// ── Section ─────────────────────────────────────────────────────────────────
export default function RiskExposure() {
  return (
    <section className="py-20 px-4 sm:px-8 relative section-deep">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <motion.span {...fadeUp(0)} className="label">Exposición al riesgo</motion.span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-14 items-start mb-10">
          {/* Editorial statement */}
          <div>
            <motion.h2 {...fadeUp(0.04)}
              className="text-2xl sm:text-[2.1rem] font-bold text-noc-white leading-tight tracking-heading mb-3">
              Las brechas que ya<br />
              <span className="text-zinc-600">existen en tu red.</span>
            </motion.h2>
            <motion.p {...fadeUp(0.08)} className="text-zinc-600 text-sm leading-relaxed max-w-sm">
              Estos tres vectores aparecen en más del 80% de los diagnósticos que realizamos. No son hipotéticos — son los que encontramos.
            </motion.p>
          </div>

          {/* Stat callout */}
          <motion.div {...fadeUp(0.10)} className="hidden lg:flex items-center justify-end">
            <div className="text-right">
              <div
                className="text-[3.2rem] font-black font-mono tabular-nums leading-none mb-1"
                style={{ color: 'rgba(239,68,68,0.70)' }}
              >
                3 de 3
              </div>
              <div className="text-zinc-600 text-sm font-mono">vectores presentes<br />en la empresa promedio</div>
            </div>
          </motion.div>
        </div>

        {/* Risk brief grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RISKS.map((risk, i) => (
            <RiskCard key={risk.id} risk={risk} delay={i * 0.06 + 0.04} />
          ))}
        </div>

      </div>
    </section>
  )
}
