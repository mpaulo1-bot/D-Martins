# SEO e GEO técnico

## Arquitetura

- Site HTML estático, sem framework, CMS ou biblioteca de metadados.
- Conteúdo, metadados e JSON-LD presentes no HTML inicial.
- Uma rota pública indexável: `https://construtoradmartins.com.br/`.
- Produção em Apache/LiteSpeed no cPanel, com Cloudflare à frente do servidor.
- Não há ambiente de staging configurado no repositório.

## Endpoints

- Homepage: `https://construtoradmartins.com.br/`
- Sitemap: `https://construtoradmartins.com.br/sitemap.xml`
- Robots: `https://construtoradmartins.com.br/robots.txt`
- Recurso experimental: `https://construtoradmartins.com.br/llms.txt`

O sitemap é gerado por `scripts/generate-sitemap.mjs`. O script descobre os
arquivos HTML, lê a canonical e exclui páginas com `noindex`. Não adiciona
`lastmod` sem uma data editorial real.

## Comandos

```bash
npm run preview
npm test
npm run build
```

- `preview`: servidor HTTP local em `http://127.0.0.1:4173/`.
- `test`: valida metadados, schema, imagens, links internos, robots e sitemap.
- `build`: regenera o sitemap e executa a validação completa.

O projeto não possui etapa de compilação, linter ou suíte de testes anterior.
Todos os scripts usam apenas módulos nativos do Node.js.

## Resultados locais de referência

Auditoria executada em 2026-09-19 após o build:

| Modalidade | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 88 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms |
| Desktop | 90 | 100 | 100 | 100 | 0,7 s | 0 | 0 ms |

Os números são do Lighthouse em servidor local e não substituem dados reais de
campo. Cache, compressão, Cloudflare, latência da hospedagem e dispositivo do
visitante alteram os resultados em produção.

## Redirects e deploy

O `.htaccess` aplica redirects permanentes para HTTPS e para o host sem `www`.
Como arquivos iniciados por ponto não são copiados pelo glob `*`, o
`.cpanel.yml` copia o `.htaccess` em uma tarefa separada.

Antes desta implementação, a auditoria remota de 2026-09-19 encontrou:

- homepage canônica com HTTP 200;
- URL HTTP sem redirect para HTTPS;
- host `www` sem redirect para o host canônico;
- `sitemap.xml` com HTTP 404;
- `robots.txt` com HTTP 200, mas contendo apenas os comentários de sinais de
  conteúdo gerenciados pelo Cloudflare.

Esses itens precisam ser testados novamente depois da publicação. O Cloudflare
pode exigir configuração própria de redirect ou de robots gerenciado caso
substitua a resposta do servidor de origem.

## Homologação

1. Execute `npm run build` e confirme que o comando termina sem erro.
2. Execute `npm run preview` e revise a página em desktop e mobile.
3. Publique primeiro em um ambiente protegido por autenticação, se ele for
   criado. Use `noindex` como proteção complementar, nunca como única barreira.
4. Depois do deploy autorizado, valide os códigos HTTP de `/`, `/robots.txt`,
   `/sitemap.xml`, `/llms.txt` e de uma URL inexistente.
5. Confirme redirects de HTTP para HTTPS e de `www` para o host sem `www`.
6. Valide o JSON-LD no Rich Results Test e inspecione a homepage no Google
   Search Console.
7. Envie `sitemap.xml` ao Google Search Console e ao Bing Webmaster Tools.

Não há códigos de verificação, analytics ou tags de terceiros porque nenhum
valor real foi fornecido ou autorizado.

## Rollback

As alterações são estáticas e podem ser revertidas com `git revert` no commit
que as introduzir. Após o revert, execute novamente o deploy do cPanel. Evite
`git reset --hard`, pois ele pode descartar alterações locais não relacionadas.

## Monitoramento pós-publicação

- Imediato: status HTTP, redirects, robots, sitemap, canonical e links.
- Primeiras 24 horas: logs 404/5xx e Core Web Vitals em laboratório.
- Primeira semana: cobertura de indexação e canonical selecionada no Search
  Console; rastreamento no Bing Webmaster Tools.
- Mensal: páginas indexadas, erros de rastreamento, consultas locais, Core Web
  Vitals e atualização dos serviços realmente oferecidos.

O `llms.txt` é experimental e não substitui conteúdo HTML, sitemap, robots ou
Schema.org. Não há garantia de uso por mecanismos generativos.
