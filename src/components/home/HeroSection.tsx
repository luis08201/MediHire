import { ButtonLink } from '../ui/Button.tsx'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

export function HeroSection() {
  return (
    <Section labelledBy="home-heading">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-accent">Healthcare recruitment, simplified.</p>
            <h1
              id="home-heading"
              className="mt-5 text-balance text-4xl leading-[1.12] sm:text-5xl lg:text-6xl lg:leading-[1.08]"
            >
              Connecting exceptional care with exceptional careers.
            </h1>
            <p className="mt-6 text-lg leading-relaxed">
              MediHire gives clinicians a clear view of the unit, the schedule,
              and the hospital, and gives hiring teams one place to present open
              roles beside the facts that describe their site.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/jobs" className="w-full sm:w-auto">
                Explore Jobs
              </ButtonLink>
              <ButtonLink to="/hospitals" variant="secondary" className="w-full sm:w-auto">
                For Hospitals
              </ButtonLink>
            </div>
          </div>
          <figure className="relative">
            <img
              src="/images/clinicians-review.jpg"
              alt="Two clinicians in white coats review a scan together in a bright office."
              width="1600"
              height="1067"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[0_24px_60px_-36px_rgba(20,45,53,0.55)] sm:aspect-[5/4] lg:aspect-[4/5]"
            />
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl border border-border bg-white p-5 shadow-[0_12px_30px_-24px_rgba(20,45,53,0.6)] sm:inset-x-auto sm:right-auto sm:left-5 sm:max-w-xs">
              <p className="text-sm font-semibold text-heading">Sample directory</p>
              <p className="mt-1 text-sm leading-relaxed">
                Eight fictional roles across six hospitals. Nothing here is an application.
              </p>
            </figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  )
}
