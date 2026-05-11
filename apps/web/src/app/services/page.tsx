import Link from 'next/link'

const categories = [
  {
    id: 'network',
    label: 'Networks',
    icon: '🌐',
    color: 'text-noc-blue-light',
    borderActive: 'border-noc-blue-light/60 bg-noc-blue/10',
    services: [
      { name: 'LAN/WAN Design & Implementation', desc: 'Structured cabling, switching, routing and VLAN segmentation for enterprise sites.' },
      { name: 'Managed Wi-Fi (Enterprise)', desc: 'Controller-based Wi-Fi with captive portal, roaming and bandwidth management.' },
      { name: 'Firewall & UTM', desc: 'Perimeter security with Next-Gen firewalls, IDS/IPS and VPN setup.' },
      { name: 'SD-WAN', desc: 'Software-defined WAN for multi-site connectivity with QoS and failover.' },
    ],
  },
  {
    id: 'cctv',
    label: 'CCTV & Nodes',
    icon: '📷',
    color: 'text-noc-cyan',
    borderActive: 'border-noc-cyan/60 bg-noc-cyan/5',
    services: [
      { name: 'IP Camera System Design', desc: 'Site survey, camera placement planning, PoE switching and cabling.' },
      { name: 'NVR/DVR Configuration', desc: 'Storage setup, recording schedules, motion detection and remote access.' },
      { name: 'Video Analytics', desc: 'AI-powered detection, perimeter alerts and license plate recognition.' },
      { name: 'Remote Video Monitoring', desc: '24/7 NOC-based monitoring with alarm response and incident reporting.' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & M365',
    icon: '☁️',
    color: 'text-noc-blue-light',
    borderActive: 'border-noc-blue-light/60 bg-noc-blue/10',
    services: [
      { name: 'Microsoft 365 Tenant Setup', desc: 'Full tenant provisioning, domain configuration, Exchange and Teams setup.' },
      { name: 'SharePoint & OneDrive', desc: 'Intranet design, document libraries, permissions and external sharing policies.' },
      { name: 'License Management', desc: 'Subscription optimization, user provisioning and cost analysis.' },
      { name: 'Email Security', desc: 'SPF/DKIM/DMARC, Defender for Office 365, anti-phishing and DLP policies.' },
    ],
  },
  {
    id: 'identity',
    label: 'Intune & Entra ID',
    icon: '🔒',
    color: 'text-noc-green',
    borderActive: 'border-noc-green/60 bg-noc-green-dim/10',
    services: [
      { name: 'Entra ID (Azure AD) Setup', desc: 'Tenant configuration, hybrid join, SSO and directory sync (Entra Connect).' },
      { name: 'Conditional Access Policies', desc: 'MFA enforcement, device compliance, location-based and risk-based policies.' },
      { name: 'Intune Device Management', desc: 'MDM/MAM enrollment, compliance policies, app deployment and autopilot.' },
      { name: 'Identity Governance', desc: 'Access reviews, Privileged Identity Management (PIM) and entitlement management.' },
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-gradient-noc min-h-screen pt-12 pb-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="noc-label">What we offer</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-noc-white mt-3 mb-4">
            IT Services Catalog
          </h1>
          <p className="text-noc-gray-mid max-w-xl mx-auto">
            Professional enterprise IT services across networking, surveillance, cloud and identity management.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map(({ id, label, icon, color, borderActive, services }) => (
            <div key={id}>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">{icon}</span>
                <h2 className={`text-2xl font-bold ${color}`}>{label}</h2>
                <div className="flex-1 h-px bg-noc-blue/20 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(({ name, desc }) => (
                  <div key={name} className={`noc-card ${borderActive} group`}>
                    <h3 className="text-noc-white font-semibold mb-2">{name}</h3>
                    <p className="text-noc-gray-mid text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center noc-card border-noc-blue-light/30 shadow-noc-strong p-10 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-noc-white mb-3">Need a custom solution?</h3>
          <p className="text-noc-gray-mid mb-6">
            Our team will assess your current infrastructure and design a tailored service package.
          </p>
          <Link href="/assessments" className="btn-primary">
            Request Assessment
          </Link>
        </div>
      </div>
    </div>
  )
}
