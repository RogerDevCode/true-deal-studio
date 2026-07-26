# STAX Consultative Plans and WhatsApp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make plan selection explicit, accessible and reversible; produce a faithful consultative WhatsApp message; reduce mobile decision effort; and close the accessibility, contrast and copy gaps found in the July 26 audit.

**Architecture:** Keep the static single-file landing and local Alpine.js runtime. Move plan identity and WhatsApp-message construction into the existing root `landingApp()` state, let the contact form consume that shared state, replace hover-only disclosures with native `<details>`, and simplify existing sections without adding routes or dependencies.

**Tech Stack:** Static HTML, local compiled Tailwind CSS, local Alpine.js, Node.js `>=22 <23`, Playwright, Chrome Headless.

## Global Constraints

- Keep `lang="es-CL"`, one `<h1>`, logical headings, current Open Graph/Twitter/JSON-LD coverage and local assets.
- Preserve `file://` navigation with explicit `./demo-name/index.html` and `../index.html` paths.
- Do not add CDN resources, remote fonts, dependencies, external services, credentials or domain changes.
- Preserve the current `wa.me` destination and `window.openWhatsAppWithFallback` behavior.
- Use Spanish that is direct, affirmative, consultative and based on observable actions; do not promise sales.
- Treat AI as support; keep human criteria, adaptation, publication and ownership visible.
- Keep focus visible, touch targets at least 44 px, body/placeholder contrast at least 4.5:1 and large-text contrast at least 3:1.
- Preserve `prefers-reduced-motion`; reserve `!important` for `[x-cloak]` and reduced-motion rules.
- Do not modify demos or `voiceshop-pro.zip`.
- Do not publish or push to a remote without explicit user authorization.

---

## File Structure

- Modify: `index.html` — root Alpine state, plan cards, contact form, accessible disclosures, menu/floating CTA, copy, responsive density and contrast.
- Modify: `tests/landing-exhaustive.spec.js` — explicit plan state, accessible pricing, menu/floating CTA, mobile distance and copy contracts.
- Modify: `tests/whatsapp-submit.spec.js` — neutral and selected-plan messages, validation, editing and reset behavior.
- Modify: `tests/root.spec.js` — public route/catalog regression only if visible section order changes require an updated assertion; demo paths remain unchanged.
- Reference: `docs/superpowers/specs/2026-07-26-stax-flujo-consultivo-whatsapp-design.md` — approved behavior and acceptance criteria.

### Task 1: Define the explicit plan and WhatsApp contracts

**Files:**
- Modify: `tests/whatsapp-submit.spec.js:118-135`
- Modify: `tests/landing-exhaustive.spec.js:107-135,257-286`

**Interfaces:**
- Consumes: current `#precios`, `#contacto`, `#form-*` fields and `window.__lastOpenedUrl` probe.
- Produces: stable test IDs `plan-cta-esencial`, `plan-cta-profesional`, `plan-cta-premium`, `selected-plan-summary`, `clear-selected-plan`, `edit-contact-form`, `reset-contact-form`; accessible button name `Preparar mi consulta por WhatsApp`.

- [ ] **Step 1: Replace the current landing WhatsApp test with neutral and selected-plan red tests**

  Add this helper after `expectWhatsAppOpen`:

  ```js
  async function fillLandingContact(page, overrides = {}) {
    const data = {
      name: "PYME QA",
      business: "Taller QA",
      phone: "+56 9 1111 2222",
      details: "Valores y horarios",
      ...overrides,
    };
    await page.locator("#form-nombre").fill(data.name);
    await page.locator("#form-negocio").fill(data.business);
    await page.locator("#form-telefono").fill(data.phone);
    await page.locator("#form-mensaje").fill(data.details);
  }
  ```

  Replace the test at lines 118–135 with these tests:

  ```js
  test("Landing prepares a neutral consultative WhatsApp message", async ({ page }) => {
    await installWindowOpenProbe(page);
    const guards = await attachPageGuards(page);
    await page.goto("/index.html#contacto");
    await waitForAlpine(page);
    await fillLandingContact(page);
    await page.getByRole("button", { name: "Preparar mi consulta por WhatsApp" }).click();
    await expectWhatsAppOpen(page, ["PYME QA", "Taller QA", "orientación", "Valores y horarios"]);
    expect(decodeURIComponent(await page.evaluate(() => window.__lastOpenedUrl))).not.toContain("Plan Vitrina Express");
    await guards.assertHealthyContext();
  });

  for (const plan of [
    ["esencial", "Plan Vitrina Express"],
    ["profesional", "Atención ordenada"],
    ["premium", "Pedidos en línea"],
  ]) {
    test(`Landing sends the explicitly selected ${plan[1]} plan`, async ({ page }) => {
      await installWindowOpenProbe(page);
      const guards = await attachPageGuards(page);
      await page.goto("/index.html#precios");
      await waitForAlpine(page);
      await page.getByTestId(`plan-cta-${plan[0]}`).click();
      await expect(page.getByTestId("selected-plan-summary")).toContainText(plan[1]);
      await fillLandingContact(page);
      await page.getByRole("button", { name: "Preparar mi consulta por WhatsApp" }).click();
      await expectWhatsAppOpen(page, ["PYME QA", plan[1], "quiero revisar"]);
      await guards.assertHealthyContext();
    });
  }
  ```

- [ ] **Step 2: Add red recovery and phone-validation tests**

  Append:

  ```js
  test("Landing preserves data when editing and resets only on request", async ({ page }) => {
    await installWindowOpenProbe(page);
    await page.goto("/index.html#precios");
    await waitForAlpine(page);
    await page.getByTestId("plan-cta-profesional").click();
    await fillLandingContact(page);
    await page.getByRole("button", { name: "Preparar mi consulta por WhatsApp" }).click();
    await page.getByTestId("edit-contact-form").click();
    await expect(page.locator("#form-nombre")).toHaveValue("PYME QA");
    await expect(page.getByTestId("selected-plan-summary")).toContainText("Atención ordenada");
    await page.getByRole("button", { name: "Preparar mi consulta por WhatsApp" }).click();
    await page.getByTestId("reset-contact-form").click();
    await expect(page.locator("#form-nombre")).toHaveValue("");
    await expect(page.getByTestId("selected-plan-summary")).toHaveCount(0);
  });

  test("Landing explains how to correct an invalid Chilean WhatsApp number", async ({ page }) => {
    await installWindowOpenProbe(page);
    await page.goto("/index.html#contacto");
    await waitForAlpine(page);
    await fillLandingContact(page, { phone: "123" });
    await page.getByRole("button", { name: "Preparar mi consulta por WhatsApp" }).click();
    await expect(page.locator("#form-telefono-error")).toHaveText("Escribe un número chileno válido, por ejemplo +56 9 1234 5678.");
    await expect(page.locator("#form-telefono")).toHaveAttribute("aria-invalid", "true");
    expect(await page.evaluate(() => window.__lastOpenedUrl)).toBeNull();
  });
  ```

- [ ] **Step 3: Add red pricing-state tests**

  Add to `tests/landing-exhaustive.spec.js`:

  ```js
  test("Plan CTAs make one explicit, reversible selection", async ({ page }) => {
    const prices = page.locator("#precios");
    for (const id of ["esencial", "profesional", "premium"]) {
      await expect(prices.getByTestId(`plan-cta-${id}`)).toHaveAttribute("href", "#contacto");
      await expect(prices.getByTestId(`plan-cta-${id}`)).toHaveText("Revisar este plan");
    }
    await prices.getByTestId("plan-cta-premium").click();
    await expect(page.getByTestId("selected-plan-summary")).toContainText("Pedidos en línea");
    await page.getByTestId("clear-selected-plan").click();
    await expect(page.getByTestId("selected-plan-summary")).toHaveCount(0);
    await expect(page.locator("#contacto")).toContainText("Te orientamos hacia un primer paso acorde a tu negocio.");
  });
  ```

- [ ] **Step 4: Run the focused contracts and confirm failure**

  Run: `npx playwright test tests/whatsapp-submit.spec.js tests/landing-exhaustive.spec.js --grep "neutral consultative|explicitly selected|preserves data|invalid Chilean|explicit, reversible"`

  Expected: FAIL because the new test IDs, explicit state, neutral message, validation and recovery actions do not exist.

- [ ] **Step 5: Commit the red contracts**

  ```bash
  git add tests/whatsapp-submit.spec.js tests/landing-exhaustive.spec.js
  git commit -m "test: define consultative plan and WhatsApp flow"
  ```

### Task 2: Implement shared plan state and resilient contact flow

**Files:**
- Modify: `index.html:2094-2531,2745-2862,3075-3133`
- Test: `tests/whatsapp-submit.spec.js`
- Test: `tests/landing-exhaustive.spec.js`

**Interfaces:**
- Consumes: plan IDs `esencial | profesional | premium`, `window.openWhatsAppWithFallback(url)` and existing `wa.me/56999040515` destination.
- Produces: `selectPlan(planId)`, `clearSelectedPlan()`, `getSelectedPlan()`, `buildWhatsAppMessage(payload)`, `resetContactFlow(formState)` on the root Alpine object.

- [ ] **Step 1: Replace hover-derived plan state in `landingApp()`**

  Remove `activePlan`, `hoverStart`, `planTimes`, `startPlanHover`, `endPlanHover` and `getMostViewedPlan`. Add:

  ```js
  selectedPlan: null,
  planOptions: {
    esencial: {
      label: 'Plan Vitrina Express',
      price: '$99.999 CLP neto + IVA',
      summary: 'Una página de alcance cerrado para mostrar tu oferta y orientar consultas.'
    },
    profesional: {
      label: 'Atención ordenada',
      price: 'Desde $249.990 CLP neto + IVA',
      summary: 'Catálogo, reservas o cotización para ordenar más consultas.'
    },
    premium: {
      label: 'Pedidos en línea',
      price: 'Desde $449.990 CLP neto + IVA',
      summary: 'Venta en línea para una operación preparada para cobrar y entregar.'
    }
  },
  selectPlan(planId) {
    if (!Object.prototype.hasOwnProperty.call(this.planOptions, planId)) return;
    this.selectedPlan = planId;
  },
  clearSelectedPlan() {
    this.selectedPlan = null;
  },
  getSelectedPlan() {
    return this.selectedPlan ? this.planOptions[this.selectedPlan] : null;
  },
  buildWhatsAppMessage({ name, business, phone, details }) {
    const plan = this.getSelectedPlan();
    const parts = [
      `Hola, mi nombre es ${name.trim()} y tengo un negocio de ${business.trim()}.`,
      plan
        ? `Quiero revisar ${plan.label} y confirmar si se ajusta a mi negocio.`
        : 'Quiero orientación para ordenar la información de mi negocio antes de conversar por WhatsApp.',
    ];
    if (phone.trim()) parts.push(`Mi WhatsApp es ${phone.trim()}.`);
    if (details.trim()) parts.push(`Hoy explico con frecuencia: ${details.trim()}.`);
    return parts.join(' ');
  },
  ```

- [ ] **Step 2: Make all plan CTA clicks explicit**

  Remove the three card `@mouseenter`/`@mouseleave` handlers. On each CTA retain `href="#contacto"`, add the corresponding `@click="selectPlan('<id>')"`, add `data-testid="plan-cta-<id>"`, and replace its visible label with `Revisar este plan`.

- [ ] **Step 3: Bind the contact form to root state and add exact recovery methods**

  Replace the form `x-data` object with:

  ```html
  x-data="{
    formNombre: '',
    formNegocio: '',
    formTelefono: '',
    formMensaje: '',
    telefonoError: '',
    sent: false,
    preparedUrl: '',
    phoneIsValid() {
      const compact = this.formTelefono.replace(/[\s()-]/g, '');
      return compact === '' || /^(?:\+?56)?9\d{8}$/.test(compact);
    },
    handleSubmit() {
      this.telefonoError = this.phoneIsValid() ? '' : 'Escribe un número chileno válido, por ejemplo +56 9 1234 5678.';
      if (this.telefonoError) {
        this.$nextTick(() => this.$refs.telefono.focus());
        return;
      }
      const text = this.buildWhatsAppMessage({
        name: this.formNombre,
        business: this.formNegocio,
        phone: this.formTelefono,
        details: this.formMensaje
      });
      this.preparedUrl = `https://wa.me/56999040515?text=${encodeURIComponent(text)}`;
      const opened = window.openWhatsAppWithFallback
        ? window.openWhatsAppWithFallback(this.preparedUrl)
        : !!window.open(this.preparedUrl, '_blank');
      if (opened) this.sent = true;
    },
    editForm() {
      this.sent = false;
      this.$nextTick(() => this.$refs.nombre.focus());
    },
    resetForm() {
      this.formNombre = '';
      this.formNegocio = '';
      this.formTelefono = '';
      this.formMensaje = '';
      this.telefonoError = '';
      this.preparedUrl = '';
      this.sent = false;
      this.clearSelectedPlan();
      this.$nextTick(() => this.$refs.nombre.focus());
    }
  }"
  ```

  Alpine resolves `buildWhatsAppMessage()` and `clearSelectedPlan()` through the parent `landingApp()` scope; do not duplicate plan data in the form.

- [ ] **Step 4: Add the plan summary and accessible field constraints**

  Insert before the fields:

  ```html
  <div x-show="getSelectedPlan()" x-cloak data-testid="selected-plan-summary" class="mb-6 rounded-2xl bg-drac-current/20 p-4">
    <p class="text-sm font-bold text-drac-fg" x-text="getSelectedPlan()?.label"></p>
    <p class="mt-1 text-sm text-drac-comment" x-text="getSelectedPlan()?.price"></p>
    <p class="mt-2 text-sm leading-relaxed text-drac-comment" x-text="getSelectedPlan()?.summary"></p>
    <button type="button" data-testid="clear-selected-plan" @click="clearSelectedPlan()" class="mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-chile-blueLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chile-blue">Cambiar plan</button>
  </div>
  <p x-show="!getSelectedPlan()" class="mb-6 text-sm leading-relaxed text-drac-comment">Te orientamos hacia un primer paso acorde a tu negocio.</p>
  ```

  Set `maxlength="80" autocomplete="name" x-ref="nombre"` on name, `maxlength="120" autocomplete="organization"` on business, and `maxlength="500"` on details. Set `x-ref="telefono" autocomplete="tel" :aria-invalid="telefonoError ? 'true' : 'false'" aria-describedby="form-telefono-hint form-telefono-error"` on phone. Add the visible hint and this error:

  ```html
  <p id="form-telefono-hint" class="mt-2 text-sm text-drac-comment">Opcional. Puedes escribirlo con o sin +56.</p>
  <p id="form-telefono-error" x-show="telefonoError" x-text="telefonoError" role="alert" class="mt-2 text-sm font-semibold text-red-300"></p>
  ```

- [ ] **Step 5: Replace submit and success actions**

  Change submit text to `Preparar mi consulta por WhatsApp`. Bind the final link to `:href="preparedUrl"` and label it `Ir a WhatsApp`. Add:

  ```html
  <button type="button" data-testid="edit-contact-form" @click="editForm()" class="mt-4 min-h-11 rounded-xl px-4 text-sm font-semibold text-drac-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chile-blue">Editar información</button>
  <button type="button" data-testid="reset-contact-form" @click="resetForm()" class="mt-2 min-h-11 rounded-xl px-4 text-sm font-semibold text-drac-comment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chile-blue">Empezar de nuevo</button>
  ```

- [ ] **Step 6: Run Task 1 contracts**

  Run: `npx playwright test tests/whatsapp-submit.spec.js tests/landing-exhaustive.spec.js --grep "neutral consultative|explicitly selected|preserves data|invalid Chilean|explicit, reversible"`

  Expected: all selected tests PASS.

- [ ] **Step 7: Commit the explicit flow**

  ```bash
  git add index.html tests/whatsapp-submit.spec.js tests/landing-exhaustive.spec.js
  git commit -m "feat: make plan selection explicit in WhatsApp flow"
  ```

### Task 3: Replace hover-only scope details and align commercial copy

**Files:**
- Modify: `index.html:1003-1005,1580-1600,1740,1880-1982,2094-2531`
- Modify: `tests/landing-exhaustive.spec.js:107-120,257-286`

**Interfaces:**
- Consumes: current three plan cards and approved plan names/prices.
- Produces: one native `details[data-plan-details]` per plan; identical CTA vocabulary; factual unsourced-stat replacements.

- [ ] **Step 1: Write the red disclosure and copy test**

  Add:

  ```js
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
  ```

- [ ] **Step 2: Run the disclosure test and confirm failure**

  Run: `npx playwright test tests/landing-exhaustive.spec.js --grep "available without hover"`

  Expected: FAIL because the three native disclosures do not exist and old claims remain.

- [ ] **Step 3: Replace each tooltip list with visible essentials plus native disclosure**

  Keep the first three decisive list items visible in each plan. Give each disclosure the same semantic shell:

  ```html
  <details data-plan-details class="mt-5 rounded-2xl bg-drac-current/15 p-4 text-sm text-drac-comment">
    <summary class="min-h-11 cursor-pointer rounded-lg py-3 font-bold text-drac-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chile-blue">Ver detalle del alcance</summary>
    <div class="mt-3 space-y-3 leading-relaxed"></div>
  </details>
  ```

  Populate the disclosure body with these exact paragraphs, using one `<p>` per line:

  **Vitrina Express**

  ```html
  <p><strong class="text-drac-fg">Material:</strong> tú entregas textos base, fotos, datos del negocio y el enlace de WhatsApp.</p>
  <p><strong class="text-drac-fg">Dominio y publicación:</strong> los compras directamente al proveedor y quedan a tu nombre; STAX te guía y realiza la conexión.</p>
  <p><strong class="text-drac-fg">Cambios:</strong> incluye una ronda consolidada y 15 días para ajustes menores después de publicar.</p>
  <p><strong class="text-drac-fg">No incluye:</strong> páginas extra, cambios de estructura, carro ni pagos en línea.</p>
  ```

  **Atención ordenada**

  ```html
  <p><strong class="text-drac-fg">Material:</strong> tú entregas productos o servicios, precios, condiciones, fotografías y reglas de atención.</p>
  <p><strong class="text-drac-fg">Operación:</strong> el catálogo, la reserva o la cotización preparan un resumen para continuar por WhatsApp; los pagos con tarjeta requieren una cuenta activa del proveedor elegido.</p>
  <p><strong class="text-drac-fg">Cambios y soporte:</strong> incluye hasta tres rondas de ajustes y un mes de soporte técnico después de publicar.</p>
  <p><strong class="text-drac-fg">Plazo:</strong> se acuerda antes de iniciar según catálogo, integraciones y material disponible.</p>
  ```

  **Pedidos en línea**

  ```html
  <p><strong class="text-drac-fg">Material y operación:</strong> requiere catálogo, precios, stock, medios de pago, despacho, cambios y devoluciones definidos.</p>
  <p><strong class="text-drac-fg">Servicios externos:</strong> la pasarela de pago, dominio y servicios asociados se contratan a nombre del negocio.</p>
  <p><strong class="text-drac-fg">Cambios y soporte:</strong> incluye las rondas acordadas y dos meses de soporte técnico después de publicar.</p>
  <p><strong class="text-drac-fg">Plazo:</strong> se cotiza antes de iniciar según cantidad de productos, reglas e integraciones.</p>
  ```

  Remove every `cursor-help`, tooltip-local `x-data`, `@mouseenter`, `@mouseleave` and `x-show="tooltip"` from the three plan cards.

- [ ] **Step 4: Normalize pricing and process copy**

  Use these exact replacements:

  - STAX strapline: `Claridad para mostrar. Contexto para conversar.`
  - Hero/nav CTA: `Quiero orientación para mi negocio`.
  - All plan CTA: `Revisar este plan`.
  - Process adjustment sentence: `Te muestro un borrador, reunimos tus observaciones y aplicamos las rondas de ajustes incluidas en el plan elegido.`
  - Mobile claim replacing “Más del 80%”: `La página se diseña primero para una lectura cómoda desde el celular y luego se adapta a pantallas mayores.`
  - Pricing evidence replacing “El público chileno responde mejor…”: `La decisión se vuelve más simple cuando la persona entiende qué ofreces, cómo atiendes y qué paso sigue.`

  Beside `$99.999 CLP`, add `neto + IVA` and a visible total `Total con IVA: $118.999 CLP` (99,999 × 1.19 rounded to the nearest peso). Keep “Desde” on the two variable-scope plans.

- [ ] **Step 5: Run the pricing and copy tests**

  Run: `npx playwright test tests/landing-exhaustive.spec.js --grep "Plans explain|available without hover|Plan Vitrina Express"`

  Expected: all selected tests PASS after updating the Vitrina CTA expectation to `Revisar este plan` and adding the total-with-IVA assertion.

- [ ] **Step 6: Commit accessible pricing and copy**

  ```bash
  git add index.html tests/landing-exhaustive.spec.js
  git commit -m "fix: expose plan scope across touch and keyboard"
  ```

### Task 4: Reduce mobile decision distance and prevent floating-CTA overlap

**Files:**
- Modify: `index.html:1255-1309,1540-2052,2929-2947,3000-3050`
- Modify: `tests/landing-exhaustive.spec.js:10-168`

**Interfaces:**
- Consumes: existing section IDs and navigation links.
- Produces: early `data-testid="starting-price-summary"`, mobile action `data-testid="floating-whatsapp"`, intersection-controlled class `is-context-hidden` on both responsive actions.

- [ ] **Step 1: Add red mobile-distance and floating-action tests**

  Add:

  ```js
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
  ```

- [ ] **Step 2: Run the mobile test and confirm failure**

  Run: `npx playwright test tests/landing-exhaustive.spec.js --grep "reach price context early"`

  Expected: FAIL because the early summary and contextual floating-action state do not exist.

- [ ] **Step 3: Add the early price summary directly after the hero**

  Insert a compact, non-card strip before `#necesidades`:

  ```html
  <aside data-testid="starting-price-summary" class="border-b border-drac-current/20 bg-drac-bg">
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <p class="text-lg font-black text-drac-fg">Una vitrina clara desde $99.999 CLP neto + IVA</p>
        <p class="mt-1 max-w-2xl text-sm leading-relaxed text-drac-comment">Alcance cerrado, publicación en hasta 3 días hábiles desde que recibimos tu material y dominio bajo tu control.</p>
      </div>
      <a href="#precios" class="inline-flex min-h-11 items-center font-bold text-chile-blueLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chile-blue">Revisar alcance y alternativas →</a>
    </div>
  </aside>
  ```

- [ ] **Step 4: Reduce repetition without removing public routes**

  Apply these exact structural reductions:

  - Keep four need cards: local, delivery, reservations and catalog. Move “Quieres cobrar en línea” text into the pricing introduction as the third-stage explanation.
  - In `#beneficios`, keep the main “Una vitrina que trabaja junto a ti” text and its three proof images; remove the separate three-card repetition for offer/WhatsApp/base-to-grow, folding those three sentences into one 65–75ch paragraph.
  - Reduce `#proceso` to three static steps: `Entendemos tu atención`, `Ordenamos y construimos`, `Revisas y publicamos`. Remove process-loop initialization and the fourth repeated completion card.
  - Reduce `#ia-practica` to its heading, explanatory paragraph and one compact line: `La herramienta ayuda con ideas y velocidad; STAX aporta criterio, adaptación, publicación y revisión.` Remove its four numbered cards.
  - Preserve `#necesidades`, `#demos`, `#beneficios`, `#proceso`, `#ia-practica`, `#precios`, `#faq` and `#contacto` IDs so navigation and deep links remain stable.

- [ ] **Step 5: Make the floating WhatsApp action contextual**

  Add `data-testid="floating-whatsapp"` to the mobile anchor at `index.html:2934`, and add `floating-whatsapp-action` to both the mobile and desktop anchor class lists. Add CSS:

  ```css
  .floating-whatsapp-action {
    bottom: calc(1rem + env(safe-area-inset-bottom));
    transition: opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
  }
  .floating-whatsapp-action.is-context-hidden {
    opacity: 0;
    transform: translateY(0.75rem);
    visibility: hidden;
    pointer-events: none;
  }
  ```

  Initialize one observer that updates both responsive anchors:

  ```js
  const floatingActions = [...document.querySelectorAll('.floating-whatsapp-action')];
  const competingSections = ['inicio', 'precios', 'contacto']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (floatingActions.length && competingSections.length && 'IntersectionObserver' in window) {
    const visibleSections = new Set();
    const floatingObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleSections.add(entry.target.id);
        else visibleSections.delete(entry.target.id);
      }
      floatingActions.forEach((action) => {
        action.classList.toggle('is-context-hidden', visibleSections.size > 0);
      });
    }, { threshold: 0.05 });
    competingSections.forEach((section) => floatingObserver.observe(section));
  }
  ```

- [ ] **Step 6: Run mobile, reduced-motion and navigation tests**

  Run: `npx playwright test tests/landing-exhaustive.spec.js --grep "reach price context early|Hero section|Process|Commercial redesign"`

  Expected: all selected tests PASS after replacing the old four-step loop assertions with three static-step assertions and verifying no `.process-motion-enabled` class is added.

- [ ] **Step 7: Commit the mobile decision path**

  ```bash
  git add index.html tests/landing-exhaustive.spec.js
  git commit -m "refactor: shorten STAX mobile decision path"
  ```

### Task 5: Complete keyboard, menu, link and contrast hardening

**Files:**
- Modify: `index.html:90-270,980-1071,1340-1528,2745-2947`
- Modify: `tests/landing-exhaustive.spec.js`

**Interfaces:**
- Consumes: current theme toggle, mobile-menu state and demo links.
- Produces: menu trigger ref `mobileMenuButton`, backdrop, Escape handler, focus return and accessible new-tab labels.

- [ ] **Step 1: Add red menu, link and text-size tests**

  Add:

  ```js
  test("Mobile menu returns focus and public actions keep readable text", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const menuButton = page.getByRole("button", { name: "Menú" });
    await menuButton.click();
    await expect(page.getByTestId("mobile-menu-backdrop")).toBeVisible();
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
  });
  ```

- [ ] **Step 2: Run the hardening test and confirm failure**

  Run: `npx playwright test tests/landing-exhaustive.spec.js --grep "returns focus and public actions"`

  Expected: FAIL because backdrop/focus return and all readable sizes are not implemented.

- [ ] **Step 3: Harden the mobile menu**

  On the menu button add `x-ref="mobileMenuButton"` and replace its click with `@click="mobileMenu = !mobileMenu"`. On the header root add:

  ```html
  @keydown.escape.window="if (mobileMenu) { mobileMenu = false; $nextTick(() => $refs.mobileMenuButton.focus()); }"
  ```

  Before the menu panel add:

  ```html
  <button type="button" data-testid="mobile-menu-backdrop" x-show="mobileMenu" x-cloak @click="mobileMenu = false; $nextTick(() => $refs.mobileMenuButton.focus())" aria-label="Cerrar menú" class="fixed inset-0 top-[72px] z-[-1] bg-slate-950/45 lg:hidden"></button>
  ```

  Add `@click="mobileMenu=false; $nextTick(() => $refs.mobileMenuButton.focus())"` to every mobile-menu link.

- [ ] **Step 4: Restore visible focus and readable sizing**

  Replace `focus:outline-none` on theme toggles with `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chile-blue`. Replace useful `text-[10px]` and `text-[11px]` inside `#precios` and `#contacto` with at least `text-sm`; decorative rubro labels may remain smaller only when their adjacent heading contains the same meaning.

  Update color tokens/classes for the four confirmed low-contrast combinations so computed contrast reaches 4.5:1 in both themes. Use existing foreground tokens (`text-drac-fg`, `text-chile-blue`, `text-[#0B5D35]` on light surfaces, `text-emerald-100` on dark surfaces) rather than adding a new palette.

- [ ] **Step 5: Harden demo links**

  Add `rel="noopener"` to every `target="_blank"` demo link. Add `<span class="sr-only"> (abre en una pestaña nueva)</span>` inside each link action label without changing its visible text.

- [ ] **Step 6: Run the focused hardening tests**

  Run: `npx playwright test tests/landing-exhaustive.spec.js --grep "returns focus and public actions|Theme switcher|Hero rubro simulator|demo cards"`

  Expected: all selected tests PASS.

- [ ] **Step 7: Commit accessibility hardening**

  ```bash
  git add index.html tests/landing-exhaustive.spec.js
  git commit -m "fix: harden STAX mobile accessibility"
  ```

### Task 6: Verify the complete experience and record the new baseline

**Files:**
- Modify: `index.html` only for defects proven by this task.
- Modify: `tests/landing-exhaustive.spec.js` or `tests/whatsapp-submit.spec.js` only when a demonstrated regression lacks coverage.
- Create through helper: `.impeccable/critique/<timestamp>__index-html.md`.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: passing preproduction gate, clean Impeccable detector pass accounting and a comparable critique snapshot.

- [ ] **Step 1: Run focused landing and WhatsApp suites**

  Run: `node scripts/run_clean_env.js playwright test tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js`

  Expected: all tests PASS with zero console, page or request failures.

- [ ] **Step 2: Run root and console regression**

  Run: `npm run test_root && npm run check_consoles`

  Expected: both scripts PASS.

- [ ] **Step 3: Run the complete release gate**

  Run: `npm run qa:gate`

  Expected: Static Repo Checks, Existing Node Test Suite and Headless `file://` Navigation all report `PASS`.

- [ ] **Step 4: Run the Impeccable mechanical detector once**

  Run: `node /home/manager/.agents/skills/impeccable/scripts/detect.mjs --json index.html`

  Expected: no new P1 accessibility signal. Classify style-opinion warnings separately from measurable contrast, focus, overflow and heading issues.

- [ ] **Step 5: Inspect representative responsive states**

  Using Playwright/Chrome, inspect 320×568, 390×844, 768×1024 and 1440×900 in both themes. Verify hero, early price summary, plan disclosures, selected-plan summary, validation error, success/edit/reset state, menu backdrop and floating CTA. Confirm `document.documentElement.scrollWidth <= window.innerWidth` at every viewport and measure the mobile Y positions of the early price summary, `#precios` and `#contacto`.

- [ ] **Step 6: Re-run the structured critique**

  Run the Impeccable critique workflow against `index.html`, persist its snapshot with `critique-storage.mjs`, and compare its score with the 21/36 baseline. The final report must distinguish technical PASS from remaining commercial-design judgment.

- [ ] **Step 7: Commit only proven final corrections**

  ```bash
  git add index.html tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js .impeccable/critique
  git commit -m "test: verify consultative STAX conversion flow"
  ```

  If Step 6 creates only a critique snapshot and no corrections, use:

  ```bash
  git add .impeccable/critique
  git commit -m "docs: record STAX UX audit baseline"
  ```

## Plan Self-Review

- **Spec coverage:** Task 2 covers explicit selection, neutral state, message fidelity, validation and recovery. Task 3 covers accessible scope, pricing, IVA and copy. Task 4 covers mobile distance, section reduction, motion and floating CTA. Task 5 covers menu, focus, link behavior, readable sizing and contrast. Task 6 covers offline, responsive, regression and audit acceptance criteria.
- **No placeholders:** Every task identifies exact files, interfaces, selectors, copy, commands and expected outcomes. Existing factual plan paragraphs are preserved rather than rewritten speculatively.
- **Interface consistency:** The plan IDs `esencial`, `profesional` and `premium`, test IDs, public method names and CTA label are identical across tests and implementation tasks.
- **Scope control:** Demos, branding, external services, phone number and dependencies remain unchanged. Remote publication is excluded.
