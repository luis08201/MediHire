import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { exportCollections } from "../src/lib/cms/export-content";
import { getJob, listBlogPosts, listJobs, listLocations, listTeamMembers } from "../src/lib/cms/queries";
import { applicationIsOpen, buildJobPosting, jobIsPublic, jobPostingEligible } from "../src/lib/format";
import { workEmailError } from "../src/lib/forms/validation";
import { searchPublic } from "../src/lib/search";
import { resolveRobots } from "../src/lib/site";
import type { Job } from "../src/lib/cms/types";

const now = new Date("2026-11-10T18:00:00Z");

test("public jobs exclude drafts, closed roles, and expired roles", () => {
  const jobs = listJobs({ now });
  assert.equal(jobs.some((job) => job.slug === "nurse-anesthetist-denver"), false);
  assert.equal(jobs.some((job) => job.slug === "operating-room-nurse-boston"), false);
  assert.equal(jobs.some((job) => job.slug === "travel-emergency-nurse-phoenix"), false);
  assert.equal(jobIsPublic(getJob("operating-room-nurse-boston")!, now), false);
  assert.equal(applicationIsOpen(getJob("travel-emergency-nurse-phoenix")!, now), false);
  assert.equal(getJob("nurse-anesthetist-denver"), null);
  assert.ok(getJob("nurse-anesthetist-denver", { includeDrafts: true }));
});

test("filter targets sit past the first unfiltered page", () => {
  const jobs = listJobs({ now });
  const wound = jobs.findIndex((job) => job.slug === "wound-care-nurse-nashville");
  assert.ok(wound >= 6);
  assert.equal(jobs.filter((job) => job.shift === "night" && job.employmentType === "temporary").length, 1);
  const members = listTeamMembers();
  assert.ok(members.findIndex((member) => member.slug === "camille-ortiz") >= 6);
  assert.equal(members.filter((member) => member.departmentId === "dept-quality").length, 1);
  const locations = listLocations();
  assert.ok(locations.findIndex((location) => location.slug === "seattle") >= 4);
  assert.equal(locations.filter((location) => location.region === "pacific").length, 1);
  const posts = listBlogPosts({ now });
  const clinician = posts.filter((post) => post.categoryId === "cat-clinician");
  assert.equal(clinician.length, 1);
  assert.ok(posts.findIndex((post) => post.id === clinician[0].id) >= 4);
});

test("search stays on the public index", () => {
  const hrefs = (query: string) => searchPublic(query).map((hit) => hit.href);
  assert.equal(searchPublic("").length, 0);
  assert.equal(searchPublic("   ").length, 0);
  assert.equal(hrefs("anesthetist").some((href) => href.includes("nurse-anesthetist")), false);
  assert.equal(hrefs("operating room").some((href) => href.includes("operating-room-nurse")), false);
  assert.equal(hrefs("travel emergency").some((href) => href.includes("travel-emergency")), false);
  assert.equal(hrefs("unpublished briefing").some((href) => href.includes("unpublished")), false);
  assert.ok(hrefs("wound care").some((href) => href.includes("wound-care-nurse-nashville")));
});

test("staffing requests reject personal mailbox domains", () => {
  assert.match(workEmailError("hiring@gmail.com") ?? "", /organization email/i);
  assert.equal(workEmailError("hiring@northbank.example"), null);
});

test("JobPosting is limited to live non-demo openings with an application path", () => {
  const demo = listJobs({ now })[0];
  assert.equal(jobPostingEligible(demo, true, now), false);
  const live: Job = { ...demo, demo: false, editorialStatus: "published", jobStatus: "open", closingDate: "2027-01-01" };
  assert.equal(jobPostingEligible(live, false, now), false);
  assert.equal(jobPostingEligible(live, true, now), true);
  assert.equal(jobPostingEligible({ ...live, jobStatus: "closed" }, true, now), false);
  const posting = buildJobPosting(live, { city: "Austin", state: "TX", name: "Austin" }, "https://example.com/careers/icu");
  assert.equal(posting["@type"], "JobPosting");
  assert.equal(resolveRobots({ indexingLive: false, preview: false, indexable: true }).index, false);
  assert.equal(resolveRobots({ indexingLive: true, preview: true, indexable: true }).index, false);
});

test("collection export keeps relation keys in UTF-8 CSV", () => {
  const target = exportCollections(mkdtempSync(path.join(tmpdir(), "medihire-export-")));
  const members = readFileSync(path.join(target, "csv", "team-members.csv"), "utf8");
  const jobs = readFileSync(path.join(target, "csv", "jobs.csv"), "utf8");
  const posts = readFileSync(path.join(target, "csv", "blog-posts.csv"), "utf8");
  assert.equal(members.charCodeAt(0), 0xfeff);
  assert.match(members, /departmentId/);
  assert.match(members, /dept-quality/);
  assert.match(jobs, /locationId/);
  assert.match(jobs, /loc-nashville/);
  assert.match(posts, /categoryId/);
  assert.match(posts, /authorId/);
  const inventory = JSON.parse(readFileSync(path.join(target, "inventory.json"), "utf8")) as { importOrder: string[]; assets: { file: string }[] };
  assert.equal(inventory.importOrder[0], "team-categories");
  assert.ok(inventory.assets.some((asset) => asset.file === "/media/hero-team.jpg"));
  assert.equal(JSON.parse(readFileSync(path.join(target, "framer-map.json"), "utf8")).verifiedOnPublishedPrototype, false);
});
