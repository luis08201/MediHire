import { type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

type ButtonStyleProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors'

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border border-border bg-white text-heading hover:bg-accent-surface',
  ghost: 'text-primary hover:bg-accent-surface',
}

const sizeClass: Record<Size, string> = {
  md: 'min-h-11 px-5 text-sm',
  sm: 'min-h-10 px-4 text-sm',
}

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variantClass[variant], sizeClass[size], className)
}

type ButtonProps = ButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

type ButtonLinkProps = ButtonStyleProps &
  Omit<ComponentProps<typeof Link>, 'className' | 'children'>

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}
