# SEO Validator e Sitemap: Validation

**Verdict**: PASS
**Date**: 2026-09-22
**Spec source**: critérios fornecidos ao Verifier; não há `spec.md` ou `tasks.md` neste diretório de feature
**Diff range**: `HEAD` (`50ba754`) contra o worktree não commitado
**Verifier**: subagente independente (autor != verificador)

Os dez critérios foram comprovados. Os gates reais passaram, as duas builds foram idênticas e os três mutantes focados foram mortos em cópias isoladas.

## Spec-Anchored Acceptance Criteria

| # | Resultado esperado | Evidência `file:line` + asserção | Resultado |
| - | ------------------ | -------------------------------- | --------- |
| 1 | `npm test` passa | `package.json:7` executa `node scripts/validate-seo.mjs`; a execução real retornou 0 e alcançou a aprovação em `scripts/validate-seo.mjs:274` | PASS |
| 2 | `npm run build` passa e é determinístico | `package.json:5` encadeia gerador e validador; `scripts/generate-sitemap.mjs:27` ordena URLs e `scripts/generate-sitemap.mjs:50` grava o artefato. Duas execuções retornaram 0 com o mesmo SHA-256 | PASS |
| 3 | Title exato e descrição exata em meta, OG, Twitter e WebPage | Constantes em `scripts/validate-seo.mjs:8`; title em `scripts/validate-seo.mjs:40`; meta em `scripts/validate-seo.mjs:48`; OG em `scripts/validate-seo.mjs:56`; Twitter em `scripts/validate-seo.mjs:65`; WebPage em `scripts/validate-seo.mjs:192` | PASS |
| 4 | Exatamente seis serviços canônicos, na ordem visível | Taxonomia e schema em `scripts/validate-seo.mjs:12` e `scripts/validate-seo.mjs:113`; os seis cards são extraídos em `scripts/validate-seo.mjs:118` e comparados pelo array completo em `scripts/validate-seo.mjs:127` | PASS |
| 5 | Person Wellington, cargo, CREA e vínculo bidirecional | Fonte em `index.html:114` e `index.html:273`; tipo, nome, cargo, CREA e ambos os vínculos são exigidos em `scripts/validate-seo.mjs:150` a `scripts/validate-seo.mjs:163` | PASS |
| 6 | Doze ImageObject iguais às doze imagens e legendas da galeria | Galeria extraída em `scripts/validate-seo.mjs:166`; total fixo, URLs, legendas, tipo e existência em `scripts/validate-seo.mjs:175` a `scripts/validate-seo.mjs:189` | PASS |
| 7 | Uma URL canônica e exatamente 14 imagens visíveis, existentes e sem paths antigos | Canonicals em `scripts/validate-seo.mjs:197`; existência em `scripts/validate-seo.mjs:212`; totais fixos de imagens visíveis, `image:loc` e blocos em `scripts/validate-seo.mjs:224`, `scripts/validate-seo.mjs:228` e `scripts/validate-seo.mjs:236`. O artefato contém uma URL em `sitemap.xml:7` e 14 imagens entre `sitemap.xml:9` e `sitemap.xml:48`; zero paths antigos ou arquivos ausentes | PASS |
| 8 | `llms.txt` contém seis serviços na ordem, CREA e estado do Instagram | Conteúdo em `llms.txt:11`, `llms.txt:38` e `llms.txt:56`; asserções em `scripts/validate-seo.mjs:255`, `scripts/validate-seo.mjs:261` e `scripts/validate-seo.mjs:262` | PASS |
| 9 | Gerador mantém somente `image:loc` e não usa `lastmod` sem data confiável | O gerador emite `image:loc` em `scripts/generate-sitemap.mjs:30`; `lastmod` é proibido em `scripts/validate-seo.mjs:209`; cada bloco é analisado e limitado a um único filho `loc` em `scripts/validate-seo.mjs:233` a `scripts/validate-seo.mjs:244` | PASS |
| 10 | O worktree real não muda durante o sensor | Status e hashes de `index.html`, `llms.txt`, `scripts/validate-seo.mjs`, `scripts/generate-sitemap.mjs` e `sitemap.xml` foram idênticos antes/depois; a cópia temporária foi removida | PASS |

**Spec-anchored status**: 10/10 critérios cobertos com resultados exatos.

## Gate Check

- **`npm test`**: PASS, código 0. Zero falhas e zero skips.
- **`npm run build` #1**: PASS, código 0.
- **`npm run build` #2**: PASS, código 0.
- **Determinismo**: PASS. Ambas produziram SHA-256 `9FD85D739407E760C49229E6B27BF48A60023FF16EE5A6AA02BBD61B2E87C24B` para `sitemap.xml`.
- **Worktree após gates**: inalterado em relação ao baseline.

## Discrimination Sensor

Sensor executado em três cópias sob `%TEMP%`. Nenhum arquivo-fonte real foi mutado e não foi usado `git stash`.

| Mutação | Alvo | Evidência da falha | Resultado |
| ------- | ---- | ------------------ | --------- |
| M1: trocar o title exato por uma variante curta | `index.html:6` | `npm test` falhou em `scripts/validate-seo.mjs:40` com `Title esperado não encontrado.` | KILLED |
| M2: inverter os dois primeiros nomes dos cards visíveis | `index.html:509` e `index.html:523` | `npm test` falhou em `scripts/validate-seo.mjs:127` com `Cards visíveis divergem da ordem canônica dos serviços.` | KILLED |
| M3: acrescentar `image:title` a cada bloco gerado | `scripts/generate-sitemap.mjs:33` | `npm run build` falhou em `scripts/validate-seo.mjs:241` com `Cada image:image deve conter somente image:loc.` | KILLED |

**Sensor result**: 3/3 killed. PASS.

## Code Quality

| Check | Status |
| ----- | ------ |
| Mudanças limitadas ao contrato solicitado | PASS |
| Asserções usam valores exatos, contagens exatas e ordem exata | PASS |
| Nenhuma abstração ou flexibilidade desnecessária | PASS |
| Testes não foram enfraquecidos, removidos ou pulados | PASS |
| Diretrizes aplicadas | `coding-principles.md`; não foi encontrado guideline de teste específico do projeto |

## Isolation and Lessons

- Scratch removido após o sensor.
- Status e hashes do worktree real permaneceram iguais durante o sensor.
- O relatório foi a única escrita deste Verifier no workspace.
- Validação limpa, sem gaps, sobreviventes ou desvios. Nenhuma lição foi registrada.

## Summary

**Overall**: READY

**Spec-anchored check**: 10/10
**Sensor**: 3/3 mutações mortas
**Gate**: `npm test` e 2/2 builds passaram

Nenhum gap remanescente.
