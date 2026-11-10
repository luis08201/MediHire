import Link from "next/link";
import { exportAction, logoutAction, requireEditor } from "./actions";
import { collectionLabels, collectionNames } from "@/lib/cms/schema";
import { readCollection } from "@/lib/cms/store";

export const metadata = { title: "Editorial desk", robots: { index: false, follow: false } };

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ exported?: string }> }) {
  await requireEditor();
  const query = await searchParams;
  return (
    <div className="wrap section admin">
      <div className="admin-bar">
        <h1>Editorial desk</h1>
        <form action={logoutAction}><button className="button ghost" type="submit">Sign out</button></form>
      </div>
      <p>Edit the six recruitment collections plus services and page copy. Public pages hide drafts. Export JSON and CSV before a migration.</p>
      {query.exported ? <p className="notice success">Export written to the exports folder on this server.</p> : null}
      <form action={exportAction}><button className="button secondary" type="submit">Export collections</button></form>
      <table className="table">
        <thead>
          <tr><th>Collection</th><th>Records</th><th></th></tr>
        </thead>
        <tbody>
          {collectionNames.map((name) => (
            <tr key={name}>
              <td>{collectionLabels[name]}</td>
              <td>{readCollection(name).length}</td>
              <td><Link href={`/admin/${name}`}>Open</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
