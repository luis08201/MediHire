import type { EmploymentType, JobListing, WorkArrangement } from '../data/types.ts'
import { getHospitalBySlug } from '../data/hospitals.ts'

export const JOBS_PER_PAGE = 6

export const workArrangements: WorkArrangement[] = ['On-site', 'Hybrid', 'Remote']

export const employmentTypes: EmploymentType[] = ['Full-time', 'Part-time', 'Contract']

export type JobSort = 'recommended' | 'title' | 'hospital' | 'location'

export type BoardJob = JobListing & {
  hospitalName: string
  catalogIndex: number
}

export type JobFilters = {
  specialties: string[]
  locations: string[]
  arrangements: WorkArrangement[]
  employmentTypes: EmploymentType[]
}

export const emptyFilters: JobFilters = {
  specialties: [],
  locations: [],
  arrangements: [],
  employmentTypes: [],
}

export function cloneFilters(filters: JobFilters): JobFilters {
  return {
    specialties: [...filters.specialties],
    locations: [...filters.locations],
    arrangements: [...filters.arrangements],
    employmentTypes: [...filters.employmentTypes],
  }
}

export function toBoardJobs(listings: JobListing[]): BoardJob[] {
  return listings.map((job, catalogIndex) => ({
    ...job,
    catalogIndex,
    hospitalName: getHospitalBySlug(job.hospitalSlug)?.name ?? 'Sample hospital',
  }))
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

export function filterBoardJobs(listings: BoardJob[], query: string, filters: JobFilters) {
  const needle = query.trim().toLowerCase()

  return listings.filter((job) => {
    if (filters.specialties.length > 0 && !filters.specialties.includes(job.specialty)) return false
    if (filters.locations.length > 0 && !filters.locations.includes(job.location)) return false
    if (filters.arrangements.length > 0 && !filters.arrangements.includes(job.workArrangement)) {
      return false
    }
    if (
      filters.employmentTypes.length > 0 &&
      !filters.employmentTypes.includes(job.employmentType)
    ) {
      return false
    }
    if (!needle) return true

    const haystack = [job.title, job.hospitalName, job.specialty, job.department, job.location]
      .join(' ')
      .toLowerCase()

    return haystack.includes(needle)
  })
}

export function sortBoardJobs(listings: BoardJob[], sort: JobSort) {
  const copy = [...listings]

  if (sort === 'title') {
    copy.sort((a, b) => a.title.localeCompare(b.title) || a.catalogIndex - b.catalogIndex)
  } else if (sort === 'hospital') {
    copy.sort(
      (a, b) => a.hospitalName.localeCompare(b.hospitalName) || a.title.localeCompare(b.title),
    )
  } else if (sort === 'location') {
    copy.sort((a, b) => a.location.localeCompare(b.location) || a.title.localeCompare(b.title))
  } else {
    copy.sort((a, b) => a.catalogIndex - b.catalogIndex)
  }

  return copy
}

export function pageOf<T>(items: T[], page: number, pageSize = JOBS_PER_PAGE) {
  if (items.length === 0) {
    return { pageCount: 0, current: 1, items: [] as T[], start: 0, end: 0 }
  }

  const pageCount = Math.ceil(items.length / pageSize)
  const current = Math.min(Math.max(page, 1), pageCount)
  const startIndex = (current - 1) * pageSize

  return {
    pageCount,
    current,
    items: items.slice(startIndex, startIndex + pageSize),
    start: startIndex + 1,
    end: Math.min(startIndex + pageSize, items.length),
  }
}

export function toggleInList<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function activeFilterCount(filters: JobFilters) {
  return (
    filters.specialties.length +
    filters.locations.length +
    filters.arrangements.length +
    filters.employmentTypes.length
  )
}
