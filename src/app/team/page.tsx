import Link from "next/link";
import { Breadcrumbs, JsonLd, PersonCard } from "@/components/content";
import { FilteredDirectory } from "@/components/directory";
import { copy } from "@/i18n/en";
import { departmentById, getPage, listTeamCategories, listTeamMembers, pageField, teamFilterOptions } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("team");
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/team" });
}

export default function TeamPage() {
  const page = getPage("team");
  const members = listTeamMembers();
  const categories = listTeamCategories();
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/team" }])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
      <h1>{page.title}</h1>
      <p className="lede">{pageField(page, "lede")}</p>
      <nav aria-label={copy.filters.department}>
        <ul className="badge-row">
          {categories.map((category) => (
            <li key={category.id}><Link href={`/team/category/${category.slug}`}>{category.name}</Link></li>
          ))}
        </ul>
      </nav>
      <FilteredDirectory
        instance="team"
        pageSize={6}
        groups={[{ field: "department", legend: copy.filters.department, options: teamFilterOptions(members) }]}
        noun={copy.team.members}
        emptyTitle={copy.filters.emptyTeamTitle}
        emptyBody={copy.filters.emptyTeamBody}
        total={members.length}
        listClassName="cards"
      >
        {members.map((member) => {
          const department = departmentById(member.departmentId);
          return (
            <PersonCard
              key={member.id}
              member={member}
              department={department?.name}
              departmentSlug={department?.slug}
              filterable
            />
          );
        })}
      </FilteredDirectory>
    </div>
  );
}
