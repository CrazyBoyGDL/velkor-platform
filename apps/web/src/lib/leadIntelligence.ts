import type { DiagnosticResult, ExposureLevel } from './scoring'

const STORAGE_KEY = 'velkor:lead-intelligence'
const MAX_SIGNALS = 40

export type LeadSignalType =
  | 'diagnostic-started'
  | 'diagnostic-completed'
  | 'adaptive-cta-viewed'
  | 'adaptive-cta-clicked'
  | 'calculator-completed'
  | 'evidence-engaged'

export interface LeadInteractionSignal {
  type: LeadSignalType
  source: string
  weight: number
  service?: string
  urgency?: ExposureLevel
  maturity?: string
  intent?: string
}

export interface LeadIntentProfile {
  serviceInterest: Record<string, number>
  urgencyScore: number
  maturityEstimate: string
  lastIntent?: string
  signals: Array<LeadInteractionSignal & { at: string }>
}

function emptyProfile(): LeadIntentProfile {
  return {
    serviceInterest: {},
    urgencyScore: 0,
    maturityEstimate: 'unknown',
    signals: [],
  }
}

function readProfile(): LeadIntentProfile {
  if (typeof window === 'undefined') return emptyProfile()
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProfile()
    return { ...emptyProfile(), ...JSON.parse(raw) } as LeadIntentProfile
  } catch {
    return emptyProfile()
  }
}

function writeProfile(profile: LeadIntentProfile): void {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

function maturityFromScore(score: number): string {
  if (score < 30) return 'initial'
  if (score < 50) return 'developing'
  if (score < 72) return 'defined'
  if (score < 86) return 'managed'
  return 'optimized'
}

function exposureWeight(exposure: ExposureLevel): number {
  if (exposure === 'critical') return 9
  if (exposure === 'high') return 7
  if (exposure === 'medium') return 4
  return 1
}

export function recordLeadSignal(signal: LeadInteractionSignal): LeadIntentProfile {
  const profile = readProfile()
  const service = signal.service ?? 'general'

  profile.serviceInterest[service] = (profile.serviceInterest[service] ?? 0) + signal.weight
  profile.urgencyScore = Math.min(100, profile.urgencyScore + signal.weight)
  profile.maturityEstimate = signal.maturity ?? profile.maturityEstimate
  profile.lastIntent = signal.intent ?? profile.lastIntent
  profile.signals = [
    ...profile.signals,
    { ...signal, at: new Date().toISOString() },
  ].slice(-MAX_SIGNALS)

  writeProfile(profile)
  return profile
}

export function buildDiagnosticLeadSignal(result: DiagnosticResult): LeadInteractionSignal {
  return {
    type: 'diagnostic-completed',
    source: result.diagnosticId,
    weight: exposureWeight(result.exposureLevel),
    service: result.service,
    urgency: result.exposureLevel,
    maturity: maturityFromScore(result.score),
    intent: result.ctaIntent,
  }
}

export function getLeadIntentProfile(): LeadIntentProfile {
  return readProfile()
}
