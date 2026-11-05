import { Container } from '../components/layout/Container.tsx'
import { Section } from '../components/layout/Section.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { hospitals } from '../data/hospitals.ts'
import { jobs } from '../data/jobs.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

export function HomePage() {
  useDocumentTitle('MediHire')

  return (
    <>
      <Section>
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-accent">Premium Health</p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Hospital careers, gathered in one place
            </h1>
            <p className="mt-5 text-lg leading-relaxed">
              Browse sample roles and hospitals. MediHire keeps this demo in the
              browser, with local mock data and no accounts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/jobs" className="w-full sm:w-auto">
                Browse jobs
              </ButtonLink>
              <ButtonLink to="/hospitals" variant="secondary" className="w-full sm:w-auto">
                View hospitals
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
      <Section className="bg-accent-surface">
        <Container>
          <h2 className="text-3xl sm:text-4xl">Explore the sample directory</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed">
            {jobs.length} open roles across {hospitals.length} fictional hospitals.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card
              title="Job board"
              href="/jobs"
              eyebrow="Roles"
              description="Clinical, technical, and leadership listings, each with its own detail page."
            />
            <Card
              title="Hospitals"
              href="/hospitals"
              eyebrow="Directory"
              description="Facility profiles with location, focus areas, and the roles tied to each site."
            />
          </div>
        </Container>
      </Section>
    </>
  )
}
