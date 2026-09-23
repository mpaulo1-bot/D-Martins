# Reforma de casas — Validation

**Date**: 2026-09-23  
**Spec**: `.specs/features/reforma-de-casas-landing/spec.md`  
**Diff range**: `65489c1`  
**Verifier**: independent verifier (author ≠ verifier)

## Task Completion

No `tasks.md` exists for this feature; task status is not applicable.

## Spec-Anchored Acceptance Criteria

| Criterion | Spec-defined outcome | `file:line` + assertion expression | Result |
| --- | --- | --- | --- |
| RCF-001: página canônica em pt-BR com title e description específicos | `lang="pt-BR"`; canonical exata; title e description de reforma na Grande Vitória | `scripts/validate-seo.mjs:296-311` — canonical exata e regex de title/description; `reforma-de-casas/index.html:2,6,8-13` — implementação | ✅ PASS |
| RCF-002: CTAs para WhatsApp com telefone correto e mensagens contextualizadas | ao menos três links `wa.me` para `+55 27 98862-4528`, cada CTA com mensagem de reforma na Grande Vitória | `scripts/validate-seo.mjs:313-320` — count de URLs, `reforma%20de%20casa` e `Grande%20Vitória`; `reforma-de-casas/index.html:108,121,173` — três mensagens contextualizadas | ✅ PASS |
| RCF-003: exatamente duas comparações cozinha/fachada com Antes/Depois e quatro WebPs | dois cards nomeados cozinha/fachada, dois rótulos Antes e dois Depois, quatro assets específicos | `scripts/validate-seo.mjs:322-340` — quatro `src`, exatamente dois cards/títulos e contagens de legendas; `reforma-de-casas/index.html:139-150` — implementação | ✅ PASS |
| RCF-004: imagens acessíveis e carregamento adequado | todo `img` com `alt`, `width`, `height`; hero prioritária; quatro secundárias lazy | `scripts/validate-seo.mjs:342-353` — atributos, `fetchpriority="high"` e count lazy=4; `reforma-de-casas/index.html:114,142-150` — implementação | ✅ PASS |
| RCF-005: sitemap com canonical e quatro imagens sem tracking | URL da landing e quatro WebPs no sitemap, sem parâmetros de rastreamento | `scripts/validate-seo.mjs:235-237,239-260,355-360` — ausência de tracking, imagens existentes e landing/assets; `sitemap.xml:51-64` — implementação | ✅ PASS |

**Status**: ✅ All ACs covered

## Gate Check

- **Gate command**: `npm test`
- **Result**: 1 passed, 0 failed, 0 skipped
- **Output**: `SEO check aprovado: metadados, schema, sitemap, robots, imagens e links.`
- **Real-tree failures**: nenhum

## Discrimination Sensor

Sensor executado em worktree temporário `E:\tmp-verifier-reforma-final-20260923`; a árvore real permaneceu inalterada (`?? .specs/STATE.md` e `?? .tmp-photo-study/` antes e depois).

| Mutation | Scratch target | Result |
| --- | --- | --- |
| 1 | Canonical da landing alterada para a homepage | ✅ Killed — `npm test` falhou em `Sitemap e canonicals indexáveis divergem.` |
| 2 | Segundo card de comparação removido | ✅ Killed — `npm test` falhou em `Esperadas 18 imagens visíveis.` |
| 3 | `Reforma de cozinha` alterada para `Reforma de banheiro` | ✅ Killed — `npm test` falhou em `A landing deve ter exatamente os cards de cozinha e fachada.` |

**Sensor depth**: lightweight, 3 mutations  
**Result**: 3/3 killed — ✅ PASS

## Code Quality

| Principle | Status |
| --- | --- |
| Escopo cirúrgico / sem correção de código nesta verificação | ✅ |
| Gate executado na árvore real | ✅ |
| Sensor isolado e árvore real preservada | ✅ |
| Cada critério mapeado a asserção específica | ✅ |

## Summary

**Overall**: ✅ Ready  
**Spec-anchored check**: 5/5 ACs matched spec outcome  
**Sensor**: 3/3 mutations killed  
**Gate**: 1 passed, 0 failed

**Veredito**: PASS. Todos os requisitos RCF-001–RCF-005 têm evidência `file:line`, o gate passa e as mutações relevantes foram eliminadas pelos testes.
