import { useEffect, useId, useRef } from 'react'
import type { JobFilters } from '../../lib/jobBoard.ts'
import { Button } from '../ui/Button.tsx'
import { JobFilterGroups } from './JobFilterGroups.tsx'

type FilterDrawerProps = {
  open: boolean
  values: JobFilters
  specialties: string[]
  locations: string[]
  onChange: (next: JobFilters) => void
  onApply: () => void
  onClear: () => void
  onClose: () => void
}

export function FilterDrawer({
  open,
  values,
  specialties,
  locations,
  onChange,
  onApply,
  onClear,
  onClose,
}: FilterDrawerProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    function focusable() {
      if (!dialog) return []
      return [...dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea')].filter(
        (element) => !element.hasAttribute('disabled'),
      )
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const items = focusable()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) onCloseRef.current()
    }

    const media = window.matchMedia('(min-width: 64rem)')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    focusable()[0]?.focus()
    document.addEventListener('keydown', onKeyDown)
    media.addEventListener('change', closeOnDesktop)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      media.removeEventListener('change', closeOnDesktop)
      previouslyFocused?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-heading/40"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        id="job-filter-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h2 id={titleId} className="font-sans text-xl font-semibold">
            Filters
          </h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <JobFilterGroups
            idPrefix="drawer"
            values={values}
            specialties={specialties}
            locations={locations}
            onChange={onChange}
          />
        </div>
        <div className="flex gap-3 border-t border-border px-5 py-4">
          <Button variant="secondary" className="flex-1" onClick={onClear}>
            Clear
          </Button>
          <Button className="flex-1" onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
