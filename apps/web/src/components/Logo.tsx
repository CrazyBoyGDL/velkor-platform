'use client'

import {
  type BrandMotionState,
  brandMotionClass,
  brandMotionCss,
} from '@/lib/motion/brandMotion'

interface LogoProps {
  className?: string
  animated?: boolean
  state?: BrandMotionState
  variant?: 'dark' | 'light'
  title?: string
}

export default function Logo({
  className = 'w-10 h-10',
  animated = true,
  state = 'monitoring',
  title = 'Velkor Systems logo',
}: LogoProps) {
  const rootClass = [
    className,
    'velkor-brand-symbol',
    animated ? brandMotionClass(state) : '',
  ].filter(Boolean).join(' ')

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={rootClass}
      role="img"
      aria-label={title}
    >
      {animated && <style>{brandMotionCss}</style>}
      <g className="velkor-brand-rig" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M14 12H50"
          stroke="var(--brand-route-muted, #445f75)"
          strokeWidth="2.4"
          opacity=".62"
          className="velkor-brand-route"
          style={animated ? { animationDelay: '0s' } : undefined}
        />
        <path
          d="M14 12 23 34 32 52"
          stroke="var(--brand-route, #7f9eb4)"
          strokeWidth="3.3"
          className="velkor-brand-route"
          style={animated ? { animationDelay: '0.06s' } : undefined}
        />
        <path
          d="M50 12 41 34 32 52"
          stroke="var(--brand-route, #7f9eb4)"
          strokeWidth="3.3"
          className="velkor-brand-route"
          style={animated ? { animationDelay: '0.12s' } : undefined}
        />
        <path
          d="M23 34H41"
          stroke="var(--brand-route-muted, #445f75)"
          strokeWidth="2.3"
          opacity=".68"
          className="velkor-brand-route"
          style={animated ? { animationDelay: '0.18s' } : undefined}
        />
        <path
          d="M32 20V52"
          stroke="var(--brand-route-muted, #445f75)"
          strokeWidth="2.2"
          opacity=".62"
          className="velkor-brand-route"
          style={animated ? { animationDelay: '0.24s' } : undefined}
        />
        <path
          d="M32 20 23 34M32 20 41 34"
          stroke="var(--brand-route, #7f9eb4)"
          strokeWidth="2.4"
          opacity=".82"
          className="velkor-brand-route"
          style={animated ? { animationDelay: '0.30s' } : undefined}
        />

        <path
          d="M14 12 23 34 32 52"
          stroke="var(--brand-route-flow, #9fc3d4)"
          strokeWidth="1.25"
          className="velkor-brand-flow"
        />
        <path
          d="M50 12 41 34 32 52"
          stroke="var(--brand-route-flow, #9fc3d4)"
          strokeWidth="1.25"
          className="velkor-brand-flow"
          style={animated ? { animationDelay: '1.15s' } : undefined}
        />

        <path
          d="M20.5 27.5 23 34 28.5 31.5"
          stroke="var(--brand-critical, #b88748)"
          strokeWidth="1.55"
          opacity=".76"
          className="velkor-brand-arrow"
        />
        <path
          d="M43.5 27.5 41 34 35.5 31.5"
          stroke="var(--brand-critical, #b88748)"
          strokeWidth="1.55"
          opacity=".76"
          className="velkor-brand-arrow"
        />
        <path
          d="M28.8 43.8 32 52 35.2 43.8"
          stroke="var(--brand-critical, #b88748)"
          strokeWidth="1.55"
          opacity=".72"
          className="velkor-brand-arrow"
        />

        {[
          [10.5, 8.5, 7, 7, 0],
          [46.5, 8.5, 7, 7, 0.25],
          [20, 31, 6, 6, 0.5],
          [38, 31, 6, 6, 0.75],
          [29, 49, 6, 6, 1],
        ].map(([x, y, w, h, delay]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={w}
            height={h}
            rx="1.8"
            fill="var(--brand-node, #7f9eb4)"
            className="velkor-brand-node"
            style={animated ? { animationDelay: `${delay}s` } : undefined}
          />
        ))}

        <circle
          cx="32"
          cy="20"
          r="7.4"
          stroke="var(--brand-core, #9fc3d4)"
          strokeWidth="2"
          opacity=".72"
          className="velkor-brand-core-ring"
        />
        <circle
          cx="32"
          cy="20"
          r="3.1"
          fill="var(--brand-core, #9fc3d4)"
          className="velkor-brand-core"
        />
        <path
          d="M25.5 20h-4.8M43.3 20h-4.8"
          stroke="var(--brand-critical, #b88748)"
          strokeWidth="1.5"
          opacity=".72"
        />
        <path
          d="M18 45h28"
          stroke="var(--brand-route-muted, #445f75)"
          strokeWidth="1.4"
          opacity=".34"
        />
        <path
          d="M13 38H51"
          stroke="var(--brand-route-flow, #9fc3d4)"
          strokeWidth="1.1"
          opacity=".18"
          className="velkor-brand-scan"
        />
      </g>
    </svg>
  )
}
