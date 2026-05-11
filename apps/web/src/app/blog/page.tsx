import Link from 'next/link'

// Placeholder posts — will be replaced with Strapi API data
const placeholderPosts = [
  {
    slug: 'zero-trust-network-2025',
    title: 'Implementing Zero Trust Network Architecture in 2025',
    excerpt: 'A practical guide to migrating your enterprise network from perimeter-based security to a zero trust model using Entra ID and Intune.',
    category: 'Networks',
    date: '2026-05-08',
    readTime: '8 min',
    color: 'text-noc-blue-light',
    badge: 'border-noc-blue/40 text-noc-blue-light bg-noc-blue/10',
  },
  {
    slug: 'cctv-ai-analytics',
    title: 'AI-Powered Video Analytics: Beyond Basic Surveillance',
    excerpt: 'How modern IP camera systems with AI analytics are transforming security operations — from motion detection to behavioral analysis.',
    category: 'CCTV',
    date: '2026-05-01',
    readTime: '6 min',
    color: 'text-noc-cyan',
    badge: 'border-noc-cyan/40 text-noc-cyan bg-noc-cyan/10',
  },
  {
    slug: 'm365-conditional-access',
    title: 'Microsoft 365 Conditional Access: Complete Setup Guide',
    excerpt: 'Step-by-step configuration of Conditional Access policies in Entra ID — MFA, device compliance, location restrictions and risk-based policies.',
    category: 'Cloud',
    date: '2026-04-22',
    readTime: '12 min',
    color: 'text-noc-blue-light',
    badge: 'border-noc-blue/40 text-noc-blue-light bg-noc-blue/10',
  },
  {
    slug: 'intune-windows-autopilot',
    title: 'Windows Autopilot with Intune: Zero-Touch Deployment',
    excerpt: 'Configure Windows Autopilot for automatic device enrollment and configuration — no IT touch required at the end-user desk.',
    category: 'Intune',
    date: '2026-04-15',
    readTime: '10 min',
    color: 'text-noc-green',
    badge: 'border-noc-green/40 text-noc-green bg-noc-green-dim/20',
  },
]

export default function BlogPage() {
  return (
    <div className="bg-gradient-noc min-h-screen pt-12 pb-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="noc-label">Knowledge base</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-noc-white mt-3 mb-4">
            Industry Insights
          </h1>
          <p className="text-noc-gray-mid max-w-xl mx-auto">
            Technical guides, case studies and best practices from our NOC engineers.
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {placeholderPosts.map(({ slug, title, excerpt, category, date, readTime, color, badge }) => (
            <article key={slug} className="noc-card hover:shadow-noc group cursor-pointer">
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className={`noc-badge border ${badge} text-xs`}>
                  {category}
                </span>
                <div className="flex items-center gap-3 text-noc-gray text-xs font-mono flex-shrink-0">
                  <span>{date}</span>
                  <span>·</span>
                  <span>{readTime} read</span>
                </div>
              </div>
              <h2 className={`text-xl font-semibold ${color} mb-2 group-hover:underline underline-offset-4 decoration-1`}>
                {title}
              </h2>
              <p className="text-noc-gray-mid text-sm leading-relaxed">{excerpt}</p>
              <div className="mt-4 text-xs font-mono text-noc-gray group-hover:text-noc-blue-light transition-colors">
                READ ARTICLE →
              </div>
            </article>
          ))}
        </div>

        {/* Coming from Strapi note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-noc-blue/20 bg-noc-navy/30">
            <div className="w-1.5 h-1.5 rounded-full bg-noc-blue-light animate-pulse-slow" />
            <span className="text-noc-gray-mid text-xs font-mono">
              Content managed via Strapi CMS — more articles coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
