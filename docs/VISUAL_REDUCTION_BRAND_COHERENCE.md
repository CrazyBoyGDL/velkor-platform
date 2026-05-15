# Visual Reduction & Brand Coherence

## Scope

This phase reduces the public homepage and tightens Velkor's enterprise identity without changing backend, CRM, scoring, proposal, analytics, or Strapi architecture.

The homepage now behaves as a consultive entry point, not a full platform dossier:

1. Hero
2. Real operational problems
3. How Velkor works
4. One strong case study
5. Trust and engagement CTA

## Architecture Guardrails

- No new Strapi content-types were created.
- No duplicate UI system, layout engine, analytics layer, CRM flow, or content source was introduced.
- Existing homepage components were extended or removed when they had become global noise.
- Strapi remains the source of truth for operational content entities.
- The change is visual and editorial only; operational engines remain intact.

## Reduction Summary

- Removed homepage sections that duplicated platform documentation: service ecosystem, operational storyboard, executive diagnostic, operational artifacts, large metrics, testimonials, and repeated framework blocks.
- Kept the landing focused on decision clarity: what Velkor does, why the problem matters, how engagement works, and where to act.
- Reduced copy density in the hero, risk, process, case, and final CTA areas.
- Replaced card-heavy rhythm with quieter editorial bands, process rows, and one featured case surface.

## Brand System Summary

- Logo treatment moved toward steel/graphite instead of amber-dominant signaling.
- Wordmark language now reads as `OPERATIONS`, aligning the identity with operational consulting instead of a generic "system" feel.
- Palette hierarchy is restrained:
  - Graphite navy for primary surfaces.
  - Steel blue for structure and technical signal.
  - Muted cyan for low-volume topology activity.
  - Amber reserved for primary CTA.
  - Green and red reserved for success and risk states.
- Light mode was refined toward a whitepaper/editorial technical feel, not a simple dark-mode inversion.

## Motion Simplification Summary

- Removed scroll-driven parallax from the hero and footer.
- Removed SVG radius animation that produced browser console warnings.
- Kept slow topology movement and subtle node activity as infrastructure context.
- Removed global floating/status motion patterns that competed with the consultive path.

## Homepage Restructure

The homepage was reduced to a five-part narrative:

- Hero: clear positioning and two decision paths.
- Risk: three real operational exposure patterns.
- Workflow: diagnostic, technical route, implementation.
- Featured case: one credible multi-site segmentation/access case.
- Final CTA: expectation framing before assessment or engineering conversation.

## Mobile Findings

- Mobile hero no longer stacks the desktop signal rail.
- First mobile viewport now prioritizes headline, supporting copy, and two clear actions.
- The next section appears earlier, reducing the feeling of a compressed desktop page.
- Touch targets remain full-width and calm.

## Visual Cleanup

Removed deprecated/noisy global patterns:

- `StatusBar`
- `FloatingCTA`
- `SocialProof`

Reduced:

- Glow usage
- Decorative borders
- Repeated cards
- Overlapping operational labels
- Distributed animation behavior

## QA Evidence

Local validation:

- `npm run type-check -w apps/web`
- `npm run lint -w apps/web`
- Chrome CDP visual QA on desktop and mobile
- Console QA: 0 browser warnings/errors after final pass

Screenshot artifacts:

- `C:\Users\sandr\AppData\Local\Temp\velkor-visual-reduction\after-home-desktop-qa.png`
- `C:\Users\sandr\AppData\Local\Temp\velkor-visual-reduction\after-home-mobile-844.png`
- `C:\Users\sandr\AppData\Local\Temp\velkor-visual-reduction\after-home-case-desktop-qa.png`

## Ongoing Rule

The homepage should not absorb every new operational proof point. New depth should move into cases, framework pages, evidence pages, or Strapi-managed content, while the landing stays calm, minimal, and conversion-oriented.
