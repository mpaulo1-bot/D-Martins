# Landing page de reforma de casas

## Problem Statement

A campanha precisa de uma página específica para intenção de busca por reformas residenciais na Grande Vitória. A página deve transformar as fotos confirmadas pelo cliente em prova visual e facilitar o contato por WhatsApp.

## Objetivo

Disponibilizar uma landing page indexável para campanhas de Google Ads sobre reformas de casas na Grande Vitória, com prova visual das duas obras confirmadas pelo cliente.

## Assumptions & Open Questions

- O endereço público será servido por hospedagem estática com `reforma-de-casas/index.html`.
- Os pares cozinha e fachada foram confirmados pelo cliente como comparações corretas.
- Não há endereço público do Instagram a incluir nesta página.

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
