import { type ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

type SectionProps = {
  children: ReactNode
  className?: string
  id?: string
  labelledBy?: string
}

export function Section({ children, className, id, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('section-space scroll-mt-20', className)}>
      {children}
    </section>
  )
}
