# CMS

MediHire stores editorial content as JSON in `content/`. The public site never reads the private submission folder.

## Collections

| File | Public routes | Relations |
|---|---|---|
| `team-categories.json` | `/team/category/[slug]` | — |
| `team-members.json` | `/team/[slug]` | `departmentId` → team category `id` |
| `locations.json` | `/locations/[slug]` | — |
| `blog-categories.json` | `/blog/category/[slug]` | — |
| `blog-posts.json` | `/blog/[slug]` | `categoryId`, `authorId` |
| `jobs.json` | `/careers/[slug]` | `locationId` → location `id` |
| `services.json` | `/services#[slug]` | — |
| `pages.json` | Fixed marketing routes | Page copy keyed by id |

Services and pages are editable marketing copy. They are not a seventh recruitment collection. The six recruitment collections are team categories, team members, jobs, blog categories, blog posts, and locations.

Ids and slugs are stable. Slugs match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Filterable job, location, and department values are codes (`icu-nursing`, `night`, `pacific`). Display labels live in `src/i18n/en.ts`, so a spelling change in the label does not change a shared filter URL.

## Publish states

- `editorialStatus`: `draft` or `published`.
- Jobs also have `jobStatus` (`open` or `closed`), `publishedAt`, and `closingDate`.
- A public job is published, open, not scheduled in the future, and not past its closing date. Closing dates are calendar dates in UTC and include that date.
- `demo: true` marks sample records. They render with a Sample badge, stay out of the sitemap, and never receive `JobPosting` structured data.

Drafts are available when the preview cookie is set. Preview responses are `noindex`.

## Editor

`/admin` checks an HMAC cookie (`mh_editor`) created from `CMS_EDITOR_PASSWORD`. Middleware protects the pages, and each server action checks the cookie again. The editor writes pretty-printed JSON. Deleting a required marketing page (home, about, services, contact, careers, team, blog, locations) is refused.

Page copy is one JSON object of strings. Keep the existing keys. The pages read those keys by name.

## Submissions

Staffing requests and applications are validated on the server. Success is shown only after the record is accepted. Spam controls are a honeypot field, a minimum of two seconds on the form, a twelve-hour form expiry, eight submissions an hour per IP, and a 48-hour duplicate fingerprint. Repeating the same submission id is idempotent.

When `FORM_WEBHOOK_URL` is empty, the success message says the site is in test mode. Files and JSON stay in `data/submissions`, which is gitignored.

## Export

`npm run export` or the button on the editorial desk writes:

- `exports/json/*.json` — one file per collection
- `exports/csv/*.csv` — UTF-8 with BOM, flattened fields, relation ids intact
- `exports/inventory.json` — import order, relation keys, asset list
- `exports/webflow-map.json` and `exports/framer-map.json`

Import categories, locations, then the entries that point at them. Details are in [migration.md](migration.md).
