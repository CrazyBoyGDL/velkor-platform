import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY, CONTACT, SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: `Política de Cookies | ${COMPANY.name}`,
  description: `Política de cookies y medición de ${COMPANY.name}.`,
  alternates: { canonical: `${SITE_URL}/legal/cookies` },
  robots: { index: false },
}

const LAST_UPDATED = '15 de mayo de 2026'

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors">
            ← Inicio
          </Link>
        </div>

        <div className="mb-10">
          <span className="label block mb-3">Legal</span>
          <h1 className="text-3xl sm:text-4xl font-black text-noc-white mb-3">
            Política de Cookies
          </h1>
          <p className="text-zinc-600 text-xs font-mono">Última actualización: {LAST_UPDATED}</p>
        </div>

        <div className="mb-8 p-5 rounded-xl" style={{ background: 'rgba(72,120,176,0.05)', border: '1px solid rgba(72,120,176,0.15)' }}>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Esta política está preparada para producción y debe ser revisada legalmente antes de activar dominio final.
            La medición del sitio está diseñada para operar sin datos personales identificables.
          </p>
        </div>

        <div className="space-y-8 text-zinc-500 text-sm leading-relaxed">
          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Uso de cookies</h2>
            <p>
              El sitio puede usar cookies técnicas necesarias para seguridad, navegación y operación del diagnóstico.
              No usamos cookies para vender datos personales ni para perfilar visitantes de forma invasiva.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Analítica operacional</h2>
            <p>
              Cuando se active Plausible o PostHog, la medición se limita a eventos operativos: interacción con CTA,
              avance del diagnóstico, descargas de artefactos y profundidad de lectura. Los formularios y datos de
              contacto permanecen fuera del payload de analítica.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Gestión y desactivación</h2>
            <p>
              Puedes bloquear cookies desde la configuración de tu navegador. Algunas funciones técnicas, como protección
              anti-abuso o persistencia temporal de sesión, podrían degradarse si se bloquean todas las cookies.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Contacto</h2>
            <p>
              Para consultas sobre privacidad o medición, escribe a{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                {CONTACT.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
