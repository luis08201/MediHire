import { ButtonLink } from '../ui/Button.tsx'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

export function FinalCtaSection() {
  return (
    <Section id="demo" labelledBy="demo-heading" className="bg-primary text-white">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-accent-surface">See the preview</p>
          <h2 id="demo-heading" className="mt-5 text-balance text-4xl text-white sm:text-5xl lg:text-6xl">
            Better connections. Better care.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-accent-surface">
            If you are choosing a unit, start with the roles. If you are hiring
            for one, start with the hospitals. The demo is this directory. Nothing
            is scheduled, and no contact details are asked for.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/jobs" variant="inverse" className="w-full sm:w-auto">
              Explore Jobs
            </ButtonLink>
            <ButtonLink to="/hospitals" variant="inverseQuiet" className="w-full sm:w-auto">
              For Hospitals
            </ButtonLink>
          </div>
        </div>
        <div id="pricing" className="mt-20 max-w-2xl scroll-mt-28 border-t border-white/25 pt-10">
          <h3 className="text-3xl text-white">Pricing</h3>
          <p className="mt-4 text-lg leading-relaxed text-accent-surface">
            There is nothing to buy. This fictional preview has no plans, no
            invoices, and no billing details.
          </p>
        </div>
      </Container>
    </Section>
  )
}
