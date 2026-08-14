import { describe, expect, expectTypeOf, it } from "vitest";

import {
  PUBLIC_QUERY_FIELDS_BY_CATEGORY,
  SCOPED_INTERNAL_QUERY_BOUNDARY_NOTICE,
  evaluateScopedInternalQuery,
  type ScopedInternalQueryDecision,
} from "../src/scoped-internal-query.js";

const BASE_REQUEST = {
  actor: "authorized_internal_user",
  category: "operational_summary",
  scope: "demo-scope-a",
  requestedFields: ["recordCount"],
} as const;

describe("evaluateScopedInternalQuery", () => {
  it("allows an authorized category and field within a synthetic scope", () => {
    const result = evaluateScopedInternalQuery(BASE_REQUEST);

    expect(result).toEqual({
      allowed: true,
      allowedFields: ["recordCount"],
      deniedFields: [],
      reasonCode: "allowed",
      queryPlan: {
        kind: "scoped_public_projection",
        category: "operational_summary",
        scopeBoundary: "validated_synthetic_scope",
        fields: ["recordCount"],
      },
    });
  });

  it("uses the exact public field sets for every category", () => {
    expect(PUBLIC_QUERY_FIELDS_BY_CATEGORY).toEqual({
      operational_summary: [
        "recordCount",
        "currentStage",
        "lastUpdatedAt",
      ],
      shipment_status: ["publicState", "lastEventAt", "nextPublicStep"],
      financial_status_reference: ["referenceStatus", "referenceDate"],
    });
  });

  it("removes prohibited fields and retains only category-allowed fields", () => {
    const result = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      requestedFields: [
        "internal note",
        "recordCount",
        "amount",
        "recordCount",
      ],
    });

    expect(result.allowed).toBe(true);
    expect(result.allowedFields).toEqual(["recordCount"]);
    expect(result.deniedFields).toEqual(["amount", "internal note"]);
    expect(result.reasonCode).toBe("allowed_with_field_filter");
    expect(result.queryPlan?.fields).toEqual(["recordCount"]);
  });

  it("rejects an unknown category", () => {
    const result = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      category: "unknown_demo_category",
    });

    expect(result).toEqual({
      allowed: false,
      allowedFields: [],
      deniedFields: ["recordCount"],
      reasonCode: "unknown_category",
      queryPlan: null,
    });
  });

  it("rejects a missing or blank scope", () => {
    const missingScope = evaluateScopedInternalQuery({
      actor: BASE_REQUEST.actor,
      category: BASE_REQUEST.category,
      requestedFields: BASE_REQUEST.requestedFields,
    });
    const blankScope = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      scope: "   ",
    });

    expect(missingScope.reasonCode).toBe("missing_scope");
    expect(missingScope.allowedFields).toEqual([]);
    expect(missingScope.queryPlan).toBeNull();
    expect(blankScope.reasonCode).toBe("missing_scope");
  });

  it("rejects a non-synthetic scope", () => {
    const result = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      scope: "scope-without-demo-prefix",
    });

    expect(result.allowed).toBe(false);
    expect(result.reasonCode).toBe("missing_scope");
    expect(result.queryPlan).toBeNull();
  });

  it("rejects every actor except the synthetic authorized internal actor", () => {
    for (const actor of [
      "customer",
      "operations_staff",
      "business_administrator",
      "unknown_demo_actor",
    ]) {
      const result = evaluateScopedInternalQuery({ ...BASE_REQUEST, actor });

      expect(result.allowed).toBe(false);
      expect(result.reasonCode).toBe("actor_not_authorized");
      expect(result.queryPlan).toBeNull();
    }
  });

  it("never exposes financial amounts or other financial details", () => {
    const result = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      category: "financial_status_reference",
      requestedFields: [
        "referenceStatus",
        "amount",
        "currency",
        "balance",
        "bank",
      ],
    });

    expect(result.allowedFields).toEqual(["referenceStatus"]);
    expect(result.deniedFields).toEqual([
      "amount",
      "balance",
      "bank",
      "currency",
    ]);
    expect(result.queryPlan?.fields).toEqual(["referenceStatus"]);
  });

  it("produces only an abstract plan and never repeats the caller scope", () => {
    const syntheticScope = "demo-scope-value-that-must-not-be-repeated";
    const result = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      scope: syntheticScope,
      requestedFields: ["lastUpdatedAt", "recordCount"],
    });
    const serializedPlan = JSON.stringify(result.queryPlan);

    expect(serializedPlan).not.toContain(syntheticScope);
    expect(serializedPlan).not.toMatch(
      /\b(?:SELECT|FROM|table|collection|endpoint|provider|prompt|credential)\b/i,
    );
    expect(result.queryPlan).toEqual({
      kind: "scoped_public_projection",
      category: "operational_summary",
      scopeBoundary: "validated_synthetic_scope",
      fields: ["recordCount", "lastUpdatedAt"],
    });
  });

  it("fails closed when no requested field is allowed", () => {
    const result = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      requestedFields: ["amount", "currency"],
    });

    expect(result).toEqual({
      allowed: false,
      allowedFields: [],
      deniedFields: ["amount", "currency"],
      reasonCode: "no_allowed_fields",
      queryPlan: null,
    });
  });

  it("fails closed when the requested field list is malformed", () => {
    const result = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      requestedFields: ["recordCount", 7],
    });

    expect(result).toEqual({
      allowed: false,
      allowedFields: [],
      deniedFields: [],
      reasonCode: "invalid_fields",
      queryPlan: null,
    });
  });

  it("returns deterministic, canonically ordered output", () => {
    const forward = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      requestedFields: ["lastUpdatedAt", "recordCount", "amount"],
    });
    const reverse = evaluateScopedInternalQuery({
      ...BASE_REQUEST,
      requestedFields: ["amount", "recordCount", "lastUpdatedAt"],
    });

    expect(forward).toEqual(reverse);
    expectTypeOf(forward).toEqualTypeOf<ScopedInternalQueryDecision>();
  });

  it("states the mandatory public boundary clarification", () => {
    expect(SCOPED_INTERNAL_QUERY_BOUNDARY_NOTICE).toBe(
      "The example demonstrates a scoped query boundary. It is not an assistant implementation and does not describe the production assistant, its provider, prompts, or data-access controls.",
    );
  });
});
