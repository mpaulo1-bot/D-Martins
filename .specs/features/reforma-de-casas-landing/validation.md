# Reforma de casas — validação independente

**Data:** 2026-09-24
**Spec:** `.specs/features/reforma-de-casas-landing/spec.md`
**Diff:** `11a544e^..b4555b7`
**Verificador:** subagente independente (autor ≠ verificador)
**Result:** PASS — RCF-001 a RCF-007 confirmados; build e 2/2 mutações de layout eliminadas.

## Critérios de aceitação

| Critério | Resultado esperado e evidência `file:line` | Resultado |
| --- | --- | --- |
| RCF-001 | HTML `pt-BR`, canonical exata e metadados de reformas na Grande Vitória: `reforma-de-casas/index.html:2,6-13`; asserções da URL, title e description em `scripts/validate-seo.mjs:296-311`. | PASS |
| RCF-002 | Três links `wa.me/5527988624528?text=` com mensagem contextualizada: `reforma-de-casas/index.html:110,122,236`; asserções de quantidade e contexto em `scripts/validate-seo.mjs:313-320`. | PASS |
| RCF-003 | Exatamente dois cards, cozinha e fachada, cada um com Antes/Depois e quatro WebPs: `reforma-de-casas/index.html:145-157`; asserções de arquivos, quantidade e rótulos em `scripts/validate-seo.mjs:322-340`. | PASS |
| RCF-004 | Cinco `img` com `alt`, `width` e `height`; hero prioritário e quatro imagens da galeria tardias: `reforma-de-casas/index.html:132,148-156`; asserções em `scripts/validate-seo.mjs:368-379`. | PASS |
| RCF-005 | URL canônica e quatro imagens no sitemap, sem tracking: `sitemap.xml:51-65`; asserções de canonical, rastreamento, existência e correspondência das imagens em `scripts/validate-seo.mjs:228-260,381-387`. | PASS |
| RCF-006 | Critérios de materiais, comparação de empresas e qualidades identificáveis (responsável técnico/CREA, experiência e atendimento regional): `reforma-de-casas/index.html:162-216`; asserções em `scripts/validate-seo.mjs:342-366`. | PASS |
| RCF-007 | Hero em duas colunas: `src/reforma-de-casas.css:40-45`, asserção geométrica em `scripts/validate-layout.mjs:79-82`; seções com títulos e cartões: `reforma-de-casas/index.html:162-229`, asserção de tamanho, contagem e estilo em `scripts/validate-layout.mjs:34-51,96-101`; empilhamento e ausência de overflow a 760/390 px: `src/reforma-de-casas.css:555-566`, asserções em `scripts/validate-layout.mjs:84-93`; quatro fotos carregadas e inteiras: `src/reforma-de-casas.css:219-225`, asserção em `scripts/validate-layout.mjs:61-64,96-98`. | PASS |

Os resultados de RCF-007 são medidos em Chrome/Edge headless a 1440, 760 e 390 px. “Hierarquia visual consistente” é uma expressão qualitativa; o teste a operacionaliza por tamanho dos títulos, presença/estilo e empilhamento dos cartões. A inspeção automatizada não cobre todos os navegadores, zooms ou tamanhos intermediários. A resolução da rota pública depende da hospedagem estática, conforme a premissa do spec.

## Gate e integridade

- `npm run build`: PASS. Gerou sitemap com duas URLs indexáveis; `validate-seo.mjs` e `validate-layout.mjs` passaram.
- `git diff 11a544e^ b4555b7 --check`: PASS.
- A feature não possui `tasks.md`; `npm run build` é o gate de projeto. Antes de `b4555b7`, `npm test` executava apenas a verificação de SEO; agora executa SEO e layout, sem retirada de testes.
- O diff dos dois commits cobre spec, landing HTML/CSS, teste de layout, scripts/dependências de build e README. A página inicial e sua galeria não foram alteradas.

## Sensor de discriminação

Mutações executadas em worktree temporário em `b4555b7`, usando as dependências já instaladas. O worktree foi removido depois dos testes. O estado da árvore real, fora da atualização deste relatório, era `M .specs/LESSONS.md`, `M .specs/features/reforma-de-casas-landing/validation.md`, `M .specs/lessons.json`, `?? .specs/STATE.md` e `?? .tmp-photo-study/` antes e depois.

| Mutação | Resultado |
| --- | --- |
| `src/reforma-de-casas.css:42`: trocar as duas colunas do hero desktop por `grid-template-columns: 1fr`. | KILLED: `npm test` saiu 1 em `scripts/validate-layout.mjs:81`, “No desktop, texto e foto do hero devem ocupar colunas separadas.” |
| `src/reforma-de-casas.css:566`: trocar o empilhamento até 760 px por `grid-template-columns: repeat(2, minmax(0, 1fr))`. | KILLED: `npm test` saiu 1 em `scripts/validate-layout.mjs:86`, “Em 760px, a foto do hero deve aparecer abaixo do texto.” |

**Sensor:** 2/2 mutações eliminadas; nenhuma sobrevivente.

## Qualidade e limites

- As asserções de SEO cobrem valores definidos pelo spec; o teste de layout confere geometria real, imagens decodificadas e estilos computados.
- `playwright-core` requer Chrome ou Edge local, documentado em `README.md:24-25`. O build passou neste ambiente com navegador disponível.
- Sem casos de borda adicionais definidos no spec. Sem UAT interativa nesta rodada.
- Nenhuma lição nova: não houve mutante sobrevivente, falha de requisito ou desvio de implementação.

**Estado:** PASS — pronto para revisão do resultado visual pelo usuário.
