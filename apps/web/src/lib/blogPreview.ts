import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const BLOG_PREVIEW_COOKIE = 'velkor_blog_preview'

export function isValidBlogSlug(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function previewCookieValue(secret = process.env.BLOG_PREVIEW_SECRET): string | null {
  if (!secret) return null
  return createHash('sha256').update(secret).digest('hex')
}

export function previewSlugToken(slug: string, secret = process.env.BLOG_PREVIEW_SECRET): string | null {
  if (!secret || !isValidBlogSlug(slug)) return null
  return createHmac('sha256', secret).update(slug).digest('hex')
}

export function isPreviewSecretValid(value: string | null | undefined): boolean {
  const expected = process.env.BLOG_PREVIEW_SECRET
  if (!expected || !value) return false
  return safeEqual(value, expected)
}

export function isPreviewSlugTokenValid(
  value: string | null | undefined,
  slug: string | null | undefined
): boolean {
  if (!value || !isValidBlogSlug(slug)) return false
  const expected = previewSlugToken(slug)
  if (!expected) return false
  return safeEqual(value, expected)
}

export function isPreviewCookieValid(value: string | null | undefined): boolean {
  const expected = previewCookieValue()
  if (!expected || !value) return false
  return safeEqual(value, expected)
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}
