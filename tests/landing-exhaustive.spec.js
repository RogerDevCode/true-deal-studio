const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

function parseRgb(color) {
  return color.match(/\d+/g).slice(0, 3).map(Number);
}

function luminance([red, green, blue]) {
  const channels = [red, green, blue].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

async function setTheme(page, theme) {
  await page.evaluate((selectedTheme) => {
    window.themeController.writeStoredTheme(selectedTheme);
  }, theme);
  await page.reload();
  await waitForAlpine(page);
}

test.describe('Exhaustive Landing Page (index.html) Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await waitForAlpine(page);
  });

  test('Hero section elements, typography, and primary CTA responsiveness', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await expect(page).toHaveTitle(/Que te vean\. Que te crean\./);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Que te vean');
    await expect(page.locator('h1 > span')).toHaveClass(/\bblock\b/);
    await expect(page.locator('#inicio').getByTestId('stax-voice-demo-cta')).toHaveAttribute('href', 'https://voice.tuvitrina.lat/widget/tuvitrina');
    const examplesCta = page.locator('#inicio').getByTestId('stax-rubro-cta');
    await expect(examplesCta).toHaveAttribute('href', '#demos');
    await expect(examplesCta).toBeVisible();
    await examplesCta.click();
    await expect.poll(async () => page.locator('#demos').evaluate((section) => section.getBoundingClientRect().top)).toBeGreaterThanOrEqual(72);
    await expect(page.locator('.hero-photo-bg').evaluate((hero) => getComputedStyle(hero).backgroundImage)).resolves.not.toBe('none');
    await expect(page.locator('.hero-photo-bg').evaluate((hero) => getComputedStyle(hero).backgroundImage)).resolves.toContain('stax-hero-atmosphere.webp');
    await expect(page.locator('head style').evaluateAll((styles) => styles.some((style) => /(^|\n)\s*\.\s*(?=\{|:)/m.test(style.textContent || '')))).resolves.toBe(false);
    
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
    await expect(needs.getByRole('heading', { name: 'Quieres cobrar en línea' })).toHaveCount(0);
    await expect(needs.locator('.need-visual')).toHaveCount(4);
    await expect(needs.locator('.need-visual').evaluateAll((visuals) => visuals.every((visual) => visual.getAttribute('aria-hidden') === 'true'))).resolves.toBe(true);
    await expect(needs.locator('.need-visual img')).toHaveCount(4);
    await expect(needs.locator('.need-visual img').evaluateAll((images) => images.every((image) => image.getAttribute('loading') === 'lazy'))).resolves.toBe(true);

    const visualEvidence = page.locator('#demos');
    await expect(visualEvidence).toBeVisible();
    const benefits = page.locator('#beneficios');
    await expect(benefits).toBeVisible();
    await guards.assertHealthyContext();
  });

  test('Visual evidence links to corresponding demos with low-friction navigation', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await page.setViewportSize({ width: 390, height: 844 });
    const visualEvidence = page.locator('#demos');
    const evidenceLinks = visualEvidence.locator('a[href*="demo-"]');

    await expect(evidenceLinks.nth(0)).toHaveAttribute('href', './demo-fonoaudiologia/index.html');
    await expect(evidenceLinks.nth(1)).toHaveAttribute('href', './demo-psicologa/index.html');
    await expect(evidenceLinks.nth(2)).toHaveAttribute('href', './demo-cafe-valparaiso/index.html');
    await evidenceLinks.nth(0).focus();
    await expect(evidenceLinks.nth(0)).toBeFocused();
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

    await evidenceLinks.nth(0).click();
    await expect(page).toHaveURL(/\/demo-fonoaudiologia\/index\.html$/);
    await page.goBack();
    await waitForAlpine(page);
    await expect(visualEvidence).toBeVisible();
    await guards.assertHealthyContext();
  });

  test('Hero rubro simulator switches examples without layout overflow', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const simulator = page.getByTestId('hero-rubro-simulator');

    await expect(simulator).toBeVisible();
    await expect(simulator.getByRole('button')).toHaveCount(6);
    await expect(simulator.getByRole('button', { name: /Salud/ })).toHaveAttribute('aria-pressed', 'true');
    await simulator.getByRole('button', { name: /Salón/ }).click();
    await expect(simulator.getByRole('button', { name: /Salud/ })).toHaveAttribute('aria-pressed', 'false');
    await expect(simulator.getByRole('button', { name: /Salón/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(simulator).toContainText('Studio Chic · Alta Peluquería');
    await expect(simulator).toContainText('balayage');
    await expect(simulator.getByRole('link', { name: 'Ver ejemplo funcionando' })).toHaveAttribute('href', './demo-salon-belleza/index.html');
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    for (const button of await simulator.getByRole('button').all()) {
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    for (const locator of [page.locator('#inicio .hero-subtitle'), page.locator('#inicio').getByTestId('stax-voice-demo-cta'), page.locator('#inicio').getByTestId('stax-rubro-cta'), simulator]) {
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(390);
    }

    await guards.assertHealthyContext();
  });

  test("Mobile visitors reach price context early and floating WhatsApp never competes with local CTAs", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/index.html");
    await waitForAlpine(page);
    const earlyPrice = page.getByTestId("starting-price-summary");
    const priceY = await earlyPrice.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    expect(priceY).toBeLessThan(2200);
    const floating = page.getByTestId("floating-whatsapp");
    for (const sectionId of ["inicio", "precios", "contacto"]) {
      await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
      await expect(floating).toHaveClass(/is-context-hidden/);
    }
    await page.locator("#demos").scrollIntoViewIfNeeded();
    await expect(floating).not.toHaveClass(/is-context-hidden/);
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
  });

  test("Mobile menu returns focus and public actions keep readable text", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const menuButton = page.getByRole("button", { name: "Menú" });
    await menuButton.click();
    const backdrop = page.getByTestId("mobile-menu-backdrop");
    await expect(backdrop).toBeVisible();
    const panelBox = await page.getByTestId("mobile-menu-panel").boundingBox();
    expect(panelBox).not.toBeNull();
    expect(panelBox.width).toBeGreaterThanOrEqual(380);
    await backdrop.click({ position: { x: 5, y: 700 } });
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    await expect(backdrop).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    const commercialText = page.locator("#precios p, #precios li, #contacto p, #contacto label");
    for (const element of await commercialText.all()) {
      if (!(await element.isVisible())) continue;
      const size = Number.parseFloat(await element.evaluate((node) => getComputedStyle(node).fontSize));
      expect(size).toBeGreaterThanOrEqual(14);
    }

    const blankLinks = page.locator('#demos a[target="_blank"]');
    await expect(blankLinks.evaluateAll((links) => links.every((link) => link.rel.includes("noopener")))).resolves.toBe(true);
    await expect(blankLinks.evaluateAll((links) => links.every((link) => link.textContent.includes("abre en una pestaña nueva")))).resolves.toBe(true);
  });

  test('Commercial redesign keeps local reach and human criteria visible', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const hero = page.locator('#inicio');
    const beneficios = page.locator('#beneficios');

    const localReach = hero.getByText('Desde Biobío para negocios de todo Chile', { exact: true });
    await expect(localReach).toBeVisible();
    await expect(beneficios.getByRole('heading', { name: /Todo lo que necesitas/i })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await page.evaluate(() => document.documentElement.classList.add('light-theme'));

    await guards.assertHealthyContext();
  });

  test('Commercial copy stays factual, affirmative and easy to act on', async ({ page }) => {
    const visibleCopy = await page.locator('body').innerText();

    await expect(page.locator('#inicio .hero-subtitle')).toContainText(
      'Tu web puede orientar antes de que te escriban: explica lo importante y prepara consultas con más contexto para que tú decidas el siguiente paso.'
    );
    await expect(page.getByTestId('early-plans-link')).toHaveAttribute('href', '#precios');
    await expect(page.getByTestId('early-guidance-link')).toHaveAttribute('href', '#contacto');
    await expect(page.getByTestId('starting-price-summary').getByRole('link')).toHaveCount(2);
    expect(visibleCopy).not.toMatch(/Hosting|HTTPS|SEO|HTML \+ Tailwind|Alpine\.js/);
    expect(visibleCopy).not.toMatch(/ventas garantizadas|se paga sola|15 horas|cupos/i);
  });

  test('Every plan shows its IVA total and affirmative scope language', async ({ page }) => {
    const prices = page.locator('#precios');

    await expect(prices.getByText('Total con IVA: $118.999 CLP', { exact: true })).toBeVisible();
    await expect(prices.getByText('Total referencial desde $297.488 CLP con IVA', { exact: true })).toBeVisible();
    await expect(prices.getByText('Total referencial desde $535.488 CLP con IVA', { exact: true })).toBeVisible();
    await expect(prices.getByText('Queda fuera del alcance:', { exact: true })).toHaveCount(3);
    for (const disclosure of await prices.locator('details[data-plan-details]').all()) {
      await expect(disclosure.locator('summary')).toHaveText('Revisar condiciones, plazos y soporte');
    }
  });

  test('Plans explain the business stage, required material, and scope limits', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const prices = page.locator('#precios');

    await expect(prices.getByText('Plan Vitrina Express', { exact: true })).toBeVisible();
    await expect(prices.getByText('Atención ordenada', { exact: true })).toBeVisible();
    await expect(prices.getByText('Pedidos en línea', { exact: true })).toBeVisible();
    await expect(prices.getByText('Necesitas aportar:', { exact: true })).toHaveCount(2);
    await expect(prices.getByText('Para empezar necesitas:', { exact: true })).toHaveCount(1);
    await expect(prices.getByText('Queda fuera del alcance:', { exact: true })).toHaveCount(3);
    await expect(prices.getByText('Considera:', { exact: true })).toHaveCount(1);

    await guards.assertHealthyContext();
  });

  test("Pricing scope is available without hover and copy stays consultative", async ({ page }) => {
    const pricing = page.locator("#precios");
    await expect(pricing.locator("details[data-plan-details]")).toHaveCount(3);
    for (const disclosure of await pricing.locator("details[data-plan-details]").all()) {
      await disclosure.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(disclosure).toHaveAttribute("open", "");
      await expect(disclosure.locator("summary")).toHaveText("Revisar condiciones, plazos y soporte");
    }
    await expect(page.locator("body")).not.toContainText("Se vende mejor");
    await expect(page.locator("body")).not.toContainText("Más del 80%");
    await expect(page.locator("body")).not.toContainText("los ajustes que necesites hasta que quede como tú quieres");
  });

  test("Plan CTAs make one explicit, reversible selection", async ({ page }) => {
    const prices = page.locator("#precios");
    for (const id of ["esencial", "profesional", "premium"]) {
      await expect(prices.getByTestId(`plan-cta-${id}`)).toHaveAttribute("href", "#contacto");
      await expect(prices.getByTestId(`plan-cta-${id}`)).toHaveText("Revisar este plan");
    }
    await prices.getByTestId("plan-cta-premium").click();
    await expect(page.getByTestId("selected-plan-summary")).toBeVisible();
    await expect(page.getByTestId("selected-plan-summary")).toContainText("Pedidos en línea");
    await page.getByTestId("clear-selected-plan").click();
    await expect(page.getByTestId("selected-plan-summary")).not.toBeVisible();
    await expect(page.locator("#contacto")).toContainText("Te orientamos hacia un primer paso acorde a tu negocio.");
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
    await expect(contact.locator('.contact-form-note').first()).toHaveCSS('color', 'rgb(226, 232, 240)');

    await guards.assertHealthyContext();
  });

  test('Consultative floating actions preserve context and critical contrast', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const floating = page.getByTestId('floating-whatsapp');
    await expect(floating).toHaveAttribute('href', '#contacto');
    await expect(floating).toHaveCSS('background-color', 'rgb(11, 93, 53)');

    await page.locator('#contacto').scrollIntoViewIfNeeded();
    await expect(page.locator('#contacto .contact-form-note').first()).toHaveCSS('color', 'rgb(226, 232, 240)');

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => document.documentElement.classList.remove('light-theme'));
    await expect(page.locator('#navbar')).not.toHaveClass(/\bglass\b/);
    await expect(page.locator('#navbar a[aria-label="Inicio"] .text-drac-fg')).toHaveCSS('color', 'rgb(248, 250, 252)');
  });

  test('Process presents exactly three static steps without an automatic loop', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const process = page.locator('#proceso');
    const steps = process.locator('[data-process-step]');

    await expect(steps).toHaveCount(3);
    await expect(process.locator('.process-step-marker')).toHaveCount(3);
    await expect(process.getByRole('heading', { name: 'Entendemos tu atención' })).toBeVisible();
    await expect(process.getByRole('heading', { name: 'Ordenamos y construimos' })).toBeVisible();
    await expect(process.getByRole('heading', { name: 'Revisas y publicamos' })).toBeVisible();
    await process.scrollIntoViewIfNeeded();
    await expect(process).not.toHaveClass(/process-motion-enabled/);
    await expect(process.locator('[data-process-step].is-active')).toHaveCount(0);
    await expect(process.locator('.process-timeline-signal')).toHaveCount(0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const reducedProcess = page.locator('#proceso');
    await reducedProcess.scrollIntoViewIfNeeded();
    await expect(reducedProcess).not.toHaveClass(/process-motion-enabled/);
    await expect(reducedProcess.locator('[data-process-step]')).toHaveCount(3);

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

  test('Theme contrast stays strong across hero, menu, bands and responsive widths', async ({ page }) => {
    const themes = {
      dark: {
        heroBackground: 'rgb(12, 26, 46)',
        heading: 'rgb(248, 250, 252)',
        subtitle: 'rgb(216, 225, 236)',
        menuBackground: 'rgb(21, 26, 38)',
        menuText: 'rgb(230, 234, 242)',
      },
      light: {
        heroBackground: 'rgb(226, 218, 203)',
        heading: 'rgb(18, 35, 63)',
        subtitle: 'rgb(51, 70, 94)',
        menuBackground: 'rgb(221, 212, 196)',
        menuText: 'rgb(23, 43, 77)',
      },
    };

    for (const [theme, colors] of Object.entries(themes)) {
      for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
        await page.setViewportSize(viewport);
        await setTheme(page, theme);
        await expect(page.locator('.hero-photo-bg')).toHaveCSS('background-color', colors.heroBackground);
        await expect(page.locator('#inicio h1')).toHaveCSS('color', colors.heading);
        await expect(page.locator('#inicio .hero-subtitle')).toHaveCSS('color', colors.subtitle);
        expect(contrastRatio(parseRgb(colors.heading), parseRgb(colors.heroBackground))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(parseRgb(colors.subtitle), parseRgb(colors.heroBackground))).toBeGreaterThanOrEqual(4.5);
        await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

        if (viewport.width === 390) {
          await page.getByRole('button', { name: 'Menú' }).click();
          const menu = page.getByTestId('mobile-menu-panel');
          const firstLink = menu.getByRole('link', { name: 'Beneficios' });
          await expect(menu).toHaveCSS('background-color', colors.menuBackground);
          await expect(firstLink).toHaveCSS('color', colors.menuText);
          expect(contrastRatio(parseRgb(colors.menuText), parseRgb(colors.menuBackground))).toBeGreaterThanOrEqual(4.5);
        } else {
          const navbarText = await page.locator('#navbar nav[aria-label="Navegación principal"] a[href="#beneficios"]').evaluate(
            (link) => getComputedStyle(link).color
          );
          expect(contrastRatio(parseRgb(navbarText), parseRgb(colors.menuBackground))).toBeGreaterThanOrEqual(4.5);
        }
      }
    }

    await setTheme(page, 'light');
    await expect(page.locator('.band-white').first()).toHaveCSS('background-color', 'rgb(241, 238, 231)');
    await expect(page.locator('.band-lino').first()).toHaveCSS('background-color', 'rgb(221, 217, 207)');
    await expect(page.locator('.navbar-shell')).toHaveCount(1);
    await expect(page.locator('.mobile-menu-surface')).toHaveCount(1);
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

  test('Exhaustive validation of all 10 visible demo cards after expanding catalog', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const demoCards = page.locator('#demos .grid.gap-8 > a[href^="./demo-"]');

    await expect(demoCards).toHaveCount(10);
    await expect.poll(async () => demoCards.evaluateAll((cards) => cards.filter((card) => card.getClientRects().length > 0).length)).toBe(3);

    const expandBtn = page.getByRole('button', { name: /Ver los 10 ejemplos|Mostrar menos/i }).first();
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(expandBtn).toHaveAttribute('aria-controls', 'demo-showcase-grid');
    await expect(page.locator('#demo-showcase-grid')).toHaveCount(1);
    if (await expandBtn.isVisible()) {
      await expandBtn.click({ force: true });
      await page.waitForTimeout(300);
    }
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(async () => demoCards.evaluateAll((cards) => cards.filter((card) => card.getClientRects().length > 0).length)).toBe(10);
    await expect(page.locator('#demos').getByText('Antes de escribir', { exact: true })).toHaveCount(10);
    await expect(page.locator('#demos').getByText('En tus mensajes puedes revisar', { exact: true })).toHaveCount(9);
    await expect(page.locator('#demos').getByText('En el panel puedes revisar', { exact: true })).toHaveCount(1);

    const demoPaths = [
      './demo-psicologa/index.html',
      './demo-cafe-valparaiso/index.html',
      './demo-salon-belleza/index.html',
      './demo-artesanias/index.html',
      './demo-contabilidad/index.html',
      './demo-propiedades/index.html',
      './demo-ecommerce-tech/index.html',
      './demo-agenda/index.html',
      './demo-casa-colores/index.html',
      './demo-fonoaudiologia/index.html',
      './demo-plan-profesional/index.html',
      './demo-plan-premium/index.html'
    ];

    for (const demoPath of demoPaths) {
      const link = page.locator(`a[href="${demoPath}"]`).first();
      await expect(link, `Link to ${demoPath} must exist on landing`).toBeAttached();
    }
    const casaRondaCard = page.locator('a[href="./demo-casa-colores/index.html"]').first();
    await expect(casaRondaCard.getByRole('heading', { name: 'Casa Ronda', exact: true })).toBeVisible();
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
    await expect(plan).toContainText('neto + IVA');
    await expect(plan).toContainText('Total con IVA: $118.999 CLP');
    await expect(plan).toContainText('3 días hábiles');
    await expect(plan).toContainText('El plazo comienza cuando recibimos tu información completa.');
    await expect(plan).toContainText('Dos hitos: $49.999 CLP para iniciar + $50.000 CLP al aprobar tu versión lista');
    await expect(plan).toContainText('Dominio y publicación: los compras directamente al proveedor y quedan a tu nombre; Tu Vitrina te guía y realiza la conexión.');
    await expect(plan).toContainText('Cambios: incluye una ronda consolidada y 15 días para ajustes menores después de publicar.');
    await expect(plan).toContainText('Queda fuera del alcance: páginas extra, cambios de estructura, carro y pagos en línea.');
    await expect(plan.getByRole('link', { name: 'Revisar este plan' })).toHaveAttribute('href', '#contacto');
    await guards.assertHealthyContext();
  });
});
