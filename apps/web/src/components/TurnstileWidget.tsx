'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef, useState } from 'react'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onVelkorTurnstileLoad'

type TurnstileWidgetStatus = 'loading' | 'ready' | 'verified' | 'expired' | 'error'

type TurnstileRenderOptions = {
  sitekey: string
  theme: 'dark' | 'light' | 'auto'
  size: 'normal' | 'compact' | 'flexible'
  action?: string
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
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
}: {
  onTokenChange: (token: string) => void
  resetSignal: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [status, setStatus] = useState<TurnstileWidgetStatus>('loading')

  const clearToken = useCallback(() => {
    onTokenChange('')
  }, [onTokenChange])

  const renderWidget = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current || !window.turnstile || widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme:   'dark',
      size:    'flexible',
      action:  'assessment',
      callback(token) {
        setStatus('verified')
        onTokenChange(token)
      },
      'expired-callback'() {
        setStatus('expired')
        clearToken()
      },
      'error-callback'() {
        setStatus('error')
        clearToken()
      },
    })

    setStatus('ready')
  }, [clearToken, onTokenChange])

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

    return () => {
      delete window.onVelkorTurnstileLoad
    }
  }, [clearToken])

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

  if (!TURNSTILE_SITE_KEY) return null

  return (
    <div className="rounded-xl border border-surface-border bg-surface-dark/70 px-4 py-3">
      <Script
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => {
          setStatus('error')
          clearToken()
        }}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="label text-[9.5px] mb-1">Verificación anti-abuso</div>
          <p className="text-[11px] text-zinc-600 leading-snug">
            Protección Cloudflare Turnstile activa para producción.
          </p>
        </div>
        <div
          ref={containerRef}
          className="min-h-[65px] min-w-[260px] max-w-full overflow-hidden"
          aria-label="Cloudflare Turnstile"
        />
      </div>
      {status === 'expired' && (
        <p className="text-[11px] text-amber mt-2">La verificación expiró. Confírmala nuevamente para enviar.</p>
      )}
      {status === 'error' && (
        <p className="text-[11px] text-red-400 mt-2">No se pudo cargar la verificación. Recarga la página e intenta de nuevo.</p>
      )}
      {status === 'loading' && (
        <p className="text-[11px] text-zinc-700 mt-2">Cargando verificación...</p>
      )}
    </div>
  )
}
