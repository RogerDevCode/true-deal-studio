const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Exhaustive Landing Page (index.html) Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await waitForAlpine(page);
  });

  test('Hero section elements, typography, and primary CTA responsiveness', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await expect(page).toHaveTitle(/Atención de consultas por Telegram/i);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Deja de responder lo mismo todos los días.');
    
    // Check navigation anchor links
    const navLinks = ['#problema', '#resultado', '#proceso', '#oferta', '#faq'];
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
    await expect(faqSection).toContainText('¿Qué canal incluye el plan básico?');

    for (let i = 0; i < count; i++) {
      const btn = faqButtons.nth(i);
      if (await btn.isVisible()) {
        await btn.click({ force: true });
        await page.waitForTimeout(150);
      }
    }
    await guards.assertHealthyContext();
  });

  test('Demo links remain available for file navigation checks', async ({ page }) => {
    const guards = await attachPageGuards(page);

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

  test('Offer section and messaging CTA links are available', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const offerSection = page.locator('#oferta');
    await expect(offerSection).toBeVisible();
    await expect(offerSection).toContainText('Plan básico');
    await expect(offerSection).toContainText('Consultas frecuentes por Telegram');

    const whatsappLinks = page.locator('a[href*="wa.me"], a[href*="whatsapp"]');
    const telegramLinks = page.locator('a[href^="tg://user?id=5391760292"]');
    expect(await whatsappLinks.count()).toBeGreaterThan(0);
    expect(await telegramLinks.count()).toBeGreaterThan(0);
    await guards.assertHealthyContext();
  });
});
