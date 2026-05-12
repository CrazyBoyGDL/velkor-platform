import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Terminal header */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-noc-red/20 bg-noc-red-bg">
          <span className="w-1.5 h-1.5 rounded-full bg-noc-red animate-pulse-fast" />
          <span className="text-noc-red text-[11px] font-mono tracking-widest">404 // RUTA NO ENCONTRADA</span>
        </div>

        <div className="text-[6rem] font-black font-mono leading-none text-surface-border mb-4">
          404
        </div>

        <h1 className="text-2xl font-bold text-noc-white mb-3">
          Recurso no disponible
        </h1>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
          La ruta solicitada no existe en este sistema. Verifica la URL o regresa al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-amber px-8 py-3">
            Volver al inicio →
          </Link>
          <Link href="/assessments" className="btn-ghost px-8 py-3">
            Contactar soporte
          </Link>
        </div>

        <div className="mt-10 p-4 rounded-lg bg-surface-card border border-surface-border font-mono text-left text-xs text-zinc-600">
          <div><span className="text-noc-green">velkor-noc</span><span className="text-zinc-700">@</span><span className="text-amber">prod</span> ~ % <span className="text-zinc-400">GET /ruta-no-encontrada</span></div>
          <div className="text-noc-red mt-1">→ 404 Not Found</div>
          <div className="text-zinc-700 mt-1">→ Redirigiendo a dashboard principal…</div>
        </div>
      </div>
    </div>
  )
}
