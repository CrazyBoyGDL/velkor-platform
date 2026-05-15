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
  firstAction:        string
  tags:               string[]
  internalAlertLevel: 'critical' | 'high' | 'normal' | 'low'
}

// ─── Size enum mapping ────────────────────────────────────────────────────────

const SIZE_ENUM: Record<string, string> = {
  '1-25':   'size_1_10',
  '26-100': 'size_11_50',
  '101-500':'size_51_200',
  '500+':   'size_200_plus',
}

// ─── Workflow assignment ──────────────────────────────────────────────────────

export function assignWorkflow(
  classification: LeadClassification,
  scores: ScoreResult
): CrmWorkflow {
  const { priority, segment, engagementType } = classification

  // Critical priority — immediate response, 4h SLA
  if (priority === 'critical') {
    return {
      workflow:           'immediate-review',
      slaHours:           4,
      assignmentHint:     'Assign to senior engineer',
      firstAction:        'Schedule technical call within 4h',
      tags:               ['critical-priority', 'immediate-review', `flags-${scores.criticalCount}-critical`],
      internalAlertLevel: 'critical',
    }
  }

  // Enterprise segment or high priority — same-day review, 8h SLA
  if (segment === 'Enterprise' || priority === 'high') {
    return {
      workflow:           'immediate-review',
      slaHours:           8,
      assignmentHint:     'Assign to senior engineer',
      firstAction:        'Schedule technical call within 8h',
      tags:               ['high-priority', 'immediate-review', segment.toLowerCase()],
      internalAlertLevel: 'high',
    }
  }

  // Compliance-driven engagements — governance workflow, 24h SLA
  if (engagementType === 'Compliance-Driven') {
    return {
      workflow:           'governance-workflow',
      slaHours:           24,
      assignmentHint:     'Assign to compliance specialist',
      firstAction:        'Send compliance requirements questionnaire within 24h',
      tags:               ['compliance-driven', 'governance-workflow', 'regulatory'],
      internalAlertLevel: 'normal',
    }
  }

  // Modernization or Managed Services — roadmap workflow, 48h SLA
  if (engagementType === 'Modernization' || engagementType === 'Managed Services') {
    return {
      workflow:           'roadmap-workflow',
      slaHours:           48,
      assignmentHint:     'Assign to solutions architect',
      firstAction:        'Prepare modernization roadmap proposal within 48h',
      tags:               ['roadmap-workflow', engagementType.toLowerCase().replace(/ /g, '-')],
      internalAlertLevel: 'normal',
    }
  }

  // Evaluating urgency (low priority / async-proposal channel) — nurture sequence, 72h SLA
  if (classification.priority === 'low' || classification.followUpChannel === 'async-proposal') {
    return {
      workflow:           'nurture-sequence',
      slaHours:           72,
      assignmentHint:     'Assign to account development',
      firstAction:        'Enroll in nurture email sequence within 72h',
      tags:               ['nurture-sequence', 'low-urgency', 'evaluating'],
      internalAlertLevel: 'low',
    }
  }

  // Default fallback — immediate review, 24h SLA, normal alert
  return {
    workflow:           'immediate-review',
    slaHours:           24,
    assignmentHint:     'Assign to account executive',
    firstAction:        'Send technical assessment summary and next-steps within 24h',
    tags:               ['standard', 'immediate-review'],
    internalAlertLevel: 'normal',
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
