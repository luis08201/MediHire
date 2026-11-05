import { Link } from 'react-router'
import { getHospitalBySlug } from '../../data/hospitals.ts'
import type { JobListing } from '../../data/types.ts'

export function HorizontalJobCard({ job }: { job: JobListing }) {
  const hospital = getHospitalBySlug(job.hospitalSlug)

  return (
    <article className="grid gap-5 border-b border-primary/10 py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-start">
      <img
        src={hospital?.image ?? '/images/hospitals/harborlight.jpg'}
        alt=""
        className="aspect-[4/3] w-full object-cover sm:h-24"
      />
      <div className="min-w-0">
        <h3 className="text-2xl leading-tight sm:text-3xl">
          <Link to={`/jobs/${job.slug}`} className="underline-offset-4 hover:underline">
            {job.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm">
          {hospital ? (
            <Link to={`/hospitals/${job.hospitalSlug}`} className="underline-offset-4 hover:underline">
              {hospital.name}
            </Link>
          ) : (
            'Sample hospital'
          )}
        </p>
        <p className="mt-2 text-sm text-muted">
          {job.location} · {job.employmentType} · {job.workArrangement}
        </p>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed">{job.summary}</p>
        {job.salary ? <p className="mt-2 text-sm">{job.salary}</p> : null}
      </div>
    </article>
  )
}
