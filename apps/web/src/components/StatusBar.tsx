'use client'
import { useState, useEffect } from 'react'

const CERTS = [
  { label: 'Fortinet NSE',        level: 'ok'   as const },
  { label: 'Microsoft Partner',   level: 'ok'   as const },
  { label: 'Intune & Entra ID',   level: 'ok'   as const },
  { label: 'NOC 24 / 7 / 365',   level: 'ok'   as const },
]

const DOT = ({ level }: { level: 'ok' | 'warn' }) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
    level === 'ok' ? 'bg-noc-green animate-pulse-slow' : 'bg-amber animate-pulse-fast'
  }`} />
)

export default function StatusBar() {
  const [clock, setClock] = useState('')

  useEffect(() => {
    const update = () => {
      setClock(new Date().toLocaleTimeString('es-MX', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }) + ' CST')
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const dateStr = new Date().toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  const ticker = [...CERTS, ...CERTS]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-9 bg-surface-dark border-b border-surface-border overflow-hidden flex items-center">

      {/* Desktop: static list */}
      <div className="flex-1 hidden sm:flex items-center gap-8 px-6 overflow-hidden">
        {CERTS.map(({ label, level }) => (
          <div key={label} className="flex items-center gap-1.5 flex-shrink-0">
            <DOT level={level} />
            <span className="text-zinc-500 text-[11px] font-mono">{label}</span>
          </div>
        ))}
      </div>

      {/* Mobile: continuous scroll ticker */}
      <div className="sm:hidden flex-1 overflow-hidden">
        <div className="flex items-center gap-8 animate-tick whitespace-nowrap px-4">
          {ticker.map(({ label, level }, i) => (
            <div key={i} className="flex items-center gap-1.5 inline-flex">
              <DOT level={level} />
              <span className="text-zinc-500 text-[10px] font-mono">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clock (right) */}
      <div className="hidden sm:flex items-center gap-2 px-6 text-[11px] font-mono text-zinc-600 border-l border-surface-border flex-shrink-0">
        <span>Velkor NOC</span>
        <span className="text-zinc-700">|</span>
        <span>{dateStr}</span>
        <span className="text-zinc-700">|</span>
        <span className="text-zinc-400">{clock}</span>
      </div>
    </div>
  )
}
