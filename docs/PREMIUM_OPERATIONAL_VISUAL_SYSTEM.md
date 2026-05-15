# Premium Operational Visual System

## Scope

This phase moves Velkor from a correct enterprise site toward a premium consultive operational experience.

No backend, Strapi, CRM, scoring, proposal, automation, webhook, or content-type architecture was rebuilt. The work stays inside existing frontend routes and components.

## What Changed

- Added a centralized operational motion system in `apps/web/src/lib/motion/operationalMotion.ts`.
- Replaced generic reveal behavior with directional clip-path activation through the existing `motion.ts` facade.
- Added visibility-aware, reduced-motion-aware topology activity.
- Added DPR-capped and visibility-paused canvas background motion.
- Refined logo motion so nodes and links feel connected to the infrastructure language.
- Added a subtle navbar operational state indicator.
- Rebuilt `/servicios` from stacked cards into three operational capability modules.
- Added reusable visual evidence components in `OperationalEvidence.tsx`.
- Added sanitized audit fragments to `/framework/evidence` without changing its data source.
- Added mobile consultive CTA that appears only after scroll and is hidden on assessment/contact/legal routes.
- Extended light mode into a warmer technical paper surface for the new modules.

## What Was Removed Or Reduced

- Reduced generic opacity-only motion.
- Reduced card-like service presentation.
- Reduced repeated borders by using architecture strips, module sequencing, and evidence panels.
- Avoided new decorative sections and did not add fake dashboards.
- Avoided backend/data duplication; services and evidence remain existing pages.

## Visual Improvements

- Hero topology now has slower living infrastructure behavior: spoke pulses, node breathing, and path propagation.
- Services now read as deployable operational capabilities:
  - mini topology
  - affected infrastructure layer
  - deployment diff
  - policy overlay
  - expected outcome
- Evidence pages show real-world sanitized fragments earlier, before long document lists.
- Mobile service modules collapse into intentional single-column sequences instead of compressed desktop grids.
- Light mode now uses blueprint-gray structure, warm white surfaces, and muted graphite text.

## Performance Guardrails

- Canvas motion caps DPR at 1.6.
- Canvas animation pauses when the tab is hidden.
- Topology motion pauses outside viewport and respects `prefers-reduced-motion`.
- Motion utilities centralize timing and stagger decisions to avoid scattered animation logic.

## QA Checklist

- TypeScript: `npm run type-check -w apps/web`
- Lint: `npm run lint -w apps/web`
- Build: `npm run build -w apps/web`
- Browser QA:
  - desktop dark
  - desktop light
  - iPad
  - iPhone
  - Android width
  - console errors

## Pending

- Individual service detail pages still use older problem/solution card grids. They should be refactored next using the same `OperationalEvidence` components.
- `/services` remains a legacy English-path service catalog. It should either redirect to `/servicios` or be visually aligned in a later cleanup.
- More Strapi-managed service fields could eventually feed the visual modules, but no schema change was made in this phase.

## Final Premium Refinement Addendum

### Added

- Global operational atmosphere in `OperationalAtmosphere.tsx`, wired through the root layout.
- Reusable depth planes: `depth-0`, `depth-1`, `depth-2`, and `depth-focus`.
- Cursor proximity variables and surface handlers inside the existing `operationalMotion.ts` system.
- Infrastructure micro-visuals in `OperationalEvidence.tsx`:
  - packet route strip
  - deployment state line
  - trust boundary map
  - blueprint mesh inside architecture snapshots

### Reduced

- Service-page copy was shortened so evidence and topology carry more of the explanation.
- Risk exposure text now shows fewer signals and tighter operational wording.
- Typography weights were softened to reduce the “all bold” feel.
- Tag pills in service metadata were replaced with packet-route visuals.

### Performance Notes

- New atmosphere layer is CSS-first and pointer-throttled through the existing RAF helper.
- Evidence panels use layout/paint containment to reduce repaint scope.
- Existing reduced-motion behavior is preserved; proximity and pointer motion are disabled for reduced-motion users.

### Human Direction Still Useful

- Decide whether the legacy `/services` English route should redirect, stay indexed, or become a thin compatibility route.
- Decide whether service-detail pages should receive the same infrastructure visual language now or after content is normalized in Strapi.
