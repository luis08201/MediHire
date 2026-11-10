import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, Breadcrumbs, JsonLd, Markdown, SampleBadge } from "@/components/content";
import { authorById, categoryById, getBlogPost, postsInCategory } from "@/lib/cms/queries";
import { copy } from "@/i18n/en";
import { entryIsPublic, formatDate } from "@/lib/format";
import { isPreview } from "@/lib/preview";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const post = getBlogPost(slug, { includeDrafts: preview });
  if (!post) return {};
  return buildMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: `/blog/${post.slug}`,
    indexable: !post.demo && entryIsPublic(post),
    image: post.image.src,
    imageAlt: post.image.alt,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = await isPreview();
  const post = getBlogPost(slug, { includeDrafts: preview });
  if (!post) notFound();
  const category = categoryById(post.categoryId);
  const author = authorById(post.authorId);
  const related = postsInCategory(post.categoryId).filter((item) => item.id !== post.id).slice(0, 2);
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: absoluteUrl(post.image.src),
    author: author ? { "@type": "Person", name: author.name } : undefined,
    articleSection: category?.name,
    inLanguage: "en",
  };
  return (
    <div className="wrap section">
      <JsonLd data={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]),
        article,
      ]} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Insights", path: "/blog" }, { name: post.title }]} />
      <article>
        <div className="badge-row">
          {post.demo ? <SampleBadge /> : null}
          {post.editorialStatus === "draft" ? <span className="badge">Draft</span> : null}
          {category ? <Link className="badge" href={`/blog/category/${category.slug}`}>{category.name}</Link> : null}
        </div>
        <h1>{post.title}</h1>
        <p className="lede">{post.excerpt}</p>
        <p className="muted">
          {copy.blog.by} {author ? <Link href={`/team/${author.slug}`}>{author.name}</Link> : "MediHire"}
          {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
        </p>
        {post.demo ? <p className="muted">{copy.blog.sampleNote}</p> : null}
        <img src={post.image.src} alt={post.image.alt} width={1200} height={800} />
        <Markdown source={post.body} />
      </article>
      {related.length ? (
        <section className="section">
          <h2>{copy.blog.related}</h2>
          <div className="article-grid">
            {related.map((item) => <ArticleCard key={item.id} post={item} category={category?.name} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
