import type { Metadata } from "next";
import { isPreview } from "./preview";
import { absoluteUrl, indexingLive, resolveRobots, siteUrl } from "./site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  indexable?: boolean;
  image?: string;
  imageAlt?: string;
  absoluteTitle?: boolean;
};

export async function buildMetadata(input: MetaInput): Promise<Metadata> {
  const preview = await isPreview();
  const robots = resolveRobots({
    indexingLive: indexingLive(),
    preview,
    indexable: input.indexable !== false,
  });
  const url = absoluteUrl(input.path);
  const image = input.image || "/media/consult.jpg";
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url },
    robots,
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: "MediHire",
      type: "website",
      locale: "en_US",
      images: [{ url: absoluteUrl(image), alt: input.imageAlt || input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [absoluteUrl(image)],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MediHire",
    url: siteUrl(),
    description: "Demonstration healthcare recruitment website connecting hospitals and clinics with clinicians.",
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl()}/search?q={query}`,
      "query-input": "required name=query",
    },
  };
}
