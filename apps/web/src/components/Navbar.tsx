'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/assessments', label: 'Assessment' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-noc-blue/30 bg-noc-dark/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded border border-noc-blue-light/60 flex items-center justify-center bg-noc-blue/20 group-hover:bg-noc-blue/40 transition">
              <div className="w-3 h-3 rounded-full bg-noc-blue-light shadow-noc animate-pulse-slow" />
            </div>
            <span className="text-noc-white font-bold text-lg tracking-wide">
              VELKOR<span className="text-noc-blue-light ml-1 font-mono text-sm">SYS</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  pathname === href
                    ? 'bg-noc-blue/30 text-noc-blue-light border border-noc-blue/50'
                    : 'text-noc-gray-mid hover:text-noc-white hover:bg-noc-navy'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/assessments"
              className="ml-4 px-5 py-2 rounded text-sm font-semibold bg-noc-blue-light hover:bg-noc-blue-mid text-white transition-colors shadow-noc"
            >
              Get Quote
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden text-noc-gray-mid hover:text-noc-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${open ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-noc-blue/30 bg-noc-darker px-4 py-4 flex flex-col gap-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded text-sm font-medium ${
                pathname === href
                  ? 'bg-noc-blue/30 text-noc-blue-light'
                  : 'text-noc-gray-mid hover:text-noc-white'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/assessments"
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-3 rounded text-sm font-semibold bg-noc-blue-light text-white text-center"
          >
            Get Quote
          </Link>
        </div>
      )}
    </header>
  )
}
