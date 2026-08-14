# LEM-BOX Platform — Case Study

[Spanish version](case-study.es.md)

## 1. Context

LEM-BOX is a real logistics business operating between the United States, Uruguay, and Argentina. Rodrigo Opalo founded the business, is responsible for its operation, and defined and developed the digital ecosystem that supports it.

This case study documents the relationship between a real logistics operation, the product decisions derived from it, and the software platform built to support those decisions. It is intentionally presented at a level suitable for public review and does not reproduce the production system.

## 2. Operational problem

A logistics operation needs a consistent way to work with connected information and responsibilities. In the LEM-BOX platform, that scope includes:

- shipments;
- customers;
- payments;
- roles; and
- traceability.

These areas are part of one operating context rather than isolated software features. The product challenge is to centralize them while continuing to support the day-to-day business.

## 3. Why a simple rewrite was not enough

The new platform progressively replaces a legacy system. That makes the work a transition within an active operation, not only the construction of a separate replacement.

The migration prioritizes operational continuity, security, and the ability to evolve in controlled steps. A single replacement event would not express those constraints or the product decisions required to manage them. The relevant case is therefore the progressive movement of responsibilities and workflows while the operation continues.

## 4. Progressive migration approach

The migration is organized around controlled evolution rather than an immediate substitution of the entire legacy system. At a public level, the approach can be described through three priorities:

1. preserve continuity for the operating business;
2. treat security as part of the migration decision; and
3. allow the platform to evolve as responsibilities move progressively.

This companion does not disclose migration internals, production configuration, or complete business logic. The [sanitized public architecture](architecture.md) presents the migration only as a conceptual, progressive model, and the [selected public workflows](selected-workflows.md) use generalized actors and states.

## 5. Platform scope

The central platform brings together shipments, customers, payments, roles, and traceability. That scope reflects the relationship between the logistics operation and the digital product supporting it.

The public case describes selected parts of this scope rather than attempting to recreate the complete platform. The repository includes the Phase 2 [sanitized high-level architecture](architecture.md) and [selected simplified workflows](selected-workflows.md), each with explicit public limitations, and the Phase 3 [independently reimplemented technical examples](technical-examples.md) backed only by [purpose-built synthetic data](synthetic-data.md).

## 6. Product and operational responsibilities

Rodrigo’s role combines:

- **operation**, including direct understanding of the business context;
- **product**, including the definition of platform scope and priorities; and
- **development**, including the definition and construction of the supporting digital ecosystem.

This combined role is relevant because product decisions are connected to operational needs. The public case presents that connection without overstating results or disclosing private operational detail.

## 7. Integrations and internal tools

The digital ecosystem includes integrations and automations. It also includes internal assistants connected to authorized operational and financial data.

Those capabilities are mentioned only to define the broader product context. Private integrations, internal prompts, assistant implementation, financial data, and complete workflows are outside the public scope.

## 8. Security and continuity considerations

Security and operational continuity are explicit priorities in the progressive migration. This public companion does not describe current or historical vulnerabilities, detailed authorization controls, production identifiers, or deployment configuration.

Publication safety is also part of the companion’s process. Any future architecture, workflow, visual, dataset, or example must undergo individual review, sanitization, secret scanning, PII review, and independent publication approval before it can be added.

## 9. What this case demonstrates

Within its verified scope, this case demonstrates:

- how knowledge of a real operation informs product scope;
- how operations, product, and development can be connected in one role;
- why replacement of a legacy system can require a progressive migration; and
- how continuity, security, and continued evolution shape that migration.

It does not claim specific commercial, operational, or performance outcomes. No metrics are presented in this public foundation.

## 10. Current limitations of the public case study

Repository coverage includes the Phase 1 documentation foundation, Phase 2 sanitized architecture and workflow descriptions, Phase 3 synthetic data and isolated technical examples, and the accepted Phase 4A dated web snapshot. Selected real web-interface views populated only with purpose-built synthetic data are available in [Current Web Snapshot v1](current-web-snapshot.md); they remain dated evidence and are not a final-interface claim.

The public case is deliberately incomplete relative to the production platform. Production source code, Git history, data, integrations, complete business logic, and configuration remain private and will not be transferred to this repository. Future material will be selected independently rather than copied from production.
