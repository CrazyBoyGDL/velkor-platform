// ─── Velkor Proposal Automation Foundation ───────────────────────────────────
// Phase 5 of the Velkor Operational Evidence Platform.
// Generates structured implementation proposals from assessment data.
// No external dependencies — all logic is pure functions.

import type { AssessmentAnswers, ScoreResult } from './scoring'
import type { LeadClassification } from './classification'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProposalSection {
  id:      string
  title:   string
  content: string
}

export type PhasePriority = 'immediate' | 'high' | 'standard'

export interface ProposalPhase {
  phase:          number
  title:          string
  objective:      string
  deliverables:   string[]
  estimatedWeeks: number
  priority:       PhasePriority
}

export interface GeneratedProposal {
  executiveSummary: string
  proposedPhases:   ProposalPhase[]
  scopeStatement:   string
  outOfScope:       string[]
  successCriteria:  string[]
  riskFactors:      string[]
  nextSteps:        string[]
  generatedAt:      string
}

// ─── Executive summary ────────────────────────────────────────────────────────

function buildExecutiveSummary(
  answers: AssessmentAnswers,
  scores: ScoreResult,
  classification: LeadClassification
): string {
  const { step1: s1, step5: s5 } = answers
  const { exposureLabel, maturityLabel, criticalCount, highCount } = scores

  const companyContext = `${answers.company} opera en el sector ${s1.industry} con ${s1.companySize} colaboradores`
  const remoteContext  = s1.remoteWorkforce !== 'none'
    ? ` y una fuerza de trabajo ${s1.remoteWorkforce === 'full' ? 'completamente remota' : 'parcialmente remota'}`
    : ''

  const riskContext = criticalCount > 0
    ? `La evaluación identificó ${criticalCount} hallazgo(s) crítico(s) y ${highCount} alto(s), configurando una exposición operacional ${exposureLabel.toLowerCase()} que requiere atención prioritaria.`
    : highCount > 0
    ? `La evaluación identificó ${highCount} hallazgo(s) de alta severidad con una madurez de seguridad en nivel ${maturityLabel.toLowerCase()}.`
    : `La evaluación refleja un nivel de madurez ${maturityLabel.toLowerCase()} con oportunidades de mejora en controles operacionales.`

  const engagementContext = `Esta propuesta define un plan de implementación orientado a ${classification.engagementLabel.toLowerCase()}, alineado con las prioridades operacionales declaradas.`

  return `${companyContext}${remoteContext}. ${riskContext} ${engagementContext}`
}

// ─── Phase generation logic ───────────────────────────────────────────────────

function buildPhases(answers: AssessmentAnswers, scores: ScoreResult): ProposalPhase[] {
  const phases: ProposalPhase[] = []
  const { step3: s3, step4: s4, step5: s5 } = answers
  let phaseNumber = 1

  // Phase 1 (conditional): Immediate response when critical findings exist
  if (scores.criticalCount > 0) {
    phases.push({
      phase:        phaseNumber++,
      title:        'Respuesta y Remediación Inmediata',
      objective:    'Neutralizar hallazgos críticos que representan exposición operacional activa antes de abordar mejoras estructurales.',
      deliverables: buildRemediationDeliverables(answers, scores),
      estimatedWeeks: scores.criticalCount >= 3 ? 2 : 1,
      priority:     'immediate',
    })
  }

  // Identity / Governance phase: triggered by identity or governance gaps
  const identityFlags = scores.flags.filter(f =>
    f.category === 'Identidad' || f.category === 'Gobierno'
  )
  const hasIdentityGaps = identityFlags.length >= 1 || scores.identity < 50

  if (hasIdentityGaps) {
    const deliverables: string[] = []
    if (s3.mfa === 'none' || s3.mfa === 'partial')
      deliverables.push('MFA obligatorio para todos los usuarios con Entra ID')
    if (s3.conditionalAccess !== 'configured')
      deliverables.push('Políticas de Acceso Condicional: MFA, cumplimiento de dispositivo, bloqueo por riesgo')
    if (s3.entraId !== 'full')
      deliverables.push('Integración y sincronización completa con Entra ID')
    if (s3.privilegedAccess === 'shared' || s3.privilegedAccess === 'none')
      deliverables.push('Cuentas administrativas nominales y PIM just-in-time')
    if (s3.intune !== 'full')
      deliverables.push('Gestión de dispositivos con Intune MDM y políticas de cumplimiento')
    if (s3.onboarding !== 'automated')
      deliverables.push('Proceso automatizado de onboarding y offboarding de usuarios')
    if (deliverables.length === 0)
      deliverables.push('Revisión y refuerzo de controles de identidad existentes')

    phases.push({
      phase:          phaseNumber++,
      title:          'Gobierno de Identidad y Acceso',
      objective:      'Establecer controles de identidad coherentes y verificables como fundamento de la postura de seguridad.',
      deliverables,
      estimatedWeeks: scores.identity < 25 ? 4 : 3,
      priority:       scores.criticalCount > 0 ? 'high' : 'immediate',
    })
  }

  // Infrastructure phase: triggered by infrastructure or endpoint gaps
  const infraFlags = scores.flags.filter(f =>
    f.category === 'Infraestructura' || f.category === 'Endpoint' || f.category === 'Continuidad'
  )
  const hasInfraGaps = infraFlags.length >= 1 || scores.infrastructure < 50

  if (hasInfraGaps) {
    const deliverables: string[] = []
    const { step2: s2, step1: s1 } = answers
    if (s2.vlanSegmentation !== 'yes')
      deliverables.push('Diseño e implementación de segmentación de red por VLANs')
    if (s2.firewall === 'isp-default' || s2.firewall === 'none')
      deliverables.push('Implementación de NGFW con IPS/IDS y políticas de tráfico')
    if (s2.endpointInventory !== 'full')
      deliverables.push('Inventario completo y clasificación de endpoints por función y riesgo')
    if (s2.backup !== 'cloud-verified')
      deliverables.push('Estrategia de backup cloud con verificación de restauración y RTO/RPO documentados')
    if (s2.vpn !== 'business' && (s1.remoteWorkforce === 'significant' || s1.remoteWorkforce === 'full'))
      deliverables.push('VPN corporativa con autenticación MFA para acceso remoto')
    if (s2.wifiSegmentation !== 'yes')
      deliverables.push('Segmentación WiFi: SSIDs corporativo, invitados e IoT con aislamiento VLAN')
    if (s2.edrAv !== 'edr')
      deliverables.push('Despliegue de EDR con detección y respuesta en endpoints')
    if (deliverables.length === 0)
      deliverables.push('Revisión y optimización de controles de infraestructura existentes')

    phases.push({
      phase:          phaseNumber++,
      title:          'Seguridad de Red e Infraestructura',
      objective:      'Reducir la superficie de ataque perimetral y establecer visibilidad y control sobre activos de red y endpoints.',
      deliverables,
      estimatedWeeks: scores.infrastructure < 25 ? 5 : 3,
      priority:       hasIdentityGaps ? 'high' : 'immediate',
    })
  }

  // Operations phase: triggered by operational maturity gaps
  const opsFlags = scores.flags.filter(f => f.category === 'Operaciones')
  const hasOpsGaps = opsFlags.length >= 1 || scores.operations < 50 ||
    s4.documentation === 'none' || s4.monitoring === 'none'

  if (hasOpsGaps) {
    const deliverables: string[] = []
    if (s4.monitoring !== 'siem')
      deliverables.push('Logging centralizado y alertas de seguridad para eventos críticos')
    if (s4.documentation !== 'current')
      deliverables.push('Documentación de infraestructura: diagramas de red, inventario y procedimientos')
    if (s4.ticketing !== 'formal')
      deliverables.push('Plataforma de ticketing con flujos de escalación y SLAs definidos')
    if (s4.changeManagement !== 'formal')
      deliverables.push('Proceso de gestión de cambios con registro de auditoría')
    if (s4.lastAudit !== 'recent')
      deliverables.push('Evaluación de vulnerabilidades y revisión de configuraciones')
    if (s5.complianceNeeds?.length > 0 && !s5.complianceNeeds.includes('none'))
      deliverables.push('Mapeo de controles a marcos de cumplimiento requeridos')
    if (deliverables.length === 0)
      deliverables.push('Revisión de madurez operacional y oportunidades de mejora continua')

    phases.push({
      phase:          phaseNumber++,
      title:          'Madurez Operacional y Procesos',
      objective:      'Establecer capacidades de monitoreo, respuesta y gobierno que sostengan los controles técnicos implementados.',
      deliverables,
      estimatedWeeks: scores.operations < 25 ? 4 : 3,
      priority:       'standard',
    })
  }

  // Final phase: always present
  phases.push({
    phase:          phaseNumber,
    title:          'Documentación, Entrenamiento y Handoff',
    objective:      'Transferir conocimiento operacional, validar controles implementados y asegurar la autonomía del equipo interno.',
    deliverables: [
      'Documentación técnica final: arquitectura, configuraciones y runbooks',
      'Sesiones de entrenamiento para administradores TI y usuarios clave',
      'Prueba de aceptación de controles implementados contra criterios de éxito',
      'Plan de mantenimiento y calendario de revisiones periódicas',
      'Informe de cierre con estado inicial vs. estado final de madurez',
    ],
    estimatedWeeks: 2,
    priority:       'standard',
  })

  return phases
}

// ─── Remediation deliverables (used when criticalCount > 0) ──────────────────

function buildRemediationDeliverables(answers: AssessmentAnswers, scores: ScoreResult): string[] {
  const deliverables: string[] = []
  const criticalFlags = scores.flags.filter(f => f.severity === 'critical')

  for (const flag of criticalFlags) {
    switch (flag.id) {
      case 'no-mfa':
        deliverables.push('Enrolamiento de emergencia MFA para cuentas con acceso privilegiado')
        break
      case 'shared-admin':
        deliverables.push('Separación y normalización de cuentas administrativas compartidas')
        break
      case 'no-backup':
        deliverables.push('Configuración de backup de emergencia para datos críticos identificados')
        break
      case 'active-incident':
        deliverables.push('Evaluación técnica presencial de alcance y contención del incidente')
        deliverables.push('Informe de hallazgos iniciales con vector de ataque probable')
        break
    }
  }

  if (deliverables.length === 0)
    deliverables.push('Evaluación técnica de hallazgos críticos identificados')

  deliverables.push('Informe de remediación con evidencia de controles aplicados')
  return deliverables
}

// ─── Scope statement ─────────────────────────────────────────────────────────

function buildScopeStatement(answers: AssessmentAnswers, _classification: LeadClassification): string {
  const { step1: s1 } = answers
  const sizeContext = s1.locations !== '1'
    ? `${s1.locations} ubicaciones`
    : 'la sede central'

  return `Esta propuesta cubre la evaluación, diseño e implementación de controles de seguridad operacional para ${answers.company}, ` +
    `abarcando ${sizeContext} con una base de ${s1.companySize} colaboradores. ` +
    `El alcance incluye los dominios de identidad y acceso, infraestructura de red, continuidad operacional ` +
    `y madurez de procesos, según las brechas identificadas en la evaluación diagnóstica inicial.`
}

// ─── Out of scope ─────────────────────────────────────────────────────────────

function buildOutOfScope(answers: AssessmentAnswers): string[] {
  const { step4: s4, step5: s5 } = answers
  const exclusions: string[] = [
    'Desarrollo de software a medida o integración de aplicaciones de negocio',
    'Soporte técnico de nivel 1 para usuarios finales (helpdesk)',
    'Adquisición de hardware o licencias de software (gestionado por el cliente)',
  ]

  const compliance = s4.compliance?.filter(c => c !== 'none') ?? []
  const complianceNeeds = s5.complianceNeeds?.filter(c => c !== 'none') ?? []
  if (compliance.length === 0 && complianceNeeds.length === 0)
    exclusions.push('Certificación formal ante organismos de cumplimiento normativo')

  if (answers.step1.infrastructure !== 'cloud' && answers.step1.infrastructure !== 'hybrid')
    exclusions.push('Migración a nube pública (requiere fase de planeación estratégica separada)')

  exclusions.push('Actividades de seguridad ofensiva (pentesting o red team) salvo acuerdo específico')

  return exclusions
}

// ─── Success criteria ─────────────────────────────────────────────────────────

function buildSuccessCriteria(answers: AssessmentAnswers, scores: ScoreResult): string[] {
  const criteria: string[] = []
  const { step3: s3, step4: s4, step2: s2 } = answers

  if (s3.mfa === 'none' || s3.mfa === 'partial')
    criteria.push('MFA habilitado y forzado al 100% de los usuarios en el tenant')
  if (s3.conditionalAccess !== 'configured')
    criteria.push('Políticas de Acceso Condicional activas con cobertura verificada por reporte')
  if (s4.documentation !== 'current')
    criteria.push('Documentación de infraestructura completa, versionada y accesible al equipo TI')
  if (s2.backup !== 'cloud-verified')
    criteria.push('Restauración de backup exitosa documentada con RTO real medido')
  if (s4.monitoring === 'none')
    criteria.push('Alertas de seguridad activas con tiempo de detección de eventos críticos < 15 minutos')

  criteria.push(`Puntuación de madurez de seguridad superior a ${Math.min(scores.overall + 25, 85)} en reevaluación post-implementación`)
  criteria.push('Cero hallazgos críticos abiertos al cierre del proyecto')
  criteria.push('Equipo interno capaz de operar y mantener los controles sin asistencia externa')

  return criteria
}

// ─── Risk factors ─────────────────────────────────────────────────────────────

function buildRiskFactors(answers: AssessmentAnswers, _scores: ScoreResult): string[] {
  const risks: string[] = []
  const { step1: s1, step3: s3, step4: s4, step5: s5 } = answers

  // Undocumented infrastructure
  if (s1.infrastructure === 'unformalized' || s4.documentation === 'none')
    risks.push('Infraestructura no documentada puede revelar dependencias desconocidas durante la implementación')

  // Remote workforce without conditional access
  if ((s1.remoteWorkforce === 'significant' || s1.remoteWorkforce === 'full') &&
      s3.conditionalAccess !== 'configured')
    risks.push('Fuerza de trabajo remota activa representa vector de riesgo durante la migración de controles de acceso')

  // Legacy compliance deadlines
  const hasComplianceNeeds =
    (s4.compliance?.length > 0 && !s4.compliance.includes('none')) ||
    (s5.complianceNeeds?.length > 0 && !s5.complianceNeeds.includes('none'))
  if (hasComplianceNeeds)
    risks.push('Plazos regulatorios pueden comprimir ventanas de implementación y requerir priorización')

  // Multi-site complexity
  if (s1.locations === '6-20' || s1.locations === '20+')
    risks.push('Entorno multi-sede incrementa la complejidad de despliegue y los tiempos de coordinación')

  // Shared admin accounts — change management risk
  if (s3.privilegedAccess === 'shared')
    risks.push('Normalización de cuentas administrativas compartidas puede interrumpir operaciones si no se gestiona con ventanas de mantenimiento')

  // No ticketing / change management
  if (s4.changeManagement === 'none' && s4.ticketing === 'none')
    risks.push('Ausencia de procesos de cambio formales aumenta el riesgo de regresiones no detectadas post-implementación')

  // Active incident during implementation
  if (s5.urgency === 'critical')
    risks.push('Incidente activo puede requerir desvíos del plan original para contención inmediata')

  if (risks.length === 0)
    risks.push('Perfil operacional estable — riesgos de implementación acotados a coordinación de agenda y disponibilidad del equipo')

  return risks
}

// ─── Next steps ───────────────────────────────────────────────────────────────

function buildNextSteps(_scores: ScoreResult, classification: LeadClassification): string[] {
  if (classification.priority === 'critical') {
    return [
      'Agendar llamada técnica urgente con el equipo de Velkor en las próximas 4 horas hábiles',
      'Preparar acceso temporal de lectura al tenant para revisión de configuración de Entra ID',
      'Identificar al responsable de TI con acceso administrativo para iniciar la evaluación presencial',
    ]
  }

  if (classification.priority === 'high') {
    return [
      'Agendar llamada técnica con el equipo de Velkor en el transcurso del día',
      'Compartir diagrama de red actual (aunque sea aproximado) para contextualizar la propuesta',
      'Confirmar al stakeholder interno con autoridad para aprobar inicio de proyecto',
    ]
  }

  return [
    'Revisar esta propuesta con el equipo directivo y área de TI',
    'Agendar sesión de preguntas técnicas con el consultor asignado de Velkor',
    'Definir fecha estimada de inicio y asignar contacto técnico interno del proyecto',
  ]
}

// ─── Main generate function ───────────────────────────────────────────────────

export function generateProposal(
  answers: AssessmentAnswers,
  scores: ScoreResult,
  classification: LeadClassification
): GeneratedProposal {
  return {
    executiveSummary: buildExecutiveSummary(answers, scores, classification),
    proposedPhases:   buildPhases(answers, scores),
    scopeStatement:   buildScopeStatement(answers, classification),
    outOfScope:       buildOutOfScope(answers),
    successCriteria:  buildSuccessCriteria(answers, scores),
    riskFactors:      buildRiskFactors(answers, scores),
    nextSteps:        buildNextSteps(scores, classification),
    generatedAt:      new Date().toISOString(),
  }
}
