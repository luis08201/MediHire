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
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {photos.map((hospital) => (
            <Link key={hospital.slug} to={`/hospitals/${hospital.slug}`} className="group block">
              <img
                src={hospital.image}
                alt={hospital.imageAlt}
                className="aspect-[16/10] w-full object-cover"
              />
              <p className="mt-4 text-2xl group-hover:underline">{hospital.name}</p>
              <p className="mt-1 text-sm text-muted">
                {hospital.city}, {hospital.region}
              </p>
            </Link>
          ))}
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {names.map((hospital) => (
            <li key={hospital.slug} className="border-t border-primary/10 pt-4">
              <Link
                to={`/hospitals/${hospital.slug}`}
                className="text-xl underline-offset-4 hover:underline"
              >
                {hospital.name}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {hospital.city}, {hospital.region} · {openCount(hospital.slug)} open{' '}
                {openCount(hospital.slug) === 1 ? 'role' : 'roles'}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
