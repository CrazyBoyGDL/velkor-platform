import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diagnóstico de Infraestructura IT | Velkor Systems',
  description: 'Solicita una evaluación técnica de tu infraestructura IT: redes, seguridad, identidad y videovigilancia. Ruta inicial en menos de 48 horas.',
  alternates: { canonical: 'https://velkor.com.mx/assessments' },
  openGraph: {
    title: 'Diagnóstico IT Gratuito | Velkor Systems',
    description: 'Evaluación de infraestructura y propuesta técnica personalizada en menos de 48 horas.',
  },
}

export default function AssessmentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
