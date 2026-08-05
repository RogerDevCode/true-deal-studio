const { test, expect } = require("@playwright/test");
const { attachPageGuards } = require("./helpers");

test("La landing publica los documentos legales y ambos explican Google Calendar", async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.goto("/index.html");

  await expect(page.getByRole("link", { name: "Política de privacidad" }).last()).toHaveAttribute("href", "./privacidad.html");
  await expect(page.getByRole("link", { name: "Términos de uso" }).last()).toHaveAttribute("href", "./terminos.html");

  await page.goto("/privacidad.html");
  await expect(page).toHaveTitle("Tu Vitrina | Política de privacidad");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /Uso limitado de datos de Google/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "dev.n8n.stax@gmail.com" }).first()).toHaveAttribute("href", "mailto:dev.n8n.stax@gmail.com");

  await page.goto("/terminos.html");
  await expect(page).toHaveTitle("Tu Vitrina | Términos de uso");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /Horas, reservas y calendario/ })).toBeVisible();
  await guards.assertHealthyContext();
});
