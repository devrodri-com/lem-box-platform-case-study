/**
 * Public synthetic reference example for the LEM-BOX technical case study.
 * Independently implemented from the approved public architecture and workflows.
 * This is not production source code, production authorization logic, or a complete business implementation.
 * See ../../docs/licensing.md before assuming any reuse permission.
 */

import {
  isSyntheticActor,
  isSyntheticQueryCategory,
  type SyntheticQueryCategory,
} from "./shared/types.js";
import { PUBLIC_EXAMPLE_NOTICE } from "./shared/public-example-notice.js";

export const SCOPED_INTERNAL_QUERY_PUBLIC_NOTICE = PUBLIC_EXAMPLE_NOTICE;

export const SCOPED_INTERNAL_QUERY_BOUNDARY_NOTICE =
  "The example demonstrates a scoped query boundary. It is not an assistant implementation and does not describe the production assistant, its provider, prompts, or data-access controls.";

export const PUBLIC_QUERY_FIELDS_BY_CATEGORY = Object.freeze({
  operational_summary: Object.freeze([
    "recordCount",
    "currentStage",
    "lastUpdatedAt",
  ] as const),
  shipment_status: Object.freeze([
    "publicState",
    "lastEventAt",
    "nextPublicStep",
  ] as const),
  financial_status_reference: Object.freeze([
    "referenceStatus",
    "referenceDate",
  ] as const),
} as const satisfies Readonly<
  Record<SyntheticQueryCategory, readonly string[]>
>);

export type PublicQueryField =
  (typeof PUBLIC_QUERY_FIELDS_BY_CATEGORY)[SyntheticQueryCategory][number];

export interface ScopedInternalQueryRequest {
  readonly actor: unknown;
  readonly category: unknown;
  readonly scope?: unknown;
  readonly requestedFields: unknown;
}

export interface AbstractPublicQueryPlan {
  readonly kind: "scoped_public_projection";
  readonly category: SyntheticQueryCategory;
  readonly scopeBoundary: "validated_synthetic_scope";
  readonly fields: readonly PublicQueryField[];
}

export type ScopedInternalQueryReasonCode =
  | "allowed"
  | "allowed_with_field_filter"
  | "actor_not_authorized"
  | "unknown_category"
  | "missing_scope"
  | "invalid_fields"
  | "no_allowed_fields";

export interface ScopedInternalQueryDecision {
  readonly allowed: boolean;
  readonly allowedFields: readonly PublicQueryField[];
  readonly deniedFields: readonly string[];
  readonly reasonCode: ScopedInternalQueryReasonCode;
  readonly queryPlan: AbstractPublicQueryPlan | null;
}

function compareText(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function uniqueSortedFields(fields: readonly string[]): readonly string[] {
  return [...new Set(fields)].sort(compareText);
}

function isStringArray(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.every((field: unknown) => typeof field === "string")
  );
}

function isSyntheticScope(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^demo-[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)
  );
}

function deniedDecision(
  requestedFields: readonly string[],
  reasonCode: Exclude<
    ScopedInternalQueryReasonCode,
    "allowed" | "allowed_with_field_filter"
  >,
): ScopedInternalQueryDecision {
  return {
    allowed: false,
    allowedFields: [],
    deniedFields: uniqueSortedFields(requestedFields),
    reasonCode,
    queryPlan: null,
  };
}

export function evaluateScopedInternalQuery(
  request: ScopedInternalQueryRequest,
): ScopedInternalQueryDecision {
  if (!isStringArray(request.requestedFields)) {
    return deniedDecision([], "invalid_fields");
  }

  if (
    !isSyntheticActor(request.actor) ||
    request.actor !== "authorized_internal_user"
  ) {
    return deniedDecision(request.requestedFields, "actor_not_authorized");
  }

  if (!isSyntheticQueryCategory(request.category)) {
    return deniedDecision(request.requestedFields, "unknown_category");
  }

  if (!isSyntheticScope(request.scope)) {
    return deniedDecision(request.requestedFields, "missing_scope");
  }

  const requestedFieldSet = new Set(request.requestedFields);
  const categoryFields: readonly PublicQueryField[] =
    PUBLIC_QUERY_FIELDS_BY_CATEGORY[request.category];
  const allowedFields = categoryFields.filter((field) =>
    requestedFieldSet.has(field),
  );
  const allowedFieldSet = new Set<string>(allowedFields);
  const deniedFields = uniqueSortedFields(request.requestedFields).filter(
    (field) => !allowedFieldSet.has(field),
  );

  if (allowedFields.length === 0) {
    return deniedDecision(request.requestedFields, "no_allowed_fields");
  }

  return {
    allowed: true,
    allowedFields: [...allowedFields],
    deniedFields,
    reasonCode:
      deniedFields.length === 0 ? "allowed" : "allowed_with_field_filter",
    queryPlan: {
      kind: "scoped_public_projection",
      category: request.category,
      scopeBoundary: "validated_synthetic_scope",
      fields: [...allowedFields],
    },
  };
}
