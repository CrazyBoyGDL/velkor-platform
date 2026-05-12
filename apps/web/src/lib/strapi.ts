// Server-only — never import this in client components.
// Set STRAPI_URL as a private env var in Railway (not NEXT_PUBLIC_).
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function strapiGet<T>(path: string, revalidate = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate },
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

async function strapiPost<T>(path: string, data: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[strapi] POST ${path} → ${res.status}`, body);
      return null;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`[strapi] POST ${path} failed:`, err);
    return null;
  }
}

export const strapi = { get: strapiGet, post: strapiPost };
