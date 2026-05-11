import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Velkor Platform - SOC/NOC Operations',
  description: 'Enterprise infrastructure, networking, CCTV, and cloud services platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-noc-dark text-noc-gray-light">
        {children}
      </body>
    </html>
  )
}
