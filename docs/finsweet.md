# Finsweet Attributes v2

The careers, team, insights, and locations directories use [Finsweet Attributes v2 List Filter](https://finsweet.com/attributes/list-filter). List initialization waits on `window.Webflow.push`. MediHire is not a Webflow site, so the layout installs a small queue that runs those callbacks immediately. Without it, pagination and filters never start. The script in the root layout is:

```html
<script async type="module" src="https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js" fs-list></script>
```

Each directory is server-rendered. If the script does not load, the full list stays visible, the empty state stays hidden, and pagination stays hidden. The script paginates in the browser and filters the in-memory list, so a record past the first visual page is still filterable.

The React bridge calls `FinsweetAttributes.modules.list.restart()` after a client-side navigation. List markup is not owned by a client component, because a re-render would put back nodes the script removed. There is no `fs-list-element="initial"` (that hides the list until a filter is chosen) and no scroll anchor (that would move the page). Result changes update an `aria-live="polite"` sentence and do not move focus.

## Markup

| Attribute | Where | MediHire value |
|---|---|---|
| `fs-list-element="wrapper"` | Around filters, count, list, empty state, and pagination | One per directory |
| `fs-list-instance` | Wrapper, filters, list, empty, pagination, clear | `careers`, `team`, `blog`, or `locations` |
| `fs-list-element="filters"` | Native `<form>` | Checkboxes and, on careers, one search box |
| `fs-list-element="list"` | The list | Direct children are the items |
| `fs-list-element="item"` | Each card | — |
| `fs-list-load="pagination"` | List | — |
| `fs-list-itemsperpage` | List | Careers 6, team 6, insights 4, locations 4 |
| `fs-list-showquery="true"` | Careers list only | Puts the filter in the query string |
| `fs-list-element="results-count"` | The number inside “Showing N …” | Text is replaced with the match count |
| `fs-list-element="empty"` | No-results panel, direct child of the wrapper | Contains a reset button |
| `fs-list-element="clear"` | Clear and reset buttons | `type="button"` |
| `fs-list-element="pagination-*"` | Previous, next, page button, page count | The page button sits in its own `<div>` |

Controls use `fs-list-field` and, for checkboxes, `fs-list-value`. Checkboxes in one group share a `name`. Within a group, checked values match with OR. Groups combine with AND. The search box uses the default “contain” match.

## CMS fields

Visible labels are not the filter values. A visually hidden element carries the stable code.

| Page | Control field | Item element | CMS source |
|---|---|---|---|
| Careers search | `search` | Hidden text of title plus specialty label | `title`, specialty label |
| Careers specialty | `specialty` | Hidden `specialty` | `jobs.specialty` |
| Careers location | `location` | Hidden location slug | `locations.slug` via `jobs.locationId` |
| Careers employment | `employment` | Hidden employment code | `jobs.employmentType` |
| Careers shift | `shift` | Hidden shift code | `jobs.shift` |
| Team | `department` | Hidden department slug | Team category `slug` via `departmentId` |
| Insights | `category` | Hidden category slug | Blog category `slug` via `categoryId` |
| Locations | `region` | Hidden region code | `locations.region` |

Choices are built from published records only. Careers adds `fs-list-showquery="true"`. With one list on the page the query has no instance prefix, for example `?search_contain=wound&shift_equal=["night"]&employment_equal=["temporary"]`. Opening or refreshing that URL restores the checkboxes and the search.

Sample records used to prove the full list is filtered:

- Night wound care in Nashville is the last active job, past page 1, and the only night temporary opening.
- Camille Ortiz is the only Quality and safety profile and sits past page 1 of the team list.
- The clinician-careers article is the oldest published article, so it renders past page 1.
- Seattle is the only Pacific service area and sits past page 1 of locations.

`/search` does not use these attributes. It queries pages, services, active jobs, published profiles, published articles, and published locations, then groups the hits.

## Webflow

Recreate the same attributes on a CMS collection list. Webflow cannot always set an input’s value from a CMS field, which is why checkboxes use `fs-list-value`. Put the stable slug or code in that value. Keep the display label in the visible text. Add a custom empty state; Webflow’s native empty element is not the one the script shows. Set the list to render every eligible item, then let `fs-list-load="pagination"` page it. Do not turn on the initial-filter hide.

## Framer

This repository does not promise the same behavior in Framer. It was not checked on a published Framer prototype.

A Framer implementation would need a code component that emits this markup, the v2 script with `fs-list` on the published site, and a restart after navigation. Finsweet removes and clones DOM nodes. A React render after that can wipe the filtered list. Relation keys and stable option values still have to be stored. Confirm those pieces on a published URL before describing Framer as equivalent.
