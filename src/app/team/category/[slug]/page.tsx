import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd, Markdown, PersonCard } from "@/components/content";
import { departmentById, getTeamCategory, membersInDepartment } from "@/lib/cms/queries";
import { copy } from "@/i18n/en";
import { isPreview } from "@/lib/preview";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const category = getTeamCategory(slug, { includeDrafts: preview });
  if (!category) return {};
  return buildMetadata({
    title: category.seo.title,
    description: category.seo.description,
    path: `/team/category/${category.slug}`,
    indexable: category.editorialStatus === "published",
  });
}

export default async function TeamCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const category = getTeamCategory(slug, { includeDrafts: preview });
  if (!category) notFound();
  const members = membersInDepartment(category.id, { includeDrafts: preview && category.editorialStatus === "draft" });
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Team", path: "/team" },
        { name: category.name, path: `/team/category/${category.slug}` },
      ])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Team", path: "/team" }, { name: category.name }]} />
      <p className="eyebrow">{copy.team.department}</p>
      <h1>{category.name}</h1>
      <p className="lede">{category.summary}</p>
      <Markdown source={category.description} />
      {members.length ? (
        <div className="card-grid">
          {members.map((member) => (
            <PersonCard key={member.id} member={member} department={departmentById(member.departmentId)?.name} />
          ))}
        </div>
      ) : <p>{copy.team.emptyCategory}</p>}
    </div>
  );
}
