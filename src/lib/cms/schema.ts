import { copy } from "@/i18n/en";
import type { CollectionName } from "./types";
import { listBlogCategories, listLocations, listTeamCategories, listTeamMembers } from "./queries";

export type EditorField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "markdown" | "select" | "date" | "number" | "checkbox";
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
};

const status = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

const specialtyOptions = Object.entries(copy.vocabulary.specialty).map(([value, label]) => ({ value, label }));
const shiftOptions = Object.entries(copy.vocabulary.shift).map(([value, label]) => ({ value, label }));
const employmentOptions = Object.entries(copy.vocabulary.employmentType).map(([value, label]) => ({ value, label }));
const arrangementOptions = Object.entries(copy.vocabulary.arrangement).map(([value, label]) => ({ value, label }));
const regionOptions = Object.entries(copy.vocabulary.region).map(([value, label]) => ({ value, label }));

export const collectionNames: CollectionName[] = [
  "team-categories",
  "team-members",
  "locations",
  "blog-categories",
  "blog-posts",
  "jobs",
  "services",
  "pages",
];

export function isCollection(value: string): value is CollectionName {
  return collectionNames.includes(value as CollectionName);
}

export const collectionLabels: Record<CollectionName, string> = {
  "team-categories": "Team categories",
  "team-members": "Team members",
  jobs: "Jobs",
  "blog-categories": "Blog categories",
  "blog-posts": "Blog posts",
  locations: "Locations",
  services: "Services",
  pages: "Site copy",
};

export function publicPath(collection: CollectionName, entry: { slug?: string; id: string }) {
  if (collection === "team-categories") return `/team/category/${entry.slug}`;
  if (collection === "team-members") return `/team/${entry.slug}`;
  if (collection === "jobs") return `/careers/${entry.slug}`;
  if (collection === "blog-categories") return `/blog/category/${entry.slug}`;
  if (collection === "blog-posts") return `/blog/${entry.slug}`;
  if (collection === "locations") return `/locations/${entry.slug}`;
  if (collection === "services") return `/services#${entry.slug}`;
  if (entry.id === "home") return "/";
  return `/${entry.id}`;
}

export function editorFields(collection: CollectionName): EditorField[] {
  const departments = listTeamCategories({ includeDrafts: true }).map((entry) => ({ value: entry.id, label: entry.name }));
  const members = listTeamMembers({ includeDrafts: true }).map((entry) => ({ value: entry.id, label: entry.name }));
  const categories = listBlogCategories({ includeDrafts: true }).map((entry) => ({ value: entry.id, label: entry.name }));
  const locations = listLocations({ includeDrafts: true }).map((entry) => ({ value: entry.id, label: entry.name }));
  const commonSeo: EditorField[] = [
    { name: "seo.title", label: "SEO title", type: "text", required: true },
    { name: "seo.description", label: "SEO description", type: "textarea", required: true },
  ];
  const publishing: EditorField[] = [
    { name: "editorialStatus", label: "Editorial status", type: "select", required: true, options: status },
    { name: "sortOrder", label: "Sort order", type: "number", required: true },
  ];
  if (collection === "team-categories" || collection === "blog-categories") {
    return [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "description", label: "Description", type: "markdown", required: true },
      ...publishing,
      ...commonSeo,
    ];
  }
  if (collection === "team-members") {
    return [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "departmentId", label: "Department", type: "select", required: true, options: departments },
      { name: "portrait.src", label: "Portrait path", type: "text", required: true },
      { name: "portrait.alt", label: "Portrait alt text", type: "textarea", required: true },
      { name: "biography", label: "Biography", type: "markdown", required: true },
      { name: "demo", label: "Sample record", type: "checkbox", help: "Sample records stay out of the sitemap and job rich results." },
      ...publishing,
      ...commonSeo,
    ];
  }
  if (collection === "locations") {
    return [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "region", label: "Region", type: "select", required: true, options: regionOptions },
      { name: "kind", label: "Kind", type: "select", required: true, options: [
        { value: "office", label: "Physical office" },
        { value: "service-area", label: "Service area" },
      ] },
      { name: "city", label: "City", type: "text", required: true },
      { name: "state", label: "State", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "coverage", label: "Coverage", type: "markdown", required: true },
      { name: "address", label: "Street address", type: "text", help: "Only for physical offices." },
      { name: "image.src", label: "Image path", type: "text", required: true },
      { name: "image.alt", label: "Image alt text", type: "textarea", required: true },
      { name: "demo", label: "Sample record", type: "checkbox" },
      ...publishing,
      ...commonSeo,
    ];
  }
  if (collection === "jobs") {
    return [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "employer", label: "Employer", type: "text", required: true },
      { name: "specialty", label: "Specialty", type: "select", required: true, options: specialtyOptions },
      { name: "locationId", label: "Location", type: "select", required: true, options: locations },
      { name: "workArrangement", label: "Work arrangement", type: "select", required: true, options: arrangementOptions },
      { name: "shift", label: "Shift", type: "select", required: true, options: shiftOptions },
      { name: "employmentType", label: "Employment type", type: "select", required: true, options: employmentOptions },
      { name: "compensation.min", label: "Pay minimum", type: "number" },
      { name: "compensation.max", label: "Pay maximum", type: "number" },
      { name: "compensation.period", label: "Pay period", type: "select", options: [
        { value: "", label: "No compensation shown" },
        { value: "hour", label: "Per hour" },
        { value: "year", label: "Per year" },
      ] },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "responsibilities", label: "Responsibilities", type: "markdown", required: true },
      { name: "qualifications", label: "Qualifications", type: "markdown", required: true },
      { name: "application.mode", label: "Application destination", type: "select", required: true, options: [
        { value: "internal", label: "Built-in application form" },
        { value: "external", label: "External URL" },
      ] },
      { name: "application.url", label: "External application URL", type: "text" },
      { name: "publishedAt", label: "Publication date", type: "date" },
      { name: "closingDate", label: "Closing date", type: "date" },
      { name: "jobStatus", label: "Job status", type: "select", required: true, options: [
        { value: "open", label: "Open" },
        { value: "closed", label: "Closed" },
      ] },
      { name: "demo", label: "Sample record", type: "checkbox" },
      ...publishing,
      ...commonSeo,
    ];
  }
  if (collection === "blog-posts") {
    return [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "body", label: "Body", type: "markdown", required: true },
      { name: "categoryId", label: "Category", type: "select", required: true, options: categories },
      { name: "authorId", label: "Author", type: "select", required: true, options: members },
      { name: "publishedAt", label: "Publication date", type: "date" },
      { name: "image.src", label: "Image path", type: "text", required: true },
      { name: "image.alt", label: "Image alt text", type: "textarea", required: true },
      { name: "demo", label: "Sample record", type: "checkbox" },
      ...publishing,
      ...commonSeo,
    ];
  }
  if (collection === "services") {
    return [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "body", label: "Description", type: "markdown", required: true },
      ...publishing,
      ...commonSeo,
    ];
  }
  return [
    { name: "title", label: "Page title", type: "text", required: true },
    {
      name: "fieldsJson",
      label: "Page fields JSON",
      type: "textarea",
      required: true,
      help: "Object of editable marketing strings for this page. Keep the existing keys.",
    },
    ...commonSeo,
  ];
}

export function blankEntry(collection: CollectionName, id: string): Record<string, unknown> {
  const base: Record<string, unknown> = {
    id,
    slug: "",
    editorialStatus: "draft",
    sortOrder: 100,
    demo: true,
    seo: { title: "", description: "" },
  };
  if (collection === "jobs") {
    base.application = { mode: "internal", url: null };
    base.compensation = null;
    base.jobStatus = "open";
    base.publishedAt = null;
    base.closingDate = null;
  }
  if (collection === "pages") {
    base.fields = {};
    delete base.slug;
    delete base.editorialStatus;
    delete base.sortOrder;
    delete base.demo;
  }
  if (collection === "locations") base.address = null;
  if (collection === "team-members" || collection === "locations" || collection === "blog-posts") {
    const key = collection === "team-members" ? "portrait" : "image";
    base[key] = { src: "", alt: "" };
  }
  return base;
}
