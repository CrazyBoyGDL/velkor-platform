'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { reveal as fadeUp } from '@/lib/motion'

const CATEGORIES = [
  {
    id: 'networks',
    label: 'Redes & Conectividad',
    hex: '#3b82f6',
    card: 'card-blue',
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
    hex: '#06b6d4',
    card: 'card-cyan',
    services: [
      { name: 'Diseño de sistema IP', desc: 'Relevamiento técnico, plano de ubicación de cámaras, switching PoE y cableado.' },
      { name: 'Configuración NVR/DVR', desc: 'Almacenamiento, programación de grabación, detección de movimiento y acceso remoto.' },
      { name: 'Video analítica con IA', desc: 'Detección de intrusos, conteo de personas, lectura de patentes y alertas perimetrales.' },
      { name: 'Acceso remoto y app móvil', desc: 'Visualización desde app móvil y web con notificaciones de eventos e informes de actividad.' },
    ],
  },
  {
    id: 'cloud',
    label: 'Microsoft 365 & Cloud',
    hex: '#3b82f6',
    card: 'card-blue',
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
    hex: '#22c55e',
    card: 'card-green',
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

        <motion.div {...fadeUp(0)} className="mb-14">
          <span className="label">Catálogo de servicios</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight">
            Infraestructura IT<br />
            <span className="text-gradient-amber">empresarial</span>
          </h1>
          <p className="text-zinc-500 max-w-xl">
            Servicios profesionales de infraestructura IT: redes, videovigilancia, nube y gestión de identidades.
          </p>
        </motion.div>

        <div className="space-y-16">
          {CATEGORIES.map(({ id, label, hex, card, services }, ci) => (
            <motion.div key={id} {...fadeUp(ci * 0.010)}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 rounded-full" style={{ background: hex }} />
                <h2 className="text-xl font-bold" style={{ color: hex }}>{label}</h2>
                <div className="flex-1 h-px bg-surface-border" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(({ name, desc }, si) => (
                  <motion.div
                    key={name}
                    {...fadeUp(si * 0.010)}
                    className={`${card} p-6 rounded-xl border transition-all duration-300 group`}
                    style={{ borderLeftColor: hex, borderLeftWidth: 3 }}
                  >
                    <h3 className="text-noc-white font-medium mb-2 group-hover:text-white transition-colors">{name}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0)} className="mt-20 card border-amber/30 text-center p-10 max-w-xl mx-auto">
          <h3 className="text-xl font-black text-noc-white mb-3">¿Necesitas una solución a medida?</h3>
          <p className="text-zinc-500 mb-6 text-sm">
            Evaluamos tu infraestructura actual y diseñamos un paquete de servicios personalizado.
          </p>
          <Link href="/assessments" className="btn-amber">
            Solicitar diagnóstico →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
