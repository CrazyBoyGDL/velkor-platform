# Velkor Platform — Repository Audit
**Date:** 2026-05-11  
**Auditor:** Claude Sonnet 4.6  
**Scope:** Full repository read-only audit — no changes made

> Historical note: this audit reflects the pre-operational state from 2026-05-11. The platform now has Strapi content-types, assessment persistence, centralized analytics, CRM workflow logic, and authority content operations. Use `docs/PLATFORM.md`, `docs/CONTENT_ARCHITECTURE.md`, `docs/CRM_LIFECYCLE.md`, and `docs/ANALYTICS_EVENT_CATALOG.md` for current architecture.

---

## Executive Summary

Velkor is a monorepo (npm workspaces) composed of two apps:
- `apps/web` — Next.js 14 marketing/landing site
- `apps/api` — Strapi v4.22.1 headless CMS (PostgreSQL)

**Critical finding:** The two apps are architecturally connected in design but **completely disconnected in code**. The frontend never calls the Strapi API. All content is hardcoded. Lead capture is broken. The CMS has zero content types defined.

---

## 1. Frontend Architecture (`apps/web`)

### Framework & Runtime
| Item | Value |
|---|---|
| Framework | Next.js 14.2.0 |
| React | 18.3.0 |
| Language | TypeScript 5.4 (strict mode) |
| Node target | ES2020 |
| Module resolution | `bundler` (Next.js mode) |
| Path alias | `@/*` → `./src/*` |

### Routing
- **Router:** Next.js App Router (`src/app/`)
- **All routes are static** — no dynamic segments, no `[slug]`, no `generateStaticParams`

| Route | File | Type |
|---|---|---|
| `/` | `src/app/page.tsx` | Client component |
| `/services` | `src/app/services/page.tsx` | Client component |
| `/blog` | `src/app/blog/page.tsx` | Client component |
| `/casos` | `src/app/casos/page.tsx` | Client component |
| `/nosotros` | `src/app/nosotros/page.tsx` | Client component |
| `/assessments` | `src/app/assessments/page.tsx` | Client component |
| `*` | `src/app/not-found.tsx` | Server component |

**⚠ All inner pages are `'use client'`** — this prevents RSC benefits (SSR, SEO, streaming). Blog and service pages are fully client-rendered with hardcoded arrays. SEO impact: significant.

### Layout System
- Single root layout: `src/app/layout.tsx`
- Global wrappers: `ThemeProvider → StatusBar → Navbar → main → Footer → FloatingCTA → SocialProof`
- `main` has `pt-[100px]` to account for fixed StatusBar (36px) + Navbar (60px)
- No nested layouts, no loading.tsx, no error.tsx, no template.tsx

### Component Inventory

| Component | Location | Purpose | State | Notes |
|---|---|---|---|---|
| `Logo` | `components/Logo.tsx` | Animated SVG logo | Stateless | CSS keyframe animations |
| `Navbar` | `components/Navbar.tsx` | Fixed nav + mobile menu | `open`, `solid` (scroll) | ThemeToggle embedded |
| `StatusBar` | `components/StatusBar.tsx` | Fixed top ticker | `clock` | **All data hardcoded** |
| `Footer` | `components/Footer.tsx` | Canvas animation + links | Stateless | Canvas RAF loop |
| `ThemeProvider` | `components/ThemeProvider.tsx` | Dark/light context | `theme` | localStorage persistence |
| `ThemeToggle` | `components/ThemeToggle.tsx` | Theme switch button | via context | Icon button UI |
| `FloatingCTA` | `components/FloatingCTA.tsx` | Fixed bottom-right CTAs | `visible`, `expanded` | **WhatsApp number is placeholder** |
| `SocialProof` | `components/SocialProof.tsx` | Rotating toast | `index`, `visible` | Simulated activity |
| `NOCDashboard` | `components/NOCDashboard.tsx` | Hero right panel | `uptime`, `activity` | **100% fake/simulated data** |
| `NetworkBg` | `components/NetworkBg.tsx` | Hero canvas BG | Canvas RAF | Dynamic import (ssr:false) |
| `ServicePanel` | `components/ServicePanel.tsx` | 3D service card | Mouse motion values | Data from page.tsx props |
| `NOCStory` | `components/NOCStory.tsx` | Apple scroll section | Scroll progress | 400vh pinned |

### Theme System
- **Implementation:** Tailwind `darkMode: 'class'` + CSS `html.light {}` overrides
- **Persistence:** localStorage key `velkor-theme`
- **Default:** `dark` (hardcoded in `<html className="dark">`)
- **Light theme:** CSS `!important` overrides in `globals.css` — brittle, not Tailwind-native
- **Design tokens (tailwind.config.js):**
  - Surfaces: `surface.dark`, `surface.card`, `surface.raised`, `surface.border`
  - Brand: `amber` (primary), `amber.light`, `amber.dark`
  - Status: `noc.green`, `noc.yellow`, `noc.red`, `noc.blue`, `noc.cyan`
  - Fonts: Inter (sans), JetBrains Mono (mono)

### State Management
- **zustand v4.4 is installed but zero stores exist anywhere in the codebase**
- All state is local `useState` within individual components
- Theme state via React Context (ThemeProvider)
- No global state, no server state, no caching layer

### Installed but Unused Dependencies
| Package | Version | Used? | Risk |
|---|---|---|---|
| `zustand` | ^4.4.0 | **Never imported** | Dead dependency |
| `axios` | ^1.6.0 | **Never imported** | Dead dependency (except `NEXT_PUBLIC_API_URL` reference never used) |

### API Integration Status
**NONE.** Zero `fetch()` calls, zero `axios` calls, zero server actions. The only reference to `NEXT_PUBLIC_API_URL` in the codebase is in `assessments/page.tsx` as a comment (`// TODO: wire to Strapi/n8n webhook`). The Strapi backend is not consumed by the frontend at all.

### Forms
- Only one form: `/assessments/page.tsx`
- Form state: local `useState<Form>`
- On submit: `await new Promise(r => setTimeout(r, 1000))` — **fake 1-second delay, no data sent anywhere**
- **Every lead captured through this form is silently discarded**
- No validation library (manual required fields only)
- No CSRF protection
- No rate limiting client-side

### Animation Libraries
- **Framer Motion v11.3** — used extensively: `useScroll`, `useTransform`, `useSpring`, `useMotionValue`, `AnimatePresence`, `motion.*`
- **CSS keyframes** — in Logo.tsx (draw, signal, glow) and globals.css
- **Canvas RAF** — NetworkBg.tsx, Footer.tsx (FooterCanvas) — two separate canvas animation implementations

### Responsive System
- Tailwind CSS breakpoints: `sm` (640px), `lg` (1024px)
- Mobile-first approach in most components
- StatusBar has separate mobile (scrolling ticker) and desktop (static) layouts
- NOCStory: grid switches `grid-cols-1 lg:grid-cols-2`
- ServicePanel grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

---

## 2. Backend Architecture (`apps/api`)

### Framework & Runtime
| Item | Value |
|---|---|
| Framework | Strapi 4.22.1 |
| Language | JavaScript (no TypeScript config for Strapi itself) |
| Node required | >=20.0.0 |
| Database | PostgreSQL (pg 8.11) |
| Plugins | users-permissions, i18n |

### Content Types
**ZERO content types exist.** The `src/api/` directory contains only a `.gitkeep` file. No collections, no single types, no components, no dynamic zones have been created. The Strapi instance is a blank shell.

### API Endpoints Available
Only Strapi's built-in plugin endpoints:
- `POST /api/auth/local` — login
- `POST /api/auth/local/register` — register
- `GET /api/users/me` — current user
- Plugin user management endpoints

The endpoints documented in `docs/ARCHITECTURE.md` (`/api/services`, `/api/blogs`, `/api/assessments`, `/api/quotes`, `/api/leads`) **do not exist** — no content types = no API routes.

### Database Configuration
```
host: DATABASE_HOST (required env var)
port: DATABASE_PORT (default 5432)
database: DATABASE_NAME
user: DATABASE_USERNAME
password: DATABASE_PASSWORD
ssl: false  ← HARDCODED, not configurable
pool: min 2, max 10
```

**⚠ SSL is hardcoded to `false`** — Railway PostgreSQL may require SSL for connections. This should be `env.bool('DATABASE_SSL', false)`.

### Auth Configuration
```
JWT secret: env JWT_SECRET
Admin JWT: env ADMIN_JWT_SECRET (falls back to JWT_SECRET)
API token salt: env API_TOKEN_SALT (defaults to 'tobemodified')  ← SECURITY RISK
Transfer token salt: env TRANSFER_TOKEN_SALT (defaults to 'tobemodified')  ← SECURITY RISK
```

### Middleware Stack (default Strapi)
`logger → errors → security → cors → poweredBy → query → body → session → favicon → public`

**⚠ CORS is using default Strapi configuration** — not explicitly configured for production domains. No origin whitelist.

### Webhooks
**None defined.** The `docs/ARCHITECTURE.md` mentions Make/n8n webhook integration for blog events, but no webhooks are configured in Strapi and the automation/ directory mentioned in docs does not exist in the repository.

### Deployment Configuration
The API has **two conflicting deployment configs:**

| File | Builder | Start Command |
|---|---|---|
| `railway.json` | DOCKERFILE | `npm start` |
| `nixpacks.toml` | Nixpacks | `npm run start` |

Railway uses `railway.json` which points to the Dockerfile. The `nixpacks.toml` is likely unused but creates confusion.

---

## 3. Infrastructure

### Repository Structure
```
velkor-platform/           ← npm workspace root
├── apps/
│   ├── web/              ← Next.js 14 (deployed separately on Railway)
│   └── api/              ← Strapi v4 (deployed separately on Railway)
├── docker-compose.yml    ← Local development only
├── docs/                 ← Architecture documentation (partially stale)
├── .env                  ← Root env (for docker-compose only)
├── .env.example          
└── railway.json          ← ROOT railway.json (uses Dockerfile builder — stale?)
```

### Railway Deployment
- **Two separate Railway services**, each with their own `railway.json`
- `apps/web/railway.json`: Nixpacks builder, `npm run start`
- `apps/api/railway.json`: Dockerfile builder, `npm start`
- Auto-deploy on push to `main` (GitHub sync)
- Restart policy: ON_FAILURE, max 3 retries

### Web Build Process
```
Nixpacks:
  1. npm install
  2. npm run build  (next build → standalone output)
  3. node server.js
```
The Dockerfile in `apps/web/` uses multi-stage build with Next.js standalone output. However, the `railway.json` specifies Nixpacks builder, not Dockerfile — the Dockerfile may be unused in production.

### Environment Variables Required (Production)
**web:**
- `NEXT_PUBLIC_API_URL` — Strapi URL (currently unused in code)
- `NODE_ENV=production`

**api:**
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `API_TOKEN_SALT`
- `TRANSFER_TOKEN_SALT`
- `APP_KEYS`
- `HOST`, `PORT`
- `NODE_ENV=production`

### Static Assets
`apps/web/public/`:
- `favicon.svg` — dark theme favicon
- `favicon-white.svg` — light theme favicon
- `.gitkeep`

**Missing:**
- `robots.txt`
- `sitemap.xml`
- `og-image.png` (no Open Graph image)
- Any other static media

### Analytics
**None.** No Google Analytics, Plausible, Vercel Analytics, PostHog, or any tracking implementation.

### Security Headers
Not configured. No `next.config.js` exists (default Next.js config). No custom headers for CSP, HSTS, X-Frame-Options, etc.

### CI/CD
No CI pipeline (no `.github/workflows/`). Deployment is Railway auto-deploy on push to main. No test step, no lint gate, no build verification before deploy.

### Image Optimization
Next.js Image component (`next/image`) is not used anywhere. All image rendering uses `<svg>` or Canvas — no external images at all. The Strapi upload directory is configured but empty.
