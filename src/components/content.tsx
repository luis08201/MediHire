import Link from "next/link";
import { copy, fill } from "@/i18n/en";
import { formatCompensation, formatDate, labelFrom } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import type { BlogPost, Job, Location, TeamMember } from "@/lib/cms/types";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Markdown({ source }: { source: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }} />;
}

export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label={copy.a11y.breadcrumb}>
      <ol className="breadcrumbs">
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            {item.path && index < items.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SampleBadge() {
  return <span className="badge sample">{copy.sample}</span>;
}

function VerifiedMark() {
  return (
    <span className="verified" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="12" height="12" focusable="false">
        <path d="M3.4 8.2 6.4 11.2 12.7 4.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function JobCard({
  job,
  location,
  filterable = false,
}: {
  job: Job;
  location?: Location | null;
  filterable?: boolean;
}) {
  const specialty = labelFrom("specialty", job.specialty);
  const pay = formatCompensation(job.compensation);
  return (
    <article className="job-card" {...(filterable ? { "fs-list-element": "item" } : {})}>
      <div className="badge-row">
        {job.demo ? <SampleBadge /> : null}
        <span className="badge">{labelFrom("employmentType", job.employmentType)}</span>
        <span className="badge">{labelFrom("shift", job.shift)}</span>
      </div>
      <h3>
        <Link href={`/careers/${job.slug}`} {...(filterable ? { "fs-list-field": "title" } : {})}>{job.title}</Link>
      </h3>
      {filterable ? (
        <span className="visually-hidden" aria-hidden="true" fs-list-field="search">{`${job.title} ${specialty}`}</span>
      ) : null}
      <p>{job.employer}</p>
      <dl className="facts">
        <div className="fact">
          <dt>{copy.jobs.specialty}</dt>
          <dd>
            {filterable ? <span className="visually-hidden" aria-hidden="true" fs-list-field="specialty">{job.specialty}</span> : null}
            <span {...(filterable ? { "fs-list-field": "specialty-label" } : {})}>{specialty}</span>
          </dd>
        </div>
        <div className="fact">
          <dt>{copy.jobs.location}</dt>
          <dd>
            {filterable && location ? <span className="visually-hidden" aria-hidden="true" fs-list-field="location">{location.slug}</span> : null}
            {location?.name ?? "—"}
          </dd>
        </div>
        <div className="fact">
          <dt>{copy.jobs.shift}</dt>
          <dd>
            {filterable ? <span className="visually-hidden" aria-hidden="true" fs-list-field="shift">{job.shift}</span> : null}
            {labelFrom("shift", job.shift)}
          </dd>
        </div>
        <div className="fact">
          <dt>{copy.jobs.employment}</dt>
          <dd>
            {filterable ? <span className="visually-hidden" aria-hidden="true" fs-list-field="employment">{job.employmentType}</span> : null}
            {labelFrom("employmentType", job.employmentType)}
          </dd>
        </div>
      </dl>
      {pay ? <p><strong>{copy.jobs.compensation}: </strong>{pay}</p> : null}
      <p>{job.summary}</p>
      <div className="card-foot">
        <Link className="card-action" href={`/careers/${job.slug}`}>{copy.cta.viewRole}</Link>
      </div>
    </article>
  );
}

export function PersonCard({ member, department, departmentSlug = "", filterable = false }: { member: TeamMember; department?: string; departmentSlug?: string; filterable?: boolean }) {
  return (
    <article className="person-card" {...(filterable ? { "fs-list-element": "item" } : {})}>
      <img src={member.portrait.src} alt={member.portrait.alt} width={640} height={800} />
      <div className="card-copy">
        <h3>
          <Link href={`/team/${member.slug}`}>{member.name}</Link>
          <VerifiedMark />
        </h3>
        <p>{department ? `${member.role} · ${department}` : member.role}</p>
        {filterable ? <span className="visually-hidden" aria-hidden="true" fs-list-field="department">{departmentSlug}</span> : null}
        <div className="card-foot">
          {member.demo ? <SampleBadge /> : <span />}
          <Link className="card-action" href={`/team/${member.slug}`}>{copy.cta.viewProfile}</Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleCard({ post, category, categorySlug = "", filterable = false }: { post: BlogPost; category?: string; categorySlug?: string; filterable?: boolean }) {
  return (
    <article className="article-card inset-card" {...(filterable ? { "fs-list-element": "item" } : {})}>
      <img src={post.image.src} alt={post.image.alt} width={1200} height={800} />
      <div className="card-copy">
        <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <p className="card-meta">{formatDate(post.publishedAt)}</p>
        {filterable ? <span className="visually-hidden" aria-hidden="true" fs-list-field="category">{categorySlug}</span> : null}
        <div className="card-foot">
          <p className="card-meta">
            {post.demo ? <SampleBadge /> : null}
            {category ? <span>{category}</span> : null}
          </p>
          <Link className="card-action" href={`/blog/${post.slug}`}>{copy.cta.readArticle}</Link>
        </div>
      </div>
    </article>
  );
}

export function LocationCard({ location, filterable = false }: { location: Location; filterable?: boolean }) {
  return (
    <article className="location-card inset-card" {...(filterable ? { "fs-list-element": "item" } : {})}>
      <img src={location.image.src} alt={location.image.alt} width={1200} height={800} />
      <div className="card-copy">
        <h3><Link href={`/locations/${location.slug}`}>{location.name}</Link></h3>
        <p>{location.summary}</p>
        {filterable ? <span className="visually-hidden" aria-hidden="true" fs-list-field="region">{location.region}</span> : null}
        <div className="card-foot">
          <p className="card-meta">
            {location.demo ? <SampleBadge /> : null}
            <span>{location.kind === "office" ? copy.locations.office : copy.locations.serviceArea}</span>
            <span>{location.city}, {location.state}</span>
          </p>
          <Link className="card-action" href={`/locations/${location.slug}`}>{copy.cta.viewLocation}</Link>
        </div>
      </div>
    </article>
  );
}

export function closingCopy(name: string) {
  return fill(copy.locations.requestHere, { name });
}
