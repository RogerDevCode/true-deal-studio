const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine, futureBookingDate } = require('./helpers');

test.beforeEach(async ({ page }) => {
  await page.goto('/demo-salon-belleza/index.html');
  await waitForAlpine(page);
});

test('Studio Chic explains availability, reference prices and demo content', async ({ page }) => {
  const guards = await attachPageGuards(page);

  await expect(page.locator('h1')).toHaveText('Tu cabello habla de ti. Dale voz.');
  await expect(page.locator('button').filter({ hasText: 'Solicitar disponibilidad' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Ver servicios y valores' })).toHaveAttribute('href', '#servicios');
  await expect(page.locator('#servicios')).toContainText('Valores referenciales');
  await expect(page.locator('.service-price')).toHaveCount(4);
  await expect(page.locator('.service-price').evaluateAll((nodes) =>
    nodes.every((node) => node.textContent.trim().startsWith('Desde $'))
  )).resolves.toBe(true);
  await expect(page.getByRole('button', { name: 'Quiero orientación' })).toBeVisible();
  await expect(page.getByText('Demo interactiva · contenido ilustrativo')).toBeVisible();

  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(jsonLd['@type']).toBe('WebPage');
  expect(jsonLd.address).toBeUndefined();
  expect(jsonLd.telephone).toBeUndefined();
  await expect(page.locator('footer')).toContainText('información revisada con el salón');
  await guards.assertHealthyContext();
});

test('Service selection and comparison work with keyboard on mobile', async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.setViewportSize({ width: 390, height: 844 });

  const service = page.getByRole('button', { name: /Corte de autor.*Desde \$35\.000/i });
  await service.focus();
  await page.keyboard.press('Enter');
  await expect(service).toHaveAttribute('aria-pressed', 'true');

  const checkout = page.locator('.checkout-preview');
  await expect(checkout).toBeVisible();
  await expect(checkout).toContainText('Revisar solicitud · $35.000 estimado');
  const box = await checkout.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  await expect(page.locator('#whatsapp-button')).toBeHidden();

  const range = page.locator('#salon-comparison');
  await expect(range).toHaveAttribute('type', 'range');
  await range.focus();
  await page.keyboard.press('Home');
  await expect(range).toHaveValue('0');
  await page.keyboard.press('End');
  await expect(range).toHaveValue('100');

  await expect(page.locator('.team-card').first()).toHaveAttribute('tabindex', '0');
  await expect(page.locator('.stylist-details').first()).toBeVisible();
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).resolves.toBe(true);
  await guards.assertHealthyContext();
});

test('Booking dialog contains focus and prepares a truthful WhatsApp request', async ({ page }) => {
  const guards = await attachPageGuards(page);
  const heroCta = page.locator('.cover-content').getByRole('button', { name: 'Solicitar disponibilidad' });

  await heroCta.click();
  const dialog = page.getByRole('dialog', { name: 'Solicitar disponibilidad' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('#salon-name')).toBeFocused();
  await expect(page.locator('#salon-date')).toHaveAttribute('min', /^\d{4}-\d{2}-\d{2}$/);
  await expect(dialog.getByText('Quiero orientación')).toBeVisible();
  await expect(dialog.locator('label[for]').evaluateAll((labels) =>
    labels.every((label) => document.getElementById(label.htmlFor))
  )).resolves.toBe(true);

  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Cerrar solicitud' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Preparar solicitud por WhatsApp' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(heroCta).toBeFocused();

  await page.getByRole('button', { name: /Corte de autor.*Desde \$35\.000/i }).click();
  await page.locator('.checkout-preview').getByRole('button').click();
  await page.locator('#salon-name').fill('Clienta QA');
  await page.locator('#salon-phone').fill('+56955556666');
  await page.locator('#salon-stylist').selectOption('stylist2');
  await page.locator('#salon-date').fill(await futureBookingDate(page));
  await page.locator('#salon-time').fill('16:00');
  await page.locator('#salon-comment').fill('Busco un cambio suave');
  await page.evaluate(() => {
    window.__openedWhatsApp = '';
    window.open = (url) => {
      window.__openedWhatsApp = url;
      return { focus() {} };
    };
  });

  await dialog.getByRole('button', { name: 'Preparar solicitud por WhatsApp' }).click();
  const url = decodeURIComponent(await page.evaluate(() => window.__openedWhatsApp));
  expect(url).toContain('Quiero consultar disponibilidad');
  expect(url).toContain('Ariadna Ruiz');
  expect(url).toContain('Desde $35.000');
  expect(url).toContain('horario y el valor final se confirman');
  await expect(page.getByText('Tu solicitud quedó preparada en WhatsApp')).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem('tuwebpro_bookings'))).resolves.toBeNull();
  await guards.assertHealthyContext();
});

test('Salon assets and motion stay production-ready', async ({ page }) => {
  const guards = await attachPageGuards(page);

  await expect(page.locator('.sidebar-cover')).toBeVisible();
  await expect(page.locator('.sidebar-bg')).toHaveCSS('animation-name', 'kenBurns');
  await expect(page.locator('.map-wrapper iframe')).toHaveAttribute('title', 'Ubicación demostrativa de Studio Chic en Providencia');
  const contentImages = page.locator('main img');
  await expect(contentImages.evaluateAll((images) =>
    images.every((image) => image.hasAttribute('width') && image.hasAttribute('height'))
  )).resolves.toBe(true);
  await expect(contentImages.evaluateAll((images) => images.every((image) => image.loading === 'lazy'))).resolves.toBe(true);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.sidebar-bg')).toHaveCSS('animation-name', 'none');
  await guards.assertHealthyContext();
});
