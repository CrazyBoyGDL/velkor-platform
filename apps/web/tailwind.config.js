/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        noc: {
          dark:      '#08091e',
          darker:    '#0d1030',
          navy:      '#111540',
          blue:      '#1e3a8a',
          'blue-mid':'#2563eb',
          'blue-light': '#3b82f6',
          cyan:      '#06b6d4',
          green:     '#22c55e',
          'green-dim':'#166534',
          orange:    '#f97316',
          red:       '#ef4444',
          gray:      '#64748b',
          'gray-mid':'#94a3b8',
          'gray-light': '#cbd5e1',
          white:     '#e2e8f0',
        },
      },
      backgroundImage: {
        'gradient-noc': 'linear-gradient(135deg, #08091e 0%, #111540 50%, #0d1030 100%)',
        'gradient-card': 'linear-gradient(135deg, #0d1030 0%, #111540 100%)',
        'gradient-hero': 'linear-gradient(180deg, #08091e 0%, #111540 60%, #08091e 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'noc': '0 0 20px rgba(59,130,246,0.15)',
        'noc-strong': '0 0 40px rgba(59,130,246,0.25)',
        'noc-green': '0 0 20px rgba(34,197,94,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
