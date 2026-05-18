import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MobileConsultiveCTA from '@/components/MobileConsultiveCTA'
import OperationalAtmosphere from '@/components/OperationalAtmosphere'
import ThemeProvider from '@/components/ThemeProvider'
import { Analytics } from '@/components/Analytics'
import { VisualIntelligenceTracker } from '@/components/VisualIntelligence'
import { COMPANY, OG_IMAGES, SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Velkor Systems — Infraestructura Operacional | Gobierno Tecnológico',
    template: '%s | Velkor Systems',
  },
  description:
    'Infraestructura operacional, gobierno tecnológico y continuidad empresarial para redes, identidad, ciberseguridad y sistemas críticos.',
  keywords: [
    'consultoría IT', 'ciberseguridad empresarial', 'Fortinet', 'Microsoft 365',
    'Intune', 'Entra ID', 'CCTV IP', 'videovigilancia empresarial',
    'redes empresariales', 'acceso gobernado', 'MDM', 'México',
  ],
  authors: [{ name: COMPANY.name, url: SITE_URL }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: SITE_URL,
    siteName: COMPANY.name,
    title: 'Velkor Systems — Infraestructura Operacional',
    description:
      'Gobierno tecnológico, observabilidad y continuidad para empresas que operan infraestructura crítica.',
    images: [
      {
        url: OG_IMAGES.home,
        width: 1200,
        height: 630,
        alt: 'Velkor Systems — Infrastructure Control Plane',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velkor Systems — Infraestructura Operacional',
    description:
      'Gobierno tecnológico, observabilidad y continuidad para infraestructura crítica.',
    images: [OG_IMAGES.home],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicons/favicon.ico',
    apple: '/favicons/apple-touch-icon.png',
    other: [{ rel: 'mask-icon', url: '/favicons/pinned-tab.svg', color: '#284257' }],
  },
  appleWebApp: {
    title: 'Velkor Systems',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#07101a' },
    { media: '(prefers-color-scheme: light)', color: '#f4f7fb' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: COMPANY.name,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/brand/symbol-dark.svg`,
      },
      description:
        'Infraestructura operacional, gobierno tecnológico, observabilidad y continuidad para sistemas críticos.',
      foundingDate: '2016',
      areaServed: 'MX',
      knowsAbout: [
        'Fortinet', 'Microsoft 365', 'Entra ID', 'Microsoft Intune',
        'Ciberseguridad', 'Redes Empresariales', 'Videovigilancia IP', 'CCTV',
        'Acceso gobernado', 'MDM', 'SD-WAN',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: COMPANY.name,
      url: SITE_URL,
      description:
        'Infraestructura operacional: redes, ciberseguridad, identidad Microsoft, observabilidad y continuidad.',
      areaServed: { '@type': 'Country', name: 'México' },
      serviceType: [
        'Consultoría IT',
        'Ciberseguridad Empresarial',
        'Redes Empresariales',
        'Microsoft 365',
        'Videovigilancia IP',
        'Gestión de Identidad',
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
        <Analytics />
        <ThemeProvider>
          <OperationalAtmosphere />
          <VisualIntelligenceTracker />
          <Navbar />
          <main className="flex-1 pt-[64px]">
            {children}
          </main>
          <MobileConsultiveCTA />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
