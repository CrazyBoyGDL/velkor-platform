import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nuestra Metodología | Framework Velkor de 5 Etapas',
  description:
    'Cómo trabajamos: diagnóstico, diseño, implementación, validación y handoff. Entregables claros en cada etapa, KPIs firmados antes de iniciar. Sin sorpresas.',
  alternates: { canonical: 'https://velkor.mx/framework' },
  openGraph: {
    title: 'Metodología Velkor | Framework de 5 Etapas',
    description:
      'De diagnóstico a resultados documentados. Entregables claros y KPIs firmados en cada etapa.',
  },
}

const STEPS = [
  {
    n: '01',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    title: 'Diagnóstico',
    duration: 'Semana 1',
    desc: 'Evaluación técnica profunda de la infraestructura actual: topología de red, identidades, dispositivos, cámaras y brechas de seguridad. Sin costo.',
    deliverables: [
      'Informe técnico de estado actual',
      'Mapa de brechas y riesgos',
      'Recomendaciones prioritizadas',
    ],
  },
  {
    n: '02',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    title: 'Diseño',
    duration: 'Semana 2',
    desc: 'Arquitectura de solución: topología de red propuesta, tecnologías seleccionadas, licencias necesarias y cronograma de implementación.',
    deliverables: [
      'Diagrama de arquitectura propuesta',
      'Lista de materiales y tecnologías',
      'Cotización detallada + cronograma',
    ],
  },
  {
    n: '03',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.25)',
    title: 'Implementación',
    duration: 'Semanas 3–6',
    desc: 'Despliegue técnico según el plan acordado. Cada cambio es documentado en tiempo real. Sin intervenciones no planificadas ni sorpresas de costo.',
    deliverables: [
      'Sistema funcionando en producción',
      'Log de cambios y configuraciones',
      'Pruebas de funcionamiento con cliente',
    ],
  },
  {
    n: '04',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    title: 'Validación',
    duration: 'Semana 7',
    desc: 'Verificación formal de que los KPIs comprometidos en el diseño se cumplen. Pruebas de seguridad básicas, revisión de alertas y aceptación técnica.',
    deliverables: [
      'Informe de validación con KPIs',
      'Pruebas de penetración básicas',
      'Acta de aceptación técnica',
    ],
  },
  {
    n: '05',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.25)',
    title: 'Handoff',
    duration: 'Semana 8',
    desc: 'Transferencia formal de conocimiento al equipo interno: capacitación, documentación de operación y activación del SLA de soporte continuo.',
    deliverables: [
      'Manual de operación completo',
      'Capacitación al equipo interno',
      'SLA activo y dashboard de monitoreo',
    ],
  },
]

const GUARANTEES = [
  { title: 'KPIs firmados antes de iniciar', desc: 'No empezamos sin comprometer métricas de éxito medibles. Tú sabes exactamente qué recibirás.' },
  { title: 'Sin cargos sorpresa', desc: 'La cotización del diseño es el precio final. Cualquier cambio de alcance se aprueba por escrito antes de ejecutar.' },
  { title: 'Documentación de cada cambio', desc: 'Cada acción técnica queda registrada. Al cierre, tienes visibilidad completa de tu infraestructura.' },
  { title: 'Soporte activo post-implementación', desc: 'El handoff no es un abandono. Activamos el SLA y tu equipo tiene acceso directo a los ingenieros que implementaron.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Metodología Velkor — Framework de implementación IT empresarial',
  description:
    'Proceso de 5 etapas para implementar infraestructura IT empresarial: diagnóstico, diseño, implementación, validación y handoff.',
  totalTime: 'P8W',
  step: STEPS.map(({ n, title, desc, deliverables }) => ({
    '@type': 'HowToStep',
    name: `Etapa ${n}: ${title}`,
    text: desc,
    itemListElement: deliverables.map(d => ({
      '@type': 'HowToDirection',
      text: d,
    })),
  })),
}

export default function FrameworkPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="label block mb-3">Metodología</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white leading-tight mb-5">
            Cómo convertimos tu problema<br />
            <span className="text-gradient-amber">en una solución funcionando</span>
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed">
            Ocho semanas. Cinco etapas. Entregables claros en cada una. KPIs comprometidos antes de tocar un solo cable.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mb-20">
          {/* Vertical connector line */}
          <div
            className="absolute left-[27px] top-10 bottom-10 w-px hidden sm:block"
            style={{ background: 'linear-gradient(180deg, rgba(245,158,11,0.3) 0%, rgba(6,182,212,0.3) 100%)' }}
          />

          <div className="space-y-6">
            {STEPS.map(({ n, color, bg, border, title, duration, desc, deliverables }) => (
              <div
                key={n}
                className="relative sm:pl-16"
              >
                {/* Step number bubble */}
                <div
                  className="hidden sm:flex absolute left-0 top-4 w-[54px] h-[54px] rounded-2xl items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                  style={{ background: bg, border: `1px solid ${border}`, color }}
                >
                  {n}
                </div>

                {/* Card */}
                <div
                  className="card p-7 hover:border-zinc-600 transition-colors"
                  style={{ borderTopColor: color, borderTopWidth: 2 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {/* Mobile step number */}
                      <div
                        className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl font-mono font-bold text-xs flex-shrink-0"
                        style={{ background: bg, border: `1px solid ${border}`, color }}
                      >
                        {n}
                      </div>
                      <h2 className="text-noc-white font-black text-xl">{title}</h2>
                    </div>
                    <span
                      className="badge text-[10px] font-mono flex-shrink-0"
                      style={{ color, backgroundColor: bg }}
                    >
                      {duration}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-5">{desc}</p>

                  <div>
                    <div className="label text-[10px] mb-3">Entregables</div>
                    <ul className="space-y-2">
                      {deliverables.map(d => (
                        <li key={d} className="flex items-center gap-2.5">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                          <span className="text-zinc-500 text-sm">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-16">
          <span className="label block mb-6">Compromisos del proceso</span>
          <div className="grid sm:grid-cols-2 gap-4">
            {GUARANTEES.map(({ title, desc }) => (
              <div
                key={title}
                className="card p-6 hover:border-zinc-600 transition-colors"
                style={{ borderLeftColor: '#f59e0b', borderLeftWidth: 2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                  <h3 className="text-noc-white font-semibold text-sm">{title}</h3>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed ml-3.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card p-10 text-center border-amber/20">
          <span className="label block mb-3">¿Listo para la etapa 01?</span>
          <h2 className="text-2xl font-black text-noc-white mb-3">
            El diagnóstico no tiene costo
          </h2>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Comienza con una evaluación técnica de tu infraestructura. Sin compromiso, con resultados claros en 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/assessments" className="btn-amber px-10 py-3.5 text-[15px]">
              Iniciar diagnóstico →
            </Link>
            <Link href="/casos" className="btn-ghost px-10 py-3.5 text-[15px]">
              Ver resultados reales
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
