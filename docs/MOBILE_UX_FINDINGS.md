# Mobile UX Findings

## Scope

This phase refined consultive usability without redesigning the interface or changing the hero.

## Findings

- Assessment CTAs already had a persistent mobile pattern; touch targets remain at or above 44 px.
- Evidence and diagram views need horizontal scroll affordance on narrow screens, already handled by `.arch-diagram-wrapper` and diagram hints.
- Technical articles needed tighter mobile rhythm so rich text, callout blocks, and evidence references do not feel like compressed desktop content.
- Case-study depth is now tracked at 50% and 90% to identify where operational narratives lose attention.

## Changes

- Added mobile line-height and heading rhythm refinements for `.blog-body`.
- Added `technical-article-block` styling with compact mobile padding.
- Added article view and device behavior analytics.
- Added case-study depth tracking through the centralized analytics helper.

## Residual Work

- Validate real mobile reading on deployed content once Strapi articles are seeded in production.
- If evidence diagrams grow, add pinch/zoom or a dedicated diagram route rather than squeezing diagrams into cards.
