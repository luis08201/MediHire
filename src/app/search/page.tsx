import Link from "next/link";
import { Breadcrumbs } from "@/components/content";
import { copy, fill } from "@/i18n/en";
import { groupHits, searchPublic } from "@/lib/search";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  return buildMetadata({
    title: query ? fill(copy.search.resultsTitle, { query }) : copy.search.blankTitle,
    description: copy.search.blankBody,
    path: "/search",
    indexable: false,
  });
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const hits = query ? searchPublic(query) : [];
  const groups = groupHits(hits);
  return (
    <div className="wrap section">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: copy.search.title }]} />
      <h1>{query ? fill(copy.search.resultsTitle, { query }) : copy.search.blankTitle}</h1>
      <form className="form-card" action="/search" method="get" role="search">
        <div className="field">
          <label htmlFor="q">{copy.search.label}</label>
          <input id="q" name="q" type="search" defaultValue={query} placeholder={copy.search.placeholder} />
        </div>
        <button className="button primary" type="submit">{copy.search.submit}</button>
      </form>
      {!query ? <p>{copy.search.blankBody}</p> : null}
      {query && groups.length === 0 ? (
        <div className="notice">
          <h2>{copy.search.noneTitle}</h2>
          <p>{copy.search.noneBody}</p>
        </div>
      ) : null}
      {groups.map((group) => (
        <section className="search-group" key={group.group} aria-labelledby={`search-${group.group}`}>
          <h2 id={`search-${group.group}`}>{group.label}</h2>
          <ul>
            {group.hits.map((hit) => (
              <li key={hit.href}>
                <Link href={hit.href}>{hit.title}</Link>
                <p>{hit.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
