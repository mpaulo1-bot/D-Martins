import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { discoverIndexablePages } from "./site-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productionUrl = "https://construtoradmartins.com.br/";
const expectedTitle =
  "Construção, Reformas e Engenharia na Grande Vitória | D'Martins";
const expectedDescription =
  "Construção, reformas, projetos, regularização de imóveis, inspeção predial e obras públicas na Grande Vitória. Atendimento com engenheiro civil.";
const expectedServices = [
  "Reformas residenciais, comerciais e prediais",
  "Construções",
  "Projetos de arquitetura e complementares",
  "Regularização de obras e imóveis",
  "Inspeção predial, vistorias e laudos técnicos",
  "Obras públicas",
];
const read = (file) => readFileSync(path.join(root, file), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const html = read("index.html");
const indexablePages = discoverIndexablePages(root);
const campaignHtml = read("reforma-de-casas/index.html");
const robots = read("robots.txt");
const sitemap = read("sitemap.xml");
const llms = read("llms.txt");
const favicon = read("favicon.svg");

const attribute = (tag, name) =>
  tag?.match(new RegExp(`${name}=(["'])(.*?)\\1`, "i"))?.[2];
const meta = (key, value) => {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  return tags.find((tag) => attribute(tag, key) === value);
};

const faviconTag = html.match(/<link\b[^>]*rel="icon"[^>]*>/i)?.[0];
assert(attribute(faviconTag, "href") === "/favicon.svg", "Favicon SVG incorreto.");
assert(attribute(faviconTag, "type") === "image/svg+xml", "Tipo do favicon incorreto.");
assert(
  /<svg\b[^>]*width="64"[^>]*height="64"[^>]*viewBox="0 0 829 829"/i.test(
    favicon,
  ),
  "Favicon deve ter quadro quadrado de 64 px.",
);
assert(
  /<rect\b[^>]*width="829"[^>]*height="829"[^>]*rx="75"[^>]*fill="#B78D40"/i.test(
    favicon,
  ),
  "Fundo dourado do favicon divergente.",
);
assert(
  /<g\b[^>]*fill="#021728"[^>]*transform="translate\(0 42\)"/i.test(
    favicon,
  ),
  "Símbolo azul-marinho do favicon divergente.",
);
assert((favicon.match(/<path\b/gi) ?? []).length === 8, "Símbolo do favicon incompleto.");
assert(!/<(?:image|text|script)\b/i.test(favicon), "Favicon contém elemento não permitido.");

assert(/<!doctype html>/i.test(html), "DOCTYPE ausente.");
assert(/<html\b[^>]*lang="pt-BR"/i.test(html), "Idioma pt-BR ausente.");
assert((html.match(/<h1\b/gi) ?? []).length === 1, "A página deve ter um H1.");
assert(
  html.includes(`<title>${expectedTitle}</title>`),
  "Title esperado não encontrado.",
);

const canonicalTag = html.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0];
assert(canonicalTag, "Canonical ausente.");
assert(attribute(canonicalTag, "href") === productionUrl, "Canonical incorreta.");
assert(
  attribute(meta("name", "description"), "content") === expectedDescription,
  "Meta description divergente.",
);
assert(meta("name", "robots"), "Meta robots ausente.");
assert(meta("property", "og:url"), "og:url ausente.");
assert(meta("property", "og:image"), "og:image ausente.");
assert(meta("name", "twitter:card"), "Twitter Card ausente.");
for (const [key, value] of [
  ["og:title", expectedTitle],
  ["og:description", expectedDescription],
]) {
  assert(
    attribute(meta("property", key), "content") === value,
    `${key} divergente.`,
  );
}
for (const [key, value] of [
  ["twitter:title", expectedTitle],
  ["twitter:description", expectedDescription],
]) {
  assert(
    attribute(meta("name", key), "content") === value,
    `${key} divergente.`,
  );
}

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
    assert(
      /^[a-z0-9./-]+$/.test(src),
      `Nome de imagem não normalizado: ${src}.`,
    );
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
for (const id of [
  "#empresa",
  "#wellington-carlos-correa",
  "#website",
  "#webpage",
]) {
  assert(ids.includes(`${productionUrl}${id}`), `Entidade ${id} ausente.`);
}

const business = graph.find((entity) => entity["@id"] === `${productionUrl}#empresa`);
assert(business, "Entidade da empresa ausente.");
assert(business.address?.["@type"] === "PostalAddress", "PostalAddress ausente.");
const offerNames = business.makesOffer?.map((offer) => offer.itemOffered?.name);
assert(
  JSON.stringify(offerNames) === JSON.stringify(expectedServices),
  "Serviços do schema divergem da taxonomia canônica.",
);
const servicesSection = html.match(
  /<section id="servicos"[\s\S]*?<section id="obras"/i,
)?.[0];
assert(servicesSection, "Seção de serviços ausente.");
const visibleServiceNames = [
  ...servicesSection.matchAll(
    /<article class="service-card">[\s\S]*?<h3>([^<]+)<\/h3>/gi,
  ),
].map((match) => match[1].trim());
assert(
  JSON.stringify(visibleServiceNames) === JSON.stringify(expectedServices),
  "Cards visíveis divergem da ordem canônica dos serviços.",
);

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

const professional = graph.find(
  (entity) => entity["@id"] === `${productionUrl}#wellington-carlos-correa`,
);
assert(professional?.["@type"] === "Person", "Responsável técnico ausente.");
assert(professional.name === "Wellington Carlos Corrêa", "Nome profissional divergente.");
assert(professional.jobTitle === "Engenheiro civil", "Profissão divergente.");
assert(
  professional.hasCredential?.identifier === "CREA-ES 50219/D",
  "Registro CREA divergente.",
);
assert(
  business.employee?.["@id"] === professional["@id"] &&
    professional.worksFor?.["@id"] === business["@id"],
  "Vínculo entre empresa e responsável técnico divergente.",
);

const worksSection = html.match(/<section id="obras"[\s\S]*?<\/section>/i)?.[0];
assert(worksSection, "Seção de obras ausente.");
const galleryImages = [
  ...worksSection.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi),
].map((match) => new URL(match[1], productionUrl).href);
const galleryCaptions = [
  ...worksSection.matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/gi),
].map((match) => match[1].replace(/\s+/g, " ").trim());
const schemaImages = business.image ?? [];
assert(schemaImages.length === 12, "Esperadas 12 obras no schema.");
assert(
  JSON.stringify(schemaImages.map((image) => image.contentUrl)) ===
    JSON.stringify(galleryImages),
  "Imagens do schema divergem da galeria.",
);
assert(
  JSON.stringify(schemaImages.map((image) => image.caption)) ===
    JSON.stringify(galleryCaptions),
  "Legendas do schema divergem da galeria.",
);
for (const image of schemaImages) {
  assert(image["@type"] === "ImageObject", "Obra sem ImageObject.");
  const localPath = new URL(image.contentUrl).pathname.slice(1);
  assert(existsSync(path.join(root, localPath)), `Imagem do schema ausente: ${localPath}.`);
}

const webpage = graph.find(
  (entity) => entity["@id"] === `${productionUrl}#webpage`,
);
assert(webpage?.description === expectedDescription, "Descrição da WebPage divergente.");

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
const expectedSitemapImages = [
  ...new Set(
    indexablePages.flatMap(({ html: pageHtml }) =>
      [...pageHtml.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)]
        .map((match) => new URL(match[1], productionUrl))
        .filter((url) => url.origin === new URL(productionUrl).origin)
        .map((url) => url.href),
    ),
  ),
];
assert(expectedSitemapImages.length === 18, "Esperadas 18 imagens visíveis.");
const sitemapImages = [
  ...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g),
].map((match) => match[1]);
assert(sitemapImages.length === 18, "Esperadas 18 imagens no sitemap.");
assert(
  JSON.stringify(sitemapImages) === JSON.stringify(expectedSitemapImages),
  "Imagens do sitemap divergem das imagens visíveis.",
);
const sitemapImageBlocks = [
  ...sitemap.matchAll(/<image:image>([\s\S]*?)<\/image:image>/g),
];
assert(sitemapImageBlocks.length === 18, "Esperados 18 blocos image:image.");
for (const block of sitemapImageBlocks) {
  const childTags = [...block[1].matchAll(/<image:([a-z_]+)>/g)].map(
    (match) => match[1],
  );
  assert(
    JSON.stringify(childTags) === JSON.stringify(["loc"]),
    "Cada image:image deve conter somente image:loc.",
  );
}

assert(/^User-agent: \*$/m.test(robots), "User-agent global ausente.");
assert(/^Allow: \/$/m.test(robots), "Produção não está explicitamente liberada.");
assert(!/^Disallow:/m.test(robots), "robots.txt não deve bloquear conteúdo público.");
assert(
  robots.includes(`Sitemap: ${productionUrl}sitemap.xml`),
  "Sitemap ausente no robots.txt.",
);
assert(llms.includes(productionUrl), "llms.txt não aponta para a página canônica.");
let previousServicePosition = -1;
for (const service of expectedServices) {
  const position = llms.indexOf(`- ${service}`);
  assert(position > previousServicePosition, `Serviço ausente ou fora de ordem no llms.txt: ${service}.`);
  previousServicePosition = position;
}
assert(llms.includes("CREA-ES 50219/D"), "CREA ausente no llms.txt.");
assert(
  llms.includes("Instagram: perfil recém-criado e ainda sem publicações"),
  "Situação do Instagram ausente no llms.txt.",
);

const campaignCanonical = campaignHtml.match(
  /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i,
)?.[1];
assert(
  campaignCanonical === "https://construtoradmartins.com.br/reforma-de-casas/",
  "Canonical da landing page de reforma incorreta.",
);
assert(
  /<title>Reforma de Casas na Grande Vitória \| D'Martins<\/title>/i.test(campaignHtml),
  "Title da landing page de reforma ausente.",
);
assert(
  /name=["']description["'][^>]*content=["'][^"']*reforma de casas na Grande Vitória/i.test(
    campaignHtml,
  ),
  "Description da landing page de reforma ausente.",
);
assert(
  (campaignHtml.match(/https:\/\/wa\.me\/5527988624528\?text=/g) ?? []).length >= 3,
  "CTAs de WhatsApp da landing page insuficientes.",
);
assert(
  (campaignHtml.match(/reforma%20de%20casa/gi) ?? []).length >= 3 &&
    campaignHtml.includes("Grande%20Vit%C3%B3ria"),
  "CTAs da landing sem contexto de reforma residencial na Grande Vitória.",
);
const campaignImages = [
  "../assets/reforma-de-casas/reforma-casa-cozinha-antes.webp",
  "../assets/reforma-de-casas/reforma-casa-cozinha-depois.webp",
  "../assets/reforma-de-casas/reforma-casa-fachada-antes.webp",
  "../assets/reforma-de-casas/reforma-casa-fachada-depois.webp",
];
for (const image of campaignImages) {
  assert(campaignHtml.includes(`src="${image}"`), `Imagem da landing ausente: ${image}.`);
}
assert(
  (campaignHtml.match(/class="comparison-card"/g) ?? []).length === 2 &&
    campaignHtml.includes("<h3>Reforma de cozinha</h3>") &&
    campaignHtml.includes("<h3>Reforma de fachada</h3>"),
  "A landing deve ter exatamente os cards de cozinha e fachada.",
);
assert(
  (campaignHtml.match(/<figcaption>Antes<\/figcaption>/g) ?? []).length === 2 &&
    (campaignHtml.match(/<figcaption>Depois<\/figcaption>/g) ?? []).length === 2,
  "Comparações da landing devem ter dois rótulos Antes e dois Depois.",
);
for (const tag of campaignHtml.match(/<img\b[^>]*>/gi) ?? []) {
  assert(/\balt=["'][^"']+["']/i.test(tag), "Imagem da landing sem alt.");
  assert(/\bwidth=["']\d+["']/i.test(tag), "Imagem da landing sem width.");
  assert(/\bheight=["']\d+["']/i.test(tag), "Imagem da landing sem height.");
}
assert(
  /class="campaign-hero-image"[\s\S]*?fetchpriority="high"/i.test(campaignHtml),
  "Imagem principal da landing sem prioridade alta.",
);
assert(
  (campaignHtml.match(/loading="lazy"/gi) ?? []).length === 4,
  "Imagens secundárias da landing devem usar lazy loading.",
);
assert(
  sitemap.includes("https://construtoradmartins.com.br/reforma-de-casas/") &&
    campaignImages.every((image) =>
      sitemap.includes(`https://construtoradmartins.com.br/${image.slice(3)}`),
    ),
  "Landing ou imagens da reforma ausentes no sitemap.",
);

const idsInHtml = new Set(
  [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
);
for (const href of html.matchAll(/href="#([^"]+)"/g)) {
  assert(idsInHtml.has(href[1]), `Âncora interna quebrada: #${href[1]}.`);
}

console.log("SEO check aprovado: metadados, schema, sitemap, robots, imagens e links.");
