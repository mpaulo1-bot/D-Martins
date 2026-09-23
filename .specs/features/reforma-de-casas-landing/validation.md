# Reforma de casas — Validation

**Date**: 2026-09-23  
**Spec**: `.specs/features/reforma-de-casas-landing/spec.md`  
**Diff range**: `78a0413`  
**Verifier**: independent verifier (author ≠ verifier)

## Task Completion

No `tasks.md` exists for this feature; task status could not be independently checked.

## Spec-Anchored Acceptance Criteria

The implementation evidence below is present in the landing page, but the current automated gate has no landing-specific assertions. Under evidence-or-zero, criteria without a test assertion are gaps.

| Criterion | Spec-defined outcome | `file:line` + assertion expression | Result |
| --- | --- | --- | --- |
| RCF-001: access `/reforma-de-casas/` delivers Brazilian Portuguese HTML with canonical, title and description specific to residential renovations in Grande Vitória | `lang="pt-BR"`; canonical `https://construtoradmartins.com.br/reforma-de-casas/`; specific title and description | Implementation: `reforma-de-casas/index.html:2`, `:6`, `:8`, `:13`. No test assertion targets these values. | ⚠️ GAP |
| RCF-002: page offers WhatsApp budget calls using `+55 27 98862-4528` and contextual messages | WhatsApp links use `5527988624528` and contextual `text`; budget CTA is present | Implementation: `reforma-de-casas/index.html:108`, `:121`, `:173`. No test assertion targets phone/message links. | ⚠️ GAP |
| RCF-003: gallery has exactly kitchen and façade comparisons, each Before/After, using four WebPs | Exactly two comparison cards and four named assets | Implementation: `reforma-de-casas/index.html:139-150`; sitemap assets: `sitemap.xml:54-63`. No test assertion targets card count, labels, or the four feature assets. | ⚠️ GAP |
| RCF-004: every displayed image has alt/width/height; main image prioritized and others lazy | All `img` elements have required dimensions/alt; hero has `fetchpriority="high"`; gallery images have `loading="lazy"` | Implementation: `reforma-de-casas/index.html:114`, `:142-150`. The validator's image checks inspect only root `index.html`, not this landing. | ⚠️ GAP |
| RCF-005: sitemap contains canonical landing URL and four gallery images without tracking parameters | URL plus four feature image URLs, no tracking query parameters | Implementation: `sitemap.xml:52-63`. Existing validator checks sitemap consistency and tracking globally, but has no exact four-image landing assertion. | ⚠️ GAP |

**Status**: ❌ Gaps present (5/5 criteria lack landing-specific test assertions).

## Gate Check

- **Gate command**: `npm test`
- **Result**: 1 command passed, 0 failed, 0 skipped (`SEO check aprovado: metadados, schema, sitemap, robots, imagens e links.`)
- **Test count before feature**: not recorded in repository
- **Test count after feature**: no test framework/count; one validator command executed
- **Failures**: none in the real tree

## Discrimination Sensor

Sensor ran in temporary detached worktree `dmartins-reforma-verifier-9a27f306bf004fc5adcb91dc5d90ef65`; the real tree was never mutated. Baseline and post-cleanup porcelain both contained only the pre-existing untracked `.specs/STATE.md` and `.tmp-photo-study/`.

| Mutation | Scratch target | Description | Result |
| --- | --- | --- | --- |
| 1 | `reforma-de-casas/index.html` canonical | Changed landing canonical to the homepage URL | ✅ Killed: `npm test` failed on sitemap/canonical divergence |
| 2 | `src/reforma-de-casas.css` hero rule | Changed `.campaign-hero` `min-height` from `min(760px, 92vh)` to `0` | ❌ Survived: `npm test` still passed; no landing behavior assertion detects this |

**Sensor depth**: lightweight 2-mutation run  
**Result**: 1/2 killed — FAIL

## Code Quality

| Principle | Status |
| --- | --- |
| No scope creep / surgical implementation | ✅ (manual inspection of commit `78a0413`) |
| Matches existing patterns | ✅ |
| Spec-anchored outcomes asserted by tests | ❌ |
| Every feature criterion mapped to an automated assertion | ❌ |
| Documented testing guidelines | ✅ Strong defaults; no feature-specific guideline found |

## Edge Cases

- ✅ Out-of-scope bathroom before/after claim is not present.
- ✅ Sitemap feature URLs contain no tracking parameters.
- ⚠️ Landing-specific malformed CTA, image attributes, and gallery-count cases are not automated.

## Ranked Gaps / Fix Plans

1. **Major — add landing-specific acceptance assertions for RCF-001..RCF-005.** The current `scripts/validate-seo.mjs` reads root `index.html` and does not assert the feature page's metadata, CTA links, comparison count, image attributes, or exact four sitemap assets.
2. **Major — strengthen the gate to kill landing mutations.** The CSS survivor demonstrates that `npm test` can pass after a behavior-level change in the feature. Add assertions or a feature-specific validator covering the highest-risk landing behavior.

## Summary

**Overall**: ❌ Not Ready (implementation appears present, but independent verification is not sufficient)

**Spec-anchored check**: 0/5 criteria have exact landing-specific test assertions; 5 evidence-or-zero gaps  
**Sensor**: 1/2 mutations killed  
**Gate**: `npm test` passed in the real tree

**What works**: Manual inspection finds the requested canonical, contextual WhatsApp CTAs, two kitchen/façade comparisons with four WebPs, image hints, and sitemap entries.

**Next step**: add and run feature-specific tests/assertions, then re-run this independent validation.
