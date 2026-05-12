# Velkor Platform — UX & Product Risk Register
**Date:** 2026-05-11 | **Type:** Read-only audit

Severity: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## CRITICAL — Trust & Legal Risk

### UX-001 — NOC Dashboard Displays Fake Live Data as Real
- **Severity:** 🔴 Critical (Trust)
- **File:** `components/NOCDashboard.tsx`
- **Issue:** The hero section prominently displays a panel labeled "EN VIVO" with:
  - `Disponibilidad: 99.9%` — hardcoded, fluctuates with `Math.random()`
  - `Amenazas hoy: 141` — hardcoded static value
  - `Usuarios M365: 141` — hardcoded static value
  - Activity log with `"Puerto 8443 con tráfico inusual"`, `"fw-core · Fortinet FG-200F"`, `"velkor-mgmt.empresa.com"` — all fictional
  - Clock shows real time but all data is fake
- **Business risk:** If a prospect realizes this is simulated (and technical buyers WILL), all trust is destroyed. Presenting fabricated operational data as live monitoring is deceptive marketing.
- **Recommendation:** Two paths:
  - A) Make it clearly illustrative: add a label "Ejemplo de panel NOC" or "Demo de monitoreo" — transforms it from deceptive to educational
  - B) Connect to real data: wire to actual Strapi metrics or a real monitoring endpoint. This is the long-term goal.

### UX-002 — StatusBar Shows Hardcoded Metrics as Live
- **Severity:** 🔴 Critical (Trust)
- **File:** `components/StatusBar.tsx`
- **Issue:** Fixed top bar shows `"Red empresarial 99.06%"`, `"Microsoft 365 99.88%"`, `"Fortinet FW PROTEGIDO"`, `"1 alerta EN REVISIÓN"` — all static hardcoded strings. Clock is real but data is fake. An IT professional reviewing this will immediately recognize these as placeholder values.
- **Recommendation:** Either source from real monitoring API, or change to generic brand messaging: `"Velkor NOC · Operacional"` with the real-time clock only.

### UX-003 — Casos de Éxito Contains Specific Fake Company Names
- **Severity:** 🔴 Critical (Legal)
- **File:** `apps/web/src/app/casos/page.tsx`
- **Issue:** `CASES[]` array contains:
  - `"Distribuidora Industrial del Norte"` — sounds like a real Mexican company
  - `"Corporativo Médico Especialidades"` — could be confused with real healthcare entity
  - `"Cadena de Retail · 8 sucursales"` — this one is generic enough
- **Business risk:** Using fabricated company names in "success stories" (Casos de éxito) presented as real projects is deceptive advertising. In regulated sectors (healthcare), false endorsements can have legal consequences.
- **Note:** The `nosotros/page.tsx` also contains `"Microsoft Gold Partner"` as a cert — verify this certification is actually held, as claiming Microsoft Partner status without it is a violation of Microsoft's partner program terms.
- **Recommendation:** Replace specific company names with sector + size descriptions (as already done in testimonials on homepage). Example: "Empresa distribuidora · Monterrey · 200 empleados".

### UX-004 — SocialProof Shows Simulated "Recent Activity"
- **Severity:** 🟠 High (Trust)
- **File:** `components/SocialProof.tsx`
- **Issue:** Fixed bottom-left toast rotates through entries like `"Empresa distribuidora · hace 4 min"`. The "hace X min" timestamps are static, not real. The same sequence repeats on every page load. A user who stays on the page will see `"hace 4 min"` the same entry always appears 5 seconds in.
- **Recommendation:** Either remove this component entirely, or change copy to make it clearly indicative: `"Servicio más solicitado"` instead of `"hace 4 min"`.

---

## HIGH — Conversion Blockers

### UX-005 — Assessment Form Gives No Error Feedback
- **Severity:** 🟠 High (Conversion)
- **File:** `apps/web/src/app/assessments/page.tsx:166`
- **Issue:** There is an `'error'` status defined but it's never triggered (no actual API call to fail). When the API is eventually wired, errors will be invisible unless this is addressed simultaneously.
- **Recommendation:** Implement error state UI when wiring the API: inline field errors, network error message, retry option.

### UX-006 — Submit Button Disabled Until Service is Selected
- **Severity:** 🟡 Medium (Conversion)
- **File:** `apps/web/src/app/assessments/page.tsx:172`
- **Issue:** `disabled={status === 'loading' || form.services.length === 0}` — the button is disabled if no service is checked. There is no visual indication to the user WHY the button is disabled or what they need to do to enable it.
- **Recommendation:** Add a helper text below the services section: "Selecciona al menos un servicio para continuar". The button could also scroll to the services section on click when disabled.

### UX-007 — Blog Has No Article Detail Pages
- **Severity:** 🟠 High (Content / SEO)
- **File:** `apps/web/src/app/blog/page.tsx`
- **Issue:** Blog cards display excerpts but there is no `/blog/[slug]` route. Clicking an article has no navigation — the cards are `<article>` elements with no `<Link>` or `onClick`. Users cannot read full articles. The blog exists visually but is non-functional as a content channel.
- **Business impact:** Zero SEO value from blog content (can't be indexed as full articles). Zero reader engagement beyond the list page.
- **Recommendation:** This requires both: 1) creating the Strapi `Post` content type with full content field, and 2) creating the `/blog/[slug]/page.tsx` dynamic route.

### UX-008 — No Blog Category Filter
- **Severity:** 🟢 Low
- **File:** `apps/web/src/app/blog/page.tsx`
- **Issue:** 4 articles across 4 different categories (Redes, CCTV, Cloud, Intune) with no way to filter. At 4 articles this is manageable; at 20+ it becomes a UX problem.
- **Recommendation:** Add category filter tabs once CMS is connected. Not urgent.

---

## HIGH — Mobile UX Issues

### UX-009 — NOCStory Section is Broken on Mobile
- **Severity:** 🟠 High (Mobile UX)
- **File:** `components/NOCStory.tsx`
- **Issue:** The sticky scroll section uses `height: 400vh` (four times the screen height) with a `sticky top-0 h-screen` inner container. On mobile:
  - The left panel (step indicators) and right panel (terminal) are in a `grid-cols-1 lg:grid-cols-2` layout
  - On mobile, both panels stack vertically but both must fit in one `h-screen` container
  - The terminal cards have `position: absolute` which overlaps with the step indicators
  - `<Terminal>` min-height is `min-h-[180px]` which may not fit on small screens
- **Recommendation:** On mobile, either: collapse NOCStory to a simplified timeline (no sticky scroll), or show only the terminal panel with a step indicator above it.

### UX-010 — FloatingCTA Overlaps SocialProof Toast on Mobile
- **Severity:** 🟡 Medium (Mobile UX)
- **Files:** `components/FloatingCTA.tsx`, `components/SocialProof.tsx`
- **Issue:** FloatingCTA is fixed `bottom-6 right-5`. SocialProof is fixed `bottom-6 left-5`. On narrow screens (320px–375px), if FloatingCTA is expanded, the expanded menu cards may overlap with the SocialProof toast.
- **Recommendation:** On mobile, delay SocialProof appearance until after FloatingCTA is collapsed. Or disable SocialProof on mobile viewports.

### UX-011 — Navbar Logo Text Truncates on Small Screens
- **Severity:** 🟢 Low
- **File:** `components/Navbar.tsx`
- **Issue:** Logo area has `flex-shrink-0` which prevents truncation, but the ThemeToggle also has `flex-shrink-0`. On very small screens (320px), with the burger button also present, the three fixed-width elements may overflow the container.
- **Recommendation:** Test on 320px width. Consider hiding ThemeToggle text label (`hidden sm:block` is already in place for the LIGHT/DARK text — verify it works at 320px).

### UX-012 — ServicePanel Cards Have No Mobile Touch Interaction
- **Severity:** 🟡 Medium
- **File:** `components/ServicePanel.tsx`
- **Issue:** The 3D tilt effect uses `onMouseMove` / `onMouseLeave` which don't fire on touch devices. On mobile, the specular highlight and perspective tilt are inactive, making the cards feel static.
- **Recommendation:** Cards should still feel premium on mobile. Add a subtle `whileTap={{ scale: 0.98 }}` Framer Motion prop for touch feedback.

---

## MEDIUM — SEO Issues

### UX-013 — All Pages Share the Same Metadata
- **Severity:** 🟡 Medium (SEO)
- **File:** `apps/web/src/app/layout.tsx`
- **Issue:** Only root metadata is defined in `layout.tsx`. Individual pages (`/blog`, `/services`, `/casos`) have no page-specific `metadata` export. All pages share the root title "Velkor System — Consultoría IT Empresarial".
- **Business impact:** Search engines cannot distinguish between pages. Blog articles cannot have unique titles/descriptions for ranking.
- **Recommendation:** Add `export const metadata: Metadata = {...}` to each page file. When CMS is connected, generate metadata dynamically from content.

### UX-014 — No Structured Data (Schema.org)
- **Severity:** 🟡 Medium (SEO)
- **Issue:** No JSON-LD or microdata markup anywhere. Velkor provides professional IT services — `LocalBusiness`, `Service`, and `Article` schemas would improve search visibility.
- **Recommendation:** Add at minimum: `LocalBusiness` schema in layout.tsx, `Article` schema in blog post pages (once they exist).

### UX-015 — Blog Articles Are Not Indexable
- **Severity:** 🟠 High (SEO)
- **File:** `apps/web/src/app/blog/page.tsx`
- **Issue:** Blog page is a client component showing a list of hardcoded excerpts. There are no individual article pages. Google can index the blog list page but cannot follow links to full articles (they don't exist). All article content is in `excerpt` strings that are truncated to 100 chars.
- **Business impact:** Zero organic traffic from technical content that prospects search for (e.g., "implementar Zero Trust Entra ID", "Fortinet VLAN configuración").

---

## MEDIUM — Accessibility Issues

### UX-016 — Color Contrast in Zinc-700 Text
- **Severity:** 🟡 Medium (Accessibility)
- **Issue:** `text-zinc-700` (`#3f3f46`) on dark backgrounds (`#0a0a0a`) has contrast ratio of approximately 2.5:1 — below WCAG AA minimum of 4.5:1 for body text. Used in: Footer link dots, ServicePanel tag labels, StatusBar separators.
- **Recommendation:** Raise to `text-zinc-600` or `text-zinc-500` for legible text content. Keep `zinc-700` only for decorative/non-essential elements.

### UX-017 — FloatingCTA Has No `aria-expanded` State
- **Severity:** 🟢 Low (Accessibility)
- **File:** `components/FloatingCTA.tsx:61`
- **Issue:** Toggle button uses `aria-label` but not `aria-expanded` to indicate open/closed state. Screen readers cannot tell users the current state.
- **Recommendation:** Add `aria-expanded={expanded}` to the button element.

### UX-018 — Canvas Elements Have No Accessible Alternative
- **Severity:** 🟢 Low (Accessibility)
- **Files:** `components/NetworkBg.tsx`, `components/Footer.tsx` (FooterCanvas)
- **Issue:** `<canvas>` elements have no `role`, `aria-label`, or fallback content. Screen readers skip them (acceptable since they're decorative), but should be explicitly marked.
- **Recommendation:** Add `aria-hidden="true"` to both canvas elements to explicitly declare them as decorative.

---

## Summary — Priority Order for Action

### Immediate (this week)
1. **UX-001** — Add "Demo" label to NOCDashboard or source real data
2. **UX-002** — Replace StatusBar hardcoded metrics with real status or brand message
3. **UX-003** — Remove specific fake company names from Casos page
4. **TD-001** — Wire assessment form (stops lead loss)
5. **TD-008** — Replace fake WhatsApp number

### Short term (next 2 weeks)
6. **UX-009** — Fix NOCStory on mobile
7. **UX-013** — Add page-specific SEO metadata
8. **UX-007** — Create blog article detail pages (requires Strapi Post type first)
9. **TD-002/003** — Create Strapi content types + wire blog

### Medium term (next month)
10. **UX-004** — Clean up SocialProof (remove fake timestamps)
11. **TD-009** — Convert static pages to Server Components
12. **TD-007** — Add Next.js security headers
13. **UX-014** — Add JSON-LD structured data
14. **TD-023** — Add robots.txt and sitemap.xml
