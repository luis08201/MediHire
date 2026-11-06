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
          <Link to="/" className="text-accent underline underline-offset-4">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-muted">
          /
        </li>
        <li>
          <Link to="/hospitals" className="text-accent underline underline-offset-4">
            Hospitals
          </Link>
        </li>
        {current ? (
          <>
            <li aria-hidden="true" className="text-muted">
              /
            </li>
            <li aria-current="page">{current}</li>
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
      <section>
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
      <section aria-labelledby="hospital-title">
        <Container className="py-16 lg:py-24">
          <Breadcrumb current={hospital.name} />
          <p className="mt-8 text-sm text-muted">{hospital.type}</p>
          <h1 id="hospital-title" className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            {hospital.name}
          </h1>
          <p className="mt-4 text-lg">
            {hospital.city}, {hospital.region}
          </p>
          <p className="mt-3 max-w-[65ch] text-sm text-muted">{hospital.focusAreas.join(', ')}</p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ButtonLink to={{ hash: 'open-positions' }} onClick={focusOpenPositions}>
              View open positions
            </ButtonLink>
            <p className="text-sm text-muted">Sample profile. This page does not take applications.</p>
          </div>
        </Container>
        <div className="content-wrap pb-12">
          <img
            src={hospital.image}
            alt={hospital.imageAlt}
            className="aspect-[3/2] w-full rounded-2xl object-cover object-[center_40%] lg:aspect-[2.4/1]"
          />
        </div>
      </section>

      <section className="border-t border-border">
        <Container className="space-y-16 py-16">
          <section aria-labelledby="about-hospital">
            <h2 id="about-hospital" className="text-3xl sm:text-4xl">
              About the hospital
            </h2>
            <p className="mt-5 max-w-[65ch] text-lg leading-relaxed">{overview(hospital)}</p>
          </section>

          <section aria-labelledby="open-positions">
            <h2
              id="open-positions"
              tabIndex={-1}
              className="scroll-mt-32 text-3xl sm:text-4xl"
            >
              Open positions
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              {roles.length === 0
                ? 'No sample roles are listed for this hospital.'
                : `${roles.length} open ${roles.length === 1 ? 'role' : 'roles'} from the sample job board.`}
            </p>
            {roles.length === 0 ? (
              <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-surface px-6 py-10">
                <h3 className="text-2xl">No open positions</h3>
                <p className="mt-3 leading-relaxed">This sample hospital has no roles on the job board.</p>
                <div className="mt-6">
                  <ButtonLink to="/jobs" variant="secondary">
                    Browse the job board
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <ul className="mt-6 flex flex-col gap-4">
                {roles.map((role) => (
                  <li key={role.slug}>
                    <HorizontalJobCard job={role} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Container>
      </section>

      <section className="bg-surface" aria-labelledby="hospital-cta">
        <Container className="py-16">
          <h2 id="hospital-cta" className="max-w-xl text-4xl leading-[1.08] sm:text-5xl">
            Find your place in better care.
          </h2>
          <p className="mt-4 max-w-[65ch] text-lg leading-relaxed">
            Browse the sample job board, or return to the fictional hospital directory. Nothing on
            this page starts an application.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ButtonLink to="/jobs">Explore the job board</ButtonLink>
            <ButtonLink to="/hospitals" variant="ghost">
              Browse hospitals
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
