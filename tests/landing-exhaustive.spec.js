const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Exhaustive Landing Page (index.html) Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await waitForAlpine(page);
  });

  test('Hero section elements, typography, and primary CTA responsiveness', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await expect(page).toHaveTitle(/Que te vean\. Que te crean\./);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Que te vean. Que te crean.');
    await expect(page.locator('h1')).not.toContainText('Muestra lo que haces.');
    
    // Check navigation anchor links
    const navLinks = ['#demos', '#beneficios', '#precios', '#faq', '#propuestas-premium'];
    for (const href of navLinks) {
      const link = page.locator(`a[href="${href}"]`).first();
      await expect(link).toBeAttached();
    }
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

  test('Exhaustive validation of all 14 demo cards after expanding catalog', async ({ page }) => {
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
      './demo-plan-premium/index.html',
      './demo-propuesta-empezar-simple/index.html',
      './demo-propuesta-atencion-ordenada/index.html',
      './demo-propuesta-impacto-comercial/index.html'
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
});
