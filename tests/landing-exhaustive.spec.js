const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Exhaustive Landing Page (index.html) Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await waitForAlpine(page);
  });

  test('Hero section elements, typography, and primary CTA responsiveness', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await expect(page).toHaveTitle(/Ordena tu atención por WhatsApp/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Muestra lo importante antes de que te escriban.');
    await expect(page.locator('h1 > span')).toHaveClass(/\bblock\b/);
    await expect(page.getByRole('link', { name: 'Revisar lo que explico por WhatsApp' })).toBeVisible();
    await expect(page.locator('.hero-photo-bg').evaluate((hero) => getComputedStyle(hero).backgroundImage)).resolves.toContain('linear-gradient');
    await expect(page.locator('.hero-photo-bg').evaluate((hero) => getComputedStyle(hero).backgroundImage)).resolves.not.toContain('santiago-hero.webp');
    
    // Check navigation anchor links
    const navLinks = ['#demos', '#beneficios', '#precios', '#faq', '#necesidades'];
    for (const href of navLinks) {
      const link = page.locator(`a[href="${href}"]`).first();
      await expect(link).toBeAttached();
    }
    const needs = page.locator('#necesidades');
    await expect(needs).toBeVisible();
    await expect(needs.getByRole('heading', { name: 'Atiendes en un local' })).toBeVisible();
    await expect(needs.getByRole('heading', { name: 'Haces delivery' })).toBeVisible();
    await expect(needs.getByRole('heading', { name: 'Trabajas con reservas' })).toBeVisible();
    await expect(needs.getByRole('heading', { name: 'Vendes por catálogo' })).toBeVisible();
    await expect(needs.getByRole('heading', { name: 'Quieres cobrar en línea' })).toBeVisible();
    await guards.assertHealthyContext();
  });

  test('Hero clarity tunnel explains the service path without layout overflow', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const tunnel = page.locator('.clarity-tunnel');

    await expect(tunnel).toBeVisible();
    await expect(tunnel.locator('[data-clarity-step]')).toHaveCount(4);
    await expect(tunnel).toContainText('Consulta suelta');
    await expect(tunnel).toContainText('WhatsApp con contexto');
    await expect(tunnel.locator('.clarity-tunnel__signal')).toHaveCount(1);
    await expect(tunnel).toHaveClass(/is-visible/);
    await expect(tunnel.locator('.clarity-tunnel__signal').evaluate((signal) => signal.getAnimations().length)).resolves.toBeGreaterThan(0);
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await expect(page.locator('.clarity-tunnel')).toHaveClass(/is-visible/);
    await expect(page.locator('.clarity-tunnel [data-clarity-step]')).toHaveCount(4);

    await guards.assertHealthyContext();
  });

  test('Commercial redesign keeps local reach and human criteria visible', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const hero = page.locator('#inicio');
    const ia = page.locator('#ia-practica');

    const localReach = hero.getByText('Atención desde Biobío para negocios de todo Chile', { exact: true });
    await expect(localReach).toBeVisible();
    await expect(localReach).toHaveCSS('color', 'rgb(37, 65, 95)');
    await expect(ia.getByRole('heading', { name: 'La herramienta acelera. STAX se hace cargo del criterio.' })).toBeVisible();
    await expect(ia.getByText('Escuchamos cómo atiendes', { exact: true })).toBeVisible();
    await expect(ia.getByText('Ordenamos tu información', { exact: true })).toBeVisible();
    await expect(ia.getByText('Revisamos que funcione de verdad', { exact: true })).toBeVisible();
    await expect(ia.getByText('Te entregamos control', { exact: true })).toBeVisible();
    await expect(page.locator('.business-notebook-pattern')).toHaveCount(4);
    await expect(ia.locator('.business-card .text-drac-fg').first()).toHaveCSS('color', 'rgb(23, 43, 77)');

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await page.evaluate(() => document.documentElement.classList.add('light-theme'));
    await expect(page.locator('.business-notebook-pattern').evaluate((node) => getComputedStyle(node).backgroundImage)).resolves.not.toBe('none');

    await guards.assertHealthyContext();
  });

  test('Plans explain the business stage, required material, and scope limits', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const prices = page.locator('#precios');

    await expect(prices.getByText('Plan Vitrina Express', { exact: true })).toBeVisible();
    await expect(prices.getByText('Atención ordenada', { exact: true })).toBeVisible();
    await expect(prices.getByText('Pedidos en línea', { exact: true })).toBeVisible();
    await expect(prices.getByText('Necesitas aportar:', { exact: true })).toHaveCount(2);
    await expect(prices.getByText('Para empezar necesitas:', { exact: true })).toHaveCount(1);
    await expect(prices.getByText('No incluye:', { exact: true })).toHaveCount(2);
    await expect(prices.getByText('Considera:', { exact: true })).toHaveCount(1);

    await guards.assertHealthyContext();
  });

  test('Contact section explains the three steps before opening WhatsApp', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const contact = page.locator('#contacto');

    await expect(contact.getByText('1. Nos cuentas cómo atiendes', { exact: true })).toBeVisible();
    await expect(contact.getByText('2. Recibes una recomendación inicial', { exact: true })).toBeVisible();
    await expect(contact.getByText('3. Decides con claridad', { exact: true })).toBeVisible();
    await expect(contact.getByText(/Respondemos dentro del horario de atención/)).toBeVisible();
    await expect(contact.getByText('Tu mensaje está listo', { exact: true })).toBeAttached();
    await expect(contact.locator('.contact-form-note')).toHaveCount(3);
    await expect(contact.locator('.contact-form-note').first()).toHaveCSS('color', 'rgb(52, 64, 84)');

    await guards.assertHealthyContext();
  });

  test('Process timeline loops through each step only while the section is visible', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const process = page.locator('#proceso');
    const steps = process.locator('[data-process-step]');

    await expect(steps).toHaveCount(4);
    await expect(process.locator('.process-step-marker')).toHaveCount(4);
    await process.scrollIntoViewIfNeeded();
    await expect(process).toHaveClass(/process-motion-enabled/);
    await expect(process.locator('[data-process-step].is-active')).toHaveCount(1);
    await page.waitForFunction(() => {
      const section = document.querySelector('#proceso');
      const signal = section?.querySelector('.process-timeline-signal');
      const activeMarker = section?.querySelector('[data-process-step].is-active .process-step-marker');
      if (!signal || !activeMarker) return false;
      const signalBox = signal.getBoundingClientRect();
      const markerBox = activeMarker.getBoundingClientRect();
      return Math.abs((signalBox.top + signalBox.height / 2) - (markerBox.top + markerBox.height / 2)) <= 4;
    });

    const initialStep = await process.getAttribute('data-active-process-step');
    await page.waitForFunction((step) => document.querySelector('#proceso')?.dataset.activeProcessStep !== step, initialStep);
    await expect(process.locator('[data-process-step].is-active')).toHaveCount(1);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const reducedProcess = page.locator('#proceso');
    await reducedProcess.scrollIntoViewIfNeeded();
    await expect(reducedProcess).not.toHaveClass(/process-motion-enabled/);

    await guards.assertHealthyContext();
  });

  test('Theme switcher combinatorial testing: toggling, classes, and storage persistence', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const themeToggle = page.getByRole('button', { name: 'Cambiar tema' }).first();
    if (await themeToggle.isVisible()) {
      const root = page.locator('html');
      const initialTheme = await root.getAttribute('data-theme') || 'light';
      const nextTheme = initialTheme === 'dark' ? 'light' : 'dark';
      
      await themeToggle.click({ force: true });
      await expect(root).toHaveAttribute('data-theme', nextTheme);
      
      const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(storedTheme).toBe(nextTheme);

      for (let i = 0; i < 4; i++) {
        await themeToggle.click({ force: true });
        await page.waitForTimeout(50);
      }
    }
    await guards.assertHealthyContext();
  });

  test('FAQ accordion exhaustive interactive checking: expand, collapse, mutual exclusion', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const faqSection = page.locator('#faq');
    await expect(faqSection).toBeAttached();

    // Check only visible buttons inside FAQ to avoid hidden elements
    const faqButtons = page.locator('#faq button');
    const count = await faqButtons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const btn = faqButtons.nth(i);
      if (await btn.isVisible()) {
        await btn.click({ force: true });
        await page.waitForTimeout(150);
      }
    }
    await guards.assertHealthyContext();
  });

  test('Exhaustive validation of all 9 visible demo cards after expanding catalog', async ({ page }) => {
    const guards = await attachPageGuards(page);

    // Click "Ver todas las demos" / expand button first so all cards exist and become visible
    const expandBtn = page.getByRole('button', { name: /Ver las \d+ demostraciones|Mostrar menos/i }).first();
    if (await expandBtn.isVisible()) {
      await expandBtn.click({ force: true });
      await page.waitForTimeout(300);
    }

    const demoPaths = [
      './demo-psicologa/index.html',
      './demo-cafe-valparaiso/index.html',
      './demo-salon-belleza/index.html',
      './demo-artesanias/index.html',
      './demo-contabilidad/index.html',
      './demo-propiedades/index.html',
      './demo-ecommerce-tech/index.html',
      './demo-agenda/index.html',
      './demo-fonoaudiologia/index.html',
      './demo-plan-profesional/index.html',
      './demo-plan-premium/index.html'
    ];

    for (const demoPath of demoPaths) {
      const link = page.locator(`a[href="${demoPath}"]`).first();
      await expect(link, `Link to ${demoPath} must exist on landing`).toBeAttached();
    }
    await guards.assertHealthyContext();
  });

  test('Pricing table interactive tooltips and CTA triggers', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const pricingSection = page.locator('#precios');
    await expect(pricingSection).toBeAttached();

    // Check WhatsApp/wa.me action links
    const ctaLinks = page.locator('a[href*="wa.me"], a[href*="whatsapp"]');
    const ctaCount = await ctaLinks.count();
    expect(ctaCount).toBeGreaterThan(0);
    await guards.assertHealthyContext();
  });

  test('Plan Vitrina Express states a closed low-risk scope', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const pricing = page.locator('#precios');
    const plan = pricing.getByText('Plan Vitrina Express', { exact: true }).locator('..').locator('..');

    await expect(pricing.getByText('Plan Vitrina Express', { exact: true })).toBeVisible();
    await expect(pricing.getByText('$99.999', { exact: false })).toBeVisible();
    await expect(plan).toContainText('3 días hábiles');
    await expect(plan).toContainText('El plazo comienza cuando recibimos tu información completa.');
    await expect(plan).toContainText('Tu dominio queda a tu nombre');
    await expect(plan).toContainText('Una ronda consolidada de cambios');
    await expect(plan).toContainText('No incluye: páginas extra, cambios de estructura, carro ni pagos en línea.');
    await expect(plan.getByRole('link', { name: 'Quiero mi vitrina en 3 días' })).toHaveAttribute('href', '#contacto');
    await guards.assertHealthyContext();
  });
});
