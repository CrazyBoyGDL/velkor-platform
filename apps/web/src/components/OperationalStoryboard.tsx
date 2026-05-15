'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimeGridReveal } from '@/components/AnimeMotion'
import { reveal as fadeUp } from '@/lib/motion'

const ARCHITECTURE_LAYERS = [
  {
    before: 'Red plana',
    after: 'Segmentación por función',
    signal: 'Servicios críticos aislados de invitados, cámaras y operación administrativa.',
  },
  {
    before: 'Acceso por costumbre',
    after: 'Identidad con contexto',
    signal: 'MFA, dispositivos administrados y excepciones documentadas.',
  },
  {
    before: 'Cambios sin rastro',
    after: 'Evidencia operativa',
    signal: 'Bitácora de decisiones, rollback y pendientes verificables.',
  },
]

const ROLLOUT_SEQUENCE = [
  ['01', 'Mapeo', 'Inventario, dependencias y rutas de riesgo reales.'],
  ['02', 'Control', 'Políticas mínimas antes de mover producción.'],
  ['03', 'Prueba', 'Ventanas acotadas, reversa lista y evidencia.'],
  ['04', 'Operación', 'Cadencia, ownership y siguientes mejoras.'],
]

export default function OperationalStoryboard() {
  return (
    <section className="py-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-topology opacity-25 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <div className="storyboard-grid">
          <div className="lg:sticky lg:top-28 self-start">
            <motion.span {...fadeUp(0)} className="label block mb-5">
              Storytelling operativo
            </motion.span>
            <motion.h2 {...fadeUp(0.01)} className="section-heading mb-6 max-w-xl">
              De entorno incierto a arquitectura gobernable.
            </motion.h2>
            <motion.p {...fadeUp(0.02)} className="editorial-lede max-w-md mb-8">
              El valor no está en sumar herramientas. Está en entender dependencias, mover lo mínimo necesario y dejar controles que el equipo pueda operar.
            </motion.p>
            <motion.div {...fadeUp(0.03)} className="flex flex-wrap gap-3">
              <Link href="/framework/evidence" className="btn-ghost text-sm">
                Ver evidencia →
              </Link>
              <Link href="/casos" className="btn-ghost text-sm">
                Casos técnicos
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-6">
            <motion.div {...fadeUp(0)} className="storyboard-panel p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="label mb-2">Antes / después</div>
                  <h3 className="text-zinc-100 font-semibold text-lg">Mapa de madurez operativa</h3>
                </div>
                <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-zinc-600">
                  <span>riesgo</span>
                  <span className="h-px w-12 bg-white/[0.10]" />
                  <span>control</span>
                </div>
              </div>

              <AnimeGridReveal className="grid gap-3" delay={48} grid={false} from="first">
                {ARCHITECTURE_LAYERS.map((layer) => (
                  <div key={layer.before} className="grid sm:grid-cols-[0.85fr_auto_1fr] gap-3 sm:gap-4 items-center">
                    <div className="storyboard-node p-4">
                      <div className="text-zinc-500 text-[11px] font-mono mb-2">estado inicial</div>
                      <div className="text-zinc-300 font-semibold text-sm">{layer.before}</div>
                    </div>
                    <div className="hidden sm:block h-px w-10 bg-gradient-to-r from-white/[0.08] to-white/[0.18]" />
                    <div className="storyboard-node p-4">
                      <div className="text-zinc-500 text-[11px] font-mono mb-2">control operativo</div>
                      <div className="text-zinc-100 font-semibold text-sm mb-1">{layer.after}</div>
                      <p className="text-zinc-500 text-xs leading-relaxed">{layer.signal}</p>
                    </div>
                  </div>
                ))}
              </AnimeGridReveal>
            </motion.div>

            <motion.div {...fadeUp(0.02)} className="storyboard-panel p-5 sm:p-6">
              <div className="label mb-5">Secuencia de despliegue</div>
              <AnimeGridReveal className="grid sm:grid-cols-4 gap-0" delay={54} from="first">
                {ROLLOUT_SEQUENCE.map(([number, label, detail], index) => (
                  <div
                    key={number}
                    className="relative py-4 sm:px-4"
                    style={index > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.07)' } : undefined}
                  >
                    <div className="font-mono text-[11px] text-zinc-600 mb-3">{number}</div>
                    <div className="text-zinc-200 font-semibold text-sm mb-2">{label}</div>
                    <p className="text-zinc-500 text-xs leading-relaxed">{detail}</p>
                  </div>
                ))}
              </AnimeGridReveal>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
