const { test, expect } = require("@playwright/test");
const { waitForAlpine } = require("./helpers");

test("Fono FAQ en vivo navega al asistente de voz en pantalla completa", async ({ page }) => {
  await page.goto("/demo-fonoaudiologia/index.html");
  await waitForAlpine(page);

  const orb = page.getByTestId("fono-live-faq-orb");
  await expect(orb).toHaveAttribute("href", "https://voice.tuvitrina.lat/widget/fonoaudiologia");
  await expect(orb).toHaveAttribute("aria-label", "Abrir FAQ en vivo en pantalla completa");
  await expect(page.getByText("Se pedirá permiso para habilitar el micrófono.")).toBeVisible();
  await expect(page.getByTestId("fono-live-faq-dialog")).toHaveCount(0);
});
