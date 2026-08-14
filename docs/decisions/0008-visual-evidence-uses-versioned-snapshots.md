# ADR 0008: Publish visual evidence as versioned snapshots

## Status

Accepted.

## Context

Product interfaces continue to evolve. A screenshot can provide useful historical evidence, but a single image cannot be presented as permanently current or as the final state of the product. Public-facing visual evidence also needs a clear date and version without exposing private source or build provenance.

## Decision

Publish visual evidence as explicitly dated and versioned snapshots. The first accepted set is Current Web Snapshot v1, captured in August 2026. Exact technical traceability remains in non-versioned audit records.

## Consequences

- A snapshot remains valid as verifiable historical evidence of the selected interface at its capture date.
- Minor product changes do not automatically require replacement of an earlier snapshot.
- A new snapshot or selective refresh is considered after material changes to navigation, visual identity, workflow, scope, visible capability, primary action, presented data structure, user-context experience, or platform.
- The targeted Phase 4B attestation for this version found no material post-baseline change in captures 06 or 09, so no refresh was required for this version.
- Phase 4B remains a conditional refresh gate before any future public update affected by material interface changes.
- Mobile evidence remains a separate future update.

## Revisit conditions

Revisit this decision if the publication scope, evidence cadence, or supported platforms change. Any revision must preserve explicit dating, versioning, independent review, and the boundary between public metadata and private technical provenance.
