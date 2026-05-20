import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { TRUST } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contáctanos por formulario, WhatsApp o agenda una llamada directamente. Nuestro equipo responde en menos de 24 horas hábiles.',
  alternates: { canonical: 'https://velkor.com.mx/contacto' },
  openGraph: {
    title: 'Contacto | Velkor',
    description: 'Escríbenos o agenda una llamada. Respuesta en menos de 24 horas.',
  },
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <span className="label">Hablemos</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight">
            Contacto directo<br />{' '}
            <span className="text-gradient-amber">sin burocracia</span>
          </h1>
          <p className="text-zinc-500 text-base max-w-xl leading-relaxed">
            Escríbenos por el canal que prefieras. Respondemos directamente con un ingeniero, no con un bot de ventas.
          </p>
        </div>

        <div className="contact-trust-band mb-10">
          <div>
            <span>Respuesta humana</span>
            <strong>Menos de 24 horas hábiles</strong>
          </div>
          {TRUST.secureCommunications.map(item => (
            <div key={item}>
              <span>Operación segura</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
