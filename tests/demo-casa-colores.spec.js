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

  const planButton = page.getByRole("button", { name: "Elegir Ronda Pequeña" });
  await planButton.click();
  await expect(planButton).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Ronda Pequeña elegida para tu celebración")).toBeVisible();
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
  await expect(page.getByText("Ronda Pequeña elegida para tu celebración")).toHaveCount(0);
  await expect(page.locator("#reserva-nombre")).toHaveValue("");
  await expect(page.locator("#reserva-necesidad")).toHaveValue("");
  await guards.assertHealthyContext();
});
