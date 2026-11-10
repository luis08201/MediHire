import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd, Markdown, SampleBadge } from "@/components/content";
import { departmentById, getTeamMember } from "@/lib/cms/queries";
import { copy } from "@/i18n/en";
import { isPreview } from "@/lib/preview";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const member = getTeamMember(slug, { includeDrafts: preview });
  if (!member) return {};
  return buildMetadata({
    title: member.seo.title,
    description: member.seo.description,
    path: `/team/${member.slug}`,
    indexable: !member.demo && member.editorialStatus === "published",
    image: member.portrait.src,
    imageAlt: member.portrait.alt,
  });
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const member = getTeamMember(slug, { includeDrafts: preview });
  if (!member) notFound();
  const department = departmentById(member.departmentId);
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Team", path: "/team" },
        { name: member.name, path: `/team/${member.slug}` },
      ])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Team", path: "/team" }, { name: member.name }]} />
      <article className="profile">
        <img src={member.portrait.src} alt={member.portrait.alt} width={800} height={1000} />
        <div>
          <div className="badge-row">
            {member.demo ? <SampleBadge /> : null}
            {member.editorialStatus === "draft" ? <span className="badge">Draft</span> : null}
          </div>
          <h1>{member.name}</h1>
          <p className="lede">{member.role}</p>
          {department ? (
            <p>{copy.team.department}: <Link href={`/team/category/${department.slug}`}>{department.name}</Link></p>
          ) : null}
          <Markdown source={member.biography} />
        </div>
      </article>
    </div>
  );
}
