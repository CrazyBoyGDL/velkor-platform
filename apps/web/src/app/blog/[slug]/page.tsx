import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { strapi } from '@/lib/strapi'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import TrackedLink from '@/components/TrackedLink'

export const revalidate = 3600
export const dynamicParams = true

// ── Types ─────────────────────────────────────────────────────────────────────
type StrapiPost = {
  id: number
  attributes: {
    slug: string
    title: string
    excerpt: string
    content: string
    category: string
    publishedAt: string
    readTime: string
    hex: string
  }
}

type StrapiListResponse = { data: StrapiPost[] }

type RelatedPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  hex: string
}

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getPost(slug: string): Promise<StrapiPost['attributes'] | null> {
  const data = await strapi.get<StrapiListResponse>(
    `/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&publicationState=live`,
    3600
  )
  const post = data?.data?.[0]
  return post ? post.attributes : null
}

async function getRelatedPosts(excludeSlug: string): Promise<RelatedPost[]> {
  const data = await strapi.get<StrapiListResponse>(
    `/posts?sort=publishedAt:desc&pagination[limit]=4&publicationState=live` +
    `&filters[slug][$ne]=${encodeURIComponent(excludeSlug)}` +
    `&fields[0]=slug&fields[1]=title&fields[2]=excerpt&fields[3]=category&fields[4]=readTime&fields[5]=hex`,
    3600
  )
  return (data?.data ?? []).slice(0, 3).map(({ attributes: a }) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    category: a.category,
    readTime: a.readTime ?? '',
    hex: a.hex ?? '#b07828',
  }))
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return iso
  }
}

// ── Static params (pre-build known slugs at deploy time) ─────────────────────
export async function generateStaticParams() {
  const data = await strapi.get<StrapiListResponse>(
    '/posts?fields=slug&pagination[limit]=100&publicationState=live',
    3600
  )
  return (data?.data ?? []).map(({ attributes }) => ({ slug: attributes.slug }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Artículo no encontrado | Velkor' }
  return {
    title: `${post.title} | Velkor Blog Técnico`,
    description: post.excerpt || undefined,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, related] = await Promise.all([
    getPost(params.slug),
    getRelatedPosts(params.slug),
  ])
  if (!post) notFound()

  const date = formatDate(post.publishedAt)
  const hex  = post.hex || '#b07828'

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <ScrollDepthTracker page={`blog-${params.slug}`} />
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors mb-10"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M3.828 7H14a1 1 0 110 2H3.828l2.829 2.828a1 1 0 11-1.414 1.414L1 9l-.707-.707L1 7.586 5.243 3.343A1 1 0 016.657 4.757L3.828 7z" />
          </svg>
          Volver al blog
        </Link>

        {/* Header */}
        <header className="mb-10" style={{ borderLeft: `3px solid ${hex}`, paddingLeft: '1.25rem' }}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="badge text-[10px] font-mono"
              style={{ color: hex, backgroundColor: hex + '20' }}
            >
              {post.category}
            </span>
            {post.readTime && (
              <span className="text-zinc-700 text-[10px] font-mono">{post.readTime} de lectura</span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-noc-white leading-tight mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="text-zinc-700 text-xs font-mono">{date}</div>
        </header>

        {/* Content */}
        {post.content ? (
          <div
            className="blog-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-zinc-600 text-sm italic">Contenido completo próximamente.</p>
        )}

        {/* Inline CTA — service contact prompt */}
        <div
          className="my-12 card p-7"
          style={{ borderLeftColor: hex, borderLeftWidth: 3 }}
        >
          <div className="text-[10px] font-mono text-zinc-600 mb-2">IMPLEMENTACIÓN DISPONIBLE</div>
          <h3 className="text-noc-white font-bold text-base mb-2">
            Nuestros ingenieros lo implementan en tu infraestructura
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed mb-4">
            Si estás evaluando esto para tu empresa, podemos entregar un diagnóstico técnico con brechas identificadas, tecnologías recomendadas y costos reales — sin costo y en 24 h.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <TrackedLink href="/assessments" className="btn-amber px-6 py-2.5 text-sm"
              trackLabel={`Blog inline CTA — ${post.category}`}>
              Diagnóstico gratuito →
            </TrackedLink>
            <TrackedLink href="/contacto" className="btn-ghost px-6 py-2.5 text-sm"
              trackLabel={`Blog contact CTA — ${post.category}`}>
              Hablar con un ingeniero
            </TrackedLink>
          </div>
        </div>

        {/* Architecture references */}
        <div className="my-10 p-5 rounded-xl" style={{ background: 'rgba(72,120,176,0.04)', border: '1px solid rgba(72,120,176,0.12)' }}>
          <div className="text-[10px] font-mono text-zinc-600 mb-2">REFERENCIAS TÉCNICAS</div>
          <div className="flex flex-wrap gap-3">
            <Link href="/framework/evidence" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1">
              <span style={{ color: '#4878b0' }}>→</span> Biblioteca de evidencia operacional
            </Link>
            <Link href="/framework/operational-framework" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1">
              <span style={{ color: '#4878b0' }}>→</span> Framework operacional de 8 etapas
            </Link>
            <Link href="/casos" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1">
              <span style={{ color: '#4878b0' }}>→</span> Narrativas de transformación
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="label block mb-5">Artículos relacionados</div>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(p => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="card p-5 hover:border-zinc-600 transition-colors group block"
                  style={{ borderTopColor: p.hex, borderTopWidth: 2 }}
                >
                  <span
                    className="badge text-[9px] font-mono mb-3 inline-block"
                    style={{ color: p.hex, backgroundColor: p.hex + '20' }}
                  >
                    {p.category}
                  </span>
                  <h4 className="text-noc-white font-semibold text-sm leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
                    {p.title}
                  </h4>
                  {p.readTime && (
                    <span className="text-zinc-600 text-[10px] font-mono">{p.readTime} de lectura</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer navigation */}
        <div className="mt-12 pt-8 border-t border-surface-border flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors"
          >
            ← Más artículos
          </Link>
          <TrackedLink
            href="/assessments"
            className="btn-amber px-6 py-2.5 text-sm"
            trackLabel={`Blog footer CTA — ${post.category}`}
          >
            Solicitar diagnóstico →
          </TrackedLink>
        </div>
      </div>
    </div>
  )
}
