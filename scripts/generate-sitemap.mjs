import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { discoverIndexablePages } from "./site-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productionOrigin = "https://construtoradmartins.com.br";
const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const pages = discoverIndexablePages(root).map((page) => {
  const images = [
    ...page.html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi),
  ]
    .map((match) => new URL(match[1], page.canonical))
    .filter((url) => url.origin === productionOrigin)
    .map((url) => url.href);

  return { ...page, images: [...new Set(images)] };
});

const urls = pages
  .sort((left, right) => left.canonical.localeCompare(right.canonical))
  .map((page) => {
    const images = page.images
      .map(
        (image) =>
          `    <image:image>\n      <image:loc>${escapeXml(image)}</image:loc>\n    </image:image>`,
      )
      .join("\n");

    return `  <url>\n    <loc>${escapeXml(page.canonical)}</loc>\n${images}\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urls}
</urlset>
`;

writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");
console.log(`Sitemap gerado com ${pages.length} URL(s) indexável(is).`);
