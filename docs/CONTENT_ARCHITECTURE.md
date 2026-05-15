# Content Architecture Summary

## Principle

Strapi remains the source of truth for technical content. The frontend renders operational metadata from existing content-types and does not maintain a parallel SEO/content schema.

## Post Evolution

The existing `post` content-type now supports:

- `technicalLevel`
- `technicalCategory`
- `operationalTags`
- `industryContext`
- `relatedEvidence`
- `relatedCases`
- `relatedFrameworks`
- `architectureReferences`
- `architectureDiagram`
- `downloadableArtifact`
- `downloadableArtifacts`
- `articleBlocks`
- `governanceNotes`

All fields are optional and backward compatible.

## Technical Article Layout

`apps/web/src/components/TechnicalArticleBlocks.tsx` renders Strapi-managed `articleBlocks`:

- `architecture-callout`
- `operational-warning`
- `governance-insight`
- `evidence-reference`
- `rollout-consideration`

The renderer is intentionally narrow: it formats operational evidence already modeled in Strapi instead of introducing a second content engine.

## Flagship Articles

`apps/api/src/content/authority-posts.js` seeds three technical articles if missing:

- Conditional Access failures in hybrid SMB environments
- Operational risks of unmanaged onboarding
- Minimum viable segmentation for distributed SMB infrastructure

The seed is idempotent and does not overwrite existing Strapi entries. Set `SEED_AUTHORITY_CONTENT=false` to disable startup seeding.

## Authority Asset Reuse

`apps/web/src/lib/contentEngine.ts` defines reusable metadata, templates, and LinkedIn authority formats. These assets support distribution workflows while keeping source content tied to Strapi posts, cases, evidence, and frameworks.
