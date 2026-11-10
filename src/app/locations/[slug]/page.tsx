import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JobCard, JsonLd, Markdown, SampleBadge } from "@/components/content";
import { copy } from "@/i18n/en";
import { getLocation, jobsInLocation, locationById } from "@/lib/cms/queries";
import { labelFrom } from "@/lib/format";
import { isPreview } from "@/lib/preview";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const location = getLocation(slug, { includeDrafts: preview });
  if (!location) return {};
  return buildMetadata({
    title: location.seo.title,
    description: location.seo.description,
    path: `/locations/${location.slug}`,
    indexable: !location.demo && location.editorialStatus === "published",
    image: location.image.src,
    imageAlt: location.image.alt,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const location = getLocation(slug, { includeDrafts: preview });
  if (!location) notFound();
  const jobs = jobsInLocation(location.id);
  const office = location.kind === "office";
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" },
        { name: location.name, path: `/locations/${location.slug}` },
      ])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }, { name: location.name }]} />
      <div className="badge-row">
        <span className={office ? "badge office" : "badge"}>{office ? copy.locations.office : copy.locations.serviceArea}</span>
        {location.demo ? <SampleBadge /> : null}
        <span className="badge">{labelFrom("region", location.region)}</span>
      </div>
      <h1>{location.name}</h1>
      <p className="lede">{location.summary}</p>
      <p>{office ? copy.locations.officeNote : copy.locations.serviceNote}</p>
      {location.demo ? <p className="muted">{office ? copy.locations.sampleOffice : copy.locations.sampleArea}</p> : null}
      <div className="frame">
        <img src={location.image.src} alt={location.image.alt} width={1200} height={800} />
      </div>
      <p>{location.city}, {location.state}</p>
      {location.address ? <p>{location.address}</p> : null}
      <Markdown source={location.coverage} />
      <p>
        <Link className="button primary" href={`/contact?location=${location.slug}`}>{copy.cta.requestStaff}</Link>
      </p>
      <section className="section">
        <h2>{copy.locations.jobsTitle}</h2>
        {jobs.length ? (
          <div className="card-grid">
            {jobs.map((job) => <JobCard key={job.id} job={job} location={locationById(job.locationId)} />)}
          </div>
        ) : <p>{copy.locations.jobsEmpty}</p>}
      </section>
    </div>
  );
}
