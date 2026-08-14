import { describe, expect, it } from "vitest";

import { SYNTHETIC_FIXTURE_FILENAMES } from "../src/synthetic-fixture-validator.js";
import {
  SYNTHETIC_ACTIONS,
  SYNTHETIC_ACTORS,
  SYNTHETIC_QUERY_CATEGORIES,
  SYNTHETIC_RESOURCES,
  SYNTHETIC_SHIPMENT_STATES,
  SYNTHETIC_TRACKING_EVENT_TYPES,
  isSyntheticAction,
  isSyntheticActor,
  isSyntheticQueryCategory,
  isSyntheticResource,
  isSyntheticShipmentState,
  isSyntheticTrackingEventType,
} from "../src/shared/types.js";

const EXPORTED_PUBLIC_ARRAYS = [
  SYNTHETIC_ACTORS,
  SYNTHETIC_RESOURCES,
  SYNTHETIC_ACTIONS,
  SYNTHETIC_SHIPMENT_STATES,
  SYNTHETIC_TRACKING_EVENT_TYPES,
  SYNTHETIC_QUERY_CATEGORIES,
  SYNTHETIC_FIXTURE_FILENAMES,
] as const;

describe("exported public constants", () => {
  it("freezes every exported vocabulary and fixture manifest at runtime", () => {
    for (const exportedArray of EXPORTED_PUBLIC_ARRAYS) {
      expect(Object.isFrozen(exportedArray)).toBe(true);
    }
  });

  it("rejects JavaScript mutation attempts without altering a source array", () => {
    const before = [...SYNTHETIC_ACTORS];

    expect(Reflect.set(SYNTHETIC_ACTORS, 0, "unexpected_actor")).toBe(false);
    expect(() =>
      Reflect.apply(Array.prototype.push, SYNTHETIC_ACTORS, [
        "unexpected_actor",
      ]),
    ).toThrow(TypeError);
    expect(SYNTHETIC_ACTORS).toEqual(before);
  });

  it("preserves the existing public vocabulary guards", () => {
    expect(isSyntheticActor("customer")).toBe(true);
    expect(isSyntheticResource("shipment_summary")).toBe(true);
    expect(isSyntheticAction("read")).toBe(true);
    expect(isSyntheticShipmentState("completed")).toBe(true);
    expect(isSyntheticTrackingEventType("arrived")).toBe(true);
    expect(isSyntheticQueryCategory("operational_summary")).toBe(true);

    expect(isSyntheticActor("unexpected_actor")).toBe(false);
    expect(isSyntheticResource("unexpected_resource")).toBe(false);
    expect(isSyntheticAction("unexpected_action")).toBe(false);
    expect(isSyntheticShipmentState("unexpected_state")).toBe(false);
    expect(isSyntheticTrackingEventType("unexpected_event")).toBe(false);
    expect(isSyntheticQueryCategory("unexpected_category")).toBe(false);
  });

  it("keeps the closed fixture manifest deterministic and unchanged", () => {
    const expected = [
      "actors.json",
      "accounts.json",
      "shipments.json",
      "tracking-events.json",
      "internal-query-requests.json",
      "financial-status-references.json",
    ];

    expect(SYNTHETIC_FIXTURE_FILENAMES).toEqual(expected);
    expect([...SYNTHETIC_FIXTURE_FILENAMES]).toEqual(expected);
  });
});
