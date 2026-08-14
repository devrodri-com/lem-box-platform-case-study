# Delivery Roadmap

[Versión en español](roadmap.es.md)

## How to read this roadmap

This roadmap defines seven gated phases for the LEM-BOX technical companion. It intentionally makes no date commitments. Completing one phase does not automatically authorize the next: every entry gate must be confirmed, and every exit gate must be satisfied through review.

The private production system remains outside this roadmap. All public material must be created or selected for this independently initialized companion, without production Git history, and evaluated under the boundaries in [Public Scope and Security](public-scope-and-security.md).

Phases 1 through 4A are included in the repository, reviewed, accepted, and closed. The targeted Phase 4B attestation for this version found no material post-baseline change affecting captures 06 or 09, so no refresh was required. Phase 5 defines the audit, bounded-remediation, and independent exact-version review controls that every release candidate must satisfy. Phases 6 and 7 are separately authorized external operations; the versioned tree does not claim or authorize their completion. Repository coverage alone does not satisfy a gate or authorize a later phase.

## Phase 1 — Documentation foundation

**Repository coverage:** Included, reviewed, accepted, and closed.

### Objective

Establish the identity, purpose, public boundary, case narrative, roadmap, and foundational decisions for the technical companion.

### Content

- English and Spanish repository overviews;
- English and Spanish case-study documents;
- public scope and security boundaries;
- this delivery roadmap;
- decision records covering history, production privacy, and documentation-first delivery;
- licensing status, notice, contribution status, and pull request guidance.

### Entry gate

- a private, independently initialized repository with a new Git history exists;
- the production system remains private and unchanged; and
- the authorized public facts and excluded categories are defined.

### Exit gate

- all foundation documents are complete and consistent in English and Spanish;
- public claims are supported and reviewed;
- repository independence and the absence of excluded material are validated; and
- the work was reviewed before inclusion in the approved default-branch history, without authorizing public release.

### Exclusions

- production code, history, data, configuration, or assets;
- architecture diagrams, workflow evidence, examples, fixtures, or synthetic datasets;
- screenshots, images, demos, deployments, or GitHub Pages; and
- a public release or external promotion.

## Phase 2 — Sanitized architecture and selected workflows

**Repository coverage:** Included, reviewed, accepted, and closed.

### Objective

Explain the platform at a high level and document a limited set of workflows without exposing production implementation or sensitive business detail.

### Content

- sanitized system context and high-level architecture;
- selected product and migration decisions; and
- selected workflow narratives within the approved public scope.

### Entry gate

- Phase 1 is approved;
- each candidate architecture element and workflow has a defined public purpose; and
- source material can be described without copying production code, configuration, data, or assets.

### Exit gate

- every item has passed individual review, sanitization, secret scanning, PII review, and independent publication approval;
- diagrams and narratives contain no production identifiers, private integrations, complete authorization rules, or business-sensitive logic; and
- English and Spanish documentation remain coherent.

### Exclusions

- detailed production topology;
- complete data models, authorization rules, or operational workflows;
- production environment identifiers and deployment configuration; and
- private integration or payment implementation details.

## Phase 3 — Synthetic data and independently reimplemented technical examples

**Repository coverage:** Included, reviewed, accepted, and closed.

### Objective

Add limited technical evidence that illustrates selected concepts without transferring production code or real data.

### Content

- purpose-built synthetic datasets;
- isolated technical examples independently reimplemented for this repository;
- documentation explaining what each example demonstrates; and
- an explicit statement of each example’s limits.

### Entry gate

- Phase 2 is approved;
- each candidate example maps to an approved public concept; and
- synthetic data can be created without preserving a mapping to real people, customers, transactions, shipments, or financial information.

### Exit gate

- examples are isolated from production and contain no copied production source or business-sensitive logic;
- datasets are confirmed synthetic;
- the complete candidate history passes secret and PII review; and
- each item receives independent publication approval.

### Exclusions

- production code, fixtures, logs, exports, or schemas;
- real or transformed customer, employee, shipment, payment, or financial data;
- production credentials, identifiers, integrations, prompts, or deployment configuration; and
- a production-equivalent application.

## Phase 4 — Versioned visual evidence

**Repository coverage:** Phase 4A Current Web Snapshot v1 is included, reviewed, accepted, and closed. The targeted Phase 4B attestation for this version is complete. Phase 4A2 and mobile evidence remain separate future work; Phase 4B remains a conditional gate for materially affected future public updates.

### Objective

Publish selected interface evidence only as dated, versioned snapshots with synthetic display data and explicit interpretation limits.

### Entry gate

- Phases 1, 2, and 3 are reviewed, accepted, and closed;
- the companion remained private throughout capture and review;
- the current visual source is identified and privately verified;
- the capture surface is isolated from production;
- every view can be populated exclusively with purpose-built synthetic data;
- the owner explicitly authorizes work on the snapshot to begin;
- the visual scope, the purpose of each planned image, and independent-review responsibility are defined before capture; and
- Telegram, mobile evidence, Phase 4A2, Phase 4B, and any other future surfaces remain outside Phase 4A.

### Phase 4A — Current Web Snapshot v1

- nine selected captures of the real web interface from August 2026;
- purpose-built synthetic display records and no production-data derivation;
- English and Spanish snapshot documentation, a safe public manifest, and versioned-snapshot decisions; and
- private source traceability and review records kept outside the versioned repository.

The accepted repository coverage records the snapshot material only; the three gate outcomes below were completed separately.

### Phase 4A2 — Separate future evidence review

Phase 4A2 remains a separate future review of an additional operational surface. It is optional for the initial public release, has not started, and is not included in Current Web Snapshot v1. It may be added later through its own scoped implementation, independent review, and approval gates. Its absence does not make the current technical case incomplete or false.

### Phase 4B — Targeted attestation and conditional visual refresh

The targeted attestation associated with this version reviewed the two conditional candidates, `06-customer-history-photos.png` and `09-partner-workspace.png`, and found no material post-baseline change; no selective refresh was required for this version.

Before any future public update, Phase 4B remains a conditional gate. Material changes to navigation, visual identity, principal composition, workflow, role scope, visible capability, primary action, presented data structure, user-context experience, or platform require a targeted assessment and, when necessary, reviewed selective replacement or a new snapshot.

### Future mobile evidence

Mobile evidence remains a separate future update with its own safe source, synthetic-data, privacy, and review gates. Mobile evidence is optional and is not required for the initial public release. It may be added later through its own scoped implementation, independent review, and approval gates. Its absence does not make the current web snapshot false or incomplete.

### Phase 4A accepted consecutive exit gates

Phase 4A was accepted only after the following gates were completed in sequence.

#### Gate A — Independent review

Independent review verified:

- provenance;
- isolation from production;
- exclusive use of purpose-built synthetic data;
- privacy;
- visual quality;
- manifests;
- English and Spanish documentation;
- defined scope; and
- the absence of sensitive information.

The independent reviewer recorded a technical verdict and any blocking findings. The favorable verdict advanced the snapshot to Gate B without replacing the owner's visual decision or performing acceptance.

#### Gate B — Owner visual approval

Rodrigo Opalo reviewed all nine captures and recorded `APPROVED`. That satisfied Gate B but did not by itself authorize acceptance of the snapshot version.

#### Gate C — Exact-version acceptance authorization

Only after Gate A passed and Gate B recorded `APPROVED` on the same HEAD could the repository owner issue separate authorization to accept that exact reviewed version. Any later change still requires review proportional to the change before a new exact-version authorization may be issued.

### Exclusions

- captures from production-authenticated or otherwise unsafe contexts;
- real, anonymized, transformed, sampled, or exported production data;
- unsupported performance, security, scale, availability, or business claims; and
- Phase 4A2, Phase 4B refresh assets, or mobile images in Current Web Snapshot v1.

## Phase 5 — Independent security and publication audit

**Repository coverage:** Audit findings and bounded remediation requirements are reflected in this tree. Independent exact-version review remains a release control for every candidate rather than a durable content-status claim.

### Objective

Determine whether the complete companion repository is suitable for public release under the documented scope, remediate the bounded findings, and independently revalidate the exact candidate.

### Content

- full-tree and full-history secret review;
- PII and sensitive-business-data review;
- claim, link, licensing, and documentation review;
- Git and repository-independence verification; and
- a publication decision with blocking and non-blocking findings clearly separated.

### Entry gate

- the candidate public content is complete and frozen for audit;
- all prior per-item review records are available; and
- licensing and contribution decisions are ready for evaluation.

### Remediation exit gate

For any release candidate, the release gate is satisfied only when that exact version meets all of the following:

- every blocking finding is resolved or the release is stopped;
- the final repository state is independently revalidated;
- an explicit publication approval is recorded; and
- the approved commit is identified for release without adding unreviewed changes.

### Exclusions

- changes to the production system;
- disclosure of security findings or current or historical vulnerabilities;
- treating a documentation review as proof of production security; and
- changing repository visibility during the audit itself.

## Phase 6 — Public release

**Repository coverage:** External release operation; not repository content. Completion requires separate authorization and is not asserted by the versioned tree.

### Objective

Publish only the commit approved by the independent security and publication audit.

### Content

- the approved documentation, architecture, workflows, examples, synthetic data, and visuals;
- the final licensing and contribution boundaries; and
- public repository metadata consistent with the case-study scope.

### Entry gate

- Phase 5 concludes with explicit approval;
- the approved commit remains unchanged;
- licensing, notice, contribution, and security-reporting decisions are complete; and
- the publication owner authorizes the visibility change.

### Exit gate

- the repository is publicly accessible at the approved commit;
- public metadata and documentation links are verified;
- no unreviewed branch, artifact, release, package, or deployment is exposed; and
- a post-publication scope and safety check passes.

### Exclusions

- production source, history, data, integrations, logic, or configuration;
- automatic publication of work that was not part of the approved commit;
- a production-equivalent deployment; and
- LinkedIn or portfolio changes in the same phase.

## Phase 7 — LinkedIn and portfolio integration in one coordinated update

**Repository coverage:** Optional external coordination; not repository content. Completion requires separate authorization and is not asserted by the versioned tree.

### Objective

Connect the approved public companion to the existing case presentation through one consistent update across LinkedIn and the portfolio.

### Content

- concise links to the public technical companion;
- aligned wording about Rodrigo’s operations, product, and development role;
- a clear distinction between the public companion and the private production system; and
- a coordinated verification of the updated destinations.

### Entry gate

- Phase 6 is complete;
- the public repository URL and documentation structure are stable;
- the LinkedIn and portfolio wording has been reviewed against the approved public claims; and
- both updates are ready to publish as one coordinated change.

### Exit gate

- LinkedIn and the portfolio point to the intended public companion;
- the descriptions are accurate, consistent, and free of unsupported claims; and
- all links and public presentation paths are verified after the update.

### Exclusions

- promotion before the repository passes publication review;
- links to the private production system;
- unsupported metrics, results, or claims; and
- unrelated profile, website, deployment, or product changes.
