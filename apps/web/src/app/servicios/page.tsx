import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Servicios IT Empresariales',
  description:
    'Redes y ciberseguridad Fortinet, gestión de identidad Microsoft 365 e Intune, y videovigilancia IP para empresas en México.',
  alternates: { canonical: 'https://velkor.mx/servicios' },
}

const SERVICES = [
  {
    href: '/servicios/ciberseguridad',
    hex: '#4878b0',
    eyebrow: 'REDES & CIBERSEGURIDAD',
    title: 'Infraestructura segura desde el diseño',
    desc: 'Firewall Fortinet FortiGate, segmentación VLAN, VPN site-to-site y arquitectura de acceso gobernado para reducir movimientos laterales y fortalecer el perímetro.',
    tags: ['FortiGate NGFW', 'VLAN', 'Acceso gobernado', 'VPN', 'IPS/IDS'],
    cta: 'Ver servicio →',
  },
  {
    href: '/servicios/identidad-acceso',
    hex: '#3a7858',
    eyebrow: 'IDENTIDAD & ACCESO',
    title: 'Cada acceso, auditado y condicional',
    desc: 'Microsoft Entra ID, Intune MDM y MFA por hardware para que cada identidad sea un punto de control, no un punto de riesgo. Cumplimiento desde día uno.',
    tags: ['Entra ID', 'Intune', 'MFA', 'Acceso Condicional', 'PIM'],
    cta: 'Ver servicio →',
  },
  {
    href: '/servicios/videovigilancia',
    hex: '#3d88a5',
    eyebrow: 'VIDEOVIGILANCIA IP',
    title: 'Visibilidad total, en tiempo real',
    desc: 'Cámaras IP Axis e Hikvision 4K, NVR centralizado con retención 30–90 días y analítica con IA para detectar incidentes antes de que escalen.',
    tags: ['Axis', 'Hikvision', 'NVR 4K', 'IA Analytics', 'PoE+'],
    cta: 'Ver servicio →',
  },
]

export default function ServiciosPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <span className="label">Catálogo de servicios</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4 leading-tight">
            Infraestructura IT<br />
            <span className="text-gradient-amber">de principio a fin</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-base leading-relaxed">
            Tres especialidades integradas. Desde el firewall perimetral hasta la cámara en la sucursal más remota, gestionadas por un solo equipo con entregables documentados.
          </p>
        </div>

        {/* Service cards */}
        <div className="space-y-5 mb-16">
          {SERVICES.map(({ href, hex, eyebrow, title, desc, tags, cta }) => (
            <Link
              key={href}
              href={href}
              className="block group card p-0 overflow-hidden hover:border-zinc-600 transition-all duration-300"
              style={{ borderLeftColor: hex, borderLeftWidth: 3 }}
            >
              <div className="p-7 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="badge text-[10px] font-mono"
                    style={{ color: hex, backgroundColor: hex + '18' }}
                  >
                    {eyebrow}
                  </span>
                </div>

                <h2 className="text-noc-white font-black text-xl sm:text-2xl mb-3 group-hover:text-white transition-colors leading-snug">
                  {title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mb-5">{desc}</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-zinc-600 bg-surface-raised px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span
                    className="text-[12px] font-mono font-semibold flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ color: hex }}
                  >
                    {cta}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="card p-10 text-center border-amber/20">
          <h3 className="text-xl font-black text-noc-white mb-3">¿No sabes qué servicio necesitas?</h3>
          <p className="text-zinc-500 mb-6 text-sm max-w-sm mx-auto leading-relaxed">
            15 minutos con un ingeniero responsable aclaran exactamente qué requiere tu infraestructura.
          </p>
          <Link href="/assessments" className="btn-amber px-10 py-3.5 text-[15px]">
            Evaluación técnica →
          </Link>
        </div>
      </div>
    </div>
  )
}
