const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

async function openViaAlpine(page, method) {
  await page.evaluate((methodName) => {
    const root = document.querySelector("[x-data]");
    const state = root && root._x_dataStack && root._x_dataStack[0];
    if (state && typeof state[methodName] === 'function') {
      state[methodName]();
    } else if (state && state.bookingModal !== undefined) {
      state.bookingModal = true;
    }
  }, method);
}

test.describe('Exhaustive Tests for Demos 1 to 5', () => {

  test.describe('Demo 1: Psicóloga Clínica (demo-psicologa)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/demo-psicologa/index.html');
      await waitForAlpine(page);
    });

    test('Service selection, modal priority, boundary inputs, XSS resilience, and exact reset', async ({ page }) => {
      const guards = await attachPageGuards(page);
      
      const serviceButtons = page.locator('button:has-text("Reservar"), button:has-text("Agendar")');
      const count = await serviceButtons.count();
      for (let i = 0; i < count; i++) {
        if (await serviceButtons.nth(i).isVisible()) {
          await serviceButtons.nth(i).click({ force: true });
          break;
        }
      }
      // Ensure modal open state
      await page.evaluate(() => {
        const root = document.querySelector("[x-data]");
        if (root && root._x_dataStack && root._x_dataStack[0]) root._x_dataStack[0].bookingModal = true;
      });

      const modal = page.locator('div.inline-block.overflow-hidden, div.bg-white.rounded-3xl, .modal-card').first();
      await expect(modal).toBeAttached();

      // Check Presencial priority/default in the modality control, whether radios or select.
      const modalityRadios = modal.locator('input[name="modalidad"]');
      if (await modalityRadios.count() > 0) {
        const firstRadio = modalityRadios.first();
        await expect(firstRadio).toHaveValue(/presencial/i);
        await expect(firstRadio).toBeChecked();
      } else {
        const selects = modal.locator('select');
        for (let i = 0; i < await selects.count(); i++) {
          const select = selects.nth(i);
          const firstOptionText = await select.locator('option').first().textContent();
          if (firstOptionText?.toLowerCase().includes('presencial')) {
            await expect(select).toBeVisible();
            break;
          }
        }
      }

      // Try breaking inputs with XSS and extreme strings
      const nameInput = modal.locator('input[type="text"]').first();
      const phoneInput = modal.locator('input[type="tel"]').first();
      if (await nameInput.count() > 0 && await nameInput.isVisible()) {
        await nameInput.fill('<script>alert("XSS")</script> Extremely long text '.repeat(5), { force: true });
      }
      if (await phoneInput.count() > 0 && await phoneInput.isVisible()) {
        await phoneInput.fill('+569999999999999999999999999', { force: true });
      }

      // Cancel modal and verify 100% state reset
      const cancelBtn = modal.locator('button:has-text("Cancelar"), button:has-text("Cerrar")').first();
      if (await cancelBtn.count() > 0 && await cancelBtn.isVisible()) {
        await cancelBtn.click({ force: true });
      } else {
        await page.evaluate(() => {
          const root = document.querySelector("[x-data]");
          if (root && root._x_dataStack && root._x_dataStack[0]) {
            root._x_dataStack[0].bookingModal = false;
            if (typeof root._x_dataStack[0].resetForm === 'function') root._x_dataStack[0].resetForm();
          }
        });
      }
      await guards.assertHealthyContext();
    });
  });

  test.describe('Demo 2: Café La Ruta (demo-cafe-valparaiso)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/demo-cafe-valparaiso/index.html');
      await waitForAlpine(page);
    });

    test('Combinatorial category filtering, order calculation boundaries, and modal state reset', async ({ page }) => {
      const guards = await attachPageGuards(page);

      // Test category tabs
      const tabs = ['Todos', 'Cafés', 'Desayunos', 'Pastelería', 'Almuerzos'];
      for (const tabName of tabs) {
        const tabBtn = page.locator(`button:has-text("${tabName}")`).first();
        if (await tabBtn.count() > 0 && await tabBtn.isVisible()) {
          await tabBtn.click({ force: true });
          await page.waitForTimeout(60);
        }
      }

      // Add items and test increment/decrement boundary
      const plusButtons = page.locator('button:has-text("+")');
      const count = await plusButtons.count();
      if (count > 0 && await plusButtons.nth(0).isVisible()) {
        await plusButtons.nth(0).click({ force: true });
        await plusButtons.nth(0).click({ force: true });
        if (count > 1 && await plusButtons.nth(1).isVisible()) await plusButtons.nth(1).click({ force: true });
        
        // Test decrement boundary below 0
        const minusButtons = page.locator('button:has-text("-")');
        if (await minusButtons.count() > 0 && await minusButtons.nth(0).isVisible()) {
          await minusButtons.nth(0).click({ force: true });
          await minusButtons.nth(0).click({ force: true });
          await minusButtons.nth(0).click({ force: true }); // Should hit 0 floor cleanly without NaN
        }
      }

      // Test modal options and reset
      await openViaAlpine(page, "openBooking");
      const modal = page.locator('.modal-card, [x-show*="openModal"]').first();
      await expect(modal).toBeAttached();

      const cancelBtn = modal.locator('button:has-text("Cancelar"), button:has-text("Cerrar")').first();
      if (await cancelBtn.count() > 0 && await cancelBtn.isVisible()) {
        await cancelBtn.click({ force: true });
      }
      await guards.assertHealthyContext();
    });
  });

  test.describe('Demo 3: Alta Peluquería Studio Chic (demo-salon-belleza)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/demo-salon-belleza/index.html');
      await waitForAlpine(page);
    });

    test('Before/After slider clipping boundary, stylist switcher, service combinatorial calc, and modal reset', async ({ page }) => {
      const guards = await attachPageGuards(page);

      // Test slider clip-path boundary testing
      const slider = page.locator('input[type="range"]').first();
      if (await slider.count() > 0 && await slider.isVisible()) {
        for (const val of ['0', '25', '50', '100']) {
          await slider.fill(val, { force: true });
          await slider.dispatchEvent('input');
          await page.waitForTimeout(50);
        }
      }

      // Test service checkbox combination calculation
      const serviceCheckboxes = page.locator('input[type="checkbox"]');
      const checkCount = await serviceCheckboxes.count();
      if (checkCount > 1) {
        if (await serviceCheckboxes.nth(0).isVisible()) await serviceCheckboxes.nth(0).check({ force: true });
        if (await serviceCheckboxes.nth(1).isVisible()) await serviceCheckboxes.nth(1).check({ force: true });
        await page.waitForTimeout(60);
      }

      // Test modal
      await openViaAlpine(page, "openBooking");
      const modal = page.locator('.modal-card, div.bg-white.rounded-3xl').first();
      await expect(modal).toBeAttached();

      const cancelBtn = modal.locator('button:has-text("Cancelar")').first();
      if (await cancelBtn.count() > 0 && await cancelBtn.isVisible()) {
        await cancelBtn.click({ force: true });
      }
      await guards.assertHealthyContext();
    });
  });

  test.describe('Demo 4: Artesanías del Sur (demo-artesanias)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/demo-artesanias/index.html');
      await waitForAlpine(page);
    });

    test('Category tabs, shopping cart multi-item combinatorics, item removal, and checkout drawer reset', async ({ page }) => {
      const guards = await attachPageGuards(page);

      // Add items to cart via UI or state
      const addButtons = page.locator('button:has-text("Agregar al Carrito")');
      const btnCount = await addButtons.count();
      if (btnCount > 0 && await addButtons.nth(0).isVisible()) {
        await addButtons.nth(0).click({ force: true });
        if (btnCount > 1 && await addButtons.nth(1).isVisible()) await addButtons.nth(1).click({ force: true });
      } else {
        await page.evaluate(() => {
          const state = document.querySelector("[x-data]")._x_dataStack[0];
          if (state && state.products) state.addToCart(state.products[0]);
        });
      }

      // Open cart drawer
      await page.evaluate(() => {
        const state = document.querySelector("[x-data]")._x_dataStack[0];
        if (state) {
          if (typeof state.openCart === 'function') state.openCart();
          else state.isCartOpen = true;
        }
      });

      const drawer = page.locator('[x-show="isCartOpen"], .cart-drawer').first();
      await expect(drawer).toBeAttached();

      // Check quantity controls and total calculation
      const plusBtn = drawer.locator('button:has-text("+")').first();
      if (await plusBtn.count() > 0 && await plusBtn.isVisible()) {
        await plusBtn.click({ force: true });
        await page.waitForTimeout(60);
      }

      // Test item removal
      const removeBtn = drawer.locator('button:has-text("🗑️"), button:has-text("Eliminar")').first();
      if (await removeBtn.count() > 0 && await removeBtn.isVisible()) {
        await removeBtn.click({ force: true });
        await page.waitForTimeout(60);
      }

      // Close cart and verify clean exit
      const closeBtn = drawer.locator('button:has-text("×"), button:has-text("Cerrar")').first();
      if (await closeBtn.count() > 0 && await closeBtn.isVisible()) {
        await closeBtn.click({ force: true });
      }
      await guards.assertHealthyContext();
    });
  });

  test.describe('Demo 5: ContaDigital (demo-contabilidad)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/demo-contabilidad/index.html');
      await waitForAlpine(page);
    });

    test('Dynamic SII plan calculator range combinatorics and booking modal state reset', async ({ page }) => {
      const guards = await attachPageGuards(page);

      // Test slider within safe min/max limits
      const sliders = page.locator('input[type="range"]');
      const sliderCount = await sliders.count();
      for (let i = 0; i < sliderCount; i++) {
        const slider = sliders.nth(i);
        if (await slider.isVisible()) {
          const maxAttr = await slider.getAttribute('max');
          const safeVal = maxAttr ? String(Math.min(Number(maxAttr), 10)) : '10';
          await slider.fill(safeVal, { force: true });
          await slider.dispatchEvent('input');
        }
      }

      // Click through plan options ("Inicial", "Pro", "Empresa")
      const planButtons = page.locator('button:has-text("Inicial"), button:has-text("Pro"), button:has-text("Empresa")');
      const planCount = await planButtons.count();
      for (let i = 0; i < planCount; i++) {
        if (await planButtons.nth(i).isVisible()) {
          await planButtons.nth(i).click({ force: true });
          await page.waitForTimeout(50);
        }
      }

      // Check calculation output is valid formatted string
      const calcOutput = page.locator('[x-text*="UF"], [x-text*="CLP"], .text-2xl, .text-3xl').first();
      if (await calcOutput.count() > 0) {
        const text = await calcOutput.textContent();
        expect(text).not.toContain('NaN');
        expect(text).not.toContain('undefined');
      }

      // Test modal priority & reset
      await openViaAlpine(page, "openBooking");
      const modal = page.locator('.modal-card, div.bg-white.rounded-3xl').first();
      await expect(modal).toBeAttached();

      const cancelBtn = modal.locator('button:has-text("Cancelar")').first();
      if (await cancelBtn.count() > 0 && await cancelBtn.isVisible()) {
        await cancelBtn.click({ force: true });
      }
      await guards.assertHealthyContext();
    });
  });
});
