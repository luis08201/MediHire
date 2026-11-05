import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { getHospitalBySlug } from '../../data/hospitals.ts'
import { featuredJobs as jobs } from '../../data/jobs.ts'
import { Section } from '../layout/Section.tsx'
import { ArrowIcon, CircleArrow, Eyebrow, PinIcon } from '../ui/Marks.tsx'

const listId = 'featured-jobs'

export function FeaturedJobsSection() {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    function update() {
      const node = scrollerRef.current
      if (!node) return
      const max = node.scrollWidth - node.clientWidth
      setAtStart(node.scrollLeft <= 2)
      setAtEnd(max <= 2 || node.scrollLeft >= max - 2)
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector('li')
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || '0') || 0
    const width = card instanceof HTMLElement ? card.offsetWidth : el.clientWidth * 0.8
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({
      left: direction * (width + gap),
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  return (
    <Section labelledBy="featured-jobs-heading">
      <div className="mx-auto flex w-[min(75rem,100%)] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>Featured jobs</Eyebrow>
          <h2 id="featured-jobs-heading" className="mt-4 text-balance text-4xl leading-[1.1] sm:text-5xl">
            Current opportunities in top healthcare organizations.
          </h2>
        </div>
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover">
          View All Jobs
          <ArrowIcon />
        </Link>
      </div>
      <ul id={listId} ref={scrollerRef} className="carousel-bleed mt-10" aria-label="Featured fictional roles">
        {jobs.map((job) => {
          const hospital = getHospitalBySlug(job.hospitalSlug)
          return (
            <li key={job.slug} className="w-[min(25rem,78vw)] shrink-0 snap-start">
              <article className="soft-card overflow-hidden">
                <img
                  src={hospital?.image ?? '/images/hospitals/harborlight.jpg'}
                  alt={hospital?.imageAlt ?? ''}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-2xl leading-tight">
                      <Link to={`/jobs/${job.slug}`} className="hover:text-primary">
                        {job.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-heading">{hospital?.name}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-body">
                    <PinIcon />
                    {job.location}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <ul className="flex flex-wrap gap-2" aria-label="Role details">
                      <li className="rounded-full bg-accent-surface px-2.5 py-1 text-xs font-semibold text-primary">
                        {job.employmentType}
                      </li>
                      <li className="rounded-full bg-accent-surface px-2.5 py-1 text-xs font-semibold text-primary">
                        {job.workArrangement}
                      </li>
                    </ul>
                    <CircleArrow to={`/jobs/${job.slug}`} label={`View ${job.title}`} />
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
      <div className="mx-auto mt-4 flex w-[min(75rem,100%)] justify-end gap-2">
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-white text-heading disabled:opacity-40"
          aria-label="Show previous roles"
          aria-controls={listId}
          disabled={atStart}
          onClick={() => scrollByCard(-1)}
        >
          <ArrowIcon className="rotate-180" />
        </button>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-white text-heading disabled:opacity-40"
          aria-label="Show next roles"
          aria-controls={listId}
          disabled={atEnd}
          onClick={() => scrollByCard(1)}
        >
          <ArrowIcon />
        </button>
      </div>
    </Section>
  )
}
