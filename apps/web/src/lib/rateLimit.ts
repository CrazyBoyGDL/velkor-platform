type RateEntry = {
  count: number
  resetAt: number
}

export type RateLimitDecision = {
  limited: boolean
  retryAfter: number
}

export function createMemoryRateLimiter(options: {
  windowMs: number
  max: number
  maxKeys?: number
}) {
  const entries = new Map<string, RateEntry>()
  const maxKeys = options.maxKeys ?? 10_000

  function sweep(now: number) {
    if (entries.size < maxKeys) return
    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(key)
    }
  }

  function checkRateLimit(key: string): RateLimitDecision {
    const now = Date.now()
    sweep(now)

    const entry = entries.get(key)
    if (!entry || entry.resetAt <= now) {
      entries.set(key, { count: 1, resetAt: now + options.windowMs })
      return { limited: false, retryAfter: Math.ceil(options.windowMs / 1000) }
    }

    if (entry.count >= options.max) {
      return { limited: true, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) }
    }

    entry.count += 1
    return { limited: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) }
  }

  return Object.assign(checkRateLimit, { forget: (key: string) => entries.delete(key) })
}
