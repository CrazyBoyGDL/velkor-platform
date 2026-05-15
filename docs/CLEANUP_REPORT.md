# Cleanup Report

## Architecture Discipline

- No parallel analytics, CRM, email, proposal, or content engines were created.
- Strapi content-types were extended in place.
- Technical article rendering consumes Strapi fields instead of duplicating content in the web app.
- CRM lifecycle logic remains centralized in `apps/web/src/lib/crm.ts`.
- Analytics dispatch remains centralized in `apps/web/src/components/Analytics.tsx`.

## Removed or Avoided

- Avoided new branches per repository rule; work remained on `main`.
- Avoided a visual redesign, decorative sections, fake dashboards, and startup SaaS patterns.
- Avoided hardcoded frontend article bodies by seeding Strapi content idempotently.
- Avoided scattered analytics calls by adding small wrappers/hooks to the existing dispatcher.

## Current Validation

- `node -c apps/api/src/content/authority-posts.js`
- `node -c apps/api/src/index.js`
- `npm run type-check -w apps/web`

## Follow-up Cleanup Candidates

- Some historical audit docs still describe the 2026-05-11 blank Strapi state. They are now marked as historical/superseded rather than deleted because they preserve decision history.
- `axios` and `zustand` remain dependencies from the original app; remove only after confirming no planned near-term usage.
- Root/project Railway config drift should be reviewed separately before changing deployment files.
