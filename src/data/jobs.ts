import type { JobListing } from './types.ts'
import { jobNarratives } from './jobNarratives.ts'

export const jobs: JobListing[] = [
  {
    slug: 'med-surg-rn-harborlight',
    title: 'Registered Nurse, Medical-Surgical',
    hospitalSlug: 'harborlight-medical-center',
    specialty: 'Nursing',
    department: 'Medical-Surgical',
    location: 'Seattle, WA',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Day shift',
    salary: '$86,000 to $104,000',
    summary:
      'Provide bedside nursing care for adult patients on a medical-surgical unit.',
    responsibilities: [
      'Assess patients and carry out the plan of care with the unit team.',
      'Give medications and document care in the clinical record.',
      'Prepare patients and families for discharge with clear instructions.',
    ],
  },
  {
    slug: 'medical-lab-scientist-harborlight',
    title: 'Medical Laboratory Scientist',
    hospitalSlug: 'harborlight-medical-center',
    specialty: 'Laboratory',
    department: 'Laboratory',
    location: 'Seattle, WA',
    workArrangement: 'On-site',
    employmentType: 'Contract',
    schedule: 'Evening shift',
    summary:
      'Run and review diagnostic tests that support inpatient and emergency decisions.',
    responsibilities: [
      'Perform chemistry, hematology, and related bench testing.',
      'Check quality controls and report results that need review.',
      'Keep instruments and work areas ready for the next shift.',
    ],
  },
  {
    slug: 'ed-rn-northcedar',
    title: 'Emergency Department Nurse',
    hospitalSlug: 'northcedar-regional-hospital',
    specialty: 'Emergency Medicine',
    department: 'Emergency',
    location: 'Minneapolis, MN',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Night shift',
    salary: '$90,000 to $110,000',
    summary:
      'Care for patients arriving for urgent and emergency treatment overnight.',
    responsibilities: [
      'Triage arrivals and start care according to department protocols.',
      'Monitor unstable patients and update the care team.',
      'Document assessments, treatments, and handoffs.',
    ],
  },
  {
    slug: 'hospital-pharmacist-ridgeway',
    title: 'Hospital Pharmacist',
    hospitalSlug: 'ridgeway-community-hospital',
    specialty: 'Pharmacy',
    department: 'Pharmacy',
    location: 'Asheville, NC',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Day shift',
    salary: '$120,000 to $138,000',
    summary:
      'Review medication orders and support safe dispensing for inpatients.',
    responsibilities: [
      'Verify orders and clarify questions with prescribers.',
      'Oversee sterile and non-sterile preparation workflows.',
      'Counsel clinicians on dosing, interactions, and shortages.',
    ],
  },
  {
    slug: 'icu-nurse-manager-lakeshore',
    title: 'Nurse Manager, Intensive Care',
    hospitalSlug: 'lakeshore-university-hospital',
    specialty: 'Critical Care',
    department: 'Intensive Care',
    location: 'Chicago, IL',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Monday to Friday',
    salary: '$125,000 to $148,000',
    summary:
      'Lead the intensive care nursing team, staffing, and day-to-day unit operations.',
    responsibilities: [
      'Coordinate staffing and assignments for the unit.',
      'Support nurses with practice questions and professional development.',
      'Track quality measures and follow up on safety events.',
    ],
  },
  {
    slug: 'respiratory-therapist-mesa-verde',
    title: 'Respiratory Therapist',
    hospitalSlug: 'mesa-verde-health',
    specialty: 'Respiratory Therapy',
    department: 'Respiratory Therapy',
    location: 'Phoenix, AZ',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Rotating shifts',
    salary: '$72,000 to $86,000',
    summary:
      'Deliver respiratory treatments and ventilator support across inpatient units.',
    responsibilities: [
      'Assess breathing status and carry out ordered therapies.',
      'Manage ventilators and respond to respiratory emergencies.',
      'Record treatments and communicate changes to the care team.',
    ],
  },
  {
    slug: 'radiologic-technologist-mesa-verde',
    title: 'Radiologic Technologist',
    hospitalSlug: 'mesa-verde-health',
    specialty: 'Imaging',
    department: 'Imaging',
    location: 'Phoenix, AZ',
    workArrangement: 'On-site',
    employmentType: 'Part-time',
    schedule: 'Day shift',
    summary:
      'Capture diagnostic images for emergency, inpatient, and scheduled exams.',
    responsibilities: [
      'Position patients and acquire images according to protocol.',
      'Screen for safety concerns before each exam.',
      'Keep imaging rooms supplied and ready between patients.',
    ],
  },
  {
    slug: 'physical-therapist-solace',
    title: 'Pediatric Physical Therapist',
    hospitalSlug: 'solace-childrens-hospital',
    specialty: 'Rehabilitation',
    department: 'Rehabilitation',
    location: 'Austin, TX',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Day shift',
    salary: '$88,000 to $102,000',
    summary:
      'Evaluate and treat children who need help with mobility and daily movement.',
    responsibilities: [
      'Complete evaluations and set therapy goals with families.',
      'Lead treatment sessions on the unit and in the therapy gym.',
      'Document progress and coordinate with the pediatric team.',
    ],
  },
  {
    slug: 'telehealth-rn-harborlight',
    title: 'Telehealth Registered Nurse',
    hospitalSlug: 'harborlight-medical-center',
    specialty: 'Nursing',
    department: 'Virtual Care',
    location: 'Remote',
    workArrangement: 'Remote',
    employmentType: 'Part-time',
    schedule: 'Weekday evenings',
    salary: '$64,000 to $78,000',
    summary:
      'Support adult patients by phone and video after discharge from Harborlight.',
    responsibilities: [
      'Review discharge instructions and answer follow-up questions.',
      'Escalate symptoms that need an in-person assessment.',
      'Document each encounter in the clinical record.',
    ],
  },
  {
    slug: 'icu-rn-lakeshore',
    title: 'Registered Nurse, Intensive Care',
    hospitalSlug: 'lakeshore-university-hospital',
    specialty: 'Critical Care',
    department: 'Intensive Care',
    location: 'Chicago, IL',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Night shift',
    salary: '$98,000 to $118,000',
    summary:
      'Provide bedside care for critically ill adults in a university intensive care unit.',
    responsibilities: [
      'Monitor hemodynamics and titrate infusions with the care team.',
      'Partner with respiratory therapy on ventilator care.',
      'Give a structured handoff at the end of each shift.',
    ],
  },
  {
    slug: 'case-manager-northcedar',
    title: 'RN Case Manager',
    hospitalSlug: 'northcedar-regional-hospital',
    specialty: 'Care Management',
    department: 'Care Management',
    location: 'Minneapolis, MN',
    workArrangement: 'Hybrid',
    employmentType: 'Full-time',
    schedule: 'Monday to Friday',
    salary: '$84,000 to $99,000',
    summary:
      'Coordinate discharge plans for inpatients, with two remote days each week.',
    responsibilities: [
      'Review each assigned stay and identify barriers to discharge.',
      'Arrange follow-up services with the patient and family.',
      'Meet the care team on site three days a week.',
    ],
  },
  {
    slug: 'ct-technologist-ridgeway',
    title: 'CT Technologist',
    hospitalSlug: 'ridgeway-community-hospital',
    specialty: 'Imaging',
    department: 'Imaging',
    location: 'Asheville, NC',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Day shift',
    salary: '$68,000 to $81,000',
    summary:
      'Perform scheduled and urgent CT exams for a community hospital.',
    responsibilities: [
      'Screen patients and acquire studies according to protocol.',
      'Prepare contrast supplies and watch for reactions.',
      'Send completed studies for radiologist review.',
    ],
  },
  {
    slug: 'evening-pharmacist-lakeshore',
    title: 'Clinical Pharmacist, Evenings',
    hospitalSlug: 'lakeshore-university-hospital',
    specialty: 'Pharmacy',
    department: 'Pharmacy',
    location: 'Chicago, IL',
    workArrangement: 'On-site',
    employmentType: 'Part-time',
    schedule: 'Evening shift',
    summary:
      'Review evening medication orders for inpatient and emergency teams.',
    responsibilities: [
      'Verify new orders and resolve missing information.',
      'Support the night nursing teams with dosing questions.',
      'Hand off open issues to the morning pharmacists.',
    ],
  },
  {
    slug: 'occupational-therapist-solace',
    title: 'Pediatric Occupational Therapist',
    hospitalSlug: 'solace-childrens-hospital',
    specialty: 'Rehabilitation',
    department: 'Rehabilitation',
    location: 'Austin, TX',
    workArrangement: 'On-site',
    employmentType: 'Contract',
    schedule: 'Day shift',
    summary:
      'Cover a contract assignment helping children with daily living skills.',
    responsibilities: [
      'Evaluate fine-motor and self-care needs with families.',
      'Lead treatment sessions on the pediatric unit.',
      'Document progress for the covering therapy team.',
    ],
  },
  {
    slug: 'infection-prevention-harborlight',
    title: 'Infection Preventionist',
    hospitalSlug: 'harborlight-medical-center',
    specialty: 'Quality & Safety',
    department: 'Quality & Safety',
    location: 'Seattle, WA',
    workArrangement: 'Hybrid',
    employmentType: 'Full-time',
    schedule: 'Monday to Friday',
    salary: '$95,000 to $112,000',
    summary:
      'Track hospital infection measures and coach units on prevention practice.',
    responsibilities: [
      'Review surveillance data and follow up on clusters.',
      'Round with unit leaders on site three days a week.',
      'Prepare clear summaries for the quality committee.',
    ],
  },
  {
    slug: 'inpatient-coder-mesa-verde',
    title: 'Inpatient Medical Coder',
    hospitalSlug: 'mesa-verde-health',
    specialty: 'Health Information',
    department: 'Health Information',
    location: 'Remote',
    workArrangement: 'Remote',
    employmentType: 'Contract',
    schedule: 'Weekday days',
    salary: '$58,000 to $70,000',
    summary:
      'Code inpatient encounters for Mesa Verde Health from a remote workspace.',
    responsibilities: [
      'Review records and assign codes that match the documentation.',
      'Query clinicians when a record needs clarification.',
      'Meet the coding queue targets for the contract term.',
    ],
  },
  {
    slug: 'or-nurse-lakeshore',
    title: 'Operating Room Nurse',
    hospitalSlug: 'lakeshore-university-hospital',
    specialty: 'Surgical Services',
    department: 'Surgery',
    location: 'Chicago, IL',
    workArrangement: 'On-site',
    employmentType: 'Full-time',
    schedule: 'Day shift',
    salary: '$100,000 to $122,000',
    summary:
      'Circulate and scrub for scheduled surgical cases in a university hospital.',
    responsibilities: [
      'Prepare the room and confirm the procedure with the team.',
      'Maintain the sterile field and account for supplies.',
      'Document the case and hand the patient to recovery.',
    ],
  },
  {
    slug: 'respiratory-therapist-nights-mesa-verde',
    title: 'Respiratory Therapist, Nights',
    hospitalSlug: 'mesa-verde-health',
    specialty: 'Respiratory Therapy',
    department: 'Respiratory Therapy',
    location: 'Phoenix, AZ',
    workArrangement: 'On-site',
    employmentType: 'Part-time',
    schedule: 'Night shift',
    summary:
      'Cover night-shift respiratory treatments and emergency calls.',
    responsibilities: [
      'Complete ordered therapies across inpatient units.',
      'Respond to respiratory emergencies overnight.',
      'Report unfinished treatments to the day team.',
    ],
  },
]

const featuredSlugs = [
  'med-surg-rn-harborlight',
  'medical-lab-scientist-harborlight',
  'ed-rn-northcedar',
  'hospital-pharmacist-ridgeway',
  'icu-nurse-manager-lakeshore',
  'respiratory-therapist-mesa-verde',
  'radiologic-technologist-mesa-verde',
  'physical-therapist-solace',
] as const

for (const job of jobs) {
  const narrative = jobNarratives[job.slug]
  if (!narrative) continue
  if (narrative.description) job.description = narrative.description
  if (narrative.qualifications) job.qualifications = narrative.qualifications
}

export const featuredJobs = featuredSlugs.map((slug) => {
  const job = jobs.find((item) => item.slug === slug)
  if (!job) throw new Error(`Missing featured job: ${slug}`)
  return job
})

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug)
}

export function getJobsForHospital(hospitalSlug: string) {
  return jobs.filter((job) => job.hospitalSlug === hospitalSlug)
}

const titleStopWords = new Set([
  'and',
  'the',
  'for',
  'with',
  'from',
  'medical',
  'registered',
  'hospital',
  'care',
  'patient',
  'patients',
  'clinical',
  'inpatient',
  'pediatric',
  'adult',
  'health',
  'center',
  'unit',
  'role',
  'nurse',
  'therapist',
])

function roleFamily(title: string) {
  const text = title.toLowerCase()
  if (/\b(nurse|rn)\b/.test(text)) return 'nurse'
  if (/\btherapist\b/.test(text)) return 'therapist'
  if (/\bpharmacist\b/.test(text)) return 'pharmacist'
  if (/\btechnologist\b/.test(text)) return 'technologist'
  return ''
}

function titleTokens(title: string) {
  return title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !titleStopWords.has(word))
}

function titleSimilarity(left: string, right: string) {
  const words = new Set(titleTokens(left))
  let shared = 0
  for (const word of titleTokens(right)) {
    if (words.has(word)) shared += 1
  }
  return shared
}

export function getRelatedJobs(slug: string, limit = 3) {
  const current = jobs.find((job) => job.slug === slug)
  if (!current) return []

  return jobs
    .filter((job) => job.slug !== current.slug)
    .map((job) => ({
      job,
      rank:
        (job.specialty === current.specialty ? 100 : 0) +
        (roleFamily(job.title) !== '' && roleFamily(job.title) === roleFamily(current.title) ? 40 : 0) +
        titleSimilarity(current.title, job.title) * 8 +
        (job.hospitalSlug === current.hospitalSlug ? 4 : 0) +
        (job.department === current.department ? 2 : 0),
    }))
    .sort((a, b) => b.rank - a.rank || a.job.title.localeCompare(b.job.title))
    .slice(0, limit)
    .map((item) => item.job)
}
