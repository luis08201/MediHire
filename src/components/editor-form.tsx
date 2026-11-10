"use client";

import { useActionState } from "react";
import { saveEntryAction } from "@/app/admin/actions";
import type { EditorField } from "@/lib/cms/schema";

export function EditorForm({
  collection,
  id,
  previousSlug,
  fields,
  values,
  pageId,
}: {
  collection: string;
  id: string;
  previousSlug: string;
  fields: EditorField[];
  values: Record<string, string>;
  pageId?: string;
}) {
  const [state, action, pending] = useActionState(saveEntryAction, { errors: {} });
  return (
    <form className="form-card" action={action}>
      {state.errors.form ? <p className="field-error" role="alert">{state.errors.form}</p> : null}
      <input type="hidden" name="collection" value={collection} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="previousSlug" value={previousSlug} />
      {collection === "pages" ? (
        <div className="field">
          <label htmlFor="entryId">Page id</label>
          <input id="entryId" name="entryId" defaultValue={pageId} required aria-invalid={Boolean(state.errors.entryId)} />
          {state.errors.entryId ? <p className="field-error">{state.errors.entryId}</p> : null}
        </div>
      ) : null}
      {fields.map((field) => {
        const error = state.errors[field.name];
        const value = values[field.name] ?? "";
        const inputId = field.name.replaceAll(".", "-");
        return (
          <div className="field" key={field.name}>
            {field.type === "checkbox" ? (
              <label className="check" htmlFor={inputId}>
                <input id={inputId} name={field.name} type="checkbox" value="true" defaultChecked={value === "true"} />
                <span>{field.label}</span>
              </label>
            ) : (
              <label htmlFor={inputId}>{field.label}</label>
            )}
            {field.type === "textarea" || field.type === "markdown" ? (
              <textarea id={inputId} name={field.name} rows={field.name === "fieldsJson" || field.type === "markdown" ? 12 : 4} defaultValue={value} aria-invalid={Boolean(error)} />
            ) : null}
            {field.type === "select" ? (
              <select id={inputId} name={field.name} defaultValue={value} aria-invalid={Boolean(error)}>
                <option value="">Select</option>
                {field.options?.map((option) => (
                  <option key={option.value || "empty"} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : null}
            {field.type === "text" || field.type === "date" || field.type === "number" ? (
              <input id={inputId} name={field.name} type={field.type === "text" ? "text" : field.type} defaultValue={value} aria-invalid={Boolean(error)} />
            ) : null}
            {field.help ? <p className="muted">{field.help}</p> : null}
            {error ? <p className="field-error">{error}</p> : null}
          </div>
        );
      })}
      <button className="button primary" type="submit" disabled={pending}>{pending ? "Saving" : "Publish changes"}</button>
    </form>
  );
}
