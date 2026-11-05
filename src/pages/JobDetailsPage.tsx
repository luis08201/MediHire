import { Link, useParams } from 'react-router'
import { Container } from '../components/layout/Container.tsx'
import { PageScaffold } from '../components/layout/PageScaffold.tsx'
import { Section } from '../components/layout/Section.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { getHospitalBySlug } from '../data/hospitals.ts'
import { getJobBySlug } from '../data/jobs.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

export function JobDetailsPage() {
  const { slug } = useParams()
  const job = slug ? getJobBySlug(slug) : undefined
  const hospital = job ? getHospitalBySlug(job.hospitalSlug) : undefined

  useDocumentTitle(job ? `${job.title} · MediHire` : 'Role not found · MediHire')

  if (!job) {
    return (
      <PageScaffold
        title="Role not found"
        description="This listing is not in the sample data."
      >
        <ButtonLink to="/jobs" variant="secondary">
          Back to job board
        </ButtonLink>
      </PageScaffold>
    )
  }

  return (
    <Section>
      <Container>
        <p>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Back to job board
          </Link>
        </p>
        <header className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold text-accent">{job.department}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{job.title}</h1>
          <p className="mt-4 text-lg leading-relaxed">{job.summary}</p>
        </header>
        <dl className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold text-muted">Hospital</dt>
            <dd className="mt-1">
              {hospital ? (
                <Link
                  to={`/hospitals/${hospital.slug}`}
                  className="font-semibold text-primary hover:text-primary-hover"
                >
                  {hospital.name}
                </Link>
              ) : (
                'Sample hospital'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-muted">Location</dt>
            <dd className="mt-1 text-heading">{job.location}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-muted">Employment</dt>
            <dd className="mt-1 text-heading">{job.employmentType}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-muted">Schedule</dt>
            <dd className="mt-1 text-heading">{job.schedule}</dd>
          </div>
        </dl>
        <h2 className="mt-12 text-3xl">Responsibilities</h2>
        <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5">
          {job.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
