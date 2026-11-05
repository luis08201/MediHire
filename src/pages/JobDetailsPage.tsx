import { Link, useParams } from 'react-router'
import { HorizontalJobCard } from '../components/jobs/HorizontalJobCard.tsx'
import { Container } from '../components/layout/Container.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { CheckIcon } from '../components/ui/Marks.tsx'
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
      <section>
        <Container className="py-16 md:py-24">
          <nav aria-label="Breadcrumb">
            <Link to="/jobs" className="text-sm underline-offset-4 hover:underline">
              Find Jobs
            </Link>
          </nav>
          <h1 className="mt-8 text-4xl sm:text-5xl">Role not found</h1>
          <p className="mt-4 max-w-[65ch] text-lg leading-relaxed">
            This address is not one of the sample listings. Open the job board to browse the fictional roles.
          </p>
          <div className="mt-8">
            <ButtonLink to="/jobs">Explore the job board</ButtonLink>
          </div>
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
      <section aria-labelledby="job-title">
        <Container className="py-16 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/jobs" className="underline-offset-4 hover:underline">
                  Find Jobs
                </Link>
              </li>
              <li aria-hidden="true" className="text-muted">
                /
              </li>
              <li aria-current="page">{job.title}</li>
            </ol>
          </nav>
          <h1 id="job-title" className="mt-8 max-w-4xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            {job.title}
          </h1>
          <p className="mt-5 text-lg">
            {hospital ? (
              <Link to={`/hospitals/${hospital.slug}`} className="underline-offset-4 hover:underline">
                {hospital.name}
              </Link>
            ) : (
              'Sample hospital'
            )}
          </p>
          <p className="mt-2 text-sm text-muted">
            {job.location}
            {job.salary ? ` · ${job.salary}` : ''} · Sample listing
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ButtonLink to="/jobs">Explore the job board</ButtonLink>
            {hospital ? (
              <ButtonLink to={`/hospitals/${hospital.slug}`} variant="ghost">
                View the hospital
              </ButtonLink>
            ) : null}
          </div>
          <p className="mt-4 text-sm text-muted">This page does not take applications.</p>
        </Container>
        <div className="content-wrap pb-12">
          <img
            src={hospital?.image ?? '/images/hospitals/lakeshore.jpg'}
            alt={hospital?.imageAlt ?? 'Healthcare setting used for atmosphere'}
            className="aspect-[3/2] w-full object-cover object-[center_40%] lg:aspect-[2.4/1]"
          />
        </div>
      </section>

      <section className="border-t border-primary/10" aria-labelledby="job-overview">
        <Container className="py-16">
          <h2 id="job-overview" className="text-3xl sm:text-4xl">
            Job overview
          </h2>
          <p className="mt-5 max-w-[65ch] text-lg leading-relaxed">{overview}</p>
          <dl className="mt-10 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-12">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="mt-1">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="job-description">
        <Container className="grid items-start gap-12 pb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <h2 id="job-description" className="text-3xl sm:text-4xl">
              Job description
            </h2>
            <p className="mt-5 max-w-[65ch] leading-relaxed">{job.summary}</p>
            {job.responsibilities.length > 0 ? (
              <>
                <h3 className="mt-8 font-sans text-lg">Key responsibilities</h3>
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
          <div className="bg-accent-surface p-6 sm:p-8">
            <h2 id="job-qualifications" className="text-3xl">
              Requirements and qualifications
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
          </div>
        </Container>
      </section>

      {hospital ? (
        <section className="border-t border-primary/10" aria-labelledby="about-hospital">
          <Container className="py-16">
            <h2 id="about-hospital" className="text-3xl sm:text-4xl">
              {hospital.name}
            </h2>
            <p className="mt-5 max-w-[65ch] leading-relaxed">{hospital.summary}</p>
            <p className="mt-3 text-sm text-muted">
              {hospital.city}, {hospital.region} · {hospital.bedCount} beds · {hospital.focusAreas.length} listed specialties
            </p>
            <Link
              to={`/hospitals/${hospital.slug}`}
              className="mt-6 inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline"
            >
              View the hospital
            </Link>
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? <RelatedJobs jobs={related} /> : null}
    </>
  )
}

function RelatedJobs({ jobs }: { jobs: JobListing[] }) {
  return (
    <section aria-labelledby="related-jobs" className="border-t border-primary/10">
      <Container className="py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="related-jobs" className="text-3xl sm:text-4xl">
            Related roles
          </h2>
          <Link to="/jobs" className="text-sm underline-offset-4 hover:underline">
            View all jobs
          </Link>
        </div>
        <ul className="mt-8 border-t border-primary/10">
          {jobs.map((role) => (
            <li key={role.slug}>
              <HorizontalJobCard job={role} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
