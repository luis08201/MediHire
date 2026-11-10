import { ArticleCard, Breadcrumbs, JournalSpotlight, JsonLd } from "@/components/content";
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
  const latest = posts[0];
  return (
    <div className="blog-page">
      <div className="wrap">
        <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: "/blog" }])} />
        <h1 className="visually-hidden">{page.title}</h1>
        <p className="visually-hidden">{pageField(page, "lede")}</p>
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
        {latest ? <JournalSpotlight latest={latest} reads={posts.slice(1, 4)} /> : null}
        <FilteredDirectory
          instance="blog"
          pageSize={4}
          search={{ label: copy.blog.search, placeholder: copy.blog.searchPlaceholder }}
          groups={[{ field: "category", legend: copy.filters.category, options: blogFilterOptions(posts) }]}
          noun={copy.blog.articles}
          emptyTitle={copy.filters.emptyBlogTitle}
          emptyBody={copy.filters.emptyBlogBody}
          total={posts.length}
          listClassName="journal"
          browseLabel={copy.blog.browse}
          clearLabel={copy.blog.all}
        >
          {posts.map((post) => {
            const category = categoryById(post.categoryId);
            return (
              <ArticleCard
                key={post.id}
                post={post}
                category={category?.name}
                categorySlug={category?.slug}
                variant="journal"
                filterable
              />
            );
          })}
        </FilteredDirectory>
        <section className="journal-news" aria-labelledby="journal-news-title">
          <img src="/media/hero-team.jpg" alt="Hands type on a laptop beside a stethoscope on a wooden desk." width={900} height={700} />
          <form className="journal-news-card" action="/contact" method="get">
            <p className="journal-news-brand">{copy.brand}</p>
            <h2 id="journal-news-title">{copy.blog.newsletterTitle}</h2>
            <p>{copy.blog.newsletterBody}</p>
            <label>
              <span className="visually-hidden">{copy.blog.newsletterEmail}</span>
              <input type="email" name="email" required autoComplete="email" placeholder={copy.blog.newsletterEmail} />
            </label>
            <button type="submit">{copy.blog.newsletterAction}</button>
          </form>
        </section>
      </div>
    </div>
  );
}
