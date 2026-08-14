import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  SYNTHETIC_FIXTURE_FILENAMES,
  validateSyntheticFixtureDirectory,
  validateSyntheticFixtureText,
  validateSyntheticFixtureValue,
  type FixtureValidationCode,
  type FixtureValidationReport,
} from "../src/synthetic-fixture-validator.js";

const FIXTURE_DIRECTORY = fileURLToPath(
  new URL("../../fixtures/synthetic/", import.meta.url),
);

function actorRecord(
  overrides: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
    id: "demo-actor-test-a",
    actor: "customer",
    scope: "demo-scope-test-a",
    displayLabel: "Demo Customer Context T",
    ...overrides,
  };
}

function trackingRecord(
  overrides: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
    id: "demo-event-test-a",
    shipmentId: "demo-shipment-test-a",
    eventType: "received",
    timestamp: "2030-07-01T10:00:00Z",
    sanitizedMessage: "Demo event received",
    ...overrides,
  };
}

function shipmentRecord(
  overrides: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
    id: "demo-shipment-test-a",
    accountId: "demo-account-test-a",
    scope: "demo-scope-test-a",
    publicState: "verified",
    recordLabel: "Demo operational record",
    history: [
      { state: "intake", timestamp: "2030-07-01T09:00:00Z" },
      { state: "verified", timestamp: "2030-07-01T10:00:00Z" },
    ],
    transitionCase: {
      id: "demo-transition-test-a",
      fromState: "verified",
      toState: "prepared",
      timestamp: "2030-07-01T11:00:00Z",
      expectedAllowed: true,
    },
    ...overrides,
  };
}

function completeShipmentHistory(): readonly Record<string, unknown>[] {
  return [
    { state: "intake", timestamp: "2030-07-01T09:00:00Z" },
    { state: "verified", timestamp: "2030-07-01T10:00:00Z" },
    { state: "prepared", timestamp: "2030-07-01T11:00:00Z" },
    { state: "in_transit", timestamp: "2030-07-01T12:00:00Z" },
    { state: "available", timestamp: "2030-07-01T13:00:00Z" },
    { state: "completed", timestamp: "2030-07-01T14:00:00Z" },
  ];
}

async function withTemporaryFixtureDirectory(
  run: (fixtureDirectory: string, rootDirectory: string) => Promise<void>,
): Promise<void> {
  const rootDirectory = await mkdtemp(
    join(tmpdir(), "lem-box-synthetic-fixtures-"),
  );
  const fixtureDirectory = join(rootDirectory, "synthetic");
  await mkdir(fixtureDirectory);

  try {
    await Promise.all(
      SYNTHETIC_FIXTURE_FILENAMES.map(async (fixture) => {
        const source = new URL(
          `../../fixtures/synthetic/${fixture}`,
          import.meta.url,
        );
        await writeFile(join(fixtureDirectory, fixture), await readFile(source));
      }),
    );
    await run(fixtureDirectory, rootDirectory);
  } finally {
    await rm(rootDirectory, { recursive: true, force: true });
  }
}

function hasCode(
  report: FixtureValidationReport,
  code: FixtureValidationCode,
): boolean {
  return report.issues.some((issue) => issue.code === code);
}

describe("synthetic fixture validator", () => {
  it("accepts a valid fixture document", () => {
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord(),
    ]);

    expect(report.valid).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it("validates all six versioned fixture files", async () => {
    const report = await validateSyntheticFixtureDirectory(FIXTURE_DIRECTORY);

    expect(report.filesChecked).toBe(SYNTHETIC_FIXTURE_FILENAMES.length);
    expect(report.valid).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it("rejects an identifier without the demo namespace", () => {
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord({ id: "actor-test-a" }),
    ]);

    expect(report.valid).toBe(false);
    expect(hasCode(report, "INVALID_IDENTIFIER")).toBe(true);
  });

  it("rejects a normalized case-insensitive prohibited key", () => {
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord({ E_MaIl: "Demo withheld value" }),
    ]);

    expect(hasCode(report, "FORBIDDEN_KEY")).toBe(true);
    expect(
      report.issues.some(
        (issue) => issue.path === "$[0].<unapproved-key>",
      ),
    ).toBe(true);
  });

  it("does not echo an unsafe key in diagnostics", () => {
    const sensitiveKey = ["person", "example.test"].join("@");
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord({ [sensitiveKey]: "Demo withheld value" }),
    ]);

    expect(hasCode(report, "UNKNOWN_KEY")).toBe(true);
    expect(JSON.stringify(report.issues)).not.toContain(sensitiveKey);
  });

  it("rejects an email-shaped string even when it is synthetic", () => {
    const syntheticEmail = ["demo", "example.test"].join("@");
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord({ displayLabel: `Demo Customer Context ${syntheticEmail}` }),
    ]);

    expect(hasCode(report, "SUSPICIOUS_VALUE")).toBe(true);
  });

  it("rejects a token-shaped string", () => {
    const tokenLikeValue = `sk_${"x".repeat(24)}`;
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord({ note: tokenLikeValue }),
    ]);

    expect(hasCode(report, "SUSPICIOUS_VALUE")).toBe(true);
  });

  it("does not exempt suspicious identifiers that start with demo", () => {
    const suspiciousIdentifiers = [
      `demo-${"Q".repeat(88)}`,
      `demo-1Z${"A1".repeat(8)}`,
    ];

    for (const id of suspiciousIdentifiers) {
      const report = validateSyntheticFixtureValue("actors.json", [
        actorRecord({ id }),
      ]);
      expect(hasCode(report, "SUSPICIOUS_VALUE")).toBe(true);
    }
  });

  it("accepts a descriptive lowercase identifier in the demo namespace", () => {
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord({ id: "demo-actor-customer-context-2030-a" }),
    ]);

    expect(report.valid).toBe(true);
  });

  it("rejects arbitrary names hidden behind a synthetic prefix", () => {
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord({ displayLabel: "Demo Example Person" }),
    ]);

    expect(hasCode(report, "INVALID_SYNTHETIC_TEXT")).toBe(true);
  });

  it("accepts the documented unsuffixed demo reference label", () => {
    const report = validateSyntheticFixtureValue(
      "financial-status-references.json",
      [
        {
          id: "demo-financial-reference-test-a",
          scope: "demo-scope-test-a",
          referenceStatus: "Demo reference pending",
          referenceDate: "2030-07-01T10:00:00Z",
          label: "Demo financial reference",
        },
      ],
    );

    expect(report.valid).toBe(true);
  });

  it("rejects expected outcomes that contradict the public examples", () => {
    const shipmentReport = validateSyntheticFixtureValue("shipments.json", [
      {
        id: "demo-shipment-test-a",
        accountId: "demo-account-test-a",
        scope: "demo-scope-test-a",
        publicState: "completed",
        recordLabel: "Demo operational record",
        history: [
          {
            state: "completed",
            timestamp: "2030-07-01T10:00:00Z",
          },
        ],
        transitionCase: {
          id: "demo-transition-test-a",
          fromState: "completed",
          toState: "prepared",
          timestamp: "2030-07-01T10:30:00Z",
          expectedAllowed: true,
        },
      },
    ]);
    const queryReport = validateSyntheticFixtureValue(
      "internal-query-requests.json",
      [
        {
          id: "demo-query-test-a",
          actor: "customer",
          category: "shipment_status",
          scope: "demo-scope-test-a",
          requestedFields: ["publicState"],
          expectedAllowed: true,
        },
      ],
    );

    expect(hasCode(shipmentReport, "INVALID_STRUCTURE")).toBe(true);
    expect(hasCode(queryReport, "INVALID_STRUCTURE")).toBe(true);
  });

  it("rejects a timestamp outside the documented window", () => {
    const report = validateSyntheticFixtureValue("tracking-events.json", [
      trackingRecord({ timestamp: "2029-12-31T23:59:59Z" }),
    ]);

    expect(hasCode(report, "INVALID_TIMESTAMP")).toBe(true);
  });

  it("rejects unknown fields under a closed schema", () => {
    const report = validateSyntheticFixtureValue("actors.json", [
      actorRecord({ undocumentedField: "Demo extra value" }),
    ]);

    expect(hasCode(report, "UNKNOWN_KEY")).toBe(true);
  });

  it("detects phone, URL, card, account, tracking, encoded, and PEM patterns", () => {
    const suspiciousValues = [
      ["+1", "555", "010", "9999"].join(" "),
      ["https", "://", "private.invalid", "/record"].join(""),
      ["4111", "1111", "1111", "1111"].join(" "),
      `acct-${"7".repeat(12)}`,
      `1Z${"A1".repeat(8)}`,
      "Q".repeat(88),
      ["-----BEGIN", " PRIVATE KEY-----"].join(""),
    ];

    for (const suspiciousValue of suspiciousValues) {
      const report = validateSyntheticFixtureValue("actors.json", [
        actorRecord({ note: suspiciousValue }),
      ]);
      expect(hasCode(report, "SUSPICIOUS_VALUE")).toBe(true);
    }
  });

  it("reports malformed JSON without echoing source content", () => {
    const privateLookingMarker = ["not", "for", "diagnostics"].join("-");
    const report = validateSyntheticFixtureText(
      "actors.json",
      `[{"id":"${privateLookingMarker}"`,
    );

    expect(hasCode(report, "INVALID_JSON")).toBe(true);
    expect(JSON.stringify(report.issues)).not.toContain(privateLookingMarker);
  });

  it.each([
    "extra.json",
    "extra.txt",
    ".DS_Store",
    ".env",
    "backup.json",
    "backup.json~",
    "backup",
    "unexpected.JSON",
  ])("rejects unexpected manifest entry %s", async (entry) => {
    await withTemporaryFixtureDirectory(async (fixtureDirectory) => {
      await writeFile(join(fixtureDirectory, entry), "Not fixture content.\n");

      const report = await validateSyntheticFixtureDirectory(fixtureDirectory);

      expect(hasCode(report, "UNEXPECTED_FILE")).toBe(true);
      expect(report.filesChecked).toBe(0);
    });
  });

  it("rejects a missing required fixture", async () => {
    await withTemporaryFixtureDirectory(async (fixtureDirectory) => {
      await rm(join(fixtureDirectory, "actors.json"));

      const report = await validateSyntheticFixtureDirectory(fixtureDirectory);

      expect(
        report.issues.some(
          (issue) =>
            issue.code === "MISSING_FILE" && issue.file === "actors.json",
        ),
      ).toBe(true);
      expect(report.filesChecked).toBe(0);
    });
  });

  it("rejects a required filename with different case", async () => {
    await withTemporaryFixtureDirectory(async (fixtureDirectory) => {
      await rename(
        join(fixtureDirectory, "actors.json"),
        join(fixtureDirectory, "Actors.json"),
      );

      const report = await validateSyntheticFixtureDirectory(fixtureDirectory);

      expect(hasCode(report, "MISSING_FILE")).toBe(true);
      expect(hasCode(report, "UNEXPECTED_FILE")).toBe(true);
    });
  });

  it("rejects an unexpected subdirectory", async () => {
    await withTemporaryFixtureDirectory(async (fixtureDirectory) => {
      await mkdir(join(fixtureDirectory, "archive"));

      const report = await validateSyntheticFixtureDirectory(fixtureDirectory);

      expect(hasCode(report, "UNEXPECTED_FILE")).toBe(true);
    });
  });

  it("rejects an unexpected extensionless symlink", async () => {
    await withTemporaryFixtureDirectory(async (fixtureDirectory) => {
      await symlink("actors.json", join(fixtureDirectory, "actor-alias"));

      const report = await validateSyntheticFixtureDirectory(fixtureDirectory);

      expect(hasCode(report, "UNEXPECTED_FILE")).toBe(true);
    });
  });

  it("requires an expected fixture entry to be a regular file", async () => {
    await withTemporaryFixtureDirectory(
      async (fixtureDirectory, rootDirectory) => {
        const approvedPath = join(fixtureDirectory, "actors.json");
        const targetPath = join(rootDirectory, "actors-target.json");
        await writeFile(targetPath, await readFile(approvedPath));
        await rm(approvedPath);
        await symlink("../actors-target.json", approvedPath);

        const report = await validateSyntheticFixtureDirectory(
          fixtureDirectory,
        );

        expect(
          report.issues.some(
            (issue) =>
              issue.code === "INVALID_TYPE" && issue.file === "actors.json",
          ),
        ).toBe(true);
        expect(report.filesChecked).toBe(0);
      },
    );
  });

  it("returns deterministic safe manifest diagnostics", async () => {
    await withTemporaryFixtureDirectory(async (fixtureDirectory) => {
      const unsafeFilename = ["private", "example.test"].join("@");
      await writeFile(join(fixtureDirectory, unsafeFilename), "Not fixture content.\n");
      await writeFile(join(fixtureDirectory, ".env"), "Not fixture content.\n");

      const first = await validateSyntheticFixtureDirectory(fixtureDirectory);
      const second = await validateSyntheticFixtureDirectory(fixtureDirectory);

      expect(first).toEqual(second);
      expect(first.issues.filter((issue) => issue.code === "UNEXPECTED_FILE"))
        .toHaveLength(2);
      expect(JSON.stringify(first.issues)).not.toContain(unsafeFilename);
    });
  });

  it("does not modify any valid fixture file", async () => {
    const fileUrls = SYNTHETIC_FIXTURE_FILENAMES.map(
      (fixture) =>
        new URL(`../../fixtures/synthetic/${fixture}`, import.meta.url),
    );
    const before = await Promise.all(fileUrls.map(async (url) => readFile(url)));

    const report = await validateSyntheticFixtureDirectory(FIXTURE_DIRECTORY);
    const after = await Promise.all(fileUrls.map(async (url) => readFile(url)));

    expect(report.valid).toBe(true);
    after.forEach((content, index) => {
      const original = before[index];
      expect(original).toBeDefined();
      if (original === undefined) {
        throw new Error("Fixture comparison input is missing.");
      }
      expect(content.equals(original)).toBe(true);
    });
  });
});

describe("synthetic shipment history validation", () => {
  it("accepts a complete history that follows the public lifecycle", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        publicState: "completed",
        history: completeShipmentHistory(),
      }),
    ]);

    expect(report.valid).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it("accepts non-decreasing equal timestamps", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        history: [
          { state: "intake", timestamp: "2030-07-01T10:00:00Z" },
          { state: "verified", timestamp: "2030-07-01T10:00:00Z" },
        ],
      }),
    ]);

    expect(report.valid).toBe(true);
  });

  it("rejects a history that does not begin at intake", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        history: [
          { state: "verified", timestamp: "2030-07-01T10:00:00Z" },
        ],
      }),
    ]);

    expect(hasCode(report, "INVALID_STRUCTURE")).toBe(true);
  });

  it("rejects an intake to completed jump", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        publicState: "completed",
        history: [
          { state: "intake", timestamp: "2030-07-01T09:00:00Z" },
          { state: "completed", timestamp: "2030-07-01T10:00:00Z" },
        ],
      }),
    ]);

    expect(hasCode(report, "INVALID_STRUCTURE")).toBe(true);
  });

  it("rejects a final history state that differs from public state", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({ publicState: "completed" }),
    ]);

    expect(hasCode(report, "INVALID_STRUCTURE")).toBe(true);
  });

  it("rejects an unknown history state", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        history: [
          { state: "intake", timestamp: "2030-07-01T09:00:00Z" },
          { state: "unknown", timestamp: "2030-07-01T10:00:00Z" },
        ],
      }),
    ]);

    expect(hasCode(report, "INVALID_ENUM")).toBe(true);
  });

  it("rejects descending history timestamps", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        history: [
          { state: "intake", timestamp: "2030-07-01T10:00:00Z" },
          { state: "verified", timestamp: "2030-07-01T09:00:00Z" },
        ],
      }),
    ]);

    expect(hasCode(report, "INVALID_STRUCTURE")).toBe(true);
  });

  it("rejects a state after completed", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        history: [
          ...completeShipmentHistory(),
          { state: "verified", timestamp: "2030-07-01T15:00:00Z" },
        ],
      }),
    ]);

    expect(hasCode(report, "INVALID_STRUCTURE")).toBe(true);
  });

  it("accepts exception as a terminal state", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        publicState: "exception",
        history: [
          { state: "intake", timestamp: "2030-07-01T09:00:00Z" },
          { state: "exception", timestamp: "2030-07-01T10:00:00Z" },
        ],
      }),
    ]);

    expect(report.valid).toBe(true);
  });

  it("rejects a state after exception", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({
        history: [
          { state: "intake", timestamp: "2030-07-01T09:00:00Z" },
          { state: "exception", timestamp: "2030-07-01T10:00:00Z" },
          { state: "verified", timestamp: "2030-07-01T11:00:00Z" },
        ],
      }),
    ]);

    expect(hasCode(report, "INVALID_STRUCTURE")).toBe(true);
  });

  it("rejects an empty history", () => {
    const report = validateSyntheticFixtureValue("shipments.json", [
      shipmentRecord({ history: [] }),
    ]);

    expect(hasCode(report, "INVALID_STRUCTURE")).toBe(true);
  });

  it("does not mutate a rejected shipment document", () => {
    const shipment = shipmentRecord({
      publicState: "completed",
      history: [
        { state: "intake", timestamp: "2030-07-01T09:00:00Z" },
        { state: "completed", timestamp: "2030-07-01T10:00:00Z" },
      ],
    });
    const document = [shipment];
    const before = structuredClone(document);

    const report = validateSyntheticFixtureValue("shipments.json", document);

    expect(report.valid).toBe(false);
    expect(document).toEqual(before);
  });
});
