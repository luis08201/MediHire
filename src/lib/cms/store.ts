import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import type { CollectionName, EntryMap } from "./types";

const files: Record<CollectionName, string> = {
  "team-categories": "team-categories.json",
  "team-members": "team-members.json",
  jobs: "jobs.json",
  "blog-categories": "blog-categories.json",
  "blog-posts": "blog-posts.json",
  locations: "locations.json",
  services: "services.json",
  pages: "pages.json",
};

export function contentDir() {
  return path.join(process.cwd(), "content");
}

export function collectionPath(name: CollectionName) {
  return path.join(contentDir(), files[name]);
}

export function readCollection<K extends CollectionName>(name: K): EntryMap[K][] {
  const raw = readFileSync(collectionPath(name), "utf8");
  const parsed = JSON.parse(raw) as EntryMap[K][];
  return parsed;
}

export function writeCollection<K extends CollectionName>(name: K, entries: EntryMap[K][]) {
  mkdirSync(contentDir(), { recursive: true });
  writeFileSync(collectionPath(name), `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

export type RedirectRecord = {
  source: string;
  destination: string;
  permanent: boolean;
};

export function readRedirects(): RedirectRecord[] {
  const raw = readFileSync(path.join(contentDir(), "redirects.json"), "utf8");
  return JSON.parse(raw) as RedirectRecord[];
}

export function writeRedirects(redirects: RedirectRecord[]) {
  writeFileSync(path.join(contentDir(), "redirects.json"), `${JSON.stringify(redirects, null, 2)}\n`, "utf8");
}

export function readCredits(): { title: string; source: string; file: string; creator: string }[] {
  const raw = readFileSync(path.join(contentDir(), "credits.json"), "utf8");
  return JSON.parse(raw) as { title: string; source: string; file: string; creator: string }[];
}
