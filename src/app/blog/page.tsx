import Link from "next/link";
import { ArticleCard, Breadcrumbs, JsonLd } from "@/components/content";
import { FilteredDirectory } from "@/components/directory";
import { copy } from "@/i18n/en";
import { blogFilterOptions, categoryById, getPage, listBlogCategories, listBlogPosts, pageField } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("blog");
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/blog" });
}

export default function BlogPage() {
  const page = getPage("blog");
  const posts = listBlogPosts();
  const categories = listBlogCategories();
  return (
    <div className="wrap section">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/blog" }])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
      <h1>{page.title}</h1>
      <p className="lede">{pageField(page, "lede")}</p>
      <nav aria-label={copy.filters.category}>
        <ul className="badge-row">
          {categories.map((category) => (
            <li key={category.id}><Link href={`/blog/category/${category.slug}`}>{category.name}</Link></li>
          ))}
        </ul>
      </nav>
      <FilteredDirectory
        instance="blog"
        pageSize={4}
        groups={[{ field: "category", legend: copy.filters.category, options: blogFilterOptions(posts) }]}
        noun={copy.blog.articles}
        emptyTitle={copy.filters.emptyBlogTitle}
        emptyBody={copy.filters.emptyBlogBody}
        total={posts.length}
        listClassName="cards"
      >
        {posts.map((post) => {
          const category = categoryById(post.categoryId);
          return (
            <ArticleCard
              key={post.id}
              post={post}
              category={category?.name}
              categorySlug={category?.slug}
              filterable
            />
          );
        })}
      </FilteredDirectory>
    </div>
  );
}
