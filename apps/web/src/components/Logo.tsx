'use client'

interface LogoProps {
  className?: string
  color?: string
  animated?: boolean
  variant?: 'dark' | 'light'
}

const NODES = [
  { id: 'tl', cx: 6,  cy: 6  },
  { id: 'tr', cx: 42, cy: 6  },
  { id: 'ml', cx: 15, cy: 24 },
  { id: 'mr', cx: 33, cy: 24 },
  { id: 'ct', cx: 24, cy: 15 },
  { id: 'b',  cx: 24, cy: 42 },
]

const EDGES = [
  { x1: 6,  y1: 6,  x2: 15, y2: 24, len: 20 },
  { x1: 15, y1: 24, x2: 24, y2: 42, len: 20 },
  { x1: 42, y1: 6,  x2: 33, y2: 24, len: 20 },
  { x1: 33, y1: 24, x2: 24, y2: 42, len: 20 },
  { x1: 6,  y1: 6,  x2: 24, y2: 15, len: 21 },
  { x1: 24, y1: 15, x2: 42, y2: 6,  len: 21 },
  { x1: 15, y1: 24, x2: 33, y2: 24, len: 18 },
  { x1: 24, y1: 15, x2: 15, y2: 24, len: 13 },
  { x1: 24, y1: 15, x2: 33, y2: 24, len: 13 },
]

export default function Logo({
  className = 'w-10 h-10',
  color = '#6f8aa8',
  animated = true,
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} velkor-logo`}
      aria-label="Velkor logo"
    >
      {animated && (
        <style>{`
          /* ── Draw-in on load ── */
          @keyframes velkor-draw {
            from { stroke-dashoffset: 80; opacity: 0; }
            to   { stroke-dashoffset: 0;  opacity: 1; }
          }

          @keyframes velkor-link-pulse {
            0%   { opacity: 0.50; }
            45%  { opacity: 0.86; }
            100% { opacity: 0.58; }
          }

          /* ── Node core pulse ── */
          @keyframes velkor-node {
            0%,100% { opacity: 0.78; }
            50%     { opacity: 0.96; }
          }

          /* ── Node outer ring expand ── */
          @keyframes velkor-ring {
            0%,100% { opacity: 0.06; }
            50%     { opacity: 0.10; }
          }

          /* ── Whole-logo glow breathe ── */
          @keyframes velkor-glow {
            0%,100% { filter: drop-shadow(0 0 2px ${color}22); }
            50%     { filter: drop-shadow(0 0 4px ${color}32); }
          }

          .velkor-logo { overflow: visible; }
          .vlk-svg {
            animation: velkor-glow 4.8s ease-in-out infinite;
            transform-origin: 24px 24px;
          }

          /* Draw-in edges */
          .vlk-edge {
            stroke-dasharray: 80;
            stroke-dashoffset: 80;
            transition: opacity 0.18s ease, stroke 0.18s ease;
            animation: velkor-draw 0.46s cubic-bezier(0.22,1,0.36,1) forwards;
          }

          .vlk-node { animation: velkor-node 6s ease-in-out infinite; }
          .vlk-ring { animation: velkor-ring 6s ease-in-out infinite; }

          .velkor-logo:hover .vlk-edge {
            animation: velkor-link-pulse 0.84s cubic-bezier(0.22,1,0.36,1) forwards;
            opacity: 0.82;
          }
          .velkor-logo:hover .vlk-node { opacity: 1; }
          .velkor-logo:hover .vlk-ring { opacity: 0.13; }

          @media (prefers-reduced-motion: reduce) {
            .vlk-svg,
            .vlk-edge,
            .vlk-node,
            .vlk-ring {
              animation: none !important;
            }
            .vlk-edge {
              stroke-dashoffset: 0;
              opacity: 0.58;
            }
          }
        `}</style>
      )}

      <g className={animated ? 'vlk-svg' : ''}>

        {/* Base edges (draw-in once) */}
        {EDGES.map(({ x1, y1, x2, y2 }, i) => (
          <line key={`e${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth="1.4" strokeLinecap="round"
            opacity="0.55"
            className={animated ? 'vlk-edge' : ''}
            style={animated ? { animationDelay: `${i * 0.055}s` } : {}}
          />
        ))}

        {/* Nodes */}
        {NODES.map(({ id: nid, cx, cy }, i) => (
          <g key={nid}>
            {/* Outer ring */}
            <circle cx={cx} cy={cy} r="5" fill={color}
              className={animated ? 'vlk-ring' : ''}
              style={animated ? { animationDelay: `${i * 0.4}s` } : { opacity: 0.1 }}
            />
            {/* Core */}
            <circle cx={cx} cy={cy} r="2.2" fill={color}
              className={animated ? 'vlk-node' : ''}
              style={animated ? { animationDelay: `${i * 0.4}s` } : {}}
            />
          </g>
        ))}

      </g>
    </svg>
  )
}
