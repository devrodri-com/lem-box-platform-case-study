import { describe, expect, it } from "vitest";

import {
  applyShipmentTransition,
  isShipmentTransitionAllowed,
} from "../src/shipment-lifecycle.js";
import type {
  ShipmentTransitionRejectionReason,
  ShipmentTransitionResult,
  SyntheticShipmentLifecycleRecord,
} from "../src/shipment-lifecycle.js";

const INITIAL_TIMESTAMP = "2030-01-02T09:00:00Z";
const TRANSITION_TIMESTAMP = "2030-01-02T10:00:00Z";
const MILLISECOND_TIMESTAMP = "2030-01-02T10:00:00.123Z";

interface RuntimeValueCase {
  readonly label: string;
  readonly value: unknown;
}

interface InvalidTimestampCase extends RuntimeValueCase {
  readonly reasonCode: ShipmentTransitionRejectionReason;
}

const INVALID_RUNTIME_STATES: readonly RuntimeValueCase[] = [
  { label: "unknown text", value: "queued" },
  { label: "empty text", value: "" },
  { label: "whitespace text", value: " \t " },
  { label: "a non-string value", value: 42 },
];

const INVALID_TIMESTAMPS: readonly InvalidTimestampCase[] = [
  {
    label: "an empty timestamp",
    value: "",
    reasonCode: "timestamp_required",
  },
  {
    label: "a whitespace timestamp",
    value: " \t ",
    reasonCode: "timestamp_required",
  },
  {
    label: "month zero",
    value: "2030-00-02T10:00:00Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "month thirteen",
    value: "2030-13-02T10:00:00Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "day zero",
    value: "2030-01-00T10:00:00Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "an impossible February date",
    value: "2030-02-30T10:00:00Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "hour twenty-four",
    value: "2030-01-02T24:00:00Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "minute sixty",
    value: "2030-01-02T10:60:00Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "second sixty",
    value: "2030-01-02T10:00:60Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "a timestamp without Z",
    value: "2030-01-02T10:00:00",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "a timestamp with a UTC offset",
    value: "2030-01-02T10:00:00+00:00",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "partially parseable text",
    value: "2030-01-02T10:00:00Z trailing",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "a one-digit fractional second",
    value: "2030-01-02T10:00:00.1Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "a four-digit fractional second",
    value: "2030-01-02T10:00:00.1234Z",
    reasonCode: "invalid_timestamp",
  },
  {
    label: "a runtime number",
    value: 1_893_585_600_000,
    reasonCode: "invalid_timestamp",
  },
  {
    label: "a runtime null",
    value: null,
    reasonCode: "invalid_timestamp",
  },
];

function createShipment(): SyntheticShipmentLifecycleRecord {
  return {
    id: "demo-shipment-a",
    state: "intake",
    history: [{ state: "intake", timestamp: INITIAL_TIMESTAMP }],
  };
}

function createShipmentWithRuntimeState(
  state: unknown,
): SyntheticShipmentLifecycleRecord {
  const shipment = createShipment();
  const stateDefined = Reflect.defineProperty(shipment, "state", {
    configurable: false,
    enumerable: true,
    value: state,
    writable: false,
  });

  if (!stateDefined) {
    throw new Error("Unable to create a runtime-state test boundary.");
  }

  return shipment;
}

function freezeShipment(
  shipment: SyntheticShipmentLifecycleRecord,
): SyntheticShipmentLifecycleRecord {
  shipment.history.forEach((entry) => Object.freeze(entry));
  Object.freeze(shipment.history);
  return Object.freeze(shipment);
}

function describeResult(result: ShipmentTransitionResult): string {
  if (result.ok) {
    return result.shipment.state;
  }

  return result.reasonCode;
}

describe("shipment lifecycle", () => {
  it("applies a valid transition", () => {
    const result = applyShipmentTransition(
      createShipment(),
      "verified",
      TRANSITION_TIMESTAMP,
    );

    expect(result.ok).toBe(true);
    expect(describeResult(result)).toBe("verified");
  });

  it("rejects a transition that is not in the synthetic transition model", () => {
    const shipment = createShipment();
    const result = applyShipmentTransition(
      shipment,
      "completed",
      TRANSITION_TIMESTAMP,
    );

    expect(result).toEqual({
      ok: false,
      reasonCode: "transition_not_allowed",
      shipment,
    });
  });

  it("does not mutate the original object or its history", () => {
    const shipment = createShipment();
    const originalHistory = shipment.history.map((entry) => ({ ...entry }));

    const result = applyShipmentTransition(
      shipment,
      "verified",
      TRANSITION_TIMESTAMP,
    );

    expect(result.ok).toBe(true);
    expect(shipment).toEqual({
      id: "demo-shipment-a",
      state: "intake",
      history: originalHistory,
    });
    if (result.ok) {
      expect(result.shipment).not.toBe(shipment);
      expect(result.shipment.history).not.toBe(shipment.history);
    }
  });

  it("rejects a transition from completed terminal state", () => {
    const shipment: SyntheticShipmentLifecycleRecord = {
      id: "demo-shipment-a",
      state: "completed",
      history: [{ state: "completed", timestamp: INITIAL_TIMESTAMP }],
    };

    expect(
      applyShipmentTransition(shipment, "exception", TRANSITION_TIMESTAMP),
    ).toEqual({
      ok: false,
      reasonCode: "transition_not_allowed",
      shipment,
    });
  });

  it("handles exception explicitly as an allowed destination and terminal state", () => {
    expect(isShipmentTransitionAllowed("prepared", "exception")).toBe(true);
    expect(isShipmentTransitionAllowed("exception", "intake")).toBe(false);

    const exceptionResult = applyShipmentTransition(
      {
        id: "demo-shipment-a",
        state: "prepared",
        history: [{ state: "prepared", timestamp: INITIAL_TIMESTAMP }],
      },
      "exception",
      TRANSITION_TIMESTAMP,
    );

    expect(exceptionResult.ok).toBe(true);
    if (exceptionResult.ok) {
      expect(
        applyShipmentTransition(
          exceptionResult.shipment,
          "completed",
          "2030-01-02T11:00:00Z",
        ).ok,
      ).toBe(false);
    }
  });

  it("guards the public transition query against runtime-unknown states", () => {
    const unknownCurrentState: unknown = "queued";
    const unknownRequestedState: unknown = "dispatched";

    expect(() =>
      isShipmentTransitionAllowed(unknownCurrentState, "verified"),
    ).not.toThrow();
    expect(isShipmentTransitionAllowed(unknownCurrentState, "verified")).toBe(
      false,
    );
    expect(isShipmentTransitionAllowed("intake", unknownRequestedState)).toBe(
      false,
    );
  });

  it.each(INVALID_RUNTIME_STATES)(
    "rejects $label as a runtime current state",
    ({ value }) => {
      const shipment = freezeShipment(createShipmentWithRuntimeState(value));
      const result = applyShipmentTransition(
        shipment,
        "verified",
        TRANSITION_TIMESTAMP,
      );

      expect(result).toEqual({
        ok: false,
        reasonCode: "unknown_state",
        shipment,
      });
      expect(result.shipment).toBe(shipment);
      expect(shipment.state).toBe(value);
      expect(shipment.history).toEqual([
        { state: "intake", timestamp: INITIAL_TIMESTAMP },
      ]);
    },
  );

  it.each(INVALID_RUNTIME_STATES)(
    "rejects $label as a runtime requested state",
    ({ value }) => {
      const shipment = freezeShipment(createShipment());
      const result = applyShipmentTransition(
        shipment,
        value,
        TRANSITION_TIMESTAMP,
      );

      expect(result).toEqual({
        ok: false,
        reasonCode: "unknown_state",
        shipment,
      });
      expect(result.shipment).toBe(shipment);
      expect(shipment).toEqual({
        id: "demo-shipment-a",
        state: "intake",
        history: [{ state: "intake", timestamp: INITIAL_TIMESTAMP }],
      });
    },
  );

  it("rejects an unknown current state without throwing or changing repeated results", () => {
    const shipment = freezeShipment(
      createShipmentWithRuntimeState("runtime-unknown"),
    );

    expect(() =>
      applyShipmentTransition(shipment, "verified", TRANSITION_TIMESTAMP),
    ).not.toThrow();

    const firstResult = applyShipmentTransition(
      shipment,
      "verified",
      TRANSITION_TIMESTAMP,
    );
    const secondResult = applyShipmentTransition(
      shipment,
      "verified",
      TRANSITION_TIMESTAMP,
    );

    expect(secondResult).toEqual(firstResult);
    expect(firstResult.shipment).toBe(shipment);
    expect(shipment.history).toHaveLength(1);
  });

  it("preserves the caller-provided timestamp exactly", () => {
    const result = applyShipmentTransition(
      createShipment(),
      "verified",
      MILLISECOND_TIMESTAMP,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.shipment.history.at(-1)).toEqual({
        state: "verified",
        timestamp: MILLISECOND_TIMESTAMP,
      });
    }
  });

  it("does not impose the fixture-only 2030 window on lifecycle timestamps", () => {
    const timestampOutsideFixtureWindow = "2029-12-31T23:59:59Z";
    const result = applyShipmentTransition(
      createShipment(),
      "verified",
      timestampOutsideFixtureWindow,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.shipment.history.at(-1)?.timestamp).toBe(
        timestampOutsideFixtureWindow,
      );
    }
  });

  it("returns a coherent typed rejection when a timestamp is absent", () => {
    const result: ShipmentTransitionResult = applyShipmentTransition(
      createShipment(),
      "verified",
      "",
    );

    expect(result.ok).toBe(false);
    expect(describeResult(result)).toBe("timestamp_required");
  });

  it.each(INVALID_TIMESTAMPS)(
    "rejects $label without appending history",
    ({ value, reasonCode }) => {
      const shipment = freezeShipment(createShipment());
      const result = applyShipmentTransition(shipment, "verified", value);

      expect(result).toEqual({
        ok: false,
        reasonCode,
        shipment,
      });
      expect(result.shipment).toBe(shipment);
      expect(shipment).toEqual({
        id: "demo-shipment-a",
        state: "intake",
        history: [{ state: "intake", timestamp: INITIAL_TIMESTAMP }],
      });
    },
  );

  it("rejects malformed timestamps deterministically without throwing or mutation", () => {
    const shipment = freezeShipment(createShipment());
    const invalidTimestamp: unknown = "not-a-timestamp";

    expect(() =>
      applyShipmentTransition(shipment, "verified", invalidTimestamp),
    ).not.toThrow();

    const firstResult = applyShipmentTransition(
      shipment,
      "verified",
      invalidTimestamp,
    );
    const secondResult = applyShipmentTransition(
      shipment,
      "verified",
      invalidTimestamp,
    );

    expect(firstResult).toEqual({
      ok: false,
      reasonCode: "invalid_timestamp",
      shipment,
    });
    expect(secondResult).toEqual(firstResult);
    expect(firstResult.shipment).toBe(shipment);
    expect(shipment.history).toHaveLength(1);
  });
});
