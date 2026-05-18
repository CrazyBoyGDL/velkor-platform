import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiénes Somos | Velkor Systems — Infraestructura Operacional',
  description: 'Desde 2016, el equipo técnico de Velkor implementa infraestructura IT para más de 50 empresas en México: redes, identidad Microsoft y videovigilancia IP.',
  alternates: { canonical: 'https://velkor.com.mx/nosotros' },
  openGraph: {
    title: 'Quiénes Somos | Velkor Systems',
    description: 'Ingeniería operativa con ejecución directa en campo desde 2016.',
  },
}

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children
}
