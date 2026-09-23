# favicon-brand-mark Validation

**Verdict**: FAIL
**Date**: 2026-09-22
**Spec**: requisitos inline fornecidos para `favicon-brand-mark`
**Diff range**: `8e8d615^..8e8d615`
**Verifier**: subagente independente (autor != verifier)

O artefato atual atende ao desenho pedido, mas o gate não prova que o SVG é XML válido. Um fechamento de raiz deliberadamente inválido sobreviveu ao teste.

---

## Task Completion

| Task | Status | Notes |
| --- | --- | --- |
| T1: substituir o favicon pelo brand mark | ✅ Done | O SVG atual confere com os valores e paths aprovados. |
| T2: proteger os requisitos com validação | ❌ Gap | As regex não validam a boa formação XML. |

---

## Spec-Anchored Acceptance Criteria

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --- | --- | --- | --- |
| WHEN a página carregar THEN `index.html` deve continuar referenciando `/favicon.svg` com `type=image/svg+xml` | `href="/favicon.svg"` e `type="image/svg+xml"` no link de ícone | `index.html:15`; `scripts/validate-seo.mjs:38-40` — `attribute(faviconTag, "href") === "/favicon.svg"` e `attribute(faviconTag, "type") === "image/svg+xml"` | ✅ PASS |
| WHEN o favicon for lido THEN ele deve ser SVG válido, 64x64, `viewBox="0 0 829 829"`, fundo `#B78D40`, símbolo `#021728`, `translate(0 42)`, 8 paths e nenhum `image`/`text`/`script` | Todos os valores exatos e documento XML bem-formado | `favicon.svg:1-14`; `scripts/validate-seo.mjs:41-60` — regex/assertions cobrem dimensões, viewBox, cores, transformação, contagem e elementos proibidos, mas não fazem parse XML | ❌ GAP: o resultado atual está correto, porém o teste aceita XML inválido |

**Status**: ❌ 1/2 critérios completamente protegidos; 1 lacuna de cobertura sem ambiguidade de especificação.

### Conformidade do artefato atual

| Requisito | Evidência | Resultado atual |
| --- | --- | --- |
| SVG/XML válido | `favicon.svg:1-14` foi carregado com sucesso por `System.Xml.XmlDocument` | ✅ |
| Tamanho intrínseco 64x64 e viewBox quadrado | `favicon.svg:1`; `scripts/validate-seo.mjs:41-46` | ✅ |
| Fundo dourado `#B78D40` | `favicon.svg:3`; `scripts/validate-seo.mjs:47-52` | ✅ |
| Símbolo azul-marinho `#021728`, centralizado por `translate(0 42)` | `favicon.svg:4`; `scripts/validate-seo.mjs:53-58` | ✅ |
| Oito paths | `favicon.svg:5-12`; `scripts/validate-seo.mjs:59` | ✅ |
| Sem `image`, `text` ou `script` | `favicon.svg:1-14`; `scripts/validate-seo.mjs:60` | ✅ |
| Desenho derivado de `img-letra+.svg` | `favicon.svg:5-12` e `img-letra+.svg:3-10`: os oito atributos `d` são idênticos, na mesma ordem | ✅ |
| `img-letra+.svg` fora do commit | `git diff-tree --no-commit-id --name-only -r 8e8d615` listou somente `favicon.svg` e `scripts/validate-seo.mjs` | ✅ |

---

## Discrimination Sensor

O sensor rodou em worktree descartável em `8e8d615`. Nenhuma mutação foi feita na árvore real.

| Mutation | File:line | Description | Killed? |
| --- | --- | --- | --- |
| 1 | `index.html:15` | `/favicon.svg` → `/favicon-broken.svg` | ✅ Killed por `scripts/validate-seo.mjs:39` |
| 2 | `favicon.svg:4` | `#021728` → `#000000` | ✅ Killed por `scripts/validate-seo.mjs:53-58` |
| 3 | `favicon.svg:14` | `</svg>` → `</svg-broken>` | ❌ Survived: `npm test` saiu 0; parse XML independente falhou |

**Sensor depth**: lightweight, 3 mutações direcionadas
**Result**: 2/3 killed — FAIL ❌

**Isolation**: o SHA-256 do `git status --porcelain=v1 --untracked-files=all` foi `EDB622682F7AC74684A88CE9926C2976768E364E64629B638DA5C3B3C4D6E0C8` antes e depois da remoção do scratch; 63 entradas em ambos.

---

## Gate Check

- **`npm test`**: PASS, exit 0.
- **`npm run build`**: PASS, exit 0; sitemap gerado com 1 URL e validação SEO aprovada.
- **Test count before feature**: 1 suíte script-based (`npm test`) em `8e8d615^`, PASS.
- **Test count after feature**: 1 suíte script-based, PASS; o runner não expõe contagem de casos. O diff adiciona 7 assertions de favicon.
- **Delta**: 0 suítes removidas; 7 assertions adicionadas.
- **Skipped tests**: nenhum mecanismo de skip presente.
- **Failures no gate normal**: nenhuma.

---

## Code Quality

| Principle | Status |
| --- | --- |
| Sem funcionalidade além do pedido | ✅ |
| Sem abstração ou flexibilidade desnecessária | ✅ |
| Mudanças cirúrgicas e sem código adjacente alterado | ✅ |
| Padrões existentes preservados | ✅ |
| Testes mapeiam para os critérios | ⚠️ Parcial: XML válido não tem assertion real |
| Spec-anchored outcome check | ❌ O teste não discrimina boa formação XML |
| Toda validação adicionada tem justificativa no requisito | ✅ |
| Diretrizes documentadas | ✅ `coding-principles.md` do skill; não há `AGENTS.md` nem guia local de testes |

---

## Edge Cases

- [x] A ordem dos atributos do link não afeta a extração de `href` e `type`.
- [x] A arte aprovada não entrou no commit.
- [ ] Tags SVG malformadas devem falhar no gate; hoje passam se as regex esperadas continuarem presentes.

---

## Interactive UAT

Não executado. A feature é um ativo estático pequeno com resultados estruturais exatos; não há fluxo interativo complexo. A conformidade visual foi ancorada nos oito paths da arte aprovada.

---

## Fix Plan

### Fix 1: validar boa formação XML

- **Root cause**: `scripts/validate-seo.mjs:29` lê o favicon como texto e `scripts/validate-seo.mjs:41-60` usa somente regex. Nenhuma assertion faz parse XML.
- **Fix task**: validar `favicon.svg` com um parser/validador XML real e dependency-safe antes das assertions estruturais.
- **Verify**: repetir o mutante `</svg>` → `</svg-broken>` em scratch; `npm test` deve sair diferente de zero.
- **Done when**: `npm test` e `npm run build` passam no arquivo válido, e o mutante XML inválido é morto.
- **Priority**: Major, pois bloqueia a evidência completa do critério explícito.

---

## Summary

**Overall**: ❌ Not Ready

**Spec-anchored check**: 1/2 critérios completamente protegidos; o artefato atual satisfaz todos os valores pedidos.
**Sensor**: 2/3 mutações mortas.
**Gate**: 2/2 comandos passaram.

**Gap**: adicionar validação de XML bem-formado e repetir o sensor.
