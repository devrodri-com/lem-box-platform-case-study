# ADR 0007: Synthetic data is obviously fictional

## Status

Accepted.

## Context

Technical examples need repeatable inputs, but production records—even anonymized, transformed, sampled, or exported records—would create privacy, provenance, and inference risk. Merely changing names would not make operational values appropriate for this repository.

## Decision

Public fixtures are authored from scratch and use:

- identifiers beginning with `demo-`;
- recognizably fictitious labels and scopes;
- explicit UTC timestamps only within calendar year 2030;
- deliberate absence of personal data, monetary values, physical measurements, rates, real tracking identifiers, and business-sensitive values; and
- automated validation of exact file shapes, keys, identifiers, timestamps, vocabulary, and suspicious values.

No production data is anonymized, transformed, sampled, or exported to produce these fixtures.

## Consequences

- Readers must not interpret the fixtures as anonymized production samples.
- The fixtures cannot demonstrate production scale, distributions, edge cases, schemas, or business values.
- Any new field or fixture category requires explicit synthetic design and validator coverage.
- A failing validation or provenance review blocks the fixture from the approved public tree and any future public update.

## Revisit conditions

Revisit the fixture shapes only when an approved public example needs additional synthetic coverage. The `demo-` namespace, fictional provenance, sensitive-value exclusions, automated validation, and independent-review gate remain mandatory.
