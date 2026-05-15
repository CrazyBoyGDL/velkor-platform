# Velkor Platform — Technical Debt Register
**Date:** 2026-05-11 | **Methodology:** Read-only audit, no changes made

> Historical register: several critical items below were remediated during the May 2026 operational maturity and activation work, including lead persistence, Strapi content-types, security headers, sitemap/robots, and centralized analytics. Keep this file as original debt context; use `docs/CLEANUP_REPORT.md` for current cleanup status.

Severity scale: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## CRITICAL — Data Loss / Business Risk

### TD-001 — Assessment Form Discards All Leads
- **Severity:** 🔴 Critical
- **File:** `apps/web/src/app/assessments/page.tsx:33`
- **Issue:** `submit()` function contains `await new Promise(r => setTimeout(r, 1000))` with comment `// TODO: wire to Strapi/n8n webhook`. **No data is sent anywhere.** Every lead submitting the "diagnóstico gratuito" form is silently lost.
- **Business impact:** 100% of form conversions are lost. This is the primary CTA of the entire site.
- **Recommendation:** Create Next.js Route Handler `app/api/leads/route.ts` → POST to Strapi `Lead` collection. Do NOT replace the form; just wire the existing submit handler.

### TD-002 — Frontend Never Connects to Strapi API
- **Severity:** 🔴 Critical
- **Files:** All pages in `apps/web/src/app/`
- **Issue:** Zero API calls from frontend to backend. `axios` and `NEXT_PUBLIC_API_URL` are installed/configured but never used. Strapi exists as a running service but serves no content to the frontend.
- **Business impact:** Content cannot be updated without code deploys. Blog, services, and case studies are permanently locked in source code.
- **Recommendation:** Wire pages incrementally — start with Blog (highest content velocity), then Casos, then Homepage CMS fields.

### TD-003 — Strapi Has No Content Types
- **Severity:** 🔴 Critical
- **File:** `apps/api/src/api/.gitkeep`
- **Issue:** The entire Strapi CMS is a blank install. No content model exists. No API endpoints exist beyond default auth routes.
- **Business impact:** The CMS is completely non-functional. Cannot manage any content without code.
- **Recommendation:** Create content types in order: Lead → Post → Caso. Use Strapi admin UI (no-code) to define the schema.

---

## HIGH — Security Issues

### TD-004 — Default Secret Keys in Production
- **Severity:** 🔴 Critical (Security)
- **File:** `apps/api/config/admin.js`
- **Issue:** `API_TOKEN_SALT` and `TRANSFER_TOKEN_SALT` both default to `'tobemodified'`. The root `.env` uses `JWT_SECRET=your-super-secret-jwt-key-change-in-production`.
- **Business impact:** If Railway env vars are not set, Strapi runs with known default secrets. API tokens and transfer tokens are compromised.
- **Recommendation:** Verify Railway environment variables are set for all secrets. Remove defaults from code (`throw new Error('missing env')` pattern instead).

### TD-005 — SSL Hardcoded False for Database
- **Severity:** 🟠 High (Security)
- **File:** `apps/api/config/database.js:11`
- **Issue:** `ssl: false` is hardcoded. Railway PostgreSQL connections often require SSL.
- **Business impact:** Connection may fail in production if Railway enforces SSL, OR connections are unencrypted if SSL is available but disabled.
- **Recommendation:** Change to `ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false`

### TD-006 — CORS Not Configured for Production Domains
- **Severity:** 🟠 High (Security)
- **File:** `apps/api/config/middlewares.js`
- **Issue:** Uses default `'strapi::cors'` with no origin configuration. Default Strapi CORS allows all origins in development mode.
- **Business impact:** Any domain can make cross-origin requests to the Strapi API.
- **Recommendation:** Configure CORS middleware with explicit `origin` whitelist: `[process.env.FRONTEND_URL]`

### TD-007 — No Security Headers on Next.js
- **Severity:** 🟠 High (Security)
- **Issue:** No `next.config.js` exists. No HTTP security headers are set (CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy).
- **Business impact:** Vulnerability to clickjacking, MIME sniffing, and potential XSS vectors.
- **Recommendation:** Create `apps/web/next.config.js` with `headers()` function returning security headers.

### TD-008 — WhatsApp Number is a Placeholder
- **Severity:** 🟠 High (Business)
- **File:** `apps/web/src/components/FloatingCTA.tsx:28`
- **Issue:** `href="https://wa.me/5215500000000"` — all zeros, not a real number.
- **Business impact:** Every user who clicks "Hablar por WhatsApp" reaches a dead link.
- **Recommendation:** Replace with real WhatsApp Business number.

---

## HIGH — Architecture Issues

### TD-009 — All Pages Are `'use client'`
- **Severity:** 🟠 High (SEO + Performance)
- **Files:** All 6 page files in `apps/web/src/app/`
- **Issue:** All pages start with `'use client'` directive, forcing full client-side rendering. Blog, Services, Casos, and Nosotros pages have no dynamic interactivity — they are static content that should be Server Components (RSC) for better SEO and performance.
- **Business impact:** Search engines receive less content from initial HTML. LCP (Largest Contentful Paint) is higher because JavaScript must execute before content renders.
- **Recommendation:** Remove `'use client'` from static pages (Blog, Services, Casos, Nosotros). Add it only to interactive leaf components (form, accordion, etc.). This requires migrating from hardcoded arrays to server-side data fetching first.

### TD-010 — Two Conflicting Deployment Configs for API
- **Severity:** 🟡 Medium (Ops)
- **Files:** `apps/api/railway.json`, `apps/api/nixpacks.toml`
- **Issue:** `railway.json` specifies `"builder": "DOCKERFILE"` but `nixpacks.toml` also exists (Nixpacks builder format). Railway reads `railway.json` and uses Dockerfile. The `nixpacks.toml` is dead config.
- **Recommendation:** Delete `apps/api/nixpacks.toml` to avoid confusion.

### TD-011 — Root `railway.json` May Be Stale
- **Severity:** 🟡 Medium (Ops)
- **File:** `/railway.json`
- **Issue:** The root `railway.json` has `"builder": "dockerfile"` and `"startCommand": "npm run build && npm start"`. Each app has its own `railway.json`. The root one may be leftover from an earlier single-service setup.
- **Recommendation:** Verify whether Railway uses root or app-level config, then remove the one that's not in use.

---

## MEDIUM — Unused Dependencies

### TD-012 — Zustand Installed, Never Used
- **Severity:** 🟡 Medium
- **File:** `apps/web/package.json`
- **Issue:** `zustand@4.4.0` is listed as a dependency but never imported in any file in `apps/web/src/`.
- **Impact:** Adds ~13KB to bundle for no reason. Creates false assumption about state architecture.
- **Recommendation:** When Strapi API integration begins, decide: use Zustand for caching API responses (then implement stores), or remove it if TanStack Query or SWR is preferred.

### TD-013 — Axios Installed, Never Used
- **Severity:** 🟡 Medium
- **File:** `apps/web/package.json`
- **Issue:** `axios@1.6.0` installed but not imported anywhere. Even the one API call that should exist (assessments form) uses a TODO comment with no implementation.
- **Recommendation:** Either implement Strapi API calls using axios (as intended) or use native `fetch()` and remove axios.

### TD-014 — i18n Plugin Active but Unused
- **Severity:** 🟡 Medium
- **File:** `apps/api/package.json`
- **Issue:** `@strapi/plugin-i18n` is installed and active. The site is Spanish-only with no multilingual content planned. The plugin adds overhead to every API response and content type creation.
- **Recommendation:** Disable in `config/plugins.js` if internationalization is not planned. This simplifies the data model.

---

## MEDIUM — Duplicate/Inconsistent Patterns

### TD-015 — Two Canvas Animation Implementations
- **Severity:** 🟡 Medium
- **Files:** `components/NetworkBg.tsx`, `components/Footer.tsx` (FooterCanvas function)
- **Issue:** Two separate `requestAnimationFrame` canvas loop implementations with similar node-network patterns. FooterCanvas is an inline function component inside Footer.tsx (not a separate file), while NetworkBg is a separate component with dynamic import.
- **Recommendation:** Consolidate into a single reusable `NodeCanvas` component with props for node count, colors, and link distance. Extract FooterCanvas to a separate file for consistency.

### TD-016 — `fadeUp` Helper Duplicated in Every Page
- **Severity:** 🟢 Low
- **Files:** `page.tsx`, `blog/page.tsx`, `casos/page.tsx`, `services/page.tsx`, `nosotros/page.tsx`
- **Issue:** Every page defines its own `const fadeUp = (delay) => ({...})` helper function with slightly different values (duration 0.5 vs 0.55, y: 20 vs 24).
- **Recommendation:** Extract to `src/lib/animations.ts` as a shared utility. Minor inconsistencies in values should be standardized first.

### TD-017 — Color System Has Two Sources of Truth
- **Severity:** 🟡 Medium
- **Files:** `tailwind.config.js`, `globals.css`
- **Issue:** Colors defined in Tailwind config (design tokens) but `globals.css` also has hardcoded hex values (`rgba(245,158,11,...)`) in card classes, light theme overrides, and keyframes. When colors need to change, two files must be updated.
- **Recommendation:** Use CSS custom properties from Tailwind theme where possible. At minimum, document that both files must be updated together.

### TD-018 — Light Theme via CSS `!important` Overrides
- **Severity:** 🟡 Medium
- **File:** `apps/web/src/app/globals.css` (lines 311–392)
- **Issue:** Light theme is implemented as `html.light .card { ... !important }` CSS overrides — 80+ lines of `!important` declarations. This is brittle because any new component that uses Tailwind utilities must add a corresponding override to globals.css manually.
- **Recommendation:** The cleanest approach is Tailwind's `dark:` variant (already enabled with `darkMode: 'class'`). Light should be the default, dark should use `dark:` prefixes. Current implementation has it inverted. This is a significant but worthwhile refactor once content is managed through CMS.

---

## LOW — Code Quality

### TD-019 — All Data in Component Files (No Separation)
- **Severity:** 🟢 Low (now) / 🟠 High (at scale)
- **Files:** All page files
- **Issue:** Business data (service descriptions, blog posts, case studies, certifications) is mixed with rendering logic in component files. No `src/data/` directory or type definitions for data shapes.
- **Recommendation:** When Strapi integration begins, data naturally moves to the CMS. In the interim, extract to `src/data/` files with TypeScript interfaces.

### TD-020 — `Sparkline` Component Duplicated
- **Severity:** 🟢 Low
- **Files:** `components/NOCDashboard.tsx` (Sparkline function), `components/ServicePanel.tsx` (MiniSparkline function)
- **Issue:** Two separate SVG sparkline implementations. Different function names but same purpose.
- **Recommendation:** Extract to `src/components/ui/Sparkline.tsx` with a shared interface. Use in both NOCDashboard and ServicePanel.

### TD-021 — Missing Error Boundaries
- **Severity:** 🟡 Medium
- **Files:** All pages, layout.tsx
- **Issue:** No `error.tsx` files in App Router, no React error boundaries. If any component throws (canvas API unavailable, framer-motion issue), the entire page crashes with a white screen.
- **Recommendation:** Add `apps/web/src/app/error.tsx` as a root error boundary. Add `loading.tsx` for streaming support.

### TD-022 — No Input Sanitization
- **Severity:** 🟡 Medium
- **File:** `apps/web/src/app/assessments/page.tsx`
- **Issue:** Form inputs (name, email, company, notes) have no sanitization. When the form is eventually wired to Strapi, unsanitized input will be stored directly.
- **Recommendation:** Add basic sanitization (trim whitespace, strip HTML tags) before API call. Consider using `zod` for schema validation.

### TD-023 — No `robots.txt` or `sitemap.xml`
- **Severity:** 🟡 Medium (SEO)
- **Issue:** `apps/web/public/` contains only favicons. No robots.txt (search engines may crawl unintended paths) and no sitemap.xml (crawlers must discover pages through links only).
- **Recommendation:** Add `apps/web/public/robots.txt` and generate `sitemap.xml` via Next.js Metadata Route API (`app/sitemap.ts`).

### TD-024 — No Open Graph Images
- **Severity:** 🟢 Low (SEO)
- **File:** `apps/web/src/app/layout.tsx`
- **Issue:** Metadata has `title` and `description` but no `openGraph.images`. Social media shares show no preview image.
- **Recommendation:** Create a 1200×630 OG image and add to metadata. Can be automated with Next.js `generateImageMetadata` for blog posts.

### TD-025 — No Analytics
- **Severity:** 🟡 Medium (Business)
- **Issue:** No tracking implemented. Cannot measure page views, CTA clicks, form starts/completions, or conversion rate.
- **Recommendation:** Add Plausible (privacy-friendly) or Google Analytics 4 via `@next/third-parties`. At minimum, track: page views, FloatingCTA clicks, assessment form completions.

### TD-026 — `'use client'` on 404 Page Should Be Server Component
- **Severity:** 🟢 Low
- **File:** `apps/web/src/app/not-found.tsx`
- **Issue:** Actually not a client component (no `'use client'` directive) — this is already a server component. No issue here.
- **Status:** OK ✓

### TD-027 — `docs/ARCHITECTURE.md` Describes Strapi v5, Not v4
- **Severity:** 🟢 Low (Docs)
- **File:** `docs/ARCHITECTURE.md`
- **Issue:** Documentation says Strapi v5 but installed version is v4.22.1. Development environment says SQLite but only PostgreSQL is configured.
- **Recommendation:** Update architecture doc to reflect reality. This doc now supersedes the stale one.

---

## Debt Summary Table

| ID | Area | Severity | Impact |
|---|---|---|---|
| TD-001 | Lead capture broken | 🔴 Critical | 100% of leads lost |
| TD-002 | No API connection | 🔴 Critical | CMS unusable |
| TD-003 | No content types | 🔴 Critical | Backend is empty |
| TD-004 | Default secrets | 🔴 Critical | Security |
| TD-005 | SSL hardcoded false | 🟠 High | Security/reliability |
| TD-006 | CORS open | 🟠 High | Security |
| TD-007 | No security headers | 🟠 High | Security |
| TD-008 | Fake WhatsApp number | 🟠 High | Business conversion |
| TD-009 | All pages client-only | 🟠 High | SEO/performance |
| TD-010 | Duplicate deploy config | 🟡 Medium | Ops confusion |
| TD-012 | Zustand unused | 🟡 Medium | Bundle bloat |
| TD-013 | Axios unused | 🟡 Medium | Bundle bloat |
| TD-015 | Canvas code dup | 🟡 Medium | Maintainability |
| TD-016 | fadeUp duplicated | 🟢 Low | Maintainability |
| TD-017 | Color 2 sources | 🟡 Medium | Maintainability |
| TD-018 | Light theme !important | 🟡 Medium | Scalability |
| TD-021 | No error boundaries | 🟡 Medium | Reliability |
| TD-022 | No input validation | 🟡 Medium | Security |
| TD-023 | No robots/sitemap | 🟡 Medium | SEO |
| TD-025 | No analytics | 🟡 Medium | Business insight |
