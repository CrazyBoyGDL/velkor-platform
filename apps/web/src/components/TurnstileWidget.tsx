'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/components/Analytics'
import { Events } from '@/lib/analyticsEvents'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onVelkorTurnstileLoad'

type TurnstileWidgetStatus = 'loading' | 'ready' | 'verified' | 'expired' | 'error' | 'network-error'

type TurnstileRenderOptions = {
  sitekey: string
  theme: 'dark' | 'light' | 'auto'
  size: 'normal' | 'compact' | 'flexible'
  action?: string
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': (code?: string) => void
  'timeout-callback': () => void
}

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    onVelkorTurnstileLoad?: () => void
  }
}

export function isTurnstileEnabled(): boolean {
  return Boolean(TURNSTILE_SITE_KEY)
}

export default function TurnstileWidget({
  onTokenChange,
  resetSignal,
  action = 'assessment',
  verificationLabel = 'Verificación anti-abuso',
  verificationHelp = 'Protección Cloudflare Turnstile activa para producción.',
  verifiedMessage = 'Verificación completada. Puedes continuar.',
}: {
  onTokenChange: (token: string) => void
  resetSignal: number
  action?: 'assessment' | 'contact' | 'resource'
  verificationLabel?: string
  verificationHelp?: string
  verifiedMessage?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [status, setStatus] = useState<TurnstileWidgetStatus>('loading')

  const clearToken = useCallback(() => {
    onTokenChange('')
  }, [onTokenChange])

  const renderWidget = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current || !window.turnstile || widgetIdRef.current) return
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current)
      loadTimerRef.current = null
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme:   'dark',
      size:    'flexible',
      action,
      callback(token) {
        setStatus('verified')
        onTokenChange(token)
        trackEvent(Events.TurnstileVerified, { action })
      },
      'expired-callback'() {
        setStatus('expired')
        clearToken()
        trackEvent(Events.TurnstileExpired, { action })
      },
      'error-callback'(code) {
        setStatus('error')
        clearToken()
        trackEvent(Events.TurnstileError, { action, reason: code ?? 'widget-error' })
      },
      'timeout-callback'() {
        setStatus('expired')
        clearToken()
        trackEvent(Events.TurnstileExpired, { action, reason: 'timeout' })
      },
    })

    setStatus('ready')
  }, [action, clearToken, onTokenChange])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      clearToken()
      return
    }

    window.onVelkorTurnstileLoad = () => setScriptReady(true)

    if (window.turnstile) {
      setScriptReady(true)
      return
    }

    loadTimerRef.current = setTimeout(() => {
      if (!window.turnstile) {
        setStatus('network-error')
        trackEvent(Events.TurnstileError, { action, reason: 'script-timeout' })
      }
    }, 8000)

    return () => {
      delete window.onVelkorTurnstileLoad
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current)
    }
  }, [action, clearToken])

  useEffect(() => {
    if (scriptReady) renderWidget()
  }, [renderWidget, scriptReady])

  useEffect(() => {
    if (!resetSignal || !widgetIdRef.current || !window.turnstile) return
    window.turnstile.reset(widgetIdRef.current)
    setStatus('ready')
    clearToken()
  }, [clearToken, resetSignal])

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [])

  const retry = useCallback(() => {
    setStatus('loading')
    clearToken()
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
      setStatus('ready')
      return
    }
    if (window.turnstile) {
      renderWidget()
      return
    }
    window.location.reload()
  }, [clearToken, renderWidget])

  if (!TURNSTILE_SITE_KEY) return null

  return (
    <div className="rounded-xl border border-surface-border bg-surface-dark/70 px-4 py-3" aria-live="polite">
      <Script
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => {
          setStatus('network-error')
          clearToken()
          trackEvent(Events.TurnstileError, { action, reason: 'script-load-failed' })
        }}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="label text-[9.5px] mb-1">{verificationLabel}</div>
          <p className="text-[11px] text-zinc-600 leading-snug">
            {verificationHelp}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <div
            ref={containerRef}
            className="min-h-[65px] min-w-0 w-full sm:min-w-[260px] max-w-full overflow-hidden"
            role="group"
            aria-label="Cloudflare Turnstile"
          />
        </div>
      </div>
      {status === 'verified' && (
        <p className="text-[11px] text-[#7aa88d] mt-2">{verifiedMessage}</p>
      )}
      {status === 'expired' && (
        <p className="text-[11px] text-amber mt-2">La verificación expiró. Confírmala nuevamente para enviar.</p>
      )}
      {status === 'error' && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
          <p className="text-[11px] text-red-400">La verificación no pudo completarse. Actualízala e intenta de nuevo.</p>
          <button type="button" onClick={retry} className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 underline underline-offset-4">
            Reintentar
          </button>
        </div>
      )}
      {status === 'network-error' && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
          <p className="text-[11px] text-amber">No se pudo cargar Turnstile. Revisa bloqueadores de scripts o recarga la página.</p>
          <button type="button" onClick={retry} className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 underline underline-offset-4">
            Reintentar
          </button>
        </div>
      )}
      {status === 'loading' && (
        <p className="text-[11px] text-zinc-700 mt-2">Cargando verificación...</p>
      )}
    </div>
  )
}
