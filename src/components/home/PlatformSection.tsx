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
          <div className="relative mx-auto h-64 w-full max-w-md sm:h-72">
            <img
              src="/images/hospitals/ridgeway.jpg"
              alt="A glass tower with a pale panel facade."
              loading="lazy"
              className="absolute top-8 left-0 z-0 h-40 w-[48%] rounded-2xl object-cover shadow-[0_16px_30px_-18px_rgba(20,45,53,0.55)] sm:h-48"
            />
            <img
              src="/images/nurse-teal.jpg"
              alt="A clinician in teal scrubs smiles toward the camera."
              loading="lazy"
              className="absolute top-0 left-1/2 z-20 h-48 w-[44%] -translate-x-1/2 rounded-2xl object-cover object-[center_30%] shadow-[0_18px_36px_-16px_rgba(20,45,53,0.55)] sm:h-56"
            />
            <img
              src="/images/hospitals/northcedar.jpg"
              alt="Corner of a modern glass building under a blue sky."
              loading="lazy"
              className="absolute right-0 bottom-0 z-10 h-40 w-[48%] rounded-2xl object-cover object-[78%_22%] shadow-[0_16px_30px_-18px_rgba(20,45,53,0.55)] sm:h-48"
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
