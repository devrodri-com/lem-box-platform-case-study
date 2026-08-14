# Public synthetic technical examples

These small TypeScript modules are public reference examples for the LEM-BOX technical case study. They were implemented independently from the approved public architecture and workflows. They are not production source code, production permissions, a complete business implementation, or a simplified clone of the private platform.

## Scope

The package contains four isolated examples:

- an immutable synthetic shipment lifecycle;
- a fail-closed, role-scoped access decision;
- deterministic normalization of provider-neutral tracking events; and
- a scoped internal-query boundary that performs no query and produces no response.

It also contains a read-only validator for the purpose-built files in [`../fixtures/synthetic/`](../fixtures/synthetic/).

The vocabulary is deliberately synthetic. Actor, resource, action, state, event, category, field, and reason-code names are public abstractions—not names, rules, permissions, or schemas from production.

## Requirements and installation

- Node.js `>=20.19.0 <21`.
- npm with lockfile support.

Validated with Node.js 20.19.4 and npm 9.9.4.

From this directory:

```sh
npm ci
```

The package has no runtime dependencies. Development dependencies are pinned exactly in `package.json` and `package-lock.json`.

## Validation

Run the complete local validation sequence:

```sh
npm run validate
```

That command runs strict TypeScript checking, all automated tests, and the synthetic-fixture validation. Individual commands are `npm run typecheck`, `npm test`, and `npm run validate:fixtures`.

## Structure

- `src/shared/` contains the public notice and approved synthetic vocabulary.
- `src/shipment-lifecycle.ts` models a small immutable transition example.
- `src/role-scoped-access.ts` returns explicit, default-deny decisions.
- `src/tracking-timeline.ts` maps valid synthetic events to a public timeline.
- `src/scoped-internal-query.ts` limits fields before an abstract query could occur.
- `src/synthetic-fixture-validator.ts` validates the six documented fixture files.
- `test/` contains isolated behavioral tests.

## Operational boundary

Example execution makes no network request and uses no external service, cloud SDK, database, authentication system, persistence layer, or deployment configuration. The query-boundary example is not an assistant implementation and makes no AI claim. There are no instructions for connecting these examples to production.

## Documentation and licensing

See [Technical Examples](../docs/technical-examples.md) and [Synthetic Data](../docs/synthetic-data.md) for the complete design and review boundaries.

No general license is granted for reuse, redistribution, modification, derivative works, deployment, or commercialization. No `LICENSE` file is included, and this repository is not presented as open source. If this repository is made public through GitHub, users may view these files and fork the repository through GitHub as permitted by [GitHub's Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#5-license-grant-to-other-users); those platform permissions do not grant broader rights outside the Service or for other purposes. Except for rights provided by applicable law and those Terms, additional use requires permission from the applicable rights holder. Any future license for selected examples must identify its exact file scope and will not automatically apply to the rest of the repository. See [Licensing](../docs/licensing.md).
