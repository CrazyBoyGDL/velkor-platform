import type { Metadata } from 'next'
import { strapi } from '@/lib/strapi'
import CasosContent, { type CaseStudy } from '@/components/CasosContent'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Transformaciones Operacionales | Narrativas de Ingeniería — Velkor System',
  description:
    'Proyectos IT documentados como narrativas de ingeniería: contexto operacional, decisiones de arquitectura, restricciones reales, cronograma de implementación y resultados verificados.',
  alternates: { canonical: 'https://velkor.mx/casos' },
  openGraph: {
    title: 'Transformaciones Operacionales | Velkor',
    description: 'Narrativas de ingeniería con decisiones de arquitectura, restricciones reales y resultados operacionales verificados.',
  },
}

// ── Strapi response type (v4) ─────────────────────────────────────────────────
type StrapiCase = {
  id: number
  attributes: {
    client: string
    sector: string
    year: string
    context?: string
    durationWeeks?: number
    challenge: string
    beforeState?: string[] | null
    solution: string
    phases?: { label: string; weeks: string }[] | null
    result: string
    resultSub: string
    hex: string
    tags: string[] | null
    publishedAt: string
  }
}

// ── Fallback data — full engineering narratives ───────────────────────────────
const FALLBACK_CASES: CaseStudy[] = [
  // ── Case 1: Network segmentation ──────────────────────────────────────────
  {
    client:       'Empresa distribuidora · Monterrey, NL',
    sector:       'Manufactura y distribución',
    year:         '2024',
    durationWeeks: 6,

    envSize:      '200 empleados · 3 sedes regionales',
    envEndpoints: '85 endpoints Windows · 12 servidores · ~40 dispositivos IoT/impresoras',
    envPlatform:  'On-premises · ERP legacy (SQL Server) · Firewall ISP + switch no gestionado',

    challenge: 'Tres incidentes de seguridad en seis meses en una red plana donde un endpoint comprometido podía alcanzar directamente los servidores de producción y el ERP financiero.',

    initialState: [
      'Red plana — todos los segmentos en la misma subred /20',
      '47 reglas "permit any any" en firewall heredado de ISP',
      'ERP financiero accesible desde la VLAN de invitados WiFi',
      'Endpoints de planta con acceso directo a servidor de AD',
      'Cero visibilidad de tráfico lateral — sin logs de red',
    ],

    constraints: [
      'Ventana de mantenimiento máxima: 2h por sede (turnos 24/7)',
      'ERP legacy en Windows Server 2012 sin soporte de dominio moderno',
      'Sucursales conectadas por MPLS de contrato vigente',
      'Equipo IT interno: 1 administrador sin experiencia en Fortinet',
    ],

    architectureDecisions: [
      {
        decision:  'FortiGate 100F central + FG-60F en cada sucursal',
        rationale: 'Consola unificada FortiManager · visibilidad norte-sur y este-oeste desde un punto',
      },
      {
        decision:  '8 VLANs funcionales (Corp, Servers, ERP, Mgmt, Print, IoT, Guest, Branch)',
        rationale: 'ERP aislado en VLAN 25 con ACL explícitas · invitados en VLAN 99 sin acceso interno',
      },
      {
        decision:  'SD-WAN overlay sobre MPLS + failover ISP secundario',
        rationale: 'Elimina dependencia de MPLS único · ha de implementarse sin cambiar el contrato vigente',
      },
      {
        decision:  'IPS profile restrictivo solo en tráfico norte-sur + Application Control',
        rationale: 'Mantiene latencia baja en LAN · máxima inspección en perímetro y entre segmentos críticos',
      },
    ],

    phases: [
      { label: 'Auditoría de topología · diseño VLAN y política', weeks: 'Sem 1',   milestone: 'HLD aprobado' },
      { label: 'Instalación FortiGate · migración sede central',   weeks: 'Sem 2–3', milestone: 'VLAN Corp + Servers activas' },
      { label: 'Sucursales · site-to-site IPsec · IPS/IDS',       weeks: 'Sem 4–5', milestone: 'ERP aislado en VLAN 25' },
      { label: 'Hardening reglas · documentación · handoff',       weeks: 'Sem 6',   milestone: 'Runbook entregado' },
    ],

    deliverables: [
      'Diagrama topológico L2/L3 por sede (Visio)',
      'Política de firewall documentada (254 reglas → 38 explícitas)',
      'Runbook operacional FortiGate',
      'Procedimiento de respuesta ante incidente de red',
      'Baseline de configuración para replicación en nuevas sedes',
    ],

    outcomes: [
      { metric: '0 incidentes de seguridad',     detail: '14 meses consecutivos tras implementación' },
      { metric: 'Visibilidad completa',           detail: '100% endpoints identificados y mapeados en topología' },
      { metric: 'Reducción de reglas: −91%',      detail: '254 reglas "any/any" colapsadas a 38 reglas explícitas' },
      { metric: 'ERP aislado en VLAN dedicada',   detail: 'Acceso restringido a 8 usuarios nominados con log de auditoría' },
      { metric: 'MTTR ante incidente: < 2h',      detail: 'Antes: sin visibilidad · tiempo de detección indefinido' },
    ],

    hex:  '#4878b0',
    tags: ['FortiGate 100F', 'VLAN', 'SD-WAN', 'IPS/IDS', 'FortiManager', 'Zero Trust', 'Segmentación'],
  },

  // ── Case 2: Identity governance ────────────────────────────────────────────
  {
    client:       'Corporativo médico · Ciudad de México',
    sector:       'Salud · Expedientes digitales',
    year:         '2025',
    durationWeeks: 6,

    envSize:      '62 usuarios · 1 sede principal + 2 consultorios',
    envEndpoints: '58 equipos Windows · 4 Mac · 24 dispositivos iOS (médicos)',
    envPlatform:  'Microsoft 365 Business Premium (parcialmente configurado) · HIS on-premises',

    challenge: '62 usuarios con acceso irrestricto a expedientes de pacientes usando únicamente usuario y contraseña — sin MFA, sin gestión de dispositivos, y con cuentas administrativas compartidas entre tres médicos.',

    initialState: [
      'Cero MFA — credencial única para acceso a M365 y HIS',
      'Cuentas admin compartidas (3 médicos · misma contraseña)',
      'Sin MDM — 82 dispositivos sin inventario ni política',
      'Expedientes accesibles desde cualquier dispositivo sin control',
      'Fuera de NOM-024 — sin clasificación de datos sensibles',
    ],

    constraints: [
      'Plazo regulatorio NOM-024: 90 días desde inicio de proyecto',
      'Médicos con alta resistencia al cambio en flujos de autenticación',
      'HIS legacy no integrable con Entra ID (autenticación local propia)',
      'Dispositivos iOS personales usados para acceder a Teams/correo',
    ],

    architectureDecisions: [
      {
        decision:  'Entra ID P2 + Conditional Access por riesgo y cumplimiento',
        rationale: 'MFA obligatorio pero sin fricción en dispositivos gestionados ya inscritos en Intune',
      },
      {
        decision:  'Intune MAM para iOS sin MDM completo en dispositivos personales',
        rationale: 'Protege datos corporativos en apps M365 sin requerir gestión del dispositivo personal',
      },
      {
        decision:  'PIM just-in-time para las 3 cuentas admin existentes',
        rationale: 'Eliminación de acceso permanente · log de activación con aprobación · sin fricción en operación diaria',
      },
      {
        decision:  'Microsoft Purview DLP para datos de pacientes',
        rationale: 'Prevenir exfiltración de datos NOM-024 por correo, Teams, USB o share externo',
      },
    ],

    phases: [
      { label: 'Entra ID P2 · CA · MFA enrollment',         weeks: 'Sem 1–2', milestone: '100% usuarios con MFA' },
      { label: 'Intune MDM Windows · Autopilot · MAM iOS',  weeks: 'Sem 3',   milestone: '82 dispositivos inscritos' },
      { label: 'Purview DLP · clasificación NOM-024 · PIM', weeks: 'Sem 4–5', milestone: 'Políticas DLP activas' },
      { label: 'Auditoría · testing · documentación',       weeks: 'Sem 6',   milestone: 'Entrega certificación' },
    ],

    deliverables: [
      'Conjunto de 12 políticas de Acceso Condicional documentadas',
      'Baseline Intune: 6 perfiles de configuración + 4 de cumplimiento',
      'Políticas DLP (correo, Teams, SharePoint, dispositivos)',
      'Playbook de onboarding de nuevo usuario: de 4 h a 45 min',
      'Checklist de auditoría NOM-024 para revisión anual',
    ],

    outcomes: [
      { metric: 'MFA al 100%',                   detail: '62/62 usuarios · migración completada en 48 h · sin incidentes' },
      { metric: 'NOM-024 cumplido',              detail: 'Entregado en semana 6 · 3 semanas antes del plazo regulatorio' },
      { metric: 'Onboarding: 4 h → 45 min',     detail: 'Autopilot + provisioning automático M365 · sin intervención manual' },
      { metric: 'Acceso admin just-in-time',     detail: '3 cuentas admin sin privilegios permanentes · log completo de activación' },
      { metric: '0 eventos de exfiltración',     detail: 'Purview DLP activo · 8 intentos de share externo bloqueados en 30 días' },
    ],

    hex:  '#3a7858',
    tags: ['Entra ID P2', 'Intune MDM', 'MFA', 'Acceso Condicional', 'PIM', 'Purview DLP', 'NOM-024'],
  },

  // ── Case 3: CCTV IP migration ──────────────────────────────────────────────
  {
    client:       'Cadena de retail · Guadalajara, Jalisco',
    sector:       'Retail · Operaciones multi-sucursal',
    year:         '2025',
    durationWeeks: 7,

    envSize:      '8 sucursales · ~60 empleados por turno',
    envEndpoints: '96 puntos de cámara · NVR centralizado en corporativo · cableado estructurado nuevo',
    envPlatform:  'CCTV analógico DVR local · sin conectividad remota · sin analítica',

    challenge: 'Sistema de videovigilancia analógico con DVRs locales en cada sucursal: resolución insuficiente para evidencia legal, sin acceso remoto desde corporativo, y tres incidentes de robo sin respaldo de video utilizable en 12 meses.',

    initialState: [
      'DVR analógico por sucursal · resolución máxima 720×480 (no útil como evidencia)',
      'Cero visibilidad remota — corporativo no puede acceder a grabaciones',
      'Almacenamiento local sobrescrito en 5–7 días sin backup',
      'Sin analítica · detección de incidentes solo por reporte manual',
      'Cableado coaxial legacy en 6/8 sucursales — reutilizable solo parcialmente',
    ],

    constraints: [
      'Operación comercial sin posibilidad de cierre durante instalación',
      'Presupuesto de cableado limitado — reutilizar coaxial donde sea viable',
      'Equipo de operaciones sin formación técnica en sistemas IP',
      'Restricciones municipales en fachada (cámaras domo empotradas únicamente)',
    ],

    architectureDecisions: [
      {
        decision:  'Axis M series 4K PoE en puntos fijos · P series PTZ en accesos',
        rationale: 'Resolución 4K suficiente para evidencia legal · PoE elimina cableado eléctrico adicional',
      },
      {
        decision:  'NVR centralizado en corporativo + NAS edge por sucursal (7 días)',
        rationale: 'Corporativo tiene 30 días de retención · sucursales conservan 7 días locales ante corte de red',
      },
      {
        decision:  'VLAN de videovigilancia separada de LAN corporativa en cada sede',
        rationale: 'Tráfico de video no compite con aplicaciones de negocio · aislamiento ante incidente de red',
      },
      {
        decision:  'Axis Camera Station Enterprise con acceso centralizado',
        rationale: 'Una sola consola para 8 sucursales · gestión de usuarios y retención desde corporativo',
      },
    ],

    phases: [
      { label: 'Diseño topología · plano de cámaras · certificación cableado', weeks: 'Sem 1',   milestone: 'Plano aprobado x8 sucursales' },
      { label: 'Instalación sucursales 1–4 · cableado estructurado Cat6A',     weeks: 'Sem 2–3', milestone: '48 cámaras en producción' },
      { label: 'Instalación sucursales 5–8 · configuración Axis CS Edge',      weeks: 'Sem 4–5', milestone: '96 cámaras en producción' },
      { label: 'NVR centralizado · VLAN config · analítica',                   weeks: 'Sem 6',   milestone: 'Retención 30 días activa' },
      { label: 'Capacitación operadores · entrega · SLA activo',               weeks: 'Sem 7',   milestone: 'Handoff completado' },
    ],

    deliverables: [
      'Plano de instalación por sucursal (AutoCAD + PDF)',
      'Certificados de cableado estructurado (Fluke)',
      'Export de configuración Axis Camera Station',
      'Manual de operación para equipo de seguridad',
      'Runbook: procedimiento de extracción de evidencia para trámites legales',
    ],

    outcomes: [
      { metric: '−34% incidentes de robo',       detail: 'Q1 posterior · visible en comparativa mensual de merma' },
      { metric: 'Visibilidad en tiempo real',    detail: '96 cámaras accesibles desde corporativo · latencia < 2 s' },
      { metric: 'Retención 30 días verificada',  detail: '96 canales a 4K/15fps · almacenamiento calculado con margen del 20%' },
      { metric: 'Evidencia de calidad legal',    detail: '4K a 30fps en accesos · reconocimiento facial validado con departamento jurídico' },
      { metric: '3 eventos resueltos con video', detail: '2 recuperaciones de mercancía · 1 investigación de fraude interno' },
    ],

    hex:  '#3d88a5',
    tags: ['Axis 4K', 'NVR centralizado', 'PoE+', 'Axis Camera Station', 'VLAN vigilancia', 'Cat6A'],
  },
]

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getCasos(): Promise<CaseStudy[]> {
  const data = await strapi.get<{ data: StrapiCase[] }>(
    '/casos?sort=publishedAt:desc&pagination[limit]=20&publicationState=live',
    3600
  )

  if (!data?.data?.length) return FALLBACK_CASES

  // Map Strapi v4 → CaseStudy (new fields will be undefined until schema is extended)
  return data.data.map(({ attributes: a }) => ({
    client:        a.client    ?? '',
    sector:        a.sector    ?? '',
    year:          a.year      ?? '',
    durationWeeks: a.durationWeeks ?? 0,
    envSize:      a.context   ?? '',
    envEndpoints: '',
    envPlatform:  '',
    challenge:     a.challenge ?? '',
    initialState:  Array.isArray(a.beforeState) ? a.beforeState : [],
    constraints:   [],
    architectureDecisions: [],
    phases:        Array.isArray(a.phases) ? a.phases : [],
    deliverables:  [],
    outcomes:      a.result ? [{ metric: a.result, detail: a.resultSub ?? '' }] : [],
    hex:           a.hex || '#4878b0',
    tags:          Array.isArray(a.tags) ? a.tags : [],
    // Legacy
    solution:  a.solution,
    result:    a.result,
    resultSub: a.resultSub,
  }))
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function CasosPage() {
  const cases = await getCasos()

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <span className="label">Narrativas de ingeniería</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight tracking-heading">
            Transformaciones operacionales<br />
            <span className="text-zinc-500">documentadas</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-sm leading-relaxed">
            Cada proyecto documentado con su contexto operacional, restricciones reales, decisiones de arquitectura, cronograma semanal y resultados verificados. Datos anonimizados.
          </p>
        </div>

        <CasosContent cases={cases} />
      </div>
    </div>
  )
}
