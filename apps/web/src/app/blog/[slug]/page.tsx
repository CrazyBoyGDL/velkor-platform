import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogArticleView from '@/components/BlogArticleView'
import {
  getBlogPost,
  getBlogStaticParams,
  getRelatedBlogPosts,
} from '@/lib/blogArticleData'
import { OG_IMAGES } from '@/lib/config'
import { mediaAsset } from '@/lib/strapiMedia'

export const revalidate = 3600
export const dynamicParams = true

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getBlogStaticParams()
}

export async function generateMetadata(
  { params }: BlogPostPageProps
): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Artículo no encontrado | Velkor Systems' }

  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt || undefined
  const cover = mediaAsset(post.coverImage, post.coverAlt || post.title)
  const images = cover
    ? [{ url: cover.url, width: cover.width, height: cover.height, alt: cover.alt }]
    : [{ url: OG_IMAGES.articles, width: 1200, height: 630, alt: `${post.title} - Velkor Systems` }]

  return {
    title: `${title} | Velkor Systems`,
    description,
    alternates: { canonical: `https://velkor.com.mx/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://velkor.com.mx/blog/${slug}`,
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      images: cover ? [cover.url] : [OG_IMAGES.articles],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [post, related] = await Promise.all([
    getBlogPost(slug),
    getRelatedBlogPosts(slug),
  ])
  if (!post) notFound()

  return <BlogArticleView slug={slug} post={post} related={related} />
}
