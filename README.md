# D'Martins Construções

Site institucional da D'Martins Construções, construtora com base na Serra, ES, que atende a Grande Vitória com reformas, construções, obras públicas, projetos de arquitetura e projetos complementares.

## Como Abrir

Abra o arquivo `index.html` no navegador.

Para servir o projeto localmente com os tipos de conteúdo corretos:

```bash
npm run preview
```

O endereço local padrão é `http://127.0.0.1:4173/`.

## Validação e Build

```bash
npm test
npm run build
```

O build não compila a página, pois o site é HTML estático. Ele regenera o
`sitemap.xml` a partir das páginas HTML canônicas e executa as verificações de
SEO técnico.

## Estrutura

- `index.html` - página principal do site.
- `src/styles.css` - estilos responsivos.
- `src/main.js` - menu mobile e montagem da mensagem para WhatsApp.
- `assets/obras/` - fotos de obras usadas na galeria.
- `docs/` - brief, backlog e decisões do projeto.
- `robots.txt` - regras de rastreamento e endereço do sitemap.
- `sitemap.xml` - URLs canônicas e imagens importantes.
- `llms.txt` - resumo factual experimental para sistemas generativos.
- `scripts/` - preview local, geração do sitemap e validações de SEO.

## Conteúdo-Base

O conteúdo foi construído a partir da referência informada:

https://d-martins-construcoes.siteaudit.com.br?v=1789434067
