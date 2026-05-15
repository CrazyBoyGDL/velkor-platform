import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Metodología Velkor | Proceso Operacional',
  description:
    'Proceso consultivo para diagnosticar, diseñar, implementar y validar infraestructura empresarial sin improvisar cambios críticos.',
  alternates: { canonical: 'https://velkor.mx/framework' },
}

const PROCESS = [
  {
    n: '01',
    title: 'Diagnóstico',
    checkpoint: 'Riesgo, dependencias y restricciones reales.',
  },
  {
    n: '02',
    title: 'Diseño',
    checkpoint: 'Arquitectura, alcance, exclusiones y rollback.',
  },
  {
    n: '03',
    title: 'Implementación',
    checkpoint: 'Cambios por ventana, evidencia por fase.',
  },
  {
    n: '04',
    title: 'Validación',
    checkpoint: 'Pruebas, aceptación técnica y pendientes.',
  },
  {
    n: '05',
    title: 'Handoff',
    checkpoint: 'Documentación y responsables para operar.',
  },
]

const CHECKPOINTS = [
  'No se toca producción sin ventana aprobada.',
  'Toda excepción queda con dueño y fecha de revisión.',
  'El cierre incluye evidencia, no solo “quedó funcionando”.',
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Metodología Velkor',
  description: 'Proceso operacional para infraestructura empresarial.',
  step: PROCESS.map(({ n, title, checkpoint }) => ({
    '@type': 'HowToStep',
    name: `${n}. ${title}`,
    text: checkpoint,
  })),
}

export default function FrameworkPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="mb-14 max-w-3xl">
          <span className="label">Metodología</span>
          <h1 className="display-heading mt-4 mb-5">
            Proceso claro antes de mover infraestructura.
          </h1>
          <p className="editorial-lede max-w-xl">
            La confianza viene del orden: diagnóstico, diseño, ventana, rollback, validación y handoff.
          </p>
        </header>

        <section className="framework-process-map depth-1">
          {PROCESS.map(({ n, title, checkpoint }) => (
            <div key={n} className="framework-process-node">
              <span>{n}</span>
              <h2>{title}</h2>
              <p>{checkpoint}</p>
            </div>
          ))}
        </section>

        <section className="grid lg:grid-cols-[0.82fr_1.18fr] gap-10 lg:gap-16 items-start mt-16">
          <div>
            <span className="label block mb-4">Control operacional</span>
            <h2 className="section-heading max-w-xl">
              Menos promesas. Más puntos de control.
            </h2>
          </div>

          <div className="framework-checkpoints">
            {CHECKPOINTS.map(item => (
              <div key={item}>
                <i aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="framework-depth-links">
          <Link href="/framework/operational-framework" className="btn-ghost px-6 py-3 text-sm">
            Ver metodología completa →
          </Link>
          <Link href="/framework/evidence" className="btn-ghost px-6 py-3 text-sm">
            Ver evidencia operacional →
          </Link>
          <Link href="/assessments" className="btn-amber px-7 py-3 text-sm">
            Validar entorno →
          </Link>
        </section>
      </div>
    </div>
  )
}
