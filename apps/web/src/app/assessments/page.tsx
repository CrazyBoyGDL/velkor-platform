'use client'
import { useState, useEffect, useRef } from 'react'
import { trackEvent, trackCTA } from '@/components/Analytics'

const SERVICES = [
  'Redes & Conectividad',
  'CCTV & Vigilancia',
  'Microsoft 365 / Cloud',
  'Intune & Entra ID',
  'Monitoreo NOC',
  'Auditoría IT',
  'Otro',
]

// Display labels stay human-readable.
// Strapi enum values cannot start with a digit, so we map before sending.
const SIZES = ['1-10', '11-50', '51-200', '200+']
const SIZE_ENUM: Record<string, string> = {
  '1-10':   'size_1_10',
  '11-50':  'size_11_50',
  '51-200': 'size_51_200',
  '200+':   'size_200_plus',
}

// Infrastructure maturity — lightweight qualifier, no typing required
const MATURITY = [
  { v: 'early',   l: 'Inicial',        desc: 'Sin infraestructura IT formal' },
  { v: 'partial', l: 'En desarrollo',  desc: 'Herramientas básicas, sin gestión centralizada' },
  { v: 'managed', l: 'Gestionada',     desc: 'Con MDM o firewall, buscando optimización o migración' },
]

// Steps shown above the form to reduce friction and set expectations
const NEXT_STEPS = [
  { n: '01', title: 'Revisión técnica',    sub: 'Mismo día hábil' },
  { n: '02', title: 'Contacto directo',    sub: 'Ingeniero en < 24 h' },
  { n: '03', title: 'Propuesta sin costo', sub: 'Con alcance y cronograma' },
]

type Form = {
  name: string; email: string; company: string; phone: string
  size: string; maturity: string; services: string[]; urgency: string; notes: string
}

const EMPTY: Form = {
  name: '', email: '', company: '', phone: '',
  size: '', maturity: '', services: [], urgency: 'normal', notes: '',
}

export default function AssessmentsPage() {
  const [form, setForm]     = useState<Form>(EMPTY)
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [source, setSource] = useState('')

  // Refs for form abandonment tracking
  const formTouched  = useRef(false)
  const wasSubmitted = useRef(false)

  // Capture lead source (UTM or referrer) on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utm = params.get('utm_source') || params.get('ref')
    if (utm) { setSource(utm); return }
    try {
      const ref = document.referrer ? new URL(document.referrer).hostname : ''
      if (ref && ref !== 'velkor.mx') setSource(ref)
    } catch { /* ignore */ }
  }, [])

  // Form abandonment — fires if user started the form but navigated away
  useEffect(() => {
    const onUnload = () => {
      if (formTouched.current && !wasSubmitted.current) {
        trackEvent('Form Abandoned', { form: 'assessment' })
      }
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  const touch = () => { formTouched.current = true }

  const toggleSvc = (s: string) => {
    touch()
    if (!formTouched.current) trackEvent('Form Started', { form: 'assessment' })
    setForm(f => ({
      ...f,
      services: f.services.includes(s)
        ? f.services.filter(x => x !== s)
        : [...f.services, s],
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      // Build notes with context prepended
      const contextParts: string[] = []
      if (form.maturity) {
        const m = MATURITY.find(x => x.v === form.maturity)
        contextParts.push(`Madurez IT: ${m?.l ?? form.maturity}`)
      }
      if (source) contextParts.push(`Origen: ${source}`)
      const fullNotes = [...contextParts, form.notes].filter(Boolean).join('\n')

      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        form.name,
          email:       form.email,
          company:     form.company,
          phone:       form.phone,
          companySize: SIZE_ENUM[form.size] ?? form.size,
          services:    form.services,
          urgency:     form.urgency,
          notes:       fullNotes || undefined,
        }),
      })
      if (!res.ok) { setStatus('error'); return }

      wasSubmitted.current = true
      trackEvent('Assessment Submitted', {
        services: form.services.join(', '),
        urgency:  form.urgency,
        size:     form.size,
        maturity: form.maturity,
      })
      trackCTA('Assessment Form — Submit')
      setStatus('done')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === 'done') return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="noc-card border-noc-green/40 text-center p-12 max-w-md w-full">
        <div className="w-12 h-12 rounded-full bg-noc-green-bg border border-noc-green/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-noc-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-noc-white mb-2">Solicitud recibida</h2>
        <p className="text-zinc-500 text-sm mb-1">Un ingeniero revisará tu caso y te contactará en menos de 24 horas hábiles.</p>
        <p className="text-zinc-600 text-xs mb-6">Sin bots, sin ventas genéricas — responde el mismo ingeniero que implementará.</p>
        <button onClick={() => setStatus('idle')} className="btn-ghost text-sm px-6 py-2.5">
          Nueva solicitud
        </button>
      </div>
    </div>
  )

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="label">Evaluación gratuita</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight">
            Diagnóstico técnico<br />
            <span className="text-gradient-amber">sin compromiso</span>
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed max-w-lg">
            Nuestros ingenieros evalúan tu infraestructura y entregan un informe con brechas, recomendaciones y costos reales — sin vender paquetes estándar.
          </p>
        </div>

        {/* "What happens next" trust strip — reduces friction before the form */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {NEXT_STEPS.map(({ n, title, sub }) => (
            <div key={n} className="card p-4 flex flex-col gap-1.5">
              <span className="text-amber font-mono text-[10px] font-bold">{n}</span>
              <div className="text-zinc-200 text-xs font-semibold leading-snug">{title}</div>
              <div className="text-zinc-600 text-[11px] leading-snug">{sub}</div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="noc-card space-y-6">

          {/* Contact */}
          <div>
            <h3 className="text-noc-white font-medium mb-4 pb-3 border-b border-surface-border">Información de contacto</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'name',    label: 'Nombre completo',    type: 'text',  placeholder: 'Juan Pérez',        req: true  },
                { key: 'email',   label: 'Correo corporativo', type: 'email', placeholder: 'juan@empresa.com',  req: true  },
                { key: 'company', label: 'Empresa',            type: 'text',  placeholder: 'Corporativo XYZ',   req: true  },
                { key: 'phone',   label: 'Teléfono',           type: 'tel',   placeholder: '+52 55 0000 0000',  req: false },
              ].map(({ key, label, type, placeholder, req }) => (
                <div key={key}>
                  <label className="label text-[10px] block mb-1.5">{label}</label>
                  <input
                    type={type}
                    required={req}
                    value={form[key as keyof Form] as string}
                    onChange={e => { touch(); setForm(f => ({ ...f, [key]: e.target.value })) }}
                    placeholder={placeholder}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg px-4 py-2.5 text-noc-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Company size */}
          <div>
            <label className="label text-[10px] block mb-2">Tamaño de empresa</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} type="button" onClick={() => { touch(); setForm(f => ({ ...f, size: s })) }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    form.size === s ? 'border-amber/60 bg-amber-bg text-amber' : 'border-surface-border text-zinc-500 hover:border-zinc-600'
                  }`}>
                  {s.replace('-', '–')} empleados
                </button>
              ))}
            </div>
          </div>

          {/* Infrastructure maturity — lightweight qualifier */}
          <div>
            <label className="label text-[10px] block mb-2">Madurez de infraestructura actual</label>
            <div className="grid sm:grid-cols-3 gap-2">
              {MATURITY.map(({ v, l, desc }) => (
                <button key={v} type="button" onClick={() => { touch(); setForm(f => ({ ...f, maturity: v })) }}
                  className={`flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-all ${
                    form.maturity === v
                      ? 'border-amber/50 bg-amber-bg'
                      : 'border-surface-border hover:border-zinc-600'
                  }`}>
                  <span className={`text-sm font-semibold leading-snug ${form.maturity === v ? 'text-amber' : 'text-zinc-300'}`}>{l}</span>
                  <span className="text-zinc-600 text-[11px] leading-snug mt-0.5">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-noc-white font-medium mb-4 pb-3 border-b border-surface-border">¿Qué áreas te interesan?</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {SERVICES.map(s => {
                const active = form.services.includes(s)
                return (
                  <button key={s} type="button" onClick={() => toggleSvc(s)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all ${
                      active ? 'border-amber/50 bg-amber-bg text-noc-white' : 'border-surface-border text-zinc-500 hover:border-zinc-600'
                    }`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                      active ? 'bg-amber border-amber' : 'border-zinc-700'
                    }`}>
                      {active && (
                        <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M3.5 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                        </svg>
                      )}
                    </div>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="label text-[10px] block mb-2">Horizonte del proyecto</label>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 'low',    l: 'Planificando (1–3 meses)',  c: 'border-noc-green/50 bg-noc-green-bg text-noc-green' },
                { v: 'normal', l: 'Pronto (2–4 semanas)',       c: 'border-noc-blue/50 bg-noc-blue-bg text-noc-blue'   },
                { v: 'high',   l: 'Urgente (esta semana)',      c: 'border-amber/50 bg-amber-bg text-amber'            },
              ].map(({ v, l, c }) => (
                <button key={v} type="button" onClick={() => { touch(); setForm(f => ({ ...f, urgency: v })) }}
                  className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
                    form.urgency === v ? c : 'border-surface-border text-zinc-600 hover:border-zinc-700'
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label text-[10px] block mb-1.5">Contexto del proyecto</label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={e => { touch(); setForm(f => ({ ...f, notes: e.target.value })) }}
              placeholder="Describe tu infraestructura actual, puntos de dolor específicos o el resultado que buscas..."
              className="w-full bg-surface-dark border border-surface-border rounded-lg px-4 py-3 text-noc-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-600 transition-colors resize-none"
            />
          </div>

          {form.services.length === 0 && (
            <p className="text-zinc-500 text-xs text-center">Selecciona al menos un área para continuar.</p>
          )}

          {status === 'error' && (
            <p className="text-noc-red text-sm text-center">No se pudo enviar tu solicitud. Por favor intenta de nuevo.</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || form.services.length === 0}
            className="w-full btn-amber py-4 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Enviando...' : 'Solicitar diagnóstico gratuito →'}
          </button>

          <p className="text-center text-zinc-700 text-xs font-mono">
            Responde un ingeniero en &lt; 24 h hábiles · Sin spam · Sin compromiso
          </p>
        </form>
      </div>
    </div>
  )
}
