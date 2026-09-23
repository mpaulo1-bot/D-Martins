# Reforma de casas — Validation

**Date**: 2026-09-23  
**Spec**: `.specs/features/reforma-de-casas-landing/spec.md`  
**Diff range**: `1dadd3b`  
**Verifier**: independent verifier (author ≠ verifier)

## Task Completion

No `tasks.md` exists for this feature; task status is not applicable.

## Spec-Anchored Acceptance Criteria

| Criterion | Spec-defined outcome | `file:line` + assertion expression | Result |
| --- | --- | --- | --- |
| RCF-001: landing em português do Brasil com canonical, title e description específicos | `lang="pt-BR"`; canonical exata; title e description de reforma na Grande Vitória | `scripts/validate-seo.mjs:299-311` — `campaignCanonical === "https://construtoradmartins.com.br/reforma-de-casas/"`, title regex e description regex; implementação `reforma-de-casas/index.html:2,6,8-13` | ✅ PASS |
| RCF-002: CTAs WhatsApp com telefone `+55 27 98862-4528` e mensagens contextualizadas | ao menos chamadas para o número correto com `text` contextualizado | `scripts/validate-seo.mjs:313-315` — count de URLs `https://wa.me/5527988624528?text=` ≥ 3; implementação `reforma-de-casas/index.html:108,121,173` | ⚠️ GAP: a asserção confirma telefone e presença de `text`, mas não verifica o conteúdo contextual de cada mensagem |
| RCF-003: exatamente duas comparações, cozinha e fachada, cada uma Antes/Depois, usando quatro WebPs | dois cards nomeados cozinha/fachada e quatro imagens/legendas Before/After | `scripts/validate-seo.mjs:317-325` — apenas presença dos quatro `src`; implementação `reforma-de-casas/index.html:139-150` | ⚠️ GAP: não há asserção para exatamente dois cards, nomes cozinha/fachada ou quatro pares Antes/Depois; mutação do rótulo cozinha sobreviveu ao sensor |
| RCF-004: cada `img` com `alt`, `width`, `height`; hero prioritária; demais lazy | atributos obrigatórios em todas as imagens, hero `fetchpriority="high"`, quatro imagens secundárias lazy | `scripts/validate-seo.mjs:326-337` — valida `alt/width/height` em cada `img`, prioridade alta e count lazy = 4; implementação `reforma-de-casas/index.html:114,142-150` | ✅ PASS |
| RCF-005: sitemap com URL canônica e quatro imagens sem tracking | URL da landing e os quatro WebPs presentes, sem parâmetros de rastreamento | `scripts/validate-seo.mjs:231-244,339-345` — sitemap/canonicals consistentes, sem `utm_/fbclid/gclid`, URL e quatro imagens da campanha presentes; `sitemap.xml:52-63` | ✅ PASS |

**Status**: ❌ Gaps presentes (RCF-002 e RCF-003 não têm cobertura específica completa).

## Gate Check

- **Gate command**: `npm test`
- **Result**: 1 passed, 0 failed, 0 skipped
- **Output**: `SEO check aprovado: metadados, schema, sitemap, robots, imagens e links.`
- **Test count**: não há framework; um comando validador foi executado
- **Real-tree failures**: nenhum

## Discrimination Sensor

Sensor executado em worktree temporário `E:\tmp-verifier-reforma-20260923`; a árvore real não foi mutada. O `git status --short` antes e depois permaneceu: `?? .specs/STATE.md` e `?? .tmp-photo-study/`.

| Mutation | Scratch target | Result |
| --- | --- | --- |
| 1 | `reforma-de-casas/index.html` canonical alterada para a homepage | ✅ Killed — `npm test` falhou em `Sitemap e canonicals indexáveis divergem.` |
| 2 | Remoção do segundo card de comparação | ✅ Killed — `npm test` falhou em `Esperadas 18 imagens visíveis.` |
| 3 | Rótulo `Reforma de cozinha` alterado para `Reforma de banheiro`, mantendo imagens | ❌ Survived — `npm test` passou |

**Sensor depth**: lightweight, 3 mutations  
**Result**: 2/3 killed — ❌ FAIL

## Code Quality

| Principle | Status |
| --- | --- |
| Escopo cirúrgico / sem correção de código nesta verificação | ✅ |
| Gate executado na árvore real | ✅ |
| Cada critério mapeado a asserção específica | ❌ RCF-002 e RCF-003 incompletos |
| Sensor isolado e árvore real preservada | ✅ |

## Ranked Gaps / Fix Plans

1. **Major — RCF-003**: adicionar asserções para exatamente dois `.comparison-card`, títulos cozinha/fachada e duas legendas Antes/Depois por card; a mutação de rótulo sobreviveu.
2. **Major — RCF-002**: verificar o telefone e o conteúdo contextual esperado de cada mensagem WhatsApp, não somente o prefixo `?text=`.

## Summary

**Overall**: ❌ Not Ready

**Spec-anchored check**: 3/5 completos; 2 gaps  
**Sensor**: 2/3 mutations killed  
**Gate**: 1 passed, 0 failed

**Veredito**: a implementação está presente e o gate passa, mas a cobertura automatizada ainda não comprova integralmente RCF-002 e RCF-003. Não marcar PASS até fortalecer essas asserções e repetir a verificação.
