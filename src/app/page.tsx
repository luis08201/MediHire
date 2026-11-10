import Link from "next/link";
import { ArticleCard, JobCard, JsonLd } from "@/components/content";
import { copy } from "@/i18n/en";
import { categoryById, getPage, listBlogPosts, listJobs, listLocations, listServices, locationById, pageField } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata, websiteJsonLd } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("home");
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: "/",
    absoluteTitle: true,
    image: "/media/hero-team.jpg",
    imageAlt: "Hands type on a laptop beside a stethoscope on a wooden desk.",
  });
}

export default function HomePage() {
  const page = getPage("home");
  const text = (key: string) => pageField(page, key);
  const jobs = listJobs().slice(0, 3);
  const posts = listBlogPosts().slice(0, 3);
  const services = listServices();
  const locations = listLocations().slice(0, 4);
  const steps = [1, 2, 3];
  return (
    <>
      <JsonLd data={[websiteJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }])]} />
      <div className="wrap">
        <section className="hero">
          <div>
            <p className="eyebrow">{text("heroEyebrow")}</p>
            <h1>{text("heroTitle")}</h1>
            <p className="lede">{text("heroBody")}</p>
            <div className="cta-row">
              <Link className="button primary" href="/contact">{copy.cta.requestStaff}</Link>
              <Link className="button secondary" href="/careers">{copy.cta.browseJobs}</Link>
            </div>
          </div>
          <div className="hero-photo">
            <img src="/media/hero-team.jpg" alt="Hands type on a laptop beside a stethoscope on a wooden desk." width={1800} height={1200} />
          </div>
        </section>

        <section className="section split">
          <article className="panel">
            <p className="kicker">{copy.footer.forHospitals}</p>
            <h2>{text("hospitalTitle")}</h2>
            <p>{text("hospitalBody")}</p>
            <Link className="button primary" href="/services">{copy.nav.services}</Link>
          </article>
          <article className="panel">
            <p className="kicker">{copy.footer.forClinicians}</p>
            <h2>{text("clinicianTitle")}</h2>
            <p>{text("clinicianBody")}</p>
            <Link className="button secondary" href="/careers">{copy.cta.browseJobs}</Link>
          </article>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>{text("servicesTitle")}</h2>
            <p className="lede">{text("servicesBody")}</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="card" key={service.id}>
                <h3>{service.name}</h3>
                <p>{service.summary}</p>
                <Link href={`/contact?service=${service.slug}`}>{copy.cta.requestStaff}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>{text("howTitle")}</h2>
            <p className="lede">{text("howIntro")}</p>
          </div>
          <div className="split">
            <div>
              <h3>{text("howHospitalTitle")}</h3>
              <div className="steps">
                {steps.map((step) => (
                  <div className="step" key={`h-${step}`}>
                    <span className="step-num">{step}</span>
                    <div>
                      <strong>{text(`hospitalStep${step}Title`)}</strong>
                      <p>{text(`hospitalStep${step}Body`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3>{text("howClinicianTitle")}</h3>
              <div className="steps">
                {steps.map((step) => (
                  <div className="step" key={`c-${step}`}>
                    <span className="step-num">{step}</span>
                    <div>
                      <strong>{text(`clinicianStep${step}Title`)}</strong>
                      <p>{text(`clinicianStep${step}Body`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>{copy.home.featuredTitle}</h2>
            <p>{copy.home.featuredBody}</p>
          </div>
          <div className="card-grid">
            {jobs.map((job) => <JobCard key={job.id} job={job} location={locationById(job.locationId)} />)}
          </div>
          <p><Link href="/careers">{copy.cta.browseJobs}</Link></p>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>{text("coverageTitle")}</h2>
            <p className="lede">{text("coverageBody")}</p>
          </div>
          <div className="card-grid">
            {locations.map((location) => (
              <article className="card" key={location.id}>
                <h3><Link href={`/locations/${location.slug}`}>{location.name}</Link></h3>
                <p>{location.kind === "office" ? copy.locations.office : copy.locations.serviceArea}</p>
                <p>{location.summary}</p>
              </article>
            ))}
          </div>
          <p><Link href="/locations">{copy.cta.viewCoverage}</Link></p>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>{copy.home.articlesTitle}</h2>
          </div>
          <div className="article-grid">
            {posts.map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                category={categoryById(post.categoryId)?.name}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
