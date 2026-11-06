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
  'inline-flex items-center justify-center rounded-full font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-40'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary text-heading shadow-[0_0_28px_-8px_rgba(53,104,255,0.9)] hover:bg-primary-hover',
  secondary: 'border border-border bg-transparent text-heading hover:bg-surface',
  ghost: 'text-accent underline-offset-4 hover:underline',
  inverse: 'bg-heading text-background hover:bg-accent',
  inverseQuiet: 'border border-heading bg-transparent text-heading hover:bg-heading hover:text-background',
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
