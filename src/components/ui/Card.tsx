import { type ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn.ts'

type CardProps = {
  title: string
  href?: string
  eyebrow?: string
  description?: string
  meta?: string
  children?: ReactNode
  className?: string
}

export function Card({
  title,
  href,
  eyebrow,
  description,
  meta,
  children,
  className,
}: CardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-md border border-border bg-background p-6',
        className,
      )}
    >
      {eyebrow ? <p className="text-sm text-muted">{eyebrow}</p> : null}
      <h3 className={cn('text-2xl', eyebrow && 'mt-2')}>
        {href ? (
          <Link
            to={href}
            className="text-heading underline decoration-accent underline-offset-4"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      {description ? <p className="mt-3 leading-relaxed">{description}</p> : null}
      {meta ? <p className="mt-4 text-sm text-muted">{meta}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  )
}
