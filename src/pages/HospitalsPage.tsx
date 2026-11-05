import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { HospitalFilterGroups } from '../components/hospitals/HospitalFilterGroups.tsx'
import { Container } from '../components/layout/Container.tsx'
import { FilterDrawer } from '../components/jobs/FilterDrawer.tsx'
import { Button, ButtonLink } from '../components/ui/Button.tsx'
import { ArrowIcon, Eyebrow, PinIcon, SearchIcon } from '../components/ui/Marks.tsx'
import { hospitals } from '../data/hospitals.ts'
import { jobs } from '../data/jobs.ts'
import {
  cloneHospitalFilters,
  emptyHospitalFilters,
  filterHospitals,
  locationLabel,
  readHospitalSearch,
  sortHospitals,
  toDirectory,
  uniqueSorted,
  writeHospitalSearch,
  type HospitalFilters,
  type HospitalSort,
} from '../lib/hospitalDirectory.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

const directory = toDirectory(hospitals, jobs)
const locations = uniqueSorted(directory.map((hospital) => locationLabel(hospital)))
const specialties = uniqueSorted(directory.flatMap((hospital) => hospital.focusAreas))

export function HospitalsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const directoryState = useMemo(
    () => readHospitalSearch(searchParams, { locations, specialties }),
    [searchParams],
  )
  const { query, filters, sort } = directoryState
  const [queryDraft, setQueryDraft] = useState(query)
  const [draftFilters, setDraftFilters] = useState<HospitalFilters>(emptyHospitalFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useDocumentTitle('Hospitals · MediHire')

  const results = useMemo(
    () => sortHospitals(filterHospitals(directory, query, filters), sort),
    [query, filters, sort],
  )
  const selectedCount = filters.locations.length + filters.specialties.length

  useEffect(() => {
    setQueryDraft(query)
  }, [query])

  function commit(next: { query?: string; filters?: HospitalFilters; sort?: HospitalSort }) {
    setSearchParams(
      writeHospitalSearch({
        query: next.query ?? query,
        filters: next.filters ?? filters,
        sort: next.sort ?? sort,
      }),
      { preventScrollReset: true },
    )
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = queryDraft.trim()
    setQueryDraft(next)
    commit({ query: next })
  }

  function resetDirectory() {
    setQueryDraft('')
    setDraftFilters(emptyHospitalFilters)
    setDrawerOpen(false)
    setSearchParams(new URLSearchParams(), { preventScrollReset: true })
  }

  function openDrawer() {
    setDraftFilters(cloneHospitalFilters(filters))
    setDrawerOpen(true)
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
              commit({ query: '' })
            },
          },
        ]
      : []),
    ...filters.locations.map((value) => ({
      id: `location-${value}`,
      label: value,
      removeLabel: `Remove ${value}`,
      remove: () =>
        commit({
          filters: {
            ...filters,
            locations: filters.locations.filter((item) => item !== value),
          },
        }),
    })),
    ...filters.specialties.map((value) => ({
      id: `specialty-${value}`,
      label: value,
      removeLabel: `Remove ${value}`,
      remove: () =>
        commit({
          filters: {
            ...filters,
            specialties: filters.specialties.filter((item) => item !== value),
          },
        }),
    })),
  ]

  const countText =
    results.length === 0
      ? 'No hospitals match these filters.'
      : `Showing ${results.length} of ${directory.length} hospitals`

  return (
    <>
      <section className="overflow-hidden bg-accent-surface" aria-labelledby="hospitals-heading">
        <Container className="grid items-center gap-10 py-14 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:py-20">
          <div>
            <Eyebrow>Hospital directory</Eyebrow>
            <h1 id="hospitals-heading" className="mt-4 text-balance text-5xl leading-[1.05] sm:text-6xl">
              Discover hospitals shaping the future of care
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed">
              Browse six fictional hospitals and the sample roles attached to each site. These are not partner health systems.
            </p>
            <form
              role="search"
              className="mt-8 rounded-2xl border border-border bg-white p-3 shadow-sm"
              onSubmit={applySearch}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label htmlFor="hospital-search" className="sr-only">
                  Hospital name, city, or specialty
                </label>
                <span className="flex min-h-12 flex-1 items-center gap-2 px-3 text-muted">
                  <SearchIcon />
                  <input
                    id="hospital-search"
                    name="q"
                    type="search"
                    value={queryDraft}
                    onChange={(event) => setQueryDraft(event.target.value)}
                    placeholder="Search hospital, city, or specialty"
                    autoComplete="off"
                    className="min-h-11 w-full bg-transparent text-base text-heading outline-none placeholder:text-muted"
                  />
                </span>
                <Button type="submit" className="!rounded-xl sm:min-w-28">
                  Search
                </Button>
              </div>
            </form>
          </div>
          <img
            src="/images/hospitals/northcedar.jpg"
            alt="Corner of a modern glass building under a blue sky."
            className="curve-sweep hidden min-h-80 w-full object-cover object-[center_40%] lg:block"
          />
        </Container>
      </section>

      <section aria-labelledby="hospital-results-heading" className="border-t border-border">
        <Container className="py-10 lg:py-14">
          <div className="mb-6 lg:hidden">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              aria-expanded={drawerOpen}
              aria-controls={drawerOpen ? 'hospital-filter-drawer' : undefined}
              onClick={openDrawer}
            >
              Filters{selectedCount > 0 ? ` (${selectedCount})` : ''}
            </Button>
          </div>

          <div className="hidden rounded-2xl border border-border bg-white p-6 shadow-sm lg:block">
            <h2 className="font-sans text-lg font-semibold">Filters</h2>
            <div className="mt-6">
              <HospitalFilterGroups
                idPrefix="hospital-desktop"
                values={filters}
                locations={locations}
                specialties={specialties}
                onChange={(next) => commit({ filters: next })}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="hospital-results-heading" className="text-3xl">
                Hospitals
              </h2>
              <p aria-live="polite" aria-atomic="true" className="mt-2">
                {countText}
              </p>
            </div>
            <label htmlFor="hospital-sort" className="inline-flex items-center gap-2 text-sm font-semibold text-heading">
              Sort
              <select
                id="hospital-sort"
                name="sort"
                value={sort}
                onChange={(event) => commit({ sort: event.target.value as HospitalSort })}
                className="min-h-11 rounded-lg border border-border bg-white px-3 text-sm font-medium text-heading"
              >
                <option value="recommended">Recommended</option>
                <option value="name">Name A–Z</option>
                <option value="location">Location A–Z</option>
                <option value="jobs">Open roles</option>
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
                onClick={resetDirectory}
              >
                Clear all
              </button>
            </div>
          ) : null}

          {results.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-border bg-white px-6 py-14 text-center shadow-sm">
              <h3 className="text-3xl">No matching hospitals</h3>
              <p className="mx-auto mt-3 max-w-md leading-relaxed">
                Nothing in the sample directory matches this search. Try another city or specialty,
                or clear the filters to see every hospital.
              </p>
              <Button className="mt-6" onClick={resetDirectory}>
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {results.map((hospital) => (
                <li key={hospital.slug}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                    <img
                      src={hospital.image}
                      alt={hospital.imageAlt}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                        {hospital.type}
                      </p>
                      <h3 className="mt-2 text-2xl leading-tight">
                        <Link to={`/hospitals/${hospital.slug}`} className="hover:text-primary">
                          {hospital.name}
                        </Link>
                      </h3>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-body">
                        <PinIcon />
                        {locationLabel(hospital)}
                      </p>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed">{hospital.summary}</p>
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Specialties">
                        {hospital.focusAreas.map((area) => (
                          <li
                            key={area}
                            className="rounded-full bg-accent-surface px-2.5 py-1 text-xs font-semibold text-primary"
                          >
                            {area}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <p className="text-sm font-semibold text-heading">
                          {hospital.openJobs} open {hospital.openJobs === 1 ? 'role' : 'roles'}
                        </p>
                        <ButtonLink to={`/hospitals/${hospital.slug}`} variant="secondary" size="sm" className="!rounded-full">
                          View Hospital
                          <ArrowIcon />
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section className="bg-background" aria-labelledby="hospital-jobs-cta">
        <Container className="py-12 lg:py-16">
          <div className="overflow-hidden rounded-[1.75rem] bg-primary px-8 py-12 sm:px-12">
            <h2 id="hospital-jobs-cta" className="max-w-xl text-balance text-4xl leading-[1.1] text-white sm:text-5xl">
              See the roles at these hospitals
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-accent-surface">
              Every open-role count comes from the sample job board.
            </p>
            <ButtonLink to="/jobs" variant="inverse" className="mt-8 !rounded-full">
              Explore Opportunities
            </ButtonLink>
          </div>
        </Container>
      </section>
      <FilterDrawer
        open={drawerOpen}
        dialogId="hospital-filter-drawer"
        onApply={() => {
          commit({ filters: cloneHospitalFilters(draftFilters) })
          setDrawerOpen(false)
        }}
        onClear={() => setDraftFilters(emptyHospitalFilters)}
        onClose={() => setDrawerOpen(false)}
      >
        <HospitalFilterGroups
          idPrefix="hospital-drawer"
          values={draftFilters}
          locations={locations}
          specialties={specialties}
          onChange={setDraftFilters}
        />
      </FilterDrawer>
    </>
  )
}
