import { type ReactNode } from 'react'
import { useDocumentTitle } from '../../lib/useDocumentTitle.ts'
import { Container } from './Container.tsx'
import { Section } from './Section.tsx'

type PageScaffoldProps = {
  eyebrow?: string
  title: string
  description: string
  children?: ReactNode
}

export function PageScaffold({ eyebrow, title, description, children }: PageScaffoldProps) {
  useDocumentTitle(`${title} · MediHire`)

  return (
    <Section>
      <Container>
        <header className="max-w-3xl">
          {eyebrow ? <p className="text-sm font-semibold text-accent">{eyebrow}</p> : null}
          <h1 className={eyebrow ? 'mt-3 text-4xl sm:text-5xl' : 'text-4xl sm:text-5xl'}>
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed">{description}</p>
        </header>
        {children ? <div className="mt-12">{children}</div> : null}
      </Container>
    </Section>
  )
}
