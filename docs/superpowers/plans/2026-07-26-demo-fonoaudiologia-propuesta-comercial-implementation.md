# Demo Fonoaudiología Commercial Proposal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the fonoaudiología demo into a concise, consultative commercial journey whose hero, first-visit explanation and WhatsApp request fit the needs of Chilean families.

**Architecture:** Preserve the static HTML, local Alpine.js application and existing booking state. Add stable Playwright contracts first, then refine the existing sections and physically reorder their DOM blocks while retaining IDs, local routes, fields and WhatsApp behavior.

**Tech Stack:** Static HTML, local Tailwind CSS build, local Alpine.js with collapse plugin, vanilla JavaScript, Playwright, Chrome Headless, Node.js `>=22 <23`.

## Global Constraints

- Keep `lang="es-CL"`, exactly one `<h1>`, existing metadata and `MedicalBusiness` JSON-LD.
- Keep explicit `../index.html` and `../privacidad.html` routes and full `file://` compatibility.
- Keep `hero.jpg`, `nahovy_profile.jpg`, local fonts, local CSS and local Alpine dependencies.
- Keep the current WhatsApp number, booking fields, default service, localStorage entry and state reset behavior.
- Keep public copy affirmative, factual, calm and appropriate for a health service.
- Keep touch targets at least 44 px, mobile text at least 14 px, visible focus and WCAG AA contrast.
- Keep clinical outcomes framed as observable contributions and individual orientation.
- Keep pricing, duration, communes, availability and credentials limited to confirmed information.
- Keep `docs/auditoria.md` untouched.
- Reserve `!important` for `[x-cloak]` and reduced-motion behavior.

---

## File Structure

- Modify: `demo-fonoaudiologia/index.html` — compact demo chrome, hero, section order, first-visit value, CTA vocabulary, professional proof, FAQ and privacy note.
- Modify: `demo-fonoaudiologia/app.js` — affirmative WhatsApp request wording while preserving storage and fallback behavior.
- Modify: `tests/demos-9-to-11-exhaustive.spec.js` — commercial hierarchy, responsive layout, DOM order and factual-copy contracts.
- Modify: `tests/modal-regression.spec.js` — fonoaudiología modal labels, privacy and state-reset coverage.
- Reference: `docs/superpowers/specs/2026-07-26-demo-fonoaudiologia-propuesta-comercial-design.md`.

### Task 1: Define the commercial and responsive contracts

**Files:**
- Modify: `tests/demos-9-to-11-exhaustive.spec.js`
- Modify: `tests/modal-regression.spec.js`

**Interfaces:**
- Consumes: `/demo-fonoaudiologia/index.html`, existing Alpine root and booking modal.
- Produces: stable selectors `fono-demo-bar`, `fono-hero`, `fono-primary-cta`, `fono-first-visit`, `fono-booking-privacy`.

- [ ] **Step 1: Add the exact hero-copy contract**

  Add inside the fonoaudiología describe block:

  ```js
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
  ```

- [ ] **Step 2: Add the measured responsive contract**

  Add:

  ```js
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
  ```

- [ ] **Step 3: Add section-order and factual-copy contracts**

  Add:

  ```js
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
  ```

- [ ] **Step 4: Extend the modal regression case**

  In the existing modal loop, add a conditional block after the fonoaudiología modal becomes visible:

  ```js
  if (modalCase.name === 'fonoaudiologia') {
    await expect(modal.getByRole('heading', { name: 'Solicitar primera visita' })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Preparar solicitud por WhatsApp' })).toBeVisible();
    await expect(modal.getByTestId('fono-booking-privacy')).toContainText(
      'Usaremos estos datos para preparar y coordinar tu solicitud por WhatsApp.'
    );
    await expect(modal.getByRole('link', { name: 'aviso de privacidad' })).toHaveAttribute('href', '../privacidad.html');
  }
  ```

- [ ] **Step 5: Run the new contracts and confirm the red state**

  Run:

  ```bash
  npx playwright test tests/demos-9-to-11-exhaustive.spec.js tests/modal-regression.spec.js --grep "Commercial hero|Hero hierarchy|Commercial sequence|Core conversion"
  ```

  Expected: hero selectors, exact copy, section order and modal wording fail against the incumbent page.

- [ ] **Step 6: Commit the red contracts**

  ```bash
  git add tests/demos-9-to-11-exhaustive.spec.js tests/modal-regression.spec.js
  git commit -m "test: define fonoaudiologia commercial journey"
  ```

### Task 2: Compact the mobile chrome and hero

**Files:**
- Modify: `demo-fonoaudiologia/index.html`
- Test: `tests/demos-9-to-11-exhaustive.spec.js`

**Interfaces:**
- Consumes: existing demo navigation injection, local `hero.jpg`, Alpine `bookingModal` and `selectedService`.
- Produces: `data-testid="fono-demo-bar"`, `data-testid="fono-hero"`, `data-testid="fono-primary-cta"` and a first-screen mobile path to booking.

- [ ] **Step 1: Compact the demo bar and header**

  Replace the visible demo-bar content with responsive labels:

  ```html
  <div data-testid="fono-demo-bar" class="demo-bar border-b border-forest-800 bg-forest-900 px-3 text-forest-100 sm:px-4">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 text-sm">
      <span class="font-semibold">
        <span class="sm:hidden">Demo · Fonoaudiología infantil</span>
        <span class="hidden sm:inline">✨ Esta es la demo de Fonoaudiología Infantil a domicilio en Santiago.</span>
      </span>
      <a href="../index.html" class="min-h-11 shrink-0 inline-flex items-center font-bold underline hover:text-white">
        <span class="sm:hidden">Volver</span>
        <span class="hidden sm:inline">Volver al portafolio</span>
      </a>
    </div>
  </div>
  ```

  Set the primary header row to `h-16 md:h-20`. Keep the desktop navigation and change both booking buttons to `Solicitar primera visita` on desktop and `Solicitar visita` on mobile.

- [ ] **Step 2: Replace the hero copy and scoped classes**

  Use:

  ```html
  <section data-testid="fono-hero" class="relative overflow-hidden bg-gradient-to-b from-cream-50 to-cream-100 py-8 md:py-16">
  ```

  Use this text column:

  ```html
  <div class="space-y-5 text-left lg:col-span-7">
    <div class="inline-flex items-center gap-2 rounded-full border border-forest-600/10 bg-forest-100 px-3 py-1.5 text-sm font-semibold text-forest-700">
      <span>🏡 Fonoaudiología infantil a domicilio · Santiago</span>
    </div>
    <h1 class="max-w-[34rem] font-serif text-[2.4rem] font-bold leading-[1.02] text-forest-900 sm:text-5xl lg:text-[3.5rem]">
      Acompañamos su lenguaje desde casa.
    </h1>
    <p class="max-w-xl text-base leading-relaxed text-forest-700 sm:text-lg">
      Una primera visita basada en el juego para conocer cómo se comunica tu hijo, orientar a la familia y acordar juntos el siguiente paso.
    </p>
  </div>
  ```

- [ ] **Step 3: Replace hero actions and trust line**

  Keep the Alpine state change and use:

  ```html
  <button data-testid="fono-primary-cta" @click="bookingModal = true; selectedService = 'evaluacion'" class="min-h-11 rounded-full bg-forest-600 px-7 py-3.5 text-center font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700">
    Solicitar primera visita
  </button>
  ```

  Keep the existing encoded WhatsApp URL and label it `Consultar por WhatsApp`. Replace the asterisk note with:

  ```html
  <p class="hero-subtitle text-sm font-medium">
    Atención a domicilio · Orientación para la familia · Coordinación por WhatsApp
  </p>
  ```

- [ ] **Step 4: Prioritize the hero image**

  Keep the current visual composition and add intrinsic dimensions and loading priority:

  ```html
  <img src="./hero.jpg" width="1024" height="1024" fetchpriority="high" alt="Fonoaudióloga compartiendo una actividad de juego con un niño en su hogar" class="relative aspect-square w-full rounded-3xl object-cover shadow-lg" />
  ```

  Change the floating card labels to `Primera visita en casa` and `Juego, observación y orientación familiar`.

- [ ] **Step 5: Run the hero contracts**

  ```bash
  npx playwright test tests/demos-9-to-11-exhaustive.spec.js --grep "Commercial hero|Hero hierarchy"
  ```

  Expected: both tests PASS at 390 and 1440 px.

- [ ] **Step 6: Commit the compact hero**

  ```bash
  git add demo-fonoaudiologia/index.html tests/demos-9-to-11-exhaustive.spec.js
  git commit -m "feat: clarify fonoaudiologia hero"
  ```

### Task 3: Reframe and reorder the commercial argument

**Files:**
- Modify: `demo-fonoaudiologia/index.html`
- Test: `tests/demos-9-to-11-exhaustive.spec.js`

**Interfaces:**
- Consumes: existing section IDs, cards and local portrait.
- Produces: DOM order `enfoque → areas → como-funciona → sobre-mi` and factual first-visit/professional copy.

- [ ] **Step 1: Turn `#enfoque` into the first-visit explanation**

  Add `data-testid="fono-first-visit"`. Set the heading and introduction to:

  ```html
  <h2 class="font-serif text-2xl font-bold text-forest-900 sm:text-3xl">¿Qué aporta la primera visita?</h2>
  <p class="text-base leading-relaxed text-forest-700 sm:text-lg">
    El encuentro permite observar cómo se comunica tu hijo durante el juego, conversar sobre tus inquietudes y definir una orientación inicial para la familia.
  </p>
  ```

  Replace the cards with:

  ```text
  Observar jugando — Reconocemos sus formas actuales de comunicación mientras participa en actividades familiares.
  Escuchar a la familia — Conversamos sobre rutinas, dudas y situaciones cotidianas que quieres comprender mejor.
  Acordar el siguiente paso — Compartimos orientaciones iniciales y explicamos alternativas de acompañamiento.
  ```

- [ ] **Step 2: Physically move the professional section**

  Move the complete `<section id="sobre-mi">…</section>` block to immediately after `<section id="como-funciona">…</section>`. Keep its markup, IDs, images and internal links intact during the move.

- [ ] **Step 3: Refine professional proof**

  Replace the professional subtitle with:

  ```html
  <h3 class="text-lg font-medium text-forest-700 italic">
    Fonoaudióloga con enfoque en comunicación y desarrollo infantil
  </h3>
  ```

  Replace the registration badge copy with:

  ```text
  Credencial verificable
  En un sitio publicado, este bloque enlaza el registro oficial de la profesional.
  ```

  Change the credentials-grid item to `Registro profesional` with the same explanatory demo text. Keep the top demo label visible so this proof pattern remains transparent.

- [ ] **Step 4: Rewrite process and FAQ copy**

  Use `Orientación inicial y coordinación` for process step 1. Set its paragraph to:

  ```text
  Conversamos por teléfono o WhatsApp sobre tus inquietudes y coordinamos una primera visita a domicilio en Santiago.
  ```

  Change FAQ 2 to:

  ```text
  ¿Qué aporta la atención a domicilio?
  El hogar permite observar cómo se comunica el niño durante sus rutinas, con elementos familiares y junto a sus personas de confianza. Esta información ayuda a adaptar las actividades y entregar orientaciones prácticas a la familia.
  ```

  Change FAQ 3 answer to:

  ```text
  Las señales cambian según la edad, la historia y el contexto de cada niño. Una evaluación individual permite comprender su comunicación actual y orientar a la familia. Una primera conversación ayuda a ordenar antecedentes y acordar el paso más adecuado.
  ```

- [ ] **Step 5: Normalize area actions**

  Change all four area-card actions from `Consultar área` to `Consultar esta área`. Preserve each `selectedService` assignment and modal opening behavior.

- [ ] **Step 6: Run sequence and existing interaction tests**

  ```bash
  npx playwright test tests/demos-9-to-11-exhaustive.spec.js --grep "Commercial sequence|Clinical service details"
  ```

  Expected: both tests PASS and every section remains interactive.

- [ ] **Step 7: Commit the commercial sequence**

  ```bash
  git add demo-fonoaudiologia/index.html tests/demos-9-to-11-exhaustive.spec.js
  git commit -m "feat: strengthen fonoaudiologia service clarity"
  ```

### Task 4: Align the booking request and privacy explanation

**Files:**
- Modify: `demo-fonoaudiologia/index.html`
- Modify: `demo-fonoaudiologia/app.js`
- Test: `tests/modal-regression.spec.js`

**Interfaces:**
- Consumes: `fonoaudiologiaApp().submitBooking(name, phone, date, slot, details)` and current `selectedService` values.
- Produces: request-oriented modal copy, privacy link and affirmative WhatsApp message with the same storage schema.

- [ ] **Step 1: Align modal heading, introduction and labels**

  Use:

  ```text
  Heading: Solicitar primera visita
  Introduction: Cuéntanos tus datos y una preferencia de horario. Prepararemos el mensaje para coordinar contigo la visita a domicilio.
  Date label: Fecha preferida *
  Slot label: Horario preferido
  Submit: Preparar solicitud por WhatsApp
  ```

  Give the close button `aria-label="Cerrar solicitud"` and retain `Cancelar` as the reversible secondary action.

- [ ] **Step 2: Add the privacy explanation**

  Place before the submit buttons:

  ```html
  <p data-testid="fono-booking-privacy" id="fono-booking-privacy" class="text-sm leading-relaxed text-forest-600">
    Usaremos estos datos para preparar y coordinar tu solicitud por WhatsApp.
    <a href="../privacidad.html" class="font-bold underline hover:text-forest-900">Revisa el aviso de privacidad</a>.
  </p>
  ```

  Add `aria-describedby="fono-booking-privacy"` to the `<form>`.

- [ ] **Step 3: Update the application message while preserving behavior**

  In `submitBooking`, keep validation, service mapping, localStorage schema, phone and fallback. Use:

  ```js
  const detailSummary = details.trim() || 'Por conversar durante la coordinación';
  ```

  Use `detailSummary` in storage and WhatsApp. Start the message with:

  ```js
  const message = `Hola, Nahovy. Quiero solicitar una primera visita a domicilio para mi hijo/a:\n\n` +
  ```

  Use `Fecha preferida`, `Horario preferido` and `Antecedentes compartidos` in the remaining message labels.

- [ ] **Step 4: Run modal and WhatsApp regressions**

  ```bash
  npx playwright test tests/modal-regression.spec.js tests/whatsapp-submit.spec.js --grep "Core conversion|Core booking forms"
  ```

  Expected: modal copy, reset, storage, window opening and fallback all PASS.

- [ ] **Step 5: Commit the booking alignment**

  ```bash
  git add demo-fonoaudiologia/index.html demo-fonoaudiologia/app.js tests/modal-regression.spec.js
  git commit -m "feat: align fonoaudiologia booking request"
  ```

### Task 5: Verify visual, offline and clinical-copy integrity

**Files:**
- Verify: `demo-fonoaudiologia/index.html`
- Verify: `demo-fonoaudiologia/app.js`
- Verify: `tests/demos-9-to-11-exhaustive.spec.js`
- Verify: `tests/modal-regression.spec.js`

**Interfaces:**
- Consumes: completed commercial journey.
- Produces: release evidence for responsive layout, interaction, local navigation and repository quality.

- [ ] **Step 1: Run the focused demo suites**

  ```bash
  npx playwright test tests/demos-9-to-11-exhaustive.spec.js tests/modal-regression.spec.js tests/whatsapp-submit.spec.js
  ```

  Expected: all tests PASS.

- [ ] **Step 2: Inspect 390, 768 and 1440 px visually**

  Capture the initial viewport and booking modal at:

  ```text
  390 × 844
  768 × 900
  1440 × 900
  ```

  Confirm the title line limits, CTA visibility, image position, section rhythm, modal scrolling, focus and horizontal containment.

- [ ] **Step 3: Scan visible public copy**

  ```bash
  rg -n -i "más efectiva|ansiedad baja a cero|mucho más rápido|pre-diagnóstico|especialista en desarrollo infantil" demo-fonoaudiologia/index.html demo-fonoaudiologia/app.js
  ```

  Expected: zero matches.

- [ ] **Step 4: Run the Impeccable detector once after final UI changes**

  ```bash
  node /home/manager/.agents/skills/impeccable/scripts/detect.mjs --json demo-fonoaudiologia/index.html
  ```

  Expected: `[]` or reviewed findings resolved within scope.

- [ ] **Step 5: Run the full preproduction gate**

  ```bash
  npm run qa:gate
  ```

  Expected: `PASS` for static checks, existing Node suites and headless `file://` navigation.

- [ ] **Step 6: Confirm the final worktree scope**

  ```bash
  git status --short
  git diff --check
  ```

  Expected: tracked implementation clean; `docs/auditoria.md` remains intact and untracked.

## Self-Review

- Spec coverage: hero, mobile chrome, first-visit value, order, CTA, modal, privacy, professional proof, clinical copy, responsive layout and QA each have an owning task.
- Interfaces: every new test ID is produced in the task immediately following its red contract.
- Behavior preservation: Alpine fields, service values, storage schema, WhatsApp phone, fallback and reset stay explicit.
- Scope: three product files and two existing test files; assets, dependencies and unrelated demos remain untouched.
- Placeholders: every content string, selector, command and expected result is concrete.
