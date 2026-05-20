import { NextRequest, NextResponse } from 'next/server'
import { getRuntimeReadiness } from '@/lib/runtimeReadiness'

export const dynamic = 'force-dynamic'

function canShowReadinessDetails(req: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'production') return true

  const token = process.env.HEALTHCHECK_TOKEN
  if (!token) return false

  return (
    req.headers.get('x-healthcheck-token') === token ||
    req.nextUrl.searchParams.get('token') === token
  )
}

export async function GET(req: NextRequest) {
  const readiness = getRuntimeReadiness()
  const showDetails = canShowReadinessDetails(req)

  return NextResponse.json(
    {
      ok: readiness.ok,
      service: 'velkor-web',
      readiness: readiness.state,
      missingRequiredCount: readiness.missingRequired.length,
      missingRecommendedCount: readiness.missingRecommended.length,
      turnstilePartial: readiness.turnstilePartial,
      ...(showDetails ? {
        missingRequired: readiness.missingRequired,
        missingRecommended: readiness.missingRecommended,
      } : {}),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}
