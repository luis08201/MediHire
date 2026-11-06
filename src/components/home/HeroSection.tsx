import { ButtonLink } from '../ui/Button.tsx'
import { HeroSearch } from './HeroSearch.tsx'

export function HeroSection() {
  return (
    <section className="border-b border-border" aria-labelledby="home-heading">
      <div className="mx-auto grid max-w-[72rem] items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-medium text-primary">Sample directory</p>
          <h1
            id="home-heading"
            className="mt-4 max-w-[12ch] text-5xl leading-[1.05] sm:text-6xl"
          >
            Find Your Place in Healthcare.
          </h1>
          <p className="mt-6 max-w-[42ch] text-lg leading-relaxed">
            Eighteen sample roles across six fictional hospitals. Search the board to read a
            listing. Nothing here starts an application.
          </p>
          <HeroSearch />
          <div className="mt-6">
            <ButtonLink to="/jobs">Explore Jobs</ButtonLink>
          </div>
        </div>
        <img
          src="/images/nurse-teal.jpg"
          alt="Portrait of a clinician wearing teal scrubs against a light background."
          className="aspect-[4/5] w-full rounded-md object-cover object-[center_18%] lg:aspect-[5/6]"
        />
      </div>
    </section>
  )
}
