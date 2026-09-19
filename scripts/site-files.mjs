import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ignoredDirectories = new Set([".git", "docs", "node_modules", "scripts"]);

function findHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : findHtmlFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

export function discoverIndexablePages(root) {
  return findHtmlFiles(root).flatMap((file) => {
    const html = readFileSync(file, "utf8");
    const canonical = html.match(
      /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i,
    )?.[1];
    const robots = html.match(
      /<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i,
    )?.[1];

    if (!canonical) {
      throw new Error(`Canonical ausente em ${path.relative(root, file)}.`);
    }

    if (/\bnoindex\b/i.test(robots || "")) return [];

    return [{ canonical, file, html }];
  });
}
