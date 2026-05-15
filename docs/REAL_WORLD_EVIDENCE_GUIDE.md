# Real-World Evidence Guide

## Evidence Standard

Evidence must feel like sanitized implementation material, not decorative proof. It should preserve operational context while removing sensitive data.

## Allowed Evidence Types

- Deployment snapshots with anonymized environment size and constraint.
- Rollout fragments with pauses, blockers, exceptions, and rollback notes.
- Runbook excerpts that name ownership, validation, and pending work.
- Governance decisions with responsible role and review cadence.
- Troubleshooting snippets that explain what was observed and what changed.

## Redaction Rules

- Remove client names, user names, hostnames, tenant IDs, public IPs, exact branch addresses, screenshots with visible PII, and credentials.
- Keep useful context: sector, size band, tool family, risk pattern, dependency, decision, and artifact produced.
- Mark evidence as `sanitized`, `template`, or `reference`.

## Current Implementation

- `OperationalArtifacts.tsx` shows three home artifacts with field notes.
- `OperationalStoryboard.tsx` shows real environment fragments and rollout sequence.
- `/framework/evidence` adds environment, field note, decision, and redaction metadata to selected evidence items.

## Migration Path

When evidence becomes CMS-managed, extend the existing Strapi `recurso`, `post`, or `caso` content-types. Do not create a parallel evidence engine.
