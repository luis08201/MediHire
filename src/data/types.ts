export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'

export type Hospital = {
  slug: string
  name: string
  city: string
  region: string
  type: string
  bedCount: number
  summary: string
  focusAreas: string[]
}

export type JobListing = {
  slug: string
  title: string
  hospitalSlug: string
  department: string
  location: string
  employmentType: EmploymentType
  schedule: string
  summary: string
  responsibilities: string[]
}
