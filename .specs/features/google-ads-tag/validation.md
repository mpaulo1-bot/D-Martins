# Google Ads tag validation

Result: PASS for the requested tag installation in `reforma-de-casas/index.html`.

Independent verifier executed the actual inline script in Node `vm`, without network access. Assertions passed for a fresh dataLayer and an existing dataLayer; the existing array reference was preserved.

- `reforma-de-casas/index.html:6`: asynchronous loader uses exactly `https://www.googletagmanager.com/gtag/js?id=AW-18499634702`.
- `reforma-de-casas/index.html:8`: initializes or preserves `window.dataLayer`.
- `reforma-de-casas/index.html:9`: defines the queue function.
- `reforma-de-casas/index.html:10`: queues `js` with a Date object.
- `reforma-de-casas/index.html:12`: queues `config` with `AW-18499634702`.

Discrimination sensor: PASS. Replacing the ID with `AW-00000000000` in memory caused the assertions to reject the variant.

Scope check: `git diff -- index.html reforma-de-casas/index.html` showed only the requested tag addition; the homepage is unchanged.

Full-suite gate: PASS. After the homepage schema correction in `b450ce2`, the implementation author ran `npm run build` on the tree containing this unchanged tag addition. Sitemap generation, SEO validation and browser layout validation all passed (exit 0).

Limitations: no network request, browser tracking, deployment, or Google Ads reception was verified. The initial homepage schema failure was resolved before committing the tag.
