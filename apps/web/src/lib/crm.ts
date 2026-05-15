// ─── Velkor CRM Operations Layer ─────────────────────────────────────────────
// Provides workflow assignment, SLA routing, pipeline stage definitions,
// follow-up cadences, and Strapi payload construction.

import type { AssessmentAnswers, ScoreResult } from './scoring'
import type { LeadClassification }             from './classification'

// ─── Pipeline Stages ──────────────────────────────────────────────────────────

/**
 * Full sales pipeline lifecycle.
 * Stage transitions are driven by CRM events — assessment.completed,
 * discovery.scheduled, proposal.sent, etc.
 */
export type CrmPipelineStage =
  | 'new'                    // Assessment submitted — not yet reviewed
  | 'qualified'              // Reviewed — matches Velkor engagement criteria
  | 'assessment_completed'   // Operational assessment reviewed internally
  | 'discovery_scheduled'    // Technical discovery call booked
  | 'proposal_sent'          // Implementation proposal delivered
  | 'negotiation'            // Scope/commercial in discussion
  | 'closed_won'             // Engagement confirmed, project active
  | 'closed_lost'            // No engagement — reason documented
  | 'nurture'                // Long-term evaluation — reactivation pipeline

/** Legacy alias — retained for backward compatibility with Strapi schema */
export type CrmLifecycleStage =
  | 'new' | 'contacted' | 'qualified' | 'proposal'
  | 'negotiation' | 'won' | 'lost' | 'nurture'

export type WorkflowOwner =
  | 'senior-engineer'
  | 'solutions-architect'
  | 'compliance-specialist'
  | 'account-executive'
  | 'account-development'
  | 'principal'

export type NurtureStage =
  | 'none'
  | 'assessment-follow-up'
  | 'evidence-share'
  | 'proposal-follow-up'
  | 'reactivation'

export type OperationalPriority =
  | 'incident-response'
  | 'enterprise-risk'
  | 'governance-deadline'
  | 'modernization'
  | 'managed-roadmap'
  | 'nurture'

export type EscalationLevel = 'none' | 'owner' | 'principal' | 'executive'

export type EngagementAuditEventType =
  | 'lead-created'
  | 'stage-transition'
  | 'owner-assigned'
  | 'follow-up-scheduled'
  | 'stale-detected'
  | 'escalation-triggered'
  | 'nurture-updated'

export interface EngagementAuditEvent {
  type: EngagementAuditEventType
  at: string
  fromStage?: CrmPipelineStage
  toStage?: CrmPipelineStage
  owner?: WorkflowOwner
  actor?: string
  reason?: string
  note?: string
  tags?: string[]
}

export interface WorkflowTransitionInput {
  currentStage: CrmPipelineStage
  nextStage: CrmPipelineStage
  existingAuditTrail?: unknown
  owner?: WorkflowOwner
  actor?: string
  reason?: string
  now?: Date
}

// ─── Stage Definitions ────────────────────────────────────────────────────────

export interface PipelineStageDefinition {
  stage:         CrmPipelineStage
  label:         string
  description:   string
  /** Max hours in this stage before escalation */
  slaHours:      number
  /** What triggers exit from this stage */
  exitTriggers:  string[]
  /** What action is required upon entry */
  entryAction:   string
  /** Tags automatically applied when entering this stage */
  autoTags:      string[]
}

export const PIPELINE_STAGES: PipelineStageDefinition[] = [
  {
    stage:        'new',
    label:        'Nuevo',
    description:  'Lead recibido vía assessment. Pendiente de revisión interna.',
    slaHours:     4,
    exitTriggers: ['Internal review complete', 'Disqualified'],
    entryAction:  'Alert assigned engineer. Review assessment scores and workflow routing.',
    autoTags:     ['new-lead', 'assessment-received'],
  },
  {
    stage:        'qualified',
    label:        'Calificado',
    description:  'Revisado internamente. Perfil confirma alineación con servicios Velkor.',
    slaHours:     8,
    exitTriggers: ['First contact made', 'Discovery call scheduled'],
    entryAction:  'Send personalized technical follow-up based on assessment findings.',
    autoTags:     ['qualified'],
  },
  {
    stage:        'assessment_completed',
    label:        'Assessment Completado',
    description:  'Assessment operacional revisado. Hallazgos comunicados al prospecto.',
    slaHours:     24,
    exitTriggers: ['Discovery call booked', 'Proposal requested'],
    entryAction:  'Schedule assessment debrief call. Share findings summary.',
    autoTags:     ['assessment-reviewed'],
  },
  {
    stage:        'discovery_scheduled',
    label:        'Discovery Agendado',
    description:  'Llamada de discovery técnico programada. Preparar agenda y contexto.',
    slaHours:     48,
    exitTriggers: ['Discovery completed', 'Proposal initiated'],
    entryAction:  'Prepare discovery agenda from assessment data. Confirm meeting.',
    autoTags:     ['discovery-scheduled'],
  },
  {
    stage:        'proposal_sent',
    label:        'Propuesta Enviada',
    description:  'Propuesta de implementación entregada al prospecto.',
    slaHours:     72,
    exitTriggers: ['Proposal accepted', 'Revision requested', 'Declined'],
    entryAction:  'Send proposal. Schedule follow-up call within 48h.',
    autoTags:     ['proposal-sent'],
  },
  {
    stage:        'negotiation',
    label:        'Negociación',
    description:  'Alcance y condiciones comerciales en discusión activa.',
    slaHours:     120,
    exitTriggers: ['Agreement reached', 'Negotiations stalled'],
    entryAction:  'Assign account executive. Document open commercial points.',
    autoTags:     ['in-negotiation'],
  },
  {
    stage:        'closed_won',
    label:        'Cerrado Ganado',
    description:  'Proyecto confirmado. SOW firmado. Kickoff programado.',
    slaHours:     0,  // no SLA — active project
    exitTriggers: ['Project delivered', 'Upsell opportunity identified'],
    entryAction:  'Create project record. Schedule kickoff. Assign engineering team.',
    autoTags:     ['active-project', 'closed-won'],
  },
  {
    stage:        'closed_lost',
    label:        'Cerrado Perdido',
    description:  'No se cerró el proyecto. Motivo documentado.',
    slaHours:     0,
    exitTriggers: ['Re-engaged', 'Moved to nurture'],
    entryAction:  'Document loss reason. Evaluate for nurture pipeline.',
    autoTags:     ['closed-lost'],
  },
  {
    stage:        'nurture',
    label:        'Nurture',
    description:  'Prospecto en evaluación de largo plazo. Reactivación periódica.',
    slaHours:     720,  // 30 days before re-check
    exitTriggers: ['Reactivated', 'Disqualified permanently'],
    entryAction:  'Enroll in nurture sequence. Set 30-day reactivation reminder.',
    autoTags:     ['nurture-sequence', 'long-term-evaluation'],
  },
]

// ─── Follow-up Cadences ───────────────────────────────────────────────────────

export interface FollowUpCadence {
  name:        string
  trigger:     CrmPipelineStage
  touchpoints: FollowUpTouchpoint[]
}

export interface FollowUpTouchpoint {
  day:     number
  channel: 'email' | 'phone' | 'whatsapp' | 'async'
  action:  string
  owner:   'engineer' | 'account-executive' | 'automated'
}

export const FOLLOW_UP_CADENCES: FollowUpCadence[] = [
  {
    name:    'Critical Lead Cadence',
    trigger: 'new',
    touchpoints: [
      { day: 0,  channel: 'phone',     action: 'Llamada técnica urgente — revisar flags críticos', owner: 'engineer' },
      { day: 1,  channel: 'email',     action: 'Enviar resumen de hallazgos con propuesta de discovery', owner: 'engineer' },
      { day: 2,  channel: 'whatsapp',  action: 'Confirmar recepción y agendar discovery', owner: 'engineer' },
      { day: 4,  channel: 'phone',     action: 'Follow-up si no hay respuesta', owner: 'account-executive' },
    ],
  },
  {
    name:    'Standard Assessment Cadence',
    trigger: 'assessment_completed',
    touchpoints: [
      { day: 0,  channel: 'email',     action: 'Enviar resumen técnico personalizado con hallazgos', owner: 'engineer' },
      { day: 2,  channel: 'email',     action: 'Proponer fecha de llamada de discovery', owner: 'account-executive' },
      { day: 5,  channel: 'phone',     action: 'Llamada de seguimiento si no hubo respuesta', owner: 'engineer' },
      { day: 10, channel: 'async',     action: 'Enviar artículo técnico relevante al perfil del lead', owner: 'automated' },
    ],
  },
  {
    name:    'Proposal Follow-up Cadence',
    trigger: 'proposal_sent',
    touchpoints: [
      { day: 1,  channel: 'email',     action: 'Confirmar recepción de propuesta. Ofrecer sesión de Q&A', owner: 'account-executive' },
      { day: 3,  channel: 'phone',     action: 'Llamada para resolver dudas técnicas o comerciales', owner: 'engineer' },
      { day: 7,  channel: 'email',     action: 'Enviar caso de estudio relevante como referencia', owner: 'account-executive' },
      { day: 14, channel: 'phone',     action: 'Llamada de decisión — confirmar timeline del prospecto', owner: 'account-executive' },
    ],
  },
  {
    name:    'Nurture Reactivation Cadence',
    trigger: 'nurture',
    touchpoints: [
      { day: 0,   channel: 'email',    action: 'Enviar contenido técnico relevante al segmento', owner: 'automated' },
      { day: 30,  channel: 'email',    action: 'Artículo de blog técnico + resumen de framework', owner: 'automated' },
      { day: 60,  channel: 'email',    action: 'Invitación a re-evaluación si el entorno cambió', owner: 'account-executive' },
      { day: 90,  channel: 'phone',    action: 'Llamada de reactivación — preguntar por cambios', owner: 'account-executive' },
    ],
  },
]

// ─── Escalation Rules ─────────────────────────────────────────────────────────

export interface EscalationRule {
  condition:   string
  fromStage:   CrmPipelineStage
  action:      string
  alertLevel:  'critical' | 'high' | 'normal'
}

export const ESCALATION_RULES: EscalationRule[] = [
  {
    condition:  'No response after 4h in new stage with critical priority',
    fromStage:  'new',
    action:     'Escalate to senior engineer. Alert on Slack/Teams channel.',
    alertLevel: 'critical',
  },
  {
    condition:  'No response after 24h in qualified stage',
    fromStage:  'qualified',
    action:     'Reassign to account executive. Add to manual follow-up queue.',
    alertLevel: 'high',
  },
  {
    condition:  'Proposal open > 14 days without response',
    fromStage:  'proposal_sent',
    action:     'Schedule decision call. Prepare revised scope if needed.',
    alertLevel: 'high',
  },
  {
    condition:  'Enterprise lead stalled in any stage > SLA',
    fromStage:  'negotiation',
    action:     'Escalate to principal. Review commercial terms.',
    alertLevel: 'high',
  },
]

// ─── Workflow type (unchanged) ────────────────────────────────────────────────

export interface CrmWorkflow {
  workflow:           'immediate-review' | 'governance-workflow' | 'roadmap-workflow' | 'nurture-sequence'
  slaHours:           number
  assignmentHint:     string
  ownerRole:          WorkflowOwner
  firstAction:        string
  tags:               string[]
  internalAlertLevel: 'critical' | 'high' | 'normal' | 'low'
  operationalPriority: OperationalPriority
  nurtureStage:       NurtureStage
  escalationLevel:    EscalationLevel
  escalationAfterHours:number
}

// ─── Size enum mapping ────────────────────────────────────────────────────────

const SIZE_ENUM: Record<string, string> = {
  '1-25':   'size_1_10',
  '26-100': 'size_11_50',
  '101-500':'size_51_200',
  '500+':   'size_200_plus',
}

function addHours(date: Date, hours: number): string {
  return new Date(date.getTime() + hours * 60 * 60 * 1000).toISOString()
}

function normalizeAuditTrail(value: unknown): EngagementAuditEvent[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is EngagementAuditEvent => {
    if (typeof item !== 'object' || item === null) return false
    const event = item as Partial<EngagementAuditEvent>
    return typeof event.type === 'string' && typeof event.at === 'string'
  })
}

export function buildEngagementAuditEvent(event: Omit<EngagementAuditEvent, 'at'> & { at?: string | Date }): EngagementAuditEvent {
  const at = event.at instanceof Date
    ? event.at.toISOString()
    : event.at ?? new Date().toISOString()

  return {
    type: event.type,
    at,
    fromStage: event.fromStage,
    toStage: event.toStage,
    owner: event.owner,
    actor: event.actor,
    reason: event.reason,
    note: event.note,
    tags: event.tags,
  }
}

export function transitionLifecycleStage(input: WorkflowTransitionInput): Record<string, unknown> {
  const now = input.now ?? new Date()
  const nextDefinition = PIPELINE_STAGES.find(stage => stage.stage === input.nextStage)
  const auditTrail = normalizeAuditTrail(input.existingAuditTrail)
  const transition = buildEngagementAuditEvent({
    type: 'stage-transition',
    at: now,
    fromStage: input.currentStage,
    toStage: input.nextStage,
    owner: input.owner,
    actor: input.actor,
    reason: input.reason ?? nextDefinition?.entryAction,
    tags: nextDefinition?.autoTags,
  })

  return {
    lifecycleStage: input.nextStage,
    lastInteractionAt: now.toISOString(),
    nextFollowUpAt: nextDefinition?.slaHours ? addHours(now, nextDefinition.slaHours) : undefined,
    staleAt: nextDefinition?.slaHours ? addHours(now, nextDefinition.slaHours * 2) : undefined,
    owner: input.owner,
    tags: nextDefinition?.autoTags,
    engagementAuditTrail: [...auditTrail, transition],
  }
}

function determineWorkflowOwner(classification: LeadClassification, scores: ScoreResult): WorkflowOwner {
  if (scores.criticalCount > 0 || classification.priority === 'critical') return 'senior-engineer'
  if (classification.segment === 'Enterprise') return 'principal'
  if (classification.engagementType === 'Compliance-Driven') return 'compliance-specialist'
  if (classification.engagementType === 'Modernization' || classification.engagementType === 'Managed Services') return 'solutions-architect'
  if (classification.priority === 'low') return 'account-development'
  return 'account-executive'
}

function determineOperationalPriority(classification: LeadClassification, scores: ScoreResult): OperationalPriority {
  if (scores.criticalCount > 0 || classification.priority === 'critical') return 'incident-response'
  if (classification.segment === 'Enterprise' || classification.priority === 'high') return 'enterprise-risk'
  if (classification.engagementType === 'Compliance-Driven') return 'governance-deadline'
  if (classification.engagementType === 'Modernization') return 'modernization'
  if (classification.engagementType === 'Managed Services') return 'managed-roadmap'
  return 'nurture'
}

function determineNurtureStage(classification: LeadClassification): NurtureStage {
  if (classification.priority === 'low' || classification.followUpChannel === 'async-proposal') return 'reactivation'
  if (classification.engagementType === 'Compliance-Driven') return 'evidence-share'
  return 'assessment-follow-up'
}

function determineEscalationLevel(classification: LeadClassification, scores: ScoreResult): EscalationLevel {
  if (scores.criticalCount > 0 || classification.priority === 'critical') return 'executive'
  if (classification.segment === 'Enterprise' || classification.priority === 'high') return 'principal'
  if (classification.engagementType === 'Compliance-Driven') return 'owner'
  return 'none'
}

export function buildFollowUpReminder(workflow: CrmWorkflow, now = new Date()) {
  return {
    nextFollowUpAt: addHours(now, Math.max(1, workflow.slaHours)),
    staleAt:        addHours(now, Math.max(2, workflow.escalationAfterHours)),
    owner:          workflow.ownerRole,
    escalationLevel: workflow.escalationLevel,
  }
}

export function isLeadStale(
  lifecycleStage: CrmPipelineStage,
  lastInteractionAt: string | Date,
  now = new Date()
): boolean {
  const stage = PIPELINE_STAGES.find(s => s.stage === lifecycleStage)
  if (!stage?.slaHours) return false
  const lastInteraction = typeof lastInteractionAt === 'string'
    ? new Date(lastInteractionAt)
    : lastInteractionAt
  return now.getTime() - lastInteraction.getTime() > stage.slaHours * 60 * 60 * 1000
}

function buildGovernanceSignals(answers: AssessmentAnswers, scores: ScoreResult, classification: LeadClassification) {
  const compliance = [
    ...(answers.step4.compliance ?? []),
    ...(answers.step5.complianceNeeds ?? []),
  ].filter(item => item && item !== 'none')

  return {
    compliance,
    changeManagement: answers.step4.changeManagement,
    documentation: answers.step4.documentation,
    monitoring: answers.step4.monitoring,
    privilegedAccess: answers.step3.privilegedAccess,
    identityScore: scores.identity,
    operationsScore: scores.operations,
    engagementType: classification.engagementType,
  }
}

function buildRelatedArtifacts(answers: AssessmentAnswers, classification: LeadClassification) {
  const artifacts = [
    { type: 'assessment-report', label: 'Operational assessment report' },
  ]

  if (classification.engagementType === 'Compliance-Driven' || answers.step4.compliance?.some(item => item !== 'none')) {
    artifacts.push({ type: 'evidence', label: 'Governance evidence brief' })
  }
  if (answers.step3.intune !== 'full' || answers.step3.conditionalAccess !== 'configured') {
    artifacts.push({ type: 'framework', label: 'Identity governance rollout framework' })
  }
  if (answers.step2.vlanSegmentation !== 'yes' || answers.step2.firewall !== 'ngfw') {
    artifacts.push({ type: 'case-study', label: 'Network segmentation case study' })
  }

  return artifacts
}

// ─── Workflow assignment ──────────────────────────────────────────────────────

export function assignWorkflow(
  classification: LeadClassification,
  scores: ScoreResult
): CrmWorkflow {
  const { priority, segment, engagementType } = classification
  const ownerRole = determineWorkflowOwner(classification, scores)
  const operationalPriority = determineOperationalPriority(classification, scores)
  const nurtureStage = determineNurtureStage(classification)
  const escalationLevel = determineEscalationLevel(classification, scores)

  // Critical priority — immediate response, 4h SLA
  if (priority === 'critical') {
    return {
      workflow:           'immediate-review',
      slaHours:           4,
      assignmentHint:     'Assign to senior engineer',
      ownerRole,
      firstAction:        'Schedule technical call within 4h',
      tags:               ['critical-priority', 'immediate-review', `flags-${scores.criticalCount}-critical`],
      internalAlertLevel: 'critical',
      operationalPriority,
      nurtureStage:       'none',
      escalationLevel,
      escalationAfterHours: 4,
    }
  }

  // Enterprise segment or high priority — same-day review, 8h SLA
  if (segment === 'Enterprise' || priority === 'high') {
    return {
      workflow:           'immediate-review',
      slaHours:           8,
      assignmentHint:     'Assign to senior engineer',
      ownerRole,
      firstAction:        'Schedule technical call within 8h',
      tags:               ['high-priority', 'immediate-review', segment.toLowerCase()],
      internalAlertLevel: 'high',
      operationalPriority,
      nurtureStage,
      escalationLevel,
      escalationAfterHours: 12,
    }
  }

  // Compliance-driven engagements — governance workflow, 24h SLA
  if (engagementType === 'Compliance-Driven') {
    return {
      workflow:           'governance-workflow',
      slaHours:           24,
      assignmentHint:     'Assign to compliance specialist',
      ownerRole,
      firstAction:        'Send compliance requirements questionnaire within 24h',
      tags:               ['compliance-driven', 'governance-workflow', 'regulatory'],
      internalAlertLevel: 'normal',
      operationalPriority,
      nurtureStage,
      escalationLevel,
      escalationAfterHours: 36,
    }
  }

  // Modernization or Managed Services — roadmap workflow, 48h SLA
  if (engagementType === 'Modernization' || engagementType === 'Managed Services') {
    return {
      workflow:           'roadmap-workflow',
      slaHours:           48,
      assignmentHint:     'Assign to solutions architect',
      ownerRole,
      firstAction:        'Prepare modernization roadmap proposal within 48h',
      tags:               ['roadmap-workflow', engagementType.toLowerCase().replace(/ /g, '-')],
      internalAlertLevel: 'normal',
      operationalPriority,
      nurtureStage,
      escalationLevel,
      escalationAfterHours: 72,
    }
  }

  // Evaluating urgency (low priority / async-proposal channel) — nurture sequence, 72h SLA
  if (classification.priority === 'low' || classification.followUpChannel === 'async-proposal') {
    return {
      workflow:           'nurture-sequence',
      slaHours:           72,
      assignmentHint:     'Assign to account development',
      ownerRole,
      firstAction:        'Enroll in nurture email sequence within 72h',
      tags:               ['nurture-sequence', 'low-urgency', 'evaluating'],
      internalAlertLevel: 'low',
      operationalPriority,
      nurtureStage:       'reactivation',
      escalationLevel:    'none',
      escalationAfterHours: 720,
    }
  }

  // Default fallback — immediate review, 24h SLA, normal alert
  return {
    workflow:           'immediate-review',
    slaHours:           24,
    assignmentHint:     'Assign to account executive',
    ownerRole,
    firstAction:        'Send technical assessment summary and next-steps within 24h',
    tags:               ['standard', 'immediate-review'],
    internalAlertLevel: 'normal',
    operationalPriority,
    nurtureStage,
    escalationLevel,
    escalationAfterHours: 48,
  }
}

// ─── Notes block builder ─────────────────────────────────────────────────────

export function buildAssessmentNotesBlock(
  answers:        AssessmentAnswers,
  scores:         ScoreResult,
  classification: LeadClassification,
  reportRef:      string
): string {
  const topFindings = scores.flags
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 3)
    .map(f => `[${f.severity.toUpperCase()}] ${f.finding}`)
    .join('\n')

  const workflow = assignWorkflow(classification, scores)

  const lines: string[] = [
    `[EVALUACIÓN OPERACIONAL v2 · ${reportRef}]`,
    `Madurez: ${scores.maturityLabel} (${scores.overall}/100) · Exposición: ${scores.exposureLabel}`,
    `Infra: ${scores.infrastructure} · Identidad: ${scores.identity} · Ops: ${scores.operations}`,
    `Hallazgos: ${scores.criticalCount} críticos · ${scores.highCount} altos (${scores.flags.length} total)`,
    `Segmento: ${classification.segment} · ${classification.engagementLabel}`,
    `Workflow: ${workflow.workflow} · SLA: ${workflow.slaHours}h · Prioridad: ${classification.priorityLabel}`,
    `Owner: ${workflow.ownerRole} · Escalacion: ${workflow.escalationLevel} · Prioridad operativa: ${workflow.operationalPriority}`,
    '',
    topFindings,
  ]

  if (answers.step5.notes) {
    lines.push('', `Nota: ${answers.step5.notes}`)
  }

  return lines.join('\n').trim()
}

// ─── Strapi lead payload builder ─────────────────────────────────────────────

export function buildStrapiLeadPayload(
  answers:        AssessmentAnswers,
  scores:         ScoreResult,
  classification: LeadClassification,
  workflow:       CrmWorkflow,
  reportRef:      string
): Record<string, unknown> {
  const notes = buildAssessmentNotesBlock(answers, scores, classification, reportRef)
  const now = new Date()
  const reminder = buildFollowUpReminder(workflow, now)
  const engagementAuditTrail = [
    buildEngagementAuditEvent({
      type: 'lead-created',
      at: now,
      toStage: 'new',
      owner: workflow.ownerRole,
      reason: 'Assessment submitted and routed through CRM workflow assignment.',
      tags: workflow.tags,
    }),
    buildEngagementAuditEvent({
      type: 'follow-up-scheduled',
      at: now,
      toStage: 'new',
      owner: workflow.ownerRole,
      reason: `${workflow.firstAction} SLA ${workflow.slaHours}h.`,
      tags: [workflow.workflow, workflow.operationalPriority],
    }),
  ]

  return {
    // Contact
    name:        answers.name,
    email:       answers.email,
    company:     answers.company,
    phone:       answers.phone || undefined,

    // Company profile
    companySize: SIZE_ENUM[answers.step1.companySize] ?? 'size_1_10',

    // Engagement
    services:    [classification.engagementType],
    urgency:     (answers.step5.urgency === 'critical' || answers.step5.urgency === 'urgent')
                   ? 'high'
                   : 'normal',

    // Lifecycle
    status:       'new' satisfies CrmLifecycleStage,

    // CRM routing
    workflow:     workflow.workflow,
    slaHours:     workflow.slaHours,
    alertLevel:   workflow.internalAlertLevel,
    owner:        workflow.ownerRole,
    lifecycleStage: 'new',
    nurtureStage: workflow.nurtureStage,
    operationalPriority: workflow.operationalPriority,
    escalationLevel: workflow.escalationLevel,
    nextFollowUpAt: reminder.nextFollowUpAt,
    staleAt: reminder.staleAt,
    lastInteractionAt: now.toISOString(),
    governanceSignals: buildGovernanceSignals(answers, scores, classification),
    relatedArtifacts: buildRelatedArtifacts(answers, classification),
    engagementAuditTrail,
    tags:         [...(classification.crmTags ?? []), ...workflow.tags],

    // Source tracking
    source:       `assessment-v2-${answers.source || 'direct'}`,
    utm:          answers.utm || undefined,
    reportRef,

    // Assessment notes (structured text block)
    notes,

    // Scores (for CRM reporting)
    scoreOverall:        scores.overall,
    scoreInfrastructure: scores.infrastructure,
    scoreIdentity:       scores.identity,
    scoreOperations:     scores.operations,
    maturityLevel:       scores.maturity,
    exposureLevel:       scores.exposureLevel,
    criticalFlagsCount:  scores.criticalCount,
    highFlagsCount:      scores.highCount,

    // Classification
    segment:         classification.segment,
    engagementType:  classification.engagementType,
    priority:        classification.priority,
    estimatedScope:  classification.estimatedScope,
    internalNote:    classification.internalNote,
    followUpChannel: classification.followUpChannel,
    followUpHours:   classification.followUpHours,
  }
}

export interface DirectLeadPayloadInput {
  name: string
  email: string
  company: string
  phone?: string
  services?: string[]
  notes?: string
  source: string
  workflow?: CrmWorkflow['workflow']
  owner?: WorkflowOwner
  nurtureStage?: NurtureStage
  operationalPriority?: OperationalPriority
}

export function buildDirectLeadPayload(input: DirectLeadPayloadInput): Record<string, unknown> {
  const now = new Date()
  const workflow = input.workflow ?? (input.source.startsWith('recurso-') ? 'nurture-sequence' : 'roadmap-workflow')
  const owner = input.owner ?? (workflow === 'nurture-sequence' ? 'account-development' : 'account-executive')
  const slaHours = workflow === 'nurture-sequence' ? 72 : 24
  const escalationAfterHours = workflow === 'nurture-sequence' ? 720 : 48
  const nurtureStage = input.nurtureStage ?? (workflow === 'nurture-sequence' ? 'evidence-share' : 'assessment-follow-up')
  const operationalPriority = input.operationalPriority ?? (workflow === 'nurture-sequence' ? 'nurture' : 'managed-roadmap')
  const engagementAuditTrail = [
    buildEngagementAuditEvent({
      type: 'lead-created',
      at: now,
      toStage: 'new',
      owner,
      reason: `Direct lead created from ${input.source}.`,
      tags: [input.source, workflow],
    }),
    buildEngagementAuditEvent({
      type: 'follow-up-scheduled',
      at: now,
      toStage: 'new',
      owner,
      reason: `Initial follow-up scheduled in ${slaHours}h.`,
      tags: [workflow, operationalPriority],
    }),
  ]

  return {
    name: input.name,
    email: input.email,
    company: input.company,
    phone: input.phone || undefined,
    services: input.services ?? [],
    notes: input.notes || undefined,
    urgency: 'normal',
    status: 'new',
    source: input.source,
    workflow,
    slaHours,
    alertLevel: 'normal',
    owner,
    lifecycleStage: 'new',
    nurtureStage,
    operationalPriority,
    escalationLevel: workflow === 'nurture-sequence' ? 'none' : 'owner',
    nextFollowUpAt: addHours(now, slaHours),
    staleAt: addHours(now, escalationAfterHours),
    lastInteractionAt: now.toISOString(),
    tags: [
      input.source,
      workflow,
      ...(input.services ?? []).map(service => `service-${service.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`),
    ],
    relatedArtifacts: input.source.startsWith('recurso-')
      ? [{ type: 'resource', label: input.source.replace('recurso-', '') }]
      : [],
    engagementAuditTrail,
  }
}
