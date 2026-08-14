/**
 * Public synthetic reference example for the LEM-BOX technical case study.
 * Independently implemented from the approved public architecture and workflows.
 * This is not production source code, production authorization logic, or a complete business implementation.
 * See ../../docs/licensing.md before assuming any reuse permission.
 */

import { PUBLIC_EXAMPLE_NOTICE } from "./shared/public-example-notice.js";
import {
  isSyntheticShipmentState,
  type SyntheticShipmentState,
} from "./shared/types.js";

export const SHIPMENT_LIFECYCLE_PUBLIC_NOTICE = PUBLIC_EXAMPLE_NOTICE;

export interface ShipmentStateHistoryEntry {
  readonly state: SyntheticShipmentState;
  readonly timestamp: string;
}

export interface SyntheticShipmentLifecycleRecord {
  readonly id: string;
  readonly state: SyntheticShipmentState;
  readonly history: readonly ShipmentStateHistoryEntry[];
}

export type ShipmentTransitionRejectionReason =
  | "unknown_state"
  | "transition_not_allowed"
  | "timestamp_required"
  | "invalid_timestamp";

export type ShipmentTransitionResult =
  | {
      readonly ok: true;
      readonly reasonCode: "transition_applied";
      readonly shipment: SyntheticShipmentLifecycleRecord;
    }
  | {
      readonly ok: false;
      readonly reasonCode: ShipmentTransitionRejectionReason;
      readonly shipment: SyntheticShipmentLifecycleRecord;
    };

const ALLOWED_TRANSITIONS: Readonly<
  Record<SyntheticShipmentState, readonly SyntheticShipmentState[]>
> = {
  intake: ["verified", "exception"],
  verified: ["prepared", "exception"],
  prepared: ["in_transit", "exception"],
  in_transit: ["available", "exception"],
  available: ["completed", "exception"],
  completed: [],
  exception: [],
};

const UTC_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{3})?Z$/;

function isValidLifecycleTimestamp(timestamp: unknown): timestamp is string {
  if (typeof timestamp !== "string" || !UTC_TIMESTAMP_PATTERN.test(timestamp)) {
    return false;
  }

  const timestampEpoch = Date.parse(timestamp);
  if (!Number.isFinite(timestampEpoch)) {
    return false;
  }

  const canonicalTimestamp = new Date(timestampEpoch).toISOString();
  const canonicalTimestampWithoutMilliseconds = canonicalTimestamp.replace(
    ".000Z",
    "Z",
  );

  return (
    timestamp === canonicalTimestamp ||
    timestamp === canonicalTimestampWithoutMilliseconds
  );
}

/**
 * Checks a deliberately small public transition model. Both `completed` and
 * `exception` are terminal in this synthetic example.
 */
export function isShipmentTransitionAllowed(
  currentState: unknown,
  requestedState: unknown,
): boolean {
  if (
    !isSyntheticShipmentState(currentState) ||
    !isSyntheticShipmentState(requestedState)
  ) {
    return false;
  }

  return ALLOWED_TRANSITIONS[currentState].some(
    (allowedState) => allowedState === requestedState,
  );
}

/**
 * Returns a new lifecycle record when the transition is accepted. Rejections
 * return the untouched input record so callers can handle both outcomes without
 * exceptions or side effects.
 */
export function applyShipmentTransition(
  shipment: SyntheticShipmentLifecycleRecord,
  requestedState: unknown,
  timestamp: unknown,
): ShipmentTransitionResult {
  if (
    !isSyntheticShipmentState(shipment.state) ||
    !isSyntheticShipmentState(requestedState)
  ) {
    return {
      ok: false,
      reasonCode: "unknown_state",
      shipment,
    };
  }

  if (typeof timestamp === "string" && timestamp.trim().length === 0) {
    return {
      ok: false,
      reasonCode: "timestamp_required",
      shipment,
    };
  }

  if (!isValidLifecycleTimestamp(timestamp)) {
    return {
      ok: false,
      reasonCode: "invalid_timestamp",
      shipment,
    };
  }

  if (!isShipmentTransitionAllowed(shipment.state, requestedState)) {
    return {
      ok: false,
      reasonCode: "transition_not_allowed",
      shipment,
    };
  }

  return {
    ok: true,
    reasonCode: "transition_applied",
    shipment: {
      ...shipment,
      state: requestedState,
      history: [...shipment.history, { state: requestedState, timestamp }],
    },
  };
}
