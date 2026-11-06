import { cn } from '../../lib/cn.ts'

export function OrbitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 640" className={cn('text-signal', className)} aria-hidden="true">
      <ellipse
        cx="320"
        cy="320"
        rx="250"
        ry="96"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        transform="rotate(-18 320 320)"
      />
      <ellipse
        cx="320"
        cy="320"
        rx="188"
        ry="72"
        fill="none"
        stroke="#9cb7ff"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        transform="rotate(24 320 320)"
      />
      <circle cx="320" cy="320" r="46" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M320 292v56M292 320h56" fill="none" stroke="#f5f7ff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="548" cy="246" r="6" fill="#9cb7ff" />
      <circle cx="118" cy="390" r="4" fill="currentColor" />
      <rect x="430" y="412" width="54" height="18" rx="9" fill="#151d43" stroke="#9cb7ff" />
    </svg>
  )
}
