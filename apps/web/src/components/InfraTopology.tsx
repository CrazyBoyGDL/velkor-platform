'use client'
import { motion } from 'framer-motion'

// ─── Geometry constants ────────────────────────────────────────────────────────
const CX = 270, CY = 178          // hub center in 540×360 viewBox
const R_HUB  = 22                  // hub hexagon circumradius
const R_SAT  = 12                  // satellite hexagon circumradius
const R_NODE = 105                 // hub → satellite center distance
const R_RING = 152                 // outer decorative ring radius
const EASE = [0.16, 1, 0.3, 1] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** SVG polygon points for a pointy-top regular hexagon */
function hexPts(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}

/** Cartesian point from polar (deg, radius) relative to hub center */
function polar(deg: number, r: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [+(CX + r * Math.cos(a)).toFixed(2), +(CY + r * Math.sin(a)).toFixed(2)]
}

// ─── Service node definitions ─────────────────────────────────────────────────
// Angles: -90=top, -30=upper-right, 30=lower-right, 90=bottom, 150=lower-left, 210=upper-left
// Label dx/dy: offset from the node center to the text anchor point
const NODES = [
  { deg: -90, color: '#3b82f6', label: 'REDES',    detail: 'Fortinet · Zero Trust', dx:  0,   dy: -36, anchor: 'middle' as const },
  { deg: -30, color: '#f59e0b', label: 'NOC',      detail: 'Monitoreo · Respuesta', dx:  30,  dy:  -4, anchor: 'start'  as const },
  { deg:  30, color: '#06b6d4', label: 'CCTV',     detail: 'Axis · NVR · IA',       dx:  30,  dy:  -4, anchor: 'start'  as const },
  { deg:  90, color: '#3b82f6', label: 'CLOUD',    detail: 'M365 · Exchange',        dx:  0,   dy:  36, anchor: 'middle' as const },
  { deg: 150, color: '#22c55e', label: 'IDENTITY', detail: 'Entra ID · FIDO2',       dx: -30,  dy:  -4, anchor: 'end'    as const },
  { deg: 210, color: '#22c55e', label: 'ENDPOINT', detail: 'Intune · Autopilot',     dx: -30,  dy:  -4, anchor: 'end'    as const },
] as const

// Dash pattern length = dash + gap (used for strokeDashoffset animation)
const DASH_PATTERN = 16  // "3 13" → 16px cycle

export default function InfraTopology() {
  return (
    <div
      className="select-none w-full"
      role="img"
      aria-label="Diagrama de infraestructura IT gestionada por Velkor"
    >
      <svg
        viewBox="0 0 540 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* ── Concentric decorative rings — depth planes ── */}
        <circle cx={CX} cy={CY} r={R_RING}
          stroke="rgba(255,255,255,0.038)" strokeWidth={0.75} strokeDasharray="2 5" />
        <circle cx={CX} cy={CY} r={65}
          stroke="rgba(255,255,255,0.025)" strokeWidth={0.75} strokeDasharray="1.5 7" />

        {/* ── Outer ring accent marks — precision instrument feel ── */}
        {NODES.map(({ deg, color }) => {
          const [rx, ry] = polar(deg, R_RING)
          return <circle key={`rim-${deg}`} cx={rx} cy={ry} r={2} fill={color} fillOpacity={0.38} />
        })}

        {/* ── Connection lines ── */}
        {NODES.map(({ deg, color }, i) => {
          const [nx, ny] = polar(deg, R_NODE)
          return (
            <g key={`conn-${deg}`}>
              {/* Static dim structural line */}
              <line x1={CX} y1={CY} x2={nx} y2={ny}
                stroke={color} strokeWidth={0.75} strokeOpacity={0.14} />
              {/* Animated flow pulse — data in motion */}
              <motion.line
                x1={CX} y1={CY} x2={nx} y2={ny}
                stroke={color}
                strokeWidth={1.2}
                strokeDasharray="3 13"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.5,
                  strokeDashoffset: [DASH_PATTERN, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, ease: EASE as any, delay: i * 0.1 + 0.7 },
                  strokeDashoffset: {
                    repeat: Infinity,
                    duration: 2.4 + i * 0.22,
                    ease: 'linear',
                    delay: i * 0.38,
                  },
                }}
              />
            </g>
          )
        })}

        {/* ── Satellite nodes ── */}
        {NODES.map(({ deg, color, label, detail, dx, dy, anchor }, i) => {
          const [nx, ny] = polar(deg, R_NODE)
          const lx = nx + dx
          const ly = ny + dy
          return (
            <motion.g
              key={`node-${deg}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, ease: EASE as any, delay: i * 0.1 + 0.5 }}
            >
              {/* Soft ambient halo */}
              <circle cx={nx} cy={ny} r={24} fill={color} fillOpacity={0.045} />
              {/* Hexagonal node shape */}
              <polygon points={hexPts(nx, ny, R_SAT)}
                stroke={color} strokeWidth={1} strokeOpacity={0.55}
                fill={color} fillOpacity={0.08} />
              {/* Center dot — active indicator */}
              <circle cx={nx} cy={ny} r={2.5} fill={color} fillOpacity={0.88} />

              {/* Label — service category */}
              <text x={lx} y={ly}
                textAnchor={anchor}
                fontSize={8.5} fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fontWeight="700" fill="rgba(228,228,231,0.82)" letterSpacing="0.09em"
              >{label}</text>
              {/* Detail — technology stack */}
              <text x={lx} y={ly + 12}
                textAnchor={anchor}
                fontSize={7} fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                fill="rgba(113,113,122,0.62)" letterSpacing="0.04em"
              >{detail}</text>
            </motion.g>
          )
        })}

        {/* ── Central hub — Velkor platform ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE as any, delay: 0.22 }}
        >
          {/* Ambient breath — living pulse */}
          <motion.circle cx={CX} cy={CY} r={40}
            fill="rgba(245,158,11,0.055)"
            animate={{ r: [36, 44, 36], opacity: [0.9, 0.45, 0.9] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
          />
          {/* Outer hexagonal orbit ring */}
          <polygon points={hexPts(CX, CY, R_HUB + 7)}
            stroke="rgba(245,158,11,0.17)" strokeWidth={0.75} strokeDasharray="2 4" fill="none" />
          {/* Main hub hexagon */}
          <polygon points={hexPts(CX, CY, R_HUB)}
            stroke="rgba(245,158,11,0.65)" strokeWidth={1.5}
            fill="rgba(245,158,11,0.07)" />
          {/* Inner structural hexagon — depth detail */}
          <polygon points={hexPts(CX, CY, 11)}
            stroke="rgba(245,158,11,0.28)" strokeWidth={1} fill="rgba(245,158,11,0.04)" />
          {/* Hub identity */}
          <text x={CX} y={CY - 2} textAnchor="middle"
            fontSize={7.5} fontFamily="'JetBrains Mono', 'Fira Code', monospace"
            fontWeight="700" fill="rgba(245,158,11,0.92)" letterSpacing="0.14em"
          >VELKOR</text>
          <text x={CX} y={CY + 9.5} textAnchor="middle"
            fontSize={6.5} fontFamily="'JetBrains Mono', 'Fira Code', monospace"
            fill="rgba(245,158,11,0.4)" letterSpacing="0.10em"
          >SYSTEM</text>
        </motion.g>

      </svg>
    </div>
  )
}
