import Link from 'next/link'
import Logo from './Logo'

const LINKS = {
  Servicios: [
    ['Redes empresariales', '/services'],
    ['CCTV & Vigilancia', '/services'],
    ['Microsoft 365', '/services'],
    ['Intune & Entra ID', '/services'],
    ['Monitoreo NOC', '/services'],
  ],
  Empresa: [
    ['Casos de éxito', '/casos'],
    ['Nosotros', '/nosotros'],
    ['Blog técnico', '/blog'],
    ['Diagnóstico gratuito', '/assessments'],
  ],
}

const CERTS = [
  { label: 'Fortinet NSE4', color: '#ef4444' },
  { label: 'Microsoft Gold', color: '#3b82f6' },
  { label: 'Axis ACSR', color: '#22c55e' },
]

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo className="w-8 h-8" animated={false} />
              <div className="leading-none">
                <div className="text-noc-white font-bold text-sm tracking-tight">VELKOR</div>
                <div className="text-zinc-700 text-[9px] font-mono tracking-[0.2em]">SYSTEM</div>
              </div>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-xs mb-5">
              Consultoría tecnológica empresarial. Redes, ciberseguridad y Modern Workplace para empresas que no pueden permitirse interrupciones.
            </p>

            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-noc-green animate-pulse-slow" />
              <span className="text-noc-green text-[11px] font-mono tracking-widest">SISTEMAS OPERATIVOS AL 99.9%</span>
            </div>

            {/* Certs */}
            <div className="flex flex-wrap gap-2">
              {CERTS.map(({ label, color }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-surface-border text-[11px] font-mono text-zinc-500"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="label text-[11px] mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-700 text-xs font-mono">
            © {new Date().getFullYear()} Velkor System · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-4 text-zinc-700 text-xs font-mono">
            <Link href="/assessments" className="hover:text-zinc-400 transition-colors">Contacto</Link>
            <span>·</span>
            <span>SOC/NOC Operations Center</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
