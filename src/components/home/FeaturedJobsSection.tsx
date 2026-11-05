import { Link } from 'react-router'
import { getHospitalBySlug } from '../../data/hospitals.ts'
import { featuredJobs } from '../../data/jobs.ts'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

const shown = featuredJobs.slice(0, 3)

export function FeaturedJobsSection() {
  return (
    <Section labelledBy="featured-jobs-heading">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="featured-jobs-heading" className="max-w-xl text-4xl leading-[1.08] sm:text-5xl">
            Three roles from the sample board.
          </h2>
          <Link to="/jobs" className="text-sm underline-offset-4 hover:underline">
            View all jobs
          </Link>
        </div>
        <ul className="mt-12 border-t border-primary/10">
          {shown.map((job) => {
            const hospital = getHospitalBySlug(job.hospitalSlug)
            return (
              <li key={job.slug} className="border-b border-primary/10">
                <article className="grid gap-6 py-8 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center">
                  <img
                    src={hospital?.image ?? '/images/hospitals/harborlight.jpg'}
                    alt=""
                    className="aspect-[4/3] w-full object-cover sm:h-24"
                  />
                  <div>
                    <h3 className="text-3xl leading-tight">
                      <Link to={`/jobs/${job.slug}`} className="underline-offset-4 hover:underline">
                        {job.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm">
                      {hospital ? (
                        <Link
                          to={`/hospitals/${hospital.slug}`}
                          className="underline-offset-4 hover:underline"
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
