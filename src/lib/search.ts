import { copy } from "@/i18n/en";
import { labelFrom } from "./format";
import {
  authorById,
  categoryById,
  departmentById,
  getPage,
  listBlogPosts,
  listJobs,
  listLocations,
  listServices,
  listTeamMembers,
  locationById,
  pageField,
} from "./cms/queries";

export type SearchGroup = "page" | "job" | "team" | "article" | "location";

export type SearchHit = {
  group: SearchGroup;
  title: string;
  href: string;
  excerpt: string;
  score: number;
};

function tokens(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

function scoreText(query: string, words: string[], title: string, body: string) {
  const haystackTitle = title.toLowerCase();
  const haystackBody = body.toLowerCase();
  const phrase = query.toLowerCase().trim();
  let score = 0;
  if (phrase && haystackTitle.includes(phrase)) score += 12;
  if (phrase && haystackBody.includes(phrase)) score += 4;
  for (const word of words) {
    if (haystackTitle.includes(word)) score += 5;
    else if (haystackBody.includes(word)) score += 2;
  }
  return score;
}

export function searchPublic(query: string): SearchHit[] {
  const trimmed = query.trim();
  const words = tokens(trimmed);
  if (!trimmed || words.length === 0) return [];
  const hits: SearchHit[] = [];

  const pages = [
    { id: "home", href: "/" },
    { id: "about", href: "/about" },
    { id: "services", href: "/services" },
    { id: "contact", href: "/contact" },
    { id: "careers", href: "/careers" },
    { id: "team", href: "/team" },
    { id: "blog", href: "/blog" },
    { id: "locations", href: "/locations" },
  ];
  for (const page of pages) {
    const entry = getPage(page.id);
    const body = Object.values(entry.fields).join(" ");
    const score = scoreText(trimmed, words, `${entry.title} ${entry.seo.title}`, `${entry.seo.description} ${body}`);
    if (score) hits.push({ group: "page", title: entry.title, href: page.href, excerpt: entry.seo.description, score });
  }
  for (const service of listServices()) {
    const score = scoreText(trimmed, words, service.name, `${service.summary} ${service.body}`);
    if (score) {
      hits.push({
        group: "page",
        title: service.name,
        href: `/services#${service.slug}`,
        excerpt: service.summary,
        score,
      });
    }
  }
  for (const job of listJobs()) {
    const location = locationById(job.locationId);
    const specialty = labelFrom("specialty", job.specialty);
    const body = `${job.employer} ${specialty} ${location?.name ?? ""} ${job.summary}`;
    const score = scoreText(trimmed, words, job.title, body);
    if (score) hits.push({ group: "job", title: job.title, href: `/careers/${job.slug}`, excerpt: job.summary, score });
  }
  for (const member of listTeamMembers()) {
    const department = departmentById(member.departmentId);
    const score = scoreText(trimmed, words, member.name, `${member.role} ${department?.name ?? ""} ${member.biography}`);
    if (score) {
      hits.push({
        group: "team",
        title: member.name,
        href: `/team/${member.slug}`,
        excerpt: `${member.role}${department ? `, ${department.name}` : ""}`,
        score,
      });
    }
  }
  for (const post of listBlogPosts()) {
    const author = authorById(post.authorId);
    const category = categoryById(post.categoryId);
    const score = scoreText(trimmed, words, post.title, `${post.excerpt} ${post.body} ${author?.name ?? ""} ${category?.name ?? ""}`);
    if (score) hits.push({ group: "article", title: post.title, href: `/blog/${post.slug}`, excerpt: post.excerpt, score });
  }
  for (const location of listLocations()) {
    const region = labelFrom("region", location.region);
    const score = scoreText(trimmed, words, location.name, `${location.summary} ${location.coverage} ${region} ${location.city}`);
    if (score) hits.push({ group: "location", title: location.name, href: `/locations/${location.slug}`, excerpt: location.summary, score });
  }

  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function groupHits(hits: SearchHit[]) {
  const order: SearchGroup[] = ["page", "job", "team", "article", "location"];
  return order
    .map((group) => ({
      group,
      label: copy.search.groups[group],
      hits: hits.filter((hit) => hit.group === group),
    }))
    .filter((group) => group.hits.length > 0);
}

export function pageIntro(id: string) {
  const page = getPage(id);
  return {
    page,
    text: (key: string, fallback = "") => pageField(page, key, fallback),
  };
}
