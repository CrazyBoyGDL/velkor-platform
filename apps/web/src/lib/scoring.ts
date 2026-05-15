// ─── Velkor Operational Risk Scoring Engine ─────────────────────────────────
// Based on CIS Controls v8 and NIST CSF maturity framework.
// Scores are weighted to reflect the risk profile of the Mexican SMB/mid-market.

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type MaturityLevel = 'initial' | 'developing' | 'defined' | 'managed' | 'optimized'
export type ExposureLevel = 'critical' | 'high' | 'medium' | 'managed'

// ─── Assessment answer shapes ────────────────────────────────────────────────

export interface Step1Answers {
  industry:         string   // manufacturing | healthcare | retail | finance | legal | logistics | services | education | other
  companySize:      string   // 1-25 | 26-100 | 101-500 | 500+
  locations:        string   // 1 | 2-5 | 6-20 | 20+
  remoteWorkforce:  string   // none | partial | significant | full
  microsoft365:     string   // full | partial | none
  infrastructure:   string   // cloud | hybrid | on-prem | unformalized
}

export interface Step2Answers {
  vlanSegmentation: string   // yes | partial | no
  firewall:         string   // ngfw | basic | isp-default | none
  vpn:              string   // business | consumer | none
  backup:           string   // cloud-verified | local | none
  wifiSegmentation: string   // yes | partial | no
  endpointInventory:string   // full | partial | none
  edrAv:            string   // edr | av | none
}

export interface Step3Answers {
  entraId:          string   // full | partial | none
  mfa:              string   // all | partial | none
  conditionalAccess:string   // configured | partial | none
  intune:           string   // full | partial | none
  privilegedAccess: string   // pam | individual | shared | none
  onboarding:       string   // automated | manual | none
}

export interface Step4Answers {
  documentation:    string   // current | outdated | none
  monitoring:       string   // siem | basic | none
  ticketing:        string   // formal | informal | none
  lastAudit:        string   // recent | dated | never
  compliance:       string[] // nom-035 | nom-024 | iso27001 | pci-dss | hipaa | none
  changeManagement: string   // formal | informal | none
}

export interface Step5Answers {
  painPoint:        string   // security | compliance | modernization | costs | incidents | visibility | gaps
  urgency:          string   // critical | urgent | planned | evaluating
  complianceNeeds:  string[]
  projectGoals:     string[]
  notes:            string
}

export interface AssessmentAnswers {
  // Contact
  name:    string
  email:   string
  company: string
  phone:   string
  // Steps
  step1: Step1Answers
  step2: Step2Answers
  step3: Step3Answers
  step4: Step4Answers
  step5: Step5Answers
  // Meta
  source?: string
  utm?:    string
}

// ─── Risk flag ───────────────────────────────────────────────────────────────

export interface RiskFlag {
  id:             string
  severity:       Severity
  category:       string
  finding:        string
  recommendation: string
}

// ─── Score result ────────────────────────────────────────────────────────────

export interface ScoreResult {
  infrastructure:   number       // 0–100
  identity:         number       // 0–100
  operations:       number       // 0–100
  overall:          number       // weighted composite
  maturity:         MaturityLevel
  maturityLabel:    string
  maturityDesc:     string
  exposureLevel:    ExposureLevel
  exposureLabel:    string
  flags:            RiskFlag[]
  criticalCount:    number
  highCount:        number
  quickWins:        string[]
  immediatePriorities: string[]
  recommendedPhase: string
  observations:     string[]
}

// ─── Inline consultive diagnostics ───────────────────────────────────────────

export type DiagnosticAnswer = 'yes' | 'partial' | 'no' | 'unknown'
export type DiagnosticDomain = 'network' | 'identity' | 'endpoint' | 'video' | 'operations'
export type DiagnosticCtaIntent =
  | 'operational-review'
  | 'segmentation-validation'
  | 'identity-exposure-review'
  | 'endpoint-governance-check'
  | 'mfa-gap-review'
  | 'remote-access-review'

export interface DiagnosticQuestion {
  id: string
  domain: DiagnosticDomain
  question: string
  context: string
  riskWhen: DiagnosticAnswer
  weight: number
  signal: string
}

export interface DiagnosticSet {
  id: string
  title: string
  description: string
  service: string
  ctaIntent: DiagnosticCtaIntent
  questions: DiagnosticQuestion[]
}

export interface DiagnosticFinding {
  questionId: string
  domain: DiagnosticDomain
  severity: Severity
  finding: string
  recommendation: string
}

export interface DiagnosticResult {
  diagnosticId: string
  score: number
  exposureLevel: ExposureLevel
  exposureLabel: string
  service: string
  ctaIntent: DiagnosticCtaIntent
  answeredCount: number
  totalQuestions: number
  topFinding: string
  recommendation: string
  findings: DiagnosticFinding[]
  leadSignals: string[]
  domainScores: Partial<Record<DiagnosticDomain, number>>
}

// ─── Scoring functions ───────────────────────────────────────────────────────

function scoreInfrastructure(s: Step2Answers): number {
  let score = 0

  // VLAN segmentation (20 pts) — lateral movement prevention
  if (s.vlanSegmentation === 'yes')     score += 20
  else if (s.vlanSegmentation === 'partial') score += 9

  // Firewall quality (20 pts) — perimeter enforcement
  if (s.firewall === 'ngfw')            score += 20
  else if (s.firewall === 'basic')      score += 9
  else if (s.firewall === 'isp-default') score += 3

  // Backup strategy (20 pts) — continuity critical
  if (s.backup === 'cloud-verified')    score += 20
  else if (s.backup === 'local')        score += 7

  // Endpoint inventory (15 pts) — visibility prerequisite
  if (s.endpointInventory === 'full')   score += 15
  else if (s.endpointInventory === 'partial') score += 7

  // VPN (10 pts) — remote access control
  if (s.vpn === 'business')             score += 10
  else if (s.vpn === 'consumer')        score += 4

  // WiFi segmentation (8 pts) — network hygiene
  if (s.wifiSegmentation === 'yes')     score += 8
  else if (s.wifiSegmentation === 'partial') score += 4

  // EDR/AV (7 pts) — endpoint threat detection
  if (s.edrAv === 'edr')                score += 7
  else if (s.edrAv === 'av')            score += 3

  return Math.min(score, 100)
}

function scoreIdentity(s: Step3Answers): number {
  let score = 0

  // MFA enforcement (30 pts) — highest-impact identity control
  if (s.mfa === 'all')                  score += 30
  else if (s.mfa === 'partial')         score += 13

  // Conditional Access (20 pts) — policy-based access
  if (s.conditionalAccess === 'configured') score += 20
  else if (s.conditionalAccess === 'partial') score += 9

  // Entra ID / directory (15 pts) — identity foundation
  if (s.entraId === 'full')             score += 15
  else if (s.entraId === 'partial')     score += 7

  // Privileged access (15 pts) — admin account security
  if (s.privilegedAccess === 'pam')     score += 15
  else if (s.privilegedAccess === 'individual') score += 9
  // shared accounts = 0 (critical gap)

  // Intune MDM (15 pts) — device posture
  if (s.intune === 'full')              score += 15
  else if (s.intune === 'partial')      score += 7

  // Onboarding/offboarding (5 pts) — lifecycle governance
  if (s.onboarding === 'automated')     score += 5
  else if (s.onboarding === 'manual')   score += 2

  return Math.min(score, 100)
}

function scoreOperations(s: Step4Answers): number {
  let score = 0

  // Monitoring & alerting (25 pts) — detection capability
  if (s.monitoring === 'siem')          score += 25
  else if (s.monitoring === 'basic')    score += 10

  // Last security audit (20 pts) — assessment discipline
  if (s.lastAudit === 'recent')         score += 20
  else if (s.lastAudit === 'dated')     score += 8

  // IT documentation (15 pts) — operational foundation
  if (s.documentation === 'current')    score += 15
  else if (s.documentation === 'outdated') score += 5

  // Change management (15 pts) — control environment
  if (s.changeManagement === 'formal')  score += 15
  else if (s.changeManagement === 'informal') score += 6

  // Compliance framework (15 pts) — governance
  if (s.compliance?.length > 0 && !s.compliance.includes('none')) score += 15

  // Ticketing (10 pts) — incident tracking
  if (s.ticketing === 'formal')         score += 10
  else if (s.ticketing === 'informal')  score += 4

  return Math.min(score, 100)
}

// ─── Risk flag generator ──────────────────────────────────────────────────────

function buildFlags(a: AssessmentAnswers): RiskFlag[] {
  const flags: RiskFlag[] = []
  const { step2: s2, step3: s3, step4: s4, step5: s5 } = a

  // ── CRITICAL flags ──

  if (s3.mfa === 'none') flags.push({
    id: 'no-mfa',
    severity: 'critical',
    category: 'Identidad',
    finding: 'Sin MFA — acceso por credencial simple en todos los usuarios',
    recommendation: 'Implementar MFA obligatorio vía Entra ID con Acceso Condicional (2–4 semanas)',
  })

  if (s3.privilegedAccess === 'shared') flags.push({
    id: 'shared-admin',
    severity: 'critical',
    category: 'Gobierno',
    finding: 'Cuentas administrativas compartidas — sin trazabilidad de cambios ni responsabilidad individual',
    recommendation: 'Migrar a cuentas nominales con PIM just-in-time y log de auditoría completo',
  })

  if (s2.backup === 'none') flags.push({
    id: 'no-backup',
    severity: 'critical',
    category: 'Continuidad',
    finding: 'Sin estrategia de respaldo definida ni verificada',
    recommendation: 'Implementar backup cloud con verificación periódica, RTO/RPO documentados',
  })

  if (s5.urgency === 'critical') flags.push({
    id: 'active-incident',
    severity: 'critical',
    category: 'Operacional',
    finding: 'Incidente activo o brecha operacional inmediata reportada',
    recommendation: 'Evaluación de respuesta a incidente prioritaria — contacto en menos de 4 horas hábiles',
  })

  // ── HIGH flags ──

  if (s2.vlanSegmentation === 'no') flags.push({
    id: 'flat-network',
    severity: 'high',
    category: 'Infraestructura',
    finding: 'Red plana — sin segmentación VLAN ni política de acceso lateral',
    recommendation: 'Diseñar arquitectura de red segmentada con VLANs por función y control inter-VLAN',
  })

  if (s2.endpointInventory === 'none' || s3.intune === 'none') flags.push({
    id: 'unmanaged-endpoints',
    severity: 'high',
    category: 'Endpoint',
    finding: 'Endpoints sin inventario ni gestión centralizada — postura de seguridad desconocida',
    recommendation: 'Implementar Intune MDM con inventario completo, políticas de cumplimiento y Autopilot',
  })

  if (s2.firewall === 'isp-default' || s2.firewall === 'none') flags.push({
    id: 'weak-perimeter',
    severity: 'high',
    category: 'Infraestructura',
    finding: 'Perímetro de red sin protección activa — firewall ISP o ausente',
    recommendation: 'Implementar NGFW con IPS/IDS, reglas de política y visibilidad de tráfico',
  })

  if (s4.monitoring === 'none') flags.push({
    id: 'no-monitoring',
    severity: 'high',
    category: 'Operaciones',
    finding: 'Sin monitoreo ni capacidad de detección de incidentes',
    recommendation: 'Implementar logging centralizado y alertas de seguridad como primer nivel de visibilidad',
  })

  if (s3.conditionalAccess === 'none' && s3.entraId !== 'none') flags.push({
    id: 'no-conditional-access',
    severity: 'high',
    category: 'Identidad',
    finding: 'Entra ID sin Acceso Condicional — políticas de acceso no aplicadas por contexto',
    recommendation: 'Configurar políticas de Acceso Condicional: MFA obligatorio, compliance de dispositivo, bloqueo por riesgo',
  })

  // ── MEDIUM flags ──

  if (s2.backup === 'local') flags.push({
    id: 'local-backup',
    severity: 'medium',
    category: 'Continuidad',
    finding: 'Respaldo solo local — sin protección ante desastre físico ni verificación documentada',
    recommendation: 'Complementar con copia offsite o cloud con prueba de restauración trimestral',
  })

  if (s4.documentation === 'none') flags.push({
    id: 'no-documentation',
    severity: 'medium',
    category: 'Operaciones',
    finding: 'Sin documentación de infraestructura — dependencia de conocimiento tácito',
    recommendation: 'Levantar inventario de red, credenciales (vault), diagramas y procedimientos críticos',
  })

  if (s4.lastAudit === 'never') flags.push({
    id: 'no-audit',
    severity: 'medium',
    category: 'Gobierno',
    finding: 'Sin auditoría de seguridad documentada — postura real desconocida',
    recommendation: 'Programar evaluación de vulnerabilidades y revisión de configuraciones anualmente',
  })

  if (s2.wifiSegmentation === 'no') flags.push({
    id: 'unsegmented-wifi',
    severity: 'medium',
    category: 'Infraestructura',
    finding: 'WiFi sin segmentación — invitados y dispositivos IoT en la misma red corporativa',
    recommendation: 'Crear SSIDs separados con VLAN de aislamiento para invitados y dispositivos de propósito especial',
  })

  if (s3.onboarding === 'none') flags.push({
    id: 'no-offboarding',
    severity: 'medium',
    category: 'Gobierno',
    finding: 'Sin proceso de baja de usuario — riesgo de accesos huérfanos activos',
    recommendation: 'Implementar proceso de offboarding con lista de verificación: desactivación de cuenta, revocación de acceso y recuperación de equipo',
  })

  // Sort by severity
  const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  return flags.sort((a, b) => order[a.severity] - order[b.severity])
}

// ─── Quick wins generator ─────────────────────────────────────────────────────

function buildQuickWins(a: AssessmentAnswers, _flags: RiskFlag[]): string[] {
  const wins: string[] = []
  const { step2: s2, step3: s3, step4: s4 } = a

  if (s3.mfa === 'none' || s3.mfa === 'partial')
    wins.push('Enrolamiento MFA para todos los usuarios: 2–3 semanas')
  if (s4.documentation === 'none')
    wins.push('Inventario de activos de red y endpoints: 1 semana')
  if (s2.backup === 'none')
    wins.push('Configurar backup cloud con primera verificación: 1–2 semanas')
  if (s3.privilegedAccess === 'shared' || s3.privilegedAccess === 'none')
    wins.push('Normalizar cuentas administrativas individuales: 1 semana')
  if (s3.conditionalAccess === 'none' && s3.entraId !== 'none')
    wins.push('Activar políticas de Acceso Condicional base: 3–5 días')
  if (s4.monitoring === 'none')
    wins.push('Habilitar alertas de inicio de sesión y cambios privilegiados: 2–3 días')
  if (s2.wifiSegmentation === 'no')
    wins.push('Crear SSID separado para invitados con aislamiento VLAN: 1–2 días')

  return wins.slice(0, 5)
}

// ─── Priority generator ───────────────────────────────────────────────────────

function buildPriorities(flags: RiskFlag[]): string[] {
  return flags
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 5)
    .map(f => f.recommendation.split(':')[0].split('—')[0].trim())
}

// ─── Recommended phase ────────────────────────────────────────────────────────

function buildRecommendedPhase(
  infraScore: number,
  identityScore: number,
  opsScore: number,
  flags: RiskFlag[]
): string {
  const critCount = flags.filter(f => f.severity === 'critical').length
  if (critCount >= 2) return 'Respuesta Operacional Prioritaria — evaluación técnica presencial en 48 h'

  const identityFlags = flags.filter(f => f.category === 'Identidad' || f.category === 'Gobierno').length
  const infraFlags    = flags.filter(f => f.category === 'Infraestructura' || f.category === 'Endpoint').length
  const opsFlags      = flags.filter(f => f.category === 'Operaciones').length

  if (identityScore < 30 && identityFlags >= 2) return 'Proyecto de Identidad y Acceso — Entra ID, MFA y Acceso Condicional'
  if (infraScore < 35 && infraFlags >= 2)       return 'Proyecto de Seguridad de Red — segmentación, NGFW y continuidad'
  if (opsScore < 35 && opsFlags >= 2)            return 'Programa de Madurez Operacional — documentación, monitoreo y gobierno'
  return 'Diagnóstico Integral y Roadmap de Modernización'
}

// ─── Maturity mapping ─────────────────────────────────────────────────────────

const MATURITY_MAP: Array<{
  min: number; level: MaturityLevel; label: string; desc: string
}> = [
  { min: 0,  level: 'initial',    label: 'Inicial',    desc: 'Controles ad-hoc, sin procesos formales. Exposición operacional alta.' },
  { min: 25, level: 'developing', label: 'Desarrollo', desc: 'Controles básicos presentes, implementación inconsistente.' },
  { min: 45, level: 'defined',    label: 'Definida',   desc: 'Procesos documentados y parcialmente gestionados.' },
  { min: 65, level: 'managed',    label: 'Gestionada', desc: 'Controles proactivos, métricas definidas y monitoreo activo.' },
  { min: 80, level: 'optimized',  label: 'Optimizada', desc: 'Mejora continua, procesos maduros y cobertura integral.' },
]

function maturityFromScore(score: number) {
  let m = MATURITY_MAP[0]
  for (const entry of MATURITY_MAP) {
    if (score >= entry.min) m = entry
  }
  return m
}

// ─── Observations ─────────────────────────────────────────────────────────────

function buildObservations(a: AssessmentAnswers, scores: { infra: number; identity: number; ops: number }): string[] {
  const obs: string[] = []
  const { step1: s1, step3: s3, step4: s4 } = a

  if (s1.remoteWorkforce === 'significant' || s1.remoteWorkforce === 'full') {
    if (s3.conditionalAccess !== 'configured')
      obs.push('Fuerza de trabajo remota significativa sin Acceso Condicional configura un vector de exposición directa a credenciales.')
  }
  if (s1.microsoft365 === 'full' && s3.mfa === 'none')
    obs.push('Microsoft 365 activo sin MFA es la combinación de mayor riesgo en entornos empresariales — objetivo primario de ataques de phishing y credential stuffing.')
  if (s1.infrastructure === 'hybrid' && s3.entraId === 'none')
    obs.push('Entorno híbrido sin integración Entra ID genera identidades no sincronizadas y puntos ciegos de acceso.')
  if (s4.lastAudit === 'never' && scores.identity < 40)
    obs.push('Sin auditoría previa y bajo puntaje de identidad, la brecha real puede ser significativamente mayor que lo que este cuestionario refleja.')
  if (s1.locations !== '1' && a.step2.vlanSegmentation === 'no')
    obs.push('Red multi-sede sin segmentación multiplica el radio de impacto ante cualquier incidente de seguridad.')
  if (scores.infra < 30 && scores.identity < 30)
    obs.push('Convergencia de debilidades en infraestructura e identidad indica una superficie de ataque amplia. Se recomienda abordar ambos dominios de forma coordinada.')

  return obs.slice(0, 4)
}

// ─── Main scoring function ───────────────────────────────────────────────────

export function scoreAssessment(a: AssessmentAnswers): ScoreResult {
  const infra    = scoreInfrastructure(a.step2)
  const identity = scoreIdentity(a.step3)
  const ops      = scoreOperations(a.step4)

  // Weighted composite: identity highest weight (Velkor's core expertise + highest impact)
  const overall = Math.round(infra * 0.35 + identity * 0.40 + ops * 0.25)

  const { level: maturity, label: maturityLabel, desc: maturityDesc } = maturityFromScore(overall)

  const flags         = buildFlags(a)
  const criticalCount = flags.filter(f => f.severity === 'critical').length
  const highCount     = flags.filter(f => f.severity === 'high').length

  const exposureLevel: ExposureLevel =
    criticalCount > 0         ? 'critical' :
    highCount > 0             ? 'high'     :
    flags.length > 0          ? 'medium'   : 'managed'

  const EXPOSURE_LABELS: Record<ExposureLevel, string> = {
    critical: 'Exposición Crítica',
    high:     'Exposición Alta',
    medium:   'Exposición Media',
    managed:  'Exposición Controlada',
  }

  const quickWins          = buildQuickWins(a, flags)
  const immediatePriorities = buildPriorities(flags)
  const recommendedPhase   = buildRecommendedPhase(infra, identity, ops, flags)
  const observations       = buildObservations(a, { infra, identity, ops })

  return {
    infrastructure:  Math.round(infra),
    identity:        Math.round(identity),
    operations:      Math.round(ops),
    overall,
    maturity,
    maturityLabel,
    maturityDesc,
    exposureLevel,
    exposureLabel:   EXPOSURE_LABELS[exposureLevel],
    flags,
    criticalCount,
    highCount,
    quickWins,
    immediatePriorities,
    recommendedPhase,
    observations,
  }
}

export const DIAGNOSTIC_SETS: DiagnosticSet[] = [
  {
    id: 'exposure-estimator',
    title: 'Estimador rapido de exposicion',
    description: 'Cinco controles que suelen revelar si el entorno puede contener un incidente sin frenar la operacion.',
    service: 'operaciones',
    ctaIntent: 'operational-review',
    questions: [
      {
        id: 'vlans-with-acl',
        domain: 'network',
        question: '¿Tus VLAN tienen ACL entre segmentos?',
        context: 'No basta separar subredes si usuarios, camaras y servidores pueden cruzarse sin politica.',
        riskWhen: 'no',
        weight: 1.2,
        signal: 'segmentation-gap',
      },
      {
        id: 'admin-mfa',
        domain: 'identity',
        question: '¿Admins usan MFA obligatorio?',
        context: 'La primera cuenta privilegiada sin MFA suele definir el radio real de un incidente.',
        riskWhen: 'no',
        weight: 1.35,
        signal: 'admin-mfa-gap',
      },
      {
        id: 'personal-endpoints',
        domain: 'endpoint',
        question: '¿Endpoints personales acceden a recursos internos?',
        context: 'BYOD sin postura complica respuesta, evidencia y revocacion de acceso.',
        riskWhen: 'yes',
        weight: 1.1,
        signal: 'unmanaged-device-access',
      },
      {
        id: 'shared-accounts',
        domain: 'identity',
        question: '¿Usuarios comparten cuentas o credenciales operativas?',
        context: 'Una cuenta compartida elimina trazabilidad justo cuando mas se necesita reconstruir cambios.',
        riskWhen: 'yes',
        weight: 1.3,
        signal: 'shared-account-risk',
      },
      {
        id: 'camera-isolation',
        domain: 'video',
        question: '¿Tus camaras estan aisladas de la red corporativa?',
        context: 'Video, invitados y operacion interna no deberian vivir en la misma zona de confianza.',
        riskWhen: 'no',
        weight: 0.95,
        signal: 'video-network-exposure',
      },
    ],
  },
  {
    id: 'segmentation-maturity',
    title: 'Indicador de madurez de segmentacion',
    description: 'Evalua si la red contiene trafico lateral o solo esta ordenada visualmente.',
    service: 'ciberseguridad',
    ctaIntent: 'segmentation-validation',
    questions: [
      {
        id: 'critical-zone-acl',
        domain: 'network',
        question: '¿Servidores, usuarios, invitados y camaras tienen reglas explicitas entre zonas?',
        context: 'La segmentacion util se mide por politica aplicada, no por cantidad de VLANs.',
        riskWhen: 'no',
        weight: 1.35,
        signal: 'missing-zone-policy',
      },
      {
        id: 'deny-by-default',
        domain: 'network',
        question: '¿El firewall usa deny implicito entre segmentos?',
        context: 'Las excepciones deben tener dueno, motivo y fecha de retiro.',
        riskWhen: 'no',
        weight: 1.2,
        signal: 'permissive-internal-policy',
      },
      {
        id: 'rollback-plan',
        domain: 'operations',
        question: '¿Cada cambio de red tiene rollback probado antes de ventana?',
        context: 'Un cambio correcto tambien necesita reversa si una app heredada falla.',
        riskWhen: 'no',
        weight: 1,
        signal: 'network-rollback-gap',
      },
      {
        id: 'intervlan-logging',
        domain: 'network',
        question: '¿Se registran los cruces relevantes entre VLANs?',
        context: 'Sin logs, la segmentacion no produce evidencia para investigar.',
        riskWhen: 'no',
        weight: 0.9,
        signal: 'lateral-traffic-blindspot',
      },
    ],
  },
  {
    id: 'identity-risk-scan',
    title: 'Escaneo rapido de identidad',
    description: 'Detecta accesos con privilegio, sesiones sin contexto y huecos de gobierno en Entra ID.',
    service: 'identidad',
    ctaIntent: 'identity-exposure-review',
    questions: [
      {
        id: 'all-users-mfa',
        domain: 'identity',
        question: '¿MFA aplica a todos los usuarios, incluyendo externos y admins?',
        context: 'La excepcion no documentada suele convertirse en el camino de menor resistencia.',
        riskWhen: 'no',
        weight: 1.35,
        signal: 'mfa-coverage-gap',
      },
      {
        id: 'conditional-access-context',
        domain: 'identity',
        question: '¿Acceso Condicional valida ubicacion, dispositivo y riesgo?',
        context: 'MFA por si solo no decide si el dispositivo o la sesion son confiables.',
        riskWhen: 'no',
        weight: 1.25,
        signal: 'conditional-access-gap',
      },
      {
        id: 'shared-admins',
        domain: 'identity',
        question: '¿Existen cuentas administrativas compartidas?',
        context: 'Si varios operadores usan la misma cuenta, auditoria y responsabilidad quedan rotas.',
        riskWhen: 'yes',
        weight: 1.3,
        signal: 'shared-admin-risk',
      },
      {
        id: 'offboarding-same-day',
        domain: 'operations',
        question: '¿La baja de usuario revoca accesos el mismo dia?',
        context: 'Los accesos huerfanos son deuda operativa, no solo administrativa.',
        riskWhen: 'no',
        weight: 0.95,
        signal: 'offboarding-gap',
      },
    ],
  },
  {
    id: 'endpoint-governance',
    title: 'Check de gobierno de endpoints',
    description: 'Revisa inventario, postura y control de equipos antes de ampliar acceso remoto.',
    service: 'endpoint',
    ctaIntent: 'endpoint-governance-check',
    questions: [
      {
        id: 'endpoint-inventory',
        domain: 'endpoint',
        question: '¿Tienes inventario confiable de endpoints activos?',
        context: 'No se puede parchear, aislar o investigar un equipo que no aparece en inventario.',
        riskWhen: 'no',
        weight: 1.25,
        signal: 'endpoint-inventory-gap',
      },
      {
        id: 'device-compliance',
        domain: 'endpoint',
        question: '¿El acceso a M365 exige cumplimiento de dispositivo?',
        context: 'El control mas efectivo combina identidad, dispositivo y contexto de sesion.',
        riskWhen: 'no',
        weight: 1.2,
        signal: 'device-compliance-gap',
      },
      {
        id: 'personal-device-access',
        domain: 'endpoint',
        question: '¿Equipos personales abren correo, archivos o VPN?',
        context: 'Si no puedes aplicar postura, el acceso debe limitarse por capa y sensibilidad.',
        riskWhen: 'yes',
        weight: 1.15,
        signal: 'personal-device-exposure',
      },
      {
        id: 'patching-owner',
        domain: 'operations',
        question: '¿Hay responsable y cadencia de parcheo documentada?',
        context: 'El atraso de parches casi siempre es un problema de ownership, no de herramienta.',
        riskWhen: 'no',
        weight: 0.95,
        signal: 'patch-ownership-gap',
      },
    ],
  },
  {
    id: 'mfa-gap-detector',
    title: 'Detector de brecha MFA',
    description: 'Ubica excepciones de autenticacion fuerte antes de convertirlas en incidente.',
    service: 'identidad',
    ctaIntent: 'mfa-gap-review',
    questions: [
      {
        id: 'legacy-auth-blocked',
        domain: 'identity',
        question: '¿Autenticacion heredada esta bloqueada?',
        context: 'Protocolos heredados pueden saltarse controles modernos si quedan habilitados.',
        riskWhen: 'no',
        weight: 1.25,
        signal: 'legacy-auth-exposure',
      },
      {
        id: 'break-glass-monitored',
        domain: 'identity',
        question: '¿Cuentas break-glass tienen alerta y revision mensual?',
        context: 'Una cuenta de emergencia sin monitoreo termina siendo acceso permanente.',
        riskWhen: 'no',
        weight: 1,
        signal: 'break-glass-monitoring-gap',
      },
      {
        id: 'external-users-mfa',
        domain: 'identity',
        question: '¿Usuarios externos y proveedores pasan por MFA?',
        context: 'Los proveedores suelen tener acceso suficiente para mover datos o configuraciones.',
        riskWhen: 'no',
        weight: 1.15,
        signal: 'vendor-mfa-gap',
      },
      {
        id: 'privileged-mfa-proof',
        domain: 'identity',
        question: '¿Puedes probar con evidencia que todos los privilegios usan MFA?',
        context: 'La configuracion declarada no reemplaza un export o log revisable.',
        riskWhen: 'no',
        weight: 1.2,
        signal: 'privileged-mfa-evidence-gap',
      },
    ],
  },
]

const DIAGNOSTIC_EXPOSURE_LABELS: Record<ExposureLevel, string> = {
  critical: 'Exposicion inmediata',
  high: 'Exposicion alta',
  medium: 'Exposicion revisable',
  managed: 'Control razonable',
}

const ANSWER_CONTROL_SCORE: Record<DiagnosticAnswer, number> = {
  yes: 100,
  partial: 55,
  unknown: 35,
  no: 8,
}

function scoreDiagnosticAnswer(answer: DiagnosticAnswer, riskWhen: DiagnosticAnswer): number {
  if (answer === 'unknown') return ANSWER_CONTROL_SCORE.unknown
  if (riskWhen === 'yes') {
    if (answer === 'yes') return 8
    if (answer === 'partial') return 45
    return 100
  }
  return ANSWER_CONTROL_SCORE[answer]
}

function diagnosticSeverity(score: number): Severity {
  if (score < 25) return 'critical'
  if (score < 50) return 'high'
  if (score < 72) return 'medium'
  return 'low'
}

function diagnosticExposureFromScore(score: number, findings: DiagnosticFinding[]): ExposureLevel {
  if (findings.some(f => f.severity === 'critical') || score < 28) return 'critical'
  if (findings.some(f => f.severity === 'high') || score < 52) return 'high'
  if (findings.length > 0 || score < 78) return 'medium'
  return 'managed'
}

function diagnosticFindingText(question: DiagnosticQuestion, answer: DiagnosticAnswer): string {
  if (answer === 'unknown') return `No hay evidencia clara para "${question.question}".`
  if (question.riskWhen === 'yes') return `${question.question} La respuesta indica exposicion operativa.`
  return `${question.question} La respuesta indica control insuficiente o parcial.`
}

function diagnosticRecommendation(question: DiagnosticQuestion): string {
  const recommendations: Record<DiagnosticDomain, string> = {
    network: 'Validar reglas entre zonas, dependencias y rollback antes de ampliar conectividad.',
    identity: 'Revisar cobertura MFA, privilegios y Acceso Condicional con evidencia exportable.',
    endpoint: 'Normalizar inventario, postura de dispositivo y ownership de parcheo.',
    video: 'Aislar trafico de video, credenciales y acceso remoto de CCTV.',
    operations: 'Documentar responsable, ventana, evidencia y reversa para cada cambio critico.',
  }
  return recommendations[question.domain]
}

export function getDiagnosticSet(id: string): DiagnosticSet | undefined {
  return DIAGNOSTIC_SETS.find(set => set.id === id)
}

export function scoreDiagnosticAnswers(
  diagnosticId: string,
  answers: Partial<Record<string, DiagnosticAnswer>>
): DiagnosticResult {
  const diagnostic = getDiagnosticSet(diagnosticId) ?? DIAGNOSTIC_SETS[0]
  const answeredQuestions = diagnostic.questions.filter(q => answers[q.id])

  let weightedScore = 0
  let totalWeight = 0
  const domainWeighted: Partial<Record<DiagnosticDomain, { score: number; weight: number }>> = {}
  const findings: DiagnosticFinding[] = []

  for (const question of answeredQuestions) {
    const answer = answers[question.id]
    if (!answer) continue
    const score = scoreDiagnosticAnswer(answer, question.riskWhen)
    weightedScore += score * question.weight
    totalWeight += question.weight

    const current = domainWeighted[question.domain] ?? { score: 0, weight: 0 }
    current.score += score * question.weight
    current.weight += question.weight
    domainWeighted[question.domain] = current

    const severity = diagnosticSeverity(score)
    if (severity !== 'low') {
      findings.push({
        questionId: question.id,
        domain: question.domain,
        severity,
        finding: diagnosticFindingText(question, answer),
        recommendation: diagnosticRecommendation(question),
      })
    }
  }

  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0
  const domainScores = Object.fromEntries(
    Object.entries(domainWeighted).map(([domain, value]) => [
      domain,
      Math.round(value.score / Math.max(value.weight, 1)),
    ])
  ) as Partial<Record<DiagnosticDomain, number>>
  const sortedFindings = findings.sort((a, b) => {
    const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }
    return order[a.severity] - order[b.severity]
  })
  const exposureLevel = diagnosticExposureFromScore(score, sortedFindings)
  const topFinding = sortedFindings[0]?.finding ?? 'No aparece una brecha critica con las respuestas actuales.'
  const recommendation = sortedFindings[0]?.recommendation ?? 'Mantener evidencia, responsables y revision periodica de controles.'

  return {
    diagnosticId: diagnostic.id,
    score,
    exposureLevel,
    exposureLabel: DIAGNOSTIC_EXPOSURE_LABELS[exposureLevel],
    service: diagnostic.service,
    ctaIntent: diagnostic.ctaIntent,
    answeredCount: answeredQuestions.length,
    totalQuestions: diagnostic.questions.length,
    topFinding,
    recommendation,
    findings: sortedFindings,
    leadSignals: sortedFindings.map(f => `${f.domain}:${f.severity}`),
    domainScores,
  }
}
