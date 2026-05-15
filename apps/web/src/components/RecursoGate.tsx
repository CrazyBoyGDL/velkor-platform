'use client'
import { useState } from 'react'
import { trackDownload, trackEvent } from '@/components/Analytics'
import { Events } from '@/lib/analyticsEvents'

type Section = {
  title: string
  items: string[]
}

type Props = {
  slug: string
  title: string
  description: string
  hex: string
  includes: string[]
  content: Section[]
  ctaLabel?: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function RecursoGate({
  slug, title, description, hex, includes, content, ctaLabel = 'Acceder al recurso gratuitamente',
}: Props) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus]   = useState<Status>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/recurso-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, resourceSlug: slug }),
      })
      if (!res.ok) { setStatus('error'); return }
      setStatus('success')
      trackEvent(Events.ResourceLeadSubmitted, { recurso: slug })
      trackDownload(title, 'resource', `recurso-${slug}`, true)
    } catch {
      setStatus('error')
    }
  }

  // ── Gated form ───────────────────────────────────────────────────────────────
  if (status !== 'success') {
    return (
      <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">

        {/* Left — resource preview */}
        <div>
          <div
            className="card p-7 mb-6 hover:border-zinc-600 transition-colors"
            style={{ borderLeftColor: hex, borderLeftWidth: 3 }}
          >
            <h2 className="text-noc-white font-black text-lg mb-2">{title}</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-5">{description}</p>
            <div className="label text-[10px] mb-3">INCLUYE</div>
            <ul className="space-y-2">
              {includes.map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: hex }} />
                  <span className="text-zinc-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Blurred preview */}
          <div className="relative card p-6 overflow-hidden">
            <div className="absolute inset-0 bg-surface-card/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center px-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: hex + '18', color: hex }}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-zinc-300 text-sm font-semibold">Completa el formulario para acceder</p>
              </div>
            </div>
            {/* Blurred content hint */}
            <div className="space-y-3 opacity-30 select-none pointer-events-none">
              {content[0]?.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-zinc-500 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="card p-7">
          <div className="mb-6">
            <h3 className="text-noc-white font-black text-lg mb-1">Acceso técnico</h3>
            <p className="text-zinc-500 text-sm">Sin spam. Sin compromiso. Información técnica real.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {[
              { key: 'name',    label: 'Nombre completo',   type: 'text',  value: name,    setter: setName,    placeholder: 'Juan Pérez',        req: true },
              { key: 'email',   label: 'Correo empresarial', type: 'email', value: email,   setter: setEmail,   placeholder: 'juan@empresa.com',  req: true },
              { key: 'company', label: 'Empresa',            type: 'text',  value: company, setter: setCompany, placeholder: 'Corporativo XYZ',   req: true },
            ].map(({ key, label, type, value, setter, placeholder, req }) => (
              <div key={key}>
                <label className="label text-[10px] block mb-1.5">{label}</label>
                <input
                  type={type}
                  required={req}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-surface-dark border border-surface-border rounded-lg px-4 py-2.5 text-noc-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            ))}

            {status === 'error' && (
              <p className="text-red-400 text-xs">
                No se pudo procesar. Inténtalo de nuevo o escríbenos directamente.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn-amber py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
              style={status !== 'loading' ? { background: `linear-gradient(135deg, ${hex}, ${hex}cc)` } : undefined}
            >
              {status === 'loading' ? 'Verificando...' : ctaLabel}
            </button>

            <p className="text-zinc-700 text-[11px] text-center font-mono">
              Sin spam. Puedes darte de baja en cualquier momento.
            </p>
          </form>
        </div>
      </div>
    )
  }

  // ── Unlocked content ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Success banner */}
      <div
        className="card p-5 mb-8 flex items-center gap-4"
        style={{ borderColor: hex + '40', background: hex + '08' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: hex + '20', color: hex }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <div className="text-noc-white font-semibold text-sm">Recurso desbloqueado</div>
          <div className="text-zinc-500 text-xs">Disfruta el contenido completo sin restricciones.</div>
        </div>
      </div>

      {/* Resource content */}
      <div className="space-y-8">
        {content.map(({ title: sectionTitle, items }) => (
          <div key={sectionTitle} className="card p-7" style={{ borderLeftColor: hex, borderLeftWidth: 2 }}>
            <h3 className="text-noc-white font-black text-base mb-4">{sectionTitle}</h3>
            <ul className="space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5"
                    style={{ background: hex + '18', color: hex }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-zinc-400 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
