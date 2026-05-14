import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Recursos Técnicos Gratuitos | Guías y Checklists IT',
  description:
    'Checklists y guías técnicas gratuitas: hardening Fortinet, implementación de Intune y evaluación de sistemas CCTV. Acceso inmediato sin costo.',
  alternates: { canonical: 'https://velkor.mx/recursos' },
  openGraph: {
    title: 'Recursos Técnicos Gratuitos | Velkor',
    description: 'Guías y checklists para equipos IT: Fortinet, Intune, CCTV.',
  },
}

const RESOURCES = [
  {
    href: '/recursos/intune-checklist',
    hex: '#3a7858',
    eyebrow: 'IDENTIDAD & ACCESO',
    title: 'Lista de verificación: Implementación de Microsoft Intune',
    desc: 'Checklist de 30+ puntos para desplegar Intune correctamente: desde licencias hasta Autopilot y políticas de cumplimiento.',
    tags: ['Intune', 'Entra ID', 'Autopilot', 'MFA'],
    time: '10 min lectura',
  },
  {
    href: '/recursos/fortinet-hardening',
    hex: '#4878b0',
    eyebrow: 'REDES & CIBERSEGURIDAD',
    title: 'Guía de Hardening: Fortinet FortiGate',
    desc: 'Configuraciones esenciales para asegurar tu FortiGate: acceso administrativo, IPS, logging, VLAN segmentation y SSL inspection.',
    tags: ['FortiGate', 'Hardening', 'VLAN', 'IPS/IDS'],
    time: '12 min lectura',
  },
  {
    href: '/recursos/cctv-evaluacion',
    hex: '#3d88a5',
    eyebrow: 'VIDEOVIGILANCIA IP',
    title: 'Guía de evaluación: Sistema CCTV IP empresarial',
    desc: 'Criterios técnicos para evaluar, dimensionar e implementar un sistema de videovigilancia IP: cámaras, NVR, red y analítica.',
    tags: ['Axis', 'NVR', 'PoE+', 'IA Analytics'],
    time: '8 min lectura',
  },
]

export default function RecursosPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <span className="label">Recursos técnicos</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight">
            Guías técnicas<br />
            <span className="text-gradient-amber">sin registro previo</span>
          </h1>
          <p className="text-zinc-500 text-base max-w-xl leading-relaxed">
            Checklists y guías creadas por nuestros ingenieros para equipos IT que implementan infraestructura empresarial. Acceso inmediato, sin spam.
          </p>
        </div>

        {/* Resource cards */}
        <div className="space-y-5">
          {RESOURCES.map(({ href, hex, eyebrow, title, desc, tags, time }) => (
            <Link
              key={href}
              href={href}
              className="block group card p-0 overflow-hidden hover:border-zinc-600 transition-all duration-300"
              style={{ borderLeftColor: hex, borderLeftWidth: 3 }}
            >
              <div className="p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge text-[10px] font-mono" style={{ color: hex, backgroundColor: hex + '18' }}>
                    {eyebrow}
                  </span>
                  <span className="text-zinc-700 text-[10px] font-mono">{time}</span>
                </div>
                <h2 className="text-noc-white font-black text-lg sm:text-xl mb-3 group-hover:text-white transition-colors leading-snug">
                  {title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed mb-5">{desc}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span key={t} className="text-[10px] font-mono text-zinc-600 bg-surface-raised px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[12px] font-mono font-semibold flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: hex }}>
                    Acceder gratis →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 card p-10 text-center border-amber/20">
          <h3 className="text-xl font-black text-noc-white mb-3">¿Necesitas asesoría directa?</h3>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Nuestros ingenieros pueden revisar tu caso específico y orientarte más allá de cualquier guía genérica.
          </p>
          <Link href="/assessments" className="btn-amber px-10 py-3.5 text-[15px]">
            Diagnóstico técnico gratuito →
          </Link>
        </div>
      </div>
    </div>
  )
}
