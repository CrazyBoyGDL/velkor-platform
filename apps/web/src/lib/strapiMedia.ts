import { MEDIA_URL } from './config'

export type MediaAsset = {
  url: string
  alt: string
  caption?: string
  width: number
  height: number
}

type StrapiMediaEntity = {
  id?: number
  attributes?: {
    url?: string
    alternativeText?: string | null
    caption?: string | null
    width?: number | null
    height?: number | null
  }
}

export type StrapiMediaField = {
  data?: StrapiMediaEntity | StrapiMediaEntity[] | null
} | StrapiMediaEntity | StrapiMediaEntity[] | null | undefined

export function mediaAsset(value: StrapiMediaField, fallbackAlt: string): MediaAsset | null {
  const entity = firstMediaEntity(value)

  if (!entity?.attributes?.url) return null

  return {
    url: absoluteMediaUrl(entity.attributes.url),
    alt: entity.attributes.alternativeText?.trim() || fallbackAlt,
    caption: entity.attributes.caption?.trim() || undefined,
    width: entity.attributes.width || 1600,
    height: entity.attributes.height || 900,
  }
}

export function mediaGallery(value: StrapiMediaField, fallbackAlt: string): MediaAsset[] {
  const data = isMediaField(value) ? value.data : undefined
  const entities = Array.isArray(value)
    ? value
    : Array.isArray(data)
    ? data
    : []

  return entities
    .map((entity, index) => mediaAsset(entity, `${fallbackAlt} - imagen ${index + 1}`))
    .filter((asset): asset is MediaAsset => Boolean(asset))
}

function firstMediaEntity(value: StrapiMediaField): StrapiMediaEntity | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  if (isMediaField(value)) {
    const data = value.data
    return Array.isArray(data) ? data[0] ?? null : data ?? null
  }
  return value.attributes ? value : null
}

function isMediaField(value: StrapiMediaField): value is { data?: StrapiMediaEntity | StrapiMediaEntity[] | null } {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'data' in value
}

function absoluteMediaUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  const base = url.startsWith('/uploads')
    ? process.env.STRAPI_URL || 'https://api.velkor.com.mx'
    : MEDIA_URL
  return `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}
