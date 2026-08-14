import { describe, expect, expectTypeOf, it } from "vitest";

import {
  buildTrackingTimeline,
  mapTrackingEventType,
  type SyntheticExternalTrackingEvent,
  type TrackingTimelineResult,
} from "../src/tracking-timeline.js";

const RECEIVED_EVENT: SyntheticExternalTrackingEvent = {
  eventType: "received",
  timestamp: "2030-01-10T09:00:00Z",
  sanitizedMessage: "Demo record received",
};

describe("buildTrackingTimeline", () => {
  it("orders valid events chronologically and maps every synthetic type", () => {
    const result = buildTrackingTimeline([
      {
        eventType: "completed",
        timestamp: "2030-01-10T12:00:00Z",
        sanitizedMessage: "Demo movement completed",
      },
      {
        eventType: "arrived",
        timestamp: "2030-01-10T11:00:00Z",
        sanitizedMessage: "Demo record arrived",
      },
      RECEIVED_EVENT,
      {
        eventType: "moving",
        timestamp: "2030-01-10T10:00:00Z",
        sanitizedMessage: "Demo record moving",
      },
      {
        eventType: "exception",
        timestamp: "2030-01-10T13:00:00Z",
        sanitizedMessage: "Demo exception recorded",
      },
    ]);

    expect(result.timeline.map((event) => event.timestamp)).toEqual([
      "2030-01-10T09:00:00Z",
      "2030-01-10T10:00:00Z",
      "2030-01-10T11:00:00Z",
      "2030-01-10T12:00:00Z",
      "2030-01-10T13:00:00Z",
    ]);
    expect(result.timeline.map((event) => event.publicStage)).toEqual([
      "intake",
      "in_transit",
      "available",
      "completed",
      "exception",
    ]);
  });

  it("deduplicates equivalent events, including equivalent timestamp forms", () => {
    const result = buildTrackingTimeline([
      RECEIVED_EVENT,
      { ...RECEIVED_EVENT },
      { ...RECEIVED_EVENT, timestamp: "2030-01-10T09:00:00.000Z" },
    ]);

    expect(result.timeline).toEqual([
      {
        publicStage: "intake",
        timestamp: "2030-01-10T09:00:00.000Z",
        sanitizedMessage: "Demo record received",
      },
    ]);
    expect(result.rejectedEvents).toEqual([]);
  });

  it("rejects an unknown event type without copying its content", () => {
    const result = buildTrackingTimeline([
      {
        eventType: "unmapped_demo_event",
        timestamp: "2030-01-10T09:00:00Z",
        sanitizedMessage: "Demo text that must not be echoed in a rejection",
      },
    ]);

    expect(result).toEqual({
      timeline: [],
      rejectedEvents: [{ sourceIndex: 0, reasonCode: "unknown_event_type" }],
    });
  });

  it("rejects invalid and non-canonical timestamps", () => {
    const result = buildTrackingTimeline([
      { ...RECEIVED_EVENT, timestamp: "not-a-timestamp" },
      { ...RECEIVED_EVENT, timestamp: "2030-02-30T09:00:00Z" },
      { ...RECEIVED_EVENT, timestamp: "2030-01-10T09:00:00-05:00" },
    ]);

    expect(result.timeline).toEqual([]);
    expect(result.rejectedEvents).toEqual([
      { sourceIndex: 0, reasonCode: "invalid_timestamp" },
      { sourceIndex: 1, reasonCode: "invalid_timestamp" },
      { sourceIndex: 2, reasonCode: "invalid_timestamp" },
    ]);
  });

  it("rejects a missing sanitized message", () => {
    const result = buildTrackingTimeline([
      { ...RECEIVED_EVENT, sanitizedMessage: undefined },
    ]);

    expect(result.rejectedEvents).toEqual([
      { sourceIndex: 0, reasonCode: "invalid_sanitized_message" },
    ]);
  });

  it("preserves sanitized text exactly", () => {
    const sanitizedMessage = "  Demo status text with intentional spacing  ";
    const result = buildTrackingTimeline([
      { ...RECEIVED_EVENT, sanitizedMessage },
    ]);

    expect(result.timeline[0]?.sanitizedMessage).toBe(sanitizedMessage);
  });

  it("does not mutate its input", () => {
    const input: readonly SyntheticExternalTrackingEvent[] = Object.freeze([
      Object.freeze({
        eventType: "moving",
        timestamp: "2030-01-10T10:00:00Z",
        sanitizedMessage: "Demo record moving",
      }),
      Object.freeze({ ...RECEIVED_EVENT }),
    ]);
    const snapshot = input.map((event) => ({ ...event }));

    buildTrackingTimeline(input);

    expect(input).toEqual(snapshot);
  });

  it("returns deterministic output for equivalent input orderings", () => {
    const first = {
      ...RECEIVED_EVENT,
      sanitizedMessage: "Demo message B",
    };
    const second = {
      ...RECEIVED_EVENT,
      sanitizedMessage: "Demo message A",
    };

    expect(buildTrackingTimeline([first, second])).toEqual(
      buildTrackingTimeline([second, first]),
    );
  });

  it("exposes a typed, explicit event mapping", () => {
    const result = buildTrackingTimeline([RECEIVED_EVENT]);

    expectTypeOf(result).toEqualTypeOf<TrackingTimelineResult>();
    expect(mapTrackingEventType("moving")).toBe("in_transit");
    expect(mapTrackingEventType("unknown")).toBeNull();
  });
});
