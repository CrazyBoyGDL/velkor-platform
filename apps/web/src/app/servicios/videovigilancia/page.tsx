import type { Metadata } from 'next'
import Link from 'next/link'
import TrackedLink from '@/components/TrackedLink'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'

export const metadata: Metadata = {
  title: 'Videovigilancia IP Empresarial | Axis · NVR 4K · IA Analytics',
  description:
    'Sistemas CCTV IP con cámaras Axis e Hikvision, NVR centralizado y analítica con IA para empresas en México. Instalación profesional con soporte activo.',
  alternates: { canonical: 'https://velkor.mx/servicios/videovigilancia' },
  openGraph: {
    title: 'Videovigilancia IP Empresarial | Velkor',
    description:
      'Cámaras IP Axis, NVR 4K y analítica de comportamiento para empresas.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuántas cámaras puede gestionar el sistema?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Diseñamos desde sistemas de 8 cámaras para una sede única hasta instalaciones de 256+ canales multi-sede, con NVR dimensionado para cada caso.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Pueden integrarse las cámaras analógicas existentes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, si son cámaras ONVIF pueden integrarse al NVR IP. Las cámaras analógicas tradicionales requieren encoders o reemplazo según el estado.',
      },
    },
    {
      '@type': 'Question',
      name: '¿La retención de video cumple con regulaciones?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Configuramos la retención según el sector: 30 días para comercial, 60 para salud y 90 días o más para regulaciones específicas.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si se interrumpe la conexión a internet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El NVR local graba continuamente sin internet. La nube y el acceso remoto se restauran automáticamente al recuperar la conectividad.',
      },
    },
  ],
}

const PROBLEMS = [
  {
    hex: '#ef4444',
    title: 'Cámaras analógicas obsoletas',
    desc: 'Resolución insuficiente para identificar personas, sin acceso remoto y grabaciones que se pierden o corrompen sin alertas.',
  },
  {
    hex: '#f59e0b',
    title: 'Sin analítica de comportamiento',
    desc: 'Solo grabas, no detectas. Las alertas llegan horas después del incidente, cuando ya no hay nada que hacer.',
  },
  {
    hex: '#ef4444',
    title: 'Sistemas aislados por sucursal',
    desc: 'Cada sede tiene su propio DVR sin consola centralizada. La revisión de un incidente requiere desplazamiento físico.',
  },
]

const SOLUTIONS = [
  {
    hex: '#06b6d4',
    title: 'Cámaras IP 4K Axis e Hikvision',
    desc: 'Imagen ultraHD con visión nocturna, WDR y rango dinámico para cualquier condición de iluminación. Conectividad PoE+.',
  },
  {
    hex: '#06b6d4',
    title: 'NVR centralizado multi-sede',
    desc: 'Grabación continua con retención de 30, 60 o 90 días según necesidad. Redundancia RAID y acceso remoto cifrado.',
  },
  {
    hex: '#06b6d4',
    title: 'Analítica con IA',
    desc: 'Detección de intrusos, conteo de personas, zonas restringidas, reconocimiento de vehículos y alertas de comportamiento.',
  },
  {
    hex: '#06b6d4',
    title: 'Monitoreo remoto 24/7',
    desc: 'Acceso desde app móvil y web con notificaciones push en tiempo real. Dashboard unificado para todas las sedes.',
  },
  {
    hex: '#06b6d4',
    title: 'Integración con control de acceso',
    desc: 'Video vinculado a lectores de tarjeta y torniquetes. Correlación de eventos de acceso con imágenes de cámara.',
  },
  {
    hex: '#06b6d4',
    title: 'Diseño profesional y documentación',
    desc: 'Relevamiento técnico, plano de ubicación de cámaras, cableado PoE+ y entrega de manual de operación.',
  },
]

const TECHS = [
  'Axis Communications', 'Hikvision', 'NVR 4K', 'PoE+ 802.3bt',
  'ONVIF', 'AI Analytics', 'RTSP', 'H.265+',
  'Milestone XProtect', 'RAID', 'VMS', 'Control de acceso',
]

const FAQ = [
  {
    q: '¿Cuántas cámaras puede gestionar el sistema?',
    a: 'Diseñamos desde sistemas de 8 cámaras para una sede única hasta instalaciones de 256+ canales multi-sede, con NVR dimensionado para cada caso.',
  },
  {
    q: '¿Pueden integrarse las cámaras analógicas existentes?',
    a: 'Sí, si son cámaras ONVIF pueden integrarse al NVR IP. Las cámaras analógicas tradicionales requieren encoders o reemplazo según el estado.',
  },
  {
    q: '¿La retención de video cumple con regulaciones?',
    a: 'Configuramos la retención según el sector: 30 días para comercial, 60 para salud y 90 días o más para regulaciones específicas.',
  },
  {
    q: '¿Qué pasa si se interrumpe la conexión a internet?',
    a: 'El NVR local graba continuamente sin internet. La nube y el acceso remoto se restauran automáticamente al recuperar la conectividad.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Videovigilancia IP Empresarial',
  description:
    'Instalación de cámaras IP Axis e Hikvision, NVR centralizado y analítica con IA para empresas.',
  provider: { '@type': 'Organization', name: 'Velkor System', url: 'https://velkor.mx' },
  areaServed: { '@type': 'Country', name: 'México' },
  serviceType: 'Videovigilancia IP',
  offers: {
    '@type': 'Offer',
    description: 'Relevamiento técnico y diseño de sistema de videovigilancia sin costo.',
    price: '0',
    priceCurrency: 'MXN',
  },
}

export default function VideovigilanciaPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <ScrollDepthTracker page="servicios-videovigilancia" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        {/* Breadcrumb */}
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors mb-10"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M3.828 7H14a1 1 0 110 2H3.828l2.829 2.828a1 1 0 11-1.414 1.414L1 9l-.707-.707L1 7.586 5.243 3.343A1 1 0 016.657 4.757L3.828 7z" />
          </svg>
          Servicios
        </Link>

        {/* Hero */}
        <div
          className="mb-14 pl-5"
          style={{ borderLeft: '3px solid #06b6d4' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="badge text-[10px] font-mono" style={{ color: '#06b6d4', backgroundColor: '#06b6d418' }}>
              VIDEOVIGILANCIA IP
            </span>
            <span className="text-zinc-700 text-[10px] font-mono">AXIS ACSR CERTIFIED</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white leading-tight mb-4">
            Ve todo.<br />
            <span style={{ color: '#06b6d4' }}>Responde antes.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
            Instalamos sistemas IP con cámaras Axis e Hikvision 4K, NVR centralizado con retención hasta 90 días y analítica con IA para detectar incidentes en tiempo real, no horas después.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <TrackedLink href="/assessments" className="btn-amber px-8 py-3.5 text-[15px]"
              trackLabel="Videovigilancia — Hero CTA">
              Diseño de sistema gratuito →
            </TrackedLink>
            <TrackedLink href="/casos" className="btn-ghost px-8 py-3.5 text-[15px]"
              trackLabel="Videovigilancia — Ver casos">
              Ver caso retail
            </TrackedLink>
          </div>
        </div>

        {/* Problems */}
        <div className="mb-14">
          <span className="label block mb-6">Problemas que resolvemos</span>
          <div className="grid sm:grid-cols-3 gap-4">
            {PROBLEMS.map(({ hex, title, desc }) => (
              <div
                key={title}
                className="card p-6"
                style={{ borderTopColor: hex, borderTopWidth: 2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: hex }} />
                  <h3 className="text-noc-white font-semibold text-sm">{title}</h3>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div className="mb-14">
          <span className="label block mb-6">Lo que instalamos</span>
          <div className="grid sm:grid-cols-2 gap-4">
            {SOLUTIONS.map(({ title, desc }) => (
              <div
                key={title}
                className="card p-6 hover:border-zinc-600 transition-colors group"
                style={{ borderLeftColor: '#06b6d4', borderLeftWidth: 2 }}
              >
                <h3 className="text-noc-white font-semibold text-sm mb-2 group-hover:text-white transition-colors">
                  {title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-14">
          <span className="label block mb-4">Tecnologías</span>
          <div className="flex flex-wrap gap-2">
            {TECHS.map(t => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg border border-surface-border text-zinc-400 text-xs font-mono hover:border-zinc-600 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-14">
          <span className="label block mb-6">Preguntas frecuentes</span>
          <div className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="card p-6 hover:border-zinc-600 transition-colors">
                <h3 className="text-noc-white font-semibold text-sm mb-2">{q}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card p-10 text-center" style={{ borderColor: '#06b6d430' }}>
          <div className="text-xs font-mono text-zinc-600 mb-3">SIGUIENTE PASO</div>
          <h2 className="text-2xl font-black text-noc-white mb-3">
            Diseño de sistema sin costo
          </h2>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Realizamos el relevamiento técnico, diseño de plano de cámaras y propuesta con costos reales. Sin compromiso.
          </p>
          <TrackedLink href="/assessments" className="btn-amber px-10 py-3.5 text-[15px]"
            trackLabel="Videovigilancia — Bottom CTA">
            Solicitar relevamiento →
          </TrackedLink>
        </div>

      </div>
    </div>
  )
}
