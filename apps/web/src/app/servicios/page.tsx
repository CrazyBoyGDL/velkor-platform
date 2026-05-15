import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import AdaptiveCTA from '@/components/AdaptiveCTA'
import InlineDiagnostics from '@/components/InlineDiagnostics'
import {
  ArchitectureSnapshot,
  DeploymentDiff,
  InfrastructureStatePanel,
  PolicyOverlay,
  type ArchitectureLink,
  type ArchitectureNode,
} from '@/components/OperationalEvidence'

export const metadata: Metadata = {
  title: 'Servicios IT Empresariales',
  description:
    'Redes y ciberseguridad Fortinet, gestión de identidad Microsoft 365 e Intune, y videovigilancia IP para empresas en México.',
  alternates: { canonical: 'https://velkor.mx/servicios' },
}

type ServiceModule = {
  href: string
  accent: string
  eyebrow: string
  title: string
  summary: string
  layer: string
  objective: string
  outcome: string
  diagnosticId: string
  tags: string[]
  nodes: ArchitectureNode[]
  links: ArchitectureLink[]
  before: string[]
  after: string[]
  policies: string[]
}

const SERVICES: ServiceModule[] = [
  {
    href: '/servicios/ciberseguridad',
    accent: '#587694',
    eyebrow: 'Redes & ciberseguridad',
    title: 'Segmentación, perímetro y acceso remoto gobernable.',
    summary:
      'Contención, reglas heredadas bajo control y trazabilidad antes de ampliar conectividad.',
    layer: 'Network / Perimeter',
    objective: 'Separar usuarios, servidores, invitados, cámaras y gestión sin detener operación.',
    outcome: 'Reglas explícitas, rollback por sede y topología L2/L3 documentada al cierre.',
    diagnosticId: 'segmentation-maturity',
    tags: ['FortiGate', 'VLAN', 'IPsec', 'IPS', 'Runbook'],
    nodes: [
      { id: 'wan', label: 'WAN', x: 48, y: 46, tone: 'neutral' },
      { id: 'ngfw', label: 'NGFW', x: 140, y: 72, tone: 'network' },
      { id: 'core', label: 'CORE', x: 218, y: 96, tone: 'network' },
      { id: 'srv', label: 'SRV', x: 304, y: 54, tone: 'risk' },
      { id: 'users', label: 'USR', x: 302, y: 136, tone: 'identity' },
    ],
    links: [
      { from: 'wan', to: 'ngfw', label: 'ISP' },
      { from: 'ngfw', to: 'core', label: 'ACL' },
      { from: 'core', to: 'srv', label: 'VLAN20' },
      { from: 'core', to: 'users', label: 'VLAN10' },
    ],
    before: ['Red plana /20', 'Reglas any-any', 'VPN compartida'],
    after: ['Zonas funcionales', 'Deny implícito', 'MFA antes de VPN'],
    policies: ['Inventario de puertos antes de mover VLANs', 'Ventana por sede con reversa documentada', 'Excepciones con dueño y fecha de retiro'],
  },
  {
    href: '/servicios/identidad-acceso',
    accent: '#3f775c',
    eyebrow: 'Identidad & acceso',
    title: 'Acceso condicional y dispositivos confiables.',
    summary:
      'M365, Entra ID e Intune como plano de control para identidad, dispositivo y privilegio.',
    layer: 'Identity / Endpoint',
    objective: 'Bloquear accesos sin contexto y retirar privilegios permanentes sin romper el trabajo diario.',
    outcome: 'MFA, Conditional Access, cumplimiento Intune y PIM con evidencia de auditoría.',
    diagnosticId: 'identity-risk-scan',
    tags: ['Entra ID', 'Intune', 'CA', 'PIM', 'FIDO2'],
    nodes: [
      { id: 'user', label: 'USER', x: 52, y: 98, tone: 'identity' },
      { id: 'entra', label: 'ENTRA', x: 142, y: 70, tone: 'identity' },
      { id: 'risk', label: 'RISK', x: 224, y: 52, tone: 'risk' },
      { id: 'mdm', label: 'MDM', x: 222, y: 134, tone: 'identity' },
      { id: 'm365', label: 'M365', x: 308, y: 96, tone: 'network' },
    ],
    links: [
      { from: 'user', to: 'entra', label: 'Auth' },
      { from: 'entra', to: 'risk', label: 'Signal' },
      { from: 'entra', to: 'mdm', label: 'Device' },
      { from: 'entra', to: 'm365', label: 'Grant' },
    ],
    before: ['Admins permanentes', 'MFA parcial', 'Equipos sin postura'],
    after: ['PIM JIT', 'MFA obligatorio', 'Acceso por cumplimiento'],
    policies: ['Report-only antes de bloquear', 'Break-glass excluido con alerta', 'Sesión limitada en equipos no registrados'],
  },
  {
    href: '/servicios/videovigilancia',
    accent: '#638fa9',
    eyebrow: 'Videovigilancia IP',
    title: 'Visibilidad física integrada a la operación.',
    summary:
      'CCTV IP tratado como infraestructura: PoE, VLAN, retención y operación multi-sede.',
    layer: 'Physical Security / Video Network',
    objective: 'Centralizar cámaras, aislar tráfico de video y mantener grabación local aunque falle internet.',
    outcome: 'Mapa de cobertura, NVR dimensionado, VLAN vigilancia y runbook de revisión de incidentes.',
    diagnosticId: 'exposure-estimator',
    tags: ['Axis', 'NVR', 'PoE+', 'ONVIF', 'VLAN CCTV'],
    nodes: [
      { id: 'cam', label: 'CAM', x: 52, y: 60, tone: 'video' },
      { id: 'poe', label: 'POE', x: 134, y: 98, tone: 'video' },
      { id: 'nvr', label: 'NVR', x: 220, y: 74, tone: 'network' },
      { id: 'ops', label: 'OPS', x: 306, y: 96, tone: 'identity' },
      { id: 'edge', label: 'EDGE', x: 140, y: 146, tone: 'neutral' },
    ],
    links: [
      { from: 'cam', to: 'poe', label: 'PoE+' },
      { from: 'poe', to: 'nvr', label: 'VLAN' },
      { from: 'nvr', to: 'ops', label: 'View' },
      { from: 'edge', to: 'nvr', label: 'Remote' },
    ],
    before: ['DVR aislado', 'Sin mapa de cobertura', 'Acceso remoto informal'],
    after: ['NVR centralizado', 'Cobertura documentada', 'Acceso auditable'],
    policies: ['Cámaras fuera de red corporativa', 'Retención definida por área', 'Credenciales y acceso móvil nominados'],
  },
]

function ServiceCapability({ service, index }: { service: ServiceModule; index: number }) {
  const flip = index % 2 === 1

  return (
    <section className="service-capability depth-0" style={{ '--service-accent': service.accent } as CSSProperties}>
      <div className={`service-capability-grid ${flip ? 'service-capability-grid-flip' : ''}`}>
        <div className="service-capability-copy">
          <span className="label">{service.eyebrow}</span>
          <h2 className="section-heading mt-4 mb-5 max-w-2xl">{service.title}</h2>
          <p className="text-zinc-500 text-base leading-relaxed max-w-xl">{service.summary}</p>
          <InfrastructureStatePanel
            layer={service.layer}
            objective={service.objective}
            outcome={service.outcome}
            tags={service.tags}
            accent={service.accent}
          />
          <InlineDiagnostics
            setId={service.diagnosticId}
            location={`service-${service.href.split('/').join('-')}`}
            maxQuestions={3}
            compact
          />
          <Link href={service.href} className="service-capability-link">
            Ver capacidad operacional →
          </Link>
        </div>

        <div className="service-visual-stack">
          <ArchitectureSnapshot
            title={service.eyebrow}
            caption={service.outcome}
            nodes={service.nodes}
            links={service.links}
            accent={service.accent}
          />
          <div className="grid md:grid-cols-[0.86fr_1.14fr] gap-4">
            <DeploymentDiff before={service.before} after={service.after} accent={service.accent} />
            <PolicyOverlay title="Controles de despliegue" policies={service.policies} accent={service.accent} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ServiciosPage() {
  return (
    <div className="min-h-screen py-14 sm:py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="service-index-hero">
          <span className="label">Capacidades operacionales</span>
          <div className="service-index-heading">
            <h1 className="display-heading max-w-4xl">
              Servicios como infraestructura operable, no como catálogo.
            </h1>
            <p className="editorial-lede max-w-xl">
              Objetivo técnico, capa afectada y evidencia de despliegue en una sola lectura.
            </p>
          </div>
        </header>

        <div className="service-module-sequence">
          {SERVICES.map((service, index) => (
            <ServiceCapability key={service.href} service={service} index={index} />
          ))}
        </div>

        <section className="service-consultive-close">
          <div>
            <span className="label block mb-4">No empezar por el producto</span>
            <h2 className="text-noc-white text-2xl sm:text-3xl font-semibold leading-tight max-w-2xl">
              Validar entorno. Luego tocar producción.
            </h2>
          </div>
          <AdaptiveCTA intent="operational-review" location="services-close" compact className="adaptive-cta-service-close" />
        </section>
      </div>
    </div>
  )
}
