# Reforma de casas — Validation

**Date**: 2026-09-24  
**Spec**: `.specs/features/reforma-de-casas-landing/spec.md`  
**Diff range**: `3a9f9a2`  
**Verifier**: independent verifier (author ≠ verifier)

## Task Completion

No `tasks.md` exists for this feature; task status is not applicable.

## Spec-Anchored Acceptance Criteria

| Criterion | Spec-defined outcome | `file:line` + assertion expression | Result |
| --- | --- | --- | --- |
| RCF-001: página canônica em pt-BR com title e description específicos | `lang="pt-BR"`; canonical exata; title e description de reforma na Grande Vitória | `scripts/validate-seo.mjs:296-311` — canonical exata e regex de title/description; `reforma-de-casas/index.html:2,6,8-13` — implementação | ✅ PASS |
| RCF-002: CTAs para WhatsApp com telefone correto e mensagens contextualizadas | ao menos três links `wa.me` para `+55 27 98862-4528`, com contexto de reforma na Grande Vitória | `scripts/validate-seo.mjs:313-320` — count de URLs, contexto e telefone; `reforma-de-casas/index.html:109,122,231` — três CTAs | ✅ PASS |
| RCF-003: exatamente duas comparações cozinha/fachada com Antes/Depois e quatro WebPs | dois cards nomeados cozinha/fachada, dois rótulos Antes e dois Depois, quatro assets específicos | `scripts/validate-seo.mjs:322-340` — quatro `src`, dois cards e contagens de legendas; `reforma-de-casas/index.html:139-151` — implementação | ✅ PASS |
| RCF-004: imagens acessíveis e carregamento adequado | todo `img` com `alt`, `width`, `height`; hero prioritária; quatro secundárias lazy | `scripts/validate-seo.mjs:368-379` — atributos, `fetchpriority="high"` e count lazy=4; `reforma-de-casas/index.html:115,143-151` — implementação | ✅ PASS |
| RCF-005: sitemap com canonical e quatro imagens sem tracking | URL da landing e quatro WebPs no sitemap, sem parâmetros de rastreamento | `scripts/validate-seo.mjs:235-260,381-387` — ausência de tracking e entradas; `sitemap.xml:51-64` — implementação | ✅ PASS |
| RCF-006: conteúdo de decisão | seções sobre materiais, comparação/contratação e pelo menos três qualidades verificáveis da D'Martins | `scripts/validate-seo.mjs:342-366` — IDs, frases de materiais, checklist e qualidades; `reforma-de-casas/index.html:157-212` — implementação | ✅ PASS |

**Status**: ✅ All ACs covered; outcomes match the spec.

## Gate Check

- **Gate command**: `npm test`
- **Result**: 1 passed, 0 failed, 0 skipped
- **Output**: `SEO check aprovado: metadados, schema, sitemap, robots, imagens e links.`
- **Real-tree failures**: nenhum

## Discrimination Sensor

Sensor executado em worktree temporário `E:\\tmp-verifier-reforma-20260924`; a árvore real permaneceu inalterada (`?? .specs/STATE.md` e `?? .tmp-photo-study/` antes e depois).

| Mutation | Scratch target | Result |
| --- | --- | --- |
| 1 | `reforma-de-casas/index.html:159`: alterado `Escolha de materiais` para `Escolha de insumos` | ✅ Killed — `npm test` falhou em `Orientações de escolha de materiais ausentes ou incompletas.` |
| 2 | `reforma-de-casas/index.html:194`: alterado `Escopo detalhado` para `Escopo resumido` | ✅ Killed — `npm test` falhou em `Checklist para contratação ausente ou incompleto.` |
| 3 | `reforma-de-casas/index.html:208`: alterado `CREA-ES` para `CREA-XX` | ✅ Killed — `npm test` falhou em `Qualidades verificáveis da D'Martins ausentes.` |

**Sensor depth**: lightweight, 3 mutations focadas nas novas seções  
**Result**: 3/3 killed — ✅ PASS

## Code Quality

| Principle | Status |
| --- | --- |
| Escopo cirúrgico / sem correção de código nesta verificação | ✅ |
| Gate executado na árvore real | ✅ |
| Sensor isolado e árvore real preservada | ✅ |
| Cada critério mapeado a asserção específica | ✅ |
| Testes não rasos para materiais, contratação e qualidades | ✅ |

## Summary

**Overall**: ✅ Ready  
**Spec-anchored check**: 6/6 ACs matched spec outcome  
**Sensor**: 3/3 mutations killed  
**Gate**: 1 passed, 0 failed

**Veredito**: PASS. RCF-001–RCF-006 têm evidência `file:line`, o gate passa e todas as mutações direcionadas às novas seções foram eliminadas pelos testes.
