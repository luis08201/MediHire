import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

const steps = [
  {
    number: '01',
    title: 'Discover opportunities',
    copy: 'Start with a role or a hospital. Every sample listing shows the department, the schedule, and where the work happens.',
  },
  {
    number: '02',
    title: 'Connect with the right teams',
    copy: 'Move from a posting to the hospital behind it, or from a hospital to the roles on that site. The link between them is the product.',
  },
  {
    number: '03',
    title: 'Move forward with confidence',
    copy: 'Read the responsibilities beside the setting. This preview ends there. It does not take résumés, book interviews, or ask for contact details.',
  },
]

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" labelledBy="how-heading">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-accent">How MediHire works</p>
          <h2 id="how-heading" className="mt-4 text-balance text-4xl sm:text-5xl">
            Three steps. No account.
          </h2>
        </div>
        <ol className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col rounded-2xl border border-border bg-white p-8 shadow-[0_16px_40px_-30px_rgba(20,45,53,0.45)]"
            >
              <p className="font-serif text-5xl text-primary">{step.number}</p>
              <h3 className="mt-8 text-2xl">{step.title}</h3>
              <p className="mt-4 leading-relaxed">{step.copy}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
