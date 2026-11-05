import { Link, useParams } from 'react-router'
import { Container } from '../components/layout/Container.tsx'
import { ArrowIcon, CheckIcon, CircleArrow, Eyebrow, PinIcon } from '../components/ui/Marks.tsx'
import { getHospitalBySlug } from '../data/hospitals.ts'
import { getJobBySlug, getRelatedJobs } from '../data/jobs.ts'
import type { JobListing } from '../data/types.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

export function JobDetailsPage() {
  const { slug } = useParams()
  const job = slug ? getJobBySlug(slug) : undefined
  const hospital = job ? getHospitalBySlug(job.hospitalSlug) : undefined
  const related = job ? getRelatedJobs(job.slug) : []
  const overview = job?.description ?? job?.summary
  const qualifications = job?.qualifications ?? []

  useDocumentTitle(job ? `${job.title} · MediHire` : 'Role not found · MediHire')

  if (!job) {
    return (
      <section className="bg-background">
        <Container className="py-16 md:py-24">
          <nav aria-label="Breadcrumb">
            <Link to="/jobs" className="text-sm font-semibold text-primary">
              Find Jobs
            </Link>
          </nav>
          <h1 className="mt-8 text-4xl sm:text-5xl">Role not found</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed">
            This address is not one of the sample listings. Open the job board to browse the fictional roles.
          </p>
          <Link
            to="/jobs"
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            Explore Jobs
          </Link>
        </Container>
      </section>
    )
  }

  const facts = [
    { label: 'Department', value: job.department },
    { label: 'Schedule', value: job.schedule },
    { label: 'Employment', value: job.employmentType },
    { label: 'Work Type', value: job.workArrangement },
  ]

  return (
    <>
      <section className="overflow-hidden bg-accent-surface" aria-labelledby="job-title">
        <Container className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-body">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/jobs" className="font-medium hover:text-primary">
                    Find Jobs
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-heading">
                  {job.title}
                </li>
              </ol>
            </nav>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Role details">
              {[job.employmentType, job.workArrangement].map((item) => (
                <li key={item} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent">
                  {item}
                </li>
              ))}
            </ul>
            <h1 id="job-title" className="mt-4 text-balance text-5xl leading-[1.05] sm:text-6xl">
              {job.title}
            </h1>
            <p className="mt-4 text-lg font-semibold text-heading">
              {hospital ? (
                <Link to={`/hospitals/${hospital.slug}`} className="hover:text-primary">
                  {hospital.name}
                </Link>
              ) : (
                'Sample hospital'
              )}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-body">
              <PinIcon />
              {job.location}
              {job.salary ? <span className="font-semibold text-heading">{job.salary}</span> : null}
              <span className="text-muted">Sample listing</span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Explore Jobs
                <ArrowIcon />
              </Link>
              {hospital ? (
                <Link
                  to={`/hospitals/${hospital.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-heading hover:bg-accent-surface"
                >
                  View Hospital
                </Link>
              ) : null}
            </div>
            <p className="mt-3 text-sm text-muted">Sample listing. This page does not take applications.</p>
          </div>
          <img
            src={hospital?.image ?? '/images/hospitals/lakeshore.jpg'}
            alt={hospital?.imageAlt ?? 'Healthcare setting used for atmosphere'}
            className="curve-photo min-h-72 w-full object-cover"
          />
        </Container>
      </section>

      <section className="border-t border-border" aria-labelledby="job-overview">
        <Container className="grid items-start gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:py-16">
          <div>
            <h2 id="job-overview" className="text-3xl sm:text-4xl">
              Job Overview
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">{overview}</p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-accent-surface px-4 py-5">
                <dt className="text-xs font-semibold text-muted">{fact.label}</dt>
                <dd className="mt-2 text-sm font-semibold text-heading">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="job-description">
        <Container className="grid items-start gap-8 pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pb-16">
          <div>
            <h2 id="job-description" className="text-3xl sm:text-4xl">
              Job Description
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed">{job.summary}</p>
            {job.responsibilities.length > 0 ? (
              <>
                <h3 className="mt-8 font-sans text-lg font-semibold">Key Responsibilities</h3>
                <ul className="mt-4 space-y-3">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <aside className="rounded-3xl bg-accent-surface p-6 sm:p-8" aria-labelledby="job-qualifications">
            <h2 id="job-qualifications" className="text-3xl">
              Requirements & Qualifications
            </h2>
            {qualifications.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {qualifications.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 leading-relaxed">
                This sample listing does not include a separate requirements list. The responsibilities describe the work.
              </p>
            )}
          </aside>
        </Container>
      </section>

      {hospital ? (
        <section className="bg-accent-surface" aria-labelledby="about-hospital">
          <Container className="grid items-center gap-8 py-12 lg:grid-cols-[16rem_minmax(0,1fr)_auto] lg:py-16">
            <img
              src={hospital.image}
              alt={hospital.imageAlt}
              loading="lazy"
              className="h-44 w-full rounded-2xl object-cover"
            />
            <div>
              <Eyebrow>About the hospital</Eyebrow>
              <h2 id="about-hospital" className="mt-3 text-3xl sm:text-4xl">
                {hospital.name}
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed">{hospital.summary}</p>
              <p className="mt-3 text-sm font-semibold text-heading">
                {hospital.city}, {hospital.region} · {hospital.bedCount} beds · {hospital.focusAreas.length} listed specialties
              </p>
            </div>
            <Link
              to={`/hospitals/${hospital.slug}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-semibold text-heading hover:bg-white/80"
            >
              View Hospital Profile
              <ArrowIcon />
            </Link>
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? <RelatedJobs jobs={related} /> : null}

      <section className="bg-background" aria-labelledby="more-opportunities">
        <Container className="py-12 lg:py-16">
          <div className="overflow-hidden rounded-[1.75rem] bg-primary px-8 py-12 text-white sm:px-12">
            <h2 id="more-opportunities" className="max-w-xl text-balance text-4xl leading-[1.1] text-white sm:text-5xl">
              Explore more healthcare opportunities.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-accent-surface">
              Discover roles at the fictional hospitals in this sample directory.
            </p>
            <Link
              to="/jobs"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-primary"
            >
              Browse All Jobs
              <ArrowIcon />
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

function RelatedJobs({ jobs }: { jobs: JobListing[] }) {
  return (
    <section aria-labelledby="related-jobs">
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="related-jobs" className="text-4xl">
            Related Opportunities
          </h2>
          <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            View All Jobs
            <ArrowIcon />
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {jobs.map((role) => {
            const workplace = getHospitalBySlug(role.hospitalSlug)
            return (
              <li key={role.slug}>
                <article className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
                  <img
                    src={workplace?.image ?? '/images/hospitals/harborlight.jpg'}
                    alt=""
                    loading="lazy"
                    className="size-20 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl leading-tight">
                      <Link to={`/jobs/${role.slug}`} className="hover:text-primary">
                        {role.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-heading">{workplace?.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-body">
                      <PinIcon />
                      {role.location}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-accent">
                      {role.employmentType} · {role.workArrangement}
                    </p>
                  </div>
                  <CircleArrow to={`/jobs/${role.slug}`} label={`View ${role.title}`} />
                </article>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
