'use client'
/**
 * Drop-in replacement for Next.js <Link> that fires a Plausible CTA-click event.
 * Use on high-value CTAs inside server components (service pages, blog, etc.).
 *
 * <TrackedLink href="/assessments" trackLabel="Ciberseguridad — CTA bottom" className="btn-amber">
 *   Solicitar diagnóstico →
 * </TrackedLink>
 */
import Link from 'next/link'
import { trackCTA } from './Analytics'
import type { ComponentPropsWithRef } from 'react'

type Props = ComponentPropsWithRef<typeof Link> & {
  trackLabel: string
  trackProps?: Record<string, string>
}

export default function TrackedLink({
  trackLabel,
  trackProps,
  onClick,
  children,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackCTA(trackLabel, trackProps)
        onClick?.(e)
      }}
    >
      {children}
    </Link>
  )
}
