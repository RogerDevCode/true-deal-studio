# Evidence-Based Commercial Refinements and Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve STAX commercial clarity, affirmative language, price transparency and theme contrast while preserving the consultative plan-to-WhatsApp flow.

**Architecture:** Keep the static `index.html` and local Alpine runtime. Add Playwright contracts around visible copy, early decisions, totals and computed theme colors; then update existing content and scoped CSS classes without adding sections, routes or dependencies.

**Tech Stack:** Static HTML, local compiled Tailwind CSS, local Alpine.js, Node.js `>=22 <23`, Playwright, Chrome Headless.

## Global Constraints

- Keep public brand STAX and the headline “Que te vean. Que te crean.”.
- Keep `lang="es-CL"`, one `<h1>`, current metadata, JSON-LD and local assets.
- Keep explicit `file://` routes and the existing plan → form → WhatsApp state.
- Use affirmative Spanish focused on observable actions; visible limitations use “Queda fuera del alcance” or “Se cotiza por separado”.
- Keep sales, time savings, conversion claims, testimonials, scarcity and guarantees outside public copy.
- Keep the three native `<details>` controls and all current section IDs.
- Preserve `prefers-reduced-motion`, visible focus, 44 px touch targets and WCAG AA contrast.
- Keep `docs/auditoria.md`, demos, phone number, external services and dependencies untouched.
- Reserve `!important` for `[x-cloak]` and reduced-motion rules.

---

## File Structure

- Modify: `index.html` — commercial copy, early routes, plan totals, positive scope language, theme tokens and scoped contrast surfaces.
- Modify: `tests/landing-exhaustive.spec.js` — commercial, positive-language, responsive and computed-color contracts.
- Modify: `tests/whatsapp-submit.spec.js` — selected-plan summaries with final/reference totals.
- Reference: `docs/superpowers/specs/2026-07-26-ajustes-comerciales-con-evidencia-design.md`.

### Task 1: Define commercial clarity and affirmative-language contracts

**Files:**
- Modify: `tests/landing-exhaustive.spec.js`
- Modify: `tests/whatsapp-submit.spec.js`

**Interfaces:**
- Consumes: `#inicio .hero-subtitle`, `starting-price-summary`, `#precios`, `details[data-plan-details]`, `selected-plan-summary`.
- Produces: stable test IDs `early-plans-link`, `early-guidance-link`; exact total labels and disclosure label.

- [ ] **Step 1: Add the landing commercial-copy test**

  Add:

  ```js
  test('Commercial copy stays factual, affirmative and easy to act on', async ({ page }) => {
    const visibleCopy = await page.locator('body').innerText();
    await expect(page.locator('#inicio .hero-subtitle')).toHaveText(
      'Creamos páginas web que ordenan tus servicios, valores y horarios para que tus clientes lleguen a WhatsApp con más contexto.'
    );
    await expect(page.getByTestId('early-plans-link')).toHaveAttribute('href', '#precios');
    await expect(page.getByTestId('early-guidance-link')).toHaveAttribute('href', '#contacto');
    await expect(page.getByTestId('starting-price-summary').getByRole('link')).toHaveCount(2);
    expect(visibleCopy).not.toMatch(/\bNo\b/);
    expect(visibleCopy).not.toMatch(/Hosting|HTTPS|SEO|HTML \+ Tailwind|Alpine\.js/);
    expect(visibleCopy).not.toMatch(/ventas garantizadas|se paga sola|15 horas|cupos/i);
  });
  ```

- [ ] **Step 2: Add exact price and disclosure contracts**

  Add:

  ```js
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
  ```

- [ ] **Step 3: Extend selected-plan WhatsApp tests**

  In the plan loop, assert the selected summary contains:

  ```js
  const expectedPrice = {
    esencial: 'Total con IVA: $118.999 CLP',
    profesional: 'Total referencial desde $297.488 CLP con IVA',
    premium: 'Total referencial desde $535.488 CLP con IVA',
  }[plan[0]];
  await expect(page.getByTestId('selected-plan-summary')).toContainText(expectedPrice);
  ```

- [ ] **Step 4: Run contracts and confirm red state**

  Run:

  ```bash
  npx playwright test tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js --grep "factual, affirmative|IVA total|explicitly selected"
  ```

  Expected: new copy, test IDs, totals and labels fail before implementation.

- [ ] **Step 5: Commit red contracts**

  ```bash
  git add tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js
  git commit -m "test: define factual STAX commercial copy"
  ```

### Task 2: Implement factual copy, early routes and complete totals

**Files:**
- Modify: `index.html`
- Test: `tests/landing-exhaustive.spec.js`
- Test: `tests/whatsapp-submit.spec.js`

**Interfaces:**
- Consumes: existing anchors, plan cards, `planOptions` and selected-plan summary.
- Produces: two early routes and matching final/reference totals in card and state.

- [ ] **Step 1: Update hero and early summary**

  Replace the hero subtitle with the approved sentence. Replace the single early link with:

  ```html
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
    <a data-testid="early-plans-link" href="#precios" class="inline-flex min-h-11 items-center justify-center rounded-full bg-chile-blue px-5 py-3 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chile-blue">Ver los 3 planes</a>
    <a data-testid="early-guidance-link" href="#contacto" class="inline-flex min-h-11 items-center justify-center rounded-full border border-drac-current/60 px-5 py-3 font-bold text-drac-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chile-blue">Necesito orientación</a>
  </div>
  ```

- [ ] **Step 2: Translate technical cards and footer**

  Use the exact terms from the spec. Keep facts about publication, secure connection, mobile performance and search-readable structure. Replace the public stack footer with `Hecho en Chile · Atención para negocios de todo el país`.

- [ ] **Step 3: Convert visible negative phrases to affirmative scope language**

  Apply these mappings:

  ```text
  No necesitas elegir un plan ahora. → Puedes comenzar con orientación y revisar un plan cuando te haga sentido.
  No incluye: → Queda fuera del alcance:
  STAX no registra ni mantiene esos servicios a su nombre. → Esos servicios permanecen registrados y administrados a tu nombre o al de tu empresa.
  ```

- [ ] **Step 4: Add totals and update plan state**

  Add the two referential total paragraphs below the net prices. Set `planOptions[*].price` to:

  ```js
  esencial: 'Total con IVA: $118.999 CLP',
  profesional: 'Total referencial desde $297.488 CLP con IVA',
  premium: 'Total referencial desde $535.488 CLP con IVA',
  ```

  Keep the existing net and milestone information visible in each card.

- [ ] **Step 5: Update disclosure labels and existing assertions**

  Replace all three summaries with `Revisar condiciones, plazos y soporte`. Update existing tests that expect `No incluye:` or `Ver detalle del alcance`.

- [ ] **Step 6: Run focused commercial suites**

  Run:

  ```bash
  npx playwright test tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js --grep "factual, affirmative|IVA total|explicitly selected|scope is available|states a closed"
  ```

  Expected: all selected tests PASS.

- [ ] **Step 7: Commit commercial implementation**

  ```bash
  git add index.html tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js
  git commit -m "feat: clarify STAX commercial decisions"
  ```

### Task 3: Define and implement full-theme contrast

**Files:**
- Modify: `tests/landing-exhaustive.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `#inicio`, `#navbar`, `mobile-menu-panel`, `.band-white`, `.band-lino`, `.band-dark`, `.band-navy`.
- Produces: `navbar-shell`, `mobile-menu-surface` and stable theme-specific computed colors.

- [ ] **Step 1: Add a computed contrast helper to the test file**

  Add:

  ```js
  function luminance([r, g, b]) {
    const channels = [r, g, b].map((value) => {
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
  ```

- [ ] **Step 2: Add theme color contracts**

  Test both themes at 390×844 and 1440×900. Assert:

  ```text
  dark hero h1: rgb(248, 250, 252)
  dark hero subtitle: rgb(216, 225, 236)
  dark mobile menu surface: rgb(21, 26, 38)
  dark mobile menu links: rgb(230, 234, 242)
  light hero h1: rgb(18, 35, 63)
  light hero subtitle: rgb(51, 70, 94)
  light mobile menu surface: rgb(221, 212, 196)
  light mobile menu links: rgb(23, 43, 77)
  light band-white: rgb(241, 238, 231)
  light band-lino: rgb(221, 217, 207)
  ```

  Use `contrastRatio()` to confirm each solid text/surface pair reaches 4.5:1. Confirm every viewport stays within its width.

- [ ] **Step 3: Add scoped classes to navbar and menu**

  Add `navbar-shell` to the main header row and `mobile-menu-surface` to the mobile menu panel. Keep current menu behavior and test IDs.

- [ ] **Step 4: Implement dark-theme hero**

  Set the default hero overlay to deep navy over the existing local image. Use `#F8FAFC` for the hero heading, `#D8E1EC` for body/trust text and dark translucent surfaces for badge, local reach and quiet CTA. Use light text and controls in the transparent dark-theme header.

- [ ] **Step 5: Implement light-theme hero and bands**

  Use a deeper warm overlay with background `#E2DACB`, heading `#12233F`, body `#33465E`, `band-white` `#F1EEE7`, `band-lino` `#DDD9CF`, cards `#FBFAF7` and stronger borders. Apply light-theme header text `#172B4D`.

- [ ] **Step 6: Implement mobile menu and global secondary text contrast**

  Use `#151A26` / `#E6EAF2` in dark theme and `#DDD4C4` / `#172B4D` in light theme. Keep visible hover and focus states. Retain luminous secondary text on dark bands and dark secondary text on light cards.

- [ ] **Step 7: Run theme and mobile tests**

  Run:

  ```bash
  npx playwright test tests/landing-exhaustive.spec.js --grep "theme contrast|Mobile menu|Hero section|Theme switcher"
  ```

  Expected: all selected tests PASS.

- [ ] **Step 8: Commit contrast implementation**

  ```bash
  git add index.html tests/landing-exhaustive.spec.js
  git commit -m "fix: strengthen STAX theme contrast"
  ```

### Task 4: Verify responsive, offline and commercial integrity

**Files:**
- Modify: `index.html` or tests only for defects proven during verification.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: passing focused suites, detector and preproduction gate.

- [ ] **Step 1: Run landing and WhatsApp suites**

  ```bash
  node scripts/run_clean_env.js npx playwright test tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js
  ```

  Expected: every test PASS with clean console, page and request guards.

- [ ] **Step 2: Inspect both themes at four viewports**

  Inspect 320×568, 390×844, 768×1024 and 1440×900. Verify hero, header, menu, early actions, all section bands, plans, details, FAQ, contact and footer. Confirm `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 3: Run the mechanical detector once**

  ```bash
  node /home/manager/.agents/skills/impeccable/scripts/detect.mjs --json index.html
  ```

  Expected: `[]` or only classified style-opinion findings without a measurable accessibility regression.

- [ ] **Step 4: Run the release gate**

  ```bash
  npm run qa:gate
  ```

  Expected: Static Repo Checks, Existing Node Test Suite and Headless `file://` Navigation report `PASS`.

- [ ] **Step 5: Commit any proven verification correction**

  ```bash
  git add index.html tests/landing-exhaustive.spec.js tests/whatsapp-submit.spec.js
  git commit -m "test: verify STAX commercial contrast refinements"
  ```

## Plan Self-Review

- **Spec coverage:** Task 2 covers hero, early routes, technical-language translation, positive copy, totals and details. Task 3 covers both themes across hero, navigation, bands, cards and menu. Task 4 covers responsive, offline and regression acceptance.
- **Placeholder scan:** the plan contains complete selectors, copy, colors, commands and expected outcomes.
- **Interface consistency:** test IDs, total labels, class names and color values stay identical across tests and implementation.
- **Scope:** changes remain within the landing, its tests and approved documentation; `docs/auditoria.md` stays preserved.
