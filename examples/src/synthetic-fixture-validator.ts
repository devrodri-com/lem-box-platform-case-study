/**
 * Public synthetic reference example for the LEM-BOX technical case study.
 * Independently implemented from the approved public architecture and workflows.
 * This is not production source code, production authorization logic, or a complete business implementation.
 * See ../../docs/licensing.md before assuming any reuse permission.
 */

import { lstat, readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

import { evaluateScopedInternalQuery } from "./scoped-internal-query.js";
import { isShipmentTransitionAllowed } from "./shipment-lifecycle.js";
import {
  isSyntheticActor,
  isSyntheticQueryCategory,
  isSyntheticShipmentState,
  isSyntheticTrackingEventType,
  type SyntheticShipmentState,
} from "./shared/types.js";

export const SYNTHETIC_WINDOW_START = "2030-01-01T00:00:00Z";
export const SYNTHETIC_WINDOW_END = "2030-12-31T23:59:59Z";

export const SYNTHETIC_FIXTURE_FILENAMES = Object.freeze([
  "actors.json",
  "accounts.json",
  "shipments.json",
  "tracking-events.json",
  "internal-query-requests.json",
  "financial-status-references.json",
] as const);

export type SyntheticFixtureFilename =
  (typeof SYNTHETIC_FIXTURE_FILENAMES)[number];

export type FixtureValidationCode =
  | "DUPLICATE_IDENTIFIER"
  | "FORBIDDEN_KEY"
  | "INVALID_ENUM"
  | "INVALID_IDENTIFIER"
  | "INVALID_JSON"
  | "INVALID_ROOT"
  | "INVALID_STRUCTURE"
  | "INVALID_SYNTHETIC_TEXT"
  | "INVALID_TIMESTAMP"
  | "INVALID_TYPE"
  | "MISSING_FILE"
  | "MISSING_KEY"
  | "READ_FAILED"
  | "SUSPICIOUS_VALUE"
  | "UNEXPECTED_FILE"
  | "UNKNOWN_FIXTURE"
  | "UNKNOWN_KEY";

export interface FixtureValidationIssue {
  readonly code: FixtureValidationCode;
  readonly file: string;
  readonly path: string;
  readonly message: string;
}

export interface FixtureValidationReport {
  readonly valid: boolean;
  readonly filesChecked: number;
  readonly issues: readonly FixtureValidationIssue[];
}

const DEFAULT_FIXTURE_DIRECTORY = fileURLToPath(
  new URL("../../fixtures/synthetic/", import.meta.url),
);

const FORBIDDEN_NORMALIZED_KEYS = new Set([
  "email",
  "emailaddress",
  "customeremail",
  "phone",
  "phonenumber",
  "telephone",
  "address",
  "postaladdress",
  "streetaddress",
  "trackingnumber",
  "amount",
  "currency",
  "weight",
  "rate",
  "invoice",
  "invoicenumber",
  "bank",
  "bankaccount",
  "accountnumber",
  "password",
  "token",
  "accesstoken",
  "refreshtoken",
  "secret",
  "clientsecret",
  "apikey",
  "privatekey",
  "prompt",
  "systemprompt",
]);

const OPERATIONAL_SUMMARY_FIELDS: readonly string[] = [
  "recordCount",
  "currentStage",
  "lastUpdatedAt",
];
const SHIPMENT_STATUS_FIELDS: readonly string[] = [
  "publicState",
  "lastEventAt",
  "nextPublicStep",
];
const FINANCIAL_REFERENCE_FIELDS: readonly string[] = [
  "referenceStatus",
  "referenceDate",
];
const DELIBERATELY_DENIED_REQUEST_FIELDS: readonly string[] = ["amount"];

const ALLOWED_SYNTHETIC_TEXT_PATTERNS: readonly RegExp[] = [
  /^Demo (?:Customer|Operations|Business|Internal) Context [A-Z]$/u,
  /^Demo Account [A-Z]$/u,
  /^Synthetic Region [A-Z]$/u,
  /^Demo operational record(?: [A-Z])?$/u,
  /^Demo event (?:received|arrived|completed|exception)$/u,
  /^Synthetic movement update$/u,
  /^Demo reference (?:pending|confirmed)$/u,
  /^Demo financial reference(?: [A-Z])?$/u,
];

const PUBLIC_PATH_KEYS = new Set([
  "id",
  "actor",
  "scope",
  "displayLabel",
  "label",
  "regionLabel",
  "accountId",
  "publicState",
  "recordLabel",
  "history",
  "transitionCase",
  "state",
  "timestamp",
  "fromState",
  "toState",
  "expectedAllowed",
  "shipmentId",
  "eventType",
  "sanitizedMessage",
  "category",
  "requestedFields",
  "referenceStatus",
  "referenceDate",
]);

const CANONICAL_UTC_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u;

const SYNTHETIC_IDENTIFIER_PATTERN =
  /^demo-[a-z0-9]+(?:-[a-z0-9]+)*$/u;

function addIssue(
  issues: FixtureValidationIssue[],
  file: string,
  path: string,
  code: FixtureValidationCode,
  message: string,
): void {
  issues.push({ code, file, path, message });
}

function safeFilename(file: string): string {
  const filename = basename(file);
  return SYNTHETIC_FIXTURE_FILENAMES.some(
    (candidate) => candidate === filename,
  )
    ? filename
    : "<unapproved-fixture-file>";
}

function isFixtureFilename(value: string): value is SyntheticFixtureFilename {
  return SYNTHETIC_FIXTURE_FILENAMES.some((candidate) => candidate === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizedKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/gu, "");
}

function childPath(parent: string, key: string): string {
  const safeKey = PUBLIC_PATH_KEYS.has(key) ? key : "<unapproved-key>";
  return `${parent}.${safeKey}`;
}

function itemPath(parent: string, index: number): string {
  return `${parent}[${index}]`;
}

function looksLikeEmail(value: string): boolean {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/u.test(value);
}

function looksLikePhone(value: string): boolean {
  const candidates = value.match(/\+?\d[\d\s().-]{5,}\d/gu) ?? [];
  return candidates.some((candidate) => {
    const digitCount = candidate.replace(/\D/gu, "").length;
    return digitCount >= 7 && digitCount <= 15;
  });
}

function looksLikeUrl(value: string): boolean {
  return (
    /[a-z][a-z0-9+.-]*:\/\//iu.test(value) ||
    /\bwww\./iu.test(value) ||
    /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(?:\/|$)/iu.test(
      value,
    ) ||
    /\b(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/u.test(value)
  );
}

function looksLikeCardOrAccount(value: string): boolean {
  return (
    /(?:^|\D)(?:\d[\s-]?){13,19}(?:\D|$)/u.test(value) ||
    /\b(?:account|acct|iban)[-_ ]?[a-z0-9]{6,}\b/iu.test(value)
  );
}

function looksLikeHighEntropyToken(value: string): boolean {
  const candidates = value.match(/[A-Za-z0-9_-]{40,}/gu) ?? [];
  return candidates.some(
    (candidate) =>
      /[A-Z]/u.test(candidate) &&
      /[a-z]/u.test(candidate) &&
      /\d/u.test(candidate) &&
      /[_-]/u.test(candidate),
  );
}

function looksLikeCredentialOrEncodedBlock(value: string): boolean {
  return (
    /-----BEGIN [A-Z ]+-----/u.test(value) ||
    /\bBearer\s+\S+/iu.test(value) ||
    /[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}/u.test(
      value,
    ) ||
    /(?:^|\W)(?:sk|pk|api)[-_][A-Za-z0-9_-]{16,}/iu.test(value) ||
    /\b[a-f0-9]{32,}\b/iu.test(value) ||
    looksLikeHighEntropyToken(value) ||
    /[A-Za-z0-9+/]{64,}={0,2}/u.test(value)
  );
}

function looksLikeTrackingIdentifier(value: string): boolean {
  return (
    /\b1Z[A-Z0-9]{16}\b/u.test(value) ||
    /\b[A-Z]{2}\d{9}[A-Z]{2}\b/u.test(value) ||
    /\b(?=[A-Z0-9]{12,30}\b)(?=[A-Z0-9]*[A-Z])(?=[A-Z0-9]*\d)[A-Z0-9]+\b/u.test(
      value,
    )
  );
}

function suspiciousValueKind(value: string): string | undefined {
  if (CANONICAL_UTC_TIMESTAMP_PATTERN.test(value)) {
    return undefined;
  }
  if (looksLikeEmail(value)) {
    return "email data";
  }
  if (looksLikeUrl(value)) {
    return "URL data";
  }
  if (looksLikeCardOrAccount(value)) {
    return "card or account data";
  }
  if (looksLikeCredentialOrEncodedBlock(value)) {
    return "credential or encoded data";
  }
  if (looksLikeTrackingIdentifier(value)) {
    return "tracking data";
  }
  if (looksLikePhone(value)) {
    return "phone data";
  }
  return undefined;
}

function isIdentifierKey(key: string): boolean {
  const normalized = normalizedKey(key);
  return normalized === "id" || normalized.endsWith("id");
}

function scanGeneralSafety(
  value: unknown,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): void {
  if (typeof value === "string") {
    const kind = suspiciousValueKind(value);
    if (kind !== undefined) {
      addIssue(
        issues,
        file,
        path,
        "SUSPICIOUS_VALUE",
        `String resembles prohibited ${kind}; the value is not displayed.`,
      );
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      scanGeneralSafety(item, file, itemPath(path, index), issues);
    });
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const nextPath = childPath(path, key);
    if (FORBIDDEN_NORMALIZED_KEYS.has(normalizedKey(key))) {
      addIssue(
        issues,
        file,
        nextPath,
        "FORBIDDEN_KEY",
        "A prohibited key is present; its value is not displayed.",
      );
    }

    if (
      isIdentifierKey(key) &&
      (typeof child !== "string" || !SYNTHETIC_IDENTIFIER_PATTERN.test(child))
    ) {
      addIssue(
        issues,
        file,
        nextPath,
        "INVALID_IDENTIFIER",
        "Synthetic identifiers must use the closed demo- namespace grammar.",
      );
    }
    scanGeneralSafety(child, file, nextPath, issues);
  }
}

function checkExactKeys(
  record: Record<string, unknown>,
  allowedKeys: readonly string[],
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): void {
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      addIssue(
        issues,
        file,
        childPath(path, key),
        "UNKNOWN_KEY",
        "The key is not part of this fixture's closed public schema.",
      );
    }
  }
  for (const key of allowedKeys) {
    if (!Object.hasOwn(record, key)) {
      addIssue(
        issues,
        file,
        childPath(path, key),
        "MISSING_KEY",
        "A required public fixture key is missing.",
      );
    }
  }
}

function getString(
  record: Record<string, unknown>,
  key: string,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): string | undefined {
  const value = record[key];
  if (typeof value !== "string") {
    addIssue(
      issues,
      file,
      childPath(path, key),
      "INVALID_TYPE",
      "Expected a string.",
    );
    return undefined;
  }
  return value;
}

function checkBoolean(
  record: Record<string, unknown>,
  key: string,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): void {
  if (typeof record[key] !== "boolean") {
    addIssue(
      issues,
      file,
      childPath(path, key),
      "INVALID_TYPE",
      "Expected a boolean.",
    );
  }
}

function checkDemoIdentifier(
  record: Record<string, unknown>,
  key: string,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): string | undefined {
  const value = getString(record, key, file, path, issues);
  if (value !== undefined && !SYNTHETIC_IDENTIFIER_PATTERN.test(value)) {
    addIssue(
      issues,
      file,
      childPath(path, key),
      "INVALID_IDENTIFIER",
      "Synthetic identifiers must use the closed demo- namespace grammar.",
    );
  }
  return value;
}

function checkSyntheticText(
  record: Record<string, unknown>,
  key: string,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): void {
  const value = getString(record, key, file, path, issues);
  if (
    value !== undefined &&
    !ALLOWED_SYNTHETIC_TEXT_PATTERNS.some((pattern) => pattern.test(value))
  ) {
    addIssue(
      issues,
      file,
      childPath(path, key),
      "INVALID_SYNTHETIC_TEXT",
      "Free text must match a closed, visibly synthetic public label pattern.",
    );
  }
}

function checkTimestampValue(
  value: unknown,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): number | undefined {
  if (typeof value !== "string") {
    addIssue(issues, file, path, "INVALID_TYPE", "Expected a UTC timestamp.");
    return undefined;
  }

  const milliseconds = Date.parse(value);
  const canonical =
    Number.isFinite(milliseconds) &&
    new Date(milliseconds).toISOString().replace(".000Z", "") ===
      value.replace(/Z$/u, "");
  const withinWindow =
    milliseconds >= Date.parse(SYNTHETIC_WINDOW_START) &&
    milliseconds <= Date.parse(SYNTHETIC_WINDOW_END);

  if (
    !CANONICAL_UTC_TIMESTAMP_PATTERN.test(value) ||
    !canonical ||
    !withinWindow
  ) {
    addIssue(
      issues,
      file,
      path,
      "INVALID_TIMESTAMP",
      "Timestamp must be canonical UTC within the documented 2030 synthetic window.",
    );
    return undefined;
  }

  return milliseconds;
}

function checkStringArray(
  value: unknown,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): readonly string[] | undefined {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    addIssue(
      issues,
      file,
      path,
      "INVALID_TYPE",
      "Expected an array of strings.",
    );
    return undefined;
  }

  const result: string[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      result.push(item);
    }
  }
  return result;
}

function validateRootArray(
  value: unknown,
  file: string,
  issues: FixtureValidationIssue[],
): readonly unknown[] | undefined {
  if (!Array.isArray(value)) {
    addIssue(
      issues,
      file,
      "$",
      "INVALID_ROOT",
      "Fixture root must be an array.",
    );
    return undefined;
  }
  if (value.length === 0) {
    addIssue(
      issues,
      file,
      "$",
      "INVALID_STRUCTURE",
      "Fixture array must contain at least one synthetic record.",
    );
  }
  return value;
}

function checkRecord(
  value: unknown,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): Record<string, unknown> | undefined {
  if (!isRecord(value)) {
    addIssue(
      issues,
      file,
      path,
      "INVALID_TYPE",
      "Expected an object record.",
    );
    return undefined;
  }
  return value;
}

function checkUniqueIds(
  records: readonly unknown[],
  file: string,
  issues: FixtureValidationIssue[],
): void {
  const seen = new Set<string>();
  records.forEach((record, index) => {
    if (!isRecord(record) || typeof record["id"] !== "string") {
      return;
    }
    const id = record["id"];
    if (seen.has(id)) {
      addIssue(
        issues,
        file,
        childPath(itemPath("$", index), "id"),
        "DUPLICATE_IDENTIFIER",
        "Synthetic fixture identifiers must be unique within a file.",
      );
    }
    seen.add(id);
  });
}

function validateActors(
  value: unknown,
  file: string,
  issues: FixtureValidationIssue[],
): void {
  const records = validateRootArray(value, file, issues);
  if (records === undefined) {
    return;
  }
  checkUniqueIds(records, file, issues);
  records.forEach((item, index) => {
    const path = itemPath("$", index);
    const record = checkRecord(item, file, path, issues);
    if (record === undefined) {
      return;
    }
    checkExactKeys(
      record,
      ["id", "actor", "scope", "displayLabel"],
      file,
      path,
      issues,
    );
    checkDemoIdentifier(record, "id", file, path, issues);
    const actor = getString(record, "actor", file, path, issues);
    if (actor !== undefined && !isSyntheticActor(actor)) {
      addIssue(
        issues,
        file,
        childPath(path, "actor"),
        "INVALID_ENUM",
        "Actor is outside the approved synthetic vocabulary.",
      );
    }
    checkDemoIdentifier(record, "scope", file, path, issues);
    checkSyntheticText(record, "displayLabel", file, path, issues);
  });
}

function validateAccounts(
  value: unknown,
  file: string,
  issues: FixtureValidationIssue[],
): void {
  const records = validateRootArray(value, file, issues);
  if (records === undefined) {
    return;
  }
  checkUniqueIds(records, file, issues);
  records.forEach((item, index) => {
    const path = itemPath("$", index);
    const record = checkRecord(item, file, path, issues);
    if (record === undefined) {
      return;
    }
    checkExactKeys(
      record,
      ["id", "scope", "label", "regionLabel"],
      file,
      path,
      issues,
    );
    checkDemoIdentifier(record, "id", file, path, issues);
    checkDemoIdentifier(record, "scope", file, path, issues);
    checkSyntheticText(record, "label", file, path, issues);
    checkSyntheticText(record, "regionLabel", file, path, issues);
  });
}

function validateHistory(
  value: unknown,
  publicState: SyntheticShipmentState | undefined,
  file: string,
  path: string,
  publicStatePath: string,
  issues: FixtureValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0) {
    addIssue(
      issues,
      file,
      path,
      "INVALID_STRUCTURE",
      "Shipment history must be a non-empty array.",
    );
    return;
  }

  const states: Array<SyntheticShipmentState | undefined> = [];
  const timestamps: Array<number | undefined> = [];

  value.forEach((item, index) => {
    const entryPath = itemPath(path, index);
    const record = checkRecord(item, file, entryPath, issues);
    if (record === undefined) {
      states.push(undefined);
      timestamps.push(undefined);
      return;
    }
    checkExactKeys(record, ["state", "timestamp"], file, entryPath, issues);
    const stateValue = getString(record, "state", file, entryPath, issues);
    if (stateValue !== undefined && !isSyntheticShipmentState(stateValue)) {
      addIssue(
        issues,
        file,
        childPath(entryPath, "state"),
        "INVALID_ENUM",
        "State is outside the approved synthetic vocabulary.",
      );
    }

    states.push(
      isSyntheticShipmentState(stateValue) ? stateValue : undefined,
    );
    timestamps.push(
      checkTimestampValue(
        record["timestamp"],
        file,
        childPath(entryPath, "timestamp"),
        issues,
      ),
    );
  });

  const firstState = states[0];
  if (firstState !== undefined && firstState !== "intake") {
    addIssue(
      issues,
      file,
      childPath(itemPath(path, 0), "state"),
      "INVALID_STRUCTURE",
      "Shipment history must begin with the public synthetic intake state.",
    );
  }

  for (let index = 1; index < states.length; index += 1) {
    const previousState = states[index - 1];
    const currentState = states[index];
    if (
      previousState !== undefined &&
      currentState !== undefined &&
      !isShipmentTransitionAllowed(previousState, currentState)
    ) {
      addIssue(
        issues,
        file,
        childPath(itemPath(path, index), "state"),
        "INVALID_STRUCTURE",
        "Consecutive history states must follow the public synthetic lifecycle, including terminal-state rules.",
      );
    }

    const previousTimestamp = timestamps[index - 1];
    const currentTimestamp = timestamps[index];
    if (
      previousTimestamp !== undefined &&
      currentTimestamp !== undefined &&
      currentTimestamp < previousTimestamp
    ) {
      addIssue(
        issues,
        file,
        childPath(itemPath(path, index), "timestamp"),
        "INVALID_STRUCTURE",
        "Shipment history timestamps must be in non-decreasing order.",
      );
    }
  }

  const finalState = states[states.length - 1];
  if (
    publicState !== undefined &&
    finalState !== undefined &&
    finalState !== publicState
  ) {
    addIssue(
      issues,
      file,
      publicStatePath,
      "INVALID_STRUCTURE",
      "Shipment public state must equal the final history state.",
    );
  }
}

function validateTransitionCase(
  value: unknown,
  file: string,
  path: string,
  issues: FixtureValidationIssue[],
): void {
  const record = checkRecord(value, file, path, issues);
  if (record === undefined) {
    return;
  }
  checkExactKeys(
    record,
    ["id", "fromState", "toState", "timestamp", "expectedAllowed"],
    file,
    path,
    issues,
  );
  checkDemoIdentifier(record, "id", file, path, issues);
  const fromState = getString(record, "fromState", file, path, issues);
  const toState = getString(record, "toState", file, path, issues);
  for (const [key, state] of [
    ["fromState", fromState],
    ["toState", toState],
  ] as const) {
    if (state !== undefined && !isSyntheticShipmentState(state)) {
      addIssue(
        issues,
        file,
        childPath(path, key),
        "INVALID_ENUM",
        "State is outside the approved synthetic vocabulary.",
      );
    }
  }
  checkTimestampValue(
    record["timestamp"],
    file,
    childPath(path, "timestamp"),
    issues,
  );
  checkBoolean(record, "expectedAllowed", file, path, issues);
  const expectedAllowed = record["expectedAllowed"];
  if (
    isSyntheticShipmentState(fromState) &&
    isSyntheticShipmentState(toState) &&
    typeof expectedAllowed === "boolean" &&
    expectedAllowed !== isShipmentTransitionAllowed(fromState, toState)
  ) {
    addIssue(
      issues,
      file,
      childPath(path, "expectedAllowed"),
      "INVALID_STRUCTURE",
      "Expected transition outcome does not match the public synthetic lifecycle.",
    );
  }
}

function validateShipments(
  value: unknown,
  file: string,
  issues: FixtureValidationIssue[],
): void {
  const records = validateRootArray(value, file, issues);
  if (records === undefined) {
    return;
  }
  checkUniqueIds(records, file, issues);
  records.forEach((item, index) => {
    const path = itemPath("$", index);
    const record = checkRecord(item, file, path, issues);
    if (record === undefined) {
      return;
    }
    checkExactKeys(
      record,
      [
        "id",
        "accountId",
        "scope",
        "publicState",
        "recordLabel",
        "history",
        "transitionCase",
      ],
      file,
      path,
      issues,
    );
    checkDemoIdentifier(record, "id", file, path, issues);
    checkDemoIdentifier(record, "accountId", file, path, issues);
    checkDemoIdentifier(record, "scope", file, path, issues);
    const stateValue = getString(record, "publicState", file, path, issues);
    if (stateValue !== undefined && !isSyntheticShipmentState(stateValue)) {
      addIssue(
        issues,
        file,
        childPath(path, "publicState"),
        "INVALID_ENUM",
        "State is outside the approved synthetic vocabulary.",
      );
    }
    checkSyntheticText(record, "recordLabel", file, path, issues);
    validateHistory(
      record["history"],
      isSyntheticShipmentState(stateValue) ? stateValue : undefined,
      file,
      childPath(path, "history"),
      childPath(path, "publicState"),
      issues,
    );
    validateTransitionCase(
      record["transitionCase"],
      file,
      childPath(path, "transitionCase"),
      issues,
    );
  });
}

function validateTrackingEvents(
  value: unknown,
  file: string,
  issues: FixtureValidationIssue[],
): void {
  const records = validateRootArray(value, file, issues);
  if (records === undefined) {
    return;
  }
  checkUniqueIds(records, file, issues);
  records.forEach((item, index) => {
    const path = itemPath("$", index);
    const record = checkRecord(item, file, path, issues);
    if (record === undefined) {
      return;
    }
    checkExactKeys(
      record,
      ["id", "shipmentId", "eventType", "timestamp", "sanitizedMessage"],
      file,
      path,
      issues,
    );
    checkDemoIdentifier(record, "id", file, path, issues);
    checkDemoIdentifier(record, "shipmentId", file, path, issues);
    const eventType = getString(record, "eventType", file, path, issues);
    if (
      eventType !== undefined &&
      !isSyntheticTrackingEventType(eventType)
    ) {
      addIssue(
        issues,
        file,
        childPath(path, "eventType"),
        "INVALID_ENUM",
        "Event type is outside the approved synthetic vocabulary.",
      );
    }
    checkTimestampValue(
      record["timestamp"],
      file,
      childPath(path, "timestamp"),
      issues,
    );
    checkSyntheticText(record, "sanitizedMessage", file, path, issues);
  });
}

function permittedFieldsForCategory(category: string): readonly string[] {
  switch (category) {
    case "operational_summary":
      return OPERATIONAL_SUMMARY_FIELDS;
    case "shipment_status":
      return SHIPMENT_STATUS_FIELDS;
    case "financial_status_reference":
      return FINANCIAL_REFERENCE_FIELDS;
    default:
      return [];
  }
}

function validateInternalQueryRequests(
  value: unknown,
  file: string,
  issues: FixtureValidationIssue[],
): void {
  const records = validateRootArray(value, file, issues);
  if (records === undefined) {
    return;
  }
  checkUniqueIds(records, file, issues);
  records.forEach((item, index) => {
    const path = itemPath("$", index);
    const record = checkRecord(item, file, path, issues);
    if (record === undefined) {
      return;
    }
    checkExactKeys(
      record,
      ["id", "actor", "category", "scope", "requestedFields", "expectedAllowed"],
      file,
      path,
      issues,
    );
    checkDemoIdentifier(record, "id", file, path, issues);
    const actor = getString(record, "actor", file, path, issues);
    if (actor !== undefined && !isSyntheticActor(actor)) {
      addIssue(
        issues,
        file,
        childPath(path, "actor"),
        "INVALID_ENUM",
        "Actor is outside the approved synthetic vocabulary.",
      );
    }
    const category = getString(record, "category", file, path, issues);
    if (category !== undefined && !isSyntheticQueryCategory(category)) {
      addIssue(
        issues,
        file,
        childPath(path, "category"),
        "INVALID_ENUM",
        "Query category is outside the approved synthetic vocabulary.",
      );
    }
    const scope = checkDemoIdentifier(record, "scope", file, path, issues);
    const requestedFields = checkStringArray(
      record["requestedFields"],
      file,
      childPath(path, "requestedFields"),
      issues,
    );
    if (requestedFields !== undefined && category !== undefined) {
      const allowed = new Set([
        ...permittedFieldsForCategory(category),
        ...DELIBERATELY_DENIED_REQUEST_FIELDS,
      ]);
      requestedFields.forEach((field, fieldIndex) => {
        if (!allowed.has(field)) {
          addIssue(
            issues,
            file,
            itemPath(childPath(path, "requestedFields"), fieldIndex),
            "INVALID_ENUM",
            "Requested field is outside the documented category schema.",
          );
        }
      });
    }
    checkBoolean(record, "expectedAllowed", file, path, issues);
    const expectedAllowed = record["expectedAllowed"];
    if (
      isSyntheticActor(actor) &&
      isSyntheticQueryCategory(category) &&
      scope !== undefined &&
      SYNTHETIC_IDENTIFIER_PATTERN.test(scope) &&
      requestedFields !== undefined &&
      typeof expectedAllowed === "boolean" &&
      expectedAllowed !==
        evaluateScopedInternalQuery({
          actor,
          category,
          scope,
          requestedFields,
        }).allowed
    ) {
      addIssue(
        issues,
        file,
        childPath(path, "expectedAllowed"),
        "INVALID_STRUCTURE",
        "Expected query outcome does not match the public synthetic boundary.",
      );
    }
  });
}

function validateFinancialStatusReferences(
  value: unknown,
  file: string,
  issues: FixtureValidationIssue[],
): void {
  const records = validateRootArray(value, file, issues);
  if (records === undefined) {
    return;
  }
  checkUniqueIds(records, file, issues);
  records.forEach((item, index) => {
    const path = itemPath("$", index);
    const record = checkRecord(item, file, path, issues);
    if (record === undefined) {
      return;
    }
    checkExactKeys(
      record,
      ["id", "scope", "referenceStatus", "referenceDate", "label"],
      file,
      path,
      issues,
    );
    checkDemoIdentifier(record, "id", file, path, issues);
    checkDemoIdentifier(record, "scope", file, path, issues);
    checkSyntheticText(record, "referenceStatus", file, path, issues);
    checkTimestampValue(
      record["referenceDate"],
      file,
      childPath(path, "referenceDate"),
      issues,
    );
    checkSyntheticText(record, "label", file, path, issues);
  });
}

function validateClosedSchema(
  fixture: SyntheticFixtureFilename,
  value: unknown,
  issues: FixtureValidationIssue[],
): void {
  switch (fixture) {
    case "actors.json":
      validateActors(value, fixture, issues);
      return;
    case "accounts.json":
      validateAccounts(value, fixture, issues);
      return;
    case "shipments.json":
      validateShipments(value, fixture, issues);
      return;
    case "tracking-events.json":
      validateTrackingEvents(value, fixture, issues);
      return;
    case "internal-query-requests.json":
      validateInternalQueryRequests(value, fixture, issues);
      return;
    case "financial-status-references.json":
      validateFinancialStatusReferences(value, fixture, issues);
  }
}

export function validateSyntheticFixtureValue(
  fixtureName: string,
  value: unknown,
): FixtureValidationReport {
  const file = safeFilename(fixtureName);
  const issues: FixtureValidationIssue[] = [];
  if (!isFixtureFilename(file)) {
    addIssue(
      issues,
      file,
      "$",
      "UNKNOWN_FIXTURE",
      "Filename is not one of the six approved synthetic fixture files.",
    );
    return { valid: false, filesChecked: 1, issues };
  }

  scanGeneralSafety(value, file, "$", issues);
  validateClosedSchema(file, value, issues);
  return { valid: issues.length === 0, filesChecked: 1, issues };
}

export function validateSyntheticFixtureText(
  fixtureName: string,
  text: string,
): FixtureValidationReport {
  const file = safeFilename(fixtureName);
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    const issue: FixtureValidationIssue = {
      code: "INVALID_JSON",
      file,
      path: "$",
      message: "File does not contain valid JSON; source content is not displayed.",
    };
    return { valid: false, filesChecked: 1, issues: [issue] };
  }
  return validateSyntheticFixtureValue(file, value);
}

export async function validateSyntheticFixtureDirectory(
  directory: string = DEFAULT_FIXTURE_DIRECTORY,
): Promise<FixtureValidationReport> {
  const issues: FixtureValidationIssue[] = [];
  let entries: readonly string[] = [];
  try {
    entries = (await readdir(directory)).sort();
  } catch {
    addIssue(
      issues,
      safeFilename(directory),
      "$",
      "READ_FAILED",
      "Synthetic fixture directory could not be read.",
    );
    return { valid: false, filesChecked: 0, issues };
  }

  for (const entry of entries) {
    if (!isFixtureFilename(entry)) {
      addIssue(
        issues,
        safeFilename(entry),
        "$",
        "UNEXPECTED_FILE",
        "Unexpected directory entry is outside the exact six-file fixture manifest.",
      );
    }
  }

  for (const fixture of SYNTHETIC_FIXTURE_FILENAMES) {
    if (!entries.includes(fixture)) {
      addIssue(
        issues,
        fixture,
        "$",
        "MISSING_FILE",
        "Required synthetic fixture file is missing.",
      );
      continue;
    }

    try {
      const fixtureMetadata = await lstat(join(directory, fixture));
      if (!fixtureMetadata.isFile()) {
        addIssue(
          issues,
          fixture,
          "$",
          "INVALID_TYPE",
          "Required synthetic fixture entry must be a regular file.",
        );
      }
    } catch {
      addIssue(
        issues,
        fixture,
        "$",
        "READ_FAILED",
        "Required synthetic fixture entry metadata could not be read.",
      );
    }
  }

  if (issues.length > 0) {
    return {
      valid: false,
      filesChecked: 0,
      issues,
    };
  }

  for (const fixture of SYNTHETIC_FIXTURE_FILENAMES) {
    let text: string;
    try {
      text = await readFile(join(directory, fixture), "utf8");
    } catch {
      addIssue(
        issues,
        fixture,
        "$",
        "READ_FAILED",
        "Required synthetic fixture file could not be read.",
      );
      continue;
    }
    issues.push(...validateSyntheticFixtureText(fixture, text).issues);
  }

  return {
    valid: issues.length === 0,
    filesChecked: SYNTHETIC_FIXTURE_FILENAMES.length,
    issues,
  };
}
