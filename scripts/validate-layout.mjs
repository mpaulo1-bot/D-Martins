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
        comparisonPairs: [...document.querySelectorAll(".comparison-card")].map((card) =>
          [...card.querySelectorAll(".comparison-images figure")].map((figure) =>
            figure.getBoundingClientRect().toJSON(),
          ),
        ),
        comparisonPhotoHeight: document.querySelector(".comparison-images img").getBoundingClientRect().height,
        comparisonPhotosIntact: [...document.querySelectorAll(".comparison-images img")].every((img) =>
          img.complete && img.naturalWidth > 0 && getComputedStyle(img).objectFit === "contain",
        ),
        comparisonFrames: [...document.querySelectorAll(".comparison-images img")].map((img) => {
          const photo = img.getBoundingClientRect();
          const frame = img.closest("button").getBoundingClientRect();
          const backdrop = getComputedStyle(img.closest("button"), "::before");
          return {
            photoWidth: photo.width,
            photoHeight: photo.height,
            frameWidth: frame.width,
            frameHeight: frame.height,
            matchingBackdrop: backdrop.backgroundImage.includes(img.src.split("/").pop()),
            blurredBackdrop: backdrop.filter.includes("blur("),
          };
        }),
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
  assert(desktop.comparisonCards[1].top >= desktop.comparisonCards[0].bottom - 2,
    "Cada obra deve ocupar uma linha propria no desktop.");
  assert(desktop.comparisonPairs.every(([before, after]) => before.right + 8 <= after.left),
    "Antes e Depois devem aparecer lado a lado no desktop.");
  assert(desktop.comparisonPhotoHeight >= 360,
    "Os quadros das fotos devem oferecer destaque visual no desktop.");

  for (const [index, mobile] of mobileLayouts.entries()) {
    const width = [760, 390][index];
    assert(mobile.heroImage.top >= mobile.heroText.bottom - 2,
      `Em ${width}px, a foto do hero deve aparecer abaixo do texto.`);
    assert(mobile.comparisonCards[1].top >= mobile.comparisonCards[0].bottom - 2,
      `Em ${width}px, os cards de comparação devem empilhar.`);
    assert(mobile.comparisonPairs.every(([before, after]) => after.top >= before.bottom - 2),
      `Em ${width}px, Antes e Depois devem aparecer em uma unica coluna.`);
    assert(mobile.contentWidth <= mobile.viewportWidth + 1,
      `Em ${width}px, a página não deve ter deslocamento horizontal.`);
    assert(mobile.sections.every(({ first, second }) => second.top >= first.bottom - 2),
      `Em ${width}px, os cartões editoriais devem empilhar.`);
  }

  for (const layout of [desktop, ...mobileLayouts]) {
    assert(layout.comparisonPhotosIntact,
      "As quatro fotos de comparação devem carregar sem corte.");
    assert(layout.comparisonFrames.length === 4 && [0, 2].every((first) => {
      const before = layout.comparisonFrames[first];
      const after = layout.comparisonFrames[first + 1];
      const expectedRatio = first === 0 ? 3 / 4 : 4 / 3;
      return Math.abs(before.frameWidth - after.frameWidth) <= 2 &&
        Math.abs(before.frameHeight - after.frameHeight) <= 2 &&
        Math.abs(before.frameWidth / before.frameHeight - expectedRatio) <= 0.02 &&
        Math.abs(after.frameWidth / after.frameHeight - expectedRatio) <= 0.02;
    }), `Em ${layout.viewportWidth}px, Antes e Depois devem ter quadros iguais em cada obra.`);
    assert(layout.comparisonFrames.every(({ photoWidth, photoHeight, frameWidth, frameHeight, matchingBackdrop, blurredBackdrop }) =>
      Math.abs(frameWidth - photoWidth) <= 3 &&
      Math.abs(frameHeight - photoHeight) <= 3 &&
      matchingBackdrop && blurredBackdrop),
    `Em ${layout.viewportWidth}px, os quadros devem exibir a foto inteira sobre preenchimento desfocado correspondente.`);
    assert(layout.sections.every(({ titleSize, cardCount, expectedCount, cardsStyled }) =>
      titleSize >= 32 && cardCount === expectedCount && cardsStyled),
    "As seções editoriais devem ter títulos destacados e cartões legíveis.");
  }

  const interactionContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const page = await interactionContext.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    const triggers = page.locator(".comparison-images button");
    assert.equal(await triggers.count(), 4, "Cada foto deve ser acionavel.");
    const dialog = page.locator(".comparison-lightbox");
    const expectedCaptions = [
      "Reforma de cozinha · Antes",
      "Reforma de cozinha · Depois",
      "Reforma de fachada · Antes",
      "Reforma de fachada · Depois",
    ];
    for (const index of [0, 1, 2, 3]) {
      const trigger = triggers.nth(index);
      if (index === 0) {
        await trigger.focus();
        await page.keyboard.press("Enter");
      } else {
        await trigger.click();
      }
      assert.equal(await dialog.evaluate((element) => element.open), true,
        "A foto deve abrir ampliada pelo teclado.");
      assert.equal(await dialog.locator("img").getAttribute("src"),
        await trigger.locator("img").getAttribute("src"),
        "A ampliacao deve exibir a foto acionada.");
      assert.equal((await dialog.locator("figcaption").innerText()).trim(), expectedCaptions[index],
        "A ampliacao deve identificar a obra e a etapa da foto.");
      const enlarged = await dialog.locator("img").boundingBox();
      assert(enlarged.width >= 160 && enlarged.height >= 180,
        "Em 390px, a foto aberta deve ter tamanho legivel.");
      if (index === 0) {
        await page.keyboard.press("Escape");
      } else {
        await dialog.locator(".lightbox-close").click();
      }
      assert.equal(await dialog.evaluate((element) => element.open), false,
        "Escape ou fechar deve encerrar a ampliacao.");
      assert.equal(await trigger.evaluate((element) => element === document.activeElement), true,
        "O foco deve voltar para a foto acionada.");
    }
  } finally {
    await interactionContext.close();
  }

  console.log("Layout aprovado: comparacoes destacadas, ampliacao acessivel e fotos responsivas.");
} finally {
  await browser.close();
}
