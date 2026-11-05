import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { HospitalFilterGroups } from '../components/hospitals/HospitalFilterGroups.tsx'
import { Container } from '../components/layout/Container.tsx'
import { FilterDrawer } from '../components/jobs/FilterDrawer.tsx'
import { Button, ButtonLink } from '../components/ui/Button.tsx'
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
      <section aria-labelledby="hospitals-heading">
        <Container className="py-16 lg:py-24">
          <h1 id="hospitals-heading" className="max-w-3xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            The hospital directory
          </h1>
          <p className="mt-6 max-w-[65ch] text-lg leading-relaxed">
            Fictional hospitals, and the sample roles attached to each one. These are not partner
            health systems.
          </p>
          <form role="search" className="mt-10 max-w-3xl" onSubmit={applySearch}>
            <label htmlFor="hospital-search" className="text-sm font-medium">
              Hospital name, city, or specialty
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                id="hospital-search"
                name="q"
                type="search"
                value={queryDraft}
                onChange={(event) => setQueryDraft(event.target.value)}
                placeholder="Seattle, pediatrics, imaging"
                autoComplete="off"
                className="min-h-12 w-full flex-1 border border-border bg-transparent px-3 text-base text-heading placeholder:text-muted"
              />
              <Button type="submit" className="sm:min-w-28">
                Search
              </Button>
            </div>
          </form>
        </Container>
      </section>

      <section aria-labelledby="hospital-results-heading" className="border-t border-primary/10">
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

          <div className="grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside
              aria-labelledby="hospital-filters-heading"
              className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100svh-6rem)] lg:overflow-y-auto lg:bg-accent-surface lg:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 id="hospital-filters-heading" className="font-sans text-lg">
                  Filters
                </h2>
                <button
                  type="button"
                  className="min-h-11 text-sm underline-offset-4 hover:underline"
                  onClick={resetDirectory}
                >
                  Clear all
                </button>
              </div>
              <div className="mt-5 border-t border-primary/10 pt-5">
                <HospitalFilterGroups
                  idPrefix="hospital-desktop"
                  values={filters}
                  locations={locations}
                  specialties={specialties}
                  onChange={(next) => commit({ filters: next })}
                />
              </div>
            </aside>
            <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="hospital-results-heading" className="sr-only">
                Hospitals
              </h2>
              <p aria-live="polite" aria-atomic="true" className="mt-2">
                {countText}
              </p>
            </div>
            <label htmlFor="hospital-sort" className="inline-flex items-center gap-2 text-sm">
              Sort
              <select
                id="hospital-sort"
                name="sort"
                value={sort}
                onChange={(event) => commit({ sort: event.target.value as HospitalSort })}
                className="min-h-11 rounded border border-border bg-transparent px-3 text-sm text-heading"
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
                      className="inline-flex min-h-11 items-center gap-2 border border-primary/15 bg-accent-surface px-3 text-sm"
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
                className="min-h-11 px-2 text-sm underline-offset-4 hover:underline"
                onClick={resetDirectory}
              >
                Clear all
              </button>
            </div>
          ) : null}

          {results.length === 0 ? (
            <div className="mt-8 border-t border-primary/10 py-14">
              <h3 className="text-3xl">No matching hospitals</h3>
              <p className="mt-3 max-w-md leading-relaxed">
                Nothing in the sample directory matches this search. Try another city or specialty,
                or clear the filters to see every hospital.
              </p>
              <Button className="mt-6" onClick={resetDirectory}>
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="mt-8 border-t border-primary/10">
              {results.map((hospital) => (
                <li key={hospital.slug} className="border-b border-primary/10 py-10">
                  <article className="grid gap-6 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:items-center">
                    <img
                      src={hospital.image}
                      alt={hospital.imageAlt}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div>
                      <p className="text-sm text-muted">{hospital.type}</p>
                      <h3 className="mt-2 text-3xl leading-tight">
                        <Link
                          to={`/hospitals/${hospital.slug}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {hospital.name}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm">{locationLabel(hospital)}</p>
                      <p className="mt-4 max-w-[65ch] leading-relaxed">{hospital.summary}</p>
                      <p className="mt-3 text-sm text-muted">{hospital.focusAreas.join(', ')}</p>
                      <p className="mt-4 text-sm">
                        {hospital.openJobs} open {hospital.openJobs === 1 ? 'role' : 'roles'}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-accent-surface" aria-labelledby="hospital-jobs-cta">
        <Container className="py-16">
          <h2 id="hospital-jobs-cta" className="max-w-xl text-4xl leading-[1.08] sm:text-5xl">
            See the roles at these hospitals
          </h2>
          <p className="mt-4 max-w-[65ch] text-lg leading-relaxed">
            Every open-role count comes from the sample job board.
          </p>
          <div className="mt-8">
            <ButtonLink to="/jobs">Explore the job board</ButtonLink>
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
