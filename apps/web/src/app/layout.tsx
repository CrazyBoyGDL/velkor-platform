import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatusBar from '@/components/StatusBar'
import FloatingCTA from '@/components/FloatingCTA'
import SocialProof from '@/components/SocialProof'
import ThemeProvider from '@/components/ThemeProvider'

const SITE_URL = 'https://velkor.mx'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Velkor — Consultoría IT Empresarial | Redes · Ciberseguridad · Microsoft 365',
    template: '%s | Velkor',
  },
  description:
    'Consultoría IT empresarial en redes, ciberseguridad Fortinet, identidad Microsoft 365, videovigilancia IP y NOC 24/7. Más de 50 clientes empresariales. Desde 2016.',
  keywords: [
    'consultoría IT', 'ciberseguridad empresarial', 'Fortinet', 'Microsoft 365',
    'Intune', 'Entra ID', 'NOC 24/7', 'CCTV IP', 'videovigilancia empresarial',
    'redes empresariales', 'Zero Trust', 'MDM', 'México',
  ],
  authors: [{ name: 'Velkor System', url: SITE_URL }],
  creator: 'Velkor System',
  publisher: 'Velkor System',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: SITE_URL,
    siteName: 'Velkor System',
    title: 'Velkor — Consultoría IT Empresarial',
    description:
      'Redes, ciberseguridad y Microsoft 365 para empresas que no pueden permitirse interrupciones.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Velkor System — Consultoría IT Empresarial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velkor — Consultoría IT Empresarial',
    description:
      'Redes, ciberseguridad y Microsoft 365 para empresas que no pueden permitirse interrupciones.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.svg',       media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-white.svg', media: '(prefers-color-scheme: light)' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Velkor System',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
      description:
        'Consultoría IT empresarial especializada en redes, ciberseguridad, identidad Microsoft, videovigilancia IP y NOC 24/7.',
      foundingDate: '2016',
      areaServed: 'MX',
      knowsAbout: [
        'Fortinet', 'Microsoft 365', 'Entra ID', 'Microsoft Intune',
        'Ciberseguridad', 'Redes Empresariales', 'Videovigilancia IP', 'CCTV',
        'Zero Trust', 'MDM', 'NOC', 'SD-WAN',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: 'Velkor System',
      url: SITE_URL,
      description:
        'Consultoría IT empresarial: redes y ciberseguridad, gestión de identidad Microsoft, videovigilancia IP.',
      areaServed: { '@type': 'Country', name: 'México' },
      serviceType: [
        'Consultoría IT',
        'Ciberseguridad Empresarial',
        'Redes Empresariales',
        'Microsoft 365',
        'Videovigilancia IP',
        'NOC 24/7',
      ],
      provider: { '@id': `${SITE_URL}/#organization` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth dark" suppressHydrationWarning>
      <body className="bg-surface-dark text-noc-white min-h-screen flex flex-col transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <StatusBar />
          <Navbar />
          <main className="flex-1 pt-[100px]">
            {children}
          </main>
          <Footer />
          <FloatingCTA />
          <SocialProof />
        </ThemeProvider>
      </body>
    </html>
  )
}
