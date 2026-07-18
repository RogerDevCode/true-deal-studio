const { test, expect } = require("@playwright/test");
const { attachPageGuards } = require("./helpers");

const demoPaths = [
  "./demo-fonoaudiologia/index.html",
  "./demo-psicologa/index.html",
  "./demo-cafe-valparaiso/index.html",
  "./demo-salon-belleza/index.html",
  "./demo-artesanias/index.html",
  "./demo-contabilidad/index.html",
  "./demo-propiedades/index.html",
  "./demo-ecommerce-tech/index.html",
  "./demo-agenda/index.html",
  "./demo-plan-profesional/index.html",
  "./demo-plan-premium/index.html",
];

test("Landing and demos stay production-ready", async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.goto("/");

  await expect(page).toHaveTitle("STAX | Muestra lo que haces. Atiende mejor por WhatsApp.");
  await expect(page.locator("h1")).toHaveCount(1);
  await page.getByRole("button", { name: /Ver las 9 demostraciones en vivo|Mostrar menos demostraciones/i }).click();

  for (const href of demoPaths) {
    const link = page.locator(`a[href="${href}"]`).first();
    await expect(link, `No existe link hacia ${href}`).toBeVisible();
  }

  for (const href of demoPaths) {
    await page.goto(href.replace(/^\.\//, "/"));
    await expect(page.locator("h1")).toHaveCount(1);
    const backLink = page.locator('a[href^="../index.html"]').first();
    await expect(backLink, `No se encontro link de retorno en ${href}`).toBeVisible();
    await expect(backLink).toHaveAttribute("href", /..\/*index\.html/);
    await page.goto("/");
    await expect(page).toHaveTitle("STAX | Muestra lo que haces. Atiende mejor por WhatsApp.");
  }

  await guards.assertHealthyContext();
});
