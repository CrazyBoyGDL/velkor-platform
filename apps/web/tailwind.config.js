/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base surfaces (reference: near-black)
        surface: {
          DEFAULT: '#111111',
          dark:    '#0a0a0a',
          card:    '#141414',
          raised:  '#1a1a1a',
          border:  '#252525',
          hover:   '#1f1f1f',
        },
        // Main accent
        amber: {
          DEFAULT: '#f59e0b',
          light:   '#fbbf24',
          dark:    '#d97706',
          bg:      'rgba(245,158,11,0.12)',
        },
        // NOC status colors
        noc: {
          green:      '#22c55e',
          'green-bg': 'rgba(34,197,94,0.12)',
          'green-dim':'#166534',
          yellow:     '#eab308',
          'yellow-bg':'rgba(234,179,8,0.12)',
          red:        '#ef4444',
          'red-bg':   'rgba(239,68,68,0.12)',
          blue:       '#3b82f6',
          'blue-bg':  'rgba(59,130,246,0.12)',
          cyan:       '#06b6d4',
          gray:       '#6b7280',
          'gray-mid': '#9ca3af',
          white:      '#f4f4f5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'grid-subtle': `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)',
      },
      boxShadow: {
        'amber':       '0 0 24px rgba(245,158,11,0.2)',
        'amber-sm':    '0 0 12px rgba(245,158,11,0.15)',
        'noc-green':   '0 0 20px rgba(34,197,94,0.15)',
        'card':        '0 1px 3px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
      },
      animation: {
        // Status / ambient
        'pulse-slow':      'pulse 3.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'pulse-fast':      'pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite',
        // Hero atmosphere — very slow, subtle drift
        'ambient-breath':  'ambientBreath 14s ease-in-out infinite',
        // Entry animations (CSS-only fallback)
        'fade-in':         'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up-in':      'fadeUpIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        // Utility
        'tick':            'tick 60s linear infinite',
        'draw':            'draw 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float':           'float 7s ease-in-out infinite',
        'scan-line':       'scan 4s linear infinite',
      },
      keyframes: {
        tick:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        draw:  { from: { strokeDashoffset: '100' }, to: { strokeDashoffset: '0' } },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
        scan:  { '0%': { top: '-2%' }, '100%': { top: '102%' } },
        ambientBreath: {
          '0%,100%': { opacity: '0.55', transform: 'scale(1) translate(0,0)' },
          '35%':     { opacity: '0.85', transform: 'scale(1.07) translate(14px,-6px)' },
          '65%':     { opacity: '0.70', transform: 'scale(1.04) translate(-8px,5px)' },
        },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUpIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
