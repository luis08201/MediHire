export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return configured.replace(/\/$/, "");
}

export function indexingLive() {
  return process.env.SITE_INDEXING === "live";
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export type RobotsFlags = {
  indexingLive: boolean;
  preview: boolean;
  indexable: boolean;
};

export function resolveRobots(flags: RobotsFlags) {
  if (!flags.indexingLive || flags.preview || !flags.indexable) {
    return { index: false, follow: false } as const;
  }
  return { index: true, follow: true } as const;
}
