"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EDITOR_COOKIE, PREVIEW_COOKIE, cookieSecure, editorSecret, issueToken, previewSecret, readToken } from "@/lib/auth";
import { applyFields, deleteEntry, saveEntry, validateEntry } from "@/lib/cms/mutate";
import { blankEntry, editorFields, isCollection } from "@/lib/cms/schema";
import { readCollection } from "@/lib/cms/store";
import type { CollectionName } from "@/lib/cms/types";
import { exportCollections } from "@/lib/cms/export-content";

export async function requireEditor() {
  const jar = await cookies();
  const allowed = await readToken(jar.get(EDITOR_COOKIE)?.value, "editor", editorSecret());
  if (!allowed) redirect("/admin/login");
}

function passwordsMatch(input: string, secret: string) {
  const left = createHash("sha256").update(input).digest();
  const right = createHash("sha256").update(secret).digest();
  return timingSafeEqual(left, right);
}

function safeNext(value: string) {
  if (!value.startsWith("/admin") || value.startsWith("//") || value.startsWith("/admin/login")) return "/admin";
  return value;
}

export async function loginAction(_previous: { error: string }, formData: FormData) {
  const secret = editorSecret();
  if (!secret) return { error: "The editor password is not configured. Set CMS_EDITOR_PASSWORD and restart the server." };
  const password = String(formData.get("password") ?? "");
  if (!passwordsMatch(password, secret)) return { error: "That password was not accepted." };
  const token = await issueToken("editor", secret, 60 * 60 * 12);
  const jar = await cookies();
  jar.set(EDITOR_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect(safeNext(String(formData.get("next") ?? "/admin")));
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(EDITOR_COOKIE);
  redirect("/admin/login");
}

const requiredPages = new Set(["home", "about", "services", "contact", "careers", "team", "blog", "locations"]);

export async function saveEntryAction(_previous: { errors: Record<string, string> }, formData: FormData) {
  await requireEditor();
  const collection = String(formData.get("collection") ?? "");
  if (!isCollection(collection)) return { errors: { form: "Unknown collection." } };
  const requestedId = String(formData.get("id") ?? "").trim();
  const entries = readCollection(collection);
  const existing = entries.find((entry) => entry.id === requestedId);
  const entry = (existing ? structuredClone(existing) : blankEntry(collection, requestedId || crypto.randomUUID())) as Record<string, unknown>;
  if (collection === "pages") {
    const pageId = String(formData.get("entryId") ?? entry.id ?? "").trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pageId)) return { errors: { entryId: "Use a lowercase page id." } };
    entry.id = pageId;
  }
  const fields = editorFields(collection);
  applyFields(entry, fields, formData);
  if (collection === "pages") {
    try {
      const parsed = JSON.parse(String(entry.fieldsJson ?? ""));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("object");
      for (const value of Object.values(parsed)) {
        if (typeof value !== "string") throw new Error("string");
      }
      entry.fields = parsed;
      delete entry.fieldsJson;
    } catch {
      return { errors: { fieldsJson: "Enter a JSON object whose values are strings." } };
    }
  }
  const errors = validateEntry(collection, entry, fields);
  if (Object.keys(errors).length) return { errors };
  const previousSlug = String(formData.get("previousSlug") ?? "");
  saveEntry(collection, entry as never, previousSlug || undefined);
  redirect(`/admin/${collection}/${entry.id}?saved=1`);
}

export async function deleteEntryAction(formData: FormData) {
  await requireEditor();
  const collection = String(formData.get("collection") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!isCollection(collection) || !id) redirect("/admin");
  if (collection === "pages" && requiredPages.has(id)) redirect(`/admin/pages/${id}?saved=locked`);
  deleteEntry(collection, id);
  redirect(`/admin/${collection}`);
}

export async function previewAction(formData: FormData) {
  await requireEditor();
  const secret = previewSecret();
  const path = String(formData.get("path") ?? "/");
  if (!secret || !path.startsWith("/") || path.startsWith("//")) redirect("/admin");
  const token = await issueToken("preview", secret, 60 * 60 * 8);
  const jar = await cookies();
  jar.set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect(path);
}

export async function exportAction() {
  await requireEditor();
  exportCollections();
  redirect("/admin?exported=1");
}

export type EditorCollection = CollectionName;
