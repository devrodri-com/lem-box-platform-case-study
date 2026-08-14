# Synthetic fixtures

Every file in [`synthetic/`](synthetic/) is purpose-built synthetic data for the public technical examples. The files do not contain anonymized, transformed, sampled, or exported production data.

## Shared rules

- Every identifier begins with `demo-`.
- Every timestamp is an explicit UTC value between `2030-01-01T00:00:00Z` and `2030-12-31T23:59:59Z`, inclusive.
- Labels, scopes, and messages are recognizably fictitious, using `Demo` or `Synthetic` wording.
- No personal data, real company or person name, address, contact detail, domain, real tracking identifier, credential, or private URL is allowed.
- No monetary value, physical measurement, price, payment detail, or financial account value is allowed.
- Each file has a closed, documented shape; unknown fields fail validation.

The six categories are synthetic actors, accounts, shipments, tracking events, internal-query requests, and financial-status references. A prohibited requested-field label may appear only as a negative boundary test; it carries no corresponding value.

## Validation

From `examples/` run:

```sh
npm ci
npm run validate:fixtures
```

The validator reads the files without changing them and reports safe error codes with a filename and JSON path. See [Synthetic Data](../docs/synthetic-data.md) for the complete policy and file descriptions.
