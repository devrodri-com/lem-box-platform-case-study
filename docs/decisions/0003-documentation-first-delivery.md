# ADR 0003: Deliver documentation first

## Status

Accepted.

## Context

A useful public case study needs a clear purpose, evidence boundary, vocabulary, and review process before technical artifacts are introduced. Adding code, datasets, screenshots, or detailed diagrams too early would make it harder to judge whether each artifact is necessary, accurate, sanitized, and appropriately licensed.

## Decision

Delivery begins with business context, case-study scope, high-level decisions, publication boundaries, and a phased roadmap.

Sanitized architecture, selected workflows, synthetic data, isolated technical examples, and current visual evidence may be added only in later phases. Every artifact must receive individual review, sanitization, secret scanning, personal-data review, and independent publication approval before it is committed.

## Consequences

- The first phase is intentionally documentation-only.
- The repository can establish a coherent public narrative before presenting implementation detail.
- Future artifacts have explicit entry and exit gates.
- Some technical questions remain unanswered until a safe and verifiable artifact is approved.
- Documentation may need to evolve as later evidence is reviewed.

## Revisit conditions

Revisit the ordering if documentation no longer provides enough context to evaluate a proposed artifact or if the publication process changes. The requirement for individual review and approval remains in force regardless of delivery order.
