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

    // Nodes
    const COUNT = 38
    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.8,
      pulse: Math.random() * Math.PI * 2,
    }))

    const LINK_DIST = 160
    const AMBER    = [245, 158, 11]
    const BLUE     = [59, 130, 246]
    const GREEN    = [34, 197, 94]
    const PALETTE  = [AMBER, BLUE, GREEN]

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
            const a   = (1 - d / LINK_DIST) * 0.12
            const rgb = PALETTE[(i + j) % PALETTE.length]
            ctx.beginPath()
            ctx.strokeStyle = col(rgb, a)
            ctx.lineWidth   = 0.8
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n   = nodes[i]
        const rgb = PALETTE[i % PALETTE.length]
        const glow= 0.25 + 0.15 * Math.sin(n.pulse)

        // glow ring
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6)
        grad.addColorStop(0, col(rgb, glow * 0.5))
        grad.addColorStop(1, col(rgb, 0))
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = col(rgb, glow)
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
      style={{ opacity: 0.55 }}
    />
  )
}
