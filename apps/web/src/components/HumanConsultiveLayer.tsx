'use client'

import Link from 'next/link'
import { trackCTA } from '@/components/Analytics'
import { getConsultiveContactTarget } from '@/lib/consultiveCta'

const FIELD_NOTES = [
  {
    label: 'Bloqueo',
    note: 'El cambio se detuvo hasta ubicar quién podía reiniciar switches sin afectar cajas.',
    state: 'riesgo aceptado',
  },
  {
    label: 'Decisión',
    note: 'MFA entró primero en modo reporte; proveedores y break-glass quedaron con dueño.',
    state: 'control aplicado',
  },
  {
    label: 'Cierre',
    note: 'La evidencia no fue un PDF bonito: incluyó rollback, excepciones y pendientes.',
    state: 'handoff real',
  },
]

const PROMPTS = [
  'Tenemos red plana y no sabemos por dónde empezar.',
  'Queremos activar MFA sin romper operación.',
  'Necesitamos revisar cámaras, VPN o sedes antes de crecer.',
]

function ContactAction({ source }: { source: string }) {
  const target = getConsultiveContactTarget(source)
  const className = 'human-contact-action'

  if (target.external) {
    return (
      <a
        href={target.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => trackCTA('WhatsApp consultivo', source, { channel: 'whatsapp' })}
      >
        <span>
          <strong>{target.label}</strong>
          <small>{target.supporting}</small>
        </span>
        <span aria-hidden="true">→</span>
      </a>
    )
  }

  return (
    <Link
      href={target.href}
      className={className}
      onClick={() => trackCTA('Contacto consultivo', source, { channel: 'contact-form' })}
    >
      <span>
        <strong>{target.label}</strong>
        <small>{target.supporting}</small>
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  )
}

export default function HumanConsultiveLayer() {
  return (
    <section className="home-section px-4 sm:px-8 human-consultive-section continuity-section" data-flow-region="human">
      <div className="max-w-7xl mx-auto">
        <div className="human-consultive-grid">
          <div className="human-consultive-copy">
            <span className="label block mb-5">Operadores reales</span>
            <h2 className="section-heading max-w-2xl mb-5">
              Antes de proponer, escuchamos cómo se mueve tu operación.
            </h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-xl">
              No todo empieza con una herramienta. A veces empieza con una ventana de cambio,
              una cuenta legacy, un switch sin dueño o una excepción que nadie quiere tocar.
            </p>
          </div>

          <div className="human-field-panel">
            <div className="human-field-panel-header">
              <span>Notas de campo</span>
              <small>sanitizadas · decisiones reales</small>
            </div>
            <div className="human-field-notes">
              {FIELD_NOTES.map(item => (
                <div key={item.label} className="human-field-note">
                  <div>
                    <span>{item.label}</span>
                    <p>{item.note}</p>
                  </div>
                  <small>{item.state}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="human-contact-strip">
          <div className="human-contact-prompts">
            {PROMPTS.map(prompt => (
              <span key={prompt}>{prompt}</span>
            ))}
          </div>
          <ContactAction source="home-human-layer" />
        </div>
      </div>
    </section>
  )
}
