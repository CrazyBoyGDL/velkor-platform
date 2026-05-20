import sanitizeHtml from 'sanitize-html'

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const TAGS = /<[^>]*>/g

export function sanitizePlainText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(CONTROL_CHARS, '')
    .replace(TAGS, '')
    .trim()
    .slice(0, maxLength)
}

export function sanitizePlainTextArray(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return []
  return value
    .slice(0, maxItems)
    .map(item => sanitizePlainText(item, maxLength))
    .filter(Boolean)
}

export function escapeHtml(value: unknown): string {
  return sanitizePlainText(value, Number.MAX_SAFE_INTEGER)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function preserveLineBreaks(value: unknown): string {
  return escapeHtml(value || 'Sin mensaje adicional.').replace(/\r?\n/g, '<br />')
}

export function sanitizeCmsHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
      pre: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['https'],
    },
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
        },
      }),
      img: (_tagName, attribs) => ({
        tagName: 'img',
        attribs: {
          ...attribs,
          loading: attribs.loading || 'lazy',
        },
      }),
    },
  })
}
