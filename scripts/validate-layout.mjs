import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pageUrl = pathToFileURL(path.join(root, "reforma-de-casas", "index.html")).href;

let browser;
for (const channel of ["chrome", "msedge"]) {
  try {
    browser = await chromium.launch({ channel, headless: true });
    break;
  } catch (error) {
    if (channel === "msedge") {
      throw new Error("O teste de layout precisa de Google Chrome ou Microsoft Edge instalado.", {
        cause: error,
      });
    }
  }
}

async function inspect(width) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    for (const image of await page.locator(".comparison-images img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode());
    }
    return await page.evaluate(() => {
      const rect = (selector) => {
        const { left, right, top, bottom } = document.querySelector(selector).getBoundingClientRect();
        return { left, right, top, bottom };
      };
      const sections = [
        ["#materiais", ".guidance-card", 3],
        ["#contratar", ".hiring-checklist li", 4],
        [".quality-section", ".quality-card", 3],
        ["#processo", ".process-list li", 3],
      ].map(([sectionSelector, cardSelector, expectedCount]) => {
        const section = document.querySelector(sectionSelector);
        const cards = [...section.querySelectorAll(cardSelector)];
        return {
          titleSize: parseFloat(getComputedStyle(section.querySelector("h2")).fontSize),
          cardCount: cards.length,
          expectedCount,
          cardsStyled: cards.every((card) => {
            const style = getComputedStyle(card);
            return parseFloat(style.paddingLeft) >= 18 &&
              style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
              style.borderTopStyle !== "none";
          }),
          first: cards[0]?.getBoundingClientRect().toJSON(),
          second: cards[1]?.getBoundingClientRect().toJSON(),
        };
      });
      return {
        viewportWidth: document.documentElement.clientWidth,
        contentWidth: document.documentElement.scrollWidth,
        heroText: rect(".campaign-hero-content"),
        heroImage: rect(".campaign-hero-visual"),
        comparisonCards: [...document.querySelectorAll(".comparison-card")].map((card) =>
          card.getBoundingClientRect().toJSON(),
        ),
        comparisonPhotosIntact: [...document.querySelectorAll(".comparison-images img")].every((img) =>
          img.complete && img.naturalWidth > 0 && getComputedStyle(img).objectFit === "contain",
        ),
        sections,
      };
    });
  } finally {
    await context.close();
  }
}

try {
  const desktop = await inspect(1440);
  const mobileLayouts = [await inspect(760), await inspect(390)];
  assert(desktop.heroText.right + 16 <= desktop.heroImage.left,
    "No desktop, texto e foto do hero devem ocupar colunas separadas.");

  for (const [index, mobile] of mobileLayouts.entries()) {
    const width = [760, 390][index];
    assert(mobile.heroImage.top >= mobile.heroText.bottom - 2,
      `Em ${width}px, a foto do hero deve aparecer abaixo do texto.`);
    assert(mobile.comparisonCards[1].top >= mobile.comparisonCards[0].bottom - 2,
      `Em ${width}px, os cards de comparação devem empilhar.`);
    assert(mobile.contentWidth <= mobile.viewportWidth + 1,
      `Em ${width}px, a página não deve ter deslocamento horizontal.`);
    assert(mobile.sections.every(({ first, second }) => second.top >= first.bottom - 2),
      `Em ${width}px, os cartões editoriais devem empilhar.`);
  }

  for (const layout of [desktop, ...mobileLayouts]) {
    assert(layout.comparisonPhotosIntact,
      "As quatro fotos de comparação devem carregar sem corte.");
    assert(layout.sections.every(({ titleSize, cardCount, expectedCount, cardsStyled }) =>
      titleSize >= 32 && cardCount === expectedCount && cardsStyled),
    "As seções editoriais devem ter títulos destacados e cartões legíveis.");
  }

  console.log("Layout aprovado: desktop em duas colunas; cartões e fotos responsivos.");
} finally {
  await browser.close();
}
