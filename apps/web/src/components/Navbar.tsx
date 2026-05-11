'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const NAV = [
  { href: '/services',    label: 'Servicios' },
  { href: '/blog',        label: 'Blog' },
  { href: '/casos',       label: 'Casos' },
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/assessments', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [solid, setSolid]     = useState(false)
  const pathname              = usePathname()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={`fixed top-9 left-0 right-0 z-40 transition-all duration-300 ${
        solid || open
          ? 'bg-surface-dark/95 backdrop-blur-md border-b border-surface-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <Logo className="w-9 h-9" />
            <div className="leading-none">
              <div className="text-noc-white font-bold text-[15px] tracking-tight">VELKOR</div>
              <div className="text-zinc-600 text-[9px] font-mono tracking-[0.2em]">SYSTEM</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors group ${
                  isActive(href)
                    ? 'text-noc-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              Acceder
            </button>
            <Link
              href="/assessments"
              className="btn-amber text-sm px-5 py-2"
            >
              Diagnóstico gratis →
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            onClick={() => setOpen(o => !o)}
            aria-label="Menú"
          >
            <span className={`w-5 h-0.5 bg-zinc-400 transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-zinc-400 transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-zinc-400 transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-surface-dark border-t border-surface-border">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm ${
                  isActive(href) ? 'text-white bg-surface-raised' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-surface-border">
              <Link
                href="/assessments"
                onClick={() => setOpen(false)}
                className="block btn-amber text-center py-3"
              >
                Diagnóstico gratis →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
