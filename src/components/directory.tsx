import type { ReactNode } from "react";
import { copy } from "@/i18n/en";

type Option = { value: string; label: string };
type Group = { field: string; legend: string; options: Option[] };

export function FilteredDirectory({
  instance,
  pageSize,
  showQuery = false,
  search,
  groups,
  noun,
  emptyTitle,
  emptyBody,
  total,
  listClassName,
  lead,
  children,
}: {
  instance: string;
  pageSize: number;
  showQuery?: boolean;
  search?: { label: string; placeholder: string };
  groups: Group[];
  noun: string;
  emptyTitle: string;
  emptyBody: string;
  total: number;
  listClassName?: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  const listId = `${instance}-list`;
  return (
    <div className="directory" fs-list-element="wrapper" fs-list-instance={instance}>
      <form className="filters" fs-list-element="filters" fs-list-instance={instance} aria-controls={listId}>
        {search ? (
          <div className="field">
            <label htmlFor={`${instance}-search`}>{search.label}</label>
            <input
              id={`${instance}-search`}
              type="search"
              fs-list-field="search"
              fs-list-debounce="250"
              placeholder={search.placeholder}
            />
          </div>
        ) : null}
        {groups.map((group) => (
          <fieldset key={group.field}>
            <legend>{group.legend}</legend>
            {group.options.map((option) => {
              const id = `${instance}-${group.field}-${option.value}`;
              return (
                <label className="check" key={option.value} htmlFor={id}>
                  <input
                    id={id}
                    type="checkbox"
                    name={group.field}
                    value={option.value}
                    fs-list-field={group.field}
                    fs-list-value={option.value}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </fieldset>
        ))}
        <button type="button" className="text-button" fs-list-element="clear" fs-list-instance={instance}>
          {copy.cta.clearFilters}
        </button>
        {showQuery ? <p className="muted">{copy.filters.shareable}</p> : null}
      </form>
      <p className="result-count" aria-live="polite" aria-atomic="true" id={`${instance}-count`}>
        {copy.filters.showing}{" "}
        <span fs-list-element="results-count" fs-list-instance={instance}>{total}</span>{" "}
        {noun}
      </p>
      {lead}
      <div
        className={listClassName ? `list ${listClassName}` : "list"}
        id={listId}
        fs-list-element="list"
        fs-list-instance={instance}
        fs-list-load="pagination"
        fs-list-itemsperpage={String(pageSize)}
        fs-list-showquery={showQuery ? "true" : undefined}
      >
        {children}
      </div>
      <div className="notice" fs-list-element="empty" fs-list-instance={instance}>
        <h2>{emptyTitle}</h2>
        <p>{emptyBody}</p>
        <button type="button" className="button secondary" fs-list-element="clear" fs-list-instance={instance}>
          {copy.cta.resetFilters}
        </button>
      </div>
      <nav className="pagination" fs-list-element="pagination-wrapper" fs-list-instance={instance} aria-label={copy.filters.pagination}>
        <button type="button" fs-list-element="pagination-previous" fs-list-instance={instance}>{copy.filters.previous}</button>
        <div className="page-slot">
          <button type="button" fs-list-element="page-button" fs-list-instance={instance}>1</button>
        </div>
        <span fs-list-element="page-count" fs-list-instance={instance} />
        <button type="button" fs-list-element="pagination-next" fs-list-instance={instance}>{copy.filters.next}</button>
      </nav>
    </div>
  );
}
