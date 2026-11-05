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
    return matchesJobQuery(job, needle)
  })
}

export const popularSearches = ['Nursing', 'Therapy'] as const

function matchesJobQuery(job: BoardJob, needle: string) {
  if (!needle) return true
  if (needle === 'nursing') {
    return job.specialty === 'Nursing' || /\b(nurse|rn)\b/i.test(job.title)
  }
  if (needle === 'therapy') {
    if (job.specialty === 'Respiratory Therapy') return true
    const text = `${job.title} ${job.department}`
    if (job.specialty === 'Rehabilitation' && /physical|occupational|therap/i.test(text)) return true
    return /\b(physical|occupational|respiratory) therapist\b/i.test(job.title)
  }

  const haystack = [job.title, job.hospitalName, job.specialty, job.department, job.location]
    .join(' ')
    .toLowerCase()
  return haystack.includes(needle)
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

const jobSorts = new Set<JobSort>(['recommended', 'title', 'hospital', 'location'])

export function readJobSearch(
  params: URLSearchParams,
  options: { specialties: string[]; locations: string[] },
) {
  const sortValue = params.get('sort')
  const sort: JobSort = sortValue && jobSorts.has(sortValue as JobSort) ? (sortValue as JobSort) : 'recommended'
  const pageValue = Number.parseInt(params.get('page') ?? '1', 10)
  const specialties = new Set(options.specialties)
  const locations = new Set(options.locations)
  const arrangements = new Set<string>(workArrangements)
  const employment = new Set<string>(employmentTypes)

  return {
    query: params.get('q') ?? '',
    sort,
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
    filters: {
      specialties: params.getAll('specialty').filter((value) => specialties.has(value)),
      locations: params.getAll('location').filter((value) => locations.has(value)),
      arrangements: params.getAll('work').filter((value): value is WorkArrangement => arrangements.has(value)),
      employmentTypes: params
        .getAll('type')
        .filter((value): value is EmploymentType => employment.has(value)),
    } satisfies JobFilters,
  }
}

export function writeJobSearch(state: {
  query: string
  filters: JobFilters
  sort: JobSort
  page: number
}) {
  const params = new URLSearchParams()
  const query = state.query.trim()
  if (query) params.set('q', query)
  for (const value of state.filters.specialties) params.append('specialty', value)
  for (const value of state.filters.locations) params.append('location', value)
  for (const value of state.filters.arrangements) params.append('work', value)
  for (const value of state.filters.employmentTypes) params.append('type', value)
  if (state.sort !== 'recommended') params.set('sort', state.sort)
  if (state.page > 1) params.set('page', String(state.page))
  return params
}

export function activeFilterCount(filters: JobFilters) {
  return (
    filters.specialties.length +
    filters.locations.length +
    filters.arrangements.length +
    filters.employmentTypes.length
  )
}
