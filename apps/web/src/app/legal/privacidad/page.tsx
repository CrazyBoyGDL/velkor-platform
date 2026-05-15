import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY, CONTACT, SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: `Aviso de Privacidad | ${COMPANY.name}`,
  description: `Aviso de privacidad de ${COMPANY.name}. Información sobre el tratamiento de datos personales conforme a la LFPDPPP.`,
  alternates: { canonical: `${SITE_URL}/legal/privacidad` },
  robots: { index: false },  // Legal pages excluded from indexing until finalized
}

const LAST_UPDATED = '13 de mayo de 2026'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path d="M3.828 7H14a1 1 0 110 2H3.828l2.829 2.828a1 1 0 11-1.414 1.414L1 9l-.707-.707L1 7.586 5.243 3.343A1 1 0 016.657 4.757L3.828 7z" />
            </svg>
            Inicio
          </Link>
        </div>

        <div className="mb-10">
          <span className="label block mb-3">Legal</span>
          <h1 className="text-3xl sm:text-4xl font-black text-noc-white mb-3">
            Aviso de Privacidad
          </h1>
          <p className="text-zinc-600 text-xs font-mono">
            Última actualización: {LAST_UPDATED}
          </p>
        </div>

        <div
          className="mb-8 p-5 rounded-xl"
          style={{ background: 'rgba(176,120,40,0.05)', border: '1px solid rgba(176,120,40,0.15)' }}
        >
          <p className="text-zinc-500 text-sm leading-relaxed">
            Este aviso de privacidad está en proceso de revisión legal. Si tienes preguntas sobre el tratamiento
            de tus datos personales, contáctanos directamente a{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
              {CONTACT.email}
            </a>
            .
          </p>
        </div>

        <div className="space-y-8 text-zinc-500 text-sm leading-relaxed">

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Responsable del tratamiento</h2>
            <p>
              <strong className="text-zinc-300">{COMPANY.name}</strong> es responsable del tratamiento de los datos personales
              que proporciones a través de este sitio web, con domicilio en {COMPANY.region}, {COMPANY.country}.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Datos personales recabados</h2>
            <p className="mb-3">Recabamos los siguientes datos personales cuando utilizas nuestro formulario de diagnóstico o evaluación:</p>
            <ul className="space-y-1.5 ml-4">
              {[
                'Nombre completo',
                'Correo electrónico corporativo',
                'Nombre de empresa',
                'Número de teléfono (opcional)',
                'Información sobre infraestructura tecnológica de tu organización',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Finalidades del tratamiento</h2>
            <p className="mb-3">Tus datos personales serán utilizados para:</p>
            <ul className="space-y-1.5 ml-4">
              {[
                'Generar un diagnóstico técnico de tu infraestructura',
                'Contactarte para presentar propuestas de solución',
                'Enviarte el reporte de evaluación operacional',
                'Dar seguimiento comercial y técnico a tu solicitud',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Derechos ARCO</h2>
            <p>
              Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales (derechos ARCO),
              conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
              Para ejercer estos derechos, envía una solicitud a{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                {CONTACT.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Transferencia de datos</h2>
            <p>
              No compartimos tus datos personales con terceros no relacionados con la prestación del servicio,
              salvo cuando sea requerido por autoridad competente conforme a la ley.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">Cambios a este aviso</h2>
            <p>
              Nos reservamos el derecho de modificar este aviso de privacidad en cualquier momento.
              La versión actualizada estará disponible en esta misma página.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-border">
          <p className="text-zinc-600 text-xs font-mono">
            ¿Tienes preguntas?{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-zinc-400 hover:text-zinc-300 transition-colors">
              {CONTACT.email}
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}
