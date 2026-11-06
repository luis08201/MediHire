import { type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { emptyFilters, popularSearches, writeJobSearch } from '../../lib/jobBoard.ts'
import { Button } from '../ui/Button.tsx'

function searchFor(query: string) {
  return writeJobSearch({
    query,
    filters: emptyFilters,
    sort: 'recommended',
    page: 1,
  }).toString()
}

export function HeroSearch() {
  const navigate = useNavigate()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const query = String(data.get('q') ?? '')
    navigate({ pathname: '/jobs', search: searchFor(query) })
  }

  return (
    <form role="search" className="mt-8 w-full max-w-xl" onSubmit={onSubmit}>
      <label htmlFor="hero-search" className="text-sm font-medium">
        Job title, specialty, or keyword
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="hero-search"
          name="q"
          type="search"
          placeholder="Registered nurse, pharmacy, Seattle"
          autoComplete="off"
          className="field"
        />
        <Button type="submit" className="sm:min-w-28">
          Search
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Popular searches</span>
        {popularSearches.map((term) => (
          <Link
            key={term}
            to={{ pathname: '/jobs', search: searchFor(term) }}
            className="inline-flex min-h-11 items-center rounded-md border border-border bg-soft px-4 text-sm text-heading"
          >
            {term}
          </Link>
        ))}
      </div>
    </form>
  )
}
