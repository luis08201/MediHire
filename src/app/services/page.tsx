import Link from "next/link";
import { Breadcrumbs, JsonLd, Markdown } from "@/components/content";
import { copy } from "@/i18n/en";
import { getPage, listServices, pageField } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("services");
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/services" });
}

export default function ServicesPage() {
  const page = getPage("services");
  const services = listServices();
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/services" }])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
      <p className="eyebrow">{copy.nav.services}</p>
      <h1>{page.title}</h1>
      <p className="lede">{pageField(page, "lede")}</p>
      <div className="section">
        {services.map((service) => (
          <article className="service-block" id={service.slug} key={service.id}>
            <h2>{service.name}</h2>
            <p>{service.summary}</p>
            <Markdown source={service.body} />
            <Link className="button primary" href={`/contact?service=${service.slug}`}>{copy.cta.requestStaff}</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
