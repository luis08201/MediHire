import { Link } from 'react-router'
import { Container } from './Container.tsx'

const columns = [
  {
    title: 'Explore',
    links: [
      { to: '/', label: 'Home' },
      { to: '/#how-it-works', label: 'How it works' },
      { to: '/jobs', label: 'Jobs' },
      { to: '/hospitals', label: 'Hospitals' },
    ],
  },
  {
    title: 'Product',
    links: [
      { to: '/#features', label: 'Features' },
      { to: '/#pricing', label: 'Pricing' },
      { to: '/#demo', label: 'Book a demo' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.7fr))]">
          <div className="max-w-sm">
            <p className="font-serif text-2xl text-heading">MediHire</p>
            <p className="mt-3 leading-relaxed">
              A fictional healthcare recruitment concept for clinicians and the
              teams who hire them.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-sm font-semibold text-heading">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-body hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 max-w-3xl text-sm leading-relaxed text-muted">
          MediHire is a fictional preview. Hospitals and roles are sample data.
          Photography is for atmosphere and does not show customers or partner
          facilities. No personal information is collected.
        </p>
      </Container>
    </footer>
  )
}
