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
| `Evidence Document Clicked` | NDA/full-document request from evidence library. |
| `Evidence Diagram Viewed` | Architecture diagram rendered in evidence context. |
| `Case Study Engagement` | Case-study index engagement. |
| `Scroll Depth` | Blog/content depth thresholds. |
| `CTA Click` | Shared CTA wrapper for high-value links. |

## Conversion and Attribution

| Event | Purpose |
| --- | --- |
| `Contact Form Started` | First contact-form focus. |
| `Contact Form Submitted` | Contact form success. |
| `Resource Lead Submitted` | Resource gate unlock. |
| `Lead Source Attributed` | UTM/referrer attribution on assessment entry. |
| `Conversion Path Updated` | Reserved event for future cross-session path enrichment. |
| `Device Behavior Detected` | Privacy-safe device behavior signal. |

## Privacy Posture

Events carry operational context only: source, stage, category, score band, artifact labels, and device class. No PII is sent by the analytics helpers.
