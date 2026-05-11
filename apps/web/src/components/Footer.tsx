import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-noc-blue/20 bg-noc-darker mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded border border-noc-blue-light/50 flex items-center justify-center bg-noc-blue/20">
                <div className="w-2.5 h-2.5 rounded-full bg-noc-blue-light" />
              </div>
              <span className="text-noc-white font-bold text-base tracking-wide">
                VELKOR<span className="text-noc-blue-light ml-1 font-mono text-xs">SYS</span>
              </span>
            </div>
            <p className="text-noc-gray-mid text-sm leading-relaxed max-w-xs">
              Enterprise IT services — networks, CCTV, infrastructure, cloud configuration and 24/7 operational support.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-noc-green animate-pulse-slow" />
              <span className="text-noc-green text-xs font-mono">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          <div>
            <h4 className="text-noc-white text-sm font-semibold mb-3 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Network Infrastructure', 'CCTV & Surveillance', 'Cloud Config (M365)', 'Intune & Entra ID', 'NOC Monitoring'].map(s => (
                <li key={s}>
                  <Link href="/services" className="text-noc-gray-mid hover:text-noc-blue-light transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-noc-white text-sm font-semibold mb-3 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              {[['Blog', '/blog'], ['Assessment', '/assessments'], ['Get Quote', '/assessments']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-noc-gray-mid hover:text-noc-blue-light transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-noc-blue/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-noc-gray text-xs font-mono">
            © {new Date().getFullYear()} Velkor System. All rights reserved.
          </p>
          <p className="text-noc-gray text-xs font-mono">
            SOC/NOC Operations Center v1.0
          </p>
        </div>
      </div>
    </footer>
  )
}
