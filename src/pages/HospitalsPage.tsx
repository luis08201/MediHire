import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Container } from '../components/layout/Container.tsx'
import { Button, ButtonLink } from '../components/ui/Button.tsx'
import { hospitals } from '../data/hospitals.ts'
import { jobs } from '../data/jobs.ts'
import {
  emptyHospitalFilters,
  filterHospitals,
  locationLabel,
  sortHospitals,
  toDirectory,
  toggleInList,
  uniqueSorted,
  type HospitalFilters,
  type HospitalSort,
} from '../lib/hospitalDirectory.ts'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

const directory = toDirectory(hospitals, jobs)
const locations = uniqueSorted(directory.map((hospital) => locationLabel(hospital)))
const specialties = uniqueSorted(directory.flatMap((hospital) => hospital.focusAreas))

function fieldId(group: string, value: string) {
  return `hospital-${group}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

export function HospitalsPage() {
  const [queryDraft, setQueryDraft] = useState('')
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<HospitalFilters>(emptyHospitalFilters)
  const [sort, setSort] = useState<HospitalSort>('recommended')

  useDocumentTitle('Hospitals · MediHire')

  const results = useMemo(
    () => sortHospitals(filterHospitals(directory, query, filters), sort),
    [query, filters, sort],
  )

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQuery(queryDraft.trim())
    setQueryDraft(queryDraft.trim())
  }

  function resetDirectory() {
    setQuery('')
    setQueryDraft('')
    setFilters(emptyHospitalFilters)
    setSort('recommended')
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
            },
          },
        ]
      : []),
    ...filters.locations.map((value) => ({
      id: `location-${value}`,
      label: value,
      removeLabel: `Remove ${value}`,
      remove: () =>
        setFilters((current) => ({
          ...current,
          locations: current.locations.filter((item) => item !== value),
        })),
    })),
    ...filters.specialties.map((value) => ({
      id: `specialty-${value}`,
      label: value,
      removeLabel: `Remove ${value}`,
      remove: () =>
        setFilters((current) => ({
          ...current,
          specialties: current.specialties.filter((item) => item !== value),
        })),
    })),
  ]

  const countText =
    results.length === 0
      ? 'No hospitals match these filters.'
      : `Showing ${results.length} of ${directory.length} hospitals`

  return (
    <>
      <section className="bg-accent-surface" aria-labelledby="hospitals-heading">
        <Container className="py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-accent">Hospital directory</p>
            <h1
              id="hospitals-heading"
              className="mt-4 text-balance text-4xl sm:text-5xl lg:text-6xl"
            >
              Discover hospitals shaping the future of care
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed">
              Browse six fictional hospitals and the sample roles attached to each site. These are
              not partner health systems, and the photographs are atmosphere only.
            </p>
          </div>
          <form
            role="search"
            className="mt-10 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5"
            onSubmit={applySearch}
          >
            <label htmlFor="hospital-search" className="text-sm font-semibold text-heading">
              Hospital name, city, or specialty
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="hospital-search"
                name="q"
                type="search"
                value={queryDraft}
                onChange={(event) => setQueryDraft(event.target.value)}
                placeholder="Harborlight, Chicago, Imaging"
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

      <section aria-labelledby="hospital-results-heading" className="border-t border-border">
        <Container className="py-10 lg:py-14">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-sans text-lg font-semibold">Filters</h2>
            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <fieldset className="border-0 p-0">
                <legend className="mb-2 text-sm font-semibold text-heading">Location</legend>
                <div className="grid gap-1 sm:grid-cols-2">
                  {locations.map((location) => {
                    const id = fieldId('location', location)
                    return (
                      <label
                        key={location}
                        htmlFor={id}
                        className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
                      >
                        <input
                          id={id}
                          name="hospital-location"
                          type="checkbox"
                          className="size-4 accent-primary"
                          checked={filters.locations.includes(location)}
                          onChange={() =>
                            setFilters((current) => ({
                              ...current,
                              locations: toggleInList(current.locations, location),
                            }))
                          }
                        />
                        <span>{location}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              <fieldset className="border-0 p-0">
                <legend className="mb-2 text-sm font-semibold text-heading">Specialty</legend>
                <div className="grid gap-1 sm:grid-cols-2">
                  {specialties.map((specialty) => {
                    const id = fieldId('specialty', specialty)
                    return (
                      <label
                        key={specialty}
                        htmlFor={id}
                        className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
                      >
                        <input
                          id={id}
                          name="hospital-specialty"
                          type="checkbox"
                          className="size-4 accent-primary"
                          checked={filters.specialties.includes(specialty)}
                          onChange={() =>
                            setFilters((current) => ({
                              ...current,
                              specialties: toggleInList(current.specialties, specialty),
                            }))
                          }
                        />
                        <span>{specialty}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
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
            <label htmlFor="hospital-sort" className="text-sm font-semibold text-heading">
              Sort
              <select
                id="hospital-sort"
                name="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as HospitalSort)}
                className="mt-2 block min-h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-heading sm:w-56"
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
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <p className="text-sm font-semibold text-accent">{hospital.type}</p>
                      <h3 className="mt-2 text-3xl">
                        <Link
                          to={`/hospitals/${hospital.slug}`}
                          className="hover:text-primary"
                        >
                          {hospital.name}
                        </Link>
                      </h3>
                      <p className="mt-3 font-semibold text-heading">{locationLabel(hospital)}</p>
                      <p className="mt-3 leading-relaxed">{hospital.summary}</p>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Specialties">
                        {hospital.focusAreas.map((area) => (
                          <li
                            key={area}
                            className="rounded-full bg-accent-surface px-3 py-1 text-sm text-heading"
                          >
                            {area}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 text-sm font-semibold text-heading">
                        {hospital.openJobs} open {hospital.openJobs === 1 ? 'role' : 'roles'}
                      </p>
                      <div className="mt-6">
                        <ButtonLink to={`/hospitals/${hospital.slug}`} variant="secondary">
                          View Hospital
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

      <section className="bg-primary" aria-labelledby="hospital-jobs-cta">
        <Container className="py-16 md:py-20 lg:py-28">
          <div className="max-w-3xl">
            <h2 id="hospital-jobs-cta" className="text-balance text-4xl text-white sm:text-5xl">
              See the roles at these hospitals
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-accent-surface">
              Every open-role count comes from the sample job board. Browse the listings, then open
              a hospital to read the fictional profile behind them.
            </p>
            <div className="mt-8">
              <ButtonLink to="/jobs" variant="inverse" className="w-full sm:w-auto">
                Explore Opportunities
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
