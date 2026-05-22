'use client'

import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { useLowPowerMotion } from '@/lib/motion/operationalMotion'
import { getFocusProfile, SPATIAL_HORIZON_BY_PROFILE } from '@/lib/motion/operationalCinematics'

const FIELD_ROUTES = [
  'M-80 330 C 180 286, 354 382, 560 336 S 862 246, 1070 322 S 1304 430, 1530 358',
  'M-120 590 C 170 548, 338 638, 566 592 S 846 474, 1076 534 S 1310 690, 1540 614',
  'M84 -80 C 92 170, 72 392, 96 604 S 122 916, 86 1220',
  'M-40 830 C 214 730, 424 848, 660 784 S 956 706, 1220 838 S 1400 930, 1515 872',
] as const

const FIELD_NODES = [
  { x: 16, y: 24 },
  { x: 34, y: 38 },
  { x: 56, y: 30 },
  { x: 73, y: 40 },
  { x: 43, y: 64 },
  { x: 86, y: 68 },
] as const

export default function SpatialFieldSystem() {
  const pathname = usePathname()
  const profile = useMemo(() => getFocusProfile(pathname), [pathname])
  const lowPowerMotion = useLowPowerMotion(true)
  const style = useMemo(() => ({
    '--spatial-core-x': profile.coreX,
    '--spatial-core-y': profile.coreY,
    '--spatial-accent-rgb': profile.accentRgb,
    '--spatial-secondary-rgb': profile.secondaryRgb,
    '--spatial-energy': profile.energy.toFixed(2),
    '--spatial-tilt': profile.corridorAngle,
    '--spatial-horizon-y': SPATIAL_HORIZON_BY_PROFILE[profile.id],
  } as CSSProperties), [profile])

  if (lowPowerMotion) return null

  return (
    <div className="spatial-field-system" data-spatial-field={profile.id} style={style} aria-hidden="true">
      <div className="spatial-field-system__backplane" />
      <div className="spatial-field-system__midplane" />
      <div className="spatial-field-system__horizon" />
      <svg className="spatial-field-system__routes" viewBox="0 0 1440 1180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="spatial-route-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="28%" stopColor="currentColor" stopOpacity="0.16" />
            <stop offset="58%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {FIELD_ROUTES.map((route, index) => (
          <path
            key={route}
            className={`spatial-field-system__route spatial-field-system__route--${index + 1}`}
            d={route}
            pathLength="1"
          />
        ))}
        {FIELD_ROUTES.map((route, index) => (
          <path
            key={`signal-${route}`}
            className={`spatial-field-system__signal spatial-field-system__signal--${index + 1}`}
            d={route}
            pathLength="1"
          />
        ))}
      </svg>
      <div className="spatial-field-system__nodes">
        {FIELD_NODES.map((node, index) => (
          <span
            key={`${node.x}-${node.y}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              animationDelay: `${index * -1.7}s`,
            }}
          />
        ))}
      </div>
      <div className="spatial-field-system__gravity spatial-field-system__gravity--primary" />
      <div className="spatial-field-system__gravity spatial-field-system__gravity--core" />
      <div className="spatial-field-system__falloff" />
    </div>
  )
}
