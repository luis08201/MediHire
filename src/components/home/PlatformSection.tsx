import { Link } from 'react-router'
import { hospitals } from '../../data/hospitals.ts'
import { jobs } from '../../data/jobs.ts'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

const photoSlugs = ['northcedar-regional-hospital', 'ridgeway-community-hospital']
const photos = photoSlugs
  .map((slug) => hospitals.find((hospital) => hospital.slug === slug))
  .filter((hospital) => hospital !== undefined)
const names = hospitals.slice(0, 4)

function openCount(slug: string) {
  return jobs.filter((job) => job.hospitalSlug === slug).length
}

export function PlatformSection() {
  return (
    <Section labelledBy="hospitals-band-heading">
      <Container>
        <h2 id="hospitals-band-heading" className="max-w-xl text-4xl leading-[1.08] sm:text-5xl">
          Places in the directory.
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
          {photos.map((hospital) => (
            <Link key={hospital.slug} to={`/hospitals/${hospital.slug}`} className="group block">
              <img
                src={hospital.image}
                alt={hospital.imageAlt}
                className="aspect-[16/10] w-full rounded-md object-cover"
              />
              <p className="mt-4 text-2xl text-heading underline decoration-accent underline-offset-4">
                {hospital.name}
              </p>
              <p className="mt-1 text-sm text-muted">
                {hospital.city}, {hospital.region}
              </p>
            </Link>
          ))}
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {names.map((hospital) => {
            const count = openCount(hospital.slug)
            return (
              <li key={hospital.slug} className="rounded-md border border-border bg-background p-5">
                <Link
                  to={`/hospitals/${hospital.slug}`}
                  className="text-xl text-heading underline decoration-accent underline-offset-4"
                >
                  {hospital.name}
                </Link>
                <p className="mt-2 text-sm text-muted">
                  {hospital.city}, {hospital.region} · {count} open {count === 1 ? 'role' : 'roles'}
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
