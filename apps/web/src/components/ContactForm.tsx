'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { trackCTA, trackEvent } from '@/components/Analytics'
import { Events } from '@/lib/analyticsEvents'
import { getWhatsAppHref } from '@/lib/consultiveCta'
import { CONTACT } from '@/lib/config'
import TurnstileWidget, { isTurnstileEnabled } from '@/components/TurnstileWidget'

const SERVICES = [
  'Redes & Ciberseguridad',
  'Identidad & Acceso (Intune / Entra ID)',
  'Videovigilancia IP',
  'Microsoft 365 / Cloud',
  'Monitoreo y soporte',
  'Otro',
]

const WA_HREF = getWhatsAppHref('Hola, quiero contarles un escenario técnico y revisar el primer paso con Velkor.')
const MAIL_HREF = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Escenario técnico para Velkor')}`

type Status = 'idle' | 'loading' | 'done' | 'fallback' | 'error'
type ContactFieldConfig = {
  key: string
  id: string
  name: 'name' | 'email' | 'company' | 'phone'
  label: string
  type: 'text' | 'email' | 'tel'
  value: string
  setter: (value: string) => void
  placeholder: string
  required: boolean
  autoComplete: string
  inputMode?: 'text' | 'email' | 'tel'
  enterKeyHint?: 'next' | 'done'
}

export default function ContactForm() {
  const renderedAtRef = useRef(Date.now())
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [company, setCompany] = useState('')
  const [phone,   setPhone]   = useState('')
  const [service, setService] = useState('')
  const [message, setMessage] = useState('')
  const [hp, setHp] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [started, setStarted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0)
  const turnstileRequired = isTurnstileEnabled()
  const contactFields: ContactFieldConfig[] = [
    {
      key: 'name',
      id: 'contact-name',
      name: 'name',
      label: 'Nombre completo',
      type: 'text',
      value: name,
      setter: setName,
      placeholder: 'Juan Pérez',
      required: true,
      autoComplete: 'name',
      enterKeyHint: 'next',
    },
    {
      key: 'email',
      id: 'contact-email',
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      value: email,
      setter: setEmail,
      placeholder: 'juan@empresa.com',
      required: true,
      autoComplete: 'email',
      inputMode: 'email',
      enterKeyHint: 'next',
    },
    {
      key: 'company',
      id: 'contact-company',
      name: 'company',
      label: 'Empresa',
      type: 'text',
      value: company,
      setter: setCompany,
      placeholder: 'Corporativo XYZ',
      required: true,
      autoComplete: 'organization',
      enterKeyHint: 'next',
    },
    {
      key: 'phone',
      id: 'contact-phone',
      name: 'phone',
      label: 'Teléfono (opcional)',
      type: 'tel',
      value: phone,
      setter: setPhone,
      placeholder: '+52 55 0000 0000',
      required: false,
      autoComplete: 'tel',
      inputMode: 'tel',
      enterKeyHint: 'next',
    },
  ]

  const markStarted = () => {
    if (started) return
    setStarted(true)
    trackEvent(Events.ContactFormStarted, { page: 'contacto' })
  }

  useEffect(() => {
    if (turnstileToken && status === 'error' && errorMsg === 'Confirma la verificación anti-abuso antes de enviar.') {
      setStatus('idle')
      setErrorMsg('')
    }
  }, [errorMsg, status, turnstileToken])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (turnstileRequired && !turnstileToken) {
      setStatus('error')
      setErrorMsg('Confirma la verificación anti-abuso antes de enviar.')
      trackEvent(Events.TurnstileError, { action: 'contact', reason: 'missing-token' })
      return
    }

    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          service,
          message,
          _hp: hp,
          _ts: turnstileToken,
          _elapsedMs: Date.now() - renderedAtRef.current,
        }),
      })
      const data = await res.json().catch(() => ({})) as { error?: string; fallbackUsed?: boolean; leadStored?: boolean; notified?: boolean }
      if (!res.ok) {
        setErrorMsg(data.error || 'No se pudo enviar. Inténtalo de nuevo o contáctanos por WhatsApp.')
        setStatus('error')
        setTurnstileResetSignal(signal => signal + 1)
        return
      }
      setStatus(data.fallbackUsed ? 'fallback' : 'done')
      trackEvent(Events.ContactFormSubmitted, {
        service: service || 'unspecified',
        lead_stored: String(Boolean(data.leadStored)),
        notified: String(Boolean(data.notified)),
      })
    } catch {
      setErrorMsg('No se pudo enviar. Inténtalo de nuevo o contáctanos por WhatsApp.')
      setStatus('error')
    }
  }

  if (status === 'done' || status === 'fallback') {
    return (
      <div className="contact-confirmation-surface p-10 text-center" role="status" aria-live="polite">
        <div className="w-12 h-12 rounded-full bg-noc-green-bg border border-noc-green/30 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-noc-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-noc-white mb-2">
          {status === 'fallback' ? 'Mensaje recibido por canal alterno' : 'Mensaje recibido'}
        </h2>
        <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">
          {status === 'fallback'
            ? 'El CRM no confirmó recepción, pero el equipo fue notificado para revisar tu caso.'
            : 'Nuestro equipo te contactará en menos de 24 horas hábiles.'}
        </p>
        <button onClick={() => setStatus('idle')} className="btn-ghost text-sm px-6 py-2.5">
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <div className="contact-flow-surface">

      {/* Left — form */}
      <form
        action="/api/contacto"
        method="POST"
        onSubmit={submit}
        onFocus={markStarted}
        className="contact-form-surface space-y-6"
        aria-labelledby="contact-form-title"
      >
        <h2 id="contact-form-title" className="text-noc-white font-black text-xl mb-2">Envíanos un mensaje</h2>
        <input
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={e => setHp(e.target.value)}
          className="sr-only"
          aria-hidden="true"
        />

        {/* Contact fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          {contactFields.map(field => (
            <div key={field.key}>
              <label htmlFor={field.id} className="label text-[10px] block mb-1.5">{field.label}</label>
              <input
                id={field.id}
                name={field.name}
                type={field.type}
                required={field.required}
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                enterKeyHint={field.enterKeyHint}
                aria-invalid={status === 'error' ? 'true' : undefined}
                aria-describedby={status === 'error' ? 'contact-error' : undefined}
                className="w-full min-h-12 bg-surface-dark border border-surface-border rounded-lg px-4 py-3 text-noc-white placeholder-zinc-700 text-base sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 focus:border-zinc-600 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Service selector */}
        <fieldset>
          <legend className="label text-[10px] block mb-2">Área de interés</legend>
          <div className="grid sm:grid-cols-2 gap-2">
            {SERVICES.map((s, index) => {
              const id = `contact-service-${index}`
              return (
              <label
                key={s}
                htmlFor={id}
                className={`contact-service-option flex min-h-12 cursor-pointer items-center gap-3 px-4 py-3 rounded-lg border text-xs text-left transition-all focus-within:ring-2 focus-within:ring-amber/35 ${
                  service === s
                    ? 'contact-service-option--selected border-amber/50 bg-amber-bg text-noc-white'
                    : 'border-surface-border text-zinc-500 hover:border-zinc-600'
                }`}
              >
                <input
                  id={id}
                  className="sr-only"
                  type="radio"
                  name="service"
                  value={s}
                  checked={service === s}
                  onChange={() => setService(s)}
                />
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  service === s ? 'bg-amber border-amber' : 'border-zinc-700'
                }`}>
                  {service === s && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
                {s}
              </label>
            )})}
          </div>
        </fieldset>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="label text-[10px] block mb-1.5">Mensaje</label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            autoComplete="off"
            enterKeyHint="done"
            placeholder="Cuéntanos sobre tu infraestructura actual o lo que necesitas..."
            aria-invalid={status === 'error' ? 'true' : undefined}
            aria-describedby={status === 'error' ? 'contact-error' : undefined}
            className="w-full min-h-28 bg-surface-dark border border-surface-border rounded-lg px-4 py-3 text-noc-white placeholder-zinc-700 text-base sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 focus:border-zinc-600 transition-colors resize-y"
          />
        </div>

        <TurnstileWidget
          action="contact"
          onTokenChange={setTurnstileToken}
          resetSignal={turnstileResetSignal}
          verificationHelp="Protege este formulario contra envíos automatizados."
          verifiedMessage="Verificación completada. Puedes enviar el mensaje."
        />

        {status === 'error' && (
          <p id="contact-error" role="alert" className="text-red-400 text-xs text-center">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || (turnstileRequired && !turnstileToken)}
          className="w-full btn-amber py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar mensaje →'}
        </button>

        <p className="text-center text-zinc-700 text-xs font-mono">
          Respondemos en menos de 1 día hábil. Sin spam.
        </p>
      </form>

      {/* Right — alternatives */}
      <div className="contact-routes-surface">

        {/* WhatsApp */}
        {WA_HREF && (
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('WhatsApp contacto', 'contact-alternatives', { channel: 'whatsapp' })}
            className="contact-route group"
            style={{ borderLeftColor: '#638fa9', borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,143,169,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: '#9fc3d4' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <div className="text-noc-white font-semibold text-sm group-hover:text-white transition-colors">WhatsApp técnico</div>
                <div className="text-zinc-500 text-xs">Cuéntanos el escenario</div>
              </div>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-zinc-600 ml-auto">
                <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
              </svg>
            </div>
          </a>
        )}
        <a
          href={MAIL_HREF}
          onClick={() => trackCTA('Email contacto', 'contact-alternatives', { channel: 'email' })}
          className="contact-route group"
          style={{ borderLeftColor: '#638fa9', borderLeftWidth: 3 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,143,169,0.12)' }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" style={{ color: '#5f839b' }}>
                <path d="M2.94 5.34A2.25 2.25 0 0 1 5.08 3.8h9.84c.98 0 1.82.63 2.14 1.54L10 9.68 2.94 5.34Z" />
                <path d="M2.75 6.74v6.71a2.25 2.25 0 0 0 2.25 2.25h10a2.25 2.25 0 0 0 2.25-2.25V6.74l-6.58 4.04a1.3 1.3 0 0 1-1.34 0L2.75 6.74Z" />
              </svg>
            </div>
            <div>
              <div className="text-noc-white font-semibold text-sm group-hover:text-white transition-colors">Correo directo</div>
              <div className="text-zinc-500 text-xs">{CONTACT.email}</div>
            </div>
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-zinc-600 ml-auto">
              <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
            </svg>
          </div>
        </a>

        {/* Diagnóstico CTA */}
        <div className="contact-route contact-route--diagnostic">
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
