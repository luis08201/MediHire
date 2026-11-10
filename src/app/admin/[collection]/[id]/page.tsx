import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorForm } from "@/components/editor-form";
import { deleteEntryAction, logoutAction, previewAction, requireEditor } from "../../actions";
import { getPath } from "@/lib/cms/mutate";
import { blankEntry, collectionLabels, editorFields, isCollection, publicPath } from "@/lib/cms/schema";
import { readCollection } from "@/lib/cms/store";
import { previewSecret } from "@/lib/auth";

export const metadata = { title: "Edit entry", robots: { index: false, follow: false } };

export default async function EditEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireEditor();
  const { collection, id } = await params;
  const query = await searchParams;
  if (!isCollection(collection)) notFound();
  const existing = id === "new" ? null : readCollection(collection).find((entry) => entry.id === id);
  if (id !== "new" && !existing) notFound();
  const entry = (existing ?? blankEntry(collection, "")) as Record<string, unknown>;
  const fields = editorFields(collection);
  const values: Record<string, string> = {};
  for (const field of fields) {
    if (field.name === "fieldsJson") values.fieldsJson = JSON.stringify(entry.fields ?? {}, null, 2);
    else values[field.name] = getPath(entry, field.name);
  }
  const slug = typeof entry.slug === "string" ? entry.slug : "";
  const previewPath = existing ? publicPath(collection, existing) : "";
  return (
    <div className="wrap section admin">
      <div className="admin-bar">
        <h1>{existing ? "Edit entry" : "New entry"}</h1>
        <form action={logoutAction}><button className="button ghost" type="submit">Sign out</button></form>
      </div>
      <p><Link href={`/admin/${collection}`}>{collectionLabels[collection]}</Link></p>
      {query.saved === "1" ? <p className="notice success">Saved. Restart the server if a slug change should redirect immediately.</p> : null}
      {query.saved === "locked" ? <p className="notice error">That page is part of the public site and was not deleted.</p> : null}
      {existing && previewSecret() ? (
        <form action={previewAction}>
          <input type="hidden" name="path" value={previewPath} />
          <button className="button secondary" type="submit">Open preview</button>
        </form>
      ) : null}
      <EditorForm
        collection={collection}
        id={existing?.id ?? ""}
        previousSlug={slug}
        fields={fields}
        values={values}
        pageId={collection === "pages" ? String(entry.id ?? "") : undefined}
      />
      {existing && !(collection === "pages" && ["home", "about", "services", "contact", "careers", "team", "blog", "locations"].includes(existing.id)) ? (
        <form action={deleteEntryAction}>
          <input type="hidden" name="collection" value={collection} />
          <input type="hidden" name="id" value={existing.id} />
          <button className="button ghost" type="submit">Delete entry</button>
        </form>
      ) : null}
    </div>
  );
}
