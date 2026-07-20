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

test("Casa de los Colores selecciona un paquete, prepara WhatsApp y reinicia", async ({ page }) => {
  await installWindowOpenProbe(page);
  await page.goto("/demo-casa-colores/index.html");
  await waitForAlpine(page);
  const guards = await attachPageGuards(page);

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main > section")).toHaveCount(4);
  await page.getByRole("button", { name: "Elegir Explora" }).click();
  await expect(page.getByText("Explora elegido para tu celebración")).toBeVisible();
  await page.getByLabel("Nombre de quien reserva").fill("Familia QA");
  await page.getByLabel("Edad que celebra").fill("8");
  await page.getByLabel("Cantidad de asistentes").fill("12");
  await page.getByLabel("Fecha preferida").fill("2026-08-15");
  await page.getByRole("button", { name: "Preparar mensaje por WhatsApp" }).click();

  const opened = decodeURIComponent(await page.evaluate(() => window.__lastOpenedUrl));
  expect(opened).toContain("https://wa.me/");
  expect(opened).toContain("Explora");
  expect(opened).toContain("8 años");
  expect(opened).toContain("12 asistentes");
  expect(opened).toContain("2026-08-15");

  await page.getByRole("button", { name: "Restablecer demo" }).click();
  await expect(page.getByText("Explora elegido para tu celebración")).toHaveCount(0);
  await expect(page.locator("#reserva-nombre")).toHaveValue("");
  await guards.assertHealthyContext();
});
