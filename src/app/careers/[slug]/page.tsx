import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/forms";
import { Breadcrumbs, JobCard, JsonLd, Markdown, SampleBadge } from "@/components/content";
import { copy } from "@/i18n/en";
import { getJob, listJobs, locationById } from "@/lib/cms/queries";
import { applicationIsOpen, buildJobPosting, formatCompensation, formatDate, jobIsExpired, jobIsPublic, jobPostingEligible, labelFrom } from "@/lib/format";
import { isPreview } from "@/lib/preview";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { absoluteUrl, indexingLive } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const job = getJob(slug, { includeDrafts: preview });
  if (!job) return {};
  return buildMetadata({
    title: job.seo.title,
    description: job.seo.description,
    path: `/careers/${job.slug}`,
    indexable: !job.demo && jobIsPublic(job),
  });
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const job = getJob(slug, { includeDrafts: preview });
  if (!job) notFound();
  const location = locationById(job.locationId);
  const open = applicationIsOpen(job);
  const pay = formatCompensation(job.compensation);
  const related = listJobs().filter((item) => item.id !== job.id).slice(0, 2);
  const graph: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Careers", path: "/careers" },
      { name: job.title, path: `/careers/${job.slug}` },
    ]),
  ];
  if (jobPostingEligible(job, indexingLive())) graph.push(buildJobPosting(job, location ?? undefined, absoluteUrl(`/careers/${job.slug}`)));
  return (
    <div className="wrap section">
      <JsonLd data={graph} />
      <article className="job-layout">
        <div>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }, { name: job.title }]} />
          <div className="badge-row">
            {job.demo ? <SampleBadge /> : null}
            {job.editorialStatus === "draft" ? <span className="badge">Draft</span> : null}
          </div>
          <h1>{job.title}</h1>
          <p className="lede">{job.summary}</p>
          <dl className="fact-grid">
            <div className="fact"><dt>{copy.jobs.employer}</dt><dd>{job.employer}</dd></div>
            <div className="fact"><dt>{copy.jobs.specialty}</dt><dd>{labelFrom("specialty", job.specialty)}</dd></div>
            <div className="fact"><dt>{copy.jobs.location}</dt><dd>{location ? <Link href={`/locations/${location.slug}`}>{location.name}</Link> : "—"}</dd></div>
            <div className="fact"><dt>{copy.jobs.arrangement}</dt><dd>{labelFrom("arrangement", job.workArrangement)}</dd></div>
            <div className="fact"><dt>{copy.jobs.shift}</dt><dd>{labelFrom("shift", job.shift)}</dd></div>
            <div className="fact"><dt>{copy.jobs.employment}</dt><dd>{labelFrom("employmentType", job.employmentType)}</dd></div>
            {pay ? <div className="fact"><dt>{copy.jobs.compensation}</dt><dd>{pay}</dd></div> : null}
            {job.closingDate ? <div className="fact"><dt>{copy.jobs.closing}</dt><dd>{formatDate(job.closingDate)}</dd></div> : null}
          </dl>
          {job.demo ? <p className="muted">{copy.jobs.sampleNote}</p> : null}
          <div className="apply-bar">
            <strong>{open ? copy.jobs.applyTitle : copy.apply.unavailable}</strong>
            {open ? <a className="button" href="#apply">{copy.cta.apply}</a> : <Link className="button" href="/careers">{copy.cta.browseJobs}</Link>}
          </div>
          <h2>{copy.jobs.responsibilities}</h2>
          <Markdown source={job.responsibilities} />
          <h2>{copy.jobs.qualifications}</h2>
          <Markdown source={job.qualifications} />
        </div>
        <aside>
          {open && job.application.mode === "external" && job.application.url ? (
            <div className="form-card" id="apply">
              <h2>{copy.cta.applyExternal}</h2>
              <p>{copy.jobs.externalNote}</p>
              <a className="button primary" href={job.application.url} target="_blank" rel="noopener noreferrer">
                {copy.cta.applyExternal} <span className="visually-hidden">{copy.a11y.opensNew}</span>
              </a>
            </div>
          ) : null}
          {open && job.application.mode === "internal" ? (
            <ApplicationForm issuedAt={Date.now()} submissionId={crypto.randomUUID()} job={job.slug} />
          ) : null}
          {!open ? (
            <div className="notice" id="apply">
              <h2>{job.jobStatus === "closed" ? copy.jobs.closedTitle : jobIsExpired(job) ? copy.jobs.expiredTitle : copy.jobs.closedTitle}</h2>
              <p>{job.jobStatus === "closed" ? copy.jobs.closedBody : jobIsExpired(job) ? copy.jobs.expiredBody : copy.apply.unavailable}</p>
              <Link href="/careers">{copy.cta.browseJobs}</Link>
            </div>
          ) : null}
        </aside>
      </article>
      {related.length ? (
        <section className="section">
          <h2>{copy.jobs.related}</h2>
          <div className="card-grid">
            {related.map((item) => <JobCard key={item.id} job={item} location={locationById(item.locationId)} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
