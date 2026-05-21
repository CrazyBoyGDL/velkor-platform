import { NextRequest, NextResponse } from 'next/server'
import { BLOG_PREVIEW_COOKIE, isValidBlogSlug } from '@/lib/blogPreview'

export const dynamic = 'force-dynamic'

function shouldUseSecureCookie(request: NextRequest): boolean {
  const forwardedProto = request.headers.get('x-forwarded-proto')
  return request.nextUrl.protocol === 'https:' || forwardedProto === 'https'
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  const destination = isValidBlogSlug(slug) ? `/blog/${slug}` : '/blog'
  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: destination },
  })
  response.cookies.set(BLOG_PREVIEW_COOKIE, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: shouldUseSecureCookie(request),
  })
  return response
}
