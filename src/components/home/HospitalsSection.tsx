import { hospitals } from '../../data/hospitals.ts'
import { ButtonLink } from '../ui/Button.tsx'
import { Card } from '../ui/Card.tsx'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

const featuredSlugs = [
  'harborlight-medical-center',
  'lakeshore-university-hospital',
  'solace-childrens-hospital',
]

export function HospitalsSection() {
  const featured = featuredSlugs.flatMap((slug) => {
    const hospital = hospitals.find((item) => item.slug === slug)
    return hospital ? [hospital] : []
  })

  return (
    <Section labelledBy="hospitals-heading">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-accent">Hospitals</p>
            <h2 id="hospitals-heading" className="mt-4 text-balance text-4xl sm:text-5xl">
              A closer look at the directory.
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              Three fictional sites from the sample set. They are not partner
              health systems, and the profiles do not represent real openings.
            </p>
          </div>
          <ButtonLink to="/hospitals" variant="secondary" className="w-full sm:w-auto">
            View all hospitals
          </ButtonLink>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((hospital) => (
            <li key={hospital.slug}>
              <Card
                title={hospital.name}
                href={`/hospitals/${hospital.slug}`}
                eyebrow={hospital.type}
                description={hospital.summary}
                meta={`${hospital.city}, ${hospital.region} · ${hospital.bedCount} beds`}
                className="shadow-[0_16px_40px_-30px_rgba(20,45,53,0.5)]"
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
