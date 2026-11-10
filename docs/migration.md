# Migration

Run `npm run export` on a machine that has the current `content/` files. The `exports/` directory is the package to import. It is gitignored.

## Import order

1. Team categories
2. Blog categories
3. Locations
4. Team members (`departmentId` must already exist)
5. Blog posts (`categoryId` and `authorId` must already exist)
6. Jobs (`locationId` must already exist)
7. Services
8. Page copy

Match on `id` first and `slug` second. Do not regenerate slugs. Public URLs are the slugs.

## Redirects

`content/redirects.json` already sends:

- `/jobs` and `/jobs/:slug` to `/careers` and `/careers/:slug`
- `/insights` and `/insights/:slug` to `/blog` and `/blog/:slug`

The editor appends a redirect when a slug changes. Carry those rules into the next host. Next.js reads the file at startup, so a local slug change needs a restart before the redirect is active.

## Field mapping

`exports/webflow-map.json` names the option fields, references, images, and dates. `exports/csv/*.csv` is UTF-8 with a byte order mark. Nested CMS objects are flattened (`seo.title`, `portrait.src`, `application.mode`, `compensation.min`). Relation columns keep the target id.

`exports/inventory.json` lists every `/media/` path with the Unsplash source URL. Photographs are used under the Unsplash License. Re-download or relicense them on the destination; do not hotlink the local `/media` paths and assume they exist.

`exports/framer-map.json` repeats the integration work Framer would require. `verifiedOnPublishedPrototype` is `false`.

## Rebuild after the move

These are not CMS fields and will not arrive with the import:

- Editor password, preview cookie, and draft preview
- Server-side validation, honeypot, rate limit, duplicate detection, and test-mode copy
- Private submission store and CV files
- Webhook delivery
- `JobPosting` rules, `noindex` for samples, search, and the sitemap
- Finsweet script, restart-on-navigation, and the live region around the result count
- The permanent redirects above

Form notifications, account login, and billing are future product work. See [future-saas.md](future-saas.md).
