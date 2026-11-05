import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { FilterDrawer } from '../components/jobs/FilterDrawer.tsx'
import { HorizontalJobCard } from '../components/jobs/HorizontalJobCard.tsx'
import { JobFilterGroups } from '../components/jobs/JobFilterGroups.tsx'
import { Container } from '../components/layout/Container.tsx'
import { Button } from '../components/ui/Button.tsx'
import { jobs } from '../data/jobs.ts'
import { ArrowIcon, Eyebrow, SearchIcon } from '../components/ui/Marks.tsx'
import {
  activeFilterCount,
  cloneFilters,
  emptyFilters,
  filterBoardJobs,
  pageOf,
  popularSearches,
  readJobSearch,
  sortBoardJobs,
  toBoardJobs,
  uniqueSorted,
  writeJobSearch,
  type JobFilters,
  type JobSort,
} from '../lib/jobBoard.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

const catalog = toBoardJobs(jobs)
const specialties = uniqueSorted(catalog.map((job) => job.specialty))
const locations = uniqueSorted(catalog.map((job) => job.location))

export function JobsPage() {
  const resultsRef = useRef<HTMLElement>(null)
  const didMount = useRef(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const board = useMemo(
    () => readJobSearch(searchParams, { specialties, locations }),
    [searchParams],
  )
  const { query, filters, sort, page } = board
  const [queryDraft, setQueryDraft] = useState(query)
  const [draftFilters, setDraftFilters] = useState<JobFilters>(emptyFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useDocumentTitle('Job board · MediHire')

  const filtered = useMemo(
    () => sortBoardJobs(filterBoardJobs(catalog, query, filters), sort),
    [query, filters, sort],
  )
  const paged = pageOf(filtered, page)
  const selectedCount = activeFilterCount(filters)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    resultsRef.current?.scrollIntoView({ block: 'start' })
  }, [page])

  useEffect(() => {
    setQueryDraft(query)
  }, [query])

  useEffect(() => {
    if (page > 1 && (paged.pageCount === 0 || page > paged.pageCount)) {
      setSearchParams(
        writeJobSearch({ query, filters, sort, page: Math.max(paged.pageCount, 1) }),
        { replace: true, preventScrollReset: true },
      )
    }
  }, [page, paged.pageCount, query, filters, sort, setSearchParams])

  function commit(next: { query?: string; filters?: JobFilters; sort?: JobSort; page?: number }) {
    setSearchParams(
      writeJobSearch({
        query: next.query ?? query,
        filters: next.filters ?? filters,
        sort: next.sort ?? sort,
        page: next.page ?? 1,
      }),
      { preventScrollReset: true },
    )
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = queryDraft.trim()
    setQueryDraft(next)
    commit({ query: next, page: 1 })
  }

  function applyFilters(next: JobFilters) {
    commit({ filters: next, page: 1 })
  }

  function resetBoard() {
    setQueryDraft('')
    setDraftFilters(emptyFilters)
    setDrawerOpen(false)
    setSearchParams(new URLSearchParams(), { preventScrollReset: true })
  }

  function openDrawer() {
    setDraftFilters(cloneFilters(filters))
    setDrawerOpen(true)
  }

  function applyDrawer() {
    applyFilters(cloneFilters(draftFilters))
    setDrawerOpen(false)
  }

  const chips = [
    ...(query
      ? [
          {
            id: 'search',
            label: `Search: ${query}`,
            removeLabel: `Remove search for ${query}`,
            remove: () => {
              setQueryDraft('')
              commit({ query: '', page: 1 })
            },
          },
        ]
      : []),
    ...filters.specialties.map((value) => ({
      id: `specialty-${value}`,
      label: value,
      removeLabel: `Remove ${value} specialty`,
      remove: () =>
        applyFilters({
          ...filters,
          specialties: filters.specialties.filter((item) => item !== value),
        }),
    })),
    ...filters.locations.map((value) => ({
      id: `location-${value}`,
      label: value,
      removeLabel: `Remove ${value} location`,
      remove: () =>
        applyFilters({
          ...filters,
          locations: filters.locations.filter((item) => item !== value),
        }),
    })),
    ...filters.arrangements.map((value) => ({
      id: `arrangement-${value}`,
      label: value,
      removeLabel: `Remove ${value} work arrangement`,
      remove: () =>
        applyFilters({
          ...filters,
          arrangements: filters.arrangements.filter((item) => item !== value),
        }),
    })),
    ...filters.employmentTypes.map((value) => ({
      id: `employment-${value}`,
      label: value,
      removeLabel: `Remove ${value} employment type`,
      remove: () =>
        applyFilters({
          ...filters,
          employmentTypes: filters.employmentTypes.filter((item) => item !== value),
        }),
    })),
  ]

  const countText =
    filtered.length === 0
      ? 'No roles match these filters.'
      : `Showing ${paged.start}–${paged.end} of ${filtered.length} roles`

  function searchFor(term: string) {
    setQueryDraft(term)
    commit({ query: term, page: 1 })
  }

  return (
    <>
      <section className="overflow-hidden bg-accent-surface" aria-labelledby="job-board-heading">
        <Container className="grid items-center gap-10 py-14 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:py-20">
          <div>
            <Eyebrow>Find your next opportunity</Eyebrow>
            <h1 id="job-board-heading" className="mt-4 text-balance text-5xl leading-[1.05] sm:text-6xl">
              Healthcare Jobs
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed">
              Explore opportunities across leading healthcare organizations. These roles are fictional sample listings.
            </p>
            <form
              role="search"
              className="mt-8 rounded-2xl border border-border bg-white p-3 shadow-sm"
              onSubmit={applySearch}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label htmlFor="job-search" className="sr-only">
                  Job title, specialty, or keyword
                </label>
                <span className="flex min-h-12 flex-1 items-center gap-2 rounded-xl px-3 text-muted">
                  <SearchIcon />
                  <input
                    id="job-search"
                    name="q"
                    type="search"
                    value={queryDraft}
                    onChange={(event) => setQueryDraft(event.target.value)}
                    placeholder="Search job title, specialty or keyword"
                    autoComplete="off"
                    className="min-h-11 w-full bg-transparent text-base text-heading outline-none placeholder:text-muted"
                  />
                </span>
                <Button type="submit" className="!rounded-xl sm:min-w-28">
                  Search
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 px-2 pb-1">
                <span className="text-xs font-semibold text-muted">Popular searches:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="min-h-9 rounded-full border border-border bg-white px-3 text-xs font-semibold text-heading hover:bg-accent-surface"
                    onClick={() => searchFor(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>
          <img
            src="/images/hospitals/northcedar.jpg"
            alt="Corner of a modern glass building under a blue sky."
            className="curve-sweep hidden min-h-80 w-full object-cover object-[center_45%] lg:block"
          />
        </Container>
      </section>

      <section
        ref={resultsRef}
        aria-labelledby="job-results-heading"
        className="scroll-mt-24 border-t border-border"
      >
        <Container className="py-10 lg:py-14">
          <div className="mb-6 lg:hidden">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              aria-expanded={drawerOpen}
              aria-controls={drawerOpen ? 'job-filter-drawer' : undefined}
              onClick={openDrawer}
            >
              Filters{selectedCount > 0 ? ` (${selectedCount})` : ''}
            </Button>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <aside aria-labelledby="job-filters-heading" className="hidden lg:block">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 id="job-filters-heading" className="font-sans text-lg font-semibold">
                    Filters
                  </h2>
                  <button
                    type="button"
                    className="text-sm font-semibold text-primary hover:text-primary-hover"
                    onClick={resetBoard}
                  >
                    Clear All
                  </button>
                </div>
                <div className="mt-5 border-t border-border pt-5">
                  <JobFilterGroups
                    idPrefix="desktop"
                    values={filters}
                    specialties={specialties}
                    locations={locations}
                    onChange={applyFilters}
                  />
                </div>
              </div>
            </aside>

            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 id="job-results-heading" className="sr-only">
                  Open roles
                </h2>
                <p aria-live="polite" aria-atomic="true" className="text-sm font-semibold text-heading">
                  {filtered.length} sample {filtered.length === 1 ? 'role' : 'roles'}
                  <span className="sr-only">. {countText}</span>
                </p>
                <label htmlFor="job-sort" className="inline-flex items-center gap-2 text-sm font-semibold text-heading">
                  Sort
                  <select
                    id="job-sort"
                    name="sort"
                    value={sort}
                    onChange={(event) => commit({ sort: event.target.value as JobSort, page: 1 })}
                    className="min-h-10 rounded-lg border border-border bg-white px-3 text-sm font-medium text-heading"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="title">Title A–Z</option>
                    <option value="hospital">Hospital A–Z</option>
                    <option value="location">Location A–Z</option>
                  </select>
                </label>
              </div>

              {chips.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <ul className="flex flex-wrap gap-2" aria-label="Active filters">
                    {chips.map((chip) => (
                      <li key={chip.id}>
                        <button
                          type="button"
                          aria-label={chip.removeLabel}
                          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-accent-surface px-3 text-sm font-semibold text-heading"
                          onClick={chip.remove}
                        >
                          <span aria-hidden="true">{chip.label}</span>
                          <span aria-hidden="true">×</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="min-h-11 px-2 text-sm font-semibold text-primary hover:text-primary-hover"
                    onClick={resetBoard}
                  >
                    Clear all
                  </button>
                </div>
              ) : null}

              {paged.items.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-border bg-white px-6 py-14 text-center shadow-sm">
                  <h3 className="text-3xl">No matching roles</h3>
                  <p className="mx-auto mt-3 max-w-md leading-relaxed">
                    Nothing in the sample board matches this search. Try another keyword, or
                    reset the filters to see every listing.
                  </p>
                  <Button className="mt-6" onClick={resetBoard}>
                    Reset filters
                  </Button>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {paged.items.map((job) => (
                    <li key={job.slug}>
                      <HorizontalJobCard job={job} />
                    </li>
                  ))}
                </ul>
              )}

              {paged.pageCount > 1 ? (
                <nav aria-label="Job results pages" className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="!rounded-full"
                    aria-label="Previous page"
                    disabled={paged.current <= 1}
                    onClick={() => commit({ page: paged.current - 1 })}
                  >
                    <ArrowIcon className="rotate-180" />
                  </Button>
                  {Array.from({ length: paged.pageCount }, (_, index) => {
                    const pageNumber = index + 1
                    const current = pageNumber === paged.current

                    return (
                      <Button
                        key={pageNumber}
                        variant={current ? 'primary' : 'secondary'}
                        size="icon"
                        className="!rounded-lg"
                        aria-current={current ? 'page' : undefined}
                        aria-label={`Page ${pageNumber}`}
                        onClick={() => commit({ page: pageNumber })}
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="!rounded-full"
                    aria-label="Next page"
                    disabled={paged.current >= paged.pageCount}
                    onClick={() => commit({ page: paged.current + 1 })}
                  >
                    <ArrowIcon />
                  </Button>
                </nav>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <FilterDrawer
        open={drawerOpen}
        dialogId="job-filter-drawer"
        onApply={applyDrawer}
        onClear={() => setDraftFilters(emptyFilters)}
        onClose={() => setDrawerOpen(false)}
      >
        <JobFilterGroups
          idPrefix="drawer"
          values={draftFilters}
          specialties={specialties}
          locations={locations}
          onChange={setDraftFilters}
        />
      </FilterDrawer>
    </>
  )
}
