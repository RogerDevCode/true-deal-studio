const { test, expect } = require('@playwright/test');

async function waitForAlpine(page) {
  await page.waitForFunction(() => document.body?._x_dataStack?.[0]);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/demo-ecommerce-tech/index.html');
  await waitForAlpine(page);
});

test('Apex Tech identifies simulated and production capabilities', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tu catálogo también puede ordenar pedidos');
  await expect(page.locator('.demo-disclosure').first()).toContainText('Demostración interactiva');
  await expect(page.getByRole('link', { name: 'Probar catálogo' })).toBeVisible();
  await expect(page.locator('body')).toContainText('Las pasarelas de pago se conectan al publicar');
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain('WebPage');
  await expect(page.locator('body')).not.toContainText('Pagos digitales listos');
  await expect(page.locator('body')).not.toContainText('Envío Express Hoy mismo');
  await expect(page.locator('body')).not.toContainText('precios exclusivos por tiempo limitado');
});

test('Cart respects stock and checkout explains the demo order', async ({ page }) => {
  const add = page.getByRole('button', { name: /Agregar al carro.*3 disponibles/i }).first();
  await add.click();

  const increase = page.getByRole('button', { name: /Aumentar cantidad de Auriculares/i });
  await increase.click();
  await increase.click();
  await expect(increase).toBeDisabled();
  await expect(page.getByRole('status')).toContainText('Stock máximo agregado');

  await page.getByRole('button', { name: 'Revisar pedido demo' }).click();
  const checkout = page.getByRole('dialog', { name: 'Crear pedido demo' });
  await expect(checkout).toContainText('3 × Auriculares Apex Pro Wireless');
  await expect(checkout).toContainText('$389.970');
  await expect(checkout).toContainText('Retiro demostrativo · sin costo de despacho');
  await expect(page.getByLabel('Método de entrega')).toHaveValue('presencial');
});

test('Checkout guides validation and exposes the new order in the panel', async ({ page }) => {
  await page.getByRole('button', { name: /Agregar al carro/i }).first().click();
  await page.getByRole('button', { name: 'Revisar pedido demo' }).click();

  await page.getByLabel('Nombre completo').fill('Camila Soto');
  await page.getByLabel('WhatsApp').fill('abc');
  await page.getByRole('button', { name: 'Crear pedido demo' }).click();
  await expect(page.getByRole('alert')).toContainText('Escribe un WhatsApp chileno válido');

  await page.getByLabel('WhatsApp').fill('+56 9 1234 5678');
  await page.getByRole('button', { name: 'Crear pedido demo' }).click();
  const success = page.getByRole('dialog', { name: 'Pedido demo creado' });
  await expect(success).toContainText('simulación quedó guardada en este navegador');
  await success.getByRole('button', { name: 'Ver pedido en el panel' }).click();
  const admin = page.getByRole('dialog', { name: 'Panel de control demostrativo' });
  await expect(admin).toBeVisible();
  await expect(admin).toContainText('Camila Soto');
});

test('Mobile admin remains complete and free of floating obstruction', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await waitForAlpine(page);

  await expect(page.getByText('Volver al Showcase')).toHaveCount(0);
  await page.getByRole('button', { name: 'Abrir panel demo' }).click();
  const dialog = page.getByRole('dialog', { name: 'Panel de control demostrativo' });
  await expect(dialog.locator('.admin-mobile-list').first()).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Editar Auriculares Apex Pro Wireless/i })).toBeVisible();
  expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('Overlays, assets and motion meet the production floor', async ({ page }) => {
  await expect(page.locator('main')).toHaveCount(1);
  expect(await page.locator('style').first().textContent()).toContain('prefers-reduced-motion');

  const hero = page.locator('main img').first();
  await expect(hero).toHaveAttribute('width', '1024');
  await expect(hero).toHaveAttribute('height', '1024');
  await expect(hero).toHaveAttribute('fetchpriority', 'high');

  const productImages = page.locator('.product-img');
  for (let index = 0; index < await productImages.count(); index += 1) {
    await expect(productImages.nth(index)).toHaveAttribute('width', '1024');
    await expect(productImages.nth(index)).toHaveAttribute('height', '1024');
    await expect(productImages.nth(index)).toHaveAttribute('loading', 'lazy');
    await expect(productImages.nth(index)).toHaveAttribute('decoding', 'async');
  }

  const trigger = page.getByRole('button', { name: 'Abrir carrito demo' });
  await trigger.focus();
  await trigger.click();
  const cart = page.getByRole('dialog', { name: 'Carro demostrativo' });
  await expect(cart).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(cart).toBeHidden();
  await expect(trigger).toBeFocused();
});
