'use client'
import { useEffect, useRef } from 'react'

// Lightweight canvas-based network animation for the hero background
export default function NetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Nodes — reduced density for cleaner background
    const COUNT = 22
    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.0 + 0.5,
      pulse: Math.random() * Math.PI * 2,
    }))

    const LINK_DIST = 130
    // Single-color palette (amber only) for refined, non-cyberpunk look
    const AMBER    = [245, 158, 11]
    const PALETTE  = [AMBER, AMBER, AMBER]

    const col = (rgb: number[], a: number) =>
      `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)

      // Update
      for (const n of nodes) {
        n.x  += n.vx
        n.y  += n.vy
        n.pulse += 0.012
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      }

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            const a   = (1 - d / LINK_DIST) * 0.07
            const rgb = PALETTE[(i + j) % PALETTE.length]
            ctx.beginPath()
            ctx.strokeStyle = col(rgb, a)
            ctx.lineWidth   = 0.6
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Nodes — no glow rings, just subtle dots
      for (let i = 0; i < nodes.length; i++) {
        const n   = nodes[i]
        const rgb = PALETTE[i % PALETTE.length]
        const a   = 0.14 + 0.08 * Math.sin(n.pulse)

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = col(rgb, a)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.35 }}
    />
  )
}
