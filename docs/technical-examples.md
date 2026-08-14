# LEM-BOX Platform — Public Technical Examples

[Spanish version](technical-examples.es.md)

> These are public synthetic reference examples, independently reimplemented from the approved public architecture and workflows. They are not production source code, production permissions, or a complete business implementation.

## 1. Purpose

Phase 3 includes a small body of accepted executable evidence for the case study. The examples show domain modeling, explicit transition checks, default-deny decisions, responsibility boundaries, external-information normalization, field minimization, immutable behavior, and testability. Their purpose is pedagogical: they make selected Phase 2 concepts concrete without rebuilding the private platform.

## 2. Independence from production

The modules and tests were written from scratch for this repository. They derive only from the approved, sanitized public architecture and selected public workflows plus new synthetic decisions made for Phase 3.

No production source, tests, fixtures, schemas, configuration, routes, rules, identities, or Git history were read or copied. No production data was anonymized, transformed, sampled, exported, or included. The public actor, resource, action, state, event, query-category, field, and reason-code names do not reproduce production vocabulary. Functional equivalence is neither intended nor claimed.

## 3. Tooling

Tooling is isolated under [`examples/`](../examples/):

- strict TypeScript with modern Node.js ESM resolution;
- Vitest for local automated tests;
- Node.js type declarations for the read-only fixture validator; and
- exact development-dependency versions captured by the lockfile.

The package has no runtime dependencies, web framework, authorization library, external SDK, generative-system library, or cloud tooling. Example execution requires no network access.

## 4. Directory structure

```text
examples/
  src/
    shared/
    shipment-lifecycle.ts
    role-scoped-access.ts
    tracking-timeline.ts
    scoped-internal-query.ts
    synthetic-fixture-validator.ts
  test/
fixtures/
  synthetic/
```

The source modules expose small typed functions. Tests remain beside the isolated package, while fixtures remain at the repository level so their synthetic status is visible independently of the tooling.

## 5. Shipment lifecycle example

The lifecycle module uses an invented set of states to demonstrate pure transition validation. A valid transition creates a new shipment value and appends a caller-supplied timestamp to a minimal history. An invalid or terminal-state transition returns a typed rejection, and the original value remains unchanged.

The graph is intentionally incomplete and synthetic. It is not the production state model and omits tracking, physical attributes, rates, payments, customer information, batch behavior, persistence, notifications, and external effects.

## 6. Role-scoped access example

The access module accepts an actor, resource, action, actor scope, and resource scope, then returns an explicit decision with a synthetic reason code and short public explanation. It validates the complete context and denies unknown, incomplete, cross-scope, or unlisted combinations.

The matrix is deliberately limited: a matching role name never creates universal access, a business administrator remains scoped, and a financial-status reference permits only narrowly authorized reads. This is an illustrative fail-closed decision—not authentication, an enforcement layer, or production authorization logic.

## 7. Tracking timeline example

The timeline module receives already-synthetic, provider-neutral events. It validates timestamps and event types, maps accepted events to generalized public stages, removes equivalent duplicates, applies deterministic chronological ordering, preserves safe synthetic messages, and reports rejected events without mutating the input.

It contains no carrier, tracking identifier, location, external code, request, webhook, or provider mapping. The public mapping is invented for this example and is not a production event model.

## 8. Scoped internal-query example

The boundary module accepts a synthetic actor, category, scope, and requested fields. It returns allowed and denied fields plus an abstract plan that contains no source or business data. Only the documented public fields for a category can survive the boundary; unrecognized or sensitive fields are removed, and an invalid context creates no plan.

The example demonstrates a scoped query boundary. It is not an assistant implementation and does not describe the production assistant, its provider, prompts, or data-access controls.

It does not perform a query, generate natural language, make a generative or autonomous business decision, identify a data source, or claim an AI capability. Its only decision is the deterministic field-and-context boundary described above.

## 9. Fixture validation

The read-only validator checks all six JSON files in [`fixtures/synthetic/`](../fixtures/synthetic/). It enforces the `demo-` identifier namespace, the documented 2030 UTC window, exact file-specific shapes, approved synthetic vocabulary, prohibited keys, and suspicious-value patterns. Failures identify a safe code, filename, and JSON path without printing the complete value.

Validation makes no network request and does not change the files. The data policy is documented in [Synthetic Data](synthetic-data.md).

## 10. Running the examples

Node.js `>=20.19.0 <21` is required. Validated with Node.js 20.19.4 and npm 9.9.4. From `examples/`:

```sh
npm ci
npm run validate
```

The combined command runs TypeScript checking, all test suites, and the fixture-specific validation. See the [examples README](../examples/README.md) for individual commands.

## 11. What the examples demonstrate

- small domain types and discriminated results;
- immutable, deterministic transformations;
- caller-controlled time;
- complete-context validation and denial by default;
- explicit handling of invalid input;
- field-level minimization before a query boundary;
- synthetic-data constraints that are executable; and
- separation between domain logic, normalization, access decisions, fixtures, and tests.

## 12. What the examples deliberately omit

The examples include no full application, API, database, persistence, real authentication or authorization, production schema, private integration, payment behavior, operational pricing, production state model, external service, cloud configuration, assistant implementation, generative model/provider, prompt, user interface, screenshot, demo, deployment, or production-equivalent behavior.

They make no claim about production security, performance, completeness, scale, or implementation quality.

## 13. Licensing status

This repository intentionally provides no general license for reuse, redistribution, modification, derivative works, deployment, or commercialization and includes no `LICENSE` file. If it is made public through GitHub, users may view and fork it through GitHub as permitted by [GitHub's Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#5-license-grant-to-other-users); those platform permissions do not grant broader rights outside the Service or for other purposes. Except for rights provided by applicable law and those Terms, additional use requires permission from the applicable rights holder. The repository is not presented as open source. Any future license for examples must be stated explicitly and scoped to those examples; it would not automatically apply to documentation, images, branding, or other repository content. See [Licensing status](licensing.md).

## 14. Review gate

The Phase 3 examples and tests are included as accepted public evidence. Any future addition or change must pass the applicable review, validation, security, privacy, and independent publication gates before inclusion.
