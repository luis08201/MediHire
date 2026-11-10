import type { MetadataRoute } from "next";
import { listBlogCategories, listBlogPosts, listJobs, listLocations, listTeamCategories, listTeamMembers } from "@/lib/cms/queries";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about", "/services", "/contact", "/careers", "/team", "/blog", "/locations"];
  for (const job of listJobs()) if (!job.demo) paths.push(`/careers/${job.slug}`);
  for (const member of listTeamMembers()) if (!member.demo) paths.push(`/team/${member.slug}`);
  for (const category of listTeamCategories()) paths.push(`/team/category/${category.slug}`);
  for (const post of listBlogPosts()) if (!post.demo) paths.push(`/blog/${post.slug}`);
  for (const category of listBlogCategories()) paths.push(`/blog/category/${category.slug}`);
  for (const location of listLocations()) if (!location.demo) paths.push(`/locations/${location.slug}`);
  return paths.map((path) => ({
    url: absoluteUrl(path.split("#")[0]),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
