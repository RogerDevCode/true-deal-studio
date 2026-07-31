const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('STAX connected service offer', () => {
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
    await expect(section.getByRole('heading', { name: /Tu web puede orientar/i })).toBeVisible();

    const voice = page.getByTestId('stax-voice-offer');
    await expect(voice).toContainText('STAX Voz');
    const voiceLink = voice.getByRole('link', { name: 'Probar atención por voz' });
    await expect(voiceLink).toHaveAttribute('href', 'https://voice.stax.ink/widget/stax');
    await expect(voiceLink).toHaveAttribute('target', '_blank');
    await expect(voiceLink).toHaveAttribute('rel', /noopener/);

    const workflow = page.getByTestId('stax-owner-workflow');
    await expect(workflow).toContainText('STAX Atención Ordenada');
    const workflowLink = workflow.getByRole('link', { name: 'Ver cómo llega una consulta ordenada' });
    await expect(workflowLink).toHaveAttribute('href', './demo-agenda/index.html');
    await expect(workflowLink).toHaveAttribute('target', '_blank');
    await expect(workflowLink).toHaveAttribute('rel', /noopener/);

    await section.getByRole('link', { name: 'Revisar mi atención actual por WhatsApp' }).click();
    await expect.poll(async () => page.locator('#contacto').evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(72);

    await page.locator('#form-nombre').fill('Camila Pérez');
    await page.locator('#form-negocio').fill('Taller de bicicletas');
    await page.locator('#form-interes').selectOption('STAX Voz');
    await page.locator('#form-mensaje').fill('Horarios, mantenciones y presupuesto.');
    await page.locator('#contacto form').getByRole('button', { name: 'Preparar mi consulta por WhatsApp' }).click();

    await expect.poll(async () => page.evaluate(() => decodeURIComponent(window.__openedWhatsAppUrl))).toContain('Quiero revisar primero: STAX Voz.');
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await guards.assertHealthyContext();
  });
});
