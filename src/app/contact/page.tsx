import { Breadcrumbs, JsonLd } from "@/components/content";
import { StaffingForm } from "@/components/forms";
import { copy } from "@/i18n/en";
import { getPage, listLocations, pageField, serviceOptions } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("contact");
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/contact" });
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ location?: string; service?: string }> }) {
  const query = await searchParams;
  const page = getPage("contact");
  const locations = listLocations().map((location) => ({ value: location.slug, label: location.name }));
  const specialties = Object.entries(copy.vocabulary.specialty).map(([value, label]) => ({ value, label }));
  const services = serviceOptions();
  const location = locations.some((item) => item.value === query.location) ? query.location : "";
  const service = services.some((item) => item.value === query.service) ? query.service : "";
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/contact" }])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
      <h1>{copy.contact.title}</h1>
      <p className="lede">{pageField(page, "lede", copy.contact.introFallback)}</p>
      <StaffingForm
        issuedAt={Date.now()}
        submissionId={crypto.randomUUID()}
        locations={locations}
        specialties={specialties}
        services={services}
        defaults={{ location, service }}
      />
    </div>
  );
}
