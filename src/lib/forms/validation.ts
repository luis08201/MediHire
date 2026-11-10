import { copy, fill } from "@/i18n/en";

const freeDomains = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "live.com",
  "msn.com",
  "me.com",
  "gmx.com",
  "mail.com",
]);

export type FieldErrors = Record<string, string>;

export function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
}

export function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160;
}

export function workEmailError(value: string) {
  if (!validEmail(value)) return copy.errors.email;
  const domain = value.split("@")[1]?.toLowerCase() ?? "";
  if (freeDomains.has(domain)) return copy.errors.workEmail;
  return null;
}

export function phoneError(value: string) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return copy.errors.phone;
  return null;
}

export function lengthError(value: string, label: string, min: number, max: number) {
  if (!value) return fill(copy.errors.required, { label });
  if (value.length < min) return fill(copy.errors.minLength, { min: String(min) });
  if (value.length > max) return fill(copy.errors.maxLength, { max: String(max) });
  return null;
}

const allowedCv = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function cvError(file: File | null) {
  if (!file || file.size === 0) return copy.errors.fileRequired;
  const extension = file.name.toLowerCase().split(".").pop() ?? "";
  const extensionOk = ["pdf", "doc", "docx"].includes(extension);
  if (!allowedCv.has(file.type) && !extensionOk) return copy.errors.fileType;
  if (file.size > 5 * 1024 * 1024) return copy.errors.fileSize;
  return null;
}

export function spamTimingError(issuedAt: string, now = Date.now()) {
  const issued = Number(issuedAt);
  if (!Number.isFinite(issued)) return copy.errors.expiredForm;
  const age = now - issued;
  if (age < 2000) return copy.errors.tooFast;
  if (age > 12 * 60 * 60 * 1000) return copy.errors.expiredForm;
  return null;
}

export function submissionHash(parts: string[]) {
  return parts.map((part) => part.trim().toLowerCase().replace(/\s+/g, " ")).join("|");
}
