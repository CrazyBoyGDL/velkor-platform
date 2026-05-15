// ─── Velkor Lead Classification Engine ─────────────────────────────────────
// Classifies leads by size, engagement type, priority, and recommended follow-up.

import type { AssessmentAnswers, ScoreResult } from './scoring'

export type LeadSegment =
  | 'SMB'
  | 'Mid-Market'
  | 'Enterprise'

export type EngagementType =
  | 'Security Remediation'
  | 'Compliance-Driven'
  | 'Identity Governance'
  | 'Infrastructure Refresh'
  | 'Modernization'
  | 'Managed Services'
  | 'Comprehensive Audit'

export type LeadPriority = 'critical' | 'high' | 'normal' | 'low'

export type FollowUpChannel = 'phone-call' | 'technical-email' | 'async-proposal'

export interface LeadClassification {
  segment:          LeadSegment
  engagementType:   EngagementType
  engagementLabel:  string
  priority:         LeadPriority
  priorityLabel:    string
  followUpChannel:  FollowUpChannel
  followUpLabel:    string
  followUpHours:    number         // SLA target in business hours
  internalNote:     string
  crmTags:          string[]
  estimatedScope:   string
}

// ─── Segment by company size ─────────────────────────────────────────────────

function getSegment(size: string): LeadSegment {
  if (size === '1-25')   return 'SMB'
  if (size === '26-100') return 'SMB'
  if (size === '101-500') return 'Mid-Market'
  return 'Enterprise'
}

// ─── Engagement type from answer patterns ────────────────────────────────────

function getEngagementType(a: AssessmentAnswers, scores: ScoreResult): EngagementType {
  const { step4: s4, step5: s5 } = a

  // Compliance-driven: has compliance requirements or regulatory pressure
  const hasCompliance = s4.compliance?.length > 0 && !s4.compliance.includes('none')
  const needsCompliance = s5.complianceNeeds?.length > 0 && !s5.complianceNeeds.includes('none')
  if (hasCompliance || needsCompliance) return 'Compliance-Driven'

  // Active incident
  if (s5.urgency === 'critical') return 'Security Remediation'

  // Identity-heavy gaps
  const identityFlags = scores.flags.filter(f =>
    f.category === 'Identidad' || f.category === 'Gobierno'
  ).length
  if (identityFlags >= 2 && scores.identity < 40) return 'Identity Governance'

  // Infrastructure-heavy gaps
  const infraFlags = scores.flags.filter(f =>
    f.category === 'Infraestructura' || f.category === 'Endpoint'
  ).length
  if (infraFlags >= 2 && scores.infrastructure < 40) return 'Infrastructure Refresh'

  // Cloud/M365 modernization
  if (a.step1.microsoft365 === 'partial' || a.step1.infrastructure === 'unformalized') {
    if (s5.projectGoals?.includes('modernize') || s5.painPoint === 'modernization')
      return 'Modernization'
  }

  // High overall score but ongoing support needs
  if (scores.overall >= 60) return 'Managed Services'

  // General audit for complex or unclear profiles
  return 'Comprehensive Audit'
}

// ─── Priority ────────────────────────────────────────────────────────────────

function getPriority(scores: ScoreResult, urgency: string): LeadPriority {
  if (scores.criticalCount > 0 || urgency === 'critical') return 'critical'
  if (scores.highCount >= 2   || urgency === 'urgent')    return 'high'
  if (scores.overall < 45)                                return 'high'
  if (urgency === 'evaluating')                           return 'low'
  return 'normal'
}

// ─── Follow-up channel ────────────────────────────────────────────────────────

function getFollowUp(
  priority: LeadPriority,
  segment: LeadSegment
): { channel: FollowUpChannel; label: string; hours: number } {
  if (priority === 'critical')
    return { channel: 'phone-call',    label: 'Llamada técnica urgente',         hours: 4  }
  if (priority === 'high' || segment === 'Enterprise')
    return { channel: 'phone-call',    label: 'Llamada técnica — mismo día',      hours: 8  }
  if (segment === 'Mid-Market')
    return { channel: 'technical-email', label: 'Email técnico + call scheduling', hours: 24 }
  return { channel: 'async-proposal', label: 'Propuesta técnica por escrito',    hours: 48 }
}

// ─── Internal note ────────────────────────────────────────────────────────────

function buildInternalNote(a: AssessmentAnswers, scores: ScoreResult, engagement: EngagementType): string {
  const parts: string[] = []

  parts.push(`[${engagement}] ${a.company} · ${a.step1.companySize} empleados · ${a.step1.industry}`)

  if (scores.criticalCount > 0)
    parts.push(`⚠ ${scores.criticalCount} hallazgo(s) CRÍTICO(s) — respuesta prioritaria`)

  if (a.step1.microsoft365 === 'full' && a.step3.mfa === 'none')
    parts.push('🎯 M365 activo sin MFA — oportunidad directa de proyecto Entra ID')

  if (a.step5.urgency === 'critical' || a.step5.urgency === 'urgent')
    parts.push(`⏱ Urgencia declarada: ${a.step5.urgency} — priorizar agenda`)

  if (a.step5.notes)
    parts.push(`Nota del prospecto: ${a.step5.notes.slice(0, 200)}`)

  return parts.join(' | ')
}

// ─── CRM tags ────────────────────────────────────────────────────────────────

function buildCrmTags(a: AssessmentAnswers, scores: ScoreResult, engagement: EngagementType): string[] {
  const tags: string[] = []

  tags.push(getSegment(a.step1.companySize).toLowerCase().replace(' ', '-'))
  tags.push(engagement.toLowerCase().replace(/ /g, '-'))
  tags.push(`industry-${a.step1.industry}`)
  tags.push(`urgency-${a.step5.urgency}`)
  tags.push(`maturity-${scores.maturity}`)
  tags.push(`score-${scores.overall}`)

  if (scores.criticalCount > 0) tags.push('has-critical-flags')
  if (a.step1.microsoft365 !== 'none') tags.push('m365-user')
  if (a.step3.entraId !== 'none') tags.push('entra-id-present')

  const compliance = a.step4.compliance?.filter(c => c !== 'none') ?? []
  compliance.forEach(c => tags.push(`compliance-${c}`))

  return tags
}

// ─── Estimated scope ─────────────────────────────────────────────────────────

function estimateScope(scores: ScoreResult, size: string): string {
  const flagCount = scores.flags.filter(f => f.severity === 'critical' || f.severity === 'high').length
  const isLarge = size === '101-500' || size === '500+'

  if (flagCount >= 3 && isLarge) return '3–6 meses · proyecto multi-fase'
  if (flagCount >= 3)            return '6–12 semanas · implementación por prioridades'
  if (flagCount >= 1 && isLarge) return '4–8 semanas · implementación focalizada'
  if (flagCount >= 1)            return '2–6 semanas · proyecto puntual'
  return '2–4 semanas · optimización o soporte'
}

// ─── Main classification ─────────────────────────────────────────────────────

export function classifyLead(
  a: AssessmentAnswers,
  scores: ScoreResult
): LeadClassification {
  const segment       = getSegment(a.step1.companySize)
  const engagementType = getEngagementType(a, scores)
  const priority      = getPriority(scores, a.step5.urgency)
  const follow        = getFollowUp(priority, segment)

  const PRIORITY_LABELS: Record<LeadPriority, string> = {
    critical: 'Crítico — respuesta inmediata',
    high:     'Alto — mismo día hábil',
    normal:   'Normal — 24 h hábiles',
    low:      'Exploratorio — 48 h',
  }

  const ENGAGEMENT_LABELS: Record<EngagementType, string> = {
    'Security Remediation':  'Remediación de Seguridad',
    'Compliance-Driven':     'Cumplimiento Normativo',
    'Identity Governance':   'Gobierno de Identidad',
    'Infrastructure Refresh':'Renovación de Infraestructura',
    'Modernization':         'Modernización Cloud',
    'Managed Services':      'Soporte y Servicios Continuos',
    'Comprehensive Audit':   'Auditoría Integral',
  }

  return {
    segment,
    engagementType,
    engagementLabel:  ENGAGEMENT_LABELS[engagementType],
    priority,
    priorityLabel:    PRIORITY_LABELS[priority],
    followUpChannel:  follow.channel,
    followUpLabel:    follow.label,
    followUpHours:    follow.hours,
    internalNote:     buildInternalNote(a, scores, engagementType),
    crmTags:          buildCrmTags(a, scores, engagementType),
    estimatedScope:   estimateScope(scores, a.step1.companySize),
  }
}
