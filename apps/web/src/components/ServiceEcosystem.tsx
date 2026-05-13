'use client'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.35, ease: EASE, delay },
})

// Operational layers — each depends on the one below
const LAYERS = [
  {
    tier: '01',
    label: 'Infraestructura base',
    color: '#3b82f6',
    description:
      'La red es el sistema nervioso central. Sin segmentación, todo lo que construyas encima es frágil.',
    services: [
      { name: 'Redes segmentadas · FortiGate NGFW · VPN', color: '#3b82f6' },
      { name: 'CCTV IP · Visibilidad física · Analítica IA', color: '#06b6d4' },
    ],
  },
  {
    tier: '02',
    label: 'Identidad y control de acceso',
    color: '#22c55e',
    description:
      'Quién accede, desde qué dispositivo, bajo qué condiciones. Política, no excepción.',
    services: [
      { name: 'Entra ID · Acceso Condicional · MFA', color: '#22c55e' },
      { name: 'Intune MDM · Autopilot · PIM just-in-time', color: '#22c55e' },
    ],
    dependency: 'Requiere red segmentada para aplicar políticas por segmento',
  },
  {
    tier: '03',
    label: 'Productividad y continuidad',
    color: '#64748b',
    description:
      'El trabajo fluye sobre una base verificada. Colaboración, correo y datos protegidos por diseño.',
    services: [
      { name: 'Microsoft 365 · Exchange · Teams · SharePoint', color: '#3b82f6' },
      { name: 'Soporte activo · Revisiones periódicas · Documentación', color: '#64748b' },
    ],
    dependency: 'Identidad gobernada + dispositivos conformes = M365 seguro',
  },
]

// ── Connector arrow between layers ────────────────────────────────────────────
function LayerConnector({ note }: { note?: string }) {
  return (
    <div className="flex items-center gap-4 py-1 pl-[calc(2.5rem+1px)]">
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
        <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
      {note && (
        <span className="text-[9.5px] font-mono text-zinc-700 italic">{note}</span>
      )}
    </div>
  )
}

// ── Single operational layer row ──────────────────────────────────────────────
function Layer({
  tier, label, color, description, services, delay,
}: {
  tier: string; label: string; color: string; description: string
  services: { name: string; color: string }[]; delay: number
}) {
  return (
    <motion.div {...fadeUp(delay)} className="flex items-stretch gap-5">
      {/* Tier number — vertical axis */}
      <div className="flex flex-col items-center flex-shrink-0 w-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0"
          style={{ background: color + '14', color: color + 'cc', border: `1px solid ${color}28` }}
        >
          {tier}
        </div>
        <div className="w-px flex-1 mt-3" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* Layer content */}
      <div className="flex-1 pb-8">
        {/* Layer header */}
        <div className="flex items-center gap-3 mb-3 h-10">
          <h3 className="text-zinc-200 font-semibold text-[14px] tracking-tight">{label}</h3>
        </div>

        {/* Description */}
        <p className="text-zinc-600 text-sm leading-relaxed mb-4 max-w-xl">{description}</p>

        {/* Service chips */}
        <div className="flex flex-wrap gap-2">
          {services.map(({ name, color: c }) => (
            <div
              key={name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(161,161,170,0.8)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
              {name}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function ServiceEcosystem() {
  return (
    <section className="py-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <motion.span {...fadeUp(0)} className="label">Ecosistema operacional</motion.span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start">

          {/* Left: editorial statement */}
          <div>
            <motion.h2 {...fadeUp(0.04)}
              className="text-2xl sm:text-[2.1rem] font-bold text-noc-white leading-tight tracking-heading mb-4">
              Servicios aislados<br />
              <span className="text-zinc-600">no crean seguridad.</span>
            </motion.h2>
            <motion.p {...fadeUp(0.08)} className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Cada capa depende de la anterior. Diseñamos el ecosistema completo — no parcheamos servicios sueltos sobre infraestructura frágil.
            </motion.p>
          </div>

          {/* Right: layer stack */}
          <div>
            {LAYERS.map((layer, i) => (
              <div key={layer.tier}>
                <Layer {...layer} delay={i * 0.08 + 0.06} />
                {i < LAYERS.length - 1 && (
                  <LayerConnector note={LAYERS[i + 1].dependency} />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
