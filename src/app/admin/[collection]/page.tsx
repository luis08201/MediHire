import Link from "next/link";
import { notFound } from "next/navigation";
import { logoutAction, requireEditor } from "../actions";
import { collectionLabels, isCollection, publicPath } from "@/lib/cms/schema";
import { readCollection } from "@/lib/cms/store";

export const metadata = { title: "Collection", robots: { index: false, follow: false } };

function labelOf(entry: { id: string } & Record<string, unknown>) {
  if (typeof entry.name === "string" && entry.name) return entry.name;
  if (typeof entry.title === "string" && entry.title) return entry.title;
  return entry.id;
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  await requireEditor();
  const { collection } = await params;
  if (!isCollection(collection)) notFound();
  const entries = readCollection(collection);
  return (
    <div className="wrap section admin">
      <div className="admin-bar">
        <h1>{collectionLabels[collection]}</h1>
        <form action={logoutAction}><button className="button ghost" type="submit">Sign out</button></form>
      </div>
      <p><Link href="/admin">All collections</Link> · <Link href={`/admin/${collection}/new`}>New entry</Link></p>
      <table className="table">
        <thead>
          <tr><th>Entry</th><th>Status</th><th>Public path</th></tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td><Link href={`/admin/${collection}/${entry.id}`}>{labelOf(entry as { id: string } & Record<string, unknown>)}</Link></td>
              <td>{"editorialStatus" in entry ? entry.editorialStatus : "page"}{"jobStatus" in entry ? ` · ${entry.jobStatus}` : ""}</td>
              <td>{"slug" in entry || collection === "pages" ? publicPath(collection, entry) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
