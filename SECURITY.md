# Security Policy

## Scope

This repository is a sanitized technical case study and is not the production repository or production system. This policy covers only accidental exposures or security problems in this companion's documentation, synthetic fixtures, independent examples, dependencies, and repository configuration.

## Reporting

Report a concern privately through one of these channels:

1. GitHub Private Vulnerability Reporting, when it is available and enabled on the final public repository.
2. `info@lem-box.com` as the alternative private contact.

Include only the minimum information needed to evaluate the companion: the affected public file or version, steps reproducible with synthetic data only, the observed impact on this repository, and a safe way to contact you. Do not include real records, credentials, secrets, or sensitive production detail.

No response or remediation time is promised by this policy.

## Important boundaries

Do not use a public issue, pull request, discussion, comment, or other public repository surface to report or include:

- secrets, credentials, tokens, or private links;
- personal, customer, employee, financial, or operational data;
- sensitive screenshots or production-system vulnerability details;
- private repository, infrastructure, provider, environment, or deployment information; or
- proofs of concept that expose operational information.

Do not test against production, probe production accounts or services, attempt to access a private system, or access, download, retain, or share real data. Do not use real data to reproduce a concern.

## What can be reported here

- accidental private-information exposure within this public companion;
- unsafe behavior in the synthetic examples or fixture validator;
- a vulnerable dependency used by the companion; or
- a repository configuration problem affecting this companion.

## Production-related concerns

The public issue tracker is not a support or disclosure channel for the real product. A concern related to the production system must be sent privately to `info@lem-box.com` with the minimum information necessary to explain the concern, without accessing, downloading, retaining, or sharing real data.

Do not publish the production URL, infrastructure details, private repository identity, private providers, environment names, credentials, internal procedures, or operational evidence.

## Related policies

- [Public Scope and Security](docs/public-scope-and-security.md)
- [Contributing](CONTRIBUTING.md)
- [Licensing](docs/licensing.md)
