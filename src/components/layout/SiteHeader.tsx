import { useEffect, useId, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { cn } from '../../lib/cn.ts'
import { Container } from './Container.tsx'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/jobs', label: 'Job board', end: false },
  { to: '/hospitals', label: 'Hospitals', end: false },
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
    const media = window.matchMedia('(min-width: 48rem)')

    function onChange() {
      if (media.matches) setOpen(false)
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="font-serif text-2xl text-heading">
            MediHire
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => linkClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-heading md:hidden"
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
          className={open ? 'border-t border-border py-3 md:hidden' : 'hidden'}
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => cn(linkClass(isActive), 'block')}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
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
