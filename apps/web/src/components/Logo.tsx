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
          d="M12 16H52"
          stroke="var(--brand-route-muted, #445f75)"
          strokeWidth="2.35"
          opacity=".58"
          className="velkor-brand-route velkor-brand-control-plane"
          style={animated ? { animationDelay: '0s' } : undefined}
        />
        <path
          d="M12 16 23 35 32 52"
          stroke="var(--brand-route, #7f9eb4)"
          strokeWidth="3.55"
          className="velkor-brand-route velkor-brand-primary-route"
          style={animated ? { animationDelay: '0.06s' } : undefined}
        />
        <path
          d="M52 16 41 35 32 52"
          stroke="var(--brand-route, #7f9eb4)"
          strokeWidth="3.55"
          className="velkor-brand-route velkor-brand-primary-route"
          style={animated ? { animationDelay: '0.12s' } : undefined}
        />
        <path
          d="M23 35H41"
          stroke="var(--brand-route-muted, #445f75)"
          strokeWidth="2.35"
          opacity=".72"
          className="velkor-brand-route"
          style={animated ? { animationDelay: '0.18s' } : undefined}
        />
        <path
          d="M32 24V52"
          stroke="var(--brand-route-muted, #445f75)"
          strokeWidth="2.15"
          opacity=".62"
          className="velkor-brand-route"
          style={animated ? { animationDelay: '0.24s' } : undefined}
        />
        <path
          d="M23 35 32 24 41 35"
          stroke="var(--brand-route, #7f9eb4)"
          strokeWidth="2.35"
          opacity=".84"
          className="velkor-brand-route velkor-brand-sync"
          style={animated ? { animationDelay: '0.30s' } : undefined}
        />
        <path
          d="M18 45C23.8 49 40.2 49 46 45"
          stroke="var(--brand-route-muted, #445f75)"
          strokeWidth="1.55"
          opacity=".42"
          className="velkor-brand-observe"
        />

        <path
          d="M12 16 23 35 32 52"
          stroke="var(--brand-route-flow, #9fc3d4)"
          strokeWidth="1.25"
          className="velkor-brand-flow"
        />
        <path
          d="M52 16 41 35 32 52"
          stroke="var(--brand-route-flow, #9fc3d4)"
          strokeWidth="1.25"
          className="velkor-brand-flow"
          style={animated ? { animationDelay: '1.15s' } : undefined}
        />

        <path
          d="M19.6 28.8 23 35 29.2 32.3"
          stroke="var(--brand-critical, #b88748)"
          strokeWidth="1.55"
          opacity=".78"
          className="velkor-brand-arrow"
        />
        <path
          d="M44.4 28.8 41 35 34.8 32.3"
          stroke="var(--brand-critical, #b88748)"
          strokeWidth="1.55"
          opacity=".78"
          className="velkor-brand-arrow"
        />
        <path
          d="M28.7 44.2 32 52 35.3 44.2"
          stroke="var(--brand-critical, #b88748)"
          strokeWidth="1.55"
          opacity=".72"
          className="velkor-brand-arrow"
        />
        <path
          d="M26.2 24H19.8M44.2 24H37.8"
          stroke="var(--brand-critical, #b88748)"
          strokeWidth="1.35"
          opacity=".62"
          className="velkor-brand-direction"
        />

        {[
          [8.8, 12.8, 7.2, 7.2, 0],
          [48, 12.8, 7.2, 7.2, 0.25],
          [19.8, 31.8, 6.4, 6.4, 0.5],
          [37.8, 31.8, 6.4, 6.4, 0.75],
          [28.8, 48.8, 6.4, 6.4, 1],
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
          cy="24"
          r="8.1"
          stroke="var(--brand-core, #9fc3d4)"
          strokeWidth="2"
          opacity=".74"
          className="velkor-brand-core-ring"
        />
        <circle
          cx="32"
          cy="24"
          r="3.25"
          fill="var(--brand-core, #9fc3d4)"
          className="velkor-brand-core"
        />
        <path
          d="M27.8 17.6C29.2 16.4 30.6 15.8 32 15.8C33.4 15.8 34.8 16.4 36.2 17.6"
          stroke="var(--brand-core, #9fc3d4)"
          strokeWidth="1.25"
          opacity=".55"
          className="velkor-brand-core-ring"
        />
        <path
          d="M13 41H51"
          stroke="var(--brand-route-flow, #9fc3d4)"
          strokeWidth="1.1"
          opacity=".18"
          className="velkor-brand-scan"
        />
      </g>
    </svg>
  )
}
