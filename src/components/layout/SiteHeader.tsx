import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { scrollToId } from '../../lib/scrollToId.ts'
import { cn } from '../../lib/cn.ts'
import { ButtonLink } from '../ui/Button.tsx'
import { Container } from './Container.tsx'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/#features', label: 'Features' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/#pricing', label: 'Pricing' },
] as const

function linkClass(isActive: boolean) {
  return cn(
    'rounded-md px-3 py-2 text-sm font-semibold',
    isActive
      ? 'bg-accent-surface text-primary'
      : 'text-body hover:bg-accent-surface hover:text-heading',
  )
}

export function SiteHeader() {
  const menuId = useId()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 64rem)')

    function onChange() {
      if (media.matches) setOpen(false)
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function handleHashClick(to: string) {
    setOpen(false)
    const hashIndex = to.indexOf('#')
    if (hashIndex === -1 || location.pathname !== '/') return
    scrollToId(to.slice(hashIndex + 1))
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Link to="/" className="font-serif text-2xl text-heading">
            MediHire
          </Link>
          <div className="hidden items-center gap-6 lg:flex">
            <nav aria-label="Primary" className="flex items-center gap-1">
              {links.map((link) => (
                <PrimaryLink key={link.to} to={link.to} end={'end' in link ? link.end : false} onNavigate={handleHashClick}>
                  {link.label}
                </PrimaryLink>
              ))}
            </nav>
            <ButtonLink to="/#demo" onClick={() => handleHashClick('/#demo')}>
              Book a Demo
            </ButtonLink>
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-heading lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        <nav
          id={menuId}
          aria-label="Primary"
          className={open ? 'border-t border-border py-3 lg:hidden' : 'hidden'}
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <PrimaryLink
                  to={link.to}
                  end={'end' in link ? link.end : false}
                  block
                  onNavigate={handleHashClick}
                >
                  {link.label}
                </PrimaryLink>
              </li>
            ))}
          </ul>
          <ButtonLink
            to="/#demo"
            className="mt-3 w-full"
            onClick={() => handleHashClick('/#demo')}
          >
            Book a Demo
          </ButtonLink>
        </nav>
      </Container>
    </header>
  )
}

function PrimaryLink({
  to,
  end,
  block = false,
  onNavigate,
  children,
}: {
  to: string
  end?: boolean
  block?: boolean
  onNavigate: (to: string) => void
  children: string
}) {
  const className = (isActive: boolean) =>
    cn(linkClass(isActive), block && 'flex min-h-11 items-center')

  if (to.includes('#')) {
    return (
      <Link to={to} className={className(false)} onClick={() => onNavigate(to)}>
        {children}
      </Link>
    )
  }

  return (
    <NavLink to={to} end={end} className={({ isActive }) => className(isActive)} onClick={() => onNavigate(to)}>
      {children}
    </NavLink>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}
