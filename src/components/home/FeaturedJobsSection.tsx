import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { getHospitalBySlug } from '../../data/hospitals.ts'
import { featuredJobs as jobs } from '../../data/jobs.ts'
import { Button } from '../ui/Button.tsx'
import { Container } from '../layout/Container.tsx'
import { Section } from '../layout/Section.tsx'

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
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-accent">Featured jobs</p>
            <h2 id="featured-jobs-heading" className="mt-4 text-balance text-4xl sm:text-5xl">
              Explore opportunities that move care forward.
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              Fictional roles from the bedside to the pharmacy. Swipe the row, or
              use the controls.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Show previous roles"
              aria-controls={listId}
              disabled={atStart}
              onClick={() => scrollByCard(-1)}
            >
              <Chevron direction="left" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Show next roles"
              aria-controls={listId}
              disabled={atEnd}
              onClick={() => scrollByCard(1)}
            >
              <Chevron direction="right" />
            </Button>
          </div>
        </div>
      </Container>
      <p className="sr-only">Role cards extend past the right edge and scroll sideways.</p>
      <ul id={listId} ref={scrollerRef} aria-label="Featured jobs" className="carousel-bleed mt-12">
        {jobs.map((job) => {
          const hospital = getHospitalBySlug(job.hospitalSlug)

          return (
            <li key={job.slug} className="w-[min(84vw,34rem)] shrink-0 snap-start">
              <article className="relative flex h-full min-h-[26rem] flex-col rounded-3xl border border-border bg-white p-8 shadow-[0_18px_50px_-28px_rgba(20,45,53,0.5)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-accent">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-accent">{job.department}</p>
                  <p className="text-sm text-muted">{job.employmentType}</p>
                </div>
                <h3 className="mt-8 text-3xl leading-tight">
                  <Link
                    to={`/jobs/${job.slug}`}
                    className="text-heading after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none"
                  >
                    {job.title}
                  </Link>
                </h3>
                <p className="mt-5 font-medium text-heading">
                  {hospital?.name ?? 'Sample hospital'}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {job.location} · {job.schedule}
                </p>
                <p className="mt-6 leading-relaxed">{job.summary}</p>
                <p className="mt-auto pt-8 text-sm font-semibold text-primary">View role</p>
              </article>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M14.5 6.5 9 12l5.5 5.5' : 'M9.5 6.5 15 12l-5.5 5.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
