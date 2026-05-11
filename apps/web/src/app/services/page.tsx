import Link from 'next/link'

const CATEGORIES = [
  {
    id: 'networks',
    label: 'Redes & Conectividad',
    color: 'text-noc-blue',
    border: 'border-noc-blue/30',
    services: [
      { name: 'Diseño e implementación LAN/WAN', desc: 'Cableado estructurado, switching, routing y segmentación por VLANs para sitios empresariales.' },
      { name: 'Wi-Fi corporativo gestionado', desc: 'Wi-Fi basado en controladora con portal cautivo, roaming y gestión de ancho de banda.' },
      { name: 'Firewall & UTM', desc: 'Seguridad perimetral con Next-Gen firewalls (Fortinet, Cisco), IDS/IPS y VPN.' },
      { name: 'SD-WAN', desc: 'Conectividad multi-sede definida por software con QoS y failover automático.' },
    ],
  },
  {
    id: 'cctv',
    label: 'CCTV & Vigilancia',
    color: 'text-noc-cyan',
    border: 'border-noc-cyan/20',
    services: [
      { name: 'Diseño de sistema IP', desc: 'Relevamiento técnico, plano de ubicación de cámaras, switching PoE y cableado.' },
      { name: 'Configuración NVR/DVR', desc: 'Almacenamiento, programación de grabación, detección de movimiento y acceso remoto.' },
      { name: 'Video analítica con IA', desc: 'Detección de intrusos, conteo de personas, lectura de patentes y alertas perimetrales.' },
      { name: 'Monitoreo remoto 24/7', desc: 'Centro de monitoreo NOC con respuesta a alarmas e informes de incidentes.' },
    ],
  },
  {
    id: 'cloud',
    label: 'Microsoft 365 & Cloud',
    color: 'text-noc-blue',
    border: 'border-noc-blue/30',
    services: [
      { name: 'Setup de tenant Microsoft 365', desc: 'Provisionamiento completo: dominio, Exchange Online, Teams y licencias.' },
      { name: 'SharePoint & OneDrive', desc: 'Diseño de intranet, bibliotecas de documentos, permisos y políticas de compartición.' },
      { name: 'Gestión de licencias', desc: 'Optimización de suscripciones, provisionamiento de usuarios y análisis de costos.' },
      { name: 'Seguridad de correo', desc: 'SPF/DKIM/DMARC, Defender para Office 365, anti-phishing y DLP.' },
    ],
  },
  {
    id: 'identity',
    label: 'Intune & Entra ID',
    color: 'text-noc-green',
    border: 'border-noc-green/20',
    services: [
      { name: 'Configuración Entra ID', desc: 'Tenant, unión híbrida, SSO y sincronización de directorio (Entra Connect).' },
      { name: 'Políticas de Acceso Condicional', desc: 'MFA obligatorio, cumplimiento de dispositivos, restricciones por ubicación y riesgo.' },
      { name: 'Gestión de dispositivos Intune', desc: 'Enrolamiento MDM/MAM, políticas de cumplimiento, despliegue de apps y Autopilot.' },
      { name: 'Gobernanza de identidades', desc: 'Revisiones de acceso, PIM (Privileged Identity Management) y gestión de derechos.' },
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <span className="label">Catálogo de servicios</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-noc-white mt-3 mb-4">
            Servicios IT empresariales
          </h1>
          <p className="text-zinc-500 max-w-xl">
            Servicios profesionales de infraestructura IT: redes, videovigilancia, nube y gestión de identidades.
          </p>
        </div>

        <div className="space-y-16">
          {CATEGORIES.map(({ id, label, color, border, services }) => (
            <div key={id}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className={`text-xl font-bold ${color}`}>{label}</h2>
                <div className="flex-1 h-px bg-surface-border" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(({ name, desc }) => (
                  <div key={name} className={`noc-card ${border}`}>
                    <h3 className="text-noc-white font-medium mb-2">{name}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 noc-card border-amber/30 text-center p-10 max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-noc-white mb-3">¿Necesitas una solución a medida?</h3>
          <p className="text-zinc-500 mb-6 text-sm">
            Evaluamos tu infraestructura actual y diseñamos un paquete de servicios personalizado.
          </p>
          <Link href="/assessments" className="btn-amber">
            Solicitar diagnóstico →
          </Link>
        </div>
      </div>
    </div>
  )
}
