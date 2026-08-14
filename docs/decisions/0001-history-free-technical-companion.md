# ADR 0001: Use a history-free technical companion

## Status

Accepted.

## Context

The public case study needs enough technical context to explain selected product and engineering decisions without carrying material from a production repository. Importing or rewriting production history could transport credentials, personal or business-sensitive data, logs, branch and pull-request references, or other production metadata that is outside the public scope.

## Decision

The technical companion is created as a new repository with an independent Git history. It is not a fork, mirror, import, sanitized clone, or reconstructed copy of the production system.

Material may enter this repository only as a newly authored, individually reviewed publication artifact. Production commits, Git objects, refs, and metadata are not transferred.

## Consequences

- Public documentation must be written specifically for this case study.
- Future visuals, synthetic data, and isolated examples require their own review and publication approval.
- Production commits cannot be merged, cherry-picked, or imported.
- Relevant decision traceability must be documented without relying on private Git references.
- Some implementation detail will intentionally remain absent.

## Revisit conditions

Revisit the companion's delivery model if its public purpose or ownership changes materially. Any proposal to weaken history independence requires a new privacy, security, licensing, and publication review before action; direct production-history import remains outside the approved scope.
