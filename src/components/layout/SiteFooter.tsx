import { Link } from 'react-router'
import { Container } from './Container.tsx'

const columns = [
  {
    title: 'Explore',
    links: [
      { to: '/', label: 'Home' },
      { to: '/jobs', label: 'Find Jobs' },
      { to: '/hospitals', label: 'Hospitals' },
    ],
  },
  {
    title: 'This preview',
    links: [
      { to: '/#features', label: 'Features' },
      { to: '/#solutions', label: 'Solutions' },
      { to: '/#pricing', label: 'About this preview' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/10">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.7fr))]">
          <div className="max-w-sm">
            <p className="font-serif text-3xl text-heading">MediHire</p>
            <p className="mt-4 max-w-[40ch] leading-relaxed">
              A fictional healthcare recruitment journal for clinicians and the teams who hire them.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-sm text-muted">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm underline-offset-4 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-16 max-w-[65ch] text-sm leading-relaxed text-muted">
          MediHire is a fictional preview. Hospitals and roles are sample data. Photography is for
          atmosphere and does not show customers or partner facilities. No personal information is
          collected.
        </p>
      </Container>
    </footer>
  )
}
