import { Link } from 'react-router'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

export function PlatformSection() {
  return (
    <Section id="features" labelledBy="features-heading" className="bg-accent-surface">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-sm font-semibold text-primary">The platform</p>
            <h2 id="features-heading" className="mt-4 text-balance text-4xl sm:text-5xl">
              One platform. Better opportunities for everyone.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">
              One side is choosing the next place to practice. The other is hiring
              for a unit that should not stay open. MediHire keeps both in the
              same directory.
            </p>
            <div className="mt-12 space-y-10">
              <article className="border-t border-border pt-8">
                <h3 className="text-3xl">For Healthcare Professionals</h3>
                <p className="mt-4 max-w-xl leading-relaxed">
                  Read the department, the shift, and the hospital before you open
                  a listing. Each sample role leads to responsibilities in plain
                  language, then to the facility behind the post.
                </p>
                <Link to="/jobs" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary-hover">
                  Explore Jobs
                </Link>
              </article>
              <article className="border-t border-border pt-8">
                <h3 className="text-3xl">For Hospitals & Hiring Teams</h3>
                <p className="mt-4 max-w-xl leading-relaxed">
                  Show the city, the bed count, and the clinical focus next to the
                  vacancy. Open roles stay on the hospital profile, so a candidate
                  can judge the site and the job together.
                </p>
                <Link to="/hospitals" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary-hover">
                  For Hospitals
                </Link>
              </article>
            </div>
          </div>
          <figure className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <img
              src="/images/operating-room.jpg"
              alt="A bright, empty operating room with a surgical light centered over the table."
              width="1600"
              height="1067"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[0_24px_60px_-36px_rgba(20,45,53,0.45)]"
            />
          </figure>
        </div>
      </Container>
    </Section>
  )
}
