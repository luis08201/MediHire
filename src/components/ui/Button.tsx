import { type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'inverseQuiet'
type Size = 'md' | 'sm' | 'icon'

type ButtonStyleProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center rounded font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40'

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-background hover:bg-primary-hover',
  secondary: 'border border-border bg-transparent text-heading hover:bg-accent-surface',
  ghost: 'text-primary underline-offset-4 hover:underline',
  inverse: 'bg-background text-primary hover:bg-accent-surface',
  inverseQuiet: 'border border-background bg-transparent text-background hover:bg-background hover:text-primary',
}

const sizeClass: Record<Size, string> = {
  md: 'min-h-11 px-5 text-sm',
  sm: 'min-h-10 px-4 text-sm',
  icon: 'size-11 p-0',
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
