import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contáctanos por formulario, WhatsApp o agenda una llamada directamente. Nuestro equipo responde en menos de 24 horas hábiles.',
  alternates: { canonical: 'https://velkor.mx/contacto' },
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
            Contacto directo<br />
            <span className="text-gradient-amber">sin burocracia</span>
          </h1>
          <p className="text-zinc-500 text-base max-w-xl leading-relaxed">
            Escríbenos por el canal que prefieras. Respondemos directamente con un ingeniero, no con un bot de ventas.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
