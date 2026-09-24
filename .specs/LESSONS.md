# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Valide SVGs com um parser XML real antes de aplicar assertions estruturais por regex.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `static-assets` · harmful: 0
- features: favicon-brand-mark
- evidence: .specs/features/favicon-brand-mark/validation.md:60 (static-assets)
- last seen: 2026-09-22T22:14:32Z

### L-002 - Teste no navegador a geometria e o overflow exigidos por critérios responsivos.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `landing` · harmful: 0
- features: reforma-de-casas-landing
- evidence: src/reforma-de-casas.css:42 (landing)
- last seen: 2026-09-24T13:46:38Z

### L-003 - Assert the exact gallery caption, not just that a caption exists.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `landing` · harmful: 0
- features: reforma-de-casas-landing
- evidence: RCF-008 caption mutant (landing)
- last seen: 2026-09-24T14:51:10Z

### L-004 - Assert rendered image dimensions for gallery enlargement, not just dialog visibility.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `landing` · harmful: 0
- features: reforma-de-casas-landing
- evidence: RCF-008 20px lightbox mutant (landing)
- last seen: 2026-09-24T14:51:14Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
