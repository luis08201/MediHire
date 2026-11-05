import type { Hospital, JobListing } from '../data/types.ts'

export type HospitalSort = 'recommended' | 'name' | 'location' | 'jobs'

export type DirectoryHospital = Hospital & {
  catalogIndex: number
  openJobs: number
  jobSpecialties: string[]
}

export type HospitalFilters = {
  locations: string[]
  specialties: string[]
}

export const emptyHospitalFilters: HospitalFilters = {
  locations: [],
  specialties: [],
}

export function toDirectory(hospitals: Hospital[], jobs: JobListing[]): DirectoryHospital[] {
  return hospitals.map((hospital, catalogIndex) => {
    const roles = jobs.filter((job) => job.hospitalSlug === hospital.slug)
    return {
      ...hospital,
      catalogIndex,
      openJobs: roles.length,
      jobSpecialties: [...new Set(roles.map((job) => job.specialty))].sort((a, b) =>
        a.localeCompare(b),
      ),
    }
  })
}

export function locationLabel(hospital: Pick<Hospital, 'city' | 'region'>) {
  return `${hospital.city}, ${hospital.region}`
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

export function filterHospitals(
  hospitals: DirectoryHospital[],
  query: string,
  filters: HospitalFilters,
) {
  const needle = query.trim().toLowerCase()

  return hospitals.filter((hospital) => {
    if (filters.locations.length > 0 && !filters.locations.includes(locationLabel(hospital))) {
      return false
    }
    if (
      filters.specialties.length > 0 &&
      !filters.specialties.some((specialty) => hospital.focusAreas.includes(specialty))
    ) {
      return false
    }
    if (!needle) return true

    const haystack = [
      hospital.name,
      hospital.city,
      hospital.region,
      locationLabel(hospital),
      ...hospital.focusAreas,
      ...hospital.jobSpecialties,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(needle)
  })
}

export function sortHospitals(hospitals: DirectoryHospital[], sort: HospitalSort) {
  const copy = [...hospitals]

  if (sort === 'name') {
    copy.sort((a, b) => a.name.localeCompare(b.name) || a.catalogIndex - b.catalogIndex)
  } else if (sort === 'location') {
    copy.sort(
      (a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name),
    )
  } else if (sort === 'jobs') {
    copy.sort((a, b) => b.openJobs - a.openJobs || a.name.localeCompare(b.name))
  } else {
    copy.sort((a, b) => a.catalogIndex - b.catalogIndex)
  }

  return copy
}

const hospitalSorts = new Set<HospitalSort>(['recommended', 'name', 'location', 'jobs'])

export function cloneHospitalFilters(filters: HospitalFilters): HospitalFilters {
  return {
    locations: [...filters.locations],
    specialties: [...filters.specialties],
  }
}

export function readHospitalSearch(
  params: URLSearchParams,
  options: { locations: string[]; specialties: string[] },
) {
  const sortValue = params.get('sort')
  const sort: HospitalSort =
    sortValue && hospitalSorts.has(sortValue as HospitalSort)
      ? (sortValue as HospitalSort)
      : 'recommended'
  const locations = new Set(options.locations)
  const specialties = new Set(options.specialties)

  return {
    query: params.get('q') ?? '',
    sort,
    filters: {
      locations: params.getAll('location').filter((value) => locations.has(value)),
      specialties: params.getAll('specialty').filter((value) => specialties.has(value)),
    } satisfies HospitalFilters,
  }
}

export function writeHospitalSearch(state: {
  query: string
  filters: HospitalFilters
  sort: HospitalSort
}) {
  const params = new URLSearchParams()
  const query = state.query.trim()
  if (query) params.set('q', query)
  for (const value of state.filters.locations) params.append('location', value)
  for (const value of state.filters.specialties) params.append('specialty', value)
  if (state.sort !== 'recommended') params.set('sort', state.sort)
  return params
}

export function toggleInList<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}
