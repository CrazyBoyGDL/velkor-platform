import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatusBar from '@/components/StatusBar'
import FloatingCTA from '@/components/FloatingCTA'
import SocialProof from '@/components/SocialProof'

export const metadata: Metadata = {
  title: 'Velkor System — Consultoría IT Empresarial',
  description: 'Redes, ciberseguridad y Modern Workplace para empresas que no pueden permitirse interrupciones. NOC 24/7.',
  icons: {
    icon: [
      { url: '/favicon.svg',       media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-white.svg', media: '(prefers-color-scheme: light)' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-surface-dark text-noc-white min-h-screen flex flex-col">
        <StatusBar />
        <Navbar />
        <main className="flex-1 pt-[100px]">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
        <SocialProof />
      </body>
    </html>
  )
}
