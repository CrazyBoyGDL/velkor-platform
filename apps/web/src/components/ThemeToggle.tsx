'use client'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
      style={{
        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
        border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.14)',
      }}
    >
      {isDark ? (
        <>
          <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 text-zinc-300">
            <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.22 4.22l1.06 1.06M14.72 14.72l1.06 1.06M4.22 15.78l1.06-1.06M14.72 5.28l1.06-1.06"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-[10px] font-mono text-zinc-400 hidden sm:block">LIGHT</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 text-zinc-600">
            <path d="M17.5 11.5A7.5 7.5 0 1 1 8.5 2.5a5.5 5.5 0 0 0 9 9z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[10px] font-mono text-zinc-600 hidden sm:block">DARK</span>
        </>
      )}
    </button>
  )
}
