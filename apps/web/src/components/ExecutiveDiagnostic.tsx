'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { reveal as appear } from '@/lib/motion'
import { AnimeGridReveal } from '@/components/AnimeMotion'

// Four diagnostic questions — the ones a senior engineer asks on a first visit
const QUESTIONS = [
  {
    color:    '#4878b0',
    question: '¿Sabes cuántos endpoints de tu red no tienen un parche activo?',
    context:  'Si la respuesta depende de revisar varias hojas o preguntar por chat, hay una brecha operativa. El inventario debe servir para decidir, no solo para cumplir.',
    implication: 'Incluimos inventario y priorización en la evaluación inicial.',
  },
  {
    color:    '#3a7858',
    question: '¿Cuánto tiempo tardarías en recuperar operaciones si cifran tus servidores hoy?',
    context:  'La respuesta útil no es "tenemos backup"; es saber qué se restaura primero, quién autoriza, cuánto tarda y cuándo fue la última prueba.',
    implication: 'Evaluamos el plan de recuperación como parte del diagnóstico.',
  },
  {
    color:    '#3a7858',
    question: '¿Qué pasa si un empleado deja la empresa hoy y no desactivas su cuenta?',
    context:  'Offboarding manual significa depender de que nadie olvide un paso. Identidad, correo, grupos y dispositivos deben salir del mismo flujo.',
    implication: 'Revisamos ciclo de vida de identidades y permisos.',
  },
  {
    color:    '#3d88a5',
    question: '¿Tienes visibilidad completa de quién accede físicamente a tus instalaciones críticas?',
    context:  'Cuartos de red, bodegas y accesos laterales suelen quedar fuera del mapa. La cobertura sirve cuando ayuda a reconstruir un evento sin adivinar.',
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
          <motion.h2 {...appear(0)}
            className="section-heading">
            Cuatro preguntas que<br />
            <span className="text-zinc-600">todo responsable de IT debe poder responder.</span>
          </motion.h2>
          <motion.p {...appear(0.010)} className="text-zinc-600 text-sm leading-relaxed max-w-sm self-end">
            Si alguna te obliga a buscar datos en tres sistemas, hay oportunidad de ordenar antes de que se vuelva urgencia.
          </motion.p>
        </div>

        {/* Question rows — editorial, full-width, no boxes */}
        <AnimeGridReveal grid={false} from="first" delay={58} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {QUESTIONS.map((q) => (
            <div
              key={q.question}
              className="grid md:grid-cols-[0.95fr_1fr_0.72fr] gap-6 md:gap-8 py-8"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              {/* Left: question */}
              <div className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full flex-shrink-0 mt-[9px]" style={{ background: q.color + 'aa' }} />
                <p className="text-zinc-200 text-[15px] font-semibold leading-snug">{q.question}</p>
              </div>

              <p className="text-zinc-500 text-[13px] leading-relaxed">{q.context}</p>

              <div className="md:pl-5" style={{ borderLeft: `1px solid ${q.color}33` }}>
                <div className="text-[10px] font-mono text-zinc-600 mb-2">siguiente dato</div>
                <p className="text-[11.5px] font-mono leading-relaxed" style={{ color: 'rgba(100,116,139,0.55)' }}>
                  {q.implication}
                </p>
              </div>
            </div>
          ))}
        </AnimeGridReveal>

        {/* CTA */}
        <motion.div {...appear(0)} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Link href="/assessments" className="btn-amber">
            Solicitar evaluación técnica →
          </Link>
          <p className="text-zinc-600 text-sm">Informe en 24 h · Sin contrato · Sin costo</p>
        </motion.div>

      </div>
    </section>
  )
}
