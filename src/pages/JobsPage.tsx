import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { FilterDrawer } from '../components/jobs/FilterDrawer.tsx'
import { JobFilterGroups } from '../components/jobs/JobFilterGroups.tsx'
import { Container } from '../components/layout/Container.tsx'
import { Button, ButtonLink } from '../components/ui/Button.tsx'
import { jobs } from '../data/jobs.ts'
import {
  activeFilterCount,
  cloneFilters,
  emptyFilters,
  filterBoardJobs,
  pageOf,
  sortBoardJobs,
  toBoardJobs,
  uniqueSorted,
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
  const [queryDraft, setQueryDraft] = useState('')
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<JobFilters>(emptyFilters)
  const [draftFilters, setDraftFilters] = useState<JobFilters>(emptyFilters)
  const [sort, setSort] = useState<JobSort>('recommended')
  const [page, setPage] = useState(1)
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

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = queryDraft.trim()
    setQueryDraft(next)
    setQuery(next)
    setPage(1)
  }

  function applyFilters(next: JobFilters) {
    setFilters(next)
    setPage(1)
  }

  function resetBoard() {
    setQuery('')
    setQueryDraft('')
    setFilters(emptyFilters)
    setDraftFilters(emptyFilters)
    setSort('recommended')
    setPage(1)
    setDrawerOpen(false)
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
              setQuery('')
              setQueryDraft('')
              setPage(1)
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

  return (
    <>
      <section className="bg-accent-surface" aria-labelledby="job-board-heading">
        <Container className="py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-accent">Job board</p>
            <h1
              id="job-board-heading"
              className="mt-4 text-balance text-4xl sm:text-5xl lg:text-6xl"
            >
              Find your next opportunity in healthcare
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed">
              Search sample roles at fictional hospitals by title, specialty, or location.
              Listings stay in your browser.
            </p>
          </div>
          <form
            role="search"
            className="mt-10 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5"
            onSubmit={applySearch}
          >
            <label htmlFor="job-search" className="text-sm font-semibold text-heading">
              Job title, keyword, or hospital
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="job-search"
                name="q"
                type="search"
                value={queryDraft}
                onChange={(event) => setQueryDraft(event.target.value)}
                placeholder="Nurse, Harborlight, Seattle"
                autoComplete="off"
                className="min-h-12 w-full rounded-lg border border-border bg-white px-4 text-base text-heading placeholder:text-muted"
              />
              <Button type="submit" className="sm:min-w-36">
                Search
              </Button>
            </div>
          </form>
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
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 id="job-filters-heading" className="font-sans text-lg font-semibold">
                  Filters
                </h2>
                <div className="mt-6">
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="job-results-heading" className="text-3xl">
                    Open roles
                  </h2>
                  <p aria-live="polite" aria-atomic="true" className="mt-2">
                    {countText}
                  </p>
                </div>
                <label htmlFor="job-sort" className="text-sm font-semibold text-heading">
                  Sort
                  <select
                    id="job-sort"
                    name="sort"
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value as JobSort)
                      setPage(1)
                    }}
                    className="mt-2 block min-h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-heading sm:w-56"
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
                <ul className="mt-8 space-y-5">
                  {paged.items.map((job) => (
                    <li key={job.slug}>
                      <article className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                        <p className="text-sm font-semibold text-accent">{job.specialty}</p>
                        <h3 className="mt-3 text-3xl">
                          <Link
                            to={`/jobs/${job.slug}`}
                            className="hover:text-primary"
                          >
                            {job.title}
                          </Link>
                        </h3>
                        <p className="mt-3 font-semibold text-heading">
                          <Link
                            to={`/hospitals/${job.hospitalSlug}`}
                            className="hover:text-primary"
                          >
                            {job.hospitalName}
                          </Link>
                        </p>
                        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Role details">
                          {[job.location, job.workArrangement, job.employmentType].map((detail) => (
                            <li
                              key={detail}
                              className="rounded-full bg-accent-surface px-3 py-1 text-sm text-heading"
                            >
                              {detail}
                            </li>
                          ))}
                          {job.salary ? (
                            <li className="rounded-full bg-accent-surface px-3 py-1 text-sm text-heading">
                              {job.salary}
                            </li>
                          ) : null}
                        </ul>
                        <div className="mt-8">
                          <ButtonLink to={`/jobs/${job.slug}`} variant="secondary">
                            View Job
                          </ButtonLink>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}

              {paged.pageCount > 1 ? (
                <nav aria-label="Job results pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={paged.current <= 1}
                    onClick={() => setPage(paged.current - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: paged.pageCount }, (_, index) => {
                    const pageNumber = index + 1
                    const current = pageNumber === paged.current

                    return (
                      <Button
                        key={pageNumber}
                        variant={current ? 'primary' : 'secondary'}
                        size="sm"
                        aria-current={current ? 'page' : undefined}
                        aria-label={`Page ${pageNumber}`}
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={paged.current >= paged.pageCount}
                    onClick={() => setPage(paged.current + 1)}
                  >
                    Next
                  </Button>
                </nav>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <FilterDrawer
        open={drawerOpen}
        values={draftFilters}
        specialties={specialties}
        locations={locations}
        onChange={setDraftFilters}
        onApply={applyDrawer}
        onClear={() => setDraftFilters(emptyFilters)}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}
