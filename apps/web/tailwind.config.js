/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base surfaces — 3-tier depth system
        surface: {
          DEFAULT: '#0d1120',
          dark:    '#080c14',   // page canvas — deep navy
          card:    '#0b1018',   // card surface
          raised:  '#131c2a',   // raised elements
          border:  '#1c2840',   // structural border — navy-graphite
          hover:   '#121c2e',   // hover state
        },
        // Warm brass — restrained CTA accent (not electric amber)
        amber: {
          DEFAULT: '#b07828',   // warm brass
          light:   '#c88e38',   // muted gold
          dark:    '#9a6518',   // deep brass
          bg:      'rgba(176,120,40,0.10)',
        },
        // Domain and status palette — all desaturated/institutional
        noc: {
          green:      '#3a7858',   // restrained emerald (identity/Intune)
          'green-bg': 'rgba(58,120,88,0.10)',
          'green-dim':'#1e4030',
          yellow:     '#b09020',   // muted yellow-gold
          'yellow-bg':'rgba(176,144,32,0.10)',
          red:        '#c04040',   // muted operational red
          'red-bg':   'rgba(192,64,64,0.10)',
          blue:       '#4878b0',   // graphite steel blue (networks/cloud)
          'blue-bg':  'rgba(72,120,176,0.10)',
          cyan:       '#3d88a5',   // muted steel cyan (CCTV/video)
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
        // Reduced-intensity hero atmosphere
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(176,120,40,0.05) 0%, transparent 70%)',
      },
      boxShadow: {
        'amber':       '0 0 24px rgba(176,120,40,0.15)',
        'amber-sm':    '0 0 12px rgba(176,120,40,0.10)',
        'noc-green':   '0 0 20px rgba(58,120,88,0.12)',
        'card':        '0 1px 3px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
      },
      animation: {
        'pulse-slow':      'pulse 3.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'pulse-fast':      'pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'ambient-breath':  'ambientBreath 14s ease-in-out infinite',
        'fade-in':         'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up-in':      'fadeUpIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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
