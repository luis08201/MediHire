import { Link } from 'react-router'
import { getHospitalBySlug } from '../../data/hospitals.ts'
import { featuredJobs } from '../../data/jobs.ts'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

const shown = featuredJobs.slice(0, 3)

export function FeaturedJobsSection() {
  return (
    <Section labelledBy="featured-jobs-heading" className="bg-surface">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="featured-jobs-heading" className="max-w-xl text-4xl leading-[1.08] sm:text-5xl">
            Three roles from the sample board.
          </h2>
          <Link to="/jobs" className="text-sm text-accent underline underline-offset-4">
            View all jobs
          </Link>
        </div>
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {shown.map((job) => {
            const hospital = getHospitalBySlug(job.hospitalSlug)
            return (
              <li key={job.slug}>
                <article className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-background">
                  <img
                    src={hospital?.image ?? '/images/hospitals/harborlight.jpg'}
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-2xl leading-tight">
                      <Link
                        to={`/jobs/${job.slug}`}
                        className="text-heading underline decoration-accent underline-offset-4"
                      >
                        {job.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm">
                      {hospital ? (
                        <Link
                          to={`/hospitals/${hospital.slug}`}
                          className="text-accent underline underline-offset-4"
                        >
                          {hospital.name}
                        </Link>
                      ) : (
                        'Sample hospital'
                      )}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {job.location} · {job.employmentType} · {job.workArrangement}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed">{job.summary}</p>
                    {job.salary ? <p className="mt-3 text-sm">{job.salary}</p> : null}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
