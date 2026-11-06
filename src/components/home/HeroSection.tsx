import { ButtonLink } from '../ui/Button.tsx'
import { OrbitMark } from '../ui/OrbitMark.tsx'
import { HeroSearch } from './HeroSearch.tsx'

const badges = ['18 sample roles', '6 fictional hospitals', 'No applications']

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="home-heading">
      <OrbitMark className="hero-orbit pointer-events-none absolute top-8 -right-24 hidden w-[34rem] lg:block" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pt-12 pb-20 text-center sm:px-8 lg:pt-20 lg:pb-28">
        <OrbitMark className="hero-orbit mb-8 w-36 lg:hidden" />
        <ul className="flex flex-wrap justify-center gap-2">
          {badges.map((badge) => (
            <li
              key={badge}
              className="rounded-full border border-border bg-surface/80 px-3 py-2 text-sm text-accent"
            >
              {badge}
            </li>
          ))}
        </ul>
        <h1
          id="home-heading"
          className="mt-8 text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-[4.75rem]"
        >
          Your Next Move
          <span className="mt-1 block text-accent">in Healthcare.</span>
        </h1>
        <p className="mt-6 max-w-[42ch] text-lg leading-relaxed">
          Eighteen sample roles across six fictional hospitals. Search the board to read a listing.
          Nothing here starts an application.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <ButtonLink to="/jobs">Find Jobs</ButtonLink>
          <ButtonLink to="/hospitals" variant="secondary">
            Explore Hospitals
          </ButtonLink>
        </div>
        <HeroSearch />
      </div>
    </section>
  )
}
