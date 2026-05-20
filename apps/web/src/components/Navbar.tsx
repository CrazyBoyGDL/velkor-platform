'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { href: '/',           label: 'Inicio',    icon: true },
  { href: '/servicios',  label: 'Servicios' },
  { href: '/framework',  label: 'Método' },
  { href: '/recursos',   label: 'Guías' },
  { href: '/blog',       label: 'Blog' },
  { href: '/casos',      label: 'Casos' },
  { href: '/nosotros',   label: 'Nosotros' },
  { href: '/contacto',   label: 'Contacto' },
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
      className={`site-header ${solid || open ? 'site-header--solid' : ''} ${open ? 'site-header--open' : ''}`}
      data-solid={solid ? 'true' : 'false'}
      data-open={open ? 'true' : 'false'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[58px] lg:h-[56px]">

          {/* Logo — re-keyed on route to replay animation */}
          <Link href="/" className="site-brand-link group">
            <Logo key={pathname} className="w-8 h-8 lg:w-8 lg:h-8" state="monitoring" />
            <div className="leading-none">
              <div className="brand-lockup-title text-[15px] group-hover:text-zinc-200 transition-colors">VELKOR</div>
              <div className="brand-lockup-subtitle">SYSTEMS</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="site-nav" aria-label="Navegación principal">
            {NAV.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`site-nav-link ${isActive(href) ? 'site-nav-link--active' : ''}`}
              >
                {icon && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 flex-shrink-0">
                    <path d="M2 6.5L8 2l6 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    <path d="M6 15v-5h4v5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  </svg>
                )}
                {label}
                {isActive(href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="site-nav-indicator"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="site-nav-actions">
            <div className="operational-state-indicator hidden xl:inline-flex" aria-label="Estado operacional activo">
              <span className="operational-state-dot" />
              <span>Activo</span>
            </div>
            <ThemeToggle />
            <Link href="/assessments" className="btn-amber site-header-cta">
              Revisar escenario
            </Link>
          </div>

          {/* Mobile burger */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="site-menu-button"
              onClick={() => setOpen(o => !o)}
              aria-label="Menú"
              aria-expanded={open}
              aria-controls="mobile-navigation"
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
            className="site-mobile-menu-wrapper"
            id="mobile-navigation"
          >
            <div className="site-mobile-menu">
              {NAV.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={`site-mobile-link ${isActive(href) ? 'site-mobile-link--active' : ''}`}
                >
                  {icon && (
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 flex-shrink-0">
                      <path d="M2 6.5L8 2l6 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                      <path d="M6 15v-5h4v5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {label}
                </Link>
              ))}
              <div className="site-mobile-menu-cta">
                <Link href="/assessments" className="btn-amber w-full text-center py-3">
                  Revisar escenario
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
