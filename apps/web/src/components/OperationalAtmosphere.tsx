'use client'

import { useEffect } from 'react'
import { rafThrottle } from '@/lib/motion/operationalMotion'

export default function OperationalAtmosphere() {
  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const setInitialLight = () => {
      root.style.setProperty('--cursor-x', `${Math.round(window.innerWidth * 0.62)}px`)
      root.style.setProperty('--cursor-y', `${Math.round(window.innerHeight * 0.30)}px`)
    }

    setInitialLight()

    if (media.matches) return undefined

    const onPointerMove = rafThrottle((event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${Math.round(event.clientX)}px`)
      root.style.setProperty('--cursor-y', `${Math.round(event.clientY)}px`)
    })

    const onVisibility = () => {
      if (document.visibilityState === 'visible') setInitialLight()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="operational-atmosphere" aria-hidden="true">
      <div className="operational-atmosphere__mesh" />
      <div className="operational-atmosphere__falloff" />
      <div className="operational-atmosphere__spine" />
    </div>
  )
}
