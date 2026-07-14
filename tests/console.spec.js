const { test } = require("@playwright/test");
const { attachPageGuards } = require("./helpers");

const pages = [
  "/",
  "/demo-psicologa/index.html",
  "/demo-cafe-valparaiso/index.html",
  "/demo-salon-belleza/index.html",
  "/demo-artesanias/index.html",
  "/demo-contabilidad/index.html",
  "/demo-agenda/index.html",
];

test("Console and network remain clean on core pages", async ({ page }) => {
  const guards = await attachPageGuards(page);

  for (const target of pages) {
    await page.goto(target);
  }

  await guards.assertHealthyContext();
});
