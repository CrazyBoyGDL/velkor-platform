'use client'

import type { CSSProperties } from 'react'
import { useOperationalActivity } from '@/lib/motion/operationalMotion'

const W = 560
const H = 400
const CX = W / 2
const CY = H / 2

const R_HUB = 20
const R_RING_INNER = 62
const R_RING_MID = 120
const R_RING_OUTER = 184
const R1 = 90
const R2 = 152
const R_HEX1 = 13
const R_HEX2 = 10

function polar(deg: number, r: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [+(CX + r * Math.cos(a)).toFixed(2), +(CY + r * Math.sin(a)).toFixed(2)]
}

function hexPts(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}

function outerArc(ax: number, ay: number, bx: number, by: number): string {
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const dx = mx - CX
  const dy = my - CY
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const qx = +(mx + (dx / len) * 24).toFixed(2)
  const qy = +(my + (dy / len) * 24).toFixed(2)
  return `M ${ax} ${ay} Q ${qx} ${qy} ${bx} ${by}`
}

function delayStyle(index: number, step = 0.38, offset = 0.22): CSSProperties {
  return { '--signal-delay': `${(offset + index * step).toFixed(2)}s` } as CSSProperties
}

const INNER_NODES = [
  { deg: -82, color: '#4878b0', label: 'NGFW', detail: 'FortiGate · Hardened', dx: 0, dy: -34, anchor: 'middle' as const },
  { deg: -18, color: '#4878b0', label: 'NETWORK', detail: 'VLAN · Segmentación', dx: 28, dy: -6, anchor: 'start' as const },
  { deg: 42, color: '#3a7858', label: 'IDENTITY', detail: 'Entra ID · SSO', dx: 28, dy: -6, anchor: 'start' as const },
  { deg: 102, color: '#3a7858', label: 'ENDPOINT', detail: 'Intune · Autopilot', dx: 0, dy: 34, anchor: 'middle' as const },
  { deg: 162, color: '#4878b0', label: 'M365', detail: 'Exchange · Teams', dx: -28, dy: -6, anchor: 'end' as const },
  { deg: 222, color: '#3d88a5', label: 'CCTV', detail: 'Axis · NVR · IA', dx: -28, dy: -6, anchor: 'end' as const },
] as const

const OUTER_NODES = [
  { deg: -52, color: '#475569', label: 'WAN', detail: 'Edge · ISP', dx: 0, dy: -26, anchor: 'middle' as const },
  { deg: 14, color: '#3a7858', label: 'FIDO2', detail: 'MFA · Hardware', dx: 24, dy: -4, anchor: 'start' as const },
  { deg: 178, color: '#64748b', label: 'AUDIT', detail: 'Log · SIEM', dx: -24, dy: -4, anchor: 'end' as const },
] as const

const CROSS_LINKS = [
  { from: 0, to: 1, color: '#4878b0', label: 'Policy·L3' },
  { from: 2, to: 3, color: '#3a7858', label: 'MDM Sync' },
  { from: 4, to: 2, color: '#4878b0', label: 'Auth·SSO' },
] as const

const FOCUS_ROUTES = [
  { deg: -82, color: '#5aa7e8', bend: -24 },
  { deg: -18, color: '#5aa7e8', bend: 18 },
  { deg: 42, color: '#31b98b', bend: 28 },
  { deg: 102, color: '#31b98b', bend: -22 },
] as const

export default function InfraTopology() {
  const { ref, active, reducedMotion } = useOperationalActivity<HTMLDivElement>(0.08)
  const isActive = active && !reducedMotion

  return (
    <div
      ref={ref}
      className={`infra-topology select-none w-full${isActive ? ' infra-topology--active' : ''}`}
      role="img"
      aria-label="Diagrama de arquitectura de infraestructura IT gestionada por Velkor"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <circle cx={CX} cy={CY} r={R_RING_OUTER} stroke="rgba(56,100,160,0.12)" strokeWidth={0.7} strokeDasharray="1.5 8" />
        <circle cx={CX} cy={CY} r={R_RING_MID} stroke="rgba(56,100,160,0.16)" strokeWidth={0.85} strokeDasharray="2 7" />
        <circle cx={CX} cy={CY} r={R_RING_INNER} stroke="rgba(56,100,160,0.09)" strokeWidth={0.58} strokeDasharray="1 8" />
        <circle className="infra-topology-core-orbit" cx={CX} cy={CY} r={R_RING_MID} stroke="rgba(127,158,180,0.24)" strokeWidth={0.82} strokeDasharray="2 11" fill="none" />
        <path
          className="infra-topology-current"
          d={`M ${CX - 96} ${CY + 24} C ${CX - 38} ${CY - 54}, ${CX + 38} ${CY + 58}, ${CX + 106} ${CY - 22}`}
          stroke="rgba(159,195,212,0.30)"
          strokeWidth={1.25}
          strokeDasharray="4 18"
          fill="none"
        />
        <circle className="infra-topology-signal-ring" cx={CX} cy={CY} r={28} stroke="rgba(159,195,212,0.34)" strokeWidth={1} fill="none" />

        {INNER_NODES.map(({ deg, color }) => {
          const [rx, ry] = polar(deg, R_RING_OUTER)
          return <circle key={`rim-${deg}`} cx={rx} cy={ry} r={1.8} fill={color} fillOpacity={0.42} />
        })}

        {FOCUS_ROUTES.map(({ deg, color, bend }, i) => {
          const [nx, ny] = polar(deg, R1)
          const mx = (CX + nx) / 2
          const my = (CY + ny) / 2
          const path = `M ${CX} ${CY} Q ${+(mx + bend).toFixed(2)} ${+(my - Math.abs(bend) * 0.18).toFixed(2)} ${nx} ${ny}`
          return (
            <path
              key={`focus-route-${deg}`}
              className="infra-topology-focus-route"
              d={path}
              stroke={color}
              strokeWidth={1.65}
              strokeLinecap="round"
              strokeDasharray="6 18"
              fill="none"
              style={delayStyle(i, 0.38, 0.32)}
            />
          )
        })}

        {INNER_NODES.map(({ deg, color }, i) => {
          const [nx, ny] = polar(deg, R1)
          return (
            <g key={`spoke1-${deg}`}>
              <line x1={CX} y1={CY} x2={nx} y2={ny} stroke={color} strokeWidth={0.7} strokeOpacity={0.16} />
              <line
                className="infra-topology-spoke-flow"
                x1={CX}
                y1={CY}
                x2={nx}
                y2={ny}
                stroke={color}
                strokeWidth={1.42}
                strokeDasharray="3 11"
                strokeDashoffset={14}
                style={delayStyle(i)}
              />
            </g>
          )
        })}

        {OUTER_NODES.map(({ deg, color }, i) => {
          const [nx, ny] = polar(deg, R2)
          return (
            <g key={`spoke2-${deg}`}>
              <line x1={CX} y1={CY} x2={nx} y2={ny} stroke={color} strokeWidth={0.58} strokeOpacity={0.10} />
              <line
                className="infra-topology-spoke-flow infra-topology-spoke-flow--outer"
                x1={CX}
                y1={CY}
                x2={nx}
                y2={ny}
                stroke={color}
                strokeWidth={1}
                strokeDasharray="2 12"
                strokeDashoffset={20}
                style={delayStyle(i, 0.55, 0.55)}
              />
            </g>
          )
        })}

        {CROSS_LINKS.map(({ from, to, color, label }, i) => {
          const [ax, ay] = polar(INNER_NODES[from].deg, R1)
          const [bx, by] = polar(INNER_NODES[to].deg, R1)
          const path = outerArc(ax, ay, bx, by)
          const mx = (ax + bx) / 2
          const my = (ay + by) / 2
          const dx = mx - CX
          const dy = my - CY
          const dlen = Math.sqrt(dx * dx + dy * dy) || 1
          const lx = +(mx + (dx / dlen) * 16).toFixed(1)
          const ly = +(my + (dy / dlen) * 16).toFixed(1)
          return (
            <g key={`cross-${i}`}>
              <path
                className="infra-topology-cross-flow"
                d={path}
                stroke={color}
                strokeWidth={0.95}
                strokeOpacity={0.38}
                strokeDasharray="2 5"
                fill="none"
                style={delayStyle(i, 0.9, 0.6)}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                fontSize={5.5}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fill={color}
                fillOpacity={0.44}
                letterSpacing="0.04em"
              >
                {label}
              </text>
            </g>
          )
        })}

        {INNER_NODES.map(({ deg, color, label, detail, dx, dy, anchor }, i) => {
          const [nx, ny] = polar(deg, R1)
          const lx = nx + dx
          const ly = ny + dy
          return (
            <g key={`n1-${deg}`} className="infra-topology-node" style={delayStyle(i, 0.38, 0.94)}>
              <circle className="infra-topology-node-halo" cx={nx} cy={ny} r={18} fill={color} fillOpacity={0.032} />
              <circle className="infra-topology-node-ring" cx={nx} cy={ny} r={R_HEX1 + 8} stroke={color} strokeWidth={0.9} fill="none" />
              <circle cx={nx} cy={ny} r={21} fill={color} fillOpacity={0.065} />
              <polygon points={hexPts(nx, ny, R_HEX1)} stroke={color} strokeWidth={1.08} strokeOpacity={0.66} fill={color} fillOpacity={0.095} />
              <circle className="infra-topology-node-dot" cx={nx} cy={ny} r={2.5} fill={color} />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                fontSize={8}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fontWeight="700"
                fill="rgba(228,228,231,0.88)"
                letterSpacing="0.10em"
              >
                {label}
              </text>
              <text
                x={lx}
                y={ly + 11}
                textAnchor={anchor}
                fontSize={6.5}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fill="rgba(148,163,184,0.62)"
                letterSpacing="0.03em"
              >
                {detail}
              </text>
            </g>
          )
        })}

        {OUTER_NODES.map(({ deg, color, label, detail, dx, dy, anchor }, i) => {
          const [nx, ny] = polar(deg, R2)
          const lx = nx + dx
          const ly = ny + dy
          return (
            <g key={`n2-${deg}`} className="infra-topology-node infra-topology-node--outer" style={delayStyle(i, 0.55, 1.2)}>
              <circle className="infra-topology-node-halo" cx={nx} cy={ny} r={16} fill={color} fillOpacity={0.04} />
              <polygon points={hexPts(nx, ny, R_HEX2)} stroke={color} strokeWidth={0.85} strokeOpacity={0.44} fill={color} fillOpacity={0.06} />
              <circle className="infra-topology-node-dot" cx={nx} cy={ny} r={2} fill={color} fillOpacity={0.66} />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                fontSize={7}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fontWeight="700"
                fill="rgba(228,228,231,0.64)"
                letterSpacing="0.08em"
              >
                {label}
              </text>
              <text
                x={lx}
                y={ly + 10}
                textAnchor={anchor}
                fontSize={5.5}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fill="rgba(148,163,184,0.46)"
                letterSpacing="0.03em"
              >
                {detail}
              </text>
            </g>
          )
        })}

        <g className="infra-topology-hub">
          <circle className="infra-topology-hub-glow" cx={CX} cy={CY} r={38} fill="rgba(100,116,139,0.075)" />
          <circle className="infra-topology-hub-ring" cx={CX} cy={CY} r={48} stroke="rgba(159,195,212,0.30)" strokeWidth={0.95} strokeDasharray="1 9" fill="none" />
          <polygon points={hexPts(CX, CY, R_HUB + 8)} stroke="rgba(148,163,184,0.24)" strokeWidth={0.82} strokeDasharray="2 4" fill="none" />
          <polygon points={hexPts(CX, CY, R_HUB)} stroke="rgba(203,213,225,0.66)" strokeWidth={1.32} fill="rgba(148,163,184,0.080)" />
          <polygon points={hexPts(CX, CY, 10)} stroke="rgba(159,195,212,0.32)" strokeWidth={0.78} fill="rgba(100,116,139,0.05)" />
          <text x={CX} y={CY - 2} textAnchor="middle" fontSize={7} fontFamily="'JetBrains Mono', 'Fira Code', monospace" fontWeight="700" fill="rgba(241,245,249,0.94)" letterSpacing="0.14em">
            VELKOR
          </text>
          <text x={CX} y={CY + 9} textAnchor="middle" fontSize={5.5} fontFamily="'JetBrains Mono', 'Fira Code', monospace" fill="rgba(148,163,184,0.60)" letterSpacing="0.10em">
            PLATFORM
          </text>
        </g>
      </svg>
    </div>
  )
}
