# Landing page de reforma de casas

## Problem Statement

A campanha precisa de uma página específica para intenção de busca por reformas residenciais na Grande Vitória. A página deve transformar as fotos confirmadas pelo cliente em prova visual e facilitar o contato por WhatsApp.

## Objetivo

Disponibilizar uma landing page indexável para campanhas de Google Ads sobre reformas de casas na Grande Vitória, com prova visual das duas obras confirmadas pelo cliente.

## Assumptions & Open Questions

- O endereço público será servido por hospedagem estática com `reforma-de-casas/index.html`.
- Os pares cozinha e fachada foram confirmados pelo cliente como comparações corretas.
- Não há endereço público do Instagram a incluir nesta página.
- Open questions: none.

## User Stories

- Como pessoa que busca reforma de casas na Grande Vitória, quero entender o serviço e ver resultados reais para solicitar um orçamento.
- Como anunciante, quero uma URL dedicada com rastreamento natural por CTA para receber contatos no WhatsApp.

## Requisitos

### RCF-001 — Página canônica

Quando um visitante acessar `/reforma-de-casas/`, o sistema deve entregar uma página HTML em português do Brasil com canonical `https://construtoradmartins.com.br/reforma-de-casas/`, title e description específicos para reformas residenciais na Grande Vitória.

### RCF-002 — Conversão

Quando o visitante visualizar a página, ela deve oferecer chamadas para orçamento via WhatsApp com o telefone `+55 27 98862-4528` e links que abram a conversa com mensagem contextualizada.

### RCF-003 — Prova visual

Quando a galeria for exibida, ela deve apresentar exatamente duas comparações identificadas como cozinha e fachada, cada uma com uma imagem “Antes” e uma imagem “Depois”, usando os quatro WebPs em `assets/reforma-de-casas/`.

### RCF-004 — Acessibilidade e desempenho

Quando imagens forem exibidas, cada elemento `img` deve possuir `alt`, `width` e `height`; a imagem principal deve carregar prioritariamente e as demais devem usar carregamento tardio.

### RCF-005 — Descoberta

Quando o sitemap for publicado, ele deve conter a URL canônica da landing page e as quatro imagens da galeria, sem parâmetros de rastreamento.

### RCF-006 — Conteúdo de decisão

Quando o visitante avaliar a contratação de uma reforma, a página deve explicar critérios de escolha de materiais, cuidados para comparar empresas e pelo menos três qualidades verificáveis da D'Martins.

### RCF-007 — Apresentação responsiva

Quando a página for exibida em desktop, o hero deve separar texto e fotografia em duas colunas e as seções de materiais, contratação, qualidades e processo devem apresentar títulos e cartões com hierarquia visual consistente. Quando a largura for de até 760 px, hero e cartões devem empilhar sem deslocamento horizontal. As quatro fotos da comparação devem permanecer inteiras nos quadros.

### RCF-008 — Comparação ampliável

Quando a seção de resultados for exibida em desktop, cada obra deve ocupar uma linha própria e suas fotos Antes e Depois devem aparecer lado a lado, em quadros maiores que os anteriores. Quando a largura for de até 760 px, as fotos Antes e Depois de cada obra devem aparecer em uma única coluna, sem corte ou deslocamento horizontal. Quando o visitante clicar ou acionar pelo teclado qualquer foto da comparação, a página deve abrir a imagem correspondente em uma janela sobreposta com legenda formada pelo nome da obra e pelo rótulo Antes ou Depois; em uma tela de 390 px, a imagem aberta deve medir pelo menos 160 px de largura e 180 px de altura. O botão de fechar e a tecla Escape devem fechar a ampliação e devolver o foco ao controle acionado.

## Out of Scope

- Não afirmar que banheiro possui comparação antes/depois.
- Não alterar a página inicial, sua taxonomia ou sua galeria.
- Não publicar ou configurar a campanha no Google Ads.

## Requirement Traceability

| Requirement | Implementation surface | Verification |
| --- | --- | --- |
| RCF-001 | `reforma-de-casas/index.html` metadata | SEO validator |
| RCF-002 | Hero, proof and final CTA links | SEO validator and link inspection |
| RCF-003 | Comparison cards in landing page | SEO validator and asset existence |
| RCF-004 | `img` attributes and loading hints | SEO validator |
| RCF-005 | `sitemap.xml` URL and image entries | SEO validator |
| RCF-006 | Material, hiring and quality guidance sections | SEO validator and content inspection |
| RCF-007 | `reforma-de-casas/index.html` and `src/reforma-de-casas.css` | Desktop/mobile visual review and SEO gate |
| RCF-008 | Comparison markup, gallery script and CSS | Browser geometry and interaction tests |
