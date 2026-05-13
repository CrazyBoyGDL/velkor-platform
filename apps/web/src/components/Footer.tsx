'use client'
import Link from 'next/link'
import { useRef } from 'react'
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

const SPECS = [
  { label: 'Fortinet FortiGate', color: '#3b82f6' },
  { label: 'Microsoft 365',      color: '#22c55e' },
  { label: 'Axis · Hikvision',   color: '#06b6d4' },
]

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], [30, 0])

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #070709 0%, #050507 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Static topology grid — replaces canvas animation */}
      <div className="absolute inset-0 bg-topology opacity-15 pointer-events-none" />

      {/* Cool steel top edge — replaces warm amber line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(100,116,139,0.18) 40%, rgba(100,116,139,0.18) 60%, transparent)',
        }}
      />

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
              <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-slow" />
              <span className="text-zinc-600 text-[10px] font-mono tracking-widest">SOPORTE TÉCNICO ESPECIALIZADO</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SPECS.map(({ label, color }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-zinc-600"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
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
                    <Link
                      href={href}
                      className="text-zinc-600 hover:text-zinc-300 text-sm transition-colors flex items-center gap-1.5 group/link"
                    >
                      <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover/link:bg-zinc-500 transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-zinc-700 text-xs font-mono">
            © {new Date().getFullYear()} Velkor System · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-4 text-zinc-700 text-xs font-mono">
            <Link href="/contacto" className="hover:text-zinc-400 transition-colors">Contacto</Link>
            <span className="text-zinc-800">·</span>
            <span>Consultoría Tecnológica</span>
            <span className="text-zinc-800">·</span>
            <span className="text-zinc-600">v2.1</span>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
