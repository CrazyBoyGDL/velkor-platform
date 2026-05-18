import type { Metadata } from 'next'
import { strapi } from '@/lib/strapi'
import { architectureReferenceHref, asDownloadableArtifacts, asStringArray } from '@/lib/contentEngine'
import BlogList, { type BlogPost } from '@/components/BlogList'
import { FALLBACK_AUTHORITY_POSTS, toBlogPostSummary } from '@/lib/authorityContent'
import { OG_IMAGES } from '@/lib/config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Inteligencia Operacional | Briefs Técnicos — Velkor Systems',
  description: 'Briefs técnicos sobre decisiones de arquitectura, errores de implementación y gobernanza operacional en infraestructura empresarial.',
  alternates: { canonical: 'https://velkor.com.mx/blog' },
  openGraph: {
    title: 'Inteligencia Operacional | Velkor Systems',
    description: 'Briefs técnicos sobre arquitectura, implementación y gobernanza operacional.',
    images: [{ url: OG_IMAGES.articles, width: 1200, height: 630, alt: 'Velkor Systems — Inteligencia operacional' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGES.articles],
  },
}

const FALLBACK_POSTS: BlogPost[] = FALLBACK_AUTHORITY_POSTS.map(toBlogPostSummary)

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
    technicalCategory?: string
    technicalLevel?: string
    operationalTags?: unknown
    maturityLevel?: string
    engagementType?: string
    relatedEvidence?: unknown
    relatedCases?: unknown
    relatedFrameworks?: unknown
    downloadableArtifact?: unknown
    downloadableArtifacts?: unknown
    architectureDiagram?: unknown
    governanceNotes?: string
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

  const cmsPosts = data.data.map(({ attributes: a }) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    category: a.category,
    date: formatDate(a.publishedAt),
    readTime: a.readTime ?? '',
    hex: a.hex ?? '#b07828',
    technicalCategory: a.technicalCategory,
    technicalLevel: a.technicalLevel,
    operationalTags: asStringArray(a.operationalTags),
    maturityLevel: a.maturityLevel,
    engagementType: a.engagementType,
    relatedEvidence: asStringArray(a.relatedEvidence),
    relatedCases: asStringArray(a.relatedCases),
    relatedFrameworks: asStringArray(a.relatedFrameworks),
    downloadableArtifact: asDownloadableArtifacts(a.downloadableArtifact, a.downloadableArtifacts)[0] ?? null,
    architectureRef: architectureReferenceHref(a.architectureDiagram),
    governanceNotes: a.governanceNotes ?? null,
  }))

  const seen = new Set<string>()
  return [...FALLBACK_POSTS, ...cmsPosts].filter(post => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-12">
          <span className="label">Conocimiento técnico</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4">
            Notas para decidir mejor
          </h1>
          <p className="text-zinc-500 max-w-xl leading-relaxed">
            Lecturas cortas sobre decisiones reales: qué se movió, qué se dejó quieto y qué evidencia valió la pena conservar.
          </p>
        </div>

        <BlogList posts={posts} />

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-border bg-surface-card">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-slow" />
            <span className="text-zinc-600 text-xs font-mono">
              Briefs seleccionados · profundidad bajo contexto
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
