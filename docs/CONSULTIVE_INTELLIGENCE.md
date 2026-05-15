# Consultive Intelligence Layer

This phase turns the public site from a passive landing experience into a lightweight operational qualification flow.

## Scope

- No backend rebuild.
- No duplicate scoring engine.
- No duplicate CRM flow.
- No Strapi schema change.
- No new form platform.

The layer reuses:

- `apps/web/src/lib/scoring.ts` for diagnostic scoring.
- `apps/web/src/components/Analytics.tsx` for event dispatch.
- `apps/web/src/lib/analyticsEvents.ts` for event names and properties.
- Existing assessment entry at `/assessments` for full lead capture.

## Inline Diagnostics

Micro-diagnostics live in `DIAGNOSTIC_SETS` inside `apps/web/src/lib/scoring.ts`.

Current diagnostic/calculator sets:

| ID | Purpose | CTA intent |
| --- | --- | --- |
| `exposure-estimator` | General exposure estimate across segmentation, identity, endpoint, shared accounts, and CCTV isolation. | `operational-review` |
| `segmentation-maturity` | Network segmentation maturity and rollback discipline. | `segmentation-validation` |
| `identity-risk-scan` | MFA, Conditional Access, shared admin, and offboarding exposure. | `identity-exposure-review` |
| `endpoint-governance` | Endpoint inventory, device compliance, BYOD, and patch ownership. | `endpoint-governance-check` |
| `mfa-gap-detector` | MFA exceptions, legacy auth, vendors, and break-glass governance. | `mfa-gap-review` |

`scoreDiagnosticAnswers()` returns a `DiagnosticResult` with score, exposure, findings, CTA intent, service interest, and lead signals.

## Adaptive CTA System

CTA copy and target logic are centralized in `apps/web/src/lib/consultiveCta.ts`.

The helper maps context into consultive actions:

| Intent | Label |
| --- | --- |
| `operational-review` | Aterrizar diagnostico tecnico |
| `segmentation-validation` | Validar segmentacion actual |
| `identity-exposure-review` | Revisar exposicion de identidades |
| `endpoint-governance-check` | Detectar endpoints fuera de gobierno |
| `mfa-gap-review` | Cerrar brecha MFA |
| `remote-access-review` | Evaluar acceso remoto |

The resulting href points to `/assessments` with `intent` and `source` query params. The assessment remains the canonical long-form lead capture path.

## Lead Intelligence

`apps/web/src/lib/leadIntelligence.ts` stores a privacy-safe session profile in `sessionStorage`.

It records:

- diagnostic start/completion
- adaptive CTA views/clicks
- service interest
- urgency estimate
- maturity estimate
- last consultive intent

This is not a CRM replacement. It is a client-side behavioral profile for future enrichment when the user enters the assessment or contact flow.

## Analytics Events

All tracking continues through the existing analytics layer.

New event families:

- `Adaptive CTA Shown`
- `Adaptive CTA Clicked`
- `Diagnostic Started`
- `Diagnostic Answered`
- `Diagnostic Completed`
- `Calculator Completed`
- `Lead Intelligence Signal`

No PII is sent. Events carry diagnostic IDs, score bands, exposure, service interest, CTA intent, and source location.

## UX Integration

- Home: `exposure-estimator` appears after the risk section as a quick consultive check.
- Services: each service capability receives a compact diagnostic tied to that operational layer.
- Mobile: sticky CTA uses the adaptive CTA helper instead of fixed generic copy.
- Trust close: final CTA now routes through the same adaptive CTA component.

## Cleanup Notes

- Generic homepage/mobile CTA labels were reduced.
- No orphan components were introduced: `AdaptiveCTA` and `InlineDiagnostics` are used by public flows.
- No deprecated scoring, analytics, CRM, proposal, or Strapi systems were replaced.
