import Link from 'next/link'

const services = [
  {
    icon: '🌐',
    title: 'Network Infrastructure',
    desc: 'LAN/WAN design, routing, switching and managed Wi-Fi for enterprise environments.',
    color: 'text-noc-blue-light',
    border: 'border-noc-blue/40 hover:border-noc-blue-light/60',
  },
  {
    icon: '📷',
    title: 'CCTV & Surveillance',
    desc: 'IP camera systems, NVR/DVR setup, remote monitoring and video analytics.',
    color: 'text-noc-cyan',
    border: 'border-noc-cyan/30 hover:border-noc-cyan/60',
  },
  {
    icon: '☁️',
    title: 'Microsoft 365 & Cloud',
    desc: 'Full M365 tenant setup, Exchange Online, SharePoint, Teams and license management.',
    color: 'text-noc-blue-light',
    border: 'border-noc-blue/40 hover:border-noc-blue-light/60',
  },
  {
    icon: '🔒',
    title: 'Intune & Entra ID',
    desc: 'Device management, conditional access, MFA, identity governance and compliance.',
    color: 'text-noc-green',
    border: 'border-noc-green-dim/50 hover:border-noc-green/50',
  },
  {
    icon: '🖥️',
    title: 'NOC Monitoring',
    desc: 'Real-time infrastructure monitoring, alerting and 24/7 operational support.',
    color: 'text-noc-orange',
    border: 'border-noc-orange/30 hover:border-noc-orange/60',
  },
  {
    icon: '⚡',
    title: 'IT Assessment & Quotes',
    desc: 'On-site technical evaluation, infrastructure audit and detailed quotation.',
    color: 'text-noc-cyan',
    border: 'border-noc-cyan/30 hover:border-noc-cyan/60',
  },
]

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '24/7', label: 'NOC Support' },
  { value: '<15m', label: 'Response Time' },
  { value: '100+', label: 'Clients Served' },
]

export default function HomePage() {
  return (
    <div className="bg-gradient-hero min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Background grid effect */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Status indicator */}
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-noc-green/40 bg-noc-green-dim/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-noc-green animate-pulse-slow" />
            <span className="text-noc-green text-xs font-mono font-medium tracking-widest">
              SYSTEMS OPERATIONAL — VELKOR NOC ONLINE
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-noc-white mb-6 leading-tight">
            Enterprise IT{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-noc-blue-light to-noc-cyan">
              Operations Center
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-noc-gray-mid max-w-2xl mx-auto mb-10 leading-relaxed">
            Networks, CCTV, infrastructure and cloud configuration. Professional SOC/NOC services
            for businesses that can&apos;t afford downtime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessments" className="btn-primary text-base px-8 py-4 shadow-noc-strong">
              Request Assessment
            </Link>
            <Link href="/services" className="btn-outline text-base px-8 py-4">
              View Services
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative max-w-4xl mx-auto mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center p-4 rounded-lg border border-noc-blue/20 bg-noc-navy/50 backdrop-blur">
                <div className="text-3xl font-bold text-noc-blue-light font-mono">{value}</div>
                <div className="text-xs text-noc-gray-mid mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4 bg-noc-darker/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="noc-label">What we do</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-noc-white mt-3 mb-4">
              Enterprise-Grade IT Services
            </h2>
            <p className="text-noc-gray-mid max-w-xl mx-auto">
              From network design to cloud migration — we cover the full IT infrastructure stack.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon, title, desc, color, border }) => (
              <div key={title} className={`noc-card ${border} group cursor-default`}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className={`text-lg font-semibold ${color} mb-2`}>{title}</h3>
                <p className="text-noc-gray-mid text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn-outline">
              See All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="noc-card border-noc-blue-light/30 shadow-noc-strong p-12">
            <span className="noc-label">Ready to start?</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-noc-white mt-4 mb-4">
              Get a Free Technical Assessment
            </h2>
            <p className="text-noc-gray-mid mb-8 max-w-lg mx-auto">
              Our engineers will evaluate your infrastructure and deliver a detailed report with recommendations and pricing.
            </p>
            <Link href="/assessments" className="btn-primary text-base px-10 py-4 shadow-noc-strong">
              Start Assessment
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
