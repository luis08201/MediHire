import type { MetadataRoute } from "next";
import { absoluteUrl, indexingLive } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const live = indexingLive();
  return {
    rules: {
      userAgent: "*",
      allow: live ? "/" : undefined,
      disallow: live ? ["/admin", "/api", "/search", "/preview"] : "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
