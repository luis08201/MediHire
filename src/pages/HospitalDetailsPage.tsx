import { type MouseEvent } from 'react'
import { Link, useParams } from 'react-router'
import { HorizontalJobCard } from '../components/jobs/HorizontalJobCard.tsx'
import { Container } from '../components/layout/Container.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { getHospitalBySlug } from '../data/hospitals.ts'
import { getJobsForHospital } from '../data/jobs.ts'
import type { Hospital } from '../data/types.ts'
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

function overview(hospital: Hospital) {
  return `${hospital.name} is a fictional ${hospital.type.toLowerCase()} in ${hospital.city}, ${hospital.region}, with ${hospital.bedCount} beds. ${hospital.summary}`
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

  return (
    <>
      <section className="overflow-hidden bg-accent-surface" aria-labelledby="hospital-title">
        <Container className="py-12 md:py-16 lg:py-20">
          <Breadcrumb current={hospital.name} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                {hospital.type}
              </p>
              <h1 id="hospital-title" className="mt-4 text-balance text-5xl leading-[1.05] sm:text-6xl">
                {hospital.name}
              </h1>
              <p className="mt-4 text-lg text-heading">
                {hospital.city}, {hospital.region}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Specialties">
                {hospital.focusAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent"
                  >
                    {area}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  to={{ hash: 'open-positions' }}
                  onClick={focusOpenPositions}
                  className="w-full !rounded-full sm:w-auto"
                >
                  View Open Positions
                </ButtonLink>
                <p className="text-sm text-muted">
                  Sample profile. This page does not take applications.
                </p>
              </div>
            </div>
            <img
              src={hospital.image}
              alt={hospital.imageAlt}
              className="curve-sweep min-h-72 w-full object-cover object-[center_40%]"
            />
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
              <p className="mt-5 max-w-3xl text-lg leading-relaxed">{overview(hospital)}</p>
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
                <ul className="mt-6 space-y-4">
                  {roles.map((role) => (
                    <li key={role.slug}>
                      <HorizontalJobCard job={role} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </Container>
      </section>

      <section className="bg-background" aria-labelledby="hospital-cta">
        <Container className="py-12 lg:py-16">
          <div className="overflow-hidden rounded-[1.75rem] bg-primary px-8 py-12 sm:px-12">
            <h2 id="hospital-cta" className="max-w-xl text-balance text-4xl leading-[1.1] text-white sm:text-5xl">
              Find your place in better care.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-accent-surface">
              Browse the sample job board, or return to the fictional hospital directory. Nothing on this page starts an application.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/jobs" variant="inverse" className="!rounded-full">
                Explore Opportunities
              </ButtonLink>
              <ButtonLink to="/hospitals" variant="inverseQuiet" className="!rounded-full">
                Browse hospitals
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
