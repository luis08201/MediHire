import { type ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return <div className={cn('content-wrap', className)}>{children}</div>
}
