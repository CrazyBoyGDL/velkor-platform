# Non-Code Workflow - Velkor Platform

This guide explains how to manage Velkor content and leads without editing code.

## Production Access

Use the Velkor production domain only:

```text
https://api.velkor.com.mx/operacion
```

The Railway public host is intentionally blocked for operational use. Do not share `*.up.railway.app` URLs with users, clients, or internal operators.

## Local Development

```text
http://localhost:1337/operacion
```

## What You Can Manage

- Leads from contact, assessment, and resource forms.
- Blog posts.
- Technical cases.
- Services.
- Downloadable resources.
- Testimonials.
- FAQ items.

## Leads Workflow

1. Open `Content Manager`.
2. Go to `Lead`.
3. Review source, company, priority, score, and notes.
4. Contact the lead.
5. Update the business status when the CRM workflow fields are ready for non-technical editing.

Avoid manually editing workflow JSON fields until the operator views are hardened.

## Publishing Content

1. Open the collection: `Post`, `Caso`, `Servicio`, `Recurso`, or `Testimonio`.
2. Create or edit an entry.
3. Save as draft.
4. Review spelling, claims, and confidentiality.
5. Publish.

## Safe Fields

Safe for non-technical editing:

- Titles.
- Descriptions.
- Article content.
- Sanitized case text.
- Service descriptions.
- Resource descriptions and file URLs.
- Testimonials approved for public use.

## Fields To Leave Alone

Do not edit these without technical review:

- `workflow`
- `tags`
- `governanceSignals`
- `relatedArtifacts`
- `engagementAuditTrail`
- `lifecycleStage`
- `operationalPriority`

These connect lead classification, automation, and CRM behavior.

## Next UX Phase

Recommended improvements for a smoother non-technical panel:

- Spanish labels for CRM fields.
- Role-based views: operator, editor, read-only, admin.
- Saved filters: new leads, critical assessments, overdue follow-up.
- Hidden technical JSON fields for non-admin roles.
- MFA policy for admin accounts.
- A simple lead checklist: reviewed, contacted, next action, owner.

See `docs/STRAPI_OPERATOR_GUIDE.md` for the current operator guide.
