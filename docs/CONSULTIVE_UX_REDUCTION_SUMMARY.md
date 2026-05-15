# Consultive UX Reduction Summary

Goal: reduce visible complexity so Velkor reads as a focused consultive engineering firm, not a platform exposing every capability at once.

## Reduction Summary

- Homepage reduced to the primary consultive path: hero, operational problems, how Velkor works, one flagship case, trust CTA.
- Service index reduced to three operational capabilities with problem, operational change, evidence visuals, and one contextual CTA.
- Framework page reduced from a long textual timeline into a compact process map plus operational checkpoints.
- Blog index converted into a brief-style intelligence surface with one featured item and a short scan list.
- Case index curated to the first two flagship narratives instead of a broad catalog.

## Removed Sections Report

| Removed / Reduced | Location | Reason |
| --- | --- | --- |
| Inline diagnostic block | `/` | Level 1 should create clarity and conversation, not expose tools immediately. |
| Inline diagnostics per service | `/servicios` | Services should stay consultive: problem, operation, change, CTA. |
| Legacy English service catalog | `/services` | Duplicate route created IA noise and conflicting service language. |
| Long framework timeline cards | `/framework` | Too much explanation before process trust was clear. |
| Framework testimonial and duplicated promo blocks | `/framework` | Repeated conversion surfaces diluted process credibility. |
| Blog card grid breadth | `/blog` | Publication archive behavior competed with intelligence brief positioning. |
| Case catalog breadth | `/casos` | Fewer flagship cases create stronger depth and memorability. |

## Legacy Cleanup Report

- `/services` now redirects to `/servicios` for backward compatibility without maintaining a second catalog UI.
- `InlineDiagnostics` visual component was removed from public Level 1/2 pages.
- Central scoring, analytics, CRM, assessment, and adaptive CTA systems remain intact.
- No new scoring engine, CTA engine, backend flow, Strapi schema, or page system was introduced.

## IA Restructuring Summary

| Level | Role | Examples |
| --- | --- | --- |
| Level 1 | Fast understanding and consultive conversion | `/`, primary CTA surfaces |
| Level 2 | Operational proof and methodology | `/servicios`, `/casos`, `/framework`, `/framework/evidence` |
| Level 3 | Deep technical evidence and implementation detail | `/blog/[slug]`, `/framework/operational-framework`, resource details |

Rule reinforced: do not show diagnostics, calculators, frameworks, evidence previews, and service proof simultaneously on Level 1.

## Homepage Simplification Summary

The homepage now answers only:

1. What Velkor does.
2. What operational problems it sees.
3. How Velkor works.
4. Why the work is credible.
5. What conversation to start.

This removes the feeling of a full platform demo and restores the first scroll path as a calm consultive narrative.

## Remaining Direction For Human Review

- Decide whether the two flagship cases shown by default are the strongest commercial references.
- Review article detail pages next for scan-first intelligence brief templates.
- Confirm whether `/recursos` should remain visible in primary navigation or stay as Level 2/3 support content.
