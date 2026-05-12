'use client'
import { useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/components/Analytics'

const SERVICES = [
  'Redes & Ciberseguridad',
  'Identidad & Acceso (Intune / Entra ID)',
  'Videovigilancia IP',
  'Microsoft 365 / Cloud',
  'Monitoreo y soporte',
  'Otro',
]

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
const WA_HREF = WA_NUMBER
  ? `https://wa.me/${WA_NUMBER}?text=Hola%2C%20quiero%20hablar%20con%20un%20ingeniero%20de%20Velkor`
  : null

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function ContactForm() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [company, setCompany] = useState('')
  const [phone,   setPhone]   = useState('')
  const [service, setService] = useState('')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, phone, service, message }),
      })
      if (!res.ok) { setStatus('error'); return }
      setStatus('done')
      trackEvent('ContactoEnviado', { service })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="card p-10 text-center border-noc-green/30">
        <div className="w-12 h-12 rounded-full bg-noc-green-bg border border-noc-green/30 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-noc-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-noc-white mb-2">Mensaje recibido</h2>
        <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">
          Nuestro equipo te contactará en menos de 24 horas hábiles.
        </p>
        <button onClick={() => setStatus('idle')} className="btn-ghost text-sm px-6 py-2.5">
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">

      {/* Left — form */}
      <form onSubmit={submit} className="card p-8 space-y-6">
        <h2 className="text-noc-white font-black text-xl mb-2">Envíanos un mensaje</h2>

        {/* Contact fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'name',    label: 'Nombre completo',    type: 'text',  value: name,    setter: setName,    placeholder: 'Juan Pérez',       req: true  },
            { key: 'email',   label: 'Correo electrónico', type: 'email', value: email,   setter: setEmail,   placeholder: 'juan@empresa.com', req: true  },
            { key: 'company', label: 'Empresa',            type: 'text',  value: company, setter: setCompany, placeholder: 'Corporativo XYZ',  req: true  },
            { key: 'phone',   label: 'Teléfono (opcional)', type: 'tel',  value: phone,   setter: setPhone,   placeholder: '+52 55 0000 0000', req: false },
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
        </div>

        {/* Service selector */}
        <div>
          <label className="label text-[10px] block mb-2">Área de interés</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {SERVICES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setService(service === s ? '' : s)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs text-left transition-all ${
                  service === s
                    ? 'border-amber/50 bg-amber-bg text-noc-white'
                    : 'border-surface-border text-zinc-500 hover:border-zinc-600'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  service === s ? 'bg-amber border-amber' : 'border-zinc-700'
                }`}>
                  {service === s && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="label text-[10px] block mb-1.5">Mensaje</label>
          <textarea
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Cuéntanos sobre tu infraestructura actual o lo que necesitas..."
            className="w-full bg-surface-dark border border-surface-border rounded-lg px-4 py-3 text-noc-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-600 transition-colors resize-none"
          />
        </div>

        {status === 'error' && (
          <p className="text-red-400 text-xs text-center">
            No se pudo enviar. Inténtalo de nuevo o contáctanos por WhatsApp.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full btn-amber py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar mensaje →'}
        </button>

        <p className="text-center text-zinc-700 text-xs font-mono">
          Respondemos en menos de 1 día hábil. Sin spam.
        </p>
      </form>

      {/* Right — alternatives */}
      <div className="space-y-4">

        {/* WhatsApp */}
        {WA_HREF && (
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('WhatsAppClick', { page: 'contacto' })}
            className="block card p-6 hover:border-zinc-600 transition-colors group"
            style={{ borderLeftColor: '#25d366', borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#25d36618' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: '#25d366' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <div className="text-noc-white font-semibold text-sm group-hover:text-white transition-colors">WhatsApp</div>
                <div className="text-zinc-500 text-xs">Respuesta en minutos</div>
              </div>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-zinc-600 ml-auto">
                <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
              </svg>
            </div>
          </a>
        )}

        {/* Calendly */}
        {CALENDLY_URL ? (
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('CalendlyClick', { page: 'contacto' })}
            className="block card p-6 hover:border-zinc-600 transition-colors group"
            style={{ borderLeftColor: '#f59e0b', borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-bg">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber">
                  <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-noc-white font-semibold text-sm group-hover:text-white transition-colors">Agendar llamada</div>
                <div className="text-zinc-500 text-xs">Elige un horario disponible</div>
              </div>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-zinc-600 ml-auto">
                <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
              </svg>
            </div>
          </a>
        ) : (
          <div className="card p-6 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-bg">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber">
                  <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-noc-white font-semibold text-sm">Agendar llamada</div>
                <div className="text-zinc-500 text-xs">Disponible próximamente</div>
              </div>
            </div>
          </div>
        )}

        {/* Diagnóstico CTA */}
        <div className="card p-6" style={{ borderColor: '#f59e0b30' }}>
          <div className="text-xs font-mono text-zinc-600 mb-3">EVALUACIÓN TÉCNICA</div>
          <h3 className="text-noc-white font-bold text-sm mb-2">¿Necesitas una auditoría completa?</h3>
          <p className="text-zinc-500 text-xs leading-relaxed mb-4">
            El diagnóstico técnico es más profundo que un mensaje. Evaluamos redes, identidades y dispositivos en detalle.
          </p>
          <Link href="/assessments" className="btn-amber block text-center py-2.5 text-sm">
            Formulario de diagnóstico →
          </Link>
        </div>
      </div>
    </div>
  )
}
