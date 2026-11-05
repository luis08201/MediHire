import { ButtonLink } from '../ui/Button.tsx'

export function HeroSection() {
  return (
    <section className="overflow-hidden" aria-labelledby="home-heading">
      <div className="lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-24 lg:pr-16 lg:pl-[max(2rem,calc((100vw-72rem)/2))]">
          <div className="max-w-xl">
            <h1
              id="home-heading"
              className="text-[2.5rem] leading-[1.02] sm:text-6xl lg:text-[5.75rem]"
            >
              The next role
              <br />
              is already
              <br />
              on the ward.
            </h1>
            <span className="mt-8 block h-px w-12 bg-gold" aria-hidden="true" />
            <p className="mt-8 max-w-[42ch] text-lg leading-relaxed">
              Eighteen sample roles across six fictional hospitals. Search the board, or read a
              hospital the way you would a profile.
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <ButtonLink to="/jobs">Explore the job board</ButtonLink>
              <ButtonLink to="/hospitals" variant="ghost">
                Read the hospitals
              </ButtonLink>
            </div>
            <p className="mt-6 max-w-[42ch] text-sm text-muted">
              Sample listings. Nothing here starts an application.
            </p>
          </div>
        </div>
        <img
          src="/images/hospitals/northcedar.jpg"
          alt="Corner of a modern glass building under a blue sky."
          className="hero-photo aspect-[3/2] w-full object-cover object-[22%_42%] lg:aspect-auto lg:h-full lg:min-h-[32rem]"
        />
      </div>
    </section>
  )
}
