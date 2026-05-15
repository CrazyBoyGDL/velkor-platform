'use client'
/**
 * Velkor Analytics — privacy-first behavioral intelligence layer.
 *
 * Supports two providers (auto-selected by env vars):
 *   Plausible  — set NEXT_PUBLIC_PLAUSIBLE_DOMAIN (e.g. "velkor.mx")
 *   PostHog    — set NEXT_PUBLIC_POSTHOG_KEY + NEXT_PUBLIC_POSTHOG_HOST
 *
 * If neither env var is set: no script loaded, no tracking, zero overhead.
 * Both providers receive identical event names from analyticsEvents.ts.
 *
 * Exports:
 *   Analytics             — Script tags, place in root layout
 *   trackEvent()          — Fire a named event (Plausible or PostHog)
 *   trackCTA()            — Convenience wrapper for CTA-click events
 *   useScrollDepth()      — Hook: fires depth events at 25/50/75/90%
 *   useAssessmentStep()   — Hook: fires step-completed + step-abandoned events
 *   trackEvidenceClick()  — Fire evidence document click event
 *   trackDiagramView()    — Fire architecture diagram view event
 *   trackArticleView()    — Fire technical article view event
 *   useCaseStudyDepth()   — Hook: fires case-study depth thresholds
 */
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { ASSESSMENT_STEP_NAMES, Events, type EventName } from '@/lib/analyticsEvents'

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const POSTHOG_KEY      = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST     = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

// ─── Provider types ────────────────────────────────────────────────────────────

type AnalyticsProps = Record<string, string | number>
type PlausibleFn = (event: string, options?: { props?: AnalyticsProps }) => void
type PostHogFn   = { capture: (event: string, props?: AnalyticsProps) => void }

function getPlausible(): PlausibleFn | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as unknown as { plausible?: PlausibleFn }).plausible
}

function getPostHog(): PostHogFn | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as unknown as { posthog?: PostHogFn }).posthog
}

// ─── Analytics script tags ─────────────────────────────────────────────────────

export function Analytics() {
  return (
    <>
      {/* Plausible */}
      {PLAUSIBLE_DOMAIN && (
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}

      {/* PostHog — loaded only when key is set */}
      {POSTHOG_KEY && (
        <Script
          id="posthog-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${POSTHOG_KEY}', { api_host: '${POSTHOG_HOST}', autocapture: false, capture_pageview: true });
            `,
          }}
        />
      )}
    </>
  )
}

// ─── Core event dispatcher ─────────────────────────────────────────────────────

/**
 * Fire a named event to whichever analytics provider is active.
 * Safe to call when no provider is loaded — noop in that case.
 */
export function trackEvent(
  event: EventName | string,
  props?: AnalyticsProps
): void {
  if (typeof window === 'undefined') return

  // Plausible
  const plausible = getPlausible()
  if (typeof plausible === 'function') {
    plausible(event, props ? { props } : undefined)
  }

  // PostHog
  const posthog = getPostHog()
  if (posthog && typeof posthog.capture === 'function') {
    posthog.capture(event, props)
  }
}

/**
 * Convenience wrapper: track a CTA button/link click.
 * @param label    Human-readable CTA label (e.g. "Hero — Solicitar diagnóstico")
 * @param location Where on the page (e.g. "hero", "blog-inline", "results-screen")
 * @param extra    Optional additional props
 */
export function trackCTA(
  label:    string,
  location: string = 'unknown',
  extra?:   Record<string, string>
): void {
  trackEvent(Events.CtaClicked, { label, location, ...extra })
}

/**
 * Track an evidence document click in the evidence library.
 * @param docTitle  Title of the document
 * @param category  Document category
 * @param status    'sanitized' | 'reference' | 'template'
 */
export function trackEvidenceClick(
  docTitle:  string,
  category:  string,
  status:    string
): void {
  trackEvent(Events.EvidenceDocumentClicked, { doc_title: docTitle, category, status })
}

/**
 * Track an architecture diagram becoming visible (mobile scroll or page load).
 * @param diagramId  Identifier for the diagram (e.g. 'vlan-diagram', 'entra-id-flow')
 * @param context    Page context (e.g. 'evidence-library', 'case-study')
 */
export function trackDiagramView(diagramId: string, context: string): void {
  trackEvent(Events.EvidenceDiagramViewed, { diagram_id: diagramId, context })
}

export function trackDownload(
  artifactTitle: string,
  artifactType: string,
  source: string,
  gated = false
): void {
  trackEvent(Events.ArtifactDownloaded, {
    artifact_title: artifactTitle,
    artifact_type: artifactType,
    gated: String(gated),
    source,
  })
}

export function trackCaseStudyEngagement(caseSlug: string, sector: string, depth: string): void {
  trackEvent(Events.CaseStudyEngagement, { case_slug: caseSlug, sector, depth })
}

export function trackArticleView(
  slug: string,
  category: string,
  readTime: string,
  technicalLevel?: string
): void {
  trackEvent(Events.BlogArticleViewed, {
    slug,
    category,
    read_time: readTime || 'unknown',
    technical_level: technicalLevel ?? 'unspecified',
  })
}

export function trackLeadSourceAttribution(source: string, utm: string, conversionPath: string): void {
  trackEvent(Events.LeadSourceAttributed, {
    source: source || 'direct',
    utm: utm || 'none',
    conversion_path: conversionPath,
  })
}

export function trackDeviceBehavior(page: string, behavior: string): void {
  if (typeof window === 'undefined') return
  const width = window.innerWidth
  const device = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
  trackEvent(Events.DeviceBehaviorDetected, { page, behavior, device })
}

// ─── Scroll depth hook ─────────────────────────────────────────────────────────

/**
 * Hook: fires scroll-depth events at 25%, 50%, 75%, 90%.
 * Each threshold fires at most once per page mount.
 * Privacy-safe — no PII, no fingerprinting.
 *
 * @param page  Short page identifier used as event property
 */
export function useScrollDepth(page: string): void {
  useEffect(() => {
    const THRESHOLDS = [25, 50, 75, 90] as const
    const fired = new Set<number>()

    const check = () => {
      const el      = document.documentElement
      const scrolled = el.scrollTop + el.clientHeight
      const total    = el.scrollHeight
      if (total <= el.clientHeight) return
      const pct = Math.round((scrolled / total) * 100)
      for (const t of THRESHOLDS) {
        if (!fired.has(t) && pct >= t) {
          fired.add(t)
          trackEvent(Events.BlogScrollDepth, { page, depth: `${t}%` })
        }
      }
    }

    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [page])
}

export function useCaseStudyDepth(caseSlug: string, sector: string): void {
  useEffect(() => {
    const THRESHOLDS = [50, 90] as const
    const fired = new Set<number>()

    const check = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop + el.clientHeight
      const total = el.scrollHeight
      if (total <= el.clientHeight) return
      const pct = Math.round((scrolled / total) * 100)

      for (const threshold of THRESHOLDS) {
        if (!fired.has(threshold) && pct >= threshold) {
          fired.add(threshold)
          const depth = `${threshold}%`
          trackEvent(Events.CaseStudyDepthReached, { case_slug: caseSlug, sector, depth })
          trackCaseStudyEngagement(caseSlug, sector, depth)
        }
      }
    }

    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [caseSlug, sector])
}

// ─── Assessment step tracking hook ────────────────────────────────────────────

/**
 * Hook: tracks assessment step progression.
 * - Fires 'Assessment Step Completed' when step changes forward
 * - Fires 'Assessment Step Abandoned' when component unmounts mid-step
 * - Fires 'Assessment Started' on first step
 *
 * @param currentStep   Current wizard step (1–5)
 * @param status        Assessment status: 'idle' | 'loading' | 'done' | 'error'
 */
export function useAssessmentStep(currentStep: number, status: string): void {
  const prevStep   = useRef<number>(0)
  const startTime  = useRef<number>(Date.now())
  const stepStart  = useRef<number>(Date.now())
  const currentStepRef = useRef<number>(currentStep)
  const statusRef = useRef<string>(status)

  useEffect(() => {
    currentStepRef.current = currentStep
    statusRef.current = status
  }, [currentStep, status])

  useEffect(() => {
    if (currentStep === 1 && prevStep.current === 0) {
      trackEvent(Events.AssessmentStarted, {
        device: window.innerWidth < 640 ? 'mobile' : 'desktop',
      })
      if (window.innerWidth < 640) {
        trackEvent(Events.MobileAssessmentStarted, { page: 'assessment' })
      }
      startTime.current = Date.now()
    }

    if (currentStep > prevStep.current && prevStep.current > 0) {
      const timeSpent = Math.round((Date.now() - stepStart.current) / 1000)
      trackEvent(Events.AssessmentStepCompleted, {
        step:      String(prevStep.current),
        step_name: ASSESSMENT_STEP_NAMES[prevStep.current] ?? `Step ${prevStep.current}`,
        time_spent: String(timeSpent),
      })
    }

    stepStart.current  = Date.now()
    prevStep.current   = currentStep
  }, [currentStep])

  useEffect(() => {
    if (status === 'done') {
      trackEvent(Events.AssessmentResultsViewed, {
        total_time: String(Math.round((Date.now() - startTime.current) / 1000)),
      })
    }
  }, [status])

  useEffect(() => {
    return () => {
      if (statusRef.current === 'done') return
      const abandonedStep = currentStepRef.current
      trackEvent(Events.AssessmentStepAbandoned, {
        step: String(abandonedStep),
        step_name: ASSESSMENT_STEP_NAMES[abandonedStep] ?? `Step ${abandonedStep}`,
        reason: 'navigation',
      })
    }
  }, [])
}
