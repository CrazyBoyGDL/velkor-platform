import type { Metadata } from 'next'
import Link from 'next/link'
import TrackedLink from '@/components/TrackedLink'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'

export const metadata: Metadata = {
  title: 'Gestión de Identidad y Acceso | Entra ID · Intune · MFA',
  description:
    'Implementación de Microsoft Entra ID, Intune y MFA para empresas en México. Acceso Condicional, Zero Trust y gobernanza de identidades. Ingenieros Microsoft certificados.',
  alternates: { canonical: 'https://velkor.mx/servicios/identidad-acceso' },
  openGraph: {
    title: 'Gestión de Identidad y Acceso | Velkor',
    description:
      'Microsoft Entra ID, Intune y MFA para que cada acceso sea auditado y condicional.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo toma la implementación?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Entre 3 y 6 semanas según el número de usuarios y la complejidad del entorno. Entregamos un cronograma detallado en la fase de diseño.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Necesitamos tener Microsoft 365 ya contratado?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No necesariamente. Si aún no lo tienen, lo configuramos desde cero incluyendo licenciamiento. Si ya lo tienen, auditamos el tenant y aplicamos mejoras.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa con los equipos Windows existentes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Se pueden incorporar a Intune sin reinstalar el sistema operativo usando el método de inscripción automática de Entra ID.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Esto aplica también a dispositivos móviles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Gestionamos iOS y Android con Intune MAM, que protege datos corporativos en apps sin necesidad de gestionar el dispositivo completo.',
      },
    },
  ],
}

const PROBLEMS = [
  {
    hex: '#ef4444',
    title: 'Contraseñas como única barrera',
    desc: 'El 81 % de las brechas comienzan con credenciales robadas. Sin MFA, una sola contraseña comprometida da acceso irrestricto a todo.',
  },
  {
    hex: '#b07828',
    title: 'Dispositivos sin inventario ni política',
    desc: 'Equipos sin MDM pueden acceder a datos corporativos sin que IT lo sepa, sin cifrado y sin posibilidad de borrado remoto.',
  },
  {
    hex: '#ef4444',
    title: 'Admins con acceso permanente',
    desc: 'Cuentas con privilegios elevados las 24 h del día son un objetivo prioritario. Sin PIM, el radio de impacto de un compromiso es máximo.',
  },
]

const SOLUTIONS = [
  {
    hex: '#3a7858',
    title: 'Cada acceso evalúa contexto — no solo contraseña',
    desc: 'Acceso Condicional: ¿quién es, desde qué dispositivo, desde dónde y con qué riesgo? El acceso se concede o bloquea por política, no por inercia.',
  },
  {
    hex: '#3a7858',
    title: 'Credencial comprometida no alcanza los datos',
    desc: 'MFA obligatorio con Authenticator o FIDO2. Si la contraseña se filtra, el atacante se detiene en la segunda barrera — sin excepción.',
  },
  {
    hex: '#3a7858',
    title: 'Dispositivos sin gestión dejan de tener acceso corporativo',
    desc: 'Intune MDM evalúa cumplimiento antes de que el dispositivo acceda a M365. Un equipo sin cifrado o sin AV activo no llega a los datos, aunque tenga credenciales válidas.',
  },
  {
    hex: '#3a7858',
    title: 'Nuevos empleados acceden al 100% de sus herramientas desde el día uno',
    desc: 'Autopilot + provisioning automático. El equipo llega por mensajería, el usuario lo enciende y en 45 minutos tiene todo configurado sin intervención de IT.',
  },
  {
    hex: '#3a7858',
    title: 'Administradores sin privilegios permanentes — sin superficie de ataque',
    desc: 'PIM just-in-time: los admins elevan permisos cuando los necesitan, por el tiempo justo, con aprobación. Sin cuentas con acceso root las 24 horas.',
  },
  {
    hex: '#3a7858',
    title: 'Datos sensibles que no pueden salir de los canales autorizados',
    desc: 'Purview DLP previene que información de pacientes, contratos o datos financieros salga por correo personal, USB o share externo — sin bloquear el flujo de trabajo normal.',
  },
]

const TECHS = [
  'Microsoft Entra ID', 'Microsoft Intune', 'Entra Connect',
  'Windows Autopilot', 'FIDO2 / Passkeys', 'PIM', 'SSPR',
  'Acceso Condicional', 'Microsoft Purview DLP', 'Defender for Identity',
]

const FAQ = [
  {
    q: '¿Cuánto tiempo toma la implementación?',
    a: 'Entre 3 y 6 semanas según el número de usuarios y la complejidad del entorno. Entregamos un cronograma detallado en la fase de diseño.',
  },
  {
    q: '¿Necesitamos tener Microsoft 365 ya contratado?',
    a: 'No necesariamente. Si aún no lo tienen, lo configuramos desde cero incluyendo licenciamiento. Si ya lo tienen, auditamos el tenant y aplicamos mejoras.',
  },
  {
    q: '¿Qué pasa con los equipos Windows existentes?',
    a: 'Se pueden incorporar a Intune sin reinstalar el sistema operativo usando el método de inscripción automática de Entra ID.',
  },
  {
    q: '¿Esto aplica también a dispositivos móviles?',
    a: 'Sí. Gestionamos iOS y Android con Intune MAM, que protege datos corporativos en apps sin necesidad de gestionar el dispositivo completo.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Gestión de Identidad y Acceso Empresarial',
  description:
    'Implementación de Microsoft Entra ID, Intune y MFA. Acceso Condicional, Zero Trust y gobernanza de identidades.',
  provider: { '@type': 'Organization', name: 'Velkor System', url: 'https://velkor.mx' },
  areaServed: { '@type': 'Country', name: 'México' },
  serviceType: 'Identity and Access Management',
  offers: {
    '@type': 'Offer',
    description: 'Diagnóstico de identidad y acceso sin costo.',
    price: '0',
    priceCurrency: 'MXN',
  },
}

export default function IdentidadAccesoPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <ScrollDepthTracker page="servicios-identidad-acceso" />

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
          style={{ borderLeft: '3px solid #3a7858' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="badge text-[10px] font-mono" style={{ color: '#3a7858', backgroundColor: '#3a785818' }}>
              IDENTIDAD & ACCESO
            </span>
            <span className="text-zinc-700 text-[10px] font-mono">MICROSOFT CERTIFIED</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white leading-tight mb-4">
            Cada identidad,<br />
            <span style={{ color: '#3a7858' }}>bajo control.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
            Implementamos Microsoft Entra ID, Intune y MFA para que cada acceso en tu empresa sea auditado, condicional y revocable en tiempo real. Zero Trust por diseño.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <TrackedLink href="/assessments" className="btn-amber px-8 py-3.5 text-[15px]"
              trackLabel="Identidad — Hero CTA">
              Diagnóstico de identidad gratuito →
            </TrackedLink>
            <TrackedLink href="/casos" className="btn-ghost px-8 py-3.5 text-[15px]"
              trackLabel="Identidad — Ver casos">
              Ver casos de éxito
            </TrackedLink>
          </div>
        </div>

        {/* Problems */}
        <div className="mb-14">
          <span className="label block mb-6">Riesgos más comunes</span>
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
          <span className="label block mb-6">Lo que implementamos</span>
          <div className="grid sm:grid-cols-2 gap-4">
            {SOLUTIONS.map(({ title, desc }) => (
              <div
                key={title}
                className="card p-6 hover:border-zinc-600 transition-colors group"
                style={{ borderLeftColor: '#3a7858', borderLeftWidth: 2 }}
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
        <div className="card p-10 text-center" style={{ borderColor: '#3a785830' }}>
          <div className="text-xs font-mono text-zinc-600 mb-3">SIGUIENTE PASO</div>
          <h2 className="text-2xl font-black text-noc-white mb-3">
            Auditoría de identidad en 24 horas
          </h2>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Revisamos tu entorno de Entra ID, políticas de acceso y dispositivos gestionados. Entregamos un informe con brechas y recomendaciones. Sin costo.
          </p>
          <TrackedLink href="/assessments" className="btn-amber px-10 py-3.5 text-[15px]"
            trackLabel="Identidad — Bottom CTA">
            Solicitar diagnóstico →
          </TrackedLink>
        </div>

      </div>
    </div>
  )
}
