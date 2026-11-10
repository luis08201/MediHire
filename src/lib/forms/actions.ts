"use server";

import { headers } from "next/headers";
import { copy } from "@/i18n/en";
import { getJob, listLocations, listServices } from "../cms/queries";
import { applicationIsOpen } from "../format";
import { cleanText, cvError, lengthError, phoneError, spamTimingError, validEmail, workEmailError } from "./validation";
import { deliver, findDuplicate, fingerprint, isSubmissionId, rateLimited, readSubmission, saveCv, writeSubmission, type SubmissionRecord } from "./submissions";

export type FormState = {
  ok: boolean;
  testMode?: boolean;
  id?: string;
  message?: string;
  errors: Record<string, string>;
  values: Record<string, string>;
};

function clientIp(headerList: Headers) {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headerList.get("x-real-ip") || "unknown";
}

function valuesFrom(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, cleanText(formData.get(key))]));
}

async function guard(formData: FormData): Promise<string | null> {
  if (cleanText(formData.get("company_url"))) return copy.errors.honeypot;
  const timing = spamTimingError(cleanText(formData.get("issued_at")));
  if (timing) return timing;
  const headerList = await headers();
  if (rateLimited(clientIp(headerList))) return copy.errors.rate;
  return null;
}

async function accept(record: Omit<SubmissionRecord, "testMode" | "delivery">): Promise<FormState> {
  const existing = readSubmission(record.id);
  if (existing) {
    if (existing.fingerprint !== record.fingerprint) {
      return { ok: false, errors: { form: copy.errors.generic }, values: {}, message: copy.errors.generic };
    }
    return {
      ok: true,
      id: existing.id,
      testMode: existing.testMode,
      message: existing.type === "application" ? copy.apply.successBody : copy.contact.successBody,
      errors: {},
      values: {},
    };
  }
  const duplicate = findDuplicate(record.fingerprint, 48 * 60 * 60 * 1000);
  if (duplicate && duplicate.id !== record.id) {
    return { ok: false, errors: { form: copy.errors.duplicate }, values: {}, message: copy.errors.duplicate };
  }
  const provisional: SubmissionRecord = { ...record, testMode: true, delivery: "not-configured" };
  const delivery = await deliver(provisional);
  if (delivery.delivery === "failed") {
    return { ok: false, errors: { form: copy.errors.delivery }, values: {}, message: copy.errors.delivery };
  }
  writeSubmission({ ...provisional, testMode: delivery.testMode, delivery: delivery.delivery });
  return {
    ok: true,
    id: record.id,
    testMode: delivery.testMode,
    errors: {},
    values: {},
  };
}

export async function submitStaffing(_previous: FormState, formData: FormData): Promise<FormState> {
  const keys = ["organization", "name", "email", "phone", "specialty", "location", "service", "needs"];
  const values = valuesFrom(formData, keys);
  const errors: Record<string, string> = {};
  const organization = lengthError(values.organization, copy.contact.organization, 2, 120);
  if (organization) errors.organization = organization;
  const name = lengthError(values.name, copy.contact.name, 2, 80);
  if (name) errors.name = name;
  const email = workEmailError(values.email);
  if (email) errors.email = email;
  const phone = phoneError(values.phone);
  if (phone) errors.phone = phone;
  if (!values.specialty) errors.specialty = copy.errors.required.replace("{label}", copy.contact.specialty);
  const knownLocation = listLocations().some((location) => location.slug === values.location) || values.location === "other";
  if (!values.location || !knownLocation) errors.location = copy.errors.required.replace("{label}", copy.contact.location);
  if (values.service && !listServices().some((service) => service.slug === values.service)) errors.service = copy.errors.generic;
  const needs = lengthError(values.needs, copy.contact.needs, 20, 2000);
  if (needs) errors.needs = needs;
  const blocked = await guard(formData);
  if (blocked) errors.form = blocked;
  if (Object.keys(errors).length) {
    return { ok: false, errors, values, message: copy.contact.errorSummary };
  }
  const id = cleanText(formData.get("submission_id"));
  if (!isSubmissionId(id)) {
    return { ok: false, errors: { form: copy.errors.generic }, values, message: copy.contact.errorSummary };
  }
  const result = await accept({
    id,
    type: "staffing-request",
    createdAt: new Date().toISOString(),
    fingerprint: fingerprint(["staffing", values.email, values.organization, values.specialty, values.location, values.needs]),
    payload: values,
  });
  return result.ok ? result : { ...result, values };
}

export async function submitApplication(_previous: FormState, formData: FormData): Promise<FormState> {
  const keys = ["job", "name", "email", "phone", "location", "credential", "note"];
  const values = valuesFrom(formData, keys);
  const errors: Record<string, string> = {};
  const job = getJob(values.job);
  if (!job || !applicationIsOpen(job)) errors.form = copy.errors.closed;
  const name = lengthError(values.name, copy.apply.name, 2, 80);
  if (name) errors.name = name;
  if (!validEmail(values.email)) errors.email = copy.errors.email;
  const phone = phoneError(values.phone);
  if (phone) errors.phone = phone;
  const location = lengthError(values.location, copy.apply.location, 2, 120);
  if (location) errors.location = location;
  const credential = lengthError(values.credential, copy.apply.credential, 2, 120);
  if (credential) errors.credential = credential;
  if (values.note.length > 600) errors.note = copy.errors.maxLength.replace("{max}", "600");
  if (cleanText(formData.get("consent")) !== "yes") errors.consent = copy.errors.consent;
  const file = formData.get("cv");
  const cv = cvError(file instanceof File ? file : null);
  if (cv) errors.cv = cv;
  const blocked = await guard(formData);
  if (blocked) errors.form = blocked;
  if (Object.keys(errors).length) {
    return { ok: false, errors, values, message: copy.apply.errorSummary };
  }
  const id = cleanText(formData.get("submission_id"));
  if (!isSubmissionId(id)) {
    return { ok: false, errors: { form: copy.errors.generic }, values, message: copy.apply.errorSummary };
  }
  const result = await accept({
    id,
    type: "application",
    createdAt: new Date().toISOString(),
    fingerprint: fingerprint(["application", values.job, values.email, values.name]),
    payload: { ...values, cv: "pending" },
  });
  if (!result.ok) return { ...result, values };
  const filename = await saveCv(id, file as File);
  const saved = readSubmission(id);
  if (saved) writeSubmission({ ...saved, payload: { ...saved.payload, cv: filename } });
  return result;
}
