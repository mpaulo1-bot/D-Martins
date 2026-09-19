import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { discoverIndexablePages } from "./site-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productionUrl = "https://construtoradmartins.com.br/";
const read = (file) => readFileSync(path.join(root, file), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const html = read("index.html");
const robots = read("robots.txt");
const sitemap = read("sitemap.xml");
const llms = read("llms.txt");

const attribute = (tag, name) =>
  tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1];
const meta = (key, value) => {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  return tags.find((tag) => attribute(tag, key) === value);
};

assert(/<!doctype html>/i.test(html), "DOCTYPE ausente.");
assert(/<html\b[^>]*lang="pt-BR"/i.test(html), "Idioma pt-BR ausente.");
assert((html.match(/<h1\b/gi) ?? []).length === 1, "A página deve ter um H1.");
assert(
  html.includes(
    "<title>D'Martins Construções | Construção e Reformas na Grande Vitória</title>",
  ),
  "Title esperado não encontrado.",
);

const canonicalTag = html.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0];
assert(canonicalTag, "Canonical ausente.");
assert(attribute(canonicalTag, "href") === productionUrl, "Canonical incorreta.");
assert(meta("name", "description"), "Meta description ausente.");
assert(meta("name", "robots"), "Meta robots ausente.");
assert(meta("property", "og:url"), "og:url ausente.");
assert(meta("property", "og:image"), "og:image ausente.");
assert(meta("name", "twitter:card"), "Twitter Card ausente.");

for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
  const src = attribute(tag, "src");
  assert(attribute(tag, "alt") !== undefined, `Alt ausente em ${src}.`);
  assert(attribute(tag, "width"), `Width ausente em ${src}.`);
  assert(attribute(tag, "height"), `Height ausente em ${src}.`);
  if (!tag.includes('class="hero-image"')) {
    assert(attribute(tag, "loading") === "lazy", `Lazy loading ausente em ${src}.`);
  }
  if (src && !/^https?:/.test(src)) {
    assert(existsSync(path.join(root, src)), `Imagem local inexistente: ${src}.`);
  }
}

const jsonLdBlocks = [
  ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
];
assert(jsonLdBlocks.length === 1, "Deve existir exatamente um bloco JSON-LD.");
const schema = JSON.parse(jsonLdBlocks[0][1]);
const graph = schema["@graph"];
assert(Array.isArray(graph), "JSON-LD deve usar @graph.");
const ids = graph.map((entity) => entity["@id"]).filter(Boolean);
assert(new Set(ids).size === ids.length, "Há @ids duplicados no JSON-LD.");
for (const id of ["#empresa", "#website", "#webpage"]) {
  assert(ids.includes(`${productionUrl}${id}`), `Entidade ${id} ausente.`);
}

const business = graph.find((entity) => entity["@id"] === `${productionUrl}#empresa`);
assert(business, "Entidade da empresa ausente.");
assert(business.address?.["@type"] === "PostalAddress", "PostalAddress ausente.");
assert(business.makesOffer?.length === 21, "Esperados 21 serviços no schema.");

const htmlWithoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
for (const offer of business.makesOffer) {
  const service = offer.itemOffered;
  assert(service?.["@type"] === "Service", "Oferta sem Service.");
  assert(
    service.provider?.["@id"] === `${productionUrl}#empresa`,
    `Provider inválido em ${service.name}.`,
  );
  assert(
    service.areaServed?.name === "Grande Vitória",
    `areaServed inválida em ${service.name}.`,
  );
  assert(
    htmlWithoutScripts.includes(service.name),
    `Serviço do schema não está visível: ${service.name}.`,
  );
}

const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), "XML inválido.");
const indexableCanonicals = discoverIndexablePages(root)
  .map((page) => page.canonical)
  .sort();
assert(
  JSON.stringify([...sitemapLocs].sort()) === JSON.stringify(indexableCanonicals),
  "Sitemap e canonicals indexáveis divergem.",
);
assert(sitemapLocs.includes(productionUrl), "Homepage ausente no sitemap.");
assert(!sitemap.includes("<lastmod>"), "Não use lastmod sem data editorial real.");
assert(!/[?&](utm_|fbclid|gclid)/i.test(sitemap), "Parâmetro de tracking no sitemap.");

for (const imageUrl of sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)) {
  const localPath = new URL(imageUrl[1]).pathname.slice(1);
  assert(existsSync(path.join(root, localPath)), `Imagem do sitemap ausente: ${localPath}.`);
}

assert(/^User-agent: \*$/m.test(robots), "User-agent global ausente.");
assert(/^Allow: \/$/m.test(robots), "Produção não está explicitamente liberada.");
assert(!/^Disallow:/m.test(robots), "robots.txt não deve bloquear conteúdo público.");
assert(
  robots.includes(`Sitemap: ${productionUrl}sitemap.xml`),
  "Sitemap ausente no robots.txt.",
);
assert(llms.includes(productionUrl), "llms.txt não aponta para a página canônica.");

const idsInHtml = new Set(
  [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
);
for (const href of html.matchAll(/href="#([^"]+)"/g)) {
  assert(idsInHtml.has(href[1]), `Âncora interna quebrada: #${href[1]}.`);
}

console.log("SEO check aprovado: metadados, schema, sitemap, robots, imagens e links.");
