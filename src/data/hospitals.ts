import type { Hospital } from './types.ts'

export const hospitals: Hospital[] = [
  {
    slug: 'harborlight-medical-center',
    name: 'Harborlight Medical Center',
    city: 'Seattle',
    region: 'WA',
    type: 'Regional medical center',
    bedCount: 418,
    summary:
      'A waterfront regional center with adult inpatient care, surgery, and a full emergency department.',
    focusAreas: ['Emergency care', 'Surgical services', 'Cardiology'],
    image: '/images/hospitals/harborlight.jpg',
    imageAlt: 'Empty, brightly lit procedure room',
  },
  {
    slug: 'northcedar-regional-hospital',
    name: 'Northcedar Regional Hospital',
    city: 'Minneapolis',
    region: 'MN',
    type: 'Community hospital',
    bedCount: 226,
    summary:
      'A community hospital for the Twin Cities metro, with inpatient units and outpatient clinics.',
    focusAreas: ['Family medicine', 'Emergency care', 'Orthopedics'],
    image: '/images/hospitals/northcedar.jpg',
    imageAlt: 'Quiet inpatient room with a made bed',
  },
  {
    slug: 'ridgeway-community-hospital',
    name: 'Ridgeway Community Hospital',
    city: 'Asheville',
    region: 'NC',
    type: 'Community hospital',
    bedCount: 164,
    summary:
      'A mountain-region community hospital focused on local acute care and rehabilitation.',
    focusAreas: ['Primary care', 'Rehabilitation', 'Imaging'],
    image: '/images/hospitals/ridgeway.jpg',
    imageAlt: 'Open ward with empty beds and privacy curtains',
  },
  {
    slug: 'lakeshore-university-hospital',
    name: 'Lakeshore University Hospital',
    city: 'Chicago',
    region: 'IL',
    type: 'Academic medical center',
    bedCount: 612,
    summary:
      'An academic medical center with tertiary services, critical care, and teaching programs.',
    focusAreas: ['Critical care', 'Oncology', 'Teaching programs'],
    image: '/images/hospitals/lakeshore.jpg',
    imageAlt: 'Empty operating room prepared for a case',
  },
  {
    slug: 'mesa-verde-health',
    name: 'Mesa Verde Health',
    city: 'Phoenix',
    region: 'AZ',
    type: 'Health system hospital',
    bedCount: 305,
    summary:
      'A desert-metro hospital with acute care, imaging, and outpatient specialty clinics.',
    focusAreas: ['Pulmonary care', 'Imaging', 'Pharmacy'],
    image: '/images/hospitals/mesa-verde.jpg',
    imageAlt: 'Two clinicians reviewing images on a monitor',
  },
  {
    slug: 'solace-childrens-hospital',
    name: "Solace Children's Hospital",
    city: 'Austin',
    region: 'TX',
    type: 'Pediatric hospital',
    bedCount: 198,
    summary:
      'A pediatric hospital for infants, children, and adolescents, including rehabilitation services.',
    focusAreas: ['Pediatrics', 'Rehabilitation', 'Diagnostic services'],
    image: '/images/hospitals/solace.jpg',
    imageAlt: 'Care team gathered around an overhead surgical light',
  },
]

export function getHospitalBySlug(slug: string) {
  return hospitals.find((hospital) => hospital.slug === slug)
}
