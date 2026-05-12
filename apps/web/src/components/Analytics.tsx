/**
 * Privacy-first analytics via Plausible.
 * Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable (e.g. "velkor.mx").
 * If unset, no tracking script is loaded — zero overhead.
 *
 * Usage:
 *   - Add <Analytics /> to root layout
 *   - Call trackEvent('EventName', { prop: 'value' }) from client code
 */
import Script from 'next/script'

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
  const p = (window as { plausible?: Function }).plausible
  if (typeof p === 'function') {
    p(event, { props })
  }
}
