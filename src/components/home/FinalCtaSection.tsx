import { ButtonLink } from '../ui/Button.tsx'
import { Container } from '../layout/Container.tsx'

export function FinalCtaSection() {
  return (
    <section
      id="features"
      className="section-space scroll-mt-32 bg-soft"
      aria-labelledby="preview-heading"
    >
      <div id="solutions" className="scroll-mt-32" />
      <div id="pricing" className="scroll-mt-32" />
      <div id="demo" className="scroll-mt-32" />
      <Container>
        <h2 id="preview-heading" className="max-w-xl text-4xl leading-[1.08] sm:text-5xl">
          A note on this preview.
        </h2>
        <p className="mt-6 max-w-[65ch] text-lg leading-relaxed">
          There is nothing to buy and no demo to book. Hospitals and roles are sample data.
          Photography is atmosphere, not a partner facility. No personal information is collected.
        </p>
        <div className="mt-8">
          <ButtonLink to="/jobs">Explore Jobs</ButtonLink>
        </div>
      </Container>
    </section>
  )
}
