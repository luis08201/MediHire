import { Link } from 'react-router'
import { Section } from '../layout/Section.tsx'

export function FinalCtaSection() {
  return (
    <Section id="demo" labelledBy="final-cta-heading" className="bg-background">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-primary text-white">
        <div className="grid items-center lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="px-8 py-12 sm:px-12 sm:py-16">
            <h2 id="final-cta-heading" className="max-w-md text-balance text-4xl leading-[1.1] text-white sm:text-5xl">
              Build stronger healthcare teams.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-accent-surface">
              Explore a better approach to healthcare recruitment.
            </p>
            <Link
              to="/#pricing"
              className="mt-8 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-primary hover:bg-accent-surface"
            >
              About This Preview
            </Link>
            <p id="pricing" className="mt-5 max-w-md scroll-mt-28 text-sm leading-relaxed text-accent-surface">
              There is nothing to buy and no demo to schedule. This fictional preview has no plans, invoices, or contact form.
            </p>
          </div>
          <img
            src="/images/hospitals/ridgeway.jpg"
            alt="A glass tower with a pale panel facade."
            loading="lazy"
            className="curve-photo-left hidden h-full min-h-64 w-full object-cover lg:block"
          />
        </div>
      </div>
    </Section>
  )
}
