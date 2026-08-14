import { describe, expect, it } from "vitest";

import { decideRoleScopedAccess } from "../src/role-scoped-access.js";
import type { RoleScopedAccessDecision } from "../src/role-scoped-access.js";

const OWN_SCOPE = "demo-scope-a";
const FOREIGN_SCOPE = "demo-scope-b";

describe("role-scoped access", () => {
  it("denies by default when no explicit synthetic rule matches", () => {
    const decision = decideRoleScopedAccess({
      actor: "customer",
      resource: "customer_account",
      action: "read",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });

    expect(decision).toEqual({
      allowed: false,
      reasonCode: "not_explicitly_allowed",
      publicExplanation: "No public synthetic rule allows this request.",
    });
  });

  it("allows a customer to read a shipment summary in the same synthetic scope", () => {
    const decision = decideRoleScopedAccess({
      actor: "customer",
      resource: "shipment_summary",
      action: "read",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });

    expect(decision.allowed).toBe(true);
    expect(decision.reasonCode).toBe("access_allowed");
  });

  it("denies a customer request for a different synthetic scope", () => {
    const decision = decideRoleScopedAccess({
      actor: "customer",
      resource: "shipment_summary",
      action: "read",
      actorScope: OWN_SCOPE,
      resourceScope: FOREIGN_SCOPE,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("scope_mismatch");
  });

  it("denies access when either scope is missing", () => {
    const withoutActorScope = decideRoleScopedAccess({
      actor: "operations_staff",
      resource: "operational_record",
      action: "read",
      resourceScope: OWN_SCOPE,
    });
    const withoutResourceScope = decideRoleScopedAccess({
      actor: "operations_staff",
      resource: "operational_record",
      action: "read",
      actorScope: OWN_SCOPE,
    });

    expect(withoutActorScope.reasonCode).toBe("scope_required");
    expect(withoutResourceScope.reasonCode).toBe("scope_required");
    expect(withoutActorScope.allowed).toBe(false);
    expect(withoutResourceScope.allowed).toBe(false);
  });

  it("denies a scope outside the public demo namespace", () => {
    const decision = decideRoleScopedAccess({
      actor: "customer",
      resource: "shipment_summary",
      action: "read",
      actorScope: "scope-a",
      resourceScope: "scope-a",
    });

    expect(decision).toMatchObject({
      allowed: false,
      reasonCode: "scope_required",
    });
  });

  it("denies an unknown actor", () => {
    const decision = decideRoleScopedAccess({
      actor: "demo_unknown_actor",
      resource: "shipment_summary",
      action: "read",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("unknown_actor");
  });

  it("denies an unknown resource", () => {
    const decision = decideRoleScopedAccess({
      actor: "customer",
      resource: "demo_unknown_resource",
      action: "read",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("unknown_resource");
  });

  it("denies an unknown action", () => {
    const decision = decideRoleScopedAccess({
      actor: "operations_staff",
      resource: "operational_record",
      action: "demo_unknown_action",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("unknown_action");
  });

  it("denies update when it is not expressly permitted", () => {
    const decision = decideRoleScopedAccess({
      actor: "customer",
      resource: "shipment_summary",
      action: "update",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("not_explicitly_allowed");
  });

  it("limits a financial status reference to an explicit scoped read decision", () => {
    const readDecision = decideRoleScopedAccess({
      actor: "authorized_internal_user",
      resource: "financial_status_reference",
      action: "read",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });
    const updateDecision = decideRoleScopedAccess({
      actor: "authorized_internal_user",
      resource: "financial_status_reference",
      action: "update",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });

    expect(readDecision.allowed).toBe(true);
    expect(updateDecision.allowed).toBe(false);
    expect(Object.keys(readDecision).sort()).toEqual([
      "allowed",
      "publicExplanation",
      "reasonCode",
    ]);
  });

  it("does not grant general access from the authorized internal actor name", () => {
    const decision = decideRoleScopedAccess({
      actor: "authorized_internal_user",
      resource: "customer_account",
      action: "read",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("not_explicitly_allowed");
  });

  it("returns the same stable, typed decision for the same input", () => {
    const input = {
      actor: "business_administrator",
      resource: "financial_status_reference",
      action: "read",
      actorScope: OWN_SCOPE,
      resourceScope: OWN_SCOPE,
    };
    const first: RoleScopedAccessDecision = decideRoleScopedAccess(input);
    const second: RoleScopedAccessDecision = decideRoleScopedAccess(input);

    expect(first).toEqual(second);
    expect(first).toEqual({
      allowed: true,
      reasonCode: "access_allowed",
      publicExplanation:
        "An explicit public synthetic rule allows this same-scope request.",
    });
  });
});
