'use client'
import { useState } from 'react'

const SERVICES = [
  'Redes & Conectividad',
  'CCTV & Vigilancia',
  'Microsoft 365 / Cloud',
  'Intune & Entra ID',
  'Monitoreo NOC',
  'Auditoría IT',
  'Otro',
]

const SIZES = ['1–10', '11–50', '51–200', '200+']

type Form = {
  name: string; email: string; company: string; phone: string
  size: string; services: string[]; urgency: string; notes: string
}

const EMPTY: Form = { name: '', email: '', company: '', phone: '', size: '', services: [], urgency: 'normal', notes: '' }

export default function AssessmentsPage() {
  const [form, setForm]     = useState<Form>(EMPTY)
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  const toggleSvc = (s: string) =>
    setForm(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1000)) // TODO: wire to Strapi/n8n webhook
    setStatus('done')
    setForm(EMPTY)
  }

  if (status === 'done') return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="noc-card border-noc-green/40 text-center p-12 max-w-md w-full">
        <div className="w-12 h-12 rounded-full bg-noc-green-bg border border-noc-green/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-noc-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-noc-white mb-2">Solicitud recibida</h2>
        <p className="text-zinc-500 text-sm mb-6">Nuestro equipo te contactará en menos de 24 horas hábiles.</p>
        <button onClick={() => setStatus('idle')} className="btn-ghost text-sm px-6 py-2.5">
          Nueva solicitud
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <span className="label">Evaluación gratuita</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-noc-white mt-3 mb-4">
            Diagnóstico técnico
          </h1>
          <p className="text-zinc-500">
            Completa el formulario y recibe una evaluación de tu infraestructura con recomendaciones y cotización en 24 h.
          </p>
        </div>

        <form onSubmit={submit} className="noc-card space-y-6">

          {/* Contact */}
          <div>
            <h3 className="text-noc-white font-medium mb-4 pb-3 border-b border-surface-border">Información de contacto</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'name',    label: 'Nombre completo',  type: 'text',  placeholder: 'Juan Pérez',           req: true  },
                { key: 'email',   label: 'Correo electrónico', type: 'email', placeholder: 'juan@empresa.com',    req: true  },
                { key: 'company', label: 'Empresa',           type: 'text',  placeholder: 'Corporativo XYZ',      req: true  },
                { key: 'phone',   label: 'Teléfono',          type: 'tel',   placeholder: '+52 55 0000 0000',     req: false },
              ].map(({ key, label, type, placeholder, req }) => (
                <div key={key}>
                  <label className="label text-[10px] block mb-1.5">{label}</label>
                  <input
                    type={type}
                    required={req}
                    value={form[key as keyof Form] as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
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
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, size: s }))}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    form.size === s ? 'border-amber/60 bg-amber-bg text-amber' : 'border-surface-border text-zinc-500 hover:border-zinc-600'
                  }`}>
                  {s} empleados
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-noc-white font-medium mb-4 pb-3 border-b border-surface-border">Servicios requeridos</h3>
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
                      {active && <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 12 12"><path d="M3.5 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>}
                    </div>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="label text-[10px] block mb-2">Urgencia</label>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 'low',    l: 'Planificando (1–3 meses)', c: 'border-noc-green/50 bg-noc-green-bg text-noc-green' },
                { v: 'normal', l: 'Pronto (2–4 semanas)',      c: 'border-noc-blue/50 bg-noc-blue-bg text-noc-blue'   },
                { v: 'high',   l: 'Urgente (esta semana)',     c: 'border-amber/50 bg-amber-bg text-amber'            },
              ].map(({ v, l, c }) => (
                <button key={v} type="button" onClick={() => setForm(f => ({ ...f, urgency: v }))}
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
            <label className="label text-[10px] block mb-1.5">Situación actual / Notas</label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Describe brevemente tu infraestructura actual, puntos de dolor o requerimientos específicos..."
              className="w-full bg-surface-dark border border-surface-border rounded-lg px-4 py-3 text-noc-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-600 transition-colors resize-none"
            />
          </div>

          {status === 'error' && (
            <p className="text-noc-red text-sm">Error al enviar. Por favor intenta de nuevo.</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || form.services.length === 0}
            className="w-full btn-amber py-4 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Enviando...' : 'Solicitar diagnóstico gratuito →'}
          </button>

          <p className="text-center text-zinc-700 text-xs font-mono">
            Respondemos en menos de 1 día hábil. Sin spam, sin compromiso.
          </p>
        </form>
      </div>
    </div>
  )
}
