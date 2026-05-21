import { NextRequest, NextResponse } from 'next/server'
import {
  BLOG_PREVIEW_COOKIE,
  isPreviewSecretValid,
  isPreviewSlugTokenValid,
  isValidBlogSlug,
  previewCookieValue,
} from '@/lib/blogPreview'

export const dynamic = 'force-dynamic'

function shouldUseSecureCookie(request: NextRequest): boolean {
  const forwardedProto = request.headers.get('x-forwarded-proto')
  return request.nextUrl.protocol === 'https:' || forwardedProto === 'https'
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const token = request.nextUrl.searchParams.get('token')
  const slug = request.nextUrl.searchParams.get('slug')

  if (!isValidBlogSlug(slug) || (!isPreviewSecretValid(secret) && !isPreviewSlugTokenValid(token, slug))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized preview request' }, { status: 401 })
  }

  const cookieValue = previewCookieValue()
  if (!cookieValue) {
    return NextResponse.json({ ok: false, error: 'Preview is not configured' }, { status: 503 })
  }

  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: `/blog/preview/${slug}` },
  })
  response.cookies.set(BLOG_PREVIEW_COOKIE, cookieValue, {
    httpOnly: true,
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'lax',
    secure: shouldUseSecureCookie(request),
  })
  return response
}
