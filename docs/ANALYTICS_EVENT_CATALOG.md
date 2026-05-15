# Analytics Event Catalog

The analytics layer is centralized in `apps/web/src/lib/analyticsEvents.ts` and dispatched through `apps/web/src/components/Analytics.tsx`.

## Providers

- Plausible via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- PostHog via `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- No provider configured means no-op tracking.

## Assessment Funnel

| Event | Purpose |
| --- | --- |
| `Assessment Started` | Assessment entry by device class. |
| `Mobile Assessment Started` | Mobile-specific assessment start. |
| `Assessment Step Completed` | Wizard progress and time spent. |
| `Assessment Step Abandoned` | Navigation away before completion. |
| `Assessment Submitted` | Submission attempt. |
| `Assessment Completed` | Scores and classification returned. |
| `Assessment Error` | Network or validation failure. |
| `Assessment PDF Opened` | Report window generated. |
| `Artifact Downloaded` | Gated report/resource artifact unlock. |

## Authority Content

| Event | Purpose |
| --- | --- |
| `Blog Article Viewed` | Technical article view with slug, category, read time, and technical level. |
| `Evidence Document Clicked` | NDA/full-document request from evidence library. |
| `Evidence Diagram Viewed` | Architecture diagram rendered in evidence context. |
| `Evidence Depth Reached` | Evidence library viewed or deeper evidence context reached. |
| `Case Study Engagement` | Case-study index engagement. |
| `Case Study Depth Reached` | Case-study depth thresholds at 50% and 90%. |
| `Trust Signal Interaction` | Human trust layer views, clicks, and evidence requests. |
| `Engagement Expectation Viewed` | Reserved for consultive expectation blocks. |
| `Scroll Depth` | Blog/content depth thresholds. |
| `CTA Click` | Shared CTA wrapper for high-value links. |
| `Artifact Downloaded` | Download/open action for reports, resources, or operational artifacts. |

## Event Properties

| Event | Core props |
| --- | --- |
| `Blog Article Viewed` | `slug`, `category`, `read_time`, `technical_level` |
| `Scroll Depth` | `page`, `depth` |
| `Case Study Engagement` | `case_slug`, `sector`, `depth` |
| `Case Study Depth Reached` | `case_slug`, `sector`, `depth` |
| `Evidence Document Clicked` | `doc_title`, `category`, `status` |
| `Evidence Depth Reached` | `source`, `depth`, `category` |
| `Trust Signal Interaction` | `signal`, `location`, `interaction` |
| `Mobile Trust Engagement` | `page`, `signal`, `quality` |
| `Session Replay Ready` | `page`, `provider`, `enabled` |
| `Artifact Downloaded` | `artifact_title`, `artifact_type`, `gated`, `source` |
| `Device Behavior Detected` | `page`, `behavior`, `device` |

## Conversion and Attribution

| Event | Purpose |
| --- | --- |
| `Contact Form Started` | First contact-form focus. |
| `Contact Form Submitted` | Contact form success. |
| `Resource Lead Submitted` | Resource gate unlock. |
| `Lead Source Attributed` | UTM/referrer attribution on assessment entry. |
| `Conversion Path Updated` | Reserved event for future cross-session path enrichment. |
| `Device Behavior Detected` | Privacy-safe device behavior signal. |
| `Mobile Trust Engagement` | Mobile-specific trust layer view signal. |
| `Session Replay Ready` | Readiness marker only; no session replay script is loaded by default. |

## Consultive Intelligence

| Event | Purpose |
| --- | --- |
| `Adaptive CTA Shown` | Contextual CTA rendered with intent, service, source, and risk level. |
| `Adaptive CTA Clicked` | Contextual CTA clicked; also mirrors into the shared `CTA Click` wrapper. |
| `Diagnostic Started` | First answer in an inline diagnostic/calculator. |
| `Diagnostic Answered` | Individual diagnostic answer with privacy-safe risk delta. |
| `Diagnostic Completed` | Visible diagnostic completed with score, exposure, service, and CTA intent. |
| `Calculator Completed` | Alias event for operational calculator completion reporting. |
| `Lead Intelligence Signal` | Session-level behavioral signal for service interest, urgency, and maturity estimate. |

| Event | Core props |
| --- | --- |
| `Adaptive CTA Shown` | `intent`, `label`, `location`, `risk_level`, `service` |
| `Adaptive CTA Clicked` | `intent`, `label`, `location`, `risk_level`, `service` |
| `Diagnostic Started` | `diagnostic_id`, `location` |
| `Diagnostic Answered` | `diagnostic_id`, `question_id`, `answer`, `risk_delta` |
| `Diagnostic Completed` | `diagnostic_id`, `score`, `exposure`, `service`, `cta_intent` |
| `Calculator Completed` | `calculator_id`, `score`, `exposure`, `service` |
| `Lead Intelligence Signal` | `signal`, `source`, `weight`, `service`, `urgency`, `maturity` |

## Privacy Posture

Events carry operational context only: source, stage, category, score band, artifact labels, and device class. No PII is sent by the analytics helpers.

## Implementation Notes

- Event names are centralized in `apps/web/src/lib/analyticsEvents.ts`.
- Dispatch is centralized in `apps/web/src/components/Analytics.tsx`.
- Article and case-study tracking use small mounted client components/hooks; server components do not inline provider calls.
- Provider scripts are only loaded when env vars are present.
