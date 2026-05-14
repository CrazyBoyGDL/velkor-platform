import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios IT Empresariales | Redes, CCTV, Microsoft 365 e Intune',
  description: 'Catálogo completo de servicios IT: diseño LAN/WAN, videovigilancia IP, Microsoft 365, Entra ID e Intune para empresas en México.',
  alternates: { canonical: 'https://velkor.mx/services' },
  openGraph: {
    title: 'Servicios IT | Velkor System',
    description: 'Redes, CCTV, Microsoft 365 e identidad empresarial — implementación directa.',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
