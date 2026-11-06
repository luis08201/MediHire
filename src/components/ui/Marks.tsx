import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2 text-heading', className)}>
      <span className="text-accent">
        <CrossIcon />
      </span>
      <span className="font-heading text-lg leading-none font-semibold tracking-tight">MediHire</span>
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
