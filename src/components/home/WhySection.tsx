import { Link } from 'react-router'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

const candidatePoints = [
  'The shift and employment type are on the listing, not hidden in an attachment.',
  'The hospital is one step from the role, with city and focus on the same path.',
  'Responsibilities describe the work. This preview never asks for a résumé.',
]

const hospitalPoints = [
  'Profiles stay specific: city, region, bed count, and clinical focus.',
  'Open roles remain attached to the facility that posted them.',
  'Candidates can read a site without creating an account.',
]

export function WhySection() {
  return (
    <Section labelledBy="why-heading" className="bg-white">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-sm font-semibold text-accent">Why MediHire</p>
            <h2 id="why-heading" className="mt-4 text-balance text-4xl sm:text-5xl">
              What each side can actually see.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">
              The preview is deliberately plain about the facts of a job. No
              match scores, no borrowed testimonials, and no claim that a sample
              hospital is hiring today.
            </p>
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="text-2xl">For candidates</h3>
                <ul className="mt-4 space-y-3">
                  {candidatePoints.map((point) => (
                    <li key={point} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/jobs"
                  className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  Browse roles
                </Link>
              </div>
              <div>
                <h3 className="text-2xl">For hospitals</h3>
                <ul className="mt-4 space-y-3">
                  {hospitalPoints.map((point) => (
                    <li key={point} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/hospitals"
                  className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  View hospitals
                </Link>
              </div>
            </div>
          </div>
          <figure>
            <img
              src="/images/clinician-portrait.jpg"
              alt="A physician in a white coat stands outdoors and faces the camera."
              width="1400"
              height="1750"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover object-top shadow-[0_24px_60px_-36px_rgba(20,45,53,0.5)]"
            />
          </figure>
        </div>
      </Container>
    </Section>
  )
}
