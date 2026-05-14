// ─── Velkor CRM Operations Layer ─────────────────────────────────────────────
// Phase 6: Lead lifecycle operations that extend the classification system.
// Provides workflow assignment, SLA routing, and Strapi payload construction.

import type { AssessmentAnswers, ScoreResult } from './scoring'
import type { LeadClassification }             from './classification'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CrmLifecycleStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'nurture'

export interface CrmWorkflow {
  workflow:           'immediate-review' | 'governance-workflow' | 'roadmap-workflow' | 'nurture-sequence'
  slaHours:           number
  assignmentHint:     string   // e.g. "Assign to senior engineer"
  firstAction:        string   // e.g. "Schedule technical call within 4h"
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
