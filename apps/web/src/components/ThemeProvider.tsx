'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} })

export function useTheme() { return useContext(Ctx) }

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('velkor-theme')
    const saved: Theme = stored === 'light' ? 'light' : 'dark'
    setTheme(saved)
    apply(saved)
  }, [])

  function apply(t: Theme) {
    const html = document.documentElement
    html.classList.toggle('dark',  t === 'dark')
    html.classList.toggle('light', t === 'light')
    html.setAttribute('data-theme', t)
    html.style.colorScheme = t

    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
    if (meta) meta.content = t
  }

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    apply(next)
    localStorage.setItem('velkor-theme', next)
  }

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}
