'use client'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className="relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1a1a1a, #252525)'
          : 'linear-gradient(135deg, #e8e8e8, #d0d0d0)',
        border: theme === 'dark' ? '1px solid #333' : '1px solid #bbb',
        boxShadow: theme === 'dark'
          ? 'inset 0 1px 3px rgba(0,0,0,0.5)'
          : 'inset 0 1px 3px rgba(0,0,0,0.15)',
      }}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] select-none">☀️</span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] select-none">🌙</span>

      {/* Thumb */}
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-md"
        style={{
          left: theme === 'dark' ? 'calc(100% - 26px)' : '2px',
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
            : 'linear-gradient(135deg, #ffffff, #f0f0f0)',
          boxShadow: theme === 'dark'
            ? '0 0 8px rgba(245,158,11,0.5), 0 2px 4px rgba(0,0,0,0.4)'
            : '0 2px 6px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}
