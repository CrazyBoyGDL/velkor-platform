'use client'
/**
 * Privacy-first analytics via Plausible.
 * Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable (e.g. "velkor.mx").
 * If unset, no tracking script is loaded — zero overhead.
 *
 * Exports:
 *   Analytics      — Script tag, place in root layout
 *   trackEvent()   — Fire a named Plausible event (safe when Plausible not loaded)
 *   trackCTA()     — Convenience wrapper for CTA-click events
 *   useScrollDepth() — Hook: fires depth events at 25 / 50 / 75 / 90 %
 */
import Script from 'next/script'
import { useEffect } from 'react'

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

export function Analytics() {
  if (!DOMAIN) return null

  return (
    <Script
      defer
      data-domain={DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  )
}

/** Fire a Plausible custom event. Safe to call even if Plausible is not loaded. */
export function trackEvent(
  event: string,
  props?: Record<string, string | number>
): void {
  if (typeof window === 'undefined') return
  const p = (window as { plausible?: (e: string, o?: object) => void }).plausible
  if (typeof p === 'function') p(event, { props })
}

/**
 * Convenience wrapper: track a CTA button / link click.
 * @param label  Human-readable CTA label (e.g. "Hero — Solicitar diagnóstico")
 * @param extra  Optional additional Plausible props
 */
export function trackCTA(label: string, extra?: Record<string, string>): void {
  trackEvent('CTA Click', { label, ...extra })
}

/**
 * Hook: fires scroll-depth events at 25 %, 50 %, 75 %, 90 %.
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
      const el = document.documentElement
      const scrolled = el.scrollTop + el.clientHeight
      const total    = el.scrollHeight
      if (total <= el.clientHeight) return
      const pct = Math.round((scrolled / total) * 100)
      for (const t of THRESHOLDS) {
        if (!fired.has(t) && pct >= t) {
          fired.add(t)
          trackEvent('Scroll Depth', { page, depth: `${t}%` })
        }
      }
    }

    window.addEventListener('scroll', check, { passive: true })
    check() // run once on mount (catches short pages already scrolled)
    return () => window.removeEventListener('scroll', check)
  }, [page])
}
