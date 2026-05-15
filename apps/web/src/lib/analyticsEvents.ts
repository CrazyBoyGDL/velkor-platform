// ─── Velkor Analytics Event Catalog ──────────────────────────────────────────
// Typed event definitions for behavioral intelligence.
// Compatible with Plausible (custom events) and PostHog (capture calls).
//
// Usage:
//   import { trackEvent }          from '@/components/Analytics'
//   import { Events }              from '@/lib/analyticsEvents'
//
//   trackEvent(Events.AssessmentStepCompleted, { step: '3', field_count: '6' })

// ─── Assessment Funnel ────────────────────────────────────────────────────────

export const Events = {
  // Assessment lifecycle
  AssessmentStarted:         'Assessment Started',
  AssessmentStepCompleted:   'Assessment Step Completed',
  AssessmentStepAbandoned:   'Assessment Step Abandoned',
  AssessmentSubmitted:       'Assessment Submitted',
  AssessmentCompleted:       'Assessment Completed',       // After scores return
  AssessmentError:           'Assessment Error',

  // Assessment results
  AssessmentPdfOpened:       'Assessment PDF Opened',
  AssessmentPdfDownloaded:   'Assessment PDF Downloaded',
  AssessmentResultsViewed:   'Assessment Results Viewed',
  AssessmentReportRefCopied: 'Assessment Report Ref Copied',

  // Content engagement
  BlogArticleViewed:         'Blog Article Viewed',
  BlogScrollDepth:           'Scroll Depth',              // shared with existing
  EvidenceLibraryViewed:     'Evidence Library Viewed',
  EvidenceDocumentClicked:   'Evidence Document Clicked',
  EvidenceInteraction:       'Evidence Interaction',
  EvidenceDiagramViewed:     'Evidence Diagram Viewed',
  EvidenceDepthReached:      'Evidence Depth Reached',
  CaseStudyViewed:           'Case Study Viewed',
  CaseStudyDepthReached:     'Case Study Depth Reached',  // 50% / 100% scroll
  CaseStudyEngagement:       'Case Study Engagement',
  OperationalFrameworkViewed:'Operational Framework Viewed',
  FrameworkStageExpanded:    'Framework Stage Expanded',
  ArtifactDownloaded:        'Artifact Downloaded',
  TrustSignalInteraction:    'Trust Signal Interaction',
  EngagementExpectationViewed:'Engagement Expectation Viewed',

  // CTA engagement
  CtaClicked:                'CTA Click',                 // shared with existing
  AssessmentCtaClicked:      'Assessment CTA Clicked',
  ContactCtaClicked:         'Contact CTA Clicked',
  ProposalCtaClicked:        'Proposal CTA Clicked',

  // Navigation
  NavLinkClicked:            'Nav Link Clicked',
  FooterLinkClicked:         'Footer Link Clicked',

  // Conversion signals
  ContactFormStarted:        'Contact Form Started',
  ContactFormSubmitted:      'Contact Form Submitted',
  ResourceLeadSubmitted:     'Resource Lead Submitted',
  ConversionPathUpdated:     'Conversion Path Updated',

  // Device behavior
  MobileAssessmentStarted:   'Mobile Assessment Started',
  MobileTrustEngagement:     'Mobile Trust Engagement',
  DiagramScrolled:           'Diagram Scrolled',           // arch diagram mobile scroll
  DeviceBehaviorDetected:    'Device Behavior Detected',
  SessionReplayReady:        'Session Replay Ready',

  // Source tracking
  UtmSourceDetected:         'UTM Source Detected',
  LeadSourceAttributed:      'Lead Source Attributed',
} as const

export type EventName = typeof Events[keyof typeof Events]

// ─── Event Property Schemas ───────────────────────────────────────────────────
// Document expected props for each event — used as reference by engineers.
// Plausible and PostHog both accept string/number props.

export interface AssessmentStepCompletedProps {
  step:        string     // '1' through '5'
  step_name:   string     // 'Contexto', 'Infraestructura', etc.
  field_count: string     // Number of fields filled
  time_spent:  string     // Seconds on step (approximate)
}

export interface AssessmentCompletedProps {
  score:    string | number
  maturity: string
  segment:  string
}

export interface BlogArticleViewedProps {
  slug:            string
  category:        string
  read_time:       string
  technical_level?: string
}

export interface EvidenceDocumentClickedProps {
  doc_title:  string
  category:   string
  status:     string   // 'sanitized' | 'reference' | 'template'
}

export interface EvidenceDepthReachedProps {
  source:   string
  depth:    string
  category?: string
}

export interface ArtifactDownloadedProps {
  artifact_title: string
  artifact_type:  string
  gated:          string
  source:         string
}

export interface CaseStudyEngagementProps {
  case_slug: string
  sector:    string
  depth:     string
}

export interface CaseStudyDepthReachedProps {
  case_slug: string
  sector:    string
  depth:     string
}

export interface CtaClickedProps {
  label:    string
  location: string   // 'hero' | 'blog-inline' | 'case-study' | 'assessment-results' | etc.
  source?:  string
}

export interface TrustSignalInteractionProps {
  signal:      string
  location:    string
  interaction: string   // 'view' | 'click' | 'expand' | 'request'
}

export interface MobileTrustEngagementProps {
  page:    string
  signal:  string
  quality: string
}

export interface SessionReplayReadyProps {
  page:     string
  provider: string
  enabled:  string
}

export interface AssessmentStepAbandonedProps {
  step:      string
  step_name: string
  reason?:   string   // 'navigation' | 'timeout' | 'error'
}

export interface LeadSourceAttributedProps {
  source:          string
  utm:             string
  conversion_path: string
}

export interface DeviceBehaviorDetectedProps {
  device:   'mobile' | 'tablet' | 'desktop'
  page:     string
  behavior: string
}

// ─── Step name map (used by assessment wizard) ────────────────────────────────

export const ASSESSMENT_STEP_NAMES: Record<number, string> = {
  1: 'Contexto empresarial',
  2: 'Infraestructura de red',
  3: 'Identidad y acceso',
  4: 'Operaciones y gobernanza',
  5: 'Objetivos y urgencia',
}

// ─── PostHog compatibility ────────────────────────────────────────────────────
// When PostHog is active (NEXT_PUBLIC_POSTHOG_KEY set), trackEvent() in
// Analytics.tsx routes to posthog.capture() automatically (see Analytics.tsx).
// All events in this catalog work identically for both providers.
