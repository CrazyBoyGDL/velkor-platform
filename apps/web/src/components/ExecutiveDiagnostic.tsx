'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.25, 0, 0, 1] as const

const appear = (delay = 0) => ({
  initial:    { opacity: 0 },
  whileInView:{ opacity: 1 },
  viewport:   { once: true, amount: 0.05 },
  transition: { duration: 0.22, ease: EASE, delay },
})

// Four diagnostic questions — the ones a senior engineer asks on a first visit
const QUESTIONS = [
  {
    color:    '#3b82f6',
    question: '¿Sabes cuántos endpoints de tu red no tienen un parche activo?',
    context:  'La mayoría de los equipos de IT responden "la mayoría" o "no sé exactamente." Eso es un gap operacional, no una preferencia. Un solo endpoint sin parchear con un CVE explotable es vector de entrada suficiente.',
    implication: 'Diagnóstico de inventario incluido en la evaluación inicial.',
  },
  {
    color:    '#22c55e',
    question: '¿Cuánto tiempo tardarías en recuperar operaciones si cifran tus servidores hoy?',
    context:  'Sin segmentación y sin backups verificados, la respuesta honesta suele ser: días. Con frecuencia, sin fecha. El tiempo promedio de recuperación sin un plan documentado es de 21 días; el costo promedio supera los $200k USD.',
    implication: 'Evaluamos el plan de recuperación como parte del diagnóstico.',
  },
  {
    color:    '#22c55e',
    question: '¿Qué pasa si un empleado deja la empresa hoy y no desactivas su cuenta?',
    context:  'Sin automatización de offboarding en Entra ID, las credenciales permanecen activas indefinidamente. El 58% de los incidentes internos documentados involucran cuentas de ex-empleados no desactivadas a tiempo.',
    implication: 'La gestión de ciclo de vida de identidades forma parte del alcance.',
  },
  {
    color:    '#06b6d4',
    question: '¿Tienes visibilidad completa de quién accede físicamente a tus instalaciones críticas?',
    context:  'Servidores, cuartos de cómputo y bodegas sin cobertura CCTV representan el vector físico más ignorado. El 34% de las brechas de datos documentadas en DBIR 2024 involucran acceso físico no autorizado.',
    implication: 'Incluimos evaluación de cobertura física en el mismo diagnóstico.',
  },
]

// ── Section ───────────────────────────────────────────────────────────────
export default function ExecutiveDiagnostic() {
  return (
    <section className="py-20 px-4 sm:px-8 relative">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <motion.span {...appear(0)} className="label">Diagnóstico ejecutivo</motion.span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-end mb-12">
          <motion.h2 {...appear(0.04)}
            className="text-2xl sm:text-[2rem] font-bold text-noc-white leading-tight tracking-heading">
            Cuatro preguntas que<br />
            <span className="text-zinc-600">todo responsable de IT debe poder responder.</span>
          </motion.h2>
          <motion.p {...appear(0.07)} className="text-zinc-600 text-sm leading-relaxed max-w-sm self-end">
            Si alguna genera incertidumbre, es una brecha operacional. La evaluamos en el diagnóstico inicial, sin costo.
          </motion.p>
        </div>

        {/* Question rows — editorial, full-width, no boxes */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {QUESTIONS.map((q, i) => (
            <motion.div
              key={q.question}
              {...appear(i * 0.05 + 0.08)}
              className="grid md:grid-cols-[1fr_1.2fr] gap-8 py-8"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              {/* Left: question */}
              <div className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full flex-shrink-0 mt-[9px]" style={{ background: q.color + 'aa' }} />
                <p className="text-zinc-200 text-[15px] font-semibold leading-snug">{q.question}</p>
              </div>

              {/* Right: context + implication */}
              <div>
                <p className="text-zinc-500 text-[13px] leading-relaxed mb-3">{q.context}</p>
                <p className="text-[11px] font-mono" style={{ color: 'rgba(100,116,139,0.45)' }}>
                  {q.implication}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div {...appear(0.28)} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Link href="/assessments" className="btn-amber">
            Solicitar evaluación técnica →
          </Link>
          <p className="text-zinc-600 text-sm">Informe en 24 h · Sin contrato · Sin costo</p>
        </motion.div>

      </div>
    </section>
  )
}
