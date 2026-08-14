/**
 * Public synthetic reference example for the LEM-BOX technical case study.
 * Independently implemented from the approved public architecture and workflows.
 * This is not production source code, production authorization logic, or a complete business implementation.
 * See ../../docs/licensing.md before assuming any reuse permission.
 */

import {
  isSyntheticTrackingEventType,
  type SyntheticShipmentState,
  type SyntheticTrackingEventType,
} from "./shared/types.js";
import { PUBLIC_EXAMPLE_NOTICE } from "./shared/public-example-notice.js";

export const TRACKING_TIMELINE_PUBLIC_NOTICE = PUBLIC_EXAMPLE_NOTICE;

export interface SyntheticExternalTrackingEvent {
  readonly eventType: unknown;
  readonly timestamp: unknown;
  readonly sanitizedMessage: unknown;
}

export interface PublicTrackingTimelineEvent {
  readonly publicStage: SyntheticShipmentState;
  readonly timestamp: string;
  readonly sanitizedMessage: string;
}

export type TrackingEventRejectionReason =
  | "unknown_event_type"
  | "invalid_timestamp"
  | "invalid_sanitized_message";

export interface RejectedTrackingEvent {
  readonly sourceIndex: number;
  readonly reasonCode: TrackingEventRejectionReason;
}

export interface TrackingTimelineResult {
  readonly timeline: readonly PublicTrackingTimelineEvent[];
  readonly rejectedEvents: readonly RejectedTrackingEvent[];
}

export const PUBLIC_STAGE_BY_TRACKING_EVENT = Object.freeze({
  received: "intake",
  moving: "in_transit",
  arrived: "available",
  completed: "completed",
  exception: "exception",
} as const satisfies Readonly<
  Record<SyntheticTrackingEventType, SyntheticShipmentState>
>);

const TRACKING_EVENT_ORDER = Object.freeze({
  received: 0,
  moving: 1,
  arrived: 2,
  completed: 3,
  exception: 4,
} satisfies Readonly<Record<SyntheticTrackingEventType, number>>);

const UTC_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{3})?Z$/;

interface ValidatedTrackingEvent {
  readonly eventType: SyntheticTrackingEventType;
  readonly timestamp: string;
  readonly timestampEpoch: number;
  readonly sanitizedMessage: string;
}

function parseTimestamp(timestamp: string): number | null {
  if (!UTC_TIMESTAMP_PATTERN.test(timestamp)) {
    return null;
  }

  const timestampEpoch = Date.parse(timestamp);
  if (!Number.isFinite(timestampEpoch)) {
    return null;
  }

  const canonicalTimestamp = new Date(timestampEpoch).toISOString();
  const canonicalTimestampWithoutMilliseconds = canonicalTimestamp.replace(
    ".000Z",
    "Z",
  );

  if (
    timestamp !== canonicalTimestamp &&
    timestamp !== canonicalTimestampWithoutMilliseconds
  ) {
    return null;
  }

  return timestampEpoch;
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

function compareTrackingEvents(
  left: ValidatedTrackingEvent,
  right: ValidatedTrackingEvent,
): number {
  const timeComparison = left.timestampEpoch - right.timestampEpoch;
  if (timeComparison !== 0) {
    return timeComparison;
  }

  const typeComparison =
    TRACKING_EVENT_ORDER[left.eventType] -
    TRACKING_EVENT_ORDER[right.eventType];
  if (typeComparison !== 0) {
    return typeComparison;
  }

  const timestampTextComparison = compareText(left.timestamp, right.timestamp);
  if (timestampTextComparison !== 0) {
    return timestampTextComparison;
  }

  return compareText(left.sanitizedMessage, right.sanitizedMessage);
}

export function isValidTrackingTimestamp(timestamp: unknown): boolean {
  return typeof timestamp === "string" && parseTimestamp(timestamp) !== null;
}

export function mapTrackingEventType(
  eventType: unknown,
): SyntheticShipmentState | null {
  if (!isSyntheticTrackingEventType(eventType)) {
    return null;
  }

  return PUBLIC_STAGE_BY_TRACKING_EVENT[eventType];
}

export function buildTrackingTimeline(
  events: readonly SyntheticExternalTrackingEvent[],
): TrackingTimelineResult {
  const validEvents: ValidatedTrackingEvent[] = [];
  const rejectedEvents: RejectedTrackingEvent[] = [];

  events.forEach((event, sourceIndex) => {
    if (!isSyntheticTrackingEventType(event.eventType)) {
      rejectedEvents.push({ sourceIndex, reasonCode: "unknown_event_type" });
      return;
    }

    if (typeof event.timestamp !== "string") {
      rejectedEvents.push({ sourceIndex, reasonCode: "invalid_timestamp" });
      return;
    }

    const timestampEpoch = parseTimestamp(event.timestamp);
    if (timestampEpoch === null) {
      rejectedEvents.push({ sourceIndex, reasonCode: "invalid_timestamp" });
      return;
    }

    if (
      typeof event.sanitizedMessage !== "string" ||
      event.sanitizedMessage.trim().length === 0
    ) {
      rejectedEvents.push({
        sourceIndex,
        reasonCode: "invalid_sanitized_message",
      });
      return;
    }

    validEvents.push({
      eventType: event.eventType,
      timestamp: event.timestamp,
      timestampEpoch,
      sanitizedMessage: event.sanitizedMessage,
    });
  });

  validEvents.sort(compareTrackingEvents);

  const equivalentEventKeys = new Set<string>();
  const timeline: PublicTrackingTimelineEvent[] = [];

  for (const event of validEvents) {
    const equivalenceKey = JSON.stringify([
      event.timestampEpoch,
      event.eventType,
      event.sanitizedMessage,
    ]);

    if (equivalentEventKeys.has(equivalenceKey)) {
      continue;
    }

    equivalentEventKeys.add(equivalenceKey);
    timeline.push({
      publicStage: PUBLIC_STAGE_BY_TRACKING_EVENT[event.eventType],
      timestamp: event.timestamp,
      sanitizedMessage: event.sanitizedMessage,
    });
  }

  return {
    timeline,
    rejectedEvents,
  };
}
