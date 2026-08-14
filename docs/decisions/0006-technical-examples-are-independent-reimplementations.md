# ADR 0006: Technical examples are independent reimplementations

## Status

Accepted.

## Context

Executable examples can make the approved public architecture and workflows easier to evaluate. Copying or closely preserving private implementation structure would undermine this independently initialized companion, which contains no production Git history, and could disclose production behavior even when individual names were changed.

## Decision

Phase 3 technical examples are implemented from scratch using only the approved public architecture and workflows plus deliberate synthetic design decisions. Production code and tests are not read or copied, production structure is not retained, and the examples do not attempt to reproduce the complete system.

Each source module carries a visible public-reference notice. The package remains isolated, has no runtime dependency or external access, and uses only the approved synthetic vocabulary.

## Consequences

- The examples demonstrate technical judgment, not functional equivalence with production.
- Public behavior may be intentionally smaller or different from any private implementation.
- Tests verify the invented public contracts only.
- A reviewer must reject any future update that drifts toward a production mapping or complete application.

## Revisit conditions

Revisit this decision only if a later public artifact needs a materially different teaching boundary. Production copying or reconstruction remains prohibited; any new scope still requires provenance review, sanitization, sensitive-content checks, and independent approval.
