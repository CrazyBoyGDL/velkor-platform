# Information Architecture Reduction Audit

Goal: stop feature accumulation and make Velkor read as a focused consultive firm, not a platform trying to expose every capability at once.

## Experience Levels

| Level | Purpose | Surfaces |
| --- | --- | --- |
| Level 1 | Fast understanding, trust, consultive conversion | `/`, primary navigation, final CTA surfaces |
| Level 2 | Operational proof and methodology | `/servicios`, `/casos`, `/framework`, `/framework/evidence` |
| Level 3 | Deep technical intelligence | `/blog/[slug]`, `/framework/operational-framework`, resource detail pages |

Rule: Level 1 must not show diagnostics, calculators, frameworks, evidence previews, and service proof simultaneously.

## Page Inventory

| Page | Classification | Keep | Merge / Move | Remove / Reduce |
| --- | --- | --- | --- | --- |
| `/` | Conversion critical | Hero, operational problems, method, one case, consultive CTA | Diagnostics move to assessment journey | Inline diagnostic block, repeated proof rails |
| `/servicios` | Support consultive | Three capability modules, diagrams, deployment diffs, contextual CTA | Deep technical proof moves to service detail/evidence | Inline diagnostics, repeated metadata, excessive layer labels |
| `/servicios/ciberseguridad` | Evidence profundo | Detailed capability narrative | Keep as Level 2/3 service detail | Review later for duplicate CTA/copy |
| `/servicios/identidad-acceso` | Evidence profundo | Detailed identity capability | Keep as Level 2/3 service detail | Review later for duplicate CTA/copy |
| `/servicios/videovigilancia` | Evidence profundo | Detailed CCTV capability | Keep as Level 2/3 service detail | Review later for duplicate CTA/copy |
| `/services` | Legacy visual | Backward compatibility only | Redirect to `/servicios` | English duplicate catalog UI |
| `/casos` | Evidence profundo | 1-2 flagship engineering narratives | Archive weaker/redundant cases below first two | Long list feeling, broad case catalog behavior |
| `/blog` | Support consultive | Intelligence brief index | Deep reading remains in article pages | Blog-like long excerpts, too many visible cards |
| `/blog/[slug]` | Deep technical content | Technical article body and article blocks | Keep Strapi source of truth | Later pass: shorter, more scan-first templates |
| `/framework` | Support consultive | Process map and checkpoints | Deep methodology links to operational framework/evidence | Long textual timeline, testimonial block, repeated CTA blocks |
| `/framework/operational-framework` | Deep technical content | Full operational methodology | Keep as Level 3 | Do not surface all detail on Level 1 |
| `/framework/evidence` | Evidence profundo | Evidence library | Keep as Level 2/3 | Do not preview repeatedly on home |
| `/framework/content-engine` | Deep technical/ops | Authority workflow | Keep for internal/authority context | Keep out of Level 1 |
| `/recursos` | Support consultive | Resource index | Keep but reduce CTA language over time | Card density later |
| `/recursos/*` | Deep technical content | Downloadable/checklist pages | Keep | No homepage previews |
| `/assessments` | Conversion critical | Full assessment wizard and lead capture | Receives CTA intent/source | Do not duplicate as inline diagnostics everywhere |
| `/contacto` | Conversion critical | Direct contact form | Keep | No change |
| `/nosotros` | Support trust | Human/operational credibility | Keep | Later reduce stats/values if redundant |
| `/legal/*` | Enterprise readiness | Legal placeholders | Keep | No visual promotion |

## Section Decisions

| Section / Pattern | Decision | Reason |
| --- | --- | --- |
| Homepage inline diagnostic | Remove from Level 1 | Creates feature density and breaks the five-block homepage model. |
| Service inline diagnostics | Remove from service index | Services should explain problem, operation, change, and CTA only. |
| `/services` legacy route | Replace with redirect | Duplicate English catalog conflicts with `/servicios` IA. |
| Framework long timeline cards | Replace with compact process map | Framework should be understood visually first. |
| Blog index long excerpts | Reduce into intelligence briefs | Blog index should scan like operational intelligence, not publication archive. |
| Case list breadth | Limit to first two flagship cases | Fewer cases, more perceived depth. |
| Adaptive CTA system | Keep | Centralized and useful for consultive conversion. |
| Assessment wizard | Keep | Canonical diagnostic/conversion flow. |
| Evidence library | Keep | Level 2/3 trust proof, not homepage content. |

## Removal Targets

- Inline diagnostic blocks on homepage and service index.
- Legacy `/services` catalog content.
- Framework testimonial block and duplicated evidence promo blocks.
- Blog index visible card count and excerpt density.
- Case index breadth beyond flagship narratives.

## Success Criteria

- Homepage has exactly five major blocks.
- Primary scroll path moves toward conversation, not documentation.
- Service index can be scanned without interacting with diagnostics.
- Public IA separates conversion, proof, and deep technical content.
- No new engines, pages, or systems introduced.
