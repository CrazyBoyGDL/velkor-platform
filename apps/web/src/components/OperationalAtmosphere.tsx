'use client'

import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { rafThrottle } from '@/lib/motion/operationalMotion'
import { applyCinematicVars, CINEMATIC_TIMING, cinematicSeconds, getFocusProfile } from '@/lib/motion/operationalCinematics'

const ROUTES = [
  'M-80 260 C 170 210, 310 340, 520 285 S 870 150, 1110 220 S 1350 340, 1520 250',
  'M-120 640 C 110 720, 320 560, 560 625 S 900 760, 1160 650 S 1370 520, 1540 610',
  'M-40 960 C 220 860, 360 1010, 580 930 S 860 780, 1080 880 S 1320 1040, 1510 930',
] as const

const NODES = [
  { x: 10, y: 18, tone: 'monitoring' },
  { x: 32, y: 29, tone: 'low' },
  { x: 54, y: 22, tone: 'sync' },
  { x: 74, y: 35, tone: 'focus' },
  { x: 19, y: 58, tone: 'sync' },
  { x: 43, y: 66, tone: 'monitoring' },
  { x: 67, y: 56, tone: 'low' },
  { x: 88, y: 72, tone: 'focus' },
] as const

const SIGNAL_POINTS = [
  { x: 15, y: 27, tone: 'low' },
  { x: 26, y: 48, tone: 'sync' },
  { x: 39, y: 19, tone: 'monitoring' },
  { x: 52, y: 37, tone: 'focus' },
  { x: 61, y: 69, tone: 'low' },
  { x: 73, y: 24, tone: 'sync' },
  { x: 82, y: 54, tone: 'monitoring' },
  { x: 91, y: 76, tone: 'focus' },
  { x: 47, y: 83, tone: 'sync' },
  { x: 67, y: 12, tone: 'low' },
] as const

export default function OperationalAtmosphere() {
  const pathname = usePathname()
  const profile = useMemo(() => getFocusProfile(pathname), [pathname])
  const atmosphereStyle = useMemo(() => ({
    '--focus-core-x': profile.coreX,
    '--focus-core-y': profile.coreY,
    '--focus-rgb': profile.accentRgb,
    '--focus-secondary-rgb': profile.secondaryRgb,
    '--focus-energy': profile.energy.toFixed(2),
    '--focus-corridor-angle': profile.corridorAngle,
    '--cinematic-breath-duration': cinematicSeconds(CINEMATIC_TIMING.breath),
    '--cinematic-field-duration': cinematicSeconds(CINEMATIC_TIMING.fieldDrift),
    '--cinematic-mesh-duration': cinematicSeconds(CINEMATIC_TIMING.meshDrift),
    '--cinematic-route-duration': cinematicSeconds(CINEMATIC_TIMING.routePrimary),
    '--cinematic-cta-response': `${CINEMATIC_TIMING.ctaResponse}s`,
  } as CSSProperties), [profile])

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lastRegion = ''

    const setInitialLight = () => {
      root.style.setProperty('--cursor-x', `${Math.round(window.innerWidth * 0.62)}px`)
      root.style.setProperty('--cursor-y', `${Math.round(window.innerHeight * 0.30)}px`)
    }

    const setScrollState = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const depth = Math.max(0, Math.min(1, window.scrollY / scrollable))
      const region = depth < 0.18 ? 'low' : depth < 0.62 ? 'monitoring' : 'focus'
      const activity = window.innerWidth < 640 ? Math.min(depth * 0.55 + 0.22, 0.62) : Math.min(depth * 0.72 + 0.28, 1)

      root.style.setProperty('--atmo-scroll', depth.toFixed(3))
      root.style.setProperty('--atmo-activity', activity.toFixed(3))
      root.style.setProperty('--atmo-focus-y', `${Math.round(18 + depth * 64)}%`)
      root.style.setProperty('--atmo-drift-x', `${Math.round((depth - 0.5) * 28)}px`)
      root.style.setProperty('--atmo-drift-y', `${Math.round(depth * -18)}px`)

      if (region !== lastRegion) {
        root.dataset.atmoRegion = region
        lastRegion = region
      }
    }

    applyCinematicVars(root, profile)
    setInitialLight()
    setScrollState()

    if (media.matches) {
      root.dataset.atmoMotion = 'reduced'
      return undefined
    }

    root.dataset.atmoMotion = 'ambient'

    const onPointerMove = rafThrottle((event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${Math.round(event.clientX)}px`)
      root.style.setProperty('--cursor-y', `${Math.round(event.clientY)}px`)
    })
    const onScroll = rafThrottle(setScrollState)
    const onResize = rafThrottle(() => {
      setInitialLight()
      setScrollState()
    })

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setInitialLight()
        setScrollState()
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [profile])

  return (
    <div className="operational-atmosphere" data-focus-core={profile.id} style={atmosphereStyle} aria-hidden="true">
      <div className="operational-atmosphere__field" />
      <div className="operational-atmosphere__mesh" />
      <div className="operational-atmosphere__core" />
      <div className="operational-atmosphere__core-ring" />
      <div className="operational-atmosphere__focus-corridor" />
      <div className="operational-atmosphere__corridor operational-atmosphere__corridor--primary" />
      <div className="operational-atmosphere__corridor operational-atmosphere__corridor--secondary" />
      <svg className="operational-atmosphere__routes" viewBox="0 0 1440 1100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="atmo-route-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="42%" stopColor="currentColor" stopOpacity="0.24" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ROUTES.map((route, index) => (
          <path
            key={route}
            className={`operational-atmosphere__route operational-atmosphere__route--${index + 1}`}
            d={route}
            pathLength="1"
          />
        ))}
        {ROUTES.map((route, index) => (
          <path
            key={`signal-${route}`}
            className={`operational-atmosphere__route-signal operational-atmosphere__route-signal--${index + 1}`}
            d={route}
            pathLength="1"
          />
        ))}
      </svg>
      <div className="operational-atmosphere__nodes">
        {NODES.map((node, index) => (
          <span
            key={`${node.x}-${node.y}`}
            className={`operational-atmosphere__node operational-atmosphere__node--${node.tone}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              animationDelay: `${index * 0.47}s`,
            }}
          />
        ))}
      </div>
      <div className="operational-atmosphere__signal-field">
        {SIGNAL_POINTS.map((point, index) => (
          <span
            key={`${point.x}-${point.y}`}
            className={`operational-atmosphere__signal operational-atmosphere__signal--${point.tone}`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              animationDelay: `${index * -1.13}s`,
            }}
          />
        ))}
      </div>
      <div className="operational-atmosphere__telemetry">
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            style={{
              '--i': index,
              '--telemetry-width': `${34 + index * 7}px`,
              '--telemetry-duration': `${9 + index * 0.9}s`,
              '--telemetry-delay': `${index * -0.63}s`,
            } as CSSProperties}
          />
        ))}
      </div>
      <div className="operational-atmosphere__annotations">
        <span>rollback listo</span>
        <span>dueño confirmado</span>
        <span>ventana monitoreada</span>
      </div>
      <div className="operational-atmosphere__falloff" />
      <div className="operational-atmosphere__spine" />
    </div>
  )
}
