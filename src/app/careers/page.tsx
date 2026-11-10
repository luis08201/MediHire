import { Breadcrumbs, JobCard, JsonLd } from "@/components/content";
import { FilteredDirectory } from "@/components/directory";
import { copy } from "@/i18n/en";
import { careerFilterOptions, getPage, listJobs, locationById, pageField } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("careers");
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/careers" });
}

export default function CareersPage() {
  const page = getPage("careers");
  const jobs = listJobs();
  const filters = careerFilterOptions(jobs);
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/careers" }])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
      <h1>{page.title}</h1>
      <p className="lede">{pageField(page, "lede")}</p>
      <FilteredDirectory
        instance="careers"
        pageSize={6}
        showQuery
        search={{ label: copy.filters.careersSearchLabel, placeholder: copy.filters.careersSearchPlaceholder }}
        groups={[
          { field: "specialty", legend: copy.filters.specialty, options: filters.specialty },
          { field: "location", legend: copy.filters.location, options: filters.location },
          { field: "employment", legend: copy.filters.employmentType, options: filters.employmentType },
          { field: "shift", legend: copy.filters.shift, options: filters.shift },
        ]}
        noun={copy.jobs.openings}
        emptyTitle={copy.filters.emptyCareersTitle}
        emptyBody={copy.filters.emptyCareersBody}
        total={jobs.length}
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} location={locationById(job.locationId)} filterable />
        ))}
      </FilteredDirectory>
    </div>
  );
}
