'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { trackCTA } from '@/components/Analytics'
import { rafThrottle } from '@/lib/motion/operationalMotion'

const HIDDEN_PREFIXES = ['/assessments', '/contacto', '/legal']

export default function MobileConsultiveCTA() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  const hidden = HIDDEN_PREFIXES.some(prefix => pathname.startsWith(prefix))

  useEffect(() => {
    if (hidden) {
      setVisible(false)
      return
    }

    const update = rafThrottle(() => setVisible(window.scrollY > 520))
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [hidden, pathname])

  if (hidden) return null

  return (
    <div className={`mobile-sticky-cta ${visible ? 'mobile-sticky-cta-visible' : ''}`}>
      <Link
        href="/assessments"
        className="mobile-sticky-cta-inner"
        onClick={() => trackCTA('Mobile sticky - Evaluación técnica', 'mobile-sticky')}
      >
        <span>
          <strong>Evaluación técnica</strong>
          <small>Alcance claro antes de tocar producción</small>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
