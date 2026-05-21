import { strapi } from '@/lib/strapi'
import {
  FALLBACK_AUTHORITY_POSTS,
  getFallbackAuthorityPost,
  getFallbackRelatedPosts,
} from '@/lib/authorityContent'
import type { StrapiMediaField } from '@/lib/strapiMedia'

export type StrapiPostAttributes = {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  publishedAt?: string | null
  updatedAt?: string | null
  readTime: string
  hex: string
  seoTitle?: string
  seoDescription?: string
  coverImage?: StrapiMediaField
  coverAlt?: string
  coverCaption?: string
  gallery?: StrapiMediaField
  authorName?: string
  reviewedBy?: string
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

export type StrapiPost = {
  id: number
  attributes: StrapiPostAttributes
}

export type StrapiListResponse = { data: StrapiPost[] }

export type RelatedPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  hex: string
}

const POST_POPULATE = '&populate[0]=coverImage&populate[1]=gallery'

export async function getBlogPost(
  slug: string,
  options: { preview?: boolean } = {}
): Promise<StrapiPostAttributes | null> {
  if (!options.preview) {
    const fallback = getFallbackAuthorityPost(slug)
    if (fallback) return fallback
  }

  const path =
    `/posts?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&publicationState=${options.preview ? 'preview' : 'live'}` +
    POST_POPULATE

  const data = options.preview
    ? await strapi.getPreview<StrapiListResponse>(path)
    : await strapi.get<StrapiListResponse>(path, 3600)

  const post = data?.data?.[0]
  if (post) return post.attributes

  return getFallbackAuthorityPost(slug) ?? null
}

export async function getRelatedBlogPosts(excludeSlug: string): Promise<RelatedPost[]> {
  if (getFallbackAuthorityPost(excludeSlug)) return getFallbackRelatedPosts(excludeSlug)

  const data = await strapi.get<StrapiListResponse>(
    `/posts?sort=publishedAt:desc&pagination[limit]=4&publicationState=live` +
    `&filters[slug][$ne]=${encodeURIComponent(excludeSlug)}` +
    `&fields[0]=slug&fields[1]=title&fields[2]=excerpt&fields[3]=category&fields[4]=readTime&fields[5]=hex`,
    3600
  )
  const cmsRelated = (data?.data ?? []).map(({ attributes: a }) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    category: a.category,
    readTime: a.readTime ?? '',
    hex: a.hex ?? '#b07828',
  }))
  const seen = new Set<string>()
  return [...getFallbackRelatedPosts(excludeSlug), ...cmsRelated]
    .filter(post => {
      if (post.slug === excludeSlug || seen.has(post.slug)) return false
      seen.add(post.slug)
      return true
    })
    .slice(0, 3)
}

export async function getBlogStaticParams() {
  const data = await strapi.get<StrapiListResponse>(
    '/posts?fields=slug&pagination[limit]=100&publicationState=live',
    3600
  )
  const cmsParams = (data?.data ?? []).map(({ attributes }) => ({ slug: attributes.slug }))
  const fallbackParams = FALLBACK_AUTHORITY_POSTS.map(post => ({ slug: post.slug }))
  const slugs = new Set<string>()
  return [...cmsParams, ...fallbackParams].filter(({ slug }) => {
    if (slugs.has(slug)) return false
    slugs.add(slug)
    return true
  })
}
