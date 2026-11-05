import { PageScaffold } from '../components/layout/PageScaffold.tsx'
import { Card } from '../components/ui/Card.tsx'
import { hospitals } from '../data/hospitals.ts'

export function HospitalsPage() {
  return (
    <PageScaffold
      eyebrow="Directory"
      title="Hospitals"
      description={`${hospitals.length} fictional hospitals used to demonstrate profiles and related roles.`}
    >
      {hospitals.length === 0 ? (
        <p>No sample hospitals are available.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {hospitals.map((hospital) => (
            <li key={hospital.slug}>
              <Card
                title={hospital.name}
                href={`/hospitals/${hospital.slug}`}
                eyebrow={hospital.type}
                description={hospital.summary}
                meta={`${hospital.city}, ${hospital.region} · ${hospital.bedCount} beds`}
              />
            </li>
          ))}
        </ul>
      )}
    </PageScaffold>
  )
}
