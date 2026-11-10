import Link from "next/link";
import { copy, fill } from "@/i18n/en";
import { formatDate, labelFrom } from "@/lib/format";
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

const roleTones = ["peach", "mint", "lilac", "sky", "blush", "mist"] as const;

function roleTone(slug: string) {
  let total = 0;
  for (const char of slug) total += char.charCodeAt(0);
  return roleTones[total % roleTones.length];
}

function roleDate(iso: string | null) {
  if (!iso) return "";
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${date.getUTCDate()} ${month}, ${date.getUTCFullYear()}`;
}

function compactPay(compensation: Job["compensation"]) {
  if (!compensation || (!compensation.min && !compensation.max)) return null;
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: compensation.currency,
    maximumFractionDigits: 0,
  });
  const suffix = compensation.period === "hour" ? "/hr" : "/yr";
  const min = compensation.min || compensation.max;
  const max = compensation.max || compensation.min;
  if (min && max && min !== max) return `${money.format(min)}–${money.format(max)}${suffix}`;
  return `${money.format(min || max)}${suffix}`;
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
  const pay = compactPay(job.compensation);
  const place = location ? `${location.city}, ${location.state}` : "";
  const initial = job.employer.trim().charAt(0).toUpperCase();
  return (
    <article className={`job-card role-card tone-${roleTone(job.slug)}`} {...(filterable ? { "fs-list-element": "item" } : {})}>
      <div className="role-body">
        {job.publishedAt ? <p className="role-date">{roleDate(job.publishedAt)}</p> : null}
        <div className="role-head">
          <div>
            <p className="role-employer">{job.employer}</p>
            <h3>
              <Link href={`/careers/${job.slug}`} {...(filterable ? { "fs-list-field": "title" } : {})}>{job.title}</Link>
            </h3>
          </div>
          {initial ? <span className="role-mark" aria-hidden="true">{initial}</span> : null}
        </div>
        <div className="role-tags">
          {job.demo ? <span>{copy.sample}</span> : null}
          <span>{labelFrom("employmentType", job.employmentType)}</span>
          <span>{labelFrom("shift", job.shift)}</span>
          <span>{labelFrom("arrangement", job.workArrangement)}</span>
        </div>
        {filterable ? (
          <>
            <span className="visually-hidden" aria-hidden="true" fs-list-field="search">{`${job.title} ${specialty}`}</span>
            <span className="visually-hidden" aria-hidden="true" fs-list-field="specialty">{job.specialty}</span>
            {location ? <span className="visually-hidden" aria-hidden="true" fs-list-field="location">{location.slug}</span> : null}
            <span className="visually-hidden" aria-hidden="true" fs-list-field="shift">{job.shift}</span>
            <span className="visually-hidden" aria-hidden="true" fs-list-field="employment">{job.employmentType}</span>
          </>
        ) : null}
      </div>
      <div className="role-foot">
        <p>
          {pay ? <strong className="role-pay">{pay}</strong> : null}
          {place ? <span className="role-place">{place}</span> : null}
        </p>
        <Link className="role-details" href={`/careers/${job.slug}`}>{copy.cta.details}</Link>
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
        <p>{member.role}</p>
        {filterable ? <span className="visually-hidden" aria-hidden="true" fs-list-field="department">{departmentSlug}</span> : null}
        <div className="card-foot">
          <p className="card-meta">
            {member.demo ? <span>{copy.sample}</span> : null}
            {department ? <span>{department}</span> : null}
          </p>
          <Link className="card-action" href={`/team/${member.slug}`}>{copy.cta.viewProfile}</Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <article className="mag-hero">
      <img src={post.image.src} alt={post.image.alt} width={1600} height={900} />
      <div className="mag-hero-copy">
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <Link className="mag-read" href={`/blog/${post.slug}`}>{copy.cta.readArticle}</Link>
      </div>
    </article>
  );
}

export function ArticleCard({ post, category, categorySlug = "", filterable = false, variant = "inset" }: { post: BlogPost; category?: string; categorySlug?: string; filterable?: boolean; variant?: "inset" | "magazine" }) {
  if (variant === "magazine") {
    return (
      <article className="mag-card" {...(filterable ? { "fs-list-element": "item" } : {})}>
        <Link className="mag-media" href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
          <img src={post.image.src} alt="" width={1200} height={800} />
        </Link>
        <div className="mag-copy">
          <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
          <p>{post.excerpt}</p>
          <p className="mag-meta">
            {post.demo ? <span>{copy.sample}</span> : null}
            {category ? <Link href={`/blog/category/${categorySlug}`}>{category}</Link> : null}
            {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
          </p>
          {filterable ? <span className="visually-hidden" aria-hidden="true" fs-list-field="category">{categorySlug}</span> : null}
        </div>
      </article>
    );
  }
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
