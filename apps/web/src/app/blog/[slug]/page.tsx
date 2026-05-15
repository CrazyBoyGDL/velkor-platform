import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { strapi } from '@/lib/strapi'
import {
  architectureReferenceHref,
  asAuthorityReferences,
  asDownloadableArtifacts,
  asStringArray,
  asTechnicalArticleBlocks,
  type AuthorityReference,
} from '@/lib/contentEngine'
import ArticleEngagementTracker from '@/components/ArticleEngagementTracker'
import TechnicalArticleBlocks from '@/components/TechnicalArticleBlocks'
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
    technicalCategory?: string
    technicalLevel?: string
    operationalTags?: unknown
    maturityLevel?: string
    engagementType?: string
    relatedEvidence?: unknown
    relatedCases?: unknown
    relatedFrameworks?: unknown
    architectureReferences?: unknown
    downloadableArtifact?: unknown
    downloadableArtifacts?: unknown
    articleBlocks?: unknown
    architectureDiagram?: unknown
    industryContext?: string
    governanceNotes?: string
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

const TECHNICAL_CATEGORY_LABEL: Record<string, string> = {
  'identity-governance': 'Identidad y gobernanza',
  'network-infrastructure': 'Infraestructura de red',
  'endpoint-management': 'Gestión de endpoints',
  'security-operations': 'Operaciones de seguridad',
  'continuity-resilience': 'Continuidad',
  'cloud-modernization': 'Modernización cloud',
  'video-operations': 'Operaciones de video',
}

const TECHNICAL_LEVEL_LABEL: Record<string, string> = {
  executive: 'Ejecutivo',
  technical: 'Técnico',
  architecture: 'Arquitectura',
  governance: 'Gobernanza',
}

function ReferenceLink({ refItem }: { refItem: AuthorityReference }) {
  const href = refItem.href ?? (refItem.evidenceId ? `/framework/evidence#${refItem.evidenceId}` : null)
  const label = (
    <>
      <span style={{ color: '#4878b0' }}>→</span> {refItem.label}
    </>
  )

  if (!href) {
    return <span className="text-zinc-600 text-xs font-mono flex items-center gap-1">{label}</span>
  }

  if (href.startsWith('/')) {
    return (
      <Link href={href} className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1">
        {label}
      </Link>
    )
  }

  return (
    <a href={href} className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1" target="_blank" rel="noreferrer">
      {label}
    </a>
  )
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
  const operationalTags = asStringArray(post.operationalTags)
  const relatedEvidence = asAuthorityReferences(post.relatedEvidence, 'evidence')
  const relatedCases = asAuthorityReferences(post.relatedCases, 'case-study')
  const relatedFrameworks = asAuthorityReferences(post.relatedFrameworks, 'framework')
  const architectureReferences = asAuthorityReferences(post.architectureReferences, 'architecture')
  const downloadableArtifacts = asDownloadableArtifacts(post.downloadableArtifact, post.downloadableArtifacts)
  const articleBlocks = asTechnicalArticleBlocks(post.articleBlocks)
  const architectureRef = architectureReferenceHref(post.architectureDiagram)
  const metadataItems = [
    post.technicalCategory ? TECHNICAL_CATEGORY_LABEL[post.technicalCategory] ?? post.technicalCategory : null,
    post.technicalLevel ? TECHNICAL_LEVEL_LABEL[post.technicalLevel] ?? post.technicalLevel : null,
    post.maturityLevel ? `Madurez ${post.maturityLevel}` : null,
    post.engagementType ? post.engagementType : null,
  ].filter((item): item is string => Boolean(item))
  const dynamicReferences: AuthorityReference[] = [
    ...relatedEvidence,
    ...relatedCases,
    ...relatedFrameworks,
    ...architectureReferences,
    ...(architectureRef ? [{ label: 'Diagrama de arquitectura asociado', href: architectureRef, relation: 'architecture' as const }] : []),
  ]

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <ArticleEngagementTracker
        slug={params.slug}
        category={post.category}
        readTime={post.readTime ?? ''}
        technicalLevel={post.technicalLevel}
      />
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

          {post.industryContext && (
            <p className="text-zinc-600 text-xs font-mono leading-relaxed mb-5">
              Contexto de industria: {post.industryContext}
            </p>
          )}

          <div className="text-zinc-700 text-xs font-mono">{date}</div>

          {(metadataItems.length > 0 || operationalTags.length > 0) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {metadataItems.map(item => (
                <span key={item} className="text-[10px] font-mono text-zinc-600 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {item}
                </span>
              ))}
              {operationalTags.slice(0, 6).map(tag => (
                <span key={tag} className="text-[10px] font-mono text-zinc-700 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.045)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
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

        <TechnicalArticleBlocks blocks={articleBlocks} />

        {(downloadableArtifacts.length > 0 || post.governanceNotes) && (
          <div className="my-10 p-5 rounded-xl" style={{ background: 'rgba(58,120,88,0.04)', border: '1px solid rgba(58,120,88,0.12)' }}>
            <div className="text-[10px] font-mono text-zinc-600 mb-2">ACTIVO OPERACIONAL</div>
            {downloadableArtifacts.map(artifact => (
              <div className="mb-3" key={artifact.title}>
                <div className="text-zinc-300 text-sm font-semibold">{artifact.title}</div>
                <p className="text-zinc-600 text-[11px] font-mono mt-1">
                  {artifact.gated ? 'Disponible bajo NDA o discovery técnico' : 'Artefacto disponible para descarga'}
                  {artifact.format ? ` · ${artifact.format.toUpperCase()}` : ''}
                </p>
              </div>
            ))}
            {post.governanceNotes && (
              <p className="text-zinc-500 text-xs leading-relaxed">{post.governanceNotes}</p>
            )}
          </div>
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
              Evaluación técnica →
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
            {(dynamicReferences.length > 0 ? dynamicReferences : [
              { label: 'Biblioteca de evidencia operacional', href: '/framework/evidence', relation: 'evidence' as const },
              { label: 'Framework operacional de 8 etapas', href: '/framework/operational-framework', relation: 'framework' as const },
              { label: 'Narrativas de transformación', href: '/casos', relation: 'case-study' as const },
            ]).map(refItem => (
              <ReferenceLink key={`${refItem.relation}-${refItem.label}`} refItem={refItem} />
            ))}
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
