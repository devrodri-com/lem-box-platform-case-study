# ADR 0009: Use isolated synthetic data for public screenshots

## Status

Accepted.

## Context

Real-interface evidence must not expose, copy, or derive from production records. Blurring production data does not repair unsafe provenance and cannot turn a production-data capture into acceptable public-facing evidence.

## Decision

Every public screenshot uses a surface isolated from production data and purpose-built synthetic record content. Production-authenticated capture, anonymization, transformation, sampling, export, and blur-to-publish are excluded.

## Consequences

- Screenshots may illustrate real interface structure and selected flows, but not production data, scale, security, or business outcomes.
- Exact technical provenance remains outside the versioned repository.
- Any image with uncertain data origin or unresolved visual content is excluded.
- Review must cover both image pixels and image metadata.

## Revisit conditions

Every new platform or channel, including future Phase 4A2 or mobile evidence, requires its own source, synthetic-data, privacy, and review gate. The prohibition on using production data remains in force.
