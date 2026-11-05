import { Link, useParams } from 'react-router'
import { Container } from '../components/layout/Container.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { getHospitalBySlug } from '../data/hospitals.ts'
import { getJobBySlug, getRelatedJobs } from '../data/jobs.ts'
import type { JobListing } from '../data/types.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

function Breadcrumb({ current }: { current?: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <li>
          <Link to="/" className="font-semibold text-primary hover:text-primary-hover">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-muted">
          /
        </li>
        <li>
          <Link to="/jobs" className="font-semibold text-primary hover:text-primary-hover">
            Jobs
          </Link>
        </li>
        {current ? (
          <>
            <li aria-hidden="true" className="text-muted">
              /
            </li>
            <li aria-current="page" className="font-semibold text-heading">
              {current}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border pt-4">
      <dt className="text-sm font-semibold text-muted">{label}</dt>
      <dd className="mt-1 text-heading">{value}</dd>
    </div>
  )
}

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
          <Breadcrumb />
          <header className="mt-8 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl">Role not found</h1>
            <p className="mt-4 text-lg leading-relaxed">
              This address is not one of the sample listings. Open the job board to browse the
              fictional roles.
            </p>
          </header>
          <div className="mt-8">
            <ButtonLink to="/jobs">Explore Opportunities</ButtonLink>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <>
      <section className="bg-accent-surface" aria-labelledby="job-title">
        <Container className="py-16 md:py-20 lg:py-24">
          <Breadcrumb current={job.title} />
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold text-accent">{job.specialty}</p>
            <h1 id="job-title" className="mt-4 text-balance text-4xl sm:text-5xl lg:text-6xl">
              {job.title}
            </h1>
            <p className="mt-5 text-lg">
              {hospital ? (
                <Link
                  to={`/hospitals/${hospital.slug}`}
                  className="font-semibold text-heading hover:text-primary"
                >
                  {hospital.name}
                </Link>
              ) : (
                <span className="font-semibold text-heading">Sample hospital</span>
              )}
              <span className="text-body"> · {job.location}</span>
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Role details">
              {[job.employmentType, job.workArrangement].map((detail) => (
                <li
                  key={detail}
                  className="rounded-full border border-border bg-white px-3 py-1 text-sm text-heading"
                >
                  {detail}
                </li>
              ))}
              {job.salary ? (
                <li className="rounded-full border border-border bg-white px-3 py-1 text-sm font-semibold text-heading">
                  {job.salary}
                </li>
              ) : null}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink to="/jobs" className="w-full sm:w-auto">
                Explore Opportunities
              </ButtonLink>
              <p className="text-sm text-muted">Sample listing. This page does not take applications.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-12 lg:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <aside className="order-1 lg:sticky lg:top-24 lg:order-2" aria-label="Role summary">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-sans text-lg font-semibold">Role summary</h2>
                <dl className="mt-2">
                  <SummaryRow label="Hospital" value={hospital?.name ?? 'Sample hospital'} />
                  <SummaryRow label="Location" value={job.location} />
                  <SummaryRow label="Specialty" value={job.specialty} />
                  <SummaryRow label="Department" value={job.department} />
                  <SummaryRow label="Employment" value={job.employmentType} />
                  <SummaryRow label="Work arrangement" value={job.workArrangement} />
                  <SummaryRow label="Schedule" value={job.schedule} />
                  {job.salary ? <SummaryRow label="Salary" value={job.salary} /> : null}
                </dl>
                <div className="mt-6">
                  <ButtonLink to="/jobs" variant="secondary" className="w-full">
                    Explore Opportunities
                  </ButtonLink>
                </div>
              </div>
            </aside>

            <div className="order-2 min-w-0 space-y-14 lg:order-1">
              {overview ? (
                <section aria-labelledby="job-overview">
                  <h2 id="job-overview" className="text-3xl sm:text-4xl">
                    Job overview
                  </h2>
                  <p className="mt-5 max-w-3xl text-lg leading-relaxed">{overview}</p>
                </section>
              ) : null}

              {job.responsibilities.length > 0 ? (
                <section aria-labelledby="job-responsibilities">
                  <h2 id="job-responsibilities" className="text-3xl sm:text-4xl">
                    Key responsibilities
                  </h2>
                  <ul className="mt-6 max-w-3xl space-y-3">
                    {job.responsibilities.map((item) => (
                      <li
                        key={item}
                        className="flex gap-4 rounded-xl border border-border bg-white px-5 py-4 leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-2 shrink-0 rounded-full bg-accent"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {qualifications.length > 0 ? (
                <section aria-labelledby="job-qualifications">
                  <h2 id="job-qualifications" className="text-3xl sm:text-4xl">
                    Qualifications and requirements
                  </h2>
                  <ol className="mt-6 max-w-3xl list-decimal space-y-3 pl-5 leading-relaxed">
                    {qualifications.map((item) => (
                      <li key={item} className="pl-2">
                        {item}
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {hospital ? (
                <section aria-labelledby="about-hospital">
                  <h2 id="about-hospital" className="text-3xl sm:text-4xl">
                    About the hospital
                  </h2>
                  <article className="mt-6 max-w-3xl overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                    <div className="bg-primary px-6 py-8 text-white sm:px-8">
                      <p className="text-sm font-semibold text-accent-surface">{hospital.type}</p>
                      <h3 className="mt-3 text-3xl text-white">{hospital.name}</h3>
                      <p className="mt-3 text-accent-surface">
                        {hospital.city}, {hospital.region} · {hospital.bedCount} beds
                      </p>
                    </div>
                    <div className="px-6 py-8 sm:px-8">
                      <p className="leading-relaxed">{hospital.summary}</p>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Clinical focus">
                        {hospital.focusAreas.map((area) => (
                          <li
                            key={area}
                            className="rounded-full bg-accent-surface px-3 py-1 text-sm text-heading"
                          >
                            {area}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <ButtonLink to={`/hospitals/${hospital.slug}`} variant="secondary">
                          View hospital
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                </section>
              ) : null}

              {related.length > 0 ? (
                <RelatedJobs jobs={related} />
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-primary" aria-labelledby="more-opportunities">
        <Container className="py-16 md:py-20 lg:py-28">
          <div className="max-w-3xl">
            <h2
              id="more-opportunities"
              className="text-balance text-4xl text-white sm:text-5xl"
            >
              Browse more healthcare opportunities
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-accent-surface">
              The rest of the sample board is one step away. These roles are fictional, and nothing
              on this page starts an application.
            </p>
            <div className="mt-8">
              <ButtonLink to="/jobs" variant="inverse" className="w-full sm:w-auto">
                Explore Opportunities
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

function RelatedJobs({ jobs }: { jobs: JobListing[] }) {
  return (
    <section aria-labelledby="related-jobs">
      <h2 id="related-jobs" className="text-3xl sm:text-4xl">
        Related roles
      </h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((role) => {
          const workplace = getHospitalBySlug(role.hospitalSlug)

          return (
            <li key={role.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-accent">{role.specialty}</p>
                <h3 className="mt-2 text-2xl">
                  <Link to={`/jobs/${role.slug}`} className="hover:text-primary">
                    {role.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm font-semibold text-heading">
                  {workplace?.name ?? 'Sample hospital'}
                </p>
                <p className="mt-2 text-sm text-body">
                  {role.location} · {role.employmentType}
                </p>
                <div className="mt-5">
                  <Link
                    to={`/jobs/${role.slug}`}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary-hover"
                  >
                    View role
                  </Link>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
