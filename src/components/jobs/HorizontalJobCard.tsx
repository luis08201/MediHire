import { Link } from 'react-router'
import { getHospitalBySlug } from '../../data/hospitals.ts'
import type { JobListing } from '../../data/types.ts'
import { CircleArrow, PinIcon } from '../ui/Marks.tsx'

export function HorizontalJobCard({ job }: { job: JobListing }) {
  const hospital = getHospitalBySlug(job.hospitalSlug)

  return (
    <article className="soft-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <img
        src={hospital?.image ?? '/images/hospitals/harborlight.jpg'}
        alt=""
        className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-32"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-2xl leading-tight">
          <Link to={`/jobs/${job.slug}`} className="hover:text-primary">
            {job.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-semibold text-heading">
          {hospital ? (
            <Link to={`/hospitals/${job.hospitalSlug}`} className="hover:text-primary">
              {hospital.name}
            </Link>
          ) : (
            'Sample hospital'
          )}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-body">
          <PinIcon />
          {job.location}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Role details">
          <li className="rounded-full bg-accent-surface px-2.5 py-1 text-xs font-semibold text-primary">
            {job.employmentType}
          </li>
          <li className="rounded-full bg-accent-surface px-2.5 py-1 text-xs font-semibold text-primary">
            {job.workArrangement}
          </li>
        </ul>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed">{job.summary}</p>
        {job.salary ? <p className="mt-2 text-sm font-semibold text-heading">{job.salary}</p> : null}
      </div>
      <CircleArrow to={`/jobs/${job.slug}`} label={`View ${job.title}`} />
    </article>
  )
}
