# Reforma de casas — verificação independente da troca da foto

**Data:** 2026-09-24
**Spec:** `.specs/features/reforma-de-casas-landing/spec.md:33-35` (RCF-003)
**Diff verificado:** `579e311..8d318e7`
**Verificador:** subagente independente (autor ≠ verificador)
**Resultado:** PASS — a fachada “Antes” usa o novo WebP na página, nos dados estruturados e no sitemap, com dimensões corretas. As outras três fotos da comparação não foram alteradas.

## Resultado definido pelo spec e evidência

| Critério de RCF-003 | Evidência `arquivo:linha` e asserção | Resultado |
| --- | --- | --- |
| Exatamente duas comparações, cozinha e fachada, cada uma com Antes e Depois | `scripts/validate-seo.mjs:339-347` exige dois `comparison-card`, ambos os títulos, dois rótulos `Antes` e dois `Depois`; `reforma-de-casas/index.html:149-157` mostra os quatro `img`. | PASS |
| Quatro WebPs em `assets/reforma-de-casas/`; fachada Antes aponta para `reforma-casa-fachada-antes1.webp` | `scripts/validate-seo.mjs:322-330` exige os quatro `src` específicos; `reforma-de-casas/index.html:156` contém o novo caminho. O diff não modifica os outros três arquivos WebP nem suas referências. | PASS |
| Fachada Antes no dado estruturado | `scripts/validate-seo.mjs:334` exige o `contentUrl` exato; `reforma-de-casas/index.html:83` contém esse valor. | PASS |
| Fachada Antes no sitemap | `scripts/validate-seo.mjs:255-260` exige correspondência exata entre imagens visíveis e sitemap; `scripts/validate-seo.mjs:389-393` exige as quatro URLs da landing; `sitemap.xml:60` contém a nova URL. | PASS |
| Dimensões 6000 × 3416 px | `scripts/validate-seo.mjs:335` exige `width="6000" height="3416"` no `img`; `reforma-de-casas/index.html:156` corresponde. O cabeçalho binário VP8X do novo WebP declara largura 5999+1 e altura 3415+1, confirmando as dimensões reais. | PASS |

O valor esperado do teste coincide com o nome e as dimensões definidos em `spec.md:35`; não há lacuna de precisão nesta alteração. `git diff --name-only 579e311..8d318e7 -- assets/reforma-de-casas` lista somente `reforma-casa-fachada-antes1.webp`; as outras fotos e as referências em `reforma-de-casas/index.html:149-150,157` e `sitemap.xml:54,57,63` permaneceram iguais. A mudança também inclui alt e legenda coerentes com o estado “Antes” em `reforma-de-casas/index.html:83-84,156`.

## Gate e sensor

- `npm run build`: PASS (exit 0). O gerador produziu 2 URLs; SEO e layout passaram, sem falhas ou testes pulados. O projeto publica resultados por script, sem contagem individual de casos.
- `git diff --check 579e311..8d318e7`: PASS.
- Mutação isolada: no worktree descartável sobre `8d318e7`, alterei somente `reforma-de-casas/index.html:156`, trocando o `src` da fachada Antes pelo WebP antigo. `npm run check:seo` terminou com exit 1 em `scripts/validate-seo.mjs:258` (`Imagens do sitemap divergem das imagens visíveis`). **Sensor: 1/1 mutação morta, 0 sobreviventes; PASS.**
- O worktree foi removido. O `git status --porcelain=v1` da árvore real permaneceu igual ao baseline anterior ao sensor: apenas `.specs/STATE.md` e `.tmp-photo-study/` não rastreados. Este relatório é a única edição da verificação.

**Estado desta verificação:** PASS — RCF-003 no diff `579e311..8d318e7`. Nenhuma tarefa de correção.

---

## Verificação anterior: RCF-008 (preservada para histórico)

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

---

# Reforma de casas — verificação independente de RCF-009

**Data:** 2026-09-24
**Spec:** `.specs/features/reforma-de-casas-landing/spec.md:57`
**Diff verificado:** `9eb3f43..f58a24c`
**Verificador:** subagente independente (autor ≠ verificador)
**Resultado:** PASS — as quatro fotos mantêm a proporção natural, acompanham os quadros clicáveis e os pares desktop terminam com diferença de altura de até 15 px.

| Critério de RCF-009 | Resultado esperado e evidência `arquivo:linha` | Resultado |
| --- | --- | --- |
| Quatro fotos completas a 1440, 760 e 390 px | `scripts/validate-layout.mjs:23-30,95-97` abre as três larguras e decodifica cada imagem; `scripts/validate-layout.mjs:73-75,125-126` exige quatro imagens carregadas com `object-fit: contain`; `src/reforma-de-casas.css:252-255` define largura 100%, altura automática e `contain`. | PASS |
| Proporção natural e quadro sem faixas vazias, diferença de até 3 px por eixo | `scripts/validate-layout.mjs:76-86` mede foto, botão e proporção intrínseca; `scripts/validate-layout.mjs:128-133` exige diferença de proporção até 0,02 por arredondamento e diferenças quadro/foto de até 3 px em largura e altura, nas três larguras. `src/reforma-de-casas.css:234-243` define o botão com borda de 1 px e sem padding. | PASS |
| Em 1440 px, duas fotos de cada par com altura final a até 15 px, sem esticar ou cortar | `scripts/validate-layout.mjs:106-109` compara as alturas dos dois pares com limite exato de 15 px; `src/reforma-de-casas.css:221-226` usa colunas 3:4 e 4:3; `src/reforma-de-casas.css:254-255` mantém altura automática. | PASS |
| Em 760 e 390 px, cada par ocupa uma coluna sem deslocamento horizontal | `scripts/validate-layout.mjs:117-120` exige ordem vertical e largura de conteúdo dentro do viewport; `src/reforma-de-casas.css:686-689` define uma coluna para os dois pares. | PASS |

Os limites numéricos das asserções correspondem ao spec. A tolerância de 0,02 na razão da caixa da imagem evita diferenças de arredondamento subpixel; a altura automática preserva a proporção renderizada. Não há lacuna de precisão ou alteração fora do CSS e do validador de layout neste diff. Não existe `tasks.md` nesta feature; o gate disponível é `npm run build`.

## Gate e sensor de discriminação

- `npm run build`: PASS (exit 0). Sitemap com 2 URLs; verificações SEO e layout aprovadas. O projeto usa scripts sem contagem individual de casos; nenhum teste foi pulado.
- `git diff --check 9eb3f43..f58a24c`: PASS.
- Mutação 1, em worktree isolado sobre `f58a24c`: `src/reforma-de-casas.css:254`, `height: auto` → `height: 520px`. `npm test` falhou (exit 1) em `scripts/validate-layout.mjs:128`, detectando a faixa ou a proporção errada em 1440 px. **Morta.**
- Mutação 2, no mesmo worktree isolado após restaurar `height: auto`: `src/reforma-de-casas.css:226`, colunas `4fr 3fr` → `5fr 2fr`. `npm test` falhou (exit 1) em `scripts/validate-layout.mjs:106`, detectando alturas desiguais no par da fachada. **Morta.**
- **Sensor: 2/2 mutações mortas, 0 sobreviventes; PASS.** O worktree isolado foi removido. O status da árvore real antes e depois permaneceu `?? .specs/STATE.md` e `?? .tmp-photo-study/`, além da edição deste relatório após a medição.
- **Incidente de limpeza:** o vínculo `node_modules` criado para o worktree isolado também removeu o diretório gerado `node_modules` da árvore real ao remover o worktree. Reinstalei as dependências com `npm ci` (exit 0, `playwright-core` restaurado) e executei `npm test` na árvore real (exit 0, SEO e layout aprovados). Não houve alteração em arquivos rastreados nem nos dois diretórios não rastreados preexistentes. Nenhuma outra remoção foi feita.

**Estado desta verificação:** PASS — RCF-009 no diff `9eb3f43..f58a24c`. Nenhuma tarefa de correção.
