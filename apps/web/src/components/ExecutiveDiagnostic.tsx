'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 8 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, amount: 0.06 },
  transition: { duration: 0.32, ease: EASE, delay },
})

// Four consultive diagnostic questions — the questions an engineer asks on day 1
const QUESTIONS = [
  {
    id:       'DX-01',
    color:    '#3b82f6',
    question: '¿Sabes cuántos endpoints de tu red no tienen un parche de seguridad activo?',
    context:  'La mayoría de los responsables de IT responden "la mayoría" o "no sé con exactitud". Eso es el gap.',
    worst:    'Si la respuesta es no: un solo endpoint vulnerable es suficiente para un ataque de ransomware.',
    cta:      'Obtener inventario de endpoints',
  },
  {
    id:       'DX-02',
    color:    '#22c55e',
    question: '¿Cuánto tiempo tardarías en recuperar tus operaciones si cifran tus servidores hoy?',
    context:  'Sin segmentación y sin backups verificados, la respuesta honesta es: días. O nunca.',
    worst:    'El tiempo promedio de recuperación sin plan documentado: 21 días. Costo promedio: $200k USD.',
    cta:      'Evaluar plan de recuperación',
  },
  {
    id:       'DX-03',
    color:    '#22c55e',
    question: '¿Qué pasa si un empleado se va hoy y no desactivas su cuenta?',
    context:  'Sin automatización de offboarding en Entra ID, las credenciales activas quedan expuestas indefinidamente.',
    worst:    '58% de los incidentes internos involucran cuentas de ex-empleados no desactivadas a tiempo.',
    cta:      'Revisar gestión de identidades',
  },
  {
    id:       'DX-04',
    color:    '#06b6d4',
    question: '¿Tienes visibilidad completa de quién accede físicamente a tus instalaciones críticas?',
    context:  'Servidores, cuartos de cómputo y bodegas sin cobertura CCTV son el vector físico más ignorado.',
    worst:    'El 34% de las brechas de datos involucran acceso físico no autorizado según Verizon DBIR 2024.',
    cta:      'Ver solución de videovigilancia',
  },
]

// ── Single diagnostic question row ─────────────────────────────────────────
function DiagnosticRow({
  q, delay,
}: {
  q: typeof QUESTIONS[number]
  delay: number
}) {
  const { id, color, question, context, worst } = q

  return (
    <motion.div
      {...fadeUp(delay)}
      className="grid md:grid-cols-[1fr_1.15fr] gap-8 py-7 items-start"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}
    >
      {/* Left: question */}
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span
            className="text-[8px] font-mono tracking-widest"
            style={{ color: 'rgba(100,116,139,0.40)' }}
          >
            {id}
          </span>
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color + 'cc' }} />
        </div>
        <p className="text-zinc-200 text-[15px] font-semibold leading-snug">{question}</p>
      </div>

      {/* Right: context + worst case */}
      <div className="space-y-3">
        <p className="text-zinc-500 text-sm leading-relaxed">{context}</p>
        <div
          className="flex items-start gap-2 text-[11.5px] font-mono leading-relaxed px-3 py-2 rounded-lg"
          style={{
            background: 'rgba(239,68,68,0.05)',
            border:     '1px solid rgba(239,68,68,0.10)',
            color:      'rgba(239,68,68,0.65)',
          }}
        >
          <span className="flex-shrink-0 mt-0.5">⚑</span>
          <span>{worst}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Section ─────────────────────────────────────────────────────────────────
export default function ExecutiveDiagnostic() {
  return (
    <section className="py-20 px-4 sm:px-8 relative">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <motion.span {...fadeUp(0)} className="label">Diagnóstico ejecutivo</motion.span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start mb-10">
          <motion.h2 {...fadeUp(0.04)}
            className="text-2xl sm:text-[2.1rem] font-bold text-noc-white leading-tight tracking-heading">
            Cuatro preguntas<br />
            <span className="text-zinc-600">que todo responsable de IT debe poder responder.</span>
          </motion.h2>
          <motion.p {...fadeUp(0.08)} className="text-zinc-600 text-sm leading-relaxed max-w-sm self-end">
            Si alguna genera incertidumbre, es una brecha operacional. No hipotética — documentada.
          </motion.p>
        </div>

        {/* Question rows */}
        <div>
          {/* First row gets the top border */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.045)' }}>
            {QUESTIONS.map((q, i) => (
              <DiagnosticRow key={q.id} q={q} delay={i * 0.07 + 0.06} />
            ))}
          </div>
        </div>

        {/* CTA footer */}
        <motion.div {...fadeUp(0.22)} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Link href="/assessments" className="btn-amber">
            Solicitar diagnóstico técnico gratis →
          </Link>
          <p className="text-zinc-600 text-sm">
            Informe técnico en 24 h · Sin contrato · Sin costo
          </p>
        </motion.div>

      </div>
    </section>
  )
}
