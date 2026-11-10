import { readCollection, readRedirects, writeCollection, writeRedirects } from "./store";
import { publicPath } from "./schema";
import type { CollectionName, EntryMap } from "./types";

export function getPath(entry: Record<string, unknown>, name: string) {
  const parts = name.split(".");
  let current: unknown = entry;
  for (const part of parts) {
    if (!current || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[part];
  }
  if (current === null || current === undefined) return "";
  if (typeof current === "boolean") return current ? "true" : "";
  return String(current);
}

export function setPath(entry: Record<string, unknown>, name: string, value: unknown) {
  const parts = name.split(".");
  let current = entry;
  for (const part of parts.slice(0, -1)) {
    const next = current[part];
    if (!next || typeof next !== "object") current[part] = {};
    current = current[part] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function applyFields(entry: Record<string, unknown>, fields: { name: string; type: string }[], formData: FormData) {
  for (const field of fields) {
    const raw = String(formData.get(field.name) ?? "").trim();
    if (field.type === "checkbox") {
      setPath(entry, field.name, raw === "true" || raw === "on");
      continue;
    }
    if (field.type === "number") {
      setPath(entry, field.name, raw === "" ? null : Number(raw));
      continue;
    }
    if (field.name === "address" || field.name === "application.url" || field.name === "publishedAt" || field.name === "closingDate") {
      setPath(entry, field.name, raw === "" ? null : raw);
      continue;
    }
    setPath(entry, field.name, raw);
  }
  const min = getPath(entry, "compensation.min");
  const max = getPath(entry, "compensation.max");
  const period = getPath(entry, "compensation.period");
  if ("compensation" in entry || min || max || period) {
    if (!min && !max) entry.compensation = null;
    else {
      entry.compensation = {
        min: Number(min || max || 0),
        max: Number(max || min || 0),
        currency: "USD",
        period: period === "year" ? "year" : "hour",
      };
    }
  }
}

export function validateEntry(collection: CollectionName, entry: Record<string, unknown>, fields: { name: string; label: string; required?: boolean; type: string }[]) {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (!field.required || field.name === "fieldsJson") continue;
    const value = getPath(entry, field.name);
    if (!value) errors[field.name] = `Enter ${field.label.toLowerCase()}.`;
  }
  if ("slug" in entry) {
    const slug = String(entry.slug ?? "");
    if (slug && !slugPattern.test(slug)) errors.slug = "Use lowercase letters, numbers, and hyphens.";
    const duplicate = readCollection(collection).find((item) => "slug" in item && item.slug === slug && item.id !== entry.id);
    if (duplicate) errors.slug = "That slug is already used in this collection.";
  }
  if (collection === "jobs" && entry.application && typeof entry.application === "object") {
    const application = entry.application as { mode?: string; url?: string | null };
    if (application.mode === "external" && !application.url) errors["application.url"] = "Enter the external application URL.";
  }
  return errors;
}

export function saveEntry<K extends CollectionName>(collection: K, entry: EntryMap[K], previousSlug?: string) {
  const entries = readCollection(collection);
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index === -1) entries.push(entry);
  else entries[index] = entry;
  writeCollection(collection, entries);
  if (previousSlug && "slug" in entry && previousSlug !== entry.slug) {
    const redirects = readRedirects();
    const source = publicPath(collection, { id: entry.id, slug: previousSlug });
    const destination = publicPath(collection, entry);
    if (source.startsWith("/") && source !== destination && !redirects.some((item) => item.source === source)) {
      redirects.push({ source, destination, permanent: true });
      writeRedirects(redirects);
    }
  }
}

export function deleteEntry(collection: CollectionName, id: string) {
  writeCollection(collection, readCollection(collection).filter((entry) => entry.id !== id));
}
