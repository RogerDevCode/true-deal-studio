const { test, expect } = require("@playwright/test");
const { attachPageGuards, waitForAlpine } = require("./helpers");

const viewports = [
  { name: "mobile-compact", width: 360, height: 640 },
  { name: "mobile-tall", width: 390, height: 844 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "desktop-short", width: 1280, height: 720 },
  { name: "desktop-standard", width: 1440, height: 900 },
];

test("Plan Profesional checkout modal stays scrollable across viewport sizes", async ({ page }) => {
  const guards = await attachPageGuards(page);
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/demo-plan-profesional/index.html#catalogo");
    await waitForAlpine(page);

    await page.evaluate(() => {
      const state = document.body._x_dataStack[0];
      state.cart = [state.servicesItems[0], state.servicesItems[1], state.servicesItems[2]];
      state.isCheckoutOpen = true;
      state.isCartOpen = false;
    });

    const modal = page.locator(".modal-content");
    await expect(modal).toBeVisible();

    const metrics = await modal.evaluate((node) => {
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        overflowY: style.overflowY,
        clientHeight: node.clientHeight,
        scrollHeight: node.scrollHeight,
        top: rect.top,
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
      };
    });

    expect(["auto", "scroll"]).toContain(metrics.overflowY);
    expect(metrics.top, viewport.name).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom, viewport.name).toBeLessThanOrEqual(metrics.viewportHeight);

    if (metrics.scrollHeight > metrics.clientHeight) {
      await modal.evaluate((node) => {
        node.scrollTop = node.scrollHeight;
      });
    }

    await expect(page.getByRole("button", { name: "Enviar a WhatsApp" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancelar" })).toBeVisible();

    await guards.assertHealthyContext();
  }
});
