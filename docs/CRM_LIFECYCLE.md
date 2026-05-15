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
| `engagementAuditTrail` | Chronological CRM events: lead creation, stage transition, owner assignment, follow-up, stale detection, escalation. |

## Routing Rules

- Critical flags or active incidents route to `immediate-review`, senior engineering ownership, and executive escalation.
- Enterprise or high-priority leads route to same-day review with principal visibility.
- Compliance-driven leads route to governance workflow and evidence-sharing cadence.
- Modernization and managed-services leads route to roadmap workflow.
- Low-urgency or resource-only leads enter nurture with evidence-share/reactivation stages.

## Stale Lead Handling

`buildFollowUpReminder()` calculates `nextFollowUpAt` and `staleAt` from the assigned workflow. `isLeadStale()` evaluates stage SLA without creating a parallel scheduler; external automation can call the same lifecycle fields from Strapi.

## Transition Helpers

`transitionLifecycleStage()` creates the update payload for stage changes without rebuilding CRM logic in route handlers or automations. It returns:

- `lifecycleStage`
- `lastInteractionAt`
- `nextFollowUpAt`
- `staleAt`
- `owner`
- `tags`
- appended `engagementAuditTrail`

`buildEngagementAuditEvent()` is the shared event constructor for lifecycle, ownership, follow-up, stale-lead, escalation, and nurture updates.

## Audit Trail Events

| Event | Meaning |
| --- | --- |
| `lead-created` | Lead entered Strapi and received workflow routing. |
| `stage-transition` | Lifecycle moved from one stage to another. |
| `owner-assigned` | Operational owner changed. |
| `follow-up-scheduled` | Next action/SLA was calculated. |
| `stale-detected` | Lead exceeded stage SLA. |
| `escalation-triggered` | Owner/principal/executive escalation became active. |
| `nurture-updated` | Long-cycle follow-up state changed. |

## Backward Compatibility

Legacy `status` remains available for Strapi/admin compatibility. New lifecycle fields are additive and optional.
