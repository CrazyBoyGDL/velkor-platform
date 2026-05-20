'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { trackAdaptiveCTA, trackLeadIntelligenceSignal } from '@/components/Analytics'
import { getConsultiveContactTarget, getConsultiveCTA } from '@/lib/consultiveCta'
import { recordLeadSignal } from '@/lib/leadIntelligence'
import { rafThrottle } from '@/lib/motion/operationalMotion'

const HIDDEN_PREFIXES = ['/assessments', '/contacto', '/legal']

export default function MobileConsultiveCTA() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const cta = useMemo(
    () => getConsultiveCTA({ pathname, source: 'mobile-sticky' }),
    [pathname]
  )
  const contactTarget = useMemo(
    () => getConsultiveContactTarget('mobile-sticky'),
    []
  )

  const hidden = HIDDEN_PREFIXES.some(prefix => pathname.startsWith(prefix))

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('mobile-cta-mounted', !hidden)
    return () => html.classList.remove('mobile-cta-mounted')
  }, [hidden])

  useEffect(() => {
    if (hidden) {
      setVisible(false)
      return
    }

    const isReadingPrioritySection = () => {
      const avoidRegions = document.querySelectorAll<HTMLElement>('[data-mobile-sticky-avoid="true"]')
      return Array.from(avoidRegions).some(region => {
        const rect = region.getBoundingClientRect()
        return rect.top < window.innerHeight - 72 && rect.bottom > 88
      })
    }

    const update = rafThrottle(() => {
      setVisible(window.scrollY > 520 && !isReadingPrioritySection())
    })
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [hidden, pathname])

  if (hidden) return null

  const click = () => {
    trackAdaptiveCTA(cta.intent, cta.label, 'mobile-sticky', 'click', { service: cta.service })
    recordLeadSignal({
      type: 'adaptive-cta-clicked',
      source: 'mobile-sticky',
      weight: 3,
      service: cta.service,
      intent: cta.intent,
    })
    trackLeadIntelligenceSignal('adaptive-cta-clicked', 'mobile-sticky', 3, {
      service: cta.service,
      intent: cta.intent,
    })
  }

  const content = (
    <>
      <span>
        <strong>{contactTarget.label}</strong>
        <small>{contactTarget.supporting}</small>
      </span>
      <span aria-hidden="true">→</span>
    </>
  )

  return (
    <div className={`mobile-sticky-cta ${visible ? 'mobile-sticky-cta-visible' : ''}`}>
      {contactTarget.external ? (
        <a
          href={contactTarget.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-sticky-cta-inner"
          onClick={click}
        >
          {content}
        </a>
      ) : (
        <Link
          href={contactTarget.href}
          className="mobile-sticky-cta-inner"
          onClick={click}
        >
          {content}
        </Link>
      )}
    </div>
  )
}
