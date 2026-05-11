import Link from 'next/link'

const POSTS = [
  {
    slug: 'zero-trust-network-2025',
    title: 'Cómo implementar Zero Trust en tu red empresarial',
    excerpt: 'Guía práctica para migrar desde seguridad perimetral hacia un modelo Zero Trust usando Entra ID e Intune en entornos híbridos.',
    category: 'Redes',
    date: '8 May 2026',
    readTime: '8 min',
    badge: 'text-noc-blue bg-noc-blue-bg',
  },
  {
    slug: 'cctv-ai-analytics',
    title: 'Analítica de video IA: más allá de la vigilancia básica',
    excerpt: 'Cómo los sistemas IP modernos con IA transforman las operaciones de seguridad: desde detección de movimiento hasta análisis de comportamiento.',
    category: 'CCTV',
    date: '1 May 2026',
    readTime: '6 min',
    badge: 'text-noc-cyan bg-noc-blue-bg',
  },
  {
    slug: 'm365-conditional-access',
    title: 'Acceso Condicional en Microsoft 365: guía completa',
    excerpt: 'Configuración paso a paso de políticas de Acceso Condicional en Entra ID: MFA, cumplimiento de dispositivos y políticas basadas en riesgo.',
    category: 'Cloud',
    date: '22 Abr 2026',
    readTime: '12 min',
    badge: 'text-noc-blue bg-noc-blue-bg',
  },
  {
    slug: 'intune-windows-autopilot',
    title: 'Windows Autopilot + Intune: despliegue sin intervención IT',
    excerpt: 'Configura Windows Autopilot para enrolamiento y configuración automática de dispositivos, sin que IT tenga que tocar cada equipo.',
    category: 'Intune',
    date: '15 Abr 2026',
    readTime: '10 min',
    badge: 'text-noc-green bg-noc-green-bg',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <span className="label">Conocimiento técnico</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-noc-white mt-3 mb-4">
            Blog técnico
          </h1>
          <p className="text-zinc-500">
            Guías, casos de uso y buenas prácticas de nuestros ingenieros NOC.
          </p>
        </div>

        <div className="space-y-4">
          {POSTS.map(({ slug, title, excerpt, category, date, readTime, badge }) => (
            <article key={slug} className="noc-card group cursor-pointer">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className={`badge ${badge}`}>{category}</span>
                <div className="text-zinc-700 text-xs font-mono flex items-center gap-2 flex-shrink-0">
                  <span>{date}</span>
                  <span>·</span>
                  <span>{readTime}</span>
                </div>
              </div>
              <h2 className="text-noc-white font-semibold text-lg mb-2 group-hover:text-amber transition-colors">
                {title}
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">{excerpt}</p>
              <div className="mt-4 text-[11px] font-mono text-zinc-700 group-hover:text-amber transition-colors">
                LEER ARTÍCULO →
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-surface-border bg-surface-card">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-slow" />
            <span className="text-zinc-600 text-xs font-mono">
              Contenido gestionado desde Strapi CMS — próximos artículos en camino
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
