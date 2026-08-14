# Public Scope and Security

[Versión en español](public-scope-and-security.es.md)

**Status:** publication boundaries applied to the accepted Phases 1 through 4A and to every future public update.

## Purpose

This document defines the publication boundary for the LEM-BOX technical companion. The companion has an independent Git history and is separate from the private production system. Its purpose is to present a curated technical case, not to distribute or reconstruct the production platform.

An item being listed as in scope does not mean that future additions are approved automatically. Repository coverage includes the accepted Phase 1 foundation, Phase 2 architecture and workflow content, Phase 3 synthetic fixtures and independently reimplemented examples, and Phase 4A Current Web Snapshot v1.

## In scope

The following categories may be included in future public updates only after individual review:

- high-level system context;
- high-level architecture documentation;
- selected product decisions;
- migration strategy;
- selected workflows;
- testing approach;
- sanitized visuals;
- synthetic datasets;
- isolated reviewed examples; and
- public-facing technical documentation.

All material must explain the case without reproducing the production system or revealing operationally sensitive information.

Phase 2 content includes [sanitized, non-exhaustive high-level architecture](architecture.md) and [selected simplified public workflows](selected-workflows.md). Phase 3 includes [public technical examples](technical-examples.md) and [purpose-built synthetic data](synthetic-data.md). Phase 4A includes [Current Web Snapshot v1](current-web-snapshot.md) as accepted dated visual evidence; complete workflow evidence and any demo remain outside this repository.

## Out of scope

The following categories must not be published in this repository:

- production source code;
- Git history from production;
- production data;
- credentials;
- customer data;
- employee data;
- financial data;
- private integrations;
- payment implementation;
- administrative scripts;
- complete authorization rules;
- production environment identifiers;
- deployment configuration;
- internal prompts;
- assistant implementation;
- operational pricing;
- business-sensitive logic;
- security findings; and
- current or historical vulnerabilities.

These exclusions apply to visible files, Git history, metadata, examples, captures, logs, comments, and generated material, even when a source item appears harmless in isolation. Content must be evaluated in context, including information that could be inferred by combining it with other public material.

## Required review for future additions

Every future addition requires all five of the following steps:

1. **Individual review** — evaluate the specific file or change and its surrounding context; category-level approval is not sufficient.
2. **Sanitization** — remove or replace details that are private, identifying, operationally sensitive, or tied to production.
3. **Secret scanning** — check the candidate content and its independent Git history for credentials and credential-like material before publication.
4. **Personal-data review** — confirm that no customer, employee, or other personal data is present or inferable.
5. **Independent publication approval** — obtain an explicit decision from a reviewer who did not prepare the material.

Passing one step does not replace the others. Material can remain unsuitable for publication because of its context, provenance, or level of detail even when it is technically correct.

Any candidate material with an unresolved blocking finding remains excluded. It may be reconsidered only after the finding is resolved, the applicable validations are repeated, and new independent publication approval is obtained.

Candidate material must remain outside an approved public update until all five controls are complete. The controls must be revalidated against the exact release candidate before publication.

## Data and examples

The Phase 3 fixtures are synthetic. Their technical examples are isolated and independently reimplemented for this repository; none was copied from production.

Names, identifiers, events, and values used in examples must be fictitious and must not preserve a mapping to real operational data. Examples must not encode complete business-sensitive logic or recreate private integrations.

No production data was anonymized, transformed, sampled, or exported to create the Phase 3 fixtures. Validation enforces the public namespace, time window, closed shapes, and sensitive-content exclusions described in [Synthetic Data](synthetic-data.md).

## Visual evidence

Visual evidence can be included only as dated, versioned, and sanitized snapshots from a safe source, using purpose-built synthetic display records. Production screenshots and data remain excluded, and blurring production data does not make a capture eligible.

Current Web Snapshot v1 is included as accepted dated evidence. A targeted Phase 4B attestation for this version found no material post-baseline change affecting the two conditional candidate views, so no selective refresh was required. Any material future change to a represented surface must pass the same conditional refresh, privacy, manifest, and independent-review gates. Mobile evidence and Phase 4A2 remain separate future work.

## Integrations and internal assistants

The public case may state that the ecosystem includes integrations, automations, and internal assistants connected to authorized operational and financial data. It will not identify private integrations or disclose implementation, prompts, connected data, complete workflows, or financial details.

## Separation from production

This companion is not a fork, mirror, sanitized clone, distribution, or complete reconstruction of the production system. Production Git history will never be imported or transferred into the companion, nor rewritten to move it. Production commits, branches, pull request references, and Git objects will not be copied. All public content will enter only through the companion's independent history, and every addition will be reviewed individually.

Future examples must remain isolated and reviewed, data must remain synthetic, and visual material must come from safe sources.

Public documentation may describe high-level decisions, but it will not serve as a source for configuring, accessing, deploying, or operating the production system.

## Publication boundary

Public visibility does not turn this companion into the production system, an executable equivalent, or an open-source distribution; it is not a claim about production security and grants no general permission to reuse documentation, images, or examples. Rights boundaries are defined in [Licensing](licensing.md). The production system remains private. Every future public update must pass the applicable security and publication review and receive explicit approval.
