'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
const WA_HREF = WA_NUMBER
  ? `https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20interesa%20un%20diagn%C3%B3stico%20de%20infraestructura`
  : null

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3"
      style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.6))' }}
    >
      {/* Expanded menu */}
      {expanded && (
        <div className="flex flex-col gap-2 items-end">
          {/* WhatsApp — only rendered when NEXT_PUBLIC_WHATSAPP_NUMBER is set */}
          {WA_HREF && (
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #25d366, #128c7e)',
                boxShadow: '0 0 0 1px rgba(37,211,102,0.4), 0 4px 20px rgba(37,211,102,0.3)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hablar por WhatsApp
            </a>
          )}

          {/* Diagnóstico */}
          <Link
            href="/assessments"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-black transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              boxShadow: '0 0 0 1px rgba(245,158,11,0.6), 0 4px 20px rgba(245,158,11,0.35)',
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V1.75A.75.75 0 0110 1zm5.658 1.95a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.061-1.061l1.06-1.06a.75.75 0 011.06 0zm-10.254 0a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.062L5.404 4.012a.75.75 0 010-1.061zM10 5a5 5 0 100 10A5 5 0 0010 5zm-8 5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm13 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0115 10z" clipRule="evenodd" />
            </svg>
            Diagnóstico gratis
          </Link>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
        style={{
          background: expanded
            ? 'linear-gradient(135deg, #1e1e1e, #111)'
            : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          boxShadow: expanded
            ? '0 0 0 1px #333, 0 8px 24px rgba(0,0,0,0.5)'
            : '0 0 0 1px rgba(245,158,11,0.7), 0 8px 32px rgba(245,158,11,0.4)',
        }}
        aria-label={expanded ? 'Cerrar' : 'Contactar'}
      >
        {/* Ping ring when closed */}
        {!expanded && (
          <span
            className="absolute inset-0 rounded-2xl"
            style={{
              animation: 'glowPing 3.5s ease-out infinite',
              background: 'rgba(245,158,11,0.18)',
            }}
          />
        )}
        {expanded ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-zinc-400">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-black">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  )
}
