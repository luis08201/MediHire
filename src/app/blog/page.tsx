import { ArticleCard, ArticleHero, Breadcrumbs, JsonLd } from "@/components/content";
import { FilteredDirectory } from "@/components/directory";
import { copy } from "@/i18n/en";
import { blogFilterOptions, categoryById, getPage, listBlogPosts, pageField } from "@/lib/cms/queries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = getPage("blog");
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/blog" });
}

export default function BlogPage() {
  const page = getPage("blog");
  const posts = listBlogPosts();
  const leadPost = posts[0];
  const listed = leadPost ? posts.slice(1) : posts;
  return (
    <div className="blog-page">
      <div className="wrap">
        <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/blog" }])} />
        <h1 className="visually-hidden">{page.title}</h1>
        <p className="visually-hidden">{pageField(page, "lede")}</p>
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
        <FilteredDirectory
          instance="blog"
          pageSize={4}
          groups={[{ field: "category", legend: copy.filters.category, options: blogFilterOptions(posts) }]}
          noun={copy.blog.articles}
          emptyTitle={copy.filters.emptyBlogTitle}
          emptyBody={copy.filters.emptyBlogBody}
          total={listed.length}
          listClassName="magazine"
          lead={leadPost ? (
            <>
              <ArticleHero post={leadPost} />
              <div className="mag-head">
                <p className="mag-label"><span>{copy.blog.latest}</span></p>
                <p className="mag-label"><span>{copy.blog.featured}</span></p>
              </div>
            </>
          ) : null}
        >
          {listed.map((post) => {
            const category = categoryById(post.categoryId);
            return (
              <ArticleCard
                key={post.id}
                post={post}
                category={category?.name}
                categorySlug={category?.slug}
                variant="magazine"
                filterable
              />
            );
          })}
        </FilteredDirectory>
      </div>
    </div>
  );
}
