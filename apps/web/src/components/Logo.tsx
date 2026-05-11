'use client'

interface LogoProps {
  className?: string
  color?: string
  animated?: boolean
}

// V-shape with interconnected network nodes
const NODES = [
  { id: 'tl', cx: 6,  cy: 6  },
  { id: 'tr', cx: 42, cy: 6  },
  { id: 'ml', cx: 15, cy: 24 },
  { id: 'mr', cx: 33, cy: 24 },
  { id: 'ct', cx: 24, cy: 15 },
  { id: 'b',  cx: 24, cy: 42 },
]

const EDGES = [
  [6, 6,  15, 24],
  [15, 24, 24, 42],
  [42, 6,  33, 24],
  [33, 24, 24, 42],
  [6, 6,  24, 15],
  [24, 15, 42, 6],
  [15, 24, 33, 24],
  [24, 15, 15, 24],
  [24, 15, 33, 24],
]

export default function Logo({ className = 'w-10 h-10', color = '#f59e0b', animated = true }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Velkor logo"
    >
      {animated && (
        <style>{`
          @keyframes drawEdge {
            from { stroke-dashoffset: 60; }
            to   { stroke-dashoffset: 0; }
          }
          @keyframes nodeGlow {
            0%, 100% { opacity: 1; r: 2.5; }
            50%       { opacity: 0.6; r: 3.2; }
          }
          @keyframes ringGlow {
            0%, 100% { opacity: 0.15; }
            50%       { opacity: 0.04; }
          }
          .logo-edge {
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: drawEdge 0.8s ease forwards;
          }
          .logo-node { animation: nodeGlow 4s ease-in-out infinite; }
          .logo-ring { animation: ringGlow 4s ease-in-out infinite; }
        `}</style>
      )}

      {/* Edges */}
      {EDGES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
          className={animated ? 'logo-edge' : ''}
          style={animated ? { animationDelay: `${i * 0.08}s` } : {}}
        />
      ))}

      {/* Nodes */}
      {NODES.map(({ id, cx, cy }, i) => (
        <g key={id}>
          <circle
            cx={cx} cy={cy} r="5.5"
            fill={color}
            className={animated ? 'logo-ring' : ''}
            opacity="0.1"
            style={animated ? { animationDelay: `${i * 0.3}s` } : {}}
          />
          <circle
            cx={cx} cy={cy} r="2.5"
            fill={color}
            className={animated ? 'logo-node' : ''}
            style={animated ? { animationDelay: `${i * 0.3}s` } : {}}
          />
        </g>
      ))}
    </svg>
  )
}
