const { test, expect } = require("@playwright/test");
const { attachPageGuards, waitForAlpine } = require("./helpers");

async function installWindowOpenProbe(page) {
  await page.addInitScript(() => {
    window.__lastOpenedUrl = null;
    window.open = (url) => {
      window.__lastOpenedUrl = String(url);
      return { focus() {}, close() {} };
    };
  });
}

function channelToLinear(value) {
  const channel = value / 255;
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function contrastRatio(first, second) {
  const luminance = ([red, green, blue]) =>
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue);
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
}

function parseColor(value) {
  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) {
    throw new Error(`Unsupported color value: ${value}`);
  }
  return channels;
}

test("Casa Ronda prepara una consulta familiar de bajo riesgo y reinicia", async ({ page }) => {
  await installWindowOpenProbe(page);
  await page.goto("/demo-casa-colores/index.html");
  await waitForAlpine(page);
  const guards = await attachPageGuards(page);

  await expect(page).toHaveTitle("Casa Ronda | Celebraciones infantiles");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main > section")).toHaveCount(5);
  await expect(page.getByRole("heading", {
    level: 1,
    name: "Aquí el cumpleaños se vive en ronda.",
  })).toBeVisible();
  await expect(page.getByText("Consultar no tiene costo", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Antes de reservar" })).toBeVisible();
  await expect(page.getByText("¿Consultar significa pagar?", { exact: true })).toBeVisible();
  await expect(page.getByText("No. Preparar y enviar la consulta no realiza cobros ni confirma automáticamente una reserva.", { exact: true })).toBeVisible();
  await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(0);
  await expect(page.locator('img[src="./assets/casa-ronda-hero.webp"]')).toHaveCount(1);
  await expect(page.locator(".experience-card")).toHaveCount(3);
  expect(await page.locator(".experience-card").evaluateAll((cards) => cards.map((card) => card.dataset.index))).toEqual(["01", "02", "03"]);

  const planButton = page.getByRole("button", { name: "Elegir Ronda Pequeña" });
  await planButton.click();
  await expect(planButton).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Elegiste Ronda Pequeña.")).toBeVisible();
  await page.getByLabel("Nombre de quien reserva").fill("Familia QA");
  await page.getByLabel("Edad que celebra").fill("7");
  await page.getByLabel("Cantidad de asistentes").fill("11");
  await page.getByLabel("Fecha preferida").fill("2026-08-15");
  await page.getByLabel("Necesidad que debemos conversar").fill("Alergia a los frutos secos");
  await page.getByRole("button", { name: "Preparar consulta por WhatsApp" }).click();

  const opened = decodeURIComponent(await page.evaluate(() => window.__lastOpenedUrl));
  expect(opened).toContain("https://wa.me/");
  expect(opened).toContain("Ronda Pequeña");
  expect(opened).toContain("7 años");
  expect(opened).toContain("11 asistentes");
  expect(opened).toContain("2026-08-15");
  expect(opened).toContain("Alergia a los frutos secos");

  await page.getByRole("button", { name: "Restablecer demo" }).click();
  await expect(page.getByText("Elegiste Ronda Pequeña.")).toHaveCount(0);
  await expect(page.locator("#reserva-nombre")).toHaveValue("");
  await expect(page.locator("#reserva-necesidad")).toHaveValue("");
  await guards.assertHealthyContext();
});

test("Casa Ronda mantiene una jerarquía mobile-first sin ideas fragmentadas", async ({ page }) => {
  const viewports = [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/demo-casa-colores/index.html");
    await waitForAlpine(page);

    const metrics = await page.evaluate(() => {
      const visualLines = (node) => {
        const range = document.createRange();
        range.selectNodeContents(node);
        return [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0).length;
      };
      const cards = [...document.querySelectorAll(".experience-card")];
      const grid = document.querySelector(".experience-grid");

      return {
        viewport: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        h1: parseFloat(getComputedStyle(document.querySelector("h1")).fontSize),
        h2: [...document.querySelectorAll("h2")].map((node) => parseFloat(getComputedStyle(node).fontSize)),
        cardTitles: cards.map((node) => parseFloat(getComputedStyle(node.querySelector("h3")).fontSize)),
        headings: [...document.querySelectorAll("[data-idea-heading]")].map((heading) => ({
          totalLines: [...heading.querySelectorAll("[data-idea-line]")].reduce((total, line) => total + visualLines(line), 0),
          ideaLines: [...heading.querySelectorAll("[data-idea-line]")].map(visualLines),
        })),
        fields: [...document.querySelectorAll(".field input, .field textarea")].map((node) => ({
          height: node.getBoundingClientRect().height,
          fontSize: parseFloat(getComputedStyle(node).fontSize),
        })),
        controls: [...document.querySelectorAll(".reset-button, .experience-card button, summary, .booking-form .button")].map((node) => node.getBoundingClientRect().height),
        gridOverflowX: getComputedStyle(grid).overflowX,
        cardRects: cards.map((card) => {
          const rect = card.getBoundingClientRect();
          return { left: rect.left, right: rect.right, top: rect.top };
        }),
      };
    });

    expect(metrics.scrollWidth, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(metrics.viewport);
    expect(metrics.headings, `idea headings at ${viewport.width}px`).toHaveLength(5);
    for (const heading of metrics.headings) {
      expect(heading.totalLines, `heading lines at ${viewport.width}px`).toBeLessThanOrEqual(2);
      expect(heading.ideaLines.every((lineCount) => lineCount === 1), `complete idea lines at ${viewport.width}px`).toBe(true);
    }

    const mobile = viewport.width < 900;
    expect(metrics.h1).toBeLessThanOrEqual(mobile ? 44 : 64);
    for (const size of metrics.h2) expect(size).toBeLessThanOrEqual(mobile ? 38 : 48);
    for (const size of metrics.cardTitles) expect(size).toBeLessThanOrEqual(mobile ? 28 : 32);
    for (const field of metrics.fields) {
      expect(field.height).toBeGreaterThanOrEqual(48);
      expect(field.fontSize).toBeGreaterThanOrEqual(16);
    }
    for (const height of metrics.controls) expect(height).toBeGreaterThanOrEqual(44);

    if (mobile) {
      expect(metrics.gridOverflowX).not.toBe("auto");
      for (const rect of metrics.cardRects) {
        expect(rect.left).toBeGreaterThanOrEqual(0);
        expect(rect.right).toBeLessThanOrEqual(metrics.viewport);
      }
      expect(metrics.cardRects[1].top).toBeGreaterThan(metrics.cardRects[0].top);
      expect(metrics.cardRects[2].top).toBeGreaterThan(metrics.cardRects[1].top);
    }
  }
});

test("Casa Ronda usa pares de color legibles en acciones y superficies", async ({ page }) => {
  await page.goto("/demo-casa-colores/index.html");
  await waitForAlpine(page);

  const colors = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const primary = getComputedStyle(document.querySelector(".button-primary"));
    const story = getComputedStyle(document.querySelector(".story-section"));
    const read = (name) => root.getPropertyValue(name).trim();
    return {
      pairs: [
        [read("--cta-text"), read("--cta-bg")],
        [read("--text-on-dark"), read("--surface-dark")],
        [read("--text-primary"), read("--surface-light")],
      ],
      primary: [primary.color, primary.backgroundColor],
      storyBackground: story.backgroundColor,
      coral: read("--coral"),
    };
  });

  for (const [foreground, background] of [...colors.pairs, colors.primary]) {
    expect(contrastRatio(parseColor(foreground), parseColor(background))).toBeGreaterThanOrEqual(4.5);
  }
  expect(parseColor(colors.storyBackground)).not.toEqual(parseColor(colors.coral));
});
