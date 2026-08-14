# LEM-BOX Platform — Synthetic Data

[Spanish version](synthetic-data.es.md)

> Every fixture in this repository is purpose-built synthetic data. It is not a sanitized, anonymized, sampled, or transformed production record.

## Why synthetic data is used

The public technical examples need repeatable inputs without creating a relationship to a person, customer, business record, shipment, transaction, or private system. The six fixture files were therefore authored from scratch for the narrow public contracts in Phase 3.

No production data was anonymized, transformed, sampled, or exported to create these fixtures.

The fixtures demonstrate test cases only. They do not represent production schemas, volumes, distributions, relationships, edge cases, terminology, or current behavior.

## Identifier namespace

Every identifier must begin with `demo-`. This includes primary identifiers and references between fixture records. The namespace is deliberately conspicuous and has no mapping to a private identifier.

Examples use short labels such as “Demo Account A,” “Synthetic Region A,” “Demo operational record,” and “Demo financial reference.” Person names, real companies, real customers, and attributable operation names are not allowed.

## Synthetic time window

Every timestamp must be an explicit UTC value in this inclusive window:

- start: `2030-01-01T00:00:00Z`;
- end: `2030-12-31T23:59:59Z`.

The fixed future window makes the data recognizable as a constructed scenario and prevents current time from entering core behavior. Dates do not correspond to actual operations.

## Fixture categories

- [`actors.json`](../fixtures/synthetic/actors.json) provides the four approved synthetic actor labels and invented scopes.
- [`accounts.json`](../fixtures/synthetic/accounts.json) provides obvious demo labels and synthetic scope associations.
- [`shipments.json`](../fixtures/synthetic/shipments.json) provides minimal lifecycle records and candidate transitions for valid and invalid terminal-state behavior.
- [`tracking-events.json`](../fixtures/synthetic/tracking-events.json) provides deliberately unordered and equivalent provider-neutral events.
- [`internal-query-requests.json`](../fixtures/synthetic/internal-query-requests.json) provides allowed and denied field-boundary requests.
- [`financial-status-references.json`](../fixtures/synthetic/financial-status-references.json) provides status and date references without monetary or account values.

The files use closed, deliberately small structures. Unknown fields fail validation. Their fields are invented for the examples and must not be interpreted as production field or schema names.

## Prohibited keys and values

Keys that name or imply contact data, addresses, real tracking identifiers, monetary or physical business values, invoices, bank or account numbers, credentials, tokens, private keys, external secrets, or prompts are prohibited. Matching is case-insensitive and separator-insensitive so naming variations do not bypass the check.

Values that resemble email addresses, phone numbers, URLs, payment-card or account numbers, credential material, tokens, real tracking identifiers, large encoded blocks, or PEM content are also rejected. The validator never treats a value as safe merely because the surrounding record is labeled “demo.”

A fixture may contain the name of a prohibited requested field only as a negative boundary input. Such a marker contains no corresponding business value and the query-boundary example removes it.

## Deliberate absence of sensitive and business values

The fixtures contain no personal data, addresses, real places used as operational locations, contact details, monetary values, currencies, weights, rates, invoice identifiers, financial accounts, tracking numbers, customer identities, credentials, or secrets.

The financial-status fixture contains only an invented reference status and reference date. It cannot support a balance, payment, transaction, tax, pricing, or financial-performance inference.

## Automated validator

[`synthetic-fixture-validator.ts`](../examples/src/synthetic-fixture-validator.ts) reads all six files and applies:

1. the exact required filename set;
2. valid JSON and the documented top-level shape;
3. closed file-specific field shapes;
4. the `demo-` identifier namespace;
5. approved synthetic actors, states, events, categories, and fields;
6. the fixed 2030 timestamp window;
7. prohibited-key checks; and
8. suspicious-value and fictional-label checks.

The validator makes no network request and never changes a fixture. A failure reports a safe code, filename, and JSON path without printing the complete offending content.

## Running validation

From `examples/`:

```sh
npm ci
npm run validate:fixtures
```

The full package gate is `npm run validate`, which also runs strict type checking and all tests.

## Limits of the fixtures

Passing validation means only that the proposed files satisfy the documented public synthetic-data contract. It does not prove that arbitrary data is non-sensitive, validate production data, establish production security, or authorize a fixture for publication without human review.

The validator is intentionally conservative and file-specific. New fields, files, vocabularies, or scenarios require explicit design, documentation, tests, and review rather than an automatic schema expansion.

## Review process

Each fixture must pass individual review, synthetic-provenance review, automated validation, secret-pattern scanning, personal-data review, and independent publication approval. A failing or ambiguous result blocks the fixture. Production data must never be copied into this repository to create or debug a case.

The Phase 3 synthetic fixture set is included as accepted public evidence. Any future fixture addition or change must pass the review process above before inclusion; production data remains prohibited.
