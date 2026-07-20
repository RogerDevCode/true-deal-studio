# Plan Vitrina Express Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el plan de entrada “Oferta clara” por Plan Vitrina Express, una oferta de $99.999 CLP con alcance cerrado y señales explícitas de bajo riesgo.

**Architecture:** El cambio se concentra en la primera tarjeta de `#precios`, sus textos de contexto, dos FAQ y el contrato de conversión que usa `getMostViewedPlan()` en el formulario Alpine. Las pruebas Playwright verifican el contenido visible y que el formulario sigue preparando un mensaje de WhatsApp con el nuevo nombre del plan.

**Tech Stack:** HTML estático, Tailwind CSS compilado local, Alpine.js local, Node.js 22, Playwright.

## Global Constraints

- Mantener compatibilidad `file://`, recursos locales, un único `h1`, SEO existente, foco visible y `prefers-reduced-motion`.
- No añadir dependencias, CDN, servicios externos ni modificar demos.
- Dominio, contenido y accesos quedan a nombre del cliente; no prometer que un plan gratuito de hosting sea permanente.
- El plazo de 3 días hábiles debe aparecer condicionado a la entrega de formulario, textos, fotos y datos completos.
- No prometer ventas, conversiones, disponibilidad ilimitada ni cobrar pagos en línea en este plan.
- Mantener el comportamiento actual de WhatsApp y las rutas relativas.

---

## File Structure

- Modify: `index.html` — tarjeta inicial de `#precios`, FAQ de costos/dominio y texto de conversión asociado al plan.
- Modify: `tests/landing-exhaustive.spec.js` — contrato de contenido y alcance visible del Plan Vitrina Express.
- Modify: `tests/whatsapp-submit.spec.js` — contrato del mensaje de WhatsApp para la landing.

### Task 1: Define the commercial contract in tests

**Files:**
- Modify: `tests/landing-exhaustive.spec.js:222-233`
- Modify: `tests/whatsapp-submit.spec.js:1-106`

**Consumes:** La sección existente `#precios`, el primer plan y el formulario `#contacto`.

**Produces:** Dos contratos de regresión: contenido comercial visible y texto de WhatsApp con “Plan Vitrina Express”.

- [ ] **Step 1: Add the failing pricing contract**

  Añadir antes de la prueba actual de tooltips:

  ```js
  test('Plan Vitrina Express states a closed low-risk scope', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const pricing = page.locator('#precios');
    const plan = pricing.getByText('Plan Vitrina Express', { exact: true }).locator('..').locator('..');

    await expect(pricing.getByText('Plan Vitrina Express', { exact: true })).toBeVisible();
    await expect(pricing.getByText('$99.999', { exact: true })).toBeVisible();
    await expect(plan).toContainText('3 días hábiles');
    await expect(plan).toContainText('El plazo comienza cuando recibimos tu información completa.');
    await expect(plan).toContainText('Tu dominio queda a tu nombre');
    await expect(plan).toContainText('Una ronda consolidada de cambios');
    await expect(plan).toContainText('No incluye: páginas extra, cambios de estructura, carro ni pagos en línea.');
    await expect(plan.getByRole('link', { name: 'Quiero mi vitrina en 3 días' })).toHaveAttribute('href', '#contacto');
    await guards.assertHealthyContext();
  });
  ```

- [ ] **Step 2: Run the pricing contract and confirm failure**

  Run: `npx playwright test tests/landing-exhaustive.spec.js --grep "Plan Vitrina Express"`

  Expected: FAIL because the current page still exposes “Oferta clara”.

- [ ] **Step 3: Add the failing landing-form WhatsApp contract**

  Add this case at the end of `tests/whatsapp-submit.spec.js`:

  ```js
  test('Landing contact form names Plan Vitrina Express in WhatsApp', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await installWindowOpenProbe(page);
    const guards = await attachPageGuards(page);

    await page.goto('/index.html');
    await waitForAlpine(page);
    await page.locator('#form-nombre').fill('PYME QA');
    await page.locator('#form-negocio').fill('Taller QA');
    await page.locator('#form-telefono').fill('+56911112222');
    await page.locator('#form-mensaje').fill('Valores y horarios');
    await page.getByRole('button', { name: 'Quiero mi vitrina en 3 días' }).click();

    await expectWhatsAppOpen(page, ['PYME QA', 'Plan Vitrina Express', 'Valores y horarios']);
    await guards.assertHealthyContext();
    await context.close();
  });
  ```

- [ ] **Step 4: Run the form contract and confirm failure**

  Run: `npx playwright test tests/whatsapp-submit.spec.js --grep "Plan Vitrina Express"`

  Expected: FAIL because the current CTA and plan name are still the previous offer.

- [ ] **Step 5: Commit the red tests**

  ```bash
  git add tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js
  git commit -m "test: define Vitrina Express offer contracts"
  ```

### Task 2: Replace the first pricing card with the closed offer

**Files:**
- Modify: `index.html:2004-2128`
- Test: `tests/landing-exhaustive.spec.js`

**Consumes:** The test strings from Task 1 and the existing Alpine hover names `esencial`.

**Produces:** A first pricing card whose name, price, scope and CTA match the approved offer. `esencial` remains unchanged so `getMostViewedPlan()` keeps resolving the first card.

- [ ] **Step 1: Replace only the first card copy**

  Keep the outer card, hover handlers and existing local SVG icons. Replace its commercial content with this visible hierarchy:

  ```html
  <p class="text-sm font-bold uppercase tracking-[0.2em] text-chile-blueLight">Plan Vitrina Express</p>
  <p class="mt-4 font-display text-4xl font-black text-drac-fg">$99.999<span class="text-base font-medium text-drac-comment"> CLP</span></p>
  <p class="mt-2 text-sm font-bold text-drac-green">Pago único · sin pagos mensuales de STAX</p>
  <p class="mt-1 text-sm text-drac-comment">Tu negocio claro y listo para compartir en 3 días hábiles.</p>
  <div class="mt-5 rounded-2xl border border-drac-current/20 bg-drac-current/15 p-4 text-sm leading-relaxed text-drac-comment">
    <p><strong class="text-drac-fg">Para empezar necesitas:</strong> formulario, textos base, fotos y datos completos para conectar tu dominio.</p>
    <p class="mt-2 font-semibold text-drac-fg">El plazo comienza cuando recibimos tu información completa.</p>
    <p class="mt-2"><strong class="text-drac-fg">No incluye:</strong> páginas extra, cambios de estructura, carro ni pagos en línea.</p>
  </div>
  ```

  Replace the long tooltip list with six direct list items: página única; línea visual predefinida; servicios/productos simples, FAQ y WhatsApp; guía de compra de dominio y conexión DNS; una ronda consolidada de cambios; dominio, contenidos y accesos del cliente. Add a separate final text line: `Sección adicional desde $30.000 CLP. Otros adicionales se cotizan antes de avanzar.`

- [ ] **Step 2: Set the first-card CTA**

  Replace its link label while retaining its target and styling:

  ```html
  <a href="#contacto" class="btn-glow flex w-full items-center justify-center rounded-2xl border border-chile-blue/30 bg-chile-blue/10 px-5 py-3.5 text-sm font-bold text-chile-blueLight transition-all duration-300 hover:bg-chile-blue/20">Quiero mi vitrina en 3 días</a>
  ```

- [ ] **Step 3: Run the pricing contract**

  Run: `npx playwright test tests/landing-exhaustive.spec.js --grep "Plan Vitrina Express"`

  Expected: PASS.

- [ ] **Step 4: Commit the pricing card**

  ```bash
  git add index.html tests/landing-exhaustive.spec.js
  git commit -m "feat: introduce Vitrina Express plan"
  ```

### Task 3: Align trust copy, FAQ and WhatsApp conversion

**Files:**
- Modify: `index.html:1980-1982,2490-2552,2691-2751,3012-3016`
- Test: `tests/whatsapp-submit.spec.js`

**Consumes:** The visible offer of Task 2 and `getMostViewedPlan()`.

**Produces:** A consistent message about price, delivery condition, ownership and the form/WhatsApp handoff.

- [ ] **Step 1: Make the pricing introduction distinguish plan-specific timing**

  Replace the general timing sentence with:

  ```html
  <p class="mt-4 text-sm font-medium leading-relaxed text-drac-fg">Antes de iniciar definimos valor, alcance, accesos y propiedad. El Plan Vitrina Express se publica en hasta 3 días hábiles desde que recibimos el material completo; los planes de mayor alcance se cotizan con su propio plazo.</p>
  ```

- [ ] **Step 2: Replace the two FAQ answers that affect buyer risk**

  Use the following text for FAQ 1:

  ```html
  <p class="text-sm leading-relaxed text-drac-comment">El Plan Vitrina Express se publica sin costo mensual de alojamiento de STAX mientras el proveedor elegido mantenga su plan gratuito. El dominio propio se paga directamente en NIC Chile y sus renovaciones o servicios externos se revisan contigo antes de contratar.</p>
  ```

  Keep the existing NIC Chile ownership answer, but append: `STAX no registra tu dominio a su nombre.`

- [ ] **Step 3: Align the contact form copy**

  Change only the visible submit label to `Quiero mi vitrina en 3 días`. In both template literals used by the form, replace `Quiero ordenar mi oferta antes de WhatsApp y revisar el Plan ${plan}.` with `Quiero revisar el Plan ${plan}. Entiendo que el plazo comienza cuando entregue mi información completa.` Update the plan map so its first entry is `esencial: 'Vitrina Express'`. Do not change form field IDs, validation, `window.openWhatsAppWithFallback`, fallback URL, or the phone number.

- [ ] **Step 4: Run the WhatsApp contract**

  Run: `npx playwright test tests/whatsapp-submit.spec.js --grep "Plan Vitrina Express"`

  Expected: PASS.

- [ ] **Step 5: Commit the trust and conversion changes**

  ```bash
  git add index.html tests/whatsapp-submit.spec.js
  git commit -m "feat: clarify Vitrina Express ownership and handoff"
  ```

### Task 4: Validate both themes and release safely

**Files:**
- Modify: `tests/landing-exhaustive.spec.js` only if selectors need a stable, user-facing locator; otherwise no code change.

**Consumes:** All previous tasks.

**Produces:** Verified offline and deployed offer with no broken links, forms or contrast regressions.

- [ ] **Step 1: Run the focused suite**

  Run: `npm run test_root && npx playwright test tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js`

  Expected: all tests PASS.

- [ ] **Step 2: Run the release gate**

  Run: `npm run qa:gate`

  Expected: final output contains `PASS`.

- [ ] **Step 3: Inspect desktop and mobile under both themes**

  In Playwright, load `/index.html`, visit `#precios`, capture a 1440px view and a 390px view, toggle `document.documentElement.classList` to each theme, and verify that the $99.999 price, CTA, deadline condition and exclusions are readable without horizontal overflow.

- [ ] **Step 4: Commit any required test-only adjustment**

  ```bash
  git add tests/landing-exhaustive.spec.js
  git commit -m "test: cover Vitrina Express release checks"
  ```

- [ ] **Step 5: Publish**

  ```bash
  git push origin main
  ```

  Expected: Vercel starts the Git deployment. After it completes, validate `https://true-deal-studio.vercel.app/` with a cache-busting query and repeat the visible pricing checks from Step 3.

## Plan Self-Review

- **Spec coverage:** Task 2 covers name, price, one-page scope, visual choice, content, FAQ, WhatsApp, DNS guidance, changes, ownership and additional section price. Task 3 covers timing condition, hosting caveat, domain ownership and conversion. Task 4 covers offline, accessibility-adjacent visual checks and the release gate.
- **No placeholders:** The plan uses exact file paths, strings, commands and expected outcomes; it contains no deferred implementation markers.
- **Consistency:** The first-card hover key remains `esencial` and its mapped label changes to `Vitrina Express`, so both WhatsApp paths identify the new offer.
