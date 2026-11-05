import { Eyebrow } from '../ui/Marks.tsx'
import { Section } from '../layout/Section.tsx'

const features = [
  {
    title: 'Reach Talent',
    text: 'Connect with qualified professionals across multiple specialties.',
    icon: <PeopleIcon />,
  },
  {
    title: 'Streamline Hiring',
    text: 'Manage open roles and candidates with a clear, efficient workflow.',
    icon: <FlowIcon />,
  },
  {
    title: 'Showcase Your Organization',
    text: 'Highlight your culture, benefits and opportunities to attract top talent.',
    icon: <BuildingIcon />,
  },
]

export function PlatformSection() {
  return (
    <Section id="features" labelledBy="platform-heading" className="bg-accent-surface">
      <div className="mx-auto w-[min(75rem,100%)]">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <Eyebrow>The platform</Eyebrow>
            <h2 id="platform-heading" className="mt-4 text-balance text-4xl leading-[1.1] sm:text-5xl">
              A simpler way to connect with healthcare talent.
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              A modern recruitment platform designed for healthcare organizations and professionals.
            </p>
          </div>
          <div className="grid grid-cols-3 items-end gap-3">
            <img
              src="/images/hospitals/ridgeway.jpg"
              alt="Open ward with empty beds and privacy curtains"
              loading="lazy"
              className="col-span-1 aspect-[3/4] w-full rounded-2xl object-cover"
            />
            <img
              src="/images/clinicians-review.jpg"
              alt="Two clinicians in white coats review a scan together in a bright office."
              loading="lazy"
              className="col-span-1 aspect-[3/4] w-full translate-y-6 rounded-2xl object-cover"
            />
            <img
              src="/images/hospitals/harborlight.jpg"
              alt="Empty, brightly lit procedure room"
              loading="lazy"
              className="col-span-1 aspect-[3/4] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
        <ul id="solutions" className="mt-16 grid gap-10 scroll-mt-24 md:grid-cols-3 md:gap-0">
          {features.map((feature, index) => (
            <li
              key={feature.title}
              className={index > 0 ? 'md:border-l md:border-border md:pl-8' : 'md:pr-8'}
            >
              <div className="text-primary">{feature.icon}</div>
              <h3 className="mt-4 font-sans text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed">{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <circle cx="12" cy="11" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="21" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 23c1-3.5 3.2-5 6-5s5 1.5 6 5M18 23c.4-2 1.8-3.5 3.8-3.5 2 0 3.4 1.2 4.2 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FlowIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <path d="M6 16h14M16 10l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <path d="M6 26V12l10-6 10 6v14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 26v-6h6v6M12 16h2M18 16h2M12 20h2M18 20h2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
