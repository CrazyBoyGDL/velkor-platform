'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Logo from './Logo'

const LINKS = {
  Servicios: [
    ['Redes empresariales', '/servicios'],
    ['CCTV & Vigilancia', '/servicios/videovigilancia'],
    ['Microsoft 365', '/servicios/identidad-acceso'],
    ['Intune & Entra ID', '/servicios/identidad-acceso'],
    ['Ciberseguridad', '/servicios/ciberseguridad'],
  ],
  Empresa: [
    ['Casos de éxito', '/casos'],
    ['Nosotros', '/nosotros'],
    ['Blog técnico', '/blog'],
    ['Diagnóstico gratuito', '/assessments'],
  ],
}

const CERTS = [
  { label: 'Fortinet NSE4',      color: '#ef4444' },
  { label: 'Microsoft Partner',  color: '#3b82f6' },
  { label: 'Axis ACSR',          color: '#22c55e' },
]

function FooterCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    let raf: number

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.2 + 0.5,
      p: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.p += 0.008
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(245,158,11,${(1 - d / 120) * 0.07})`
            ctx.lineWidth = 0.6
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const a = 0.15 + 0.1 * Math.sin(n.p)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,158,11,${a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }} />
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])

  return (
    <footer ref={ref} className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070709 0%, #050507 100%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <FooterCanvas />

      {/* Amber gradient top edge */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3) 40%, rgba(245,158,11,0.3) 60%, transparent)' }} />

      <motion.div style={{ y }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <Logo className="w-8 h-8" animated={false} />
              <div className="leading-none">
                <div className="text-noc-white font-bold text-sm tracking-tight group-hover:text-amber transition-colors">VELKOR</div>
                <div className="text-zinc-700 text-[9px] font-mono tracking-[0.2em]">SYSTEM</div>
              </div>
            </Link>

            <p className="text-zinc-600 text-sm leading-relaxed max-w-xs mb-5">
              Consultoría tecnológica empresarial. Redes, ciberseguridad y Modern Workplace para empresas que no pueden permitirse interrupciones.
            </p>

            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-noc-green animate-pulse-slow" />
              <span className="text-noc-green text-[11px] font-mono tracking-widest">SOPORTE TÉCNICO ESPECIALIZADO</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {CERTS.map(({ label, color }) => (
                <span key={label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-zinc-500"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="label text-[11px] mb-5">{group}</h4>
              <ul className="space-y-3">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}
                      className="text-zinc-600 hover:text-zinc-300 text-sm transition-colors flex items-center gap-1.5 group/link">
                      <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover/link:bg-amber transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-zinc-700 text-xs font-mono">
            © {new Date().getFullYear()} Velkor System · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-4 text-zinc-700 text-xs font-mono">
            <Link href="/contacto" className="hover:text-zinc-400 transition-colors">Contacto</Link>
            <span className="text-zinc-800">·</span>
            <span>Consultoría Tecnológica</span>
            <span className="text-zinc-800">·</span>
            <span className="text-amber">v2.0</span>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
