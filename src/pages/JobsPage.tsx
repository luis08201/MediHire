import { PageScaffold } from '../components/layout/PageScaffold.tsx'
import { Card } from '../components/ui/Card.tsx'
import { getHospitalBySlug } from '../data/hospitals.ts'
import { jobs } from '../data/jobs.ts'

export function JobsPage() {
  return (
    <PageScaffold
      eyebrow="Job board"
      title="Open roles"
      description={`${jobs.length} sample roles across fictional hospitals. Listings stay in the browser.`}
    >
      {jobs.length === 0 ? (
        <p>No sample roles are available.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => {
            const hospital = getHospitalBySlug(job.hospitalSlug)

            return (
              <li key={job.slug}>
                <Card
                  title={job.title}
                  href={`/jobs/${job.slug}`}
                  eyebrow={job.department}
                  description={job.summary}
                  meta={`${hospital?.name ?? 'Hospital'} · ${job.location} · ${job.employmentType}`}
                />
              </li>
            )
          })}
        </ul>
      )}
    </PageScaffold>
  )
}
