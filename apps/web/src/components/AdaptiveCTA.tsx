'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { trackAdaptiveCTA, trackLeadIntelligenceSignal } from '@/components/Analytics'
import { getConsultiveCTA } from '@/lib/consultiveCta'
import { recordLeadSignal } from '@/lib/leadIntelligence'
import type { DiagnosticCtaIntent, ExposureLevel } from '@/lib/scoring'

type Props = {
  intent?: DiagnosticCtaIntent
  service?: string
  riskLevel?: ExposureLevel
  location: string
  className?: string
  compact?: boolean
}

export default function AdaptiveCTA({
  intent,
  service,
  riskLevel,
  location,
  className = '',
  compact = false,
}: Props) {
  const pathname = usePathname()
  const cta = useMemo(
    () => getConsultiveCTA({ intent, service, riskLevel, source: location, pathname }),
    [intent, location, pathname, riskLevel, service]
  )

  useEffect(() => {
    trackAdaptiveCTA(cta.intent, cta.label, location, 'view', {
      risk_level: riskLevel ?? 'unknown',
      service: cta.service,
    })
    recordLeadSignal({
      type: 'adaptive-cta-viewed',
      source: location,
      weight: 1,
      service: cta.service,
      urgency: riskLevel,
      intent: cta.intent,
    })
    trackLeadIntelligenceSignal('adaptive-cta-viewed', location, 1, {
      service: cta.service,
      urgency: riskLevel ?? 'unknown',
      intent: cta.intent,
    })
  }, [cta.intent, cta.label, cta.service, location, riskLevel])

  return (
    <Link
      href={cta.href}
      className={`adaptive-cta ${compact ? 'adaptive-cta-compact' : ''} ${className}`}
      onClick={() => {
        trackAdaptiveCTA(cta.intent, cta.label, location, 'click', {
          risk_level: riskLevel ?? 'unknown',
          service: cta.service,
        })
        recordLeadSignal({
          type: 'adaptive-cta-clicked',
          source: location,
          weight: riskLevel === 'critical' ? 6 : riskLevel === 'high' ? 4 : 2,
          service: cta.service,
          urgency: riskLevel,
          intent: cta.intent,
        })
        trackLeadIntelligenceSignal('adaptive-cta-clicked', location, riskLevel === 'critical' ? 6 : 3, {
          service: cta.service,
          urgency: riskLevel ?? 'unknown',
          intent: cta.intent,
        })
      }}
    >
      <span>
        <strong>{cta.label}</strong>
        {!compact && <small>{cta.supporting}</small>}
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  )
}
