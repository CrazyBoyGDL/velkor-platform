'use client'
import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion'

// ─── Canvas + geometry constants ──────────────────────────────────────────────
const W = 560, H = 400
const CX = W / 2, CY = H / 2      // hub center

// Hub
const R_HUB = 20                   // main hexagon circumradius

// Decorative depth rings (purely structural reference lines)
const R_RING_INNER  = 62           // inner zone boundary
const R_RING_MID    = 120          // mid zone boundary
const R_RING_OUTER  = 184          // outer zone boundary

// Node orbit radii
const R1 = 90                      // inner: core infrastructure nodes
const R2 = 152                     // outer: edge/cloud/audit nodes

// Node hexagon sizes
const R_HEX1 = 13                  // inner node hexagon
const R_HEX2 = 10                  // outer node hexagon

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Cartesian from polar, relative to hub center */
function polar(deg: number, r: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [+(CX + r * Math.cos(a)).toFixed(2), +(CY + r * Math.sin(a)).toFixed(2)]
}

/** SVG polygon points for a flat-top regular hexagon */
function hexPts(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}

/**
 * Quadratic bezier arc bending outward from hub center.
 * Creates a curved lateral connection between two nodes
 * that avoids routing through the hub.
 */
function outerArc(ax: number, ay: number, bx: number, by: number): string {
  const mx = (ax + bx) / 2, my = (ay + by) / 2
  const dx = mx - CX, dy = my - CY
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  // Control point: 24px outward from midpoint (away from hub)
  const qx = +(mx + (dx / len) * 24).toFixed(2)
  const qy = +(my + (dy / len) * 24).toFixed(2)
  return `M ${ax} ${ay} Q ${qx} ${qy} ${bx} ${by}`
}

// ─── Node definitions ─────────────────────────────────────────────────────────
// Asymmetric angles — deliberately NOT evenly spaced to feel organic/real
// Angles measured from +x axis (standard SVG/math convention)
const INNER_NODES = [
  // Security / network perimeter cluster (upper-left)
  { deg: -82, color: '#4878b0', label: 'NGFW',     detail: 'FortiGate · Hardened',  dx:  0,  dy: -34, anchor: 'middle' as const },
  { deg: -18, color: '#4878b0', label: 'NETWORK',  detail: 'VLAN · Segmentación',   dx:  28, dy:  -6, anchor: 'start'  as const },
  // Identity / compliance cluster (right)
  { deg:  42, color: '#3a7858', label: 'IDENTITY', detail: 'Entra ID · SSO',         dx:  28, dy:  -6, anchor: 'start'  as const },
  { deg: 102, color: '#3a7858', label: 'ENDPOINT', detail: 'Intune · Autopilot',     dx:  0,  dy:  34, anchor: 'middle' as const },
  // Cloud / collaboration cluster (lower-left)
  { deg: 162, color: '#4878b0', label: 'M365',     detail: 'Exchange · Teams',       dx: -28, dy:  -6, anchor: 'end'    as const },
  { deg: 222, color: '#3d88a5', label: 'CCTV',     detail: 'Axis · NVR · IA',        dx: -28, dy:  -6, anchor: 'end'    as const },
] as const

// Outer edge / cloud / audit nodes — smaller, dimmer, more peripheral
const OUTER_NODES = [
  { deg: -52, color: '#475569', label: 'WAN',   detail: 'Edge · ISP',      dx:  0,  dy: -26, anchor: 'middle' as const },
  { deg:  14, color: '#3a7858', label: 'FIDO2', detail: 'MFA · Hardware',  dx:  24, dy:  -4, anchor: 'start'  as const },
  { deg: 178, color: '#64748b', label: 'AUDIT', detail: 'Log · SIEM',      dx: -24, dy:  -4, anchor: 'end'    as const },
] as const

// Lateral cross-connections (between related inner nodes, not through hub)
const CROSS_LINKS = [
  // FortiGate enforces policy on internal network segment
  { from: 0, to: 1, color: '#4878b0', label: 'Policy·L3' },
  // Identity governs endpoint access via MDM
  { from: 2, to: 3, color: '#3a7858', label: 'MDM Sync' },
  // M365 authenticates via Entra ID — cloud identity plane
  { from: 4, to: 2, color: '#4878b0', label: 'Auth·SSO' },
] as const

// Dash cycle lengths for spoke animation (dash + gap = period)
const DASH_R1 = 14
const DASH_R2 = 20

// ─── Component ───────────────────────────────────────────────────────────────
export default function InfraTopology() {
  return (
    <div
      className="select-none w-full"
      role="img"
      aria-label="Diagrama de arquitectura de infraestructura IT gestionada por Velkor"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >

        {/* ══════════════════════════════════════════════════════════
            DEPTH RINGS — structural zone references
            Three concentric dashed rings define infrastructure layers:
            inner zone / security perimeter / edge+cloud plane
        ══════════════════════════════════════════════════════════ */}
        <circle cx={CX} cy={CY} r={R_RING_OUTER}
          stroke="rgba(56,100,160,0.08)" strokeWidth={0.6} strokeDasharray="1.5 8" />
        <circle cx={CX} cy={CY} r={R_RING_MID}
          stroke="rgba(56,100,160,0.11)" strokeWidth={0.75} strokeDasharray="2 7" />
        <circle cx={CX} cy={CY} r={R_RING_INNER}
          stroke="rgba(56,100,160,0.06)" strokeWidth={0.5} strokeDasharray="1 8" />

        {/* Outer ring accent marks at each node's angular position */}
        {INNER_NODES.map(({ deg, color }) => {
          const [rx, ry] = polar(deg, R_RING_OUTER)
          return (
            <circle key={`rim-${deg}`}
              cx={rx} cy={ry} r={1.8}
              fill={color} fillOpacity={0.28} />
          )
        })}

        {/* ══════════════════════════════════════════════════════════
            R1 SPOKE CONNECTIONS — hub to inner nodes
            Each spoke has a static structural line + animated flow dash
        ══════════════════════════════════════════════════════════ */}
        {INNER_NODES.map(({ deg, color }, i) => {
          const [nx, ny] = polar(deg, R1)
          return (
            <g key={`spoke1-${deg}`}>
              {/* Static structural line */}
              <line x1={CX} y1={CY} x2={nx} y2={ny}
                stroke={color} strokeWidth={0.6} strokeOpacity={0.11} />
              {/* Animated data flow */}
              <motion.line
                x1={CX} y1={CY} x2={nx} y2={ny}
                stroke={color}
                strokeWidth={1.1}
                strokeDasharray="3 11"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.45,
                  strokeDashoffset: [DASH_R1, 0],
                }}
                transition={{
                  opacity: { duration: 0.12, ease: EASE as any, delay: 0.08 },
                  strokeDashoffset: {
                    repeat: Infinity,
                    duration: 2.1 + i * 0.17,
                    ease: 'linear',
                    delay: i * 0.28,
                  },
                }}
              />
            </g>
          )
        })}

        {/* ══════════════════════════════════════════════════════════
            R2 SPOKE CONNECTIONS — hub to outer/edge nodes
            Dimmer, slower — these are background/cloud paths
        ══════════════════════════════════════════════════════════ */}
        {OUTER_NODES.map(({ deg, color }, i) => {
          const [nx, ny] = polar(deg, R2)
          return (
            <g key={`spoke2-${deg}`}>
              <line x1={CX} y1={CY} x2={nx} y2={ny}
                stroke={color} strokeWidth={0.5} strokeOpacity={0.07} />
              <motion.line
                x1={CX} y1={CY} x2={nx} y2={ny}
                stroke={color}
                strokeWidth={0.85}
                strokeDasharray="2 12"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.28,
                  strokeDashoffset: [DASH_R2, 0],
                }}
                transition={{
                  opacity: { duration: 0.12, ease: EASE as any, delay: 0.08 },
                  strokeDashoffset: {
                    repeat: Infinity,
                    duration: 3.8 + i * 0.25,
                    ease: 'linear',
                    delay: i * 0.45,
                  },
                }}
              />
            </g>
          )
        })}

        {/* ══════════════════════════════════════════════════════════
            LATERAL CROSS-CONNECTIONS — service relationships
            Curved arcs between inner nodes that share a relationship.
            FortiGate enforces policy on NETWORK layer.
            IDENTITY governs ENDPOINT via MDM sync.
        ══════════════════════════════════════════════════════════ */}
        {CROSS_LINKS.map(({ from, to, color, label }, i) => {
          const [ax, ay] = polar(INNER_NODES[from].deg, R1)
          const [bx, by] = polar(INNER_NODES[to].deg, R1)
          const path = outerArc(ax, ay, bx, by)
          // Label position: midpoint offset outward
          const mx = (ax + bx) / 2, my = (ay + by) / 2
          const dx = mx - CX, dy2 = my - CY
          const dlen = Math.sqrt(dx * dx + dy2 * dy2) || 1
          const lx = +(mx + (dx / dlen) * 16).toFixed(1)
          const ly = +(my + (dy2 / dlen) * 16).toFixed(1)
          return (
            <motion.g key={`cross-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: EASE as any, delay: 0.12 }}
            >
              <path d={path}
                stroke={color} strokeWidth={0.75} strokeOpacity={0.22}
                strokeDasharray="2 5" fill="none" />
              <text
                x={lx} y={ly}
                textAnchor="middle"
                fontSize={5.5}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fill={color} fillOpacity={0.32}
                letterSpacing="0.04em"
              >
                {label}
              </text>
            </motion.g>
          )
        })}

        {/* ══════════════════════════════════════════════════════════
            INNER SERVICE NODES (R1)
            Core infrastructure services — primary size, full color
        ══════════════════════════════════════════════════════════ */}
        {INNER_NODES.map(({ deg, color, label, detail, dx, dy, anchor }, i) => {
          const [nx, ny] = polar(deg, R1)
          const lx = nx + dx, ly = ny + dy
          return (
            <motion.g
              key={`n1-${deg}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, ease: EASE as any, delay: 0.08 }}
            >
              {/* Breathing ambient halo — calm living-system pulse */}
              <motion.circle
                cx={nx} cy={ny} r={18}
                fill={color} fillOpacity={0}
                animate={{ r: [16, 24, 16], fillOpacity: [0.035, 0.008, 0.035] }}
                transition={{ repeat: Infinity, duration: 5.5 + i * 1.1, ease: 'easeInOut', delay: i * 0.55 }}
              />
              {/* Static ambient halo */}
              <circle cx={nx} cy={ny} r={20} fill={color} fillOpacity={0.04} />
              {/* Hexagonal node body */}
              <polygon
                points={hexPts(nx, ny, R_HEX1)}
                stroke={color} strokeWidth={1} strokeOpacity={0.5}
                fill={color} fillOpacity={0.07}
              />
              {/* Active status dot */}
              <circle cx={nx} cy={ny} r={2.5} fill={color} fillOpacity={0.85} />
              {/* Service label */}
              <text
                x={lx} y={ly}
                textAnchor={anchor}
                fontSize={8}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fontWeight="700"
                fill="rgba(228,228,231,0.80)"
                letterSpacing="0.10em"
              >
                {label}
              </text>
              {/* Technology stack detail */}
              <text
                x={lx} y={ly + 11}
                textAnchor={anchor}
                fontSize={6.5}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fill="rgba(113,113,122,0.55)"
                letterSpacing="0.03em"
              >
                {detail}
              </text>
            </motion.g>
          )
        })}

        {/* ══════════════════════════════════════════════════════════
            OUTER EDGE / CLOUD NODES (R2)
            Peripheral: WAN entry, hardware MFA, audit/SIEM — smaller, dimmer
        ══════════════════════════════════════════════════════════ */}
        {OUTER_NODES.map(({ deg, color, label, detail, dx, dy, anchor }, i) => {
          const [nx, ny] = polar(deg, R2)
          const lx = nx + dx, ly = ny + dy
          return (
            <motion.g
              key={`n2-${deg}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, ease: EASE as any, delay: 0.08 }}
            >
              <circle cx={nx} cy={ny} r={16} fill={color} fillOpacity={0.03} />
              <polygon
                points={hexPts(nx, ny, R_HEX2)}
                stroke={color} strokeWidth={0.75} strokeOpacity={0.32}
                fill={color} fillOpacity={0.04}
              />
              <circle cx={nx} cy={ny} r={2} fill={color} fillOpacity={0.58} />
              <text
                x={lx} y={ly}
                textAnchor={anchor}
                fontSize={7}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fontWeight="700"
                fill="rgba(228,228,231,0.52)"
                letterSpacing="0.08em"
              >
                {label}
              </text>
              <text
                x={lx} y={ly + 10}
                textAnchor={anchor}
                fontSize={5.5}
                fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fill="rgba(113,113,122,0.38)"
                letterSpacing="0.03em"
              >
                {detail}
              </text>
            </motion.g>
          )
        })}

        {/* ══════════════════════════════════════════════════════════
            CENTRAL HUB — Velkor platform core
            Nested hexagons + ambient breathing pulse
        ══════════════════════════════════════════════════════════ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: EASE as any, delay: 0.05 }}
        >
          {/* Ambient breathing glow — cool steel, not amber */}
          <motion.circle
            cx={CX} cy={CY} r={38}
            fill="rgba(100,116,139,0.05)"
            animate={{ r: [32, 42, 32], opacity: [0.70, 0.30, 0.70] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
          />
          {/* Outer orbit ring — dashed hexagonal reference plane */}
          <polygon
            points={hexPts(CX, CY, R_HUB + 8)}
            stroke="rgba(148,163,184,0.15)" strokeWidth={0.75}
            strokeDasharray="2 4" fill="none"
          />
          {/* Main hub hexagon — steel/platinum */}
          <polygon
            points={hexPts(CX, CY, R_HUB)}
            stroke="rgba(148,163,184,0.50)" strokeWidth={1.25}
            fill="rgba(148,163,184,0.055)"
          />
          {/* Inner structural hexagon — precision engineering mark */}
          <polygon
            points={hexPts(CX, CY, 10)}
            stroke="rgba(100,116,139,0.22)" strokeWidth={0.75}
            fill="rgba(100,116,139,0.03)"
          />
          {/* Hub identity — engineered confidence */}
          <text
            x={CX} y={CY - 2}
            textAnchor="middle"
            fontSize={7}
            fontFamily="'JetBrains Mono', 'Fira Code', monospace"
            fontWeight="700"
            fill="rgba(226,232,240,0.88)"
            letterSpacing="0.14em"
          >
            VELKOR
          </text>
          <text
            x={CX} y={CY + 9}
            textAnchor="middle"
            fontSize={5.5}
            fontFamily="'JetBrains Mono', 'Fira Code', monospace"
            fill="rgba(100,116,139,0.48)"
            letterSpacing="0.10em"
          >
            PLATFORM
          </text>
        </motion.g>

      </svg>
    </div>
  )
}
