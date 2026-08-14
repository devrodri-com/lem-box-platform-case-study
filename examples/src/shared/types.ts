/**
 * Public synthetic reference example for the LEM-BOX technical case study.
 * Independently implemented from the approved public architecture and workflows.
 * This is not production source code, production authorization logic, or a complete business implementation.
 * See ../../../docs/licensing.md before assuming any reuse permission.
 */

export const SYNTHETIC_ACTORS = Object.freeze([
  "customer",
  "operations_staff",
  "business_administrator",
  "authorized_internal_user",
] as const);

export const SYNTHETIC_RESOURCES = Object.freeze([
  "shipment_summary",
  "operational_record",
  "customer_account",
  "financial_status_reference",
] as const);

export const SYNTHETIC_ACTIONS = Object.freeze([
  "read",
  "update",
  "transition",
] as const);

export const SYNTHETIC_SHIPMENT_STATES = Object.freeze([
  "intake",
  "verified",
  "prepared",
  "in_transit",
  "available",
  "completed",
  "exception",
] as const);

export const SYNTHETIC_TRACKING_EVENT_TYPES = Object.freeze([
  "received",
  "moving",
  "arrived",
  "completed",
  "exception",
] as const);

export const SYNTHETIC_QUERY_CATEGORIES = Object.freeze([
  "operational_summary",
  "shipment_status",
  "financial_status_reference",
] as const);

export type SyntheticActor = (typeof SYNTHETIC_ACTORS)[number];
export type SyntheticResource = (typeof SYNTHETIC_RESOURCES)[number];
export type SyntheticAction = (typeof SYNTHETIC_ACTIONS)[number];
export type SyntheticShipmentState = (typeof SYNTHETIC_SHIPMENT_STATES)[number];
export type SyntheticTrackingEventType =
  (typeof SYNTHETIC_TRACKING_EVENT_TYPES)[number];
export type SyntheticQueryCategory =
  (typeof SYNTHETIC_QUERY_CATEGORIES)[number];

export function isSyntheticActor(value: unknown): value is SyntheticActor {
  return (
    typeof value === "string" &&
    SYNTHETIC_ACTORS.some((candidate) => candidate === value)
  );
}

export function isSyntheticResource(
  value: unknown,
): value is SyntheticResource {
  return (
    typeof value === "string" &&
    SYNTHETIC_RESOURCES.some((candidate) => candidate === value)
  );
}

export function isSyntheticAction(value: unknown): value is SyntheticAction {
  return (
    typeof value === "string" &&
    SYNTHETIC_ACTIONS.some((candidate) => candidate === value)
  );
}

export function isSyntheticShipmentState(
  value: unknown,
): value is SyntheticShipmentState {
  return (
    typeof value === "string" &&
    SYNTHETIC_SHIPMENT_STATES.some((candidate) => candidate === value)
  );
}

export function isSyntheticTrackingEventType(
  value: unknown,
): value is SyntheticTrackingEventType {
  return (
    typeof value === "string" &&
    SYNTHETIC_TRACKING_EVENT_TYPES.some((candidate) => candidate === value)
  );
}

export function isSyntheticQueryCategory(
  value: unknown,
): value is SyntheticQueryCategory {
  return (
    typeof value === "string" &&
    SYNTHETIC_QUERY_CATEGORIES.some((candidate) => candidate === value)
  );
}
