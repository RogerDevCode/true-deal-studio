const { test, expect } = require("@playwright/test");
const { attachPageGuards, waitForAlpine } = require("./helpers");

test("Nido Animal: elige un cuidado, guarda la reserva y reinicia solo su clave", async ({ page }) => {
  await page.goto("/demo-mascotas/index.html");
  await waitForAlpine(page);
  const guards = await attachPageGuards(page);

  await page.evaluate(() => localStorage.setItem("stax-demo-hogar", "sentinel"));
  await page.getByRole("button", { name: "Reservar baño consciente" }).click();
  await page.getByLabel("Nombre de tu mascota").fill("Mora");
  await page.getByLabel("Especie").selectOption("Gato");
  await page.getByLabel("Fecha preferida").fill("2026-08-12");
  await page.getByLabel("Horario").selectOption("11:00");
  await page.getByRole("button", { name: "Guardar reserva" }).click();

  await expect(page.getByText("Mora · Baño consciente")).toBeVisible();
  await page.reload();
  await waitForAlpine(page);
  await expect(page.getByText("Mora · Baño consciente")).toBeVisible();

  await page.getByRole("button", { name: "Restablecer demo" }).click();
  await expect(page.getByText("Mora · Baño consciente")).toHaveCount(0);
  await expect(page.evaluate(() => localStorage.getItem("stax-demo-hogar"))).resolves.toBe("sentinel");
  await guards.assertHealthyContext();
});
