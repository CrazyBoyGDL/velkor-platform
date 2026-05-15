import { MetadataRoute } from 'next'
import { strapi } from '@/lib/strapi'
import { SITE_URL } from '@/lib/config'

const BASE = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                                 lastModified: now, changeFrequency: 'weekly',  priority: 1   },
    { url: `${BASE}/assessments`,                lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/servicios`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/servicios/ciberseguridad`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/servicios/identidad-acceso`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/servicios/videovigilancia`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/framework`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog`,                                lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/casos`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/nosotros`,                            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contacto`,                            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/recursos`,                            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/recursos/intune-checklist`,           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/recursos/fortinet-hardening`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/recursos/cctv-evaluacion`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  // Dynamic blog posts from Strapi
  type StrapiPost = { attributes: { slug: string; publishedAt: string } }
  const data = await strapi.get<{ data: StrapiPost[] }>(
    '/posts?fields=slug,publishedAt&pagination[limit]=100&publicationState=live'
  )

  const blogRoutes: MetadataRoute.Sitemap = (data?.data ?? []).map(({ attributes }) => ({
    url: `${BASE}/blog/${attributes.slug}`,
    lastModified: new Date(attributes.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
