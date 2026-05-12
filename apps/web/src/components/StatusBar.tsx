'use client'

const TRUST_SIGNALS = [
  'Fortinet NSE4',
  'Microsoft Partner',
  'Intune & Entra ID',
  'Desde 2016',
]

export default function StatusBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-9 bg-surface-dark border-b border-surface-border overflow-hidden flex items-center">

      {/* Desktop: static badges */}
      <div className="hidden sm:flex flex-1 items-center gap-6 px-6">
        {TRUST_SIGNALS.map((label) => (
          <div key={label} className="flex items-center gap-2 flex-shrink-0">
            <span className="w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0" />
            <span className="text-zinc-600 text-[11px] font-medium tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      {/* Mobile: scrolling ticker */}
      <div className="sm:hidden flex-1 overflow-hidden">
        <div className="flex items-center gap-8 animate-tick whitespace-nowrap px-4">
          {[...TRUST_SIGNALS, ...TRUST_SIGNALS].map((label, i) => (
            <div key={i} className="flex items-center gap-2 inline-flex">
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="text-zinc-600 text-[10px] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right label */}
      <div className="hidden sm:flex items-center gap-3 px-6 border-l border-surface-border flex-shrink-0">
        <span className="text-zinc-700 text-[11px] font-medium tracking-wide">Consultoría IT · México</span>
      </div>
    </div>
  )
}
