import { Link } from 'react-router'
import { Container } from './Container.tsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Job board' },
  { to: '/hospitals', label: 'Hospitals' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="max-w-md">
            <p className="font-serif text-2xl text-heading">MediHire</p>
            <p className="mt-3 leading-relaxed">
              A sample job board and hospital directory for healthcare hiring.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-semibold text-heading hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-10 text-sm text-muted">
          Local sample data only. MediHire does not collect personal information.
        </p>
      </Container>
    </footer>
  )
}
