# Authority Distribution Workflows

## Objective

Turn real consulting work into reusable authority assets without producing generic SEO content or fake dashboards.

## Source Material

Use operational artifacts from:

- Strapi posts
- Strapi case studies
- evidence library references
- architecture diagrams
- rollout and handoff notes
- CRM engagement context

## LinkedIn Formats

The reusable formats live in `apps/web/src/lib/contentEngine.ts` and are surfaced in `/framework/content-engine`.

| Format | Best use |
| --- | --- |
| Architecture breakdown | Explain a technical decision with constraints and tradeoffs. |
| Governance snippet | Convert repeated field patterns into ownership/audit insight. |
| Implementation lesson | Show what changed when the plan met the real environment. |
| Rollout timeline | Present phased deployment with dependencies and rollback. |
| Mini case | Share a sanitized case while preserving technical specificity. |

## Operating Rules

- Every distributed asset should connect to evidence, case study, framework, architecture reference, or downloadable artifact when available.
- Sanitized does not mean generic. Keep industry, scale, constraints, dependencies, and operational outcomes.
- Use rollout and rollback details to show implementation credibility.
- Avoid feature language and marketing claims that cannot be traced back to real delivery.
