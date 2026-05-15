# Human Operational Trust Layer

## Purpose

This layer makes Velkor feel like an operational engineering firm, not a synthetic systems page. It adds field evidence, client readiness, service boundaries, secure communication expectations, and responsible disclosure language without creating new backend systems.

## Architecture

- Home trust content is implemented in `apps/web/src/components/TrustValidationLayer.tsx`.
- Evidence fragments extend `OperationalArtifacts`, `OperationalStoryboard`, and `/framework/evidence`.
- Analytics uses the existing `Analytics.tsx` dispatcher and `analyticsEvents.ts` catalog.
- Company trust constants live in `apps/web/src/lib/config.ts`.
- Strapi remains the source of truth for CMS-backed entities; the current evidence repository stays a curated static reference until moved into existing Strapi content-types.

## Trust Signals Added

- Realistic field notes: shared accounts, unlabeled rack links, vendor VPN access, ERP exceptions.
- Explicit service boundaries: no forced hardware purchase, no production changes without rollback, no unsupported SLA claims.
- Client readiness flow: before discovery, during discovery, before proposal, and at close.
- Secure communication posture: NDA, safe credential exchange, responsible technical owner.
- Responsible disclosure placeholder linked to contact.

## Validation Standard

A trust signal is acceptable when it is specific, operational, privacy-safe, and does not claim unverifiable partner status or guaranteed outcomes.
