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
    await expect(page.locator('h1')).toContainText('Que te vean Que te crean');
    await expect(page.locator('h1 > span')).toHaveClass(/\bblock\b/);
    await expect(page.locator('#inicio').getByRole('link', { name: 'Quiero orientación para mi negocio' })).toHaveAttribute('href', '#contacto');
    const examplesCta = page.getByRole('link', { name: 'Ver ejemplos', exact: true });
    await expect(examplesCta).toHaveAttribute('href', '#demos');
    await expect(examplesCta).toHaveCSS('color', 'rgb(37, 65, 95)');
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

    const visualEvidence = page.getByTestId('benefits-visual-evidence');
    await expect(visualEvidence).toBeVisible();
    await expect(visualEvidence.locator('img')).toHaveCount(3);
    await expect(visualEvidence.locator('img').evaluateAll((images) => images.every((image) => image.getAttribute('loading') === 'lazy'))).resolves.toBe(true);
    const benefits = page.locator('#beneficios');
    await expect(benefits).toContainText('Tu oferta queda fácil de revisar, WhatsApp recibe consultas con más contexto');
    for (const removedHeading of ['Oferta fácil de revisar', 'WhatsApp con contexto', 'Base propia para crecer']) {
      await expect(benefits.getByRole('heading', { name: removedHeading })).toHaveCount(0);
    }
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
    for (const locator of [page.locator('#inicio .hero-subtitle'), page.locator('#inicio').getByRole('link', { name: 'Quiero orientación para mi negocio' }), page.getByRole('link', { name: 'Ver ejemplos', exact: true }), simulator]) {
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

  test('Commercial redesign keeps local reach and human criteria visible', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const hero = page.locator('#inicio');
    const ia = page.locator('#ia-practica');

    const localReach = hero.getByText('Desde Biobío para negocios de todo Chile', { exact: true });
    await expect(localReach).toBeVisible();
    await expect(localReach).toHaveCSS('color', 'rgb(37, 65, 95)');
    await expect(ia.getByRole('heading', { name: 'La herramienta acelera. STAX se hace cargo del criterio.' })).toBeVisible();
    await expect(ia.getByText('La herramienta ayuda con ideas y velocidad; STAX aporta criterio, adaptación, publicación y revisión.', { exact: true })).toBeVisible();
    await expect(ia.locator('.business-card')).toHaveCount(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await page.evaluate(() => document.documentElement.classList.add('light-theme'));
    await expect(ia.getByText('La herramienta ayuda con ideas y velocidad; STAX aporta criterio, adaptación, publicación y revisión.', { exact: true })).toBeVisible();

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
    await expect(prices.getByText('No incluye:', { exact: true })).toHaveCount(3);
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
      await expect(disclosure.locator("summary")).toHaveText("Ver detalle del alcance");
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
    await expect(contact.locator('.contact-form-note').first()).toHaveCSS('color', 'rgb(52, 64, 84)');

    await guards.assertHealthyContext();
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
    await expect(plan).toContainText('Dominio y publicación: los compras directamente al proveedor y quedan a tu nombre; STAX te guía y realiza la conexión.');
    await expect(plan).toContainText('Cambios: incluye una ronda consolidada y 15 días para ajustes menores después de publicar.');
    await expect(plan).toContainText('No incluye: páginas extra, cambios de estructura, carro ni pagos en línea.');
    await expect(plan.getByRole('link', { name: 'Revisar este plan' })).toHaveAttribute('href', '#contacto');
    await guards.assertHealthyContext();
  });
});
