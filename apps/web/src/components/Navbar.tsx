'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { href: '/',            label: 'Inicio' },
  { href: '/services',    label: 'Servicios' },
  { href: '/blog',        label: 'Blog' },
  { href: '/casos',       label: 'Casos' },
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/assessments', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen]   = useState(false)
  const [solid, setSolid] = useState(false)
  const pathname          = usePathname()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className="fixed top-9 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: solid || open
          ? 'rgba(8,8,8,0.92)'
          : 'transparent',
        backdropFilter: solid || open ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: solid || open ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        WebkitBackdropFilter: solid || open ? 'blur(20px) saturate(180%)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo — re-keyed on route to replay animation */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <Logo key={pathname} className="w-9 h-9" />
            <div className="leading-none">
              <div className="text-noc-white font-bold text-[15px] tracking-tight group-hover:text-amber transition-colors">VELKOR</div>
              <div className="text-zinc-600 text-[9px] font-mono tracking-[0.2em]">SYSTEM</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? 'text-noc-white'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                {label}
                {isActive(href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/assessments" className="btn-amber text-sm px-5 py-2">
              Diagnóstico gratis →
            </Link>
          </div>

          {/* Mobile burger */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="w-9 h-9 flex flex-col justify-center items-center gap-[5px]"
              onClick={() => setOpen(o => !o)}
              aria-label="Menú"
            >
              <span className={`w-5 h-0.5 bg-zinc-400 rounded-full transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`w-5 h-0.5 bg-zinc-400 rounded-full transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-zinc-400 rounded-full transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="px-4 py-4 space-y-1" style={{ background: 'rgba(8,8,8,0.97)' }}>
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block px-4 py-3 rounded-xl text-sm transition-colors ${
                    isActive(href)
                      ? 'text-white bg-white/[0.06] font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/[0.05]">
                <Link href="/assessments" className="block btn-amber text-center py-3">
                  Diagnóstico gratis →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
