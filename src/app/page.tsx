import Link from "next/link";
import { ArticleCard, JobCard, JsonLd, PersonCard } from "@/components/content";
import { copy, fill } from "@/i18n/en";
import { categoryById, departmentById, getPage, listBlogPosts, listJobs, listLocations, listServices, listTeamMembers, locationById, pageField } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata, websiteJsonLd } from "@/lib/seo";

const servicePhotos = [
  { src: "/media/consult.jpg", alt: "Two clinicians reviewing medical imaging on a monitor." },
  { src: "/media/or-team.jpg", alt: "Two surgeons in caps and masks looking down during a procedure." },
  { src: "/media/respiratory.jpg", alt: "A surgical team gathered under operating-room lights." },
];

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
  const jobs = listJobs();
  const posts = listBlogPosts();
  const services = listServices();
  const locations = listLocations();
  const members = listTeamMembers();
  const steps = [1, 2, 3];
  const counts = [
    { value: jobs.length, label: copy.home.countRoles },
    { value: locations.length, label: copy.home.countAreas },
    { value: members.length, label: copy.home.countPeople },
    { value: services.length, label: copy.home.countServices },
  ];
  return (
    <>
      <JsonLd data={[websiteJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }])]} />
      <div className="wrap">
        <section className="photo-hero">
          <img className="photo-hero-img" src="/media/consult.jpg" alt="Two clinicians reviewing medical imaging on a monitor." width={1600} height={1000} />
          <div className="photo-hero-shade" aria-hidden="true" />
          <div className="photo-hero-copy">
            <p className="photo-chip">{fill(copy.home.openChip, { count: String(jobs.length) })}</p>
            <h1>{text("heroTitle")}</h1>
            <div className="cta-row">
              <Link className="button gradient" href="/contact">{copy.cta.requestStaff}</Link>
              <Link className="button white" href="/careers">{copy.cta.browseJobs}</Link>
            </div>
          </div>
          <aside className="hero-float">
            <p className="kicker">{copy.home.floatTitle}</p>
            <div className="avatar-stack">
              {members.slice(0, 3).map((member) => (
                <img key={member.id} src={member.portrait.src} alt="" width={64} height={64} />
              ))}
            </div>
            <p>{fill(copy.home.floatBody, { count: String(members.length) })}</p>
          </aside>
        </section>

        <section className="stat-band" aria-label={copy.home.countsLabel}>
          {counts.map((count) => (
            <div key={count.label}>
              <strong>{count.value}</strong>
              <span>{count.label}</span>
            </div>
          ))}
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
            {services.map((service, index) => {
              const photo = servicePhotos[index % servicePhotos.length];
              return (
                <article className="card inset-card service-photo" key={service.id}>
                  <img src={photo.src} alt={photo.alt} width={1200} height={800} />
                  <div className="card-copy">
                    <h3>{service.name}</h3>
                    <p>{service.summary}</p>
                    <div className="card-foot">
                      <Link className="card-action" href={`/contact?service=${service.slug}`}>{copy.cta.requestStaff}</Link>
                    </div>
                  </div>
                </article>
              );
            })}
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
            <h2>{copy.home.peopleTitle}</h2>
            <p className="lede">{copy.home.peopleBody}</p>
          </div>
          <div className="card-grid">
            {members.slice(0, 3).map((member) => (
              <PersonCard key={member.id} member={member} department={departmentById(member.departmentId)?.name} />
            ))}
          </div>
          <p className="section-more"><Link className="button primary" href="/team">{copy.cta.meetTeam}</Link></p>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>{copy.home.featuredTitle}</h2>
            <p>{copy.home.featuredBody}</p>
          </div>
          <div className="list roles">
            {jobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} location={locationById(job.locationId)} />)}
          </div>
          <p className="section-more"><Link className="button primary" href="/careers">{copy.cta.browseJobs}</Link></p>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>{text("coverageTitle")}</h2>
            <p className="lede">{text("coverageBody")}</p>
          </div>
          <div className="card-grid">
            {locations.slice(0, 3).map((location) => (
              <article className="card inset-card place-card" key={location.id}>
                <img src={location.image.src} alt={location.image.alt} width={1200} height={800} />
                <div className="card-copy">
                  <h3><Link href={`/locations/${location.slug}`}>{location.name}</Link></h3>
                  <p>{location.city}, {location.state}</p>
                  <div className="card-foot">
                    <p className="card-meta"><span>{location.kind === "office" ? copy.locations.office : copy.locations.serviceArea}</span></p>
                    <Link className="card-action" href={`/locations/${location.slug}`}>{copy.cta.viewLocation}</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="section-more"><Link className="button primary" href="/locations">{copy.cta.viewCoverage}</Link></p>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>{copy.home.articlesTitle}</h2>
          </div>
          <div className="article-grid">
            {posts.slice(0, 3).map((post) => (
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
