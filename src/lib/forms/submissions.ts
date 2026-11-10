import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

export type SubmissionRecord = {
  id: string;
  type: "staffing-request" | "application";
  createdAt: string;
  testMode: boolean;
  delivery: "not-configured" | "delivered" | "failed";
  fingerprint: string;
  payload: Record<string, unknown>;
};

const SUBMISSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isSubmissionId(value: string) {
  return SUBMISSION_ID.test(value);
}

function rootDir() {
  return process.env.SUBMISSIONS_DIR || path.join(process.cwd(), "data", "submissions");
}

function ensure() {
  mkdirSync(rootDir(), { recursive: true });
  mkdirSync(path.join(rootDir(), "files"), { recursive: true });
}

function containedPath(id: string, ...segments: string[]) {
  if (!isSubmissionId(id)) throw new Error("Invalid submission id");
  const root = path.resolve(rootDir());
  const file = path.resolve(root, ...segments);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error("Invalid submission path");
  return file;
}

function recordPath(id: string) {
  return containedPath(id, `${id}.json`);
}

export function readSubmission(id: string): SubmissionRecord | null {
  const file = recordPath(id);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as SubmissionRecord;
}

export function writeSubmission(record: SubmissionRecord) {
  ensure();
  writeFileSync(recordPath(record.id), `${JSON.stringify(record, null, 2)}\n`, "utf8");
}

export function listSubmissions() {
  ensure();
  return readdirSync(rootDir())
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(path.join(rootDir(), name), "utf8")) as SubmissionRecord);
}

export function findDuplicate(fingerprint: string, withinMs: number, now = Date.now()) {
  return listSubmissions().find((record) => {
    if (record.fingerprint !== fingerprint) return false;
    return now - new Date(record.createdAt).getTime() < withinMs;
  });
}

export function rateLimited(ip: string, now = Date.now()) {
  ensure();
  const file = path.join(rootDir(), "rate-limit.json");
  const windowMs = 60 * 60 * 1000;
  const current = existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as Record<string, number[]>) : {};
  const recent = (current[ip] ?? []).filter((stamp) => now - stamp < windowMs);
  recent.push(now);
  current[ip] = recent;
  writeFileSync(file, JSON.stringify(current));
  return recent.length > 8;
}

export async function saveCv(id: string, file: File) {
  ensure();
  const extension = (file.name.toLowerCase().split(".").pop() || "bin").replace(/[^a-z0-9]/g, "");
  const safe = ["pdf", "doc", "docx"].includes(extension) ? extension : "bin";
  const filename = `${id}.${safe}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  writeFileSync(containedPath(id, "files", filename), bytes);
  return filename;
}

export function fingerprint(parts: string[]) {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export async function deliver(record: SubmissionRecord) {
  const webhook = process.env.FORM_WEBHOOK_URL;
  if (!webhook) return { testMode: true, delivery: "not-configured" as const };
  const response = await fetch(webhook, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.FORM_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.FORM_WEBHOOK_TOKEN}` } : {}),
    },
    body: JSON.stringify({
      id: record.id,
      type: record.type,
      createdAt: record.createdAt,
      payload: record.payload,
    }),
  });
  if (!response.ok) return { testMode: false, delivery: "failed" as const };
  return { testMode: false, delivery: "delivered" as const };
}
