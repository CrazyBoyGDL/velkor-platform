import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY, CONTACT, SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: `Términos de Servicio | ${COMPANY.name}`,
  description: `Términos y condiciones de uso de los servicios de ${COMPANY.name}.`,
  alternates: { canonical: `${SITE_URL}/legal/terminos` },
  robots: { index: false },
}

const LAST_UPDATED = '13 de mayo de 2026'

export default function TermsPage() {
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
            Términos de Servicio
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
            Estos términos están en proceso de revisión legal. Para consultas contractuales específicas,
            contáctanos en{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
              {CONTACT.email}
            </a>
            .
          </p>
        </div>

        <div className="space-y-8 text-zinc-500 text-sm leading-relaxed">

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">1. Aceptación de términos</h2>
            <p>
              Al acceder y utilizar los servicios de {COMPANY.name}, incluyendo el sitio web, el diagnóstico
              operacional y los materiales técnicos, aceptas cumplir con estos términos de servicio.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">2. Descripción del servicio</h2>
            <p>
              {COMPANY.name} ofrece servicios de consultoría tecnológica empresarial, incluyendo diseño e
              implementación de infraestructura de red, ciberseguridad, identidad digital, y sistemas de
              videovigilancia. Los términos específicos de cada proyecto se establecen en un Acuerdo de
              Alcance (SOW) firmado por ambas partes.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">3. Diagnóstico operacional gratuito</h2>
            <p>
              El diagnóstico operacional disponible en este sitio es una herramienta de evaluación de referencia.
              Los resultados son indicativos y no constituyen una auditoría técnica formal. {COMPANY.name} no
              garantiza la exactitud de los resultados basados en la información proporcionada por el usuario.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">4. Confidencialidad</h2>
            <p>
              La información de infraestructura que proporciones durante el diagnóstico se maneja con
              estricta confidencialidad y no se comparte con terceros. Consulta nuestro{' '}
              <Link href="/legal/privacidad" className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                Aviso de Privacidad
              </Link>
              {' '}para detalles sobre el tratamiento de datos.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">5. Propiedad intelectual</h2>
            <p>
              Los materiales técnicos, metodologías, diagramas y documentación publicados en este sitio
              son propiedad de {COMPANY.name}. El contenido puede ser utilizado como referencia para
              evaluación interna pero no puede ser reproducido o distribuido sin autorización escrita.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">6. Limitación de responsabilidad</h2>
            <p>
              {COMPANY.name} no será responsable por daños indirectos, incidentales o consecuentes
              derivados del uso de la información publicada en este sitio. Los proyectos de implementación
              están sujetos a los términos específicos del SOW acordado.
            </p>
          </section>

          <section>
            <h2 className="text-noc-white font-bold text-base mb-3">7. Jurisdicción</h2>
            <p>
              Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier
              controversia, las partes se someten a la jurisdicción de los tribunales competentes de
              {' '}{COMPANY.region}.
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
