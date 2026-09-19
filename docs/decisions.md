# Decisões do Projeto

Registre aqui decisões importantes do D'Martins.

## Modelo

### YYYY-MM-DD - Título da Decisão

**Contexto:**  

**Decisão:**  

**Consequencias:**  

### 2026-09-19 - Manter uma única página indexável

**Contexto:** O projeto possui conteúdo institucional suficiente para a página
inicial, mas ainda não dispõe de conteúdo específico e comprovável para páginas
independentes de cada serviço.

**Decisão:** Manter somente a homepage como URL canônica e indexável. Os
serviços especializados ficam agrupados em uma seção visível da página. O
sitemap é gerado automaticamente a partir dos arquivos HTML que possuem
canonical e não possuem `noindex`.

**Consequencias:** Evita páginas finas e duplicação de conteúdo. Novas páginas
somente devem ser criadas quando houver conteúdo real suficiente; ao serem
adicionadas com canonical e metadados próprios, o build passará a incluí-las no
sitemap.
