'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Logo from './Logo'
import { COMPANY, CONTACT, TRUST, SITE_DOMAIN, LEGAL } from '@/lib/config'

const LINKS = {
  Servicios: [
    ['Redes empresariales',  '/servicios'],
    ['Ciberseguridad',        '/servicios/ciberseguridad'],
    ['Identidad & Acceso',    '/servicios/identidad-acceso'],
    ['CCTV & Vigilancia',     '/servicios/videovigilancia'],
  ],
  Framework: [
    ['Metodología',           '/framework'],
    ['Framework operacional', '/framework/operational-framework'],
    ['Evidencia técnica',     '/framework/evidence'],
    ['Motor de contenido',    '/framework/content-engine'],
  ],
  Empresa: [
    ['Casos de éxito',        '/casos'],
    ['Nosotros',              '/nosotros'],
    ['Blog técnico',          '/blog'],
    ['Diagnóstico gratuito',  '/assessments'],
  ],
}

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
      {/* Topology grid */}
      <div className="absolute inset-0 bg-topology opacity-15 pointer-events-none" />

      {/* Top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(100,116,139,0.18) 40%, rgba(100,116,139,0.18) 60%, transparent)',
        }}
      />

      <motion.div style={{ y }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand — 2 cols */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <Logo className="w-8 h-8" animated={false} />
              <div className="leading-none">
                <div className="text-noc-white font-bold text-sm tracking-tight group-hover:text-amber transition-colors">VELKOR</div>
                <div className="text-zinc-700 text-[9px] font-mono tracking-[0.2em]">SYSTEM</div>
              </div>
            </Link>

            <p className="text-zinc-600 text-sm leading-relaxed max-w-xs mb-4">
              {COMPANY.description}
            </p>

            {/* Service regions */}
            <div className="mb-4">
              <div className="text-zinc-700 text-[10px] font-mono tracking-widest mb-2">COBERTURA</div>
              {TRUST.serviceRegions.slice(0, 2).map(r => (
                <div key={r} className="flex items-center gap-1.5 mb-1">
                  <span className="w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0" />
                  <span className="text-zinc-700 text-[11px] font-mono">{r}</span>
                </div>
              ))}
            </div>

            {/* Operational status */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-slow" />
              <span className="text-zinc-600 text-[10px] font-mono tracking-widest">SOPORTE TÉCNICO ACTIVO</span>
            </div>

            {/* Technology stack chips */}
            <div className="flex flex-wrap gap-2">
              {TRUST.technologies.map(({ label, color }) => (
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

          {/* Nav link groups — 3 cols */}
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

        {/* Contact strip */}
        <div
          className="mt-12 pt-6 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-zinc-600 hover:text-zinc-400 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              {CONTACT.email}
            </a>
            {CONTACT.linkedin && (
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-400 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                LinkedIn
              </a>
            )}
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-4 text-zinc-700 text-[11px] font-mono">
            <Link href={LEGAL.privacyPolicyUrl} className="hover:text-zinc-500 transition-colors">
              Privacidad
            </Link>
            <span className="text-zinc-800">·</span>
            <Link href={LEGAL.termsOfServiceUrl} className="hover:text-zinc-500 transition-colors">
              Términos
            </Link>
            <span className="text-zinc-800">·</span>
            <Link href="/contacto" className="hover:text-zinc-500 transition-colors">
              Contacto
            </Link>
          </div>
        </div>

        {/* Copyright + version */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-zinc-700 text-xs font-mono">
            © {new Date().getFullYear()} {COMPANY.name} · Todos los derechos reservados · {COMPANY.region}
          </p>
          <div className="flex items-center gap-3 text-zinc-800 text-[10px] font-mono">
            <span>{SITE_DOMAIN}</span>
            <span>·</span>
            <span>{COMPANY.version}</span>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
