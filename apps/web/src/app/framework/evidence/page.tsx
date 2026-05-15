import type { Metadata } from 'next'
import Link from 'next/link'
import { VlanDiagram, EntraIdGovernanceFlow, IntuneDiagram, HybridInfraMap } from '@/components/ArchDiagrams'
import { DiagramTracker, EvidenceRequestLink } from '@/components/EvidenceInteraction'

export const metadata: Metadata = {
  title: 'Evidencia Operacional | Fragmentos de Arquitectura y Documentación — Velkor System',
  description:
    'Repositorio de evidencia técnica: fragmentos de política de Acceso Condicional, planes de implementación, estructuras de gobierno, checklists de Intune y arquitecturas de referencia.',
  alternates: { canonical: 'https://velkor.mx/framework/evidence' },
}

// ─── Document types ───────────────────────────────────────────────────────────

type DocType = 'policy' | 'diagram' | 'checklist' | 'template' | 'excerpt' | 'workflow'

const TYPE_META: Record<DocType, { label: string; color: string }> = {
  policy:    { label: 'POLÍTICA',    color: '#4878b0' },
  diagram:   { label: 'DIAGRAMA',   color: '#3d88a5' },
  checklist: { label: 'CHECKLIST',  color: '#3a7858' },
  template:  { label: 'TEMPLATE',   color: '#b07828' },
  excerpt:   { label: 'FRAGMENTO',  color: '#6060a0' },
  workflow:  { label: 'FLUJO',      color: '#3d88a5' },
}

// ─── Evidence items ────────────────────────────────────────────────────────────

type EvidenceItem = {
  id:       string
  type:     DocType
  category: string
  title:    string
  summary:  string
  elements: string[]       // key elements this document includes
  status:   'sanitized' | 'reference' | 'template'
}

const EVIDENCE: EvidenceItem[] = [

  // ── Identity & Governance ──────────────────────────────────────────────────
  {
    id:       'ca-baseline',
    type:     'policy',
    category: 'Identidad & Acceso',
    title:    'Baseline de Acceso Condicional · Entra ID P1',
    summary:  'Conjunto mínimo de 6 políticas de CA recomendadas para cualquier organización con M365. Bloqueo de acceso legacy, MFA obligatorio y restricción de dispositivos no gestionados.',
    elements: [
      'CA001 — Bloquear autenticación legacy (Exchange, SMTP, POP3)',
      'CA002 — Requerir MFA para todos los usuarios (excepto emergency access)',
      'CA003 — Requerir MFA para administradores en todas las apps',
      'CA004 — Bloquear acceso a países fuera de México/LATAM',
      'CA005 — Requerir dispositivo conforme (Intune) para acceso a datos clínicos/financieros',
      'CA006 — Sesión limitada (8h) en dispositivos no registrados',
    ],
    status: 'sanitized',
  },
  {
    id:       'ca-advanced',
    type:     'policy',
    category: 'Identidad & Acceso',
    title:    'Políticas de Acceso Condicional · Riesgo adaptativo (P2)',
    summary:  'Extensión del baseline usando Identity Protection: bloqueo automático ante sign-in de riesgo alto, MFA step-up ante riesgo medio, y revisión de acceso periódica.',
    elements: [
      'CA007 — Bloquear sign-in con risk level: HIGH (Identity Protection)',
      'CA008 — Requerir cambio de contraseña si user risk: HIGH',
      'CA009 — MFA step-up si sign-in risk: MEDIUM',
      'CA010 — Named Locations: IPs corporativas en lista permitida',
      'Modo "Report-only" durante 14 días antes de aplicar en producción',
      'Break-glass account excluida de todas las políticas con alerta de uso',
    ],
    status: 'sanitized',
  },
  {
    id:       'pim-governance',
    type:     'workflow',
    category: 'Identidad & Acceso',
    title:    'Modelo de Gobierno PIM — Acceso Privilegiado Just-in-Time',
    summary:  'Estructura de acceso administrativo sin privilegios permanentes. Activación con aprobación, límite de tiempo, y log de auditoría completo en Entra ID.',
    elements: [
      'Roles elegibles vs activos: solo Global Admin y Exchange Admin como elegibles',
      'Duración máxima de activación: 4 horas (configurable por rol)',
      'Aprobación requerida: segundo administrador vía notificación',
      'Justificación obligatoria en formulario de activación',
      'Alerta de activación a equipo de seguridad por correo',
      'Revisión de acceso trimestral para todos los roles privilegiados',
    ],
    status: 'template',
  },

  // ── Infrastructure & Network ───────────────────────────────────────────────
  {
    id:       'vlan-architecture',
    type:     'diagram',
    category: 'Infraestructura de red',
    title:    'Arquitectura de Segmentación VLAN · Entorno Corporativo Típico',
    summary:  'Modelo de segmentación VLAN para empresa de 50–500 empleados con sede central y sucursales. Separación de segmentos por función de negocio y nivel de riesgo.',
    elements: [
      'VLAN 10 — Corporativo (workstations, laptops)',
      'VLAN 20 — Servidores (AD, File, ERP)',
      'VLAN 30 — Gestión (switches, APs, cámaras)',
      'VLAN 40 — Impresoras (aisladas por protocolo)',
      'VLAN 50 — IoT (sin acceso a otras VLANs)',
      'VLAN 99 — Invitados (Internet-only, aislada)',
      'Inter-VLAN routing controlado por FortiGate con ACLs explícitas',
    ],
    status: 'reference',
  },
  {
    id:       'fortinet-baseline',
    type:     'checklist',
    category: 'Infraestructura de red',
    title:    'Hardening Baseline FortiGate · Post-implementación',
    summary:  'Lista de verificación de 28 controles aplicada al cierre de cada proyecto de firewall. Validación de configuración, políticas de acceso y gestión de contraseñas.',
    elements: [
      'Contraseña admin por defecto cambiada · cuenta "admin" renombrada',
      'Acceso HTTPS management solo desde VLAN 30 (Mgmt)',
      'SSH desactivado en interfaz externa',
      'IPS profile: "protect" en interfaces externas, "monitor" en LAN',
      'FortiGuard subscriptions activas y actualizadas',
      'SNMP v3 configurado para monitoreo (SNMPv1/v2 desactivado)',
      'Política "implicit deny" verificada como regla final',
      'Backup de configuración automatizado a FortiManager',
    ],
    status: 'sanitized',
  },

  // ── Intune & Device Management ─────────────────────────────────────────────
  {
    id:       'intune-onboarding',
    type:     'workflow',
    category: 'Gestión de dispositivos',
    title:    'Flujo de Onboarding Intune · Autopilot + Acceso Condicional',
    summary:  'Proceso completo de incorporación de nuevo empleado: desde unboxing del equipo hasta acceso a recursos corporativos con dispositivo conforme, en menos de 1 hora.',
    elements: [
      'Paso 1 — Dispositivo registrado en Autopilot (hash pre-importado por proveedor)',
      'Paso 2 — Equipo enciende, detecta configuración de empresa automáticamente',
      'Paso 3 — Usuario se autentica con credenciales Entra ID',
      'Paso 4 — Autopilot aplica: idioma, zona horaria, join a Entra ID, inscripción Intune',
      'Paso 5 — Intune despliega apps esenciales (M365, Teams, VPN, AV) en background',
      'Paso 6 — Acceso Condicional evalúa cumplimiento → acceso a M365 habilitado',
      'Tiempo total de espera activa del usuario: < 20 minutos',
    ],
    status: 'template',
  },
  {
    id:       'intune-compliance',
    type:     'checklist',
    category: 'Gestión de dispositivos',
    title:    'Política de Cumplimiento Intune · Windows 11 Empresarial',
    summary:  'Perfil de cumplimiento aplicado a todos los dispositivos Windows gestionados. Define los requisitos mínimos para que un equipo sea considerado conforme por Acceso Condicional.',
    elements: [
      'Versión mínima de Windows: 22H2 (Build 22621)',
      'BitLocker habilitado y encriptación verificada',
      'Windows Defender Antivirus activo y definiciones actualizadas (< 3 días)',
      'Firewall Windows habilitado en todos los perfiles de red',
      'Sin apps en la lista de bloqueo (TikTok, apps de gaming, etc.)',
      'Contraseña de inicio de sesión: mínimo 12 caracteres, complejidad activada',
      'Gracia ante incumplimiento: 3 días antes de bloqueo de acceso',
    ],
    status: 'sanitized',
  },

  // ── Implementation Planning ────────────────────────────────────────────────
  {
    id:       'mfa-rollout',
    type:     'template',
    category: 'Planes de implementación',
    title:    'Plan de Adopción MFA · Organización 50–200 usuarios',
    summary:  'Cronograma de implementación de MFA sin impacto en productividad. Fase de comunicación, piloto con grupo reducido, y despliegue progresivo con soporte de primer nivel.',
    elements: [
      'Semana 1 — Comunicación a usuarios: qué cambia y por qué (correo + sesión 15 min)',
      'Semana 2 — Piloto: 10% usuarios (área IT + dirección)',
      'Semana 3 — Expansión: 50% usuarios por departamento',
      'Semana 4 — Cobertura completa · CA002 en modo "enforce"',
      'Semana 5 — Métricas: % registro, reportes de problemas, tickets helpdesk',
      'Canales de soporte: Teams channel + número de helpdesk durante roll-out',
      'Material incluido: guía de instalación Authenticator (ES/EN) + FAQ imprimible',
    ],
    status: 'template',
  },
  {
    id:       'identity-migration',
    type:     'template',
    category: 'Planes de implementación',
    title:    'Migración de AD On-Premises a Entra ID Híbrido · Plan de 8 Semanas',
    summary:  'Plan para organizaciones con Active Directory on-premises que migran a modelo híbrido con Entra Connect Sync, sin disrupciones en autenticación ni pérdida de políticas GPO.',
    elements: [
      'Sem 1 — Auditoría de AD: usuarios, grupos, GPOs, service accounts',
      'Sem 2 — Instalación y configuración Entra Connect Sync (staging mode)',
      'Sem 3 — Validación de sincronización en staging · revisión de conflictos',
      'Sem 4 — Cutover a producción · monitoreo de sincronización 48h',
      'Sem 5 — Entra ID join para dispositivos nuevos · Hybrid Join para existentes',
      'Sem 6 — Acceso Condicional baseline · MFA enrollment',
      'Sem 7–8 — Limpieza: cuentas huérfanas, service accounts, GPOs redundantes',
    ],
    status: 'template',
  },

  // ── Audit & Governance ─────────────────────────────────────────────────────
  {
    id:       'security-audit',
    type:     'excerpt',
    category: 'Auditoría y gobernanza',
    title:    'Extracto de Auditoría de Seguridad · Hallazgos Tipo para SMB',
    summary:  'Fragmento sanitizado de informe de auditoría de seguridad. Representa los hallazgos más frecuentes en organizaciones de 50–200 empleados evaluadas entre 2023 y 2025.',
    elements: [
      'CRÍTICO — 100% de usuarios sin MFA en tenant M365 activo',
      'CRÍTICO — Cuentas administrativas con acceso permanente (no PIM)',
      'ALTO — 12 dispositivos con Windows 10 1909 (sin soporte desde 2022)',
      'ALTO — Firewall perimetral con reglas "any/any" en 60% del ruleset',
      'MEDIO — Sin política de retención de logs de AD (eventos críticos sobrescritos en 7 días)',
      'MEDIO — Backup de datos críticos solo local, sin prueba de restauración documentada',
      'INFORMATIVO — 8 service accounts con contraseñas sin fecha de expiración',
    ],
    status: 'sanitized',
  },
  {
    id:       'governance-structure',
    type:     'excerpt',
    category: 'Auditoría y gobernanza',
    title:    'Estructura de Gobierno IT · Responsabilidades y Escalación',
    summary:  'Modelo de responsabilidades IT para organizaciones que formalizan su función tecnológica por primera vez. Define roles, matriz de escalación y cadencia de revisión.',
    elements: [
      'IT Owner: responsable de decisiones de inversión y política',
      'IT Admin: operación diaria, gestión de incidentes, provisioning',
      'Security Champion: revisión periódica de accesos y cumplimiento',
      'Change Advisory: revisión de cambios mayores (mínimo 2 personas)',
      'Cadencia de revisión: accesos privilegiados mensual · usuarios trimestrales',
      'Escalación: incidente crítico → IT Owner en < 1h · regulatorio → Dirección General',
    ],
    status: 'template',
  },
]

// ─── Group by category ────────────────────────────────────────────────────────

const CATEGORIES = [...new Set(EVIDENCE.map(e => e.category))]

// ─── Components ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EvidenceItem['status'] }) {
  const map = {
    sanitized: { label: 'Sanitizado',     color: '#3a7858' },
    reference: { label: 'Referencia',     color: '#4878b0' },
    template:  { label: 'Plantilla',      color: '#b07828' },
  }
  const { label, color } = map[status]
  return (
    <span
      className="text-[8.5px] font-mono font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded"
      style={{ color, background: color + '18', border: `1px solid ${color}28` }}
    >
      {label}
    </span>
  )
}

function EvidenceCard({ item }: { item: EvidenceItem }) {
  const { label: typeLabel, color: typeColor } = TYPE_META[item.type]

  return (
    <div
      className="card p-0 overflow-hidden hover:border-zinc-700 transition-colors"
      style={{ borderLeftColor: typeColor + '40', borderLeftWidth: 2 }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[8.5px] font-mono font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded"
              style={{ color: typeColor, background: typeColor + '15', border: `1px solid ${typeColor}25` }}
            >
              {typeLabel}
            </span>
            <StatusBadge status={item.status} />
          </div>
        </div>
        <h3 className="text-zinc-200 text-[13px] font-semibold leading-snug mb-2">{item.title}</h3>
        <p className="text-zinc-500 text-[11px] leading-relaxed">{item.summary}</p>
      </div>

      {/* Elements list */}
      <div className="px-5 py-4">
        <div
          className="text-[8.5px] font-mono font-bold uppercase tracking-[0.16em] mb-3"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          Contenido incluido
        </div>
        <div className="evidence-elements-mobile space-y-1.5" data-hidden-count="Más controles disponibles en versión completa">
          {item.elements.map((el, i) => (
            <div key={i} className="evidence-element flex items-start gap-2">
              <span className="text-[9px] font-mono text-zinc-700 flex-shrink-0 mt-0.5">→</span>
              <span className="text-[10px] font-mono text-zinc-500 leading-snug">{el}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-2.5 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="text-[9px] font-mono text-zinc-700">
          {item.status === 'sanitized' ? 'Datos de proyecto anonimizados' :
           item.status === 'template'  ? 'Disponible bajo NDA' :
                                         'Arquitectura de referencia'}
        </span>
        <EvidenceRequestLink
          href="/contacto"
          title={item.title}
          category={item.category}
          status={item.status}
        >
          Solicitar versión completa →
        </EvidenceRequestLink>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EvidencePage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <Link
          href="/framework"
          className="inline-flex items-center gap-2 text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors mb-10"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M3.828 7H14a1 1 0 110 2H3.828l2.829 2.828a1 1 0 11-1.414 1.414L1 9l-.707-.707L1 7.586 5.243 3.343A1 1 0 016.657 4.757L3.828 7z" />
          </svg>
          Metodología
        </Link>

        {/* Header */}
        <div className="mb-14">
          <span className="label">Repositorio de evidencia técnica</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight tracking-heading">
            Documentación operacional<br />
            <span className="text-zinc-500">de referencia</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-sm leading-relaxed">
            Fragmentos sanitizados de políticas, flujos, checklists y arquitecturas derivadas de proyectos reales.
            Documentación de ingeniería — no marketing. Disponible bajo NDA cuando se requiere el documento completo.
          </p>

          {/* Meta strip */}
          <div
            className="flex flex-wrap items-center gap-5 mt-6 pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.055)' }}
          >
            {[
              { k: 'Documentos',   v: String(EVIDENCE.length) },
              { k: 'Categorías',   v: String(CATEGORIES.length) },
              { k: 'Formato',      v: 'Sanitizado · Anónimo' },
              { k: 'Acceso full',  v: 'Bajo NDA' },
            ].map(({ k, v }) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">{k}</span>
                <span className="text-[11px] font-mono text-zinc-400">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence by category */}
        {CATEGORIES.map(cat => {
          const items = EVIDENCE.filter(e => e.category === cat)
          return (
            <div key={cat} className="mb-14">
              <div
                className="flex items-center gap-3 mb-6"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px' }}
              >
                <span className="text-zinc-300 font-semibold text-sm">{cat}</span>
                <span className="text-zinc-700 text-[10px] font-mono">{items.length} documentos</span>
              </div>
              <div className="evidence-grid grid sm:grid-cols-2 gap-4">
                {items.map(item => (
                  <EvidenceCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )
        })}

        {/* Architecture diagrams section */}
        <div className="mb-14">
          <div
            className="flex items-center gap-3 mb-6"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px' }}
          >
            <span className="text-zinc-300 font-semibold text-sm">Diagramas de arquitectura</span>
            <span className="text-zinc-700 text-[10px] font-mono">4 diagramas operacionales</span>
          </div>

          <div className="space-y-8">
            {/* VLAN */}
            <div className="card p-0 overflow-hidden">
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded" style={{ color: '#3d88a5', background: 'rgba(61,136,165,0.1)', border: '1px solid rgba(61,136,165,0.2)' }}>DIAGRAMA</span>
                  <span className="text-zinc-300 text-[12px] font-semibold">Segmentación VLAN · Sede corporativa con sucursales</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-700">Referencia</span>
              </div>
              <div className="p-5" style={{ background: '#06080f' }}>
                <DiagramTracker diagramId="vlan-architecture" context="evidence-library" />
                <p className="diagram-scroll-hint text-[9px] font-mono text-zinc-700 mb-2 items-center gap-1">
                  <span>←</span><span>Desplaza para ver el diagrama</span><span>→</span>
                </p>
                <div className="arch-diagram-wrapper">
                  <VlanDiagram />
                </div>
              </div>
              <div className="px-5 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] font-mono text-zinc-700">FortiGate NGFW · 6 VLANs funcionales · ACL inter-VLAN explícita · deny implícito como regla final</p>
              </div>
            </div>

            {/* Entra ID */}
            <div className="card p-0 overflow-hidden">
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded" style={{ color: '#3d88a5', background: 'rgba(61,136,165,0.1)', border: '1px solid rgba(61,136,165,0.2)' }}>DIAGRAMA</span>
                  <span className="text-zinc-300 text-[12px] font-semibold">Flujo de Gobierno de Identidad · Entra ID + Acceso Condicional</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-700">Referencia</span>
              </div>
              <div className="p-5" style={{ background: '#06080f' }}>
                <DiagramTracker diagramId="entra-id-governance-flow" context="evidence-library" />
                <div className="arch-diagram-wrapper">
                  <EntraIdGovernanceFlow />
                </div>
              </div>
              <div className="px-5 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] font-mono text-zinc-700">Entra ID P2 · Identity Protection · Acceso Condicional · PIM · Decisión: Grant / Deny por condición</p>
              </div>
            </div>

            {/* Intune lifecycle */}
            <div className="card p-0 overflow-hidden">
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded" style={{ color: '#3d88a5', background: 'rgba(61,136,165,0.1)', border: '1px solid rgba(61,136,165,0.2)' }}>DIAGRAMA</span>
                  <span className="text-zinc-300 text-[12px] font-semibold">Ciclo de Vida de Dispositivo · Intune MDM / Autopilot</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-700">Referencia</span>
              </div>
              <div className="p-5" style={{ background: '#06080f' }}>
                <DiagramTracker diagramId="intune-lifecycle" context="evidence-library" />
                <div className="arch-diagram-wrapper">
                  <IntuneDiagram />
                </div>
              </div>
              <div className="px-5 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] font-mono text-zinc-700">Windows Autopilot · Enrollment · Compliance check · Provisioning de apps · Retire / Wipe en offboarding</p>
              </div>
            </div>

            {/* Hybrid infra */}
            <div className="card p-0 overflow-hidden">
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.046)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded" style={{ color: '#3d88a5', background: 'rgba(61,136,165,0.1)', border: '1px solid rgba(61,136,165,0.2)' }}>DIAGRAMA</span>
                  <span className="text-zinc-300 text-[12px] font-semibold">Infraestructura Híbrida · Cloud + On-Premises</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-700">Referencia</span>
              </div>
              <div className="p-5" style={{ background: '#06080f' }}>
                <DiagramTracker diagramId="hybrid-infra-map" context="evidence-library" />
                <div className="arch-diagram-wrapper">
                  <HybridInfraMap />
                </div>
              </div>
              <div className="px-5 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] font-mono text-zinc-700">AD on-premises + Entra Connect Sync · Entra ID / Intune / Defender en Azure · FortiGate perimetral en sede</p>
              </div>
            </div>
          </div>
        </div>

        {/* NDA note */}
        <div
          className="card p-8 text-center mb-8"
          style={{ borderColor: 'rgba(72,120,176,0.12)' }}
        >
          <div className="text-[9.5px] font-mono text-zinc-700 uppercase tracking-widest mb-3">Acceso a documentación completa</div>
          <h2 className="text-xl font-black text-noc-white mb-3">
            Políticas, runbooks y arquitecturas sin sanitizar
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            Las versiones completas incluyen configuraciones específicas, rangos IP, nombres de tenant, evidencia fotográfica y actas de validación. Disponibles bajo NDA para proyectos activos.
          </p>
          <Link href="/contacto" className="btn-amber px-8 py-3">
            Solicitar acceso bajo NDA →
          </Link>
        </div>

        {/* Evidence links */}
        <div className="flex flex-wrap items-center gap-4 justify-center text-[10px] font-mono text-zinc-700">
          <Link href="/framework" className="hover:text-zinc-500 transition-colors">← Metodología</Link>
          <span>·</span>
          <Link href="/casos" className="hover:text-zinc-500 transition-colors">Casos de ingeniería</Link>
          <span>·</span>
          <Link href="/assessments" className="hover:text-zinc-500 transition-colors">Evaluación operacional</Link>
        </div>

      </div>
    </div>
  )
}
