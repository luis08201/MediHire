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

export function toggleInList<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}
