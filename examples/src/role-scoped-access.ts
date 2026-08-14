/**
 * Public synthetic reference example for the LEM-BOX technical case study.
 * Independently implemented from the approved public architecture and workflows.
 * This is not production source code, production authorization logic, or a complete business implementation.
 * See ../../docs/licensing.md before assuming any reuse permission.
 */

import { PUBLIC_EXAMPLE_NOTICE } from "./shared/public-example-notice.js";
import {
  isSyntheticAction,
  isSyntheticActor,
  isSyntheticResource,
} from "./shared/types.js";
import type {
  SyntheticAction,
  SyntheticActor,
  SyntheticResource,
} from "./shared/types.js";

export const ROLE_SCOPED_ACCESS_PUBLIC_NOTICE = PUBLIC_EXAMPLE_NOTICE;

export interface RoleScopedAccessInput {
  readonly actor: unknown;
  readonly resource: unknown;
  readonly action: unknown;
  readonly actorScope?: unknown;
  readonly resourceScope?: unknown;
}

export type RoleScopedAccessDenialReason =
  | "unknown_actor"
  | "unknown_resource"
  | "unknown_action"
  | "scope_required"
  | "scope_mismatch"
  | "not_explicitly_allowed";

export type RoleScopedAccessDecision =
  | {
      readonly allowed: true;
      readonly reasonCode: "access_allowed";
      readonly publicExplanation: string;
    }
  | {
      readonly allowed: false;
      readonly reasonCode: RoleScopedAccessDenialReason;
      readonly publicExplanation: string;
    };

interface SyntheticAccessRule {
  readonly actor: SyntheticActor;
  readonly resource: SyntheticResource;
  readonly action: SyntheticAction;
}

const EXPLICIT_SYNTHETIC_RULES: readonly SyntheticAccessRule[] = [
  {
    actor: "customer",
    resource: "shipment_summary",
    action: "read",
  },
  {
    actor: "operations_staff",
    resource: "shipment_summary",
    action: "read",
  },
  {
    actor: "operations_staff",
    resource: "operational_record",
    action: "read",
  },
  {
    actor: "operations_staff",
    resource: "operational_record",
    action: "update",
  },
  {
    actor: "operations_staff",
    resource: "operational_record",
    action: "transition",
  },
  {
    actor: "business_administrator",
    resource: "customer_account",
    action: "read",
  },
  {
    actor: "business_administrator",
    resource: "customer_account",
    action: "update",
  },
  {
    actor: "business_administrator",
    resource: "operational_record",
    action: "read",
  },
  {
    actor: "business_administrator",
    resource: "financial_status_reference",
    action: "read",
  },
  {
    actor: "authorized_internal_user",
    resource: "operational_record",
    action: "read",
  },
  {
    actor: "authorized_internal_user",
    resource: "financial_status_reference",
    action: "read",
  },
];

const DENIAL_EXPLANATIONS: Readonly<
  Record<RoleScopedAccessDenialReason, string>
> = {
  unknown_actor: "The synthetic actor is not recognized.",
  unknown_resource: "The synthetic resource is not recognized.",
  unknown_action: "The synthetic action is not recognized.",
  scope_required: "Both synthetic scopes are required.",
  scope_mismatch: "The synthetic scopes do not match.",
  not_explicitly_allowed: "No public synthetic rule allows this request.",
};

function denyAccess(
  reasonCode: RoleScopedAccessDenialReason,
): RoleScopedAccessDecision {
  return {
    allowed: false,
    reasonCode,
    publicExplanation: DENIAL_EXPLANATIONS[reasonCode],
  };
}

function isCompleteSyntheticScope(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^demo-[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)
  );
}

function matchesExplicitRule(
  actor: SyntheticActor,
  resource: SyntheticResource,
  action: SyntheticAction,
): boolean {
  return EXPLICIT_SYNTHETIC_RULES.some(
    (rule) =>
      rule.actor === actor &&
      rule.resource === resource &&
      rule.action === action,
  );
}

/**
 * Makes a deterministic, fail-closed decision using only the synthetic public
 * vocabulary. A recognized actor name never creates a general-access path.
 */
export function decideRoleScopedAccess(
  input: RoleScopedAccessInput,
): RoleScopedAccessDecision {
  if (!isSyntheticActor(input.actor)) {
    return denyAccess("unknown_actor");
  }

  if (!isSyntheticResource(input.resource)) {
    return denyAccess("unknown_resource");
  }

  if (!isSyntheticAction(input.action)) {
    return denyAccess("unknown_action");
  }

  if (
    !isCompleteSyntheticScope(input.actorScope) ||
    !isCompleteSyntheticScope(input.resourceScope)
  ) {
    return denyAccess("scope_required");
  }

  if (input.actorScope !== input.resourceScope) {
    return denyAccess("scope_mismatch");
  }

  if (!matchesExplicitRule(input.actor, input.resource, input.action)) {
    return denyAccess("not_explicitly_allowed");
  }

  return {
    allowed: true,
    reasonCode: "access_allowed",
    publicExplanation:
      "An explicit public synthetic rule allows this same-scope request.",
  };
}
