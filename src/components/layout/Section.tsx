import { type ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

type SectionProps = {
  children: ReactNode
  className?: string
  id?: string
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('section-space', className)}>
      {children}
    </section>
  )
}
