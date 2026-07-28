const { test, expect } = require("@playwright/test");
const { waitForAlpine } = require("./helpers");

test("Fono FAQ en vivo abre y desmonta el widget de voz", async ({ page }) => {
  await page.goto("/demo-fonoaudiologia/index.html");
  await waitForAlpine(page);

  const orb = page.getByTestId("fono-live-faq-orb");
  await expect(orb).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Se pedirá permiso para habilitar el micrófono.")).toBeVisible();

  await orb.click();

  const dialog = page.getByTestId("fono-live-faq-dialog");
  await expect(dialog).toBeVisible();
  await expect(orb).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.locator("iframe")).toHaveAttribute("src", "http://localhost:5173/widget/fonoaudiologia");
  await expect(dialog.locator("iframe")).toHaveAttribute("allow", /microphone/);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(dialog.locator("iframe")).toHaveCount(0);
  await expect(orb).toBeFocused();
});

test("Fono FAQ en vivo acepta una URL de widget configurada", async ({ page }) => {
  await page.addInitScript(() => {
    window.FONO_LIVE_FAQ_WIDGET_URL = "https://voice.example.test/widget/fonoaudiologia";
  });
  await page.goto("/demo-fonoaudiologia/index.html");
  await waitForAlpine(page);

  await page.getByTestId("fono-live-faq-orb").click();
  await expect(page.getByTestId("fono-live-faq-dialog").locator("iframe"))
    .toHaveAttribute("src", "https://voice.example.test/widget/fonoaudiologia");

  await page.getByRole("button", { name: "Cerrar FAQ en vivo" }).click();
  await expect(page.getByTestId("fono-live-faq-orb")).toBeFocused();
});
