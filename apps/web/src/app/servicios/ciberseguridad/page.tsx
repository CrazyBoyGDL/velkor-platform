import type { Metadata } from 'next'
import Link from 'next/link'
import TrackedLink from '@/components/TrackedLink'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'

export const metadata: Metadata = {
  title: 'Ciberseguridad Empresarial | Fortinet · Zero Trust · Redes',
  description:
    'Firewall Fortinet FortiGate, segmentación VLAN, VPN y arquitectura Zero Trust para empresas en México. Ingenieros especializados. Diagnóstico gratuito.',
  alternates: { canonical: 'https://velkor.mx/servicios/ciberseguridad' },
  openGraph: {
    title: 'Ciberseguridad Empresarial | Velkor',
    description:
      'Fortinet FortiGate, segmentación VLAN y arquitectura Zero Trust para empresas.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto tarda la migración de un firewall en producción?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para sitios de hasta 200 usuarios, realizamos la migración en un fin de semana con cero downtime planificado. El lunes tu equipo llega a una red mejor segmentada y documentada.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tienen experiencia implementando Fortinet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Nuestros ingenieros tienen experiencia directa implementando FortiGate en producción, con proyectos activos en empresas de distintos sectores en México.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es Zero Trust en la práctica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Verificar siempre, nunca confiar por defecto. Cada dispositivo debe demostrar que cumple políticas antes de acceder a recursos, independientemente de si está dentro o fuera de la red.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo mantener mi conectividad ISP actual?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Diseñamos la solución sobre tu conectividad existente y podemos agregar redundancia con failover automático entre proveedores.',
      },
    },
  ],
}

const PROBLEMS = [
  {
    hex: '#ef4444',
    title: 'Red plana sin segmentación',
    desc: 'Un dispositivo comprometido puede moverse libremente entre servidores, impresoras y endpoints. Un solo punto de falla afecta toda la organización.',
  },
  {
    hex: '#b07828',
    title: 'Firewall sin inspección profunda',
    desc: 'Los firewalls básicos solo filtran puertos y IPs. Sin IPS/IDS ni Application Control, el malware en tráfico HTTPS pasa sin alarmas.',
  },
  {
    hex: '#ef4444',
    title: 'Sin visibilidad de incidentes',
    desc: 'Sin SIEM ni alertas configuradas, los ataques se detectan días después de ocurrir — cuando el daño ya está hecho.',
  },
]

const SOLUTIONS = [
  {
    hex: '#4878b0',
    title: 'Segmentación operacional que contiene el radio de impacto',
    desc: 'Un incidente en la VLAN de usuarios no puede alcanzar servidores ni el ERP. El movimiento lateral queda bloqueado por diseño, no por esperanza.',
  },
  {
    hex: '#4878b0',
    title: 'Inspección profunda sin puntos ciegos en tráfico cifrado',
    desc: 'SSL Inspection + Application Control sobre tráfico HTTPS. El malware que entra en sesiones cifradas deja de pasar sin alarma.',
  },
  {
    hex: '#4878b0',
    title: 'Acceso remoto con trazabilidad y revocación en tiempo real',
    desc: 'VPN corporativa con autenticación de doble factor. Cada sesión remota es auditable, limitada en tiempo y revocable sin dependencia de usuario.',
  },
  {
    hex: '#4878b0',
    title: 'Detección activa — no reactiva — de comportamiento anómalo',
    desc: 'IPS con perfiles calibrados al entorno, no plantillas genéricas. Alertas de tráfico lateral inusual antes de que el daño sea visible.',
  },
  {
    hex: '#4878b0',
    title: 'Sucursales conectadas con failover automático y cifrado en tránsito',
    desc: 'SD-WAN sobre ISPs múltiples con IPsec site-to-site. Si el enlace principal cae, el failover es transparente al usuario en menos de 60 segundos.',
  },
  {
    hex: '#4878b0',
    title: 'Topología documentada y runbook operacional al cierre',
    desc: 'Diagrama L2/L3 actualizado, políticas de firewall explicadas y procedimiento de respuesta ante incidente. Tu equipo no depende de quien implementó.',
  },
]

const TECHS = [
  'Fortinet FortiGate', 'FortiGate 100F', 'FortiSwitch', 'FortiAP',
  'Cisco Catalyst', 'SD-WAN', 'IPsec VPN', 'SSL VPN',
  'VLAN 802.1Q', 'QoS', 'IPS/IDS', 'Log & Alertas',
]

const FAQ = [
  {
    q: '¿Cuánto tarda la migración de un firewall en producción?',
    a: 'Para sitios de hasta 200 usuarios, realizamos la migración en un fin de semana con cero downtime planificado. El lunes tu equipo llega a una red mejor segmentada y documentada.',
  },
  {
    q: '¿Tienen experiencia implementando Fortinet?',
    a: 'Sí. Nuestros ingenieros tienen experiencia directa implementando FortiGate en producción, con proyectos activos en empresas de distintos sectores en México.',
  },
  {
    q: '¿Qué es Zero Trust en la práctica?',
    a: 'Verificar siempre, nunca confiar por defecto. Cada dispositivo debe demostrar que cumple políticas antes de acceder a recursos, independientemente de si está dentro o fuera de la red.',
  },
  {
    q: '¿Puedo mantener mi conectividad ISP actual?',
    a: 'Sí. Diseñamos la solución sobre tu conectividad existente y podemos agregar redundancia con failover automático entre proveedores.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ciberseguridad Empresarial',
  description:
    'Diseño e implementación de arquitecturas de red seguras: Fortinet FortiGate, segmentación VLAN, VPN y Zero Trust.',
  provider: { '@type': 'Organization', name: 'Velkor System', url: 'https://velkor.mx' },
  areaServed: { '@type': 'Country', name: 'México' },
  serviceType: 'Ciberseguridad Empresarial',
  offers: {
    '@type': 'Offer',
    description: 'Diagnóstico técnico de infraestructura de red sin costo.',
    price: '0',
    priceCurrency: 'MXN',
  },
}

export default function CiberseguridadPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <ScrollDepthTracker page="servicios-ciberseguridad" />

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
          style={{ borderLeft: '3px solid #4878b0' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="badge text-[10px] font-mono" style={{ color: '#4878b0', backgroundColor: '#4878b018' }}>
              REDES & CIBERSEGURIDAD
            </span>
            <span className="text-zinc-700 text-[10px] font-mono">ESPECIALISTAS FORTINET</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white leading-tight mb-4">
            Tu red, blindada<br />
            <span style={{ color: '#4878b0' }}>desde adentro.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
            Diseñamos e implementamos arquitecturas de red seguras con firewalls Fortinet FortiGate, segmentación VLAN y controles de acceso que eliminan movimientos laterales desde el primer día.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <TrackedLink href="/assessments" className="btn-amber px-8 py-3.5 text-[15px]"
              trackLabel="Ciberseguridad — Hero CTA">
              Diagnóstico de red gratuito →
            </TrackedLink>
            <TrackedLink href="/casos" className="btn-ghost px-8 py-3.5 text-[15px]"
              trackLabel="Ciberseguridad — Ver casos">
              Ver casos de éxito
            </TrackedLink>
          </div>
        </div>

        {/* Problems */}
        <div className="mb-14">
          <span className="label block mb-6">Señales de alerta</span>
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
                style={{ borderLeftColor: '#4878b0', borderLeftWidth: 2 }}
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
              <div
                key={q}
                className="card p-6 hover:border-zinc-600 transition-colors"
              >
                <h3 className="text-noc-white font-semibold text-sm mb-2">{q}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card p-10 text-center border-blue-500/20">
          <div className="text-xs font-mono text-zinc-600 mb-3">SIGUIENTE PASO</div>
          <h2 className="text-2xl font-black text-noc-white mb-3">
            Diagnóstico de red en 24 horas
          </h2>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Evaluamos tu topología actual, identificamos vulnerabilidades y entregamos un informe técnico con plan de acción. Sin costo.
          </p>
          <TrackedLink href="/assessments" className="btn-amber px-10 py-3.5 text-[15px]"
            trackLabel="Ciberseguridad — Bottom CTA">
            Solicitar diagnóstico →
          </TrackedLink>
        </div>

      </div>
    </div>
  )
}
