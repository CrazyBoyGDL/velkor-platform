import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { strapi } from '@/lib/strapi'

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

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getPost(slug: string): Promise<StrapiPost['attributes'] | null> {
  const data = await strapi.get<StrapiListResponse>(
    `/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&publicationState=live`,
    3600
  )
  const post = data?.data?.[0]
  return post ? post.attributes : null
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
  const post = await getPost(params.slug)
  if (!post) notFound()

  const date = formatDate(post.publishedAt)
  const hex  = post.hex || '#f59e0b'

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
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

        {/* Footer navigation */}
        <div className="mt-16 pt-8 border-t border-surface-border flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors"
          >
            ← Más artículos
          </Link>
          <Link
            href="/assessments"
            className="btn-amber px-6 py-2.5 text-sm"
          >
            Solicitar diagnóstico →
          </Link>
        </div>
      </div>
    </div>
  )
}
