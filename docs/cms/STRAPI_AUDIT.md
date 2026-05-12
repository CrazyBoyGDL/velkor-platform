# Velkor Platform — Strapi CMS Audit
**Date:** 2026-05-11  
**Strapi Version:** 4.22.1 (NOT v5 as stated in docs/ARCHITECTURE.md)  
**Status:** Blank install — no content model exists

---

## Critical Finding

**Strapi is a completely empty shell.** No content types, collections, single types, components, or dynamic zones have been created. The admin panel exists and connects to PostgreSQL, but there is zero content model.

The frontend (`apps/web`) never fetches from Strapi. All content displayed on the site is hardcoded in TypeScript arrays inside React components.

---

## Current Strapi State

### Plugin Configuration

| Plugin | Version | Active | Used? |
|---|---|---|---|
| `@strapi/plugin-users-permissions` | 4.22.1 | Yes | For admin auth only |
| `@strapi/plugin-i18n` | 4.22.1 | Yes | **Not used** — no locale-specific content |

### Config Files

| File | Purpose | Issues |
|---|---|---|
| `config/server.js` | Host/port config | OK |
| `config/database.js` | PostgreSQL connection | `ssl: false` hardcoded |
| `config/admin.js` | JWT + token salts | Defaults: `'tobemodified'` |
| `config/plugins.js` | Plugin config | JWT secret via env (good) |
| `config/middlewares.js` | Middleware stack | Default, no CORS config |

### Source Code

```
apps/api/src/
├── api/
│   └── .gitkeep          ← No content types
├── extensions/
│   └── .gitkeep          ← No extensions
└── index.js              ← Empty register/bootstrap
```

**No customization exists.** Strapi runs with 100% default configuration.

---

## Content Types Needed (Derived from Frontend Audit)

These are the content types implied by the hardcoded frontend data. None of them exist yet.

### 1. Blog Posts (Collection Type: `post`)

```
Derived from: apps/web/src/app/blog/page.tsx POSTS[]
Current frontend data has: 4 hardcoded articles

Fields needed:
- title        (Text, required)
- slug         (UID from title, for future dynamic routing)
- excerpt      (Text, max 300 chars)
- content      (Rich Text / Blocks — for full article)
- category     (Enumeration: Redes | CCTV | Cloud | Intune | Seguridad | NOC)
- publishedAt  (DateTime — Strapi has this built-in)
- readTime     (Text, e.g. "8 min")
- hex          (Text — optional color accent per category)
```

**Note:** Frontend currently renders article cards with no link to a detail page. Route `/blog/[slug]` does not exist. Full articles cannot be read — only excerpts are shown.

### 2. Case Studies (Collection Type: `caso`)

```
Derived from: apps/web/src/app/casos/page.tsx CASES[]
Current frontend data has: 3 hardcoded cases

Fields needed:
- client       (Text — currently shows company names, LEGAL RISK if real companies)
- sector       (Text: Manufactura | Salud | Retail | etc.)
- year         (Text)
- challenge    (Text, long)
- solution     (Text, long)
- result       (Text, e.g. "0 incidentes")
- resultSub    (Text, e.g. "en 14 meses")
- tags         (Component: tag[])
- hex          (Text — color accent)
- published    (Boolean — to control visibility)
```

⚠ Current hardcoded data includes specific company names (see UX_PROBLEMS.md). Before connecting to CMS, data must be reviewed for legal compliance.

### 3. Leads / Assessment Submissions (Collection Type: `lead`)

```
Derived from: apps/web/src/app/assessments/page.tsx Form
Currently: all data discarded (TODO comment, no API call)

Fields needed:
- name         (Text, required)
- email        (Email, required)
- company      (Text, required)
- phone        (Text, optional)
- companySize  (Enumeration: 1-10 | 11-50 | 51-200 | 200+)
- services     (JSON — multi-select array)
- urgency      (Enumeration: low | normal | high)
- notes        (Long text, optional)
- status       (Enumeration: new | contacted | qualified | closed)
- source       (Text — for UTM/attribution)
- createdAt    (auto by Strapi)
```

This is the **most critical content type**. Until it exists and the form is wired, every assessment request is silently lost.

### 4. Services Catalog (Single Type: `services-page` or Collection)

```
Derived from: apps/web/src/app/services/page.tsx CATEGORIES[]
Currently: hardcoded, 4 categories × 4 services each

Could be:
- Option A: Single type with JSON for the whole catalog (simple)
- Option B: Collection type ServiceCategory with nested ServiceItem (flexible)

Recommendation: Start with Option A (JSON in single type) — extend to collection later
```

### 5. Homepage Content (Single Type: `homepage`)

```
Derived from: apps/web/src/app/page.tsx
Currently: hardcoded STATS[], STEPS[], TESTIMONIALS[], CERTS[]

Fields needed:
- heroTitle    (Text)
- heroSubtitle (Text)
- stats        (Component: stat[])
- testimonials (Component: testimonial[])
- certs        (Component: cert[])

Note: ServicePanels already pull from page.tsx — they would move to the services catalog.
```

---

## Rendering Flow (Current vs. Target)

### Current (broken)
```
Browser → Next.js → Returns hardcoded HTML
                    No Strapi involved
```

### Target
```
Blog page (SSG):
Browser → Next.js → fetch('/api/posts?populate=*') → Strapi → PostgreSQL
                 ↓
           Returns HTML (built at deploy time or ISR)

Assessment form (client→server):
Browser → Next.js Route Handler → POST '/api/leads' → Strapi → PostgreSQL
       ← 200 OK + email notification

Blog detail (dynamic):
Browser → Next.js /blog/[slug] → fetch('/api/posts?filters[slug][$eq]={slug}')
```

---

## Integration Architecture (Recommended)

### Phase 1: Connect form → leads (Priority 1 — stops data loss)
```
assessments/page.tsx submit()
  → POST /api/assessments (Next.js Route Handler)
    → POST /api/leads (Strapi — create Lead entry)
      → Strapi webhook → email notification (Resend/Mailgun)
```

### Phase 2: Blog from CMS (Priority 2 — enables content management)
```
/blog page.tsx
  → fetch(process.env.NEXT_PUBLIC_API_URL + '/api/posts?sort=publishedAt:desc')
  → Render from Strapi data instead of hardcoded array
```

### Phase 3: Dynamic blog post pages
```
/blog/[slug]/page.tsx (new route)
  → generateStaticParams() pulls all slugs from Strapi
  → Each page fetches full post content
  → ISR revalidation every 3600s
```

---

## Strapi Admin Configuration Required

Before using Strapi in production, these settings must be configured via admin panel:

1. **API Permissions** — Public role needs `find` + `findOne` on Posts, Casos
2. **Lead collection** — Authenticated/internal role only for `find` (privacy)
3. **Media provider** — Configure S3 or Cloudinary for image uploads (current: local filesystem — will not persist on Railway)
4. **Email plugin** — Configure for lead notifications
5. **CORS** — Restrict to web service domain only
6. **Webhook** — Add webhook URL for lead notifications

---

## Inconsistencies Between Docs and Reality

| Claim in `docs/ARCHITECTURE.md` | Reality |
|---|---|
| "Strapi v5" | Actually v4.22.1 |
| "SQLite for development" | Only PostgreSQL configured — no SQLite fallback |
| "/api/services endpoint" | Does not exist |
| "/api/blogs endpoint" | Does not exist |
| "/api/assessments endpoint" | Does not exist |
| "/api/quotes endpoint" | Does not exist |
| "/api/leads endpoint" | Does not exist |
| "automation/ directory (Make/n8n)" | Directory does not exist in repo |
| "Webhooks for blog.create" | No webhooks configured |
| "Email service (Sendgrid, Mailgun)" | Not installed or configured |
| "YouTube API, CRM, Social media" | No integration code |
