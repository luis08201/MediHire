import { Link } from 'react-router'
import { ArrowIcon, Eyebrow } from '../ui/Marks.tsx'

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#f3f6f5]" aria-labelledby="home-heading">
      <div className="mx-auto grid w-[min(78rem,calc(100%-2.5rem))] items-center gap-10 py-16 md:w-[min(78rem,calc(100%-4rem))] md:py-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:py-24">
        <div className="max-w-xl">
          <Eyebrow>Healthcare recruitment, reimagined</Eyebrow>
          <h1
            id="home-heading"
            className="mt-5 text-balance text-5xl leading-[1.05] sm:text-6xl lg:text-[4.25rem]"
          >
            Where better care
            <br />
            begins with
            <br />
            better hiring.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed">
            Connecting healthcare professionals with the organizations that need them.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/jobs"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Explore Jobs
              <ArrowIcon />
            </Link>
            <Link
              to="/hospitals"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-heading hover:bg-accent-surface"
            >
              For Organizations
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            Eight fictional featured roles. Nothing here is an application.
          </p>
        </div>
        <div className="relative min-h-80 lg:min-h-[34rem]">
          <img
            src="/images/clinician-portrait.jpg"
            alt="A physician in a white coat stands outdoors and faces the camera."
            className="curve-photo h-80 w-full object-cover object-[center_20%] shadow-sm lg:absolute lg:inset-y-0 lg:h-full"
          />
        </div>
      </div>
    </section>
  )
}
