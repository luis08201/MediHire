export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'

export type WorkArrangement = 'On-site' | 'Hybrid' | 'Remote'

export type Hospital = {
  slug: string
  name: string
  city: string
  region: string
  type: string
  bedCount: number
  summary: string
  focusAreas: string[]
  image: string
  imageAlt: string
}

export type JobListing = {
  slug: string
  title: string
  hospitalSlug: string
  specialty: string
  department: string
  location: string
  workArrangement: WorkArrangement
  employmentType: EmploymentType
  schedule: string
  summary: string
  description?: string
  responsibilities: string[]
  qualifications?: string[]
  salary?: string
}
