'use client'
import { useEffect, useRef } from 'react'

// Subtle static-feeling network topology — cool steel palette, minimal motion
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

    // Fewer nodes, slower movement — reads as structural, not animated
    const COUNT = 16
    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.08,   // very slow drift
      vy: (Math.random() - 0.5) * 0.08,
      r: Math.random() * 0.8 + 0.4,
      pulse: Math.random() * Math.PI * 2,
    }))

    const LINK_DIST = 110
    // Cool steel/slate — enterprise, not startup amber
    const STEEL = [100, 116, 139]   // slate-500
    const col = (rgb: number[], a: number) =>
      `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      for (const n of nodes) {
        n.x     += n.vx
        n.y     += n.vy
        n.pulse += 0.006   // slower pulse
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      }

      // Edges — very faint, structural
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            ctx.beginPath()
            ctx.strokeStyle = col(STEEL, (1 - d / LINK_DIST) * 0.05)
            ctx.lineWidth   = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Nodes — calm, minimal
      for (const n of nodes) {
        const a = 0.08 + 0.04 * Math.sin(n.pulse)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = col(STEEL, a)
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
      style={{ opacity: 0.25 }}
      aria-hidden="true"
    />
  )
}
