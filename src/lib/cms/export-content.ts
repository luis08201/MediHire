import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { collectionNames } from "./schema";
import { readCollection, readCredits } from "./store";
import type { CollectionName } from "./types";

const importOrder: CollectionName[] = [
  "team-categories",
  "blog-categories",
  "locations",
  "team-members",
  "blog-posts",
  "jobs",
  "services",
  "pages",
];

function flatten(value: unknown, prefix = "", out: Record<string, string> = {}) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, nested] of Object.entries(value)) {
      flatten(nested, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }
  out[prefix] = value === null || value === undefined ? "" : String(value);
  return out;
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function toCsv(rows: Record<string, string>[]) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvCell(row[header] ?? "")).join(","));
  return `\uFEFF${lines.join("\n")}\n`;
}

function assetsFrom(entries: unknown[]) {
  const found = new Set<string>();
  const visit = (value: unknown) => {
    if (typeof value === "string" && value.startsWith("/media/")) found.add(value);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  entries.forEach(visit);
  return [...found].sort();
}

export function exportCollections(target = path.join(process.cwd(), "exports")) {
  const jsonDir = path.join(target, "json");
  const csvDir = path.join(target, "csv");
  mkdirSync(jsonDir, { recursive: true });
  mkdirSync(csvDir, { recursive: true });
  const assets = new Set<string>();
  for (const name of collectionNames) {
    const entries = readCollection(name);
    writeFileSync(path.join(jsonDir, `${name}.json`), `${JSON.stringify(entries, null, 2)}\n`);
    writeFileSync(path.join(csvDir, `${name}.csv`), toCsv(entries.map((entry) => flatten(entry))));
    for (const asset of assetsFrom(entries)) assets.add(asset);
  }
  const inventory = {
    generatedAt: new Date().toISOString(),
    importOrder,
    relationKeys: {
      "team-members.departmentId": "team-categories.id",
      "jobs.locationId": "locations.id",
      "blog-posts.categoryId": "blog-categories.id",
      "blog-posts.authorId": "team-members.id",
    },
    assets: [...assets].sort().map((file) => {
      const credit = readCredits().find((item) => item.file === file);
      return { file, source: credit?.source ?? "", creator: credit?.creator ?? "", title: credit?.title ?? "" };
    }),
    preservedRedirects: "/jobs -> /careers, /insights -> /blog, plus any slug change recorded in content/redirects.json",
  };
  writeFileSync(path.join(target, "inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`);
  writeFileSync(path.join(target, "webflow-map.json"), `${JSON.stringify(webflowMap, null, 2)}\n`);
  writeFileSync(path.join(target, "framer-map.json"), `${JSON.stringify(framerMap, null, 2)}\n`);
  return target;
}

const webflowMap = {
  note: "Import collections in inventory.importOrder. Keep slugs unchanged. Bind filter controls to the stable value fields, not the display labels.",
  collections: {
    "team-categories": { slug: "slug", name: "name", plain: ["summary", "description"] },
    "team-members": { slug: "slug", reference: { departmentId: "team-categories" }, image: "portrait" },
    jobs: {
      slug: "slug",
      reference: { locationId: "locations" },
      optionFields: ["specialty", "shift", "employmentType", "workArrangement", "jobStatus", "editorialStatus"],
      dates: ["publishedAt", "closingDate"],
    },
    "blog-categories": { slug: "slug" },
    "blog-posts": { slug: "slug", reference: { categoryId: "blog-categories", authorId: "team-members" }, image: "image" },
    locations: { slug: "slug", optionFields: ["region", "kind"], image: "image" },
    services: { slug: "slug" },
    pages: { plainText: "fields", note: "Webflow static page copy, not a CMS collection, unless you choose to model it." },
  },
};

const framerMap = {
  verifiedOnPublishedPrototype: false,
  note: "Equivalent Finsweet filtering was not verified on a published Framer prototype. Do not promise the same behavior until the markup below is confirmed on a published Framer URL.",
  requiredChanges: [
    "Render the directory as a code component that emits the same fs-list attributes in the published DOM.",
    "Load https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js with the fs-list attribute on the published site.",
    "Keep list items in the initial HTML. Finsweet removes non-current pages from the DOM, and a React re-render can put them back.",
    "Call the list module restart after Framer navigation if the component mounts again.",
    "Store relation keys (departmentId, locationId, categoryId, authorId) and stable option values, not only labels.",
  ],
};
