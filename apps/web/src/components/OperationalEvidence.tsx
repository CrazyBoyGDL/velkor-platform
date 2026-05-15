'use client'

import { motion } from 'framer-motion'
import { systemReveal, useOperationalActivity, useProximitySurface } from '@/lib/motion/operationalMotion'

export type EvidenceTone = 'network' | 'identity' | 'video' | 'risk' | 'neutral'

const TONE: Record<EvidenceTone, string> = {
  network: '#587694',
  identity: '#3f775c',
  video: '#638fa9',
  risk: '#a47135',
  neutral: '#748093',
}

export type ArchitectureNode = {
  id: string
  label: string
  x: number
  y: number
  tone?: EvidenceTone
}

export type ArchitectureLink = {
  from: string
  to: string
  label?: string
}

export function ArchitectureSnapshot({
  title,
  caption,
  nodes,
  links,
  accent = '#587694',
}: {
  title: string
  caption?: string
  nodes: ArchitectureNode[]
  links: ArchitectureLink[]
  accent?: string
}) {
  const { ref, active } = useOperationalActivity<HTMLDivElement>(0.18)
  const proximity = useProximitySurface<HTMLDivElement>()
  const byId = new Map(nodes.map(node => [node.id, node]))

  return (
    <motion.div
      ref={ref}
      {...proximity.handlers}
      {...systemReveal(0, 'center')}
      className="architecture-snapshot depth-2 proximity-surface"
    >
      <div className="visual-evidence-heading">
        <span>Architecture snapshot</span>
        <span style={{ color: accent }}>{title}</span>
      </div>
      <svg viewBox="0 0 360 190" className="w-full h-auto" role="img" aria-label={title}>
        <defs>
          <linearGradient id={`snap-${title.replace(/\W+/g, '-')}`} x1="0" x2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.05" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.22" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="358" height="188" rx="8" fill="rgba(255,255,255,0.014)" stroke="rgba(255,255,255,0.055)" />
        {links.map((link, index) => {
          const from = byId.get(link.from)
          const to = byId.get(link.to)
          if (!from || !to) return null

          return (
            <g key={`${link.from}-${link.to}`}>
              <motion.line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={accent}
                strokeOpacity="0.20"
                strokeWidth="1"
                strokeDasharray="4 7"
                strokeDashoffset={0}
                animate={active ? { strokeDashoffset: [0, -22] } : { strokeDashoffset: 0 }}
                transition={{ repeat: active ? Infinity : 0, duration: 5.4 + index * 0.6, ease: 'linear' }}
              />
              {link.label && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 6}
                  textAnchor="middle"
                  fontSize="7"
                  fill="rgba(148,163,184,0.48)"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {link.label}
                </text>
              )}
            </g>
          )
        })}
        {nodes.map((node, index) => {
          const color = TONE[node.tone ?? 'neutral']
          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.36, delay: index * 0.045 }}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="17"
                fill={color}
                fillOpacity={0.02}
                animate={active ? { fillOpacity: [0.035, 0.012, 0.035] } : { fillOpacity: 0.02 }}
                transition={{ repeat: active ? Infinity : 0, duration: 5.8 + index * 0.5, ease: 'easeInOut' }}
              />
              <rect x={node.x - 25} y={node.y - 12} width="50" height="24" rx="5" fill="rgba(5,9,16,0.72)" stroke={color} strokeOpacity="0.28" />
              <text
                x={node.x}
                y={node.y + 3}
                textAnchor="middle"
                fontSize="8"
                fill="rgba(226,232,240,0.72)"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
              >
                {node.label}
              </text>
            </motion.g>
          )
        })}
      </svg>
      {caption && <p className="visual-evidence-caption">{caption}</p>}
    </motion.div>
  )
}

export function DeploymentDiff({
  before,
  after,
  accent = '#587694',
}: {
  before: string[]
  after: string[]
  accent?: string
}) {
  const proximity = useProximitySurface<HTMLDivElement>()

  return (
    <motion.div {...proximity.handlers} {...systemReveal(0, 'right')} className="deployment-diff depth-1 proximity-surface">
      <div className="visual-evidence-heading">
        <span>Deployment diff</span>
        <span style={{ color: accent }}>antes / despues</span>
      </div>
      <div className="deployment-diff-grid">
        <div>
          <span className="diff-label">Antes</span>
          {before.map(item => (
            <p key={item} className="diff-row diff-before">{item}</p>
          ))}
        </div>
        <div>
          <span className="diff-label">Después</span>
          {after.map(item => (
            <p key={item} className="diff-row diff-after">{item}</p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function PolicyOverlay({
  title,
  policies,
  accent = '#3f775c',
}: {
  title: string
  policies: string[]
  accent?: string
}) {
  const proximity = useProximitySurface<HTMLDivElement>()

  return (
    <motion.div {...proximity.handlers} {...systemReveal(0, 'up')} className="policy-overlay depth-1 proximity-surface">
      <div className="visual-evidence-heading">
        <span>Policy overlay</span>
        <span style={{ color: accent }}>{title}</span>
      </div>
      <div className="policy-stack">
        {policies.map((policy, index) => (
          <div key={policy} className="policy-row">
            <span style={{ color: accent }}>{String(index + 1).padStart(2, '0')}</span>
            <p>{policy}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function AuditFragment({
  title,
  rows,
  accent = '#a47135',
}: {
  title: string
  rows: Array<{ label: string; value: string }>
  accent?: string
}) {
  const proximity = useProximitySurface<HTMLDivElement>()

  return (
    <motion.div {...proximity.handlers} {...systemReveal(0, 'left')} className="audit-fragment depth-1 proximity-surface">
      <div className="visual-evidence-heading">
        <span>Audit fragment</span>
        <span style={{ color: accent }}>{title}</span>
      </div>
      {rows.map(row => (
        <div key={row.label} className="audit-row">
          <span>{row.label}</span>
          <p>{row.value}</p>
        </div>
      ))}
    </motion.div>
  )
}

export function InfrastructureStatePanel({
  layer,
  objective,
  outcome,
  tags,
  accent = '#587694',
}: {
  layer: string
  objective: string
  outcome: string
  tags: string[]
  accent?: string
}) {
  const proximity = useProximitySurface<HTMLElement>()

  return (
    <motion.aside {...proximity.handlers} {...systemReveal(0, 'center')} className="infra-state-panel depth-1 proximity-surface">
      <div className="visual-evidence-heading">
        <span>Capa afectada</span>
        <span style={{ color: accent }}>{layer}</span>
      </div>
      <div className="infra-state-copy">
        <span>Objetivo operacional</span>
        <p>{objective}</p>
      </div>
      <div className="infra-state-copy">
        <span>Resultado esperado</span>
        <p>{outcome}</p>
      </div>
      <div className="infra-state-tags">
        {tags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </motion.aside>
  )
}
