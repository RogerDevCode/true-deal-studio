const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Tu Vitrina connected service offer', () => {
  test('presents voice and ordered attention, then prepares a contextual diagnostic', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await page.addInitScript(() => {
      window.__openedWhatsAppUrl = '';
      window.open = (url) => {
        window.__openedWhatsAppUrl = String(url);
        return { focus() {} };
      };
    });

    await page.goto('/index.html');
    await waitForAlpine(page);

    const section = page.getByTestId('assisted-attention');
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { name: /Todo lo que necesitas/i })).toBeVisible();

    const voice = page.getByTestId('tu-vitrina-voice-proof');
    await expect(voice).toContainText('Tu Vitrina Voz');
    const voiceLink = voice.getByRole('link', { name: /Habla con la demo/i });
    await expect(voiceLink).toHaveAttribute('href', 'https://voice.tuvitrina.lat/widget/tuvitrina');
    await expect(voiceLink).toHaveAttribute('target', '_blank');
    await expect(voiceLink).toHaveAttribute('rel', /noopener/);

    const workflowLink = page.locator('a[href="./demo-agenda/index.html"]');
    await expect(workflowLink).toBeAttached();

    await page.getByRole('link', { name: /Quiero orientación/i }).first().click();
    await expect.poll(async () => page.locator('#contacto').evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(70);

    await page.locator('#form-nombre').fill('Camila Pérez');
    await page.locator('#form-negocio').fill('Taller de bicicletas');
    await page.locator('#form-interes').selectOption('Tu Vitrina Voz');
    await page.locator('#form-mensaje').fill('Horarios, mantenciones y presupuesto.');
    await page.locator('#contacto form').getByRole('button', { name: 'Preparar mi consulta por WhatsApp' }).click();

    await expect.poll(async () => page.evaluate(() => decodeURIComponent(window.__openedWhatsAppUrl))).toContain('Quiero revisar primero: Tu Vitrina Voz.');
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await guards.assertHealthyContext();
  });
});
