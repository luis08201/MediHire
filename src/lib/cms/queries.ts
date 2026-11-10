import { copy } from "@/i18n/en";
import { entryIsPublic, jobIsPublic } from "../format";
import { readCollection } from "./store";
import type { BlogPost, Job, Location, PageEntry, Service, TeamMember } from "./types";

export function listTeamCategories(options?: { includeDrafts?: boolean }) {
  return readCollection("team-categories")
    .filter((entry) => options?.includeDrafts || entry.editorialStatus === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function listTeamMembers(options?: { includeDrafts?: boolean }) {
  return readCollection("team-members")
    .filter((entry) => options?.includeDrafts || entry.editorialStatus === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function listLocations(options?: { includeDrafts?: boolean }) {
  return readCollection("locations")
    .filter((entry) => options?.includeDrafts || entry.editorialStatus === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function listBlogCategories(options?: { includeDrafts?: boolean }) {
  return readCollection("blog-categories")
    .filter((entry) => options?.includeDrafts || entry.editorialStatus === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function listBlogPosts(options?: { includeDrafts?: boolean; now?: Date }) {
  const now = options?.now ?? new Date();
  return readCollection("blog-posts")
    .filter((entry) => options?.includeDrafts || entryIsPublic(entry, now))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export function listJobs(options?: { includeDrafts?: boolean; now?: Date }) {
  const now = options?.now ?? new Date();
  return readCollection("jobs")
    .filter((entry) => (options?.includeDrafts ? true : jobIsPublic(entry, now)))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function listServices() {
  return readCollection("services")
    .filter((entry) => entry.editorialStatus === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPage(id: string): PageEntry {
  const page = readCollection("pages").find((entry) => entry.id === id);
  if (!page) throw new Error(`Missing page content: ${id}`);
  return page;
}

export function pageField(page: PageEntry, key: string, fallback = "") {
  return page.fields[key] || fallback;
}

export function getTeamCategory(slug: string, options?: { includeDrafts?: boolean }) {
  return listTeamCategories(options).find((entry) => entry.slug === slug) ?? null;
}

export function getTeamMember(slug: string, options?: { includeDrafts?: boolean }) {
  return (
    readCollection("team-members").find((entry) => {
      if (entry.slug !== slug) return false;
      return options?.includeDrafts || entry.editorialStatus === "published";
    }) ?? null
  );
}

export function getLocation(slug: string, options?: { includeDrafts?: boolean }) {
  return (
    readCollection("locations").find((entry) => {
      if (entry.slug !== slug) return false;
      return options?.includeDrafts || entry.editorialStatus === "published";
    }) ?? null
  );
}

export function getBlogCategory(slug: string, options?: { includeDrafts?: boolean }) {
  return listBlogCategories(options).find((entry) => entry.slug === slug) ?? null;
}

export function getBlogPost(slug: string, options?: { includeDrafts?: boolean; now?: Date }) {
  const now = options?.now ?? new Date();
  return (
    readCollection("blog-posts").find((entry) => {
      if (entry.slug !== slug) return false;
      return options?.includeDrafts || entryIsPublic(entry, now);
    }) ?? null
  );
}

export function getJob(slug: string, options?: { includeDrafts?: boolean }) {
  return (
    readCollection("jobs").find((entry) => {
      if (entry.slug !== slug) return false;
      return options?.includeDrafts || entry.editorialStatus === "published";
    }) ?? null
  );
}

export function getService(slug: string) {
  return listServices().find((entry) => entry.slug === slug) ?? null;
}

export function membersInDepartment(departmentId: string, options?: { includeDrafts?: boolean }) {
  return listTeamMembers(options).filter((member) => member.departmentId === departmentId);
}

export function postsInCategory(categoryId: string, options?: { includeDrafts?: boolean; now?: Date }) {
  return listBlogPosts(options).filter((post) => post.categoryId === categoryId);
}

export function jobsInLocation(locationId: string, options?: { now?: Date }) {
  return listJobs(options).filter((job) => job.locationId === locationId);
}

export function departmentById(id: string) {
  return readCollection("team-categories").find((entry) => entry.id === id) ?? null;
}

export function locationById(id: string) {
  return readCollection("locations").find((entry) => entry.id === id) ?? null;
}

export function categoryById(id: string) {
  return readCollection("blog-categories").find((entry) => entry.id === id) ?? null;
}

export function authorById(id: string): TeamMember | null {
  return readCollection("team-members").find((entry) => entry.id === id) ?? null;
}

export function optionList(values: string[], group: "specialty" | "shift" | "employmentType" | "arrangement" | "region") {
  const order = Object.keys(copy.vocabulary[group]);
  return [...new Set(values)]
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map((value) => ({
      value,
      label: (copy.vocabulary[group] as Record<string, string>)[value] ?? value,
    }));
}

export function careerFilterOptions(jobs: Job[] = listJobs()) {
  const locations = listLocations();
  const locationIds = new Set(jobs.map((job) => job.locationId));
  return {
    specialty: optionList(jobs.map((job) => job.specialty), "specialty"),
    location: locations
      .filter((location) => locationIds.has(location.id))
      .map((location) => ({ value: location.slug, label: location.name })),
    employmentType: optionList(jobs.map((job) => job.employmentType), "employmentType"),
    shift: optionList(jobs.map((job) => job.shift), "shift"),
  };
}

export function teamFilterOptions(members: TeamMember[] = listTeamMembers()) {
  const used = new Set(members.map((member) => member.departmentId));
  return listTeamCategories()
    .filter((category) => used.has(category.id))
    .map((category) => ({ value: category.slug, label: category.name }));
}

export function blogFilterOptions(posts: BlogPost[] = listBlogPosts()) {
  const used = new Set(posts.map((post) => post.categoryId));
  return listBlogCategories()
    .filter((category) => used.has(category.id))
    .map((category) => ({ value: category.slug, label: category.name }));
}

export function locationFilterOptions(locations: Location[] = listLocations()) {
  return optionList(locations.map((location) => location.region), "region");
}

export function serviceOptions(services: Service[] = listServices()) {
  return services.map((service) => ({ value: service.slug, label: service.name }));
}
