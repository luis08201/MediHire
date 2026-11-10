import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { isSubmissionId, writeSubmission } from "../src/lib/forms/submissions";
import { renderMarkdown } from "../src/lib/markdown";

test("submission ids must be uuids before any file is written", () => {
  assert.equal(isSubmissionId("11111111-1111-4111-8111-111111111111"), true);
  assert.equal(isSubmissionId("../../content/jobs"), false);
  const previous = process.env.SUBMISSIONS_DIR;
  process.env.SUBMISSIONS_DIR = mkdtempSync(path.join(tmpdir(), "mh-sub-"));
  assert.throws(() =>
    writeSubmission({
      id: "../../content/jobs",
      type: "staffing-request",
      createdAt: new Date().toISOString(),
      testMode: true,
      delivery: "not-configured",
      fingerprint: "abc",
      payload: {},
    }),
  );
  if (previous === undefined) delete process.env.SUBMISSIONS_DIR;
  else process.env.SUBMISSIONS_DIR = previous;
});

test("markdown links allow only http addresses and site paths", () => {
  const html = renderMarkdown(
    '[Site](/careers) and [Web](https://example.com/a) and [Script](javascript:alert(1)) and [Proto](//evil.example) and [Break](https://evil.example/"onclick="alert(1))',
  );
  assert.match(html, /href="\/careers"/);
  assert.match(html, /href="https:\/\/example.com\/a"/);
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
  assert.deepEqual(hrefs, ["/careers", "https://example.com/a"]);
  assert.equal(/href="javascript:/i.test(html), false);
  assert.equal(html.includes("<script"), false);
});
