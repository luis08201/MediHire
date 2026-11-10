import Link from "next/link";
import { Breadcrumbs, JsonLd, Markdown } from "@/components/content";
import { copy } from "@/i18n/en";
import { getPage, pageField } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("about");
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/about" });
}

export default function AboutPage() {
  const page = getPage("about");
  const text = (key: string) => pageField(page, key);
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/about" }])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
      <p className="eyebrow">{copy.nav.about}</p>
      <h1>{page.title}</h1>
      <p className="lede">{text("lede")}</p>
      <div className="split">
        <article className="panel">
          <h2>{text("missionTitle")}</h2>
          <Markdown source={text("missionBody")} />
        </article>
        <article className="panel">
          <h2>{text("approachTitle")}</h2>
          <Markdown source={text("approachBody")} />
        </article>
      </div>
      <div className="cta-row">
        <Link className="button primary" href="/team">{copy.cta.meetTeam}</Link>
        <Link className="button secondary" href="/contact">{copy.cta.contactTeam}</Link>
      </div>
    </div>
  );
}
