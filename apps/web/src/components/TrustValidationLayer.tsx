'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimeGridReveal } from '@/components/AnimeMotion'
import { trackCTA, trackMobileTrustEngagement, trackTrustSignal } from '@/components/Analytics'
import { TRUST } from '@/lib/config'
import { reveal as fadeUp } from '@/lib/motion'

const FIELD_NOTES = [
  {
    label: 'Hallazgo de identidad',
    context: 'Sucursal con usuarios de caja rotando turnos',
    note: 'Había una cuenta compartida que no podía bloquearse de golpe sin detener facturación.',
    decision: 'Primero se separaron identidades, luego MFA por grupo piloto y al final se retiró la cuenta compartida.',
  },
  {
    label: 'Hallazgo de red',
    context: 'Rack principal con uplinks sin etiqueta',
    note: 'El failover dependía de un enlace que nadie quería tocar porque no había mapa actualizado.',
    decision: 'Se documentó LLDP, se probó corte controlado y se dejó rollback antes de cambiar políticas.',
  },
  {
    label: 'Hallazgo de gobierno',
    context: 'Proveedor externo con acceso permanente',
    note: 'El proveedor necesitaba soporte nocturno, pero la VPN seguía abierta todo el día.',
    decision: 'Se pasó a ventana aprobada, cuenta nominal, MFA y expiración revisada por el responsable interno.',
  },
]

const READINESS_FLOW = [
  ['Antes de la llamada', 'Inventario aproximado, sedes, riesgos urgentes y sistemas que no pueden detenerse.'],
  ['Durante discovery', 'Se separa lo crítico de lo deseable. Si falta información, se marca como pendiente operativo.'],
  ['Antes de proponer', 'Alcance, exclusiones, ventana de cambio, rollback y responsables quedan escritos.'],
  ['Al cierre', 'Runbook, evidencia, pendientes aceptados y siguiente revisión quedan listos para el equipo.'],
]

export default function TrustValidationLayer() {
  useEffect(() => {
    trackTrustSignal('human-operational-trust-layer-viewed', 'home', 'view')
    trackMobileTrustEngagement('home', 'human-operational-trust-layer')
  }, [])

  return (
    <section className="py-20 px-4 sm:px-8 relative overflow-hidden section-arch">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-12 lg:gap-20 items-start">
          <motion.div {...fadeUp(0)} className="lg:sticky lg:top-28">
            <span className="label block mb-5">Confianza operacional</span>
            <h2 className="section-heading mb-6 max-w-xl">
              No vendemos una arquitectura perfecta.
              <span className="block text-gradient-steel">Trabajamos con el entorno que ya existe.</span>
            </h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-md mb-8">
              Una evaluación útil no empieza con promesas. Empieza preguntando qué no se puede apagar,
              quien aprueba cambios y que excepciones llevan demasiado tiempo operando.
            </p>

            <div className="grid gap-3 mb-8">
              {TRUST.serviceBoundaries.map((boundary) => (
                <div key={boundary} className="flex items-start gap-3">
                  <span className="w-4 h-px mt-[0.65rem] flex-shrink-0 bg-white/[0.12]" />
                  <p className="text-zinc-600 text-sm leading-relaxed">{boundary}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/assessments"
                className="btn-amber text-sm px-6 py-3"
                onClick={() => {
                  trackCTA('Trust layer - Preparar evaluacion tecnica', 'trust-layer')
                  trackTrustSignal('discovery-readiness-cta', 'trust-layer', 'click')
                }}
              >
                Preparar evaluación técnica →
              </Link>
              <Link
                href="/framework/evidence"
                className="btn-ghost text-sm px-6 py-3"
                onClick={() => trackTrustSignal('evidence-library-cta', 'trust-layer', 'click')}
              >
                Ver evidencia sanitizada
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-8">
            <motion.div {...fadeUp(0.01)}>
              <div className="flex items-center gap-4 mb-5">
                <span className="label">Notas sanitizadas</span>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>
              <AnimeGridReveal grid={false} from="first" delay={56}>
                {FIELD_NOTES.map(({ label, context, note, decision }) => (
                  <article
                    key={label}
                    className="py-5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}
                  >
                    <div className="grid sm:grid-cols-[0.45fr_1fr] gap-3 sm:gap-8">
                      <div>
                        <h3 className="text-zinc-200 font-semibold text-sm mb-2">{label}</h3>
                        <p className="text-zinc-700 text-[11px] font-mono leading-relaxed">{context}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-3">{note}</p>
                        <p className="text-zinc-300 text-sm leading-relaxed">{decision}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </AnimeGridReveal>
            </motion.div>

            <motion.div {...fadeUp(0.02)} className="grid md:grid-cols-[0.85fr_1fr] gap-8">
              <div>
                <div className="label mb-4">Preparación de cliente</div>
                <div className="grid gap-0">
                  {READINESS_FLOW.map(([label, detail], index) => (
                    <div
                      key={label}
                      className="grid grid-cols-[2rem_1fr] gap-4 py-4"
                      style={index > 0 ? { borderTop: '1px solid rgba(255,255,255,0.045)' } : undefined}
                    >
                      <span className="text-zinc-700 text-[10px] font-mono tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <div className="text-zinc-300 font-semibold text-sm mb-1">{label}</div>
                        <p className="text-zinc-600 text-xs leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-6" style={{ border: '1px solid rgba(255,255,255,0.055)', background: 'rgba(255,255,255,0.018)' }}>
                <div className="label mb-4">Comunicación segura</div>
                <div className="space-y-3 mb-5">
                  {TRUST.secureCommunications.map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-zinc-700 mt-2 flex-shrink-0" />
                      <p className="text-zinc-500 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={TRUST.responsibleDisclosure.href}
                  className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors"
                  onClick={() => trackTrustSignal('responsible-disclosure-link', 'trust-layer', 'click')}
                >
                  {TRUST.responsibleDisclosure.label} →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
