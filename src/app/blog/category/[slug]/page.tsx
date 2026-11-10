import { notFound } from "next/navigation";
import { ArticleCard, Breadcrumbs, JsonLd, Markdown } from "@/components/content";
import { categoryById, getBlogCategory, postsInCategory } from "@/lib/cms/queries";
import { copy } from "@/i18n/en";
import { isPreview } from "@/lib/preview";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const category = getBlogCategory(slug, { includeDrafts: preview });
  if (!category) return {};
  return buildMetadata({
    title: category.seo.title,
    description: category.seo.description,
    path: `/blog/category/${category.slug}`,
    indexable: category.editorialStatus === "published",
  });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const category = getBlogCategory(slug, { includeDrafts: preview });
  if (!category) notFound();
  const posts = postsInCategory(category.id);
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Insights", path: "/blog" },
        { name: category.name, path: `/blog/category/${category.slug}` },
      ])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Insights", path: "/blog" }, { name: category.name }]} />
      <p className="eyebrow">{copy.filters.category}</p>
      <h1>{category.name}</h1>
      <p className="lede">{category.summary}</p>
      <Markdown source={category.description} />
      {posts.length ? (
        <div className="mag-feed">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} category={categoryById(post.categoryId)?.name} categorySlug={category.slug} variant="magazine" />
          ))}
        </div>
      ) : <p>{copy.blog.emptyCategory}</p>}
    </div>
  );
}
