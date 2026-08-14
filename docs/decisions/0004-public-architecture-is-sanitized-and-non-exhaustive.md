# ADR 0004: Keep public architecture sanitized and non-exhaustive

## Status

Accepted.

## Context

Public architecture material can explain selected responsibilities, boundaries, and interactions without reproducing the production system. Exact topology, configuration, deployment, schemas, controls, provider identities, vulnerabilities, or sensitive logic would exceed the companion's purpose and create an unnecessary disclosure surface.

## Decision

Phase 2 architecture material is newly authored, sanitized, high-level, and non-exhaustive. It presents selected conceptual components and relationships for explanation, not a complete specification or inventory of the production system.

Public architecture will not include exact production topology, configuration, deployment details, data schemas, complete authorization or security controls, private provider identities, vulnerability or security-finding detail, or sensitive business logic. Generalization and omission are intentional publication controls.

## Consequences

- Readers can understand selected system responsibilities without receiving a reproducible production design.
- Diagrams and supporting prose must make their high-level and non-exhaustive nature clear.
- Components, relationships, and flows may be generalized, combined, or omitted.
- Public architecture cannot be used as deployment, security-audit, or implementation documentation.
- Any proposal to add more detail requires its own review and publication approval.

## Revisit conditions

Revisit the level of detail if the public case-study scope changes or an approved artifact requires greater precision. Any expansion requires renewed sanitization, secret scanning, personal-data review, architecture-boundary review, and independent publication approval before it is committed.
