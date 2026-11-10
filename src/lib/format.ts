import { copy } from "@/i18n/en";
import type { Compensation, Job } from "./cms/types";

export function todayIso(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function isPastDate(iso: string | null, now = new Date()) {
  if (!iso) return false;
  return iso.slice(0, 10) < todayIso(now);
}

export function isFutureDate(iso: string | null, now = new Date()) {
  if (!iso) return false;
  return iso.slice(0, 10) > todayIso(now);
}

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
}

export function labelFrom(group: "specialty" | "shift" | "employmentType" | "arrangement" | "region" | "service", value: string) {
  const table = copy.vocabulary[group] as Record<string, string>;
  return table[value] ?? value;
}

export function formatCompensation(compensation: Compensation | null) {
  if (!compensation || (!compensation.min && !compensation.max)) return null;
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: compensation.currency,
    maximumFractionDigits: 0,
  });
  const period = compensation.period === "hour" ? "hour" : "year";
  if (compensation.min && compensation.max && compensation.min !== compensation.max) {
    return `${money.format(compensation.min)}–${money.format(compensation.max)} per ${period}`;
  }
  const amount = compensation.min || compensation.max;
  return `${money.format(amount)} per ${period}`;
}

export function jobIsExpired(job: Pick<Job, "closingDate">, now = new Date()) {
  return isPastDate(job.closingDate, now);
}

export function jobIsPublic(job: Job, now = new Date()) {
  if (job.editorialStatus !== "published") return false;
  if (job.jobStatus !== "open") return false;
  if (job.publishedAt && isFutureDate(job.publishedAt, now)) return false;
  if (jobIsExpired(job, now)) return false;
  return true;
}

export function entryIsPublic(entry: { editorialStatus: string; publishedAt?: string | null }, now = new Date()) {
  if (entry.editorialStatus !== "published") return false;
  if (entry.publishedAt && isFutureDate(entry.publishedAt, now)) return false;
  return true;
}

export function applicationIsOpen(job: Job, now = new Date()) {
  return jobIsPublic(job, now) && (job.application.mode === "internal" || Boolean(job.application.url));
}

const employmentTypeMap: Record<Job["employmentType"], string> = {
  temporary: "TEMPORARY",
  "per-diem": "PER_DIEM",
  contract: "CONTRACTOR",
  permanent: "FULL_TIME",
};

export function jobPostingEligible(job: Job, indexingLive: boolean, now = new Date()) {
  return indexingLive && !job.demo && applicationIsOpen(job, now);
}

export function buildJobPosting(job: Job, location: { city: string; state: string; name: string } | undefined, pageUrl: string) {
  const description = [job.summary, job.responsibilities, job.qualifications].filter(Boolean).join("\n\n");
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: job.publishedAt,
    employmentType: employmentTypeMap[job.employmentType],
    hiringOrganization: {
      "@type": "Organization",
      name: job.employer,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "MediHire",
      value: job.id,
    },
    directApply: job.application.mode === "internal",
    url: job.application.mode === "external" && job.application.url ? job.application.url : pageUrl,
  };
  if (job.closingDate) data.validThrough = job.closingDate;
  if (job.workArrangement === "remote") {
    data.jobLocationType = "TELECOMMUTE";
    data.applicantLocationRequirements = { "@type": "Country", name: "United States" };
  }
  if (location && job.workArrangement !== "remote") {
    data.jobLocation = {
      "@type": "Place",
      name: location.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: location.city,
        addressRegion: location.state,
        addressCountry: "US",
      },
    };
  }
  if (job.compensation) {
    data.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.compensation.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: job.compensation.min,
        maxValue: job.compensation.max,
        unitText: job.compensation.period === "hour" ? "HOUR" : "YEAR",
      },
    };
  }
  return data;
}
