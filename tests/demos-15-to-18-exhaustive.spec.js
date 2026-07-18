const { test, expect } = require("@playwright/test");
const { attachPageGuards, waitForAlpine } = require("./helpers");

test.describe("Demos 15 a 18", () => {
  test("Servicios domiciliarios: guarda solicitudes, las restaura y reinicia solo su estado", async ({ page }) => {
    await page.goto("/demo-servicios-domiciliarios/index.html");
    await waitForAlpine(page);
    const guards = await attachPageGuards(page);

    await page.evaluate(() => localStorage.setItem("stax-demo-mascotas", "sentinel"));
    await page.getByRole("button", { name: "Solicitar visita" }).click();
    await page.getByLabel("Comuna").selectOption("La Florida");
    await page.getByLabel("Servicio").selectOption("Electricidad");
    await page.getByLabel("Urgencia").selectOption("Esta semana");
    await page.getByLabel("Cuéntanos qué ocurre").fill("Revisar automático que se baja al encender el horno.");
    await page.getByRole("button", { name: "Guardar solicitud" }).click();

    await expect(page.getByRole("heading", { name: "La Florida · Electricidad" })).toBeVisible();
    await page.reload();
    await waitForAlpine(page);
    await expect(page.getByRole("heading", { name: "La Florida · Electricidad" })).toBeVisible();

    await page.getByRole("button", { name: "Restablecer demo" }).click();
    await expect(page.getByRole("heading", { name: "La Florida · Electricidad" })).toHaveCount(0);
    await expect(page.evaluate(() => localStorage.getItem("stax-demo-mascotas"))).resolves.toBe("sentinel");
    await guards.assertHealthyContext();
  });
});
