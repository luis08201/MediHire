import Link from "next/link";
import type { Metadata } from "next";
import { copy } from "@/i18n/en";

export const metadata: Metadata = {
  title: copy.notFound.title,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="wrap section">
      <p className="eyebrow">404</p>
      <h1>{copy.notFound.title}</h1>
      <p className="lede">{copy.notFound.body}</p>
      <div className="cta-row">
        <Link className="button primary" href="/">{copy.cta.backHome}</Link>
        <Link className="button secondary" href="/careers">{copy.cta.browseJobs}</Link>
        <Link className="button ghost" href="/search">{copy.cta.searchSite}</Link>
      </div>
    </div>
  );
}
