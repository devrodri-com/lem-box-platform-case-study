# ADR 0002: Keep production source private

## Status

Accepted.

## Context

The production system contains operational context, private integrations, deployment configuration, and business-sensitive logic that are not required to explain the technical case study. Publishing the production repository would create a broader and less controllable disclosure surface than a curated companion.

## Decision

The production source repository remains private. This independently initialized technical companion contains only selected, independently reviewed, sanitized material for the case study, without production Git history.

The companion will not link to, identify, or provide access instructions for the private production repository.

## Consequences

- Readers receive a bounded technical case rather than the complete implementation.
- Production code, configuration, data, integrations, and business-sensitive logic stay outside the public repository.
- Examples must be isolated and reviewed on their own merits instead of copied from production.
- Claims that cannot be supported without exposing private material are omitted.

## Revisit conditions

Revisit only if the ownership, operating model, and publication strategy change materially and an independent privacy, security, licensing, and business review approves a different boundary. Public interest or repository visibility alone is not sufficient reason to expose production source.
