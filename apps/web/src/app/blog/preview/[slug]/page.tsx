import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogArticleView from '@/components/BlogArticleView'
import {
  getBlogPost,
  getRelatedBlogPosts,
} from '@/lib/blogArticleData'
import {
  BLOG_PREVIEW_COOKIE,
  isPreviewCookieValid,
} from '@/lib/blogPreview'
import { OG_IMAGES } from '@/lib/config'
import { mediaAsset } from '@/lib/strapiMedia'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type BlogPreviewPageProps = {
  params: Promise<{ slug: string }>
}

async function assertPreviewAccess() {
  const cookieStore = await cookies()
  const previewCookie = cookieStore.get(BLOG_PREVIEW_COOKIE)?.value
  if (!isPreviewCookieValid(previewCookie)) notFound()
}

export async function generateMetadata(
  { params }: BlogPreviewPageProps
): Promise<Metadata> {
  await assertPreviewAccess()

  const { slug } = await params
  const post = await getBlogPost(slug, { preview: true })
  if (!post) {
    return {
      title: 'Vista previa no disponible | Velkor Systems',
      robots: { index: false, follow: false, nocache: true },
    }
  }

  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt || undefined
  const cover = mediaAsset(post.coverImage, post.coverAlt || post.title)
  const images = cover
    ? [{ url: cover.url, width: cover.width, height: cover.height, alt: cover.alt }]
    : [{ url: OG_IMAGES.articles, width: 1200, height: 630, alt: `${post.title} - Velkor Systems` }]

  return {
    title: `[Preview] ${title} | Velkor Systems`,
    description,
    robots: { index: false, follow: false, nocache: true },
    openGraph: {
      title,
      description,
      url: `https://velkor.com.mx/blog/preview/${slug}`,
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      images: cover ? [cover.url] : [OG_IMAGES.articles],
    },
  }
}

export default async function BlogPreviewPage({ params }: BlogPreviewPageProps) {
  await assertPreviewAccess()

  const { slug } = await params
  const [post, related] = await Promise.all([
    getBlogPost(slug, { preview: true }),
    getRelatedBlogPosts(slug),
  ])
  if (!post) notFound()

  return <BlogArticleView slug={slug} post={post} related={related} isPreview />
}
