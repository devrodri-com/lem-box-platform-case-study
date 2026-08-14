# ADR 0005: Use synthetic actors and states in public workflows

## Status

Accepted.

## Context

Selected workflows can explain product and operational decisions without reproducing production identities, role names, state models, or internal terminology. A direct mapping could expose private operating detail or imply that a simplified public workflow is the production source of truth.

## Decision

Phase 2 public workflows use simplified and generalized flows with synthetic actors, states, and names. Public documentation will prefer the terms synthetic, simplified, and generalized rather than describing this material as fake.

Public actors, states, names, and transitions will not preserve or disclose an exact mapping to their production counterparts. Only the minimum sequence needed to explain the selected public workflow is included.

## Consequences

- Public workflows are explanatory artifacts, not production specifications, fixtures, or operational instructions.
- Actors, states, names, and transitions may be renamed, combined, or omitted.
- Readers cannot infer exact production roles, state machines, authorization rules, or exception handling from the public material.
- Reviews must assess both the artifact and the risk of reconstructing a production mapping from it.
- Related prose and visuals must use the same synthetic and generalized vocabulary.

## Revisit conditions

Revisit the abstraction if a later approved artifact requires more domain precision. Any closer correspondence with production terminology or behavior requires individual review, sanitization, secret scanning, personal-data review, and independent publication approval; an exact production mapping remains outside the approved public scope.
