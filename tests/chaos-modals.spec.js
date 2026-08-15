const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Chaos Testing - Modales y Formularios de Reserva', () => {
  const demosConModales = [
    '/demo-fonoaudiologia/index.html',
    '/demo-psicologa/index.html',
    '/demo-salon-belleza/index.html',
  ];

  for (const demo of demosConModales) {
    test(`Spam de clicks y race conditions en ${demo}`, async ({ page }) => {
      const guards = await attachPageGuards(page);
      await page.goto(demo);
      await waitForAlpine(page);

      const triggerBtn = page.getByRole('button', { name: /Reservar|Agendar|Solicitar/i }).first();
      await expect(triggerBtn).toBeVisible();

      // Spam de clicks rápidos para abrir y cerrar el modal
      for (let i = 0; i < 15; i++) {
        await triggerBtn.click({ force: true });
        await page.keyboard.press('Escape'); // Intenta cerrar el modal inmediatamente
      }

      // Asegurar que después del caos el modal se puede abrir correctamente y está estable
      await triggerBtn.click();
      const modal = page.locator('[x-data]').filter({ hasText: /WhatsApp|Confirmar/i }).last();
      await expect(modal).toBeVisible();

      // Forzar doble envío del formulario antes de que se deshabilite
      const submitBtn = modal.getByRole('button', { name: /Confirmar|Enviar/i });
      if (await submitBtn.isVisible()) {
        await submitBtn.click({ clickCount: 3, force: true });
      }

      await guards.assertHealthyContext();
    });

    test(`Inyección maliciosa y validación de inputs en ${demo}`, async ({ page }) => {
      const guards = await attachPageGuards(page);
      await page.goto(demo);
      await waitForAlpine(page);

      const triggerBtn = page.getByRole('button', { name: /Reservar|Agendar/i }).first();
      await triggerBtn.click();

      const inputs = page.locator('input[type="text"], input[type="email"], textarea');
      const inputsCount = await inputs.count();

      for (let i = 0; i < inputsCount; i++) {
        const payloadMalicioso = `<script>alert('XSS')</script> DROP TABLE users; 🤪💩 \u0000 \x1b`;
        await inputs.nth(i).fill(payloadMalicioso, { force: true });
      }

      const submitBtn = page.getByRole('button', { name: /Confirmar|Enviar/i }).last();
      if (await submitBtn.isVisible()) {
        await submitBtn.click({ force: true });
      }

      // Validar que la página sigue activa y que la inyección no causó un error fatal en el DOM/JS
      await expect(page.locator('body')).toBeVisible();
      const pageContent = await page.content();
      expect(pageContent).not.toContain("<script>alert('XSS')</script>");

      await guards.assertHealthyContext();
    });
  }
});
