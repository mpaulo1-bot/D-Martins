# Reforma de casas — validação independente de RCF-008

**Data:** 2026-09-24
**Spec:** `.specs/features/reforma-de-casas-landing/spec.md:53`
**Diff verificado:** `888a4e5..1d71578`
**Verificador:** subagente independente (autor ≠ verificador)
**Resultado:** PASS — os resultados de RCF-008 coincidem com o spec, o build passa e as duas regressões conhecidas são detectadas.

## Resultado definido pelo spec e evidência

| Critério de RCF-008 | Resultado esperado; asserção `arquivo:linha` | Resultado |
| --- | --- | --- |
| Desktop: cada obra em linha própria | `scripts/validate-layout.mjs:89` — `comparisonCards[1].top >= comparisonCards[0].bottom - 2` a 1440 px. | PASS |
| Desktop: Antes e Depois lado a lado, em quadros maiores | `scripts/validate-layout.mjs:91` — `before.right + 8 <= after.left` para os dois pares; `scripts/validate-layout.mjs:93` — altura do quadro `>= 360` px, maior que os 240 px anteriores. | PASS |
| Até 760 px: cada par em uma coluna, sem corte ou deslocamento horizontal | `scripts/validate-layout.mjs:102` — `after.top >= before.bottom - 2` a 760 e 390 px; `scripts/validate-layout.mjs:104` — `scrollWidth <= clientWidth + 1`; `scripts/validate-layout.mjs:111` — quatro imagens carregadas e `object-fit: contain`. | PASS |
| Clique ou teclado em qualquer foto abre a imagem correspondente | `scripts/validate-layout.mjs:123` — quatro controles; `scripts/validate-layout.mjs:134-139` — Enter na primeira foto, clique nas outras, `dialog.open === true`; `scripts/validate-layout.mjs:141` — `src` da imagem aberta igual ao da foto acionada. | PASS |
| Legenda contém obra e Antes/Depois correspondentes | `scripts/validate-layout.mjs:125-130` — quatro valores específicos; `scripts/validate-layout.mjs:144` — `figcaption.innerText.trim() === expectedCaptions[index]` em cada abertura. | PASS |
| Imagem aberta legível em tela de 390 px | `scripts/validate-layout.mjs:146-147` — `boundingBox().width >= 160 && height >= 180` para as quatro fotos. | PASS |
| Botão fechar e Escape fecham e restauram foco | `scripts/validate-layout.mjs:149-156` — Escape na primeira, botão nas outras; `dialog.open === false` e `document.activeElement === trigger` após cada fechamento. | PASS |

As asserções verificam os valores exigidos pelo spec, incluindo as quatro legendas exatas e os dois limites dimensionais; não há lacuna de precisão em RCF-008. O teste cobre os viewports especificados, mas não substitui avaliação visual humana em outros tamanhos.

## Gate e integridade

- `npm run build`: PASS (exit 0); geração do sitemap, validação SEO e validação de layout concluídas.
- O projeto usa dois scripts de validação (`scripts/validate-seo.mjs` e `scripts/validate-layout.mjs`), sem contagem de casos individual publicada pelo runner. Nenhum teste foi pulado ou falhou no gate normal.
- `git diff 888a4e5..1d71578` acrescenta as asserções de RCF-008 em `scripts/validate-layout.mjs`; as asserções anteriores não foram removidas. Não existe `tasks.md` desta feature; `npm run build` é o gate disponível.
- UAT visual humana não foi realizada nesta verificação automatizada.

## Sensor de discriminação

Mutações executadas separadamente em worktree descartável sobre `1d71578`, com `npm test` em cada tentativa:

| Mutação isolada | Resultado |
| --- | --- |
| `src/reforma-gallery.js:15`: substituir a legenda específica por `Foto ampliada`. | **MORTA** — `npm test` exit 1 em `scripts/validate-layout.mjs:144`: esperado `Reforma de cozinha · Antes`, recebido `Foto ampliada`. |
| `src/reforma-de-casas.css:301`: reduzir `max-height` da imagem do diálogo para `20px`. | **MORTA** — `npm test` exit 1 em `scripts/validate-layout.mjs:147`: a dimensão aberta ficou abaixo do mínimo de 160 × 180 px. |

**Sensor:** 2/2 mutações mortas, 0 sobreviventes; PASS. O worktree foi removido. `git status --porcelain=v1` da árvore real permaneceu igual ao baseline antes da edição deste relatório: alterações preexistentes em `.specs/LESSONS.md`, `.specs/lessons.json`, `validation.md` e arquivos não rastreados `.specs/STATE.md` e `.tmp-photo-study/`.

## Qualidade e conclusão

O diff é restrito ao spec, HTML/CSS e script da landing e teste de layout. A implementação usa os padrões já presentes de CSS responsivo e validação Playwright. A home não foi alterada no diff. Os testes de RCF-008 correspondem aos resultados observáveis do spec; não há lacuna ou tarefa de correção nesta rodada.

**Estado:** PASS — RCF-008 verificado no diff `888a4e5..1d71578`.
