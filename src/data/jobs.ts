import type { JobListing } from './types.ts'

export const jobs: JobListing[] = [
  {
    slug: 'med-surg-rn-harborlight',
    title: 'Registered Nurse, Medical-Surgical',
    hospitalSlug: 'harborlight-medical-center',
    department: 'Medical-Surgical',
    location: 'Seattle, WA',
    employmentType: 'Full-time',
    schedule: 'Day shift',
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
    department: 'Laboratory',
    location: 'Seattle, WA',
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
    department: 'Emergency',
    location: 'Minneapolis, MN',
    employmentType: 'Full-time',
    schedule: 'Night shift',
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
    department: 'Pharmacy',
    location: 'Asheville, NC',
    employmentType: 'Full-time',
    schedule: 'Day shift',
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
    department: 'Intensive Care',
    location: 'Chicago, IL',
    employmentType: 'Full-time',
    schedule: 'Monday to Friday',
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
    department: 'Respiratory Therapy',
    location: 'Phoenix, AZ',
    employmentType: 'Full-time',
    schedule: 'Rotating shifts',
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
    department: 'Imaging',
    location: 'Phoenix, AZ',
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
    department: 'Rehabilitation',
    location: 'Austin, TX',
    employmentType: 'Full-time',
    schedule: 'Day shift',
    summary:
      'Evaluate and treat children who need help with mobility and daily movement.',
    responsibilities: [
      'Complete evaluations and set therapy goals with families.',
      'Lead treatment sessions on the unit and in the therapy gym.',
      'Document progress and coordinate with the pediatric team.',
    ],
  },
]

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug)
}

export function getJobsForHospital(hospitalSlug: string) {
  return jobs.filter((job) => job.hospitalSlug === hospitalSlug)
}
