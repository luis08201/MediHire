import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5 text-heading', className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-white">
        <CrossIcon />
      </span>
      <span className="font-serif text-[1.65rem] leading-none">MediHire</span>
    </Link>
  )
}

export function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6V4z" fill="currentColor" />
    </svg>
  )
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('size-4', className)} aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CircleArrow({
  to,
  label,
}: {
  to: string
  label: string
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-accent-surface"
    >
      <ArrowIcon />
    </Link>
  )
}

export function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true">
      <path
        d="M5 12.5l4.2 4.2L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">{children}</p>
  )
}
