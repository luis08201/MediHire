# MediHire

MediHire is a demonstration healthcare recruitment website. Hospitals and clinics review services and coverage, then send a staffing request. Healthcare professionals filter openings and apply. English is the only public language. Shared interface copy lives in `src/i18n/en.ts` so a later locale can be added without rewriting the pages.

The public site, job board, request and application flows, and editorial CMS are in this repository. Private accounts, applicant tracking, organization permissions, and billing are described in [docs/future-saas.md](docs/future-saas.md) and are not built.

## CMS choice

Content is a small file-based headless CMS:

- Published and draft records are JSON files in `content/`.
- Editors sign in at `/admin` and write those files on the server.
- The public site reads the files on the server and renders HTML.
- `npm run export` writes JSON, UTF-8 CSV, an asset inventory, and Webflow and Framer field maps to `exports/`.

Payload and Keystatic were not used. Payload needs a database and native dependencies. Keystatic’s git-based editor is a different publishing model. JSON files keep stable ids, slugs, and relation keys that a migration can import in a known order. The tradeoff is that the editor writes to the local disk. A serverless host needs a persistent volume, or content edits will disappear when the instance is replaced. See [docs/cms.md](docs/cms.md).

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The editorial desk is `http://localhost:3000/admin`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, Open Graph URLs, and the sitemap. |
| `SITE_INDEXING` | `off` sends `noindex` and disallows crawlers. `live` allows indexing of non-sample public pages. |
| `CMS_EDITOR_PASSWORD` | Password for `/admin`. Required before sign-in works. |
| `CMS_PREVIEW_SECRET` | Secret for preview links and the preview cookie. |
| `FORM_WEBHOOK_URL` | Optional JSON endpoint for accepted requests and applications. Empty means test mode. |
| `FORM_WEBHOOK_TOKEN` | Optional bearer token for that endpoint. |
| `SUBMISSIONS_DIR` | Optional override for the private submission folder. Defaults to `data/submissions`. |

Set both secrets in `.env.local` before editing. Do not commit that file. Sample local values are fine on your own machine; use long random values anywhere else.

```bash
npm run typecheck
npm test
npm run build
npm start
npm run export
npm run seed
```

`npm run seed` rewrites the sample collections. It does not reset redirects.

## Editing and publishing

1. Sign in at `/admin`.
2. Open a collection. Editorial status `draft` stays off public pages, search, and the sitemap.
3. Save. The JSON file updates immediately.
4. Use **Open preview** to set a preview cookie and see drafts in this browser. Exit from the preview banner or `/api/preview/exit`.
5. A direct preview link is `GET /api/preview?secret=CMS_PREVIEW_SECRET&path=/team/rowan-hale`.
6. Changing a slug appends a redirect in `content/redirects.json`. Restart the server so Next.js reloads `next.config.ts`.

Job status (`open` or `closed`) and the publication and closing dates are separate from editorial status. A published job leaves the board when it is closed or when the closing date is before today (UTC). Its page can remain, with the application action removed and `noindex` applied.

## Finsweet filters

Careers, team, insights, and locations use Finsweet Attributes v2 List Filter. The working attributes and the CMS fields they read are documented in [docs/finsweet.md](docs/finsweet.md). Site search at `/search` is separate: it queries the published index, not the list on the current page.

## Migration

Export, import order, slug preservation, redirects, and the integrations that have to be rebuilt are in [docs/migration.md](docs/migration.md). Framer filtering was not verified on a published prototype. The map states that plainly.

## What still needs production configuration

- Replace `CMS_EDITOR_PASSWORD` and `CMS_PREVIEW_SECRET`.
- Set `NEXT_PUBLIC_SITE_URL` to the public origin.
- Keep `SITE_INDEXING=off` until sample records are removed or unmarked. Sample jobs, profiles, articles, and places are labeled and kept out of the sitemap. `JobPosting` structured data is emitted only for a non-sample, active opening while indexing is live.
- Set `FORM_WEBHOOK_URL` to leave test mode. Until then, accepted submissions are stored only under `data/submissions`. CV files stay on that disk; production delivery should move them to private object storage. The webhook receives JSON metadata, not the file bytes.
- Give the CMS a persistent disk if more than one server handles requests.
- Rebuild form delivery, preview cookies, and the editor login after a move to Webflow or Framer. Those are application features, not CMS fields.
