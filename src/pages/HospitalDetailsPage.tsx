import { Link, useParams } from 'react-router'
import { Container } from '../components/layout/Container.tsx'
import { PageScaffold } from '../components/layout/PageScaffold.tsx'
import { Section } from '../components/layout/Section.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { getHospitalBySlug } from '../data/hospitals.ts'
import { getJobsForHospital } from '../data/jobs.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

export function HospitalDetailsPage() {
  const { slug } = useParams()
  const hospital = slug ? getHospitalBySlug(slug) : undefined
  const roles = hospital ? getJobsForHospital(hospital.slug) : []

  useDocumentTitle(hospital ? `${hospital.name} · MediHire` : 'Hospital not found · MediHire')

  if (!hospital) {
    return (
      <PageScaffold
        title="Hospital not found"
        description="This hospital is not in the sample directory."
      >
        <ButtonLink to="/hospitals" variant="secondary">
          Back to hospitals
        </ButtonLink>
      </PageScaffold>
    )
  }

  return (
    <Section>
      <Container>
        <p>
          <Link
            to="/hospitals"
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Back to hospitals
          </Link>
        </p>
        <header className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold text-accent">{hospital.type}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{hospital.name}</h1>
          <p className="mt-4 text-lg leading-relaxed">{hospital.summary}</p>
        </header>
        <dl className="mt-10 grid gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-semibold text-muted">Location</dt>
            <dd className="mt-1 text-heading">
              {hospital.city}, {hospital.region}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-muted">Beds</dt>
            <dd className="mt-1 text-heading">{hospital.bedCount}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-muted">Focus</dt>
            <dd className="mt-1 text-heading">{hospital.focusAreas.join(', ')}</dd>
          </div>
        </dl>
        <h2 className="mt-12 text-3xl">Open roles</h2>
        {roles.length === 0 ? (
          <p className="mt-4">No sample roles are listed for this hospital.</p>
        ) : (
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {roles.map((role) => (
              <li key={role.slug}>
                <Card
                  title={role.title}
                  href={`/jobs/${role.slug}`}
                  eyebrow={role.department}
                  description={role.summary}
                  meta={`${role.employmentType} · ${role.schedule}`}
                />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  )
}
