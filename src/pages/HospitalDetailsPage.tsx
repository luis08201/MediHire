import { type MouseEvent } from 'react'
import { Link, useParams } from 'react-router'
import { Container } from '../components/layout/Container.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { getHospitalBySlug } from '../data/hospitals.ts'
import { getJobsForHospital } from '../data/jobs.ts'
import type { Hospital, JobListing } from '../data/types.ts'
import { scrollToId } from '../lib/scrollToId.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

function Breadcrumb({ current }: { current?: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <li>
          <Link to="/" className="font-semibold text-primary hover:text-primary-hover">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-muted">
          /
        </li>
        <li>
          <Link to="/hospitals" className="font-semibold text-primary hover:text-primary-hover">
            Hospitals
          </Link>
        </li>
        {current ? (
          <>
            <li aria-hidden="true" className="text-muted">
              /
            </li>
            <li aria-current="page" className="font-semibold text-heading">
              {current}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  )
}

function formatList(items: string[]) {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function withArticle(phrase: string) {
  const article = /^[aeiou]/i.test(phrase) ? 'an' : 'a'
  return `${article} ${phrase}`
}

function overview(hospital: Hospital) {
  return [
    `${hospital.name} is a fictional ${hospital.type.toLowerCase()} in ${hospital.city}, ${hospital.region}. The sample profile lists ${hospital.bedCount} beds. ${hospital.summary}`,
    `The approach to care on this profile follows the specialties already recorded for the site: ${formatList(hospital.focusAreas)}. Open roles below are the only positions attached to this hospital in the MediHire preview.`,
  ]
}

function highlights(hospital: Hospital) {
  return [
    {
      label: 'Kind of hospital',
      title: hospital.type,
      text: `${hospital.name} is recorded as ${withArticle(hospital.type.toLowerCase())} in the sample directory.`,
    },
    {
      label: 'Setting',
      title: `${hospital.city}, ${hospital.region}`,
      text: `The sample profile places this hospital in ${hospital.city}, ${hospital.region}.`,
    },
    {
      label: 'Listed capacity',
      title: `${hospital.bedCount} beds`,
      text: 'The sample directory records this bed count for the site.',
    },
    {
      label: 'Clinical focus',
      title: 'Listed specialties',
      text: `Care on this profile is organized around ${formatList(hospital.focusAreas)}.`,
    },
  ]
}

function jobMeta(role: JobListing) {
  const arrangement =
    role.workArrangement.toLowerCase() === role.location.toLowerCase()
      ? undefined
      : role.workArrangement

  return [role.location, role.employmentType, arrangement, role.salary]
    .filter((item): item is string => Boolean(item))
    .join(' · ')
}

function jobEyebrow(role: JobListing) {
  return role.specialty === role.department
    ? role.specialty
    : `${role.specialty} · ${role.department}`
}

function focusOpenPositions(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  ) {
    return
  }

  window.requestAnimationFrame(() => {
    scrollToId('open-positions')
    document.getElementById('open-positions')?.focus()
  })
}

export function HospitalDetailsPage() {
  const { slug } = useParams()
  const hospital = slug ? getHospitalBySlug(slug) : undefined
  const roles = hospital ? getJobsForHospital(hospital.slug) : []

  useDocumentTitle(hospital ? `${hospital.name} · MediHire` : 'Hospital not found · MediHire')

  if (!hospital) {
    return (
      <section className="bg-background">
        <Container className="py-16 md:py-24">
          <Breadcrumb />
          <header className="mt-8 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl">Hospital not found</h1>
            <p className="mt-4 text-lg leading-relaxed">
              This address is not one of the sample hospitals. Open the directory to browse the
              fictional sites.
            </p>
          </header>
          <div className="mt-8">
            <ButtonLink to="/hospitals">Browse hospitals</ButtonLink>
          </div>
        </Container>
      </section>
    )
  }

  const paragraphs = overview(hospital)

  return (
    <>
      <section className="bg-accent-surface" aria-labelledby="hospital-title">
        <Container className="py-16 md:py-20 lg:py-24">
          <Breadcrumb current={hospital.name} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold text-accent">{hospital.type}</p>
              <h1
                id="hospital-title"
                className="mt-4 text-balance text-4xl sm:text-5xl lg:text-6xl"
              >
                {hospital.name}
              </h1>
              <p className="mt-5 text-lg text-heading">
                {hospital.city}, {hospital.region}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Specialties">
                {hospital.focusAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-border bg-white px-3 py-1 text-sm text-heading"
                  >
                    {area}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  to={{ hash: 'open-positions' }}
                  onClick={focusOpenPositions}
                  className="w-full sm:w-auto"
                >
                  View Open Positions
                </ButtonLink>
                <p className="text-sm text-muted">
                  Sample profile. This page does not take applications.
                </p>
              </div>
            </div>
            <figure className="order-1 lg:order-2">
              <img
                src={hospital.image}
                alt={hospital.imageAlt}
                className="aspect-[16/10] w-full rounded-2xl border border-border object-cover shadow-sm lg:aspect-[4/5]"
              />
              <figcaption className="mt-3 text-sm text-muted">
                Photograph for atmosphere only.
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-12 lg:py-16">
          <div className="space-y-16 lg:space-y-20">
            <section aria-labelledby="about-hospital">
              <h2 id="about-hospital" className="text-3xl sm:text-4xl">
                About the hospital
              </h2>
              <div className="mt-5 max-w-3xl space-y-5 text-lg leading-relaxed">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="hospital-highlights">
              <h2 id="hospital-highlights" className="text-3xl sm:text-4xl">
                Hospital highlights
              </h2>
              <ul className="mt-6 grid gap-5 md:grid-cols-2">
                {highlights(hospital).map((item) => (
                  <li key={item.label}>
                    <Card title={item.title} eyebrow={item.label} description={item.text} />
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="hospital-specialties">
              <h2 id="hospital-specialties" className="text-3xl sm:text-4xl">
                Specialties
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed">
                These are the clinical focus areas recorded for this fictional hospital.
              </p>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {hospital.focusAreas.map((area) => (
                  <li key={area}>
                    <Card
                      title={area}
                      eyebrow="Specialty"
                      description="Listed on this sample hospital profile."
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="open-positions">
              <h2
                id="open-positions"
                tabIndex={-1}
                className="scroll-mt-28 text-3xl focus:outline-none sm:text-4xl"
              >
                Open positions
              </h2>
              <p className="mt-5 text-lg leading-relaxed">
                {roles.length === 0
                  ? 'No sample roles are listed for this hospital.'
                  : `${roles.length} open ${roles.length === 1 ? 'role' : 'roles'} from the sample job board.`}
              </p>
              {roles.length === 0 ? (
                <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-white px-6 py-10 shadow-sm">
                  <h3 className="text-2xl">No open positions</h3>
                  <p className="mt-3 leading-relaxed">
                    This sample hospital has no roles on the job board.
                  </p>
                  <div className="mt-6">
                    <ButtonLink to="/jobs" variant="secondary">
                      Browse the job board
                    </ButtonLink>
                  </div>
                </div>
              ) : (
                <ul className="mt-6 grid gap-5 md:grid-cols-2">
                  {roles.map((role) => (
                    <li key={role.slug}>
                      <Card
                        title={role.title}
                        href={`/jobs/${role.slug}`}
                        eyebrow={jobEyebrow(role)}
                        description={role.summary}
                        meta={jobMeta(role)}
                      >
                        <ButtonLink to={`/jobs/${role.slug}`} variant="secondary" size="sm">
                          View role
                        </ButtonLink>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </Container>
      </section>

      <section className="bg-primary" aria-labelledby="hospital-cta">
        <Container className="py-16 md:py-20 lg:py-28">
          <div className="max-w-3xl">
            <h2 id="hospital-cta" className="text-balance text-4xl text-white sm:text-5xl">
              Find your place in better care.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-accent-surface">
              Browse the sample job board, or return to the fictional hospital directory. Nothing
              on this page starts an application.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/jobs" variant="inverse" className="w-full sm:w-auto">
                Explore Opportunities
              </ButtonLink>
              <ButtonLink to="/hospitals" variant="inverseQuiet" className="w-full sm:w-auto">
                Browse hospitals
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
