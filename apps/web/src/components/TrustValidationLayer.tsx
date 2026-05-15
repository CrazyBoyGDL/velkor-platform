'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { trackCTA, trackMobileTrustEngagement, trackTrustSignal } from '@/components/Analytics'
import { TRUST } from '@/lib/config'
import { reveal as fadeUp } from '@/lib/motion'

const EXPECTATIONS = [
  'Alcance y exclusiones por escrito',
  'Ventana, rollback y responsable antes de producción',
  'Evidencia y pendientes documentados al cierre',
]

export default function TrustValidationLayer() {
  useEffect(() => {
    trackTrustSignal('reduced-trust-cta-viewed', 'home', 'view')
    trackMobileTrustEngagement('home', 'reduced-trust-cta')
  }, [])

  return (
    <section className="home-section px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp(0)} className="home-final-cta">
          <div>
            <span className="label block mb-4">Siguiente paso</span>
            <h2 className="section-heading mb-5 max-w-2xl">
              Una evaluación técnica para decidir con calma.
            </h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-xl">
              En una primera revisión se separan riesgos reales, restricciones operativas y acciones que sí conviene ejecutar.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-2">
              {EXPECTATIONS.map((item) => (
                <div key={item} className="home-trust-line">
                  <span className="w-1.5 h-1.5 rounded-full bg-[rgba(99,143,169,0.65)] mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/assessments"
                className="btn-amber text-sm px-7 py-3.5"
                onClick={() => {
                  trackCTA('Final trust CTA - Evaluación técnica', 'trust-layer')
                  trackTrustSignal('assessment-cta', 'trust-layer', 'click')
                }}
              >
                Iniciar evaluación →
              </Link>
              <Link
                href="/contacto"
                className="btn-ghost text-sm px-7 py-3.5"
                onClick={() => trackTrustSignal('contact-cta', 'trust-layer', 'click')}
              >
                Hablar con ingeniería
              </Link>
            </div>

            <div className="text-[10px] font-mono text-zinc-700 leading-relaxed">
              {TRUST.engagementModels.join(' · ')}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
