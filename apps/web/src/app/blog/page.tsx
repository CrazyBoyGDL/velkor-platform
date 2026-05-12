import { strapi } from '@/lib/strapi'
import BlogList, { type BlogPost } from '@/components/BlogList'

export const revalidate = 3600

const FALLBACK_POSTS: BlogPost[] = [
  {
    slug: 'zero-trust-network-2025',
    title: 'Cómo implementar Zero Trust en tu red empresarial',
    excerpt: 'Guía práctica para migrar desde seguridad perimetral hacia un modelo Zero Trust usando Entra ID e Intune en entornos híbridos.',
    category: 'Redes',
    date: '8 May 2026',
    readTime: '8 min',
    hex: '#3b82f6',
  },
  {
    slug: 'cctv-ai-analytics',
    title: 'Analítica de video IA: más allá de la vigilancia básica',
    excerpt: 'Cómo los sistemas IP modernos con IA transforman las operaciones de seguridad: detección de movimiento hasta análisis de comportamiento.',
    category: 'CCTV',
    date: '1 May 2026',
    readTime: '6 min',
    hex: '#06b6d4',
  },
  {
    slug: 'm365-conditional-access',
    title: 'Acceso Condicional en Microsoft 365: guía completa',
    excerpt: 'Configuración paso a paso de políticas de Acceso Condicional en Entra ID: MFA, cumplimiento de dispositivos y políticas basadas en riesgo.',
    category: 'Cloud',
    date: '22 Abr 2026',
    readTime: '12 min',
    hex: '#3b82f6',
  },
  {
    slug: 'intune-windows-autopilot',
    title: 'Windows Autopilot + Intune: despliegue sin intervención IT',
    excerpt: 'Configura Windows Autopilot para enrolamiento y configuración automática de dispositivos, sin que IT tenga que tocar cada equipo.',
    category: 'Intune',
    date: '15 Abr 2026',
    readTime: '10 min',
    hex: '#22c55e',
  },
]

type StrapiPost = {
  id: number
  attributes: {
    slug: string
    title: string
    excerpt: string
    category: string
    publishedAt: string
    readTime: string
    hex: string
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

async function getPosts(): Promise<BlogPost[]> {
  const data = await strapi.get<{ data: StrapiPost[] }>('/posts?sort=publishedAt:desc&pagination[limit]=20')
  if (!data?.data?.length) return FALLBACK_POSTS

  return data.data.map(({ attributes: a }) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    category: a.category,
    date: formatDate(a.publishedAt),
    readTime: a.readTime ?? '',
    hex: a.hex ?? '#f59e0b',
  }))
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-12">
          <span className="label">Conocimiento técnico</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4">
            Blog técnico
          </h1>
          <p className="text-zinc-500">
            Guías, casos de uso y buenas prácticas de nuestros ingenieros NOC.
          </p>
        </div>

        <BlogList posts={posts} />

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-border bg-surface-card">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-slow" />
            <span className="text-zinc-600 text-xs font-mono">
              Más artículos en camino · Gestionado desde Strapi CMS
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
