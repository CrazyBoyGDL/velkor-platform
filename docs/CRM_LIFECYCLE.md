# CRM Lifecycle — Operational Maturity

## Source of Truth

Strapi `lead` remains the operational CRM record. The web app builds payloads through `apps/web/src/lib/crm.ts`; route handlers do not handcraft lifecycle logic.

## Lifecycle Fields

| Field | Purpose |
| --- | --- |
| `workflow` | Routing lane: immediate review, governance, roadmap, or nurture. |
| `owner` | Operational owner role for the first response. |
| `lifecycleStage` | Current sales/operations stage. Starts at `new`. |
| `nurtureStage` | Follow-up sequence marker for long-cycle leads. |
| `operationalPriority` | Why the lead matters operationally. |
| `nextFollowUpAt` | Scheduled next action. |
| `staleAt` | Escalation deadline when no interaction occurs. |
| `escalationLevel` | Escalation path: owner, principal, or executive. |
| `governanceSignals` | Structured assessment signals for routing and audit context. |
| `relatedArtifacts` | Report, evidence, case, or framework references useful for follow-up. |

## Routing Rules

- Critical flags or active incidents route to `immediate-review`, senior engineering ownership, and executive escalation.
- Enterprise or high-priority leads route to same-day review with principal visibility.
- Compliance-driven leads route to governance workflow and evidence-sharing cadence.
- Modernization and managed-services leads route to roadmap workflow.
- Low-urgency or resource-only leads enter nurture with evidence-share/reactivation stages.

## Stale Lead Handling

`buildFollowUpReminder()` calculates `nextFollowUpAt` and `staleAt` from the assigned workflow. `isLeadStale()` evaluates stage SLA without creating a parallel scheduler; external automation can call the same lifecycle fields from Strapi.

## Backward Compatibility

Legacy `status` remains available for Strapi/admin compatibility. New lifecycle fields are additive and optional.
