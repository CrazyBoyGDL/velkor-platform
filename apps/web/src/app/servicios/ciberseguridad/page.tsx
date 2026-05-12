import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ciberseguridad Empresarial | Fortinet · Zero Trust · Redes',
  description:
    'Firewall Fortinet FortiGate, segmentación VLAN, VPN y arquitectura Zero Trust para empresas en México. Ingenieros NSE4 certificados. Diagnóstico gratuito.',
  alternates: { canonical: 'https://velkor.mx/servicios/ciberseguridad' },
  openGraph: {
    title: 'Ciberseguridad Empresarial | Velkor',
    description:
      'Fortinet FortiGate, segmentación VLAN y arquitectura Zero Trust para empresas.',
  },
}

const PROBLEMS = [
  {
    hex: '#ef4444',
    title: 'Red plana sin segmentación',
    desc: 'Un dispositivo comprometido puede moverse libremente entre servidores, impresoras y endpoints. Un solo punto de falla afecta toda la organización.',
  },
  {
    hex: '#f59e0b',
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
    hex: '#3b82f6',
    title: 'Fortinet FortiGate NGFW',
    desc: 'Firewall de próxima generación con IPS, Application Control, Anti-Malware y SSL Inspection. Visibilidad total del tráfico.',
  },
  {
    hex: '#3b82f6',
    title: 'Segmentación por VLAN',
    desc: 'Red de usuarios separada de servidores, IoT, impresoras e invitados. Movimiento lateral bloqueado por diseño.',
  },
  {
    hex: '#3b82f6',
    title: 'VPN corporativa',
    desc: 'Site-to-site IPsec para sucursales y SSL VPN para acceso remoto seguro. Autenticación de doble factor integrada.',
  },
  {
    hex: '#3b82f6',
    title: 'Arquitectura Zero Trust',
    desc: 'Ningún dispositivo o usuario es confiable por defecto. Cada acceso requiere verificación, sin importar la ubicación.',
  },
  {
    hex: '#3b82f6',
    title: 'Monitoreo y alertas NOC',
    desc: 'Alertas en tiempo real ante comportamientos anómalos, intentos de intrusión y tráfico sospechoso. Respuesta < 15 min.',
  },
  {
    hex: '#3b82f6',
    title: 'Documentación completa',
    desc: 'Diagrama de red actualizado, runbook de operación y procedimientos de respuesta ante incidentes entregados al cierre.',
  },
]

const TECHS = [
  'Fortinet NSE4', 'FortiGate 100F', 'FortiSwitch', 'FortiAP',
  'Cisco Catalyst', 'SD-WAN', 'IPsec VPN', 'SSL VPN',
  'VLAN 802.1Q', 'QoS', 'IPS/IDS', 'SIEM básico',
]

const FAQ = [
  {
    q: '¿Cuánto tarda la migración de un firewall en producción?',
    a: 'Para sitios de hasta 200 usuarios, realizamos la migración en un fin de semana con cero downtime planificado. El lunes tu equipo llega a una red mejor segmentada y documentada.',
  },
  {
    q: '¿Tienen ingenieros certificados en Fortinet?',
    a: 'Sí. Nuestros ingenieros de red cuentan con certificación Fortinet NSE4 y proyectos activos de FortiGate en producción.',
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          style={{ borderLeft: '3px solid #3b82f6' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="badge text-[10px] font-mono" style={{ color: '#3b82f6', backgroundColor: '#3b82f618' }}>
              REDES & CIBERSEGURIDAD
            </span>
            <span className="text-zinc-700 text-[10px] font-mono">FORTINET NSE4 CERTIFIED</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white leading-tight mb-4">
            Tu red, blindada<br />
            <span style={{ color: '#3b82f6' }}>desde adentro.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
            Diseñamos e implementamos arquitecturas de red seguras con firewalls Fortinet, segmentación por VLAN y monitoreo activo para que ningún incidente pase desapercibido.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/assessments" className="btn-amber px-8 py-3.5 text-[15px]">
              Diagnóstico de red gratuito →
            </Link>
            <Link href="/casos" className="btn-ghost px-8 py-3.5 text-[15px]">
              Ver casos de éxito
            </Link>
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
                style={{ borderLeftColor: '#3b82f6', borderLeftWidth: 2 }}
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
          <Link href="/assessments" className="btn-amber px-10 py-3.5 text-[15px]">
            Solicitar diagnóstico →
          </Link>
        </div>

      </div>
    </div>
  )
}
