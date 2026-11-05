// Server-only — never import this in client components.
// Set STRAPI_URL as a private env var in Railway (not NEXT_PUBLIC_).
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

function buildHeaders(extra?: Record<string, string>): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  }

  const token = process.env.STRAPI_READ_TOKEN || process.env.STRAPI_API_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  return headers
}

async function strapiGet<T>(path: string, revalidate = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: buildHeaders(),
      next: { revalidate },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error(`[strapi] GET ${path} → ${res.status}`);
      return null;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`[strapi] GET ${path} failed:`, err);
    return null;
  }
}

async function strapiGetPreview<T>(path: string): Promise<T | null> {
  const previewSecret = process.env.BLOG_PREVIEW_SECRET
  if (!previewSecret) {
    console.error('[strapi] preview requested but BLOG_PREVIEW_SECRET is not configured')
    return null
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: buildHeaders({ 'x-velkor-preview-secret': previewSecret }),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`[strapi] PREVIEW GET ${path} -> ${res.status}`)
      return null
    }
    return res.json() as Promise<T>
  } catch (err) {
    console.error(`[strapi] PREVIEW GET ${path} failed:`, err)
    return null
  }
}

async function strapiPost<T>(path: string, data: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      await res.text().catch(() => undefined);
      console.error(`[strapi] POST ${path} → ${res.status}`);
      return null;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`[strapi] POST ${path} failed:`, err);
    return null;
  }
}

export const strapi = { get: strapiGet, getPreview: strapiGetPreview, post: strapiPost };
