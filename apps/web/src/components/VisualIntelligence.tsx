'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/components/Analytics'
import { Events } from '@/lib/analyticsEvents'

type StateItem = {
  label: string
  value: string
  tone?: 'stable' | 'watch' | 'active'
}

type TraceStep = {
  label: string
  detail: string
}

function deviceType(): string {
  if (typeof window === 'undefined') return 'unknown'
  if (window.innerWidth < 640) return 'mobile'
  if (window.innerWidth < 1024) return 'tablet'
  return 'desktop'
}

export function VisualIntelligenceTracker({ page }: { page?: string }) {
  const pathname = usePathname()
  const startedAt = useRef<number>(Date.now())
  const maxDepth = useRef<number>(0)
  const completed = useRef<boolean>(false)

  useEffect(() => {
    const pageId = page ?? pathname
    startedAt.current = Date.now()
    maxDepth.current = 0
    completed.current = false
    const firedDepth = new Set<number>()
    const seenVisuals = new WeakSet<Element>()

    trackEvent(Events.RouteEntered, { page: pageId, device: deviceType() })

    const depth = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      if (total <= 0) return 100
      return Math.max(0, Math.min(100, Math.round((el.scrollTop / total) * 100)))
    }

    const onScroll = () => {
      const currentDepth = depth()
      maxDepth.current = Math.max(maxDepth.current, currentDepth)
      for (const threshold of [25, 50, 75, 90]) {
        if (!firedDepth.has(threshold) && currentDepth >= threshold) {
          firedDepth.add(threshold)
          const seconds = Math.round((Date.now() - startedAt.current) / 1000)
          trackEvent(Events.ScrollPacing, {
            page: pageId,
            depth: `${threshold}%`,
            seconds,
            pace: seconds < threshold / 3 ? 'fast' : seconds > threshold ? 'deliberate' : 'steady',
          })
        }
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const node = entry.target as HTMLElement
          if (seenVisuals.has(node)) continue
          seenVisuals.add(node)
          trackEvent(Events.VisualEngagement, {
            page: pageId,
            visual_id: node.dataset.visualId ?? node.id ?? 'unknown',
            visual_kind: node.dataset.visualKind ?? 'unknown',
            device: deviceType(),
          })
        }
      },
      { threshold: 0.42 }
    )

    document.querySelectorAll<HTMLElement>('[data-visual-intelligence]').forEach(node => observer.observe(node))
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const mobileOverflowCheck = window.setTimeout(() => {
      if (window.innerWidth < 640 && document.documentElement.scrollWidth > window.innerWidth + 4) {
        trackEvent(Events.MobileFriction, {
          page: pageId,
          reason: 'horizontal-overflow',
          overflow_px: document.documentElement.scrollWidth - window.innerWidth,
        })
      }
    }, 1200)

    const complete = () => {
      if (completed.current) return
      completed.current = true
      trackEvent(Events.RouteCompletion, {
        page: pageId,
        max_depth: `${maxDepth.current}%`,
        seconds: Math.round((Date.now() - startedAt.current) / 1000),
        device: deviceType(),
      })
    }

    window.addEventListener('pagehide', complete)
    return () => {
      window.clearTimeout(mobileOverflowCheck)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', complete)
      observer.disconnect()
      complete()
    }
  }, [page, pathname])

  return null
}

export function SystemStateRail({ items }: { items: StateItem[] }) {
  return (
    <div className="visual-state-rail" data-visual-intelligence data-visual-kind="system-state" data-visual-id="system-state-rail">
      {items.map(item => (
        <div key={item.label} className={`visual-state-item visual-state-${item.tone ?? 'stable'}`}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}

export function TopologyFragment({
  title,
  caption,
  accent = '#638fa9',
}: {
  title: string
  caption: string
  accent?: string
}) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div
      className="topology-fragment"
      style={{ '--visual-accent': accent } as CSSProperties}
      data-visual-intelligence
      data-visual-kind="topology-fragment"
      data-visual-id={id}
    >
      <div className="visual-fragment-header">
        <span>Topology fragment</span>
        <strong>{title}</strong>
      </div>
      <svg viewBox="0 0 460 210" className="topology-fragment-map" role="img" aria-label={title}>
        <defs>
          <pattern id={`${id}-mesh`} width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke="currentColor" strokeOpacity="0.06" />
          </pattern>
        </defs>
        <rect x="1" y="1" width="458" height="208" rx="10" fill="rgba(255,255,255,0.012)" stroke="rgba(255,255,255,0.06)" />
        <rect x="1" y="1" width="458" height="208" rx="10" fill={`url(#${id}-mesh)`} />
        <path className="topology-fragment-route" d="M52 110H130L182 62H278L332 110H408" />
        <path className="topology-fragment-route topology-fragment-route-secondary" d="M130 110V158H296L332 110" />
        <path className="topology-fragment-route topology-fragment-route-secondary" d="M182 62V110H252V158" />
        {[
          ['WAN', 52, 110],
          ['NGFW', 130, 110],
          ['ID', 182, 62],
          ['CORE', 252, 110],
          ['APP', 332, 110],
          ['OPS', 408, 110],
          ['LOG', 252, 158],
        ].map(([label, x, y]) => (
          <g key={label}>
            <rect x={Number(x) - 28} y={Number(y) - 14} width="56" height="28" rx="6" />
            <text x={Number(x)} y={Number(y) + 4}>{label}</text>
          </g>
        ))}
      </svg>
      <p>{caption}</p>
    </div>
  )
}

export function GovernanceCallout({
  title,
  notes,
  accent = '#3f775c',
}: {
  title: string
  notes: string[]
  accent?: string
}) {
  return (
    <div
      className="governance-callout"
      style={{ '--visual-accent': accent } as CSSProperties}
      data-visual-intelligence
      data-visual-kind="governance-callout"
      data-visual-id={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
    >
      <div className="visual-fragment-header">
        <span>Governance overlay</span>
        <strong>{title}</strong>
      </div>
      <div className="governance-policy-stack">
        {notes.map((note, index) => (
          <div key={note} className="governance-policy-row">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ContinuityTrace({
  title,
  steps,
  accent = '#b88748',
}: {
  title: string
  steps: TraceStep[]
  accent?: string
}) {
  return (
    <div
      className="continuity-trace"
      style={{ '--visual-accent': accent } as CSSProperties}
      data-visual-intelligence
      data-visual-kind="continuity-trace"
      data-visual-id={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
    >
      <div className="visual-fragment-header">
        <span>Continuity trace</span>
        <strong>{title}</strong>
      </div>
      <div className="continuity-trace-steps">
        {steps.map(step => (
          <div key={step.label} className="continuity-trace-step">
            <span>{step.label}</span>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
