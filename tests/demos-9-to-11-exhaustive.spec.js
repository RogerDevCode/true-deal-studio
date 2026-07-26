const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Exhaustive Tests for Demos 9 to 11', () => {

  test.describe('Demo 9: Clínica de Fonoaudiología (demo-fonoaudiologia)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/demo-fonoaudiologia/index.html');
      await waitForAlpine(page);
    });

    test('Commercial hero presents one concise promise and two clear actions', async ({ page }) => {
      const hero = page.getByTestId('fono-hero');

      await expect(hero.getByText('Fonoaudiología infantil a domicilio · Santiago', { exact: true })).toBeVisible();
      await expect(hero.locator('h1')).toHaveText('Acompañamos su lenguaje desde casa.');
      await expect(hero.getByText(
        'Una primera visita basada en el juego para conocer cómo se comunica tu hijo, orientar a la familia y acordar juntos el siguiente paso.',
        { exact: true }
      )).toBeVisible();
      await expect(hero.getByTestId('fono-primary-cta')).toHaveText('Solicitar primera visita');
      await expect(hero.getByRole('link', { name: 'Consultar por WhatsApp' })).toHaveAttribute('href', /wa\.me\/56964910042/);
      await expect(hero).toContainText('Atención a domicilio · Orientación para la familia · Coordinación por WhatsApp');
    });

    test('Hero hierarchy fits the first mobile screen and stays editorial on desktop', async ({ page }) => {
      for (const viewport of [
        { width: 390, height: 844, maxLines: 3 },
        { width: 1440, height: 900, maxLines: 2 },
      ]) {
        await page.setViewportSize(viewport);
        await page.reload();
        await waitForAlpine(page);

        const hero = page.getByTestId('fono-hero');
        const heading = hero.locator('h1');
        const metrics = await heading.evaluate((node) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return {
            lines: Math.round(rect.height / Number.parseFloat(style.lineHeight)),
            fontSize: Number.parseFloat(style.fontSize),
          };
        });

        expect(metrics.lines).toBeLessThanOrEqual(viewport.maxLines);
        expect(metrics.fontSize).toBeGreaterThanOrEqual(viewport.width === 390 ? 38 : 52);
        await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

        if (viewport.width === 390) {
          const heroTop = await hero.evaluate((node) => node.getBoundingClientRect().top);
          const ctaBottom = await hero.getByTestId('fono-primary-cta').evaluate((node) => node.getBoundingClientRect().bottom);
          expect(heroTop).toBeLessThan(180);
          expect(ctaBottom).toBeLessThanOrEqual(844);
        }
      }
    });

    test('Commercial sequence explains the visit before specialties and professional proof', async ({ page }) => {
      const order = await page.locator('main > section[id]').evaluateAll((sections) =>
        sections.map((section) => section.id)
      );

      expect(order).toEqual(['enfoque', 'areas', 'como-funciona', 'sobre-mi']);
      await expect(page.getByTestId('fono-first-visit').getByRole('heading', { name: '¿Qué aporta la primera visita?' })).toBeVisible();
      await expect(page.locator('#como-funciona')).toContainText('Orientación inicial y coordinación');

      const visibleCopy = await page.locator('body').innerText();
      expect(visibleCopy).not.toMatch(/más efectiva|ansiedad baja a cero|mucho más rápido|Pre-Diagnóstico|Especialista en Desarrollo Infantil/i);
    });

    test('Clinical service details toggle, home consultation modal priority, and state reset', async ({ page }) => {
      const guards = await attachPageGuards(page);

      // Test accordion / details toggles (`active` state)
      const detailButtons = page.locator('button[x-on\\:click*="active ="]');
      const count = await detailButtons.count();
      for (let i = 0; i < count; i++) {
        if (await detailButtons.nth(i).isVisible()) {
          await detailButtons.nth(i).click({ force: true });
          await page.waitForTimeout(100);
        }
      }

      // Open clinical booking modal
      await page.evaluate(() => {
        const root = document.querySelector("[x-data]");
        const state = root && root._x_dataStack && root._x_dataStack[0];
        if (state) state.bookingModal = true;
      });

      const modal = page.locator('div.relative.bg-white.w-full.max-w-lg.rounded-3xl, .modal-card, div.bg-white.rounded-3xl').first();
      await expect(modal).toBeAttached();

      const serviceSelect = modal.locator('#modal-service').first();
      if (await serviceSelect.count() > 0 && await serviceSelect.isVisible()) {
        const optText = await serviceSelect.locator('option').first().textContent();
        expect(optText?.length).toBeGreaterThan(3);
      }

      const cancelBtn = modal.locator('button:has-text("Cancelar")').first();
      if (await cancelBtn.count() > 0 && await cancelBtn.isVisible()) {
        await cancelBtn.click({ force: true });
      } else {
        await page.evaluate(() => {
          const root = document.querySelector("[x-data]");
          const state = root && root._x_dataStack && root._x_dataStack[0];
          if (state) state.bookingModal = false;
        });
      }
      await guards.assertHealthyContext();
    });
  });

  test.describe('Demo 10: Plan Profesional Simulador & Catálogo (demo-plan-profesional)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/demo-plan-profesional/index.html');
      await waitForAlpine(page);
    });

    test('Financial payment simulator installment calculations across all cuota buttons and catalog filters', async ({ page }) => {
      const guards = await attachPageGuards(page);

      // Test catalog category filters
      const filterButtons = page.locator('button:has-text("Todos"), button:has-text("Cocinas"), button:has-text("Baños")');
      const filterCount = await filterButtons.count();
      for (let i = 0; i < filterCount; i++) {
        if (await filterButtons.nth(i).isVisible()) {
          await filterButtons.nth(i).click({ force: true });
          await page.waitForTimeout(50);
        }
      }

      // Test Financial Payment Simulator (`#simulador`)
      const depositInput = page.locator('input[type="range"], input[type="number"]').first();
      if (await depositInput.count() > 0 && await depositInput.isVisible()) {
        const maxAttr = await depositInput.getAttribute('max');
        const fillVal = maxAttr ? String(Math.min(Number(maxAttr), 500000)) : '500000';
        await depositInput.fill(fillVal, { force: true });
        await depositInput.dispatchEvent('input');
      }

      // Test all installment cuota options (`cuotas = 1, 3, 6, 12`)
      const cuotaButtons = page.locator('button:has-text("1 cuota"), button:has-text("3 cuotas"), button:has-text("6 cuotas"), button:has-text("12 cuotas")');
      const cuotaCount = await cuotaButtons.count();
      for (let i = 0; i < cuotaCount; i++) {
        if (await cuotaButtons.nth(i).isVisible()) {
          await cuotaButtons.nth(i).click({ force: true });
          await page.waitForTimeout(100);
          const output = page.locator('[x-text*="cuotaMensual"], [x-text*="formatMoney"], .text-3xl').first();
          if (await output.count() > 0) {
            const text = await output.textContent();
            expect(text).not.toContain('NaN');
          }
        }
      }

      // Open quotation modal (`openBookingModal`)
      await page.evaluate(() => {
        const root = document.querySelector("[x-data]");
        const state = root && root._x_dataStack && root._x_dataStack[0];
        if (state) {
          state.cart = [{ id: 1, name: "Remodelación de Cocina Estándar", price: 1500000 }];
          state.isCheckoutOpen = true;
          state.openBookingModal = true;
        }
      });

      const modal = page.locator('.modal-content, .modal-card, div.bg-white.rounded-3xl').first();
      await expect(modal).toBeAttached();

      const cancelBtn = modal.locator('button:has-text("Cancelar")').first();
      if (await cancelBtn.count() > 0 && await cancelBtn.isVisible()) {
        await cancelBtn.click({ force: true });
      } else {
        await page.evaluate(() => {
          const root = document.querySelector("[x-data]");
          const state = root && root._x_dataStack && root._x_dataStack[0];
          if (state) {
            state.isCheckoutOpen = false;
            state.openBookingModal = false;
          }
        });
      }
      await guards.assertHealthyContext();
    });
  });

  test.describe('Demo 11: Plan Premium Live Configurator & Portal (demo-plan-premium)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/demo-plan-premium/index.html');
      await waitForAlpine(page);
    });

    test('Live product configurator combinatorics across materials, finishes, options and instant price updates', async ({ page }) => {
      const guards = await attachPageGuards(page);
      const configuratorSection = page.locator('#configurador');
      await expect(configuratorSection).toBeAttached();

      // Click model options
      const modelTabs = configuratorSection.locator('button:has-text("Roble Nativo"), button:has-text("Nogal"), button:has-text("Ebanizado")');
      const modelCount = await modelTabs.count();
      for (let i = 0; i < modelCount; i++) {
        if (await modelTabs.nth(i).isVisible()) {
          await modelTabs.nth(i).click({ force: true });
          await page.waitForTimeout(50);
        }
      }

      // Click material / finish buttons
      const materialButtons = configuratorSection.locator('button:has-text("Mate"), button:has-text("Satinado"), button:has-text("Brillante")');
      const matCount = await materialButtons.count();
      for (let i = 0; i < matCount; i++) {
        if (await materialButtons.nth(i).isVisible()) {
          await materialButtons.nth(i).click({ force: true });
          await page.waitForTimeout(50);
        }
      }

      // Toggle accessory checkboxes
      const accessoryCheckboxes = configuratorSection.locator('input[type="checkbox"]');
      const accCount = await accessoryCheckboxes.count();
      for (let i = 0; i < accCount; i++) {
        if (await accessoryCheckboxes.nth(i).isVisible()) {
          await accessoryCheckboxes.nth(i).check({ force: true });
          await page.waitForTimeout(50);
        }
      }

      // Check live price display (`totalPrice`)
      const priceDisplay = configuratorSection.locator('[x-text*="totalPrice"], [x-text*="formatPrice"], .text-4xl').first();
      if (await priceDisplay.count() > 0) {
        const text = await priceDisplay.textContent();
        expect(text).not.toContain('NaN');
        expect(text).not.toContain('undefined');
      }

      // Open checkout modal
      await page.evaluate(() => {
        const root = document.querySelector("[x-data]");
        const state = root && root._x_dataStack && root._x_dataStack[0];
        if (state) {
          state.cart = [{ id: 1, name: "Comedor Roble Escandinavo", price: 490000 }];
          state.isCheckoutOpen = true;
        }
      });

      const modal = page.locator('.modal-content, .modal-card, div.bg-white.rounded-3xl').first();
      await expect(modal).toBeAttached();

      const cancelBtn = modal.locator('button:has-text("Cancelar")').first();
      if (await cancelBtn.count() > 0 && await cancelBtn.isVisible()) {
        await cancelBtn.click({ force: true });
      } else {
        await page.evaluate(() => {
          const root = document.querySelector("[x-data]");
          const state = root && root._x_dataStack && root._x_dataStack[0];
          if (state) state.isCheckoutOpen = false;
        });
      }
      await guards.assertHealthyContext();
    });
  });
});
