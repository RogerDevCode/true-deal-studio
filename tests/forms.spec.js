const { test, expect } = require("@playwright/test");
const { attachPageGuards, waitForAlpine } = require("./helpers");

async function openViaAlpine(page, method) {
  await page.evaluate((methodName) => {
    document.body._x_dataStack[0][methodName]();
  }, method);
}

test("Psicologa modal resets and defaults to Presencial", async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.goto("/demo-psicologa/index.html");
  await waitForAlpine(page);

  await page.evaluate(() => {
    document.body._x_dataStack[0].bookingModal = true;
  });
  await page.locator("#name").fill("Cliente Demo");
  await page.locator("#phone").fill("+56 9 1111 2222");
  await page.locator("#email").fill("cliente@demo.cl");
  await page.locator('input[value="online"]').check();
  await page.locator("#motivo").fill("Prueba de limpieza");
  await page.evaluate(() => {
    const state = document.body._x_dataStack[0];
    state.bookingModal = false;
    state.resetForm();
  });
  await page.waitForTimeout(400);

  await page.evaluate(() => {
    document.body._x_dataStack[0].bookingModal = true;
  });
  await expect(page.locator("#name")).toHaveValue("");
  await expect(page.locator("#phone")).toHaveValue("");
  await expect(page.locator("#email")).toHaveValue("");
  await expect(page.locator("#motivo")).toHaveValue("");
  await expect(page.locator('input[value="presencial"]')).toBeChecked();

  await guards.assertHealthyContext();
});

test("Cafe modal resets and defaults to Presencial", async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.goto("/demo-cafe-valparaiso/index.html");
  await waitForAlpine(page);

  await openViaAlpine(page, "openBooking");
  await page.locator('input[x-model="formName"]').fill("Cliente Cafe");
  await page.locator('input[x-model="formPhone"]').fill("+56 9 3333 4444");
  await page.locator('input[x-model="formEmail"]').fill("cafe@demo.cl");
  await page.locator('input[x-model="formDate"]').fill("2026-07-20");
  await page.locator('input[x-model="formTime"]').fill("13:30");
  await page.locator('select[x-model="formSector"]').selectOption("online");
  await page.locator('textarea[x-model="formComment"]').fill("Mesa de prueba");
  await openViaAlpine(page, "closeBooking");

  await openViaAlpine(page, "openBooking");
  await expect(page.locator('input[x-model="formName"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formPhone"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formEmail"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formDate"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formTime"]')).toHaveValue("");
  await expect(page.locator('select[x-model="formSector"]')).toHaveValue("presencial");

  await guards.assertHealthyContext();
});

test("Salon modal resets and defaults to Presencial", async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.goto("/demo-salon-belleza/index.html");
  await waitForAlpine(page);

  await openViaAlpine(page, "openBooking");
  await page.locator('input[x-model="formName"]').fill("Cliente Salon");
  await page.locator('input[x-model="formPhone"]').fill("+56 9 5555 6666");
  await page.locator('input[x-model="formEmail"]').fill("salon@demo.cl");
  await page.locator('input[x-model="formDate"]').fill("2026-07-20");
  await page.locator('input[x-model="formTime"]').fill("16:00");
  await page.locator('select[x-model="formSector"]').selectOption("online");
  await page.locator('textarea[x-model="formComment"]').fill("Coloracion de prueba");
  await openViaAlpine(page, "closeBooking");

  await openViaAlpine(page, "openBooking");
  await expect(page.locator('input[x-model="formName"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formPhone"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formEmail"]')).toHaveValue("");
  await expect(page.locator('select[x-model="formSector"]')).toHaveValue("presencial");
  await expect(page.locator('textarea[x-model="formComment"]')).toHaveValue("");

  await guards.assertHealthyContext();
});

test("Artesanias checkout resets and defaults to Presencial", async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.goto("/demo-artesanias/index.html");
  await waitForAlpine(page);

  await page.evaluate(() => {
    const state = document.body._x_dataStack[0];
    state.addToCart(state.products[0]);
    state.openCheckout();
  });
  await page.locator('input[x-model="formName"]').fill("Cliente Artesanias");
  await page.locator('input[x-model="formPhone"]').fill("+56 9 7777 8888");
  await page.locator('select[x-model="formSector"]').selectOption("envio");
  await page.locator('input[x-model="formAddress"]').fill("Av. Demo 123");
  await page.locator('textarea[x-model="formComment"]').fill("Pedido QA");
  await openViaAlpine(page, "closeCheckout");

  await page.evaluate(() => {
    const state = document.body._x_dataStack[0];
    state.openCheckout();
  });
  await expect(page.locator('input[x-model="formName"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formPhone"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formAddress"]')).toHaveValue("");
  await expect(page.locator('select[x-model="formSector"]')).toHaveValue("presencial");
  await expect(page.locator('textarea[x-model="formComment"]')).toHaveValue("");

  await guards.assertHealthyContext();
});

test("Contabilidad modal resets and defaults to Presencial", async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.goto("/demo-contabilidad/index.html");
  await waitForAlpine(page);

  await openViaAlpine(page, "openBooking");
  await page.locator('input[x-model="formName"]').fill("Cliente Conta");
  await page.locator('input[x-model="formPhone"]').fill("+56 9 9999 0000");
  await page.locator('input[x-model="formEmail"]').fill("conta@demo.cl");
  await page.locator('input[x-model="formDate"]').fill("2026-07-20");
  await page.locator('input[x-model="formTime"]').fill("09:30");
  await page.locator('select[x-model="formSector"]').selectOption("online");
  await page.locator('textarea[x-model="formComment"]').fill("Revision tributaria");
  await openViaAlpine(page, "closeBooking");

  await openViaAlpine(page, "openBooking");
  await expect(page.locator('input[x-model="formName"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formPhone"]')).toHaveValue("");
  await expect(page.locator('input[x-model="formEmail"]')).toHaveValue("");
  await expect(page.locator('select[x-model="formSector"]')).toHaveValue("presencial");
  await expect(page.locator('textarea[x-model="formComment"]')).toHaveValue("");

  await guards.assertHealthyContext();
});
