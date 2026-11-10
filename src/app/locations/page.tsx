import { Breadcrumbs, JsonLd, LocationCard } from "@/components/content";
import { FilteredDirectory } from "@/components/directory";
import { copy } from "@/i18n/en";
import { getPage, listLocations, locationFilterOptions, pageField } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("locations");
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/locations" });
}

export default function LocationsPage() {
  const page = getPage("locations");
  const locations = listLocations();
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/locations" }])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
      <h1>{page.title}</h1>
      <p className="lede">{pageField(page, "lede")}</p>
      <FilteredDirectory
        instance="locations"
        pageSize={4}
        groups={[{ field: "region", legend: copy.filters.region, options: locationFilterOptions(locations) }]}
        noun={copy.locations.areas}
        emptyTitle={copy.filters.emptyLocationsTitle}
        emptyBody={copy.filters.emptyLocationsBody}
        total={locations.length}
        listClassName="cards"
      >
        {locations.map((location) => <LocationCard key={location.id} location={location} filterable />)}
      </FilteredDirectory>
    </div>
  );
}
