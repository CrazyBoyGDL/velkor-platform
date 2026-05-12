# Velkor Platform — Architecture Map
**Date:** 2026-05-11 | **Status:** As-built (what actually exists)

---

## System Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    RAILWAY DEPLOYMENT                       │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────┐   │
│  │   apps/web          │    │   apps/api              │   │
│  │   Next.js 14        │    │   Strapi v4.22.1        │   │
│  │   Port: 3000        │    │   Port: 1337            │   │
│  │   Builder: Nixpacks │    │   Builder: Dockerfile   │   │
│  └─────────────────────┘    └─────────────────────────┘   │
│            │                          │                     │
│            │  ← NO CONNECTION →       │                     │
│            │    (should fetch API)    │                     │
│            │                          │                     │
│            └──────────────────────────┘                     │
│                         │                                   │
│              ┌──────────────────────┐                       │
│              │   PostgreSQL DB      │                       │
│              │   Railway managed    │                       │
│              └──────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

**Current state:** Frontend and backend are deployed independently but never communicate. The diagram above shows what SHOULD exist. Currently there are zero API calls from web to api.

---

## Frontend Component Tree

```
RootLayout (layout.tsx)
├── <html lang="es" class="dark">
│   └── <body>
│       └── ThemeProvider (context: theme, toggle)
│           ├── StatusBar          ← fixed top-0 z-50, h-9 (hardcoded data)
│           ├── Navbar             ← fixed top-9 z-40, h-[60px]
│           │   ├── Logo           ← animated SVG
│           │   ├── Nav links      ← 6 routes
│           │   └── ThemeToggle    ← icon button
│           ├── <main pt-[100px]>
│           │   └── [page content]
│           │       ↓
│           │   HomePage (page.tsx)
│           │   ├── NetworkBg      ← canvas, dynamic import ssr:false
│           │   ├── NOCDashboard   ← simulated metrics
│           │   ├── ServicePanel × 6  ← 3D tilt cards, static data
│           │   ├── NOCStory       ← 400vh Apple scroll section
│           │   └── Counter, SectionHeader, CtaStrip (inline components)
│           │
│           ├── Footer             ← canvas animation + parallax
│           ├── FloatingCTA        ← fixed bottom-right, WhatsApp + assessment
│           └── SocialProof        ← fixed bottom-left toast (simulated)
```

---

## Data Flow — Current Reality

```
CURRENT (broken/static):
┌──────────────────────────────────────────────────────┐
│                   apps/web/src/                      │
│                                                      │
│  page.tsx      → HARDCODED arrays (SERVICES,         │
│                  STATS, STEPS, TESTIMONIALS)         │
│                                                      │
│  blog/page     → HARDCODED POSTS array               │
│                  (4 fake articles)                   │
│                                                      │
│  casos/page    → HARDCODED CASES array               │
│                  (3 fake case studies)               │
│                                                      │
│  services/page → HARDCODED CATEGORIES array          │
│                                                      │
│  nosotros/page → HARDCODED STATS, VALUES, CERTS      │
│                                                      │
│  assessments   → Form collects data                  │
│                → setTimeout(1000) fake delay         │
│                → Data DISCARDED ← critical bug       │
└──────────────────────────────────────────────────────┘

DESIRED (target architecture):
┌──────────┐     ┌───────────────┐     ┌──────────────┐
│ Browser  │────▶│ Next.js web   │────▶│ Strapi API   │
│          │     │               │     │              │
│          │     │ /blog         │◀────│ /api/blogs   │
│          │     │ /casos        │◀────│ /api/casos   │
│          │     │ /services     │◀────│ /api/services│
│          │     │ /assessments  │────▶│ /api/leads   │
└──────────┘     └───────────────┘     └──────────────┘
                                               │
                                        ┌──────────────┐
                                        │  PostgreSQL  │
                                        └──────────────┘
```

---

## Page-by-Page Data Sources

| Page | Route | Data Source | API Connected? | SEO |
|---|---|---|---|---|
| Homepage | `/` | Hardcoded in `page.tsx` | No | ⚠ Client-only |
| Services | `/services` | Hardcoded `CATEGORIES[]` | No | ⚠ Client-only |
| Blog | `/blog` | Hardcoded `POSTS[]` | **No** | ❌ Client-only |
| Casos | `/casos` | Hardcoded `CASES[]` | **No** | ❌ Client-only |
| Nosotros | `/nosotros` | Hardcoded `STATS[]`, `VALUES[]` | No | ⚠ Client-only |
| Assessments | `/assessments` | Form state | TODO comment | ⚠ Client-only |

---

## Strapi Content Model — Current vs. Required

### Current State
```
apps/api/src/
├── api/
│   └── .gitkeep    ← EMPTY — no content types
├── extensions/
│   └── .gitkeep    ← EMPTY — no extensions
└── index.js        ← register(){}, bootstrap(){} — both empty
```

### Required Content Types (to match frontend)
```
Collection Types needed:
├── Post (blog-article)
│   ├── title        String (required)
│   ├── slug         UID (from title)
│   ├── excerpt      Text
│   ├── content      RichText/Blocks
│   ├── category     Enumeration
│   ├── publishedAt  DateTime
│   └── readTime     String
│
├── Caso (case-study)
│   ├── client       String
│   ├── sector       String
│   ├── year         String
│   ├── challenge    Text
│   ├── solution     Text
│   ├── result       String
│   ├── resultSub    String
│   ├── tags         JSON/Component
│   └── hex          String (color)
│
└── Lead (assessment submission)
    ├── name         String (required)
    ├── email        Email (required)
    ├── company      String (required)
    ├── phone        String
    ├── size         Enumeration
    ├── services     JSON
    ├── urgency      Enumeration
    ├── notes        Text
    └── status       Enumeration (new/contacted/closed)

Single Types needed:
├── Homepage (hero text, stats, testimonials)
└── ServicesPage (service categories)
```

---

## Deployment Pipeline

```
Developer
    │
    ▼ git push origin main
GitHub Repository
    │
    ▼ webhook
Railway
    ├── web service: Nixpacks build → next build → node server.js
    └── api service: Dockerfile build → strapi build → strapi start
```

**No tests, no linting gate, no staging environment.**

---

## Dependency Graph

```
velkor-platform (npm workspaces root)
├── apps/web
│   ├── next@14.2          ← framework
│   ├── react@18.3         ← runtime
│   ├── framer-motion@11.3 ← animations (used heavily)
│   ├── zustand@4.4        ← state (UNUSED)
│   ├── axios@1.6          ← HTTP (UNUSED)
│   ├── tailwindcss@3.4    ← styling
│   └── typescript@5.4     ← types
│
└── apps/api
    ├── @strapi/strapi@4.22.1        ← CMS framework
    ├── @strapi/plugin-users-permissions ← auth
    ├── @strapi/plugin-i18n          ← internationalization (configured but unused)
    └── pg@8.11                      ← PostgreSQL driver
```

---

## Security Posture

| Area | Status | Risk |
|---|---|---|
| JWT secret | Placeholder in .env | 🔴 CRITICAL — change in production |
| API token salt | `tobemodified` default | 🔴 CRITICAL |
| Transfer token salt | `tobemodified` default | 🔴 CRITICAL |
| App keys | `['key1','key2']` default | 🔴 CRITICAL |
| Database SSL | Hardcoded `false` | 🟡 HIGH |
| CORS | Default Strapi (allow all origins) | 🟡 HIGH |
| Security headers | None (no next.config.js) | 🟡 HIGH |
| Form CSRF | None | 🟡 MEDIUM |
| Rate limiting | None (client or server) | 🟡 MEDIUM |
| Input validation | None server-side | 🟡 MEDIUM |
| WhatsApp number | Placeholder `5215500000000` | 🟡 MEDIUM |
