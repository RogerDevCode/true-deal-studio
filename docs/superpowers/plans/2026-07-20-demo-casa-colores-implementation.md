# Casa de los Colores Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear la demo de cuatro secciones La Casa de los Colores y enlazarla desde la landing como evidencia del Plan Vitrina Express.

**Architecture:** Una página HTML autónoma usa CSS local para la retícula geométrica y Alpine.js local para selección de paquete y reserva. Un único estado Alpine mantiene el paquete seleccionado, el borrador del formulario y el reseteo; Playwright verifica el comportamiento sin depender de servicios externos.

**Tech Stack:** HTML estático, CSS embebido, Alpine.js local, Node.js 22 y Playwright.

## Global Constraints

- Usar solo recursos locales, rutas explícitas y compatibilidad `file://`.
- `lang="es-CL"`, un único `h1`, Open Graph, Twitter y JSON-LD presentes.
- Composición geométrica original; no usar obras, imágenes ni copias de Piet Mondrian.
- Cuatro secciones: hero, paquetes, incluye y reserva.
- El formulario prepara WhatsApp con paquete, edad, asistentes y fecha; cancelar, enviar y restablecer dejan el estado limpio.
- No afirmar clientes, dirección, resultados o disponibilidad real.

---

### Task 1: Define the demo contract

**Files:**
- Create: `tests/demo-casa-colores.spec.js`

**Produces:** Un contrato de paquetes, mensaje WhatsApp, reset y retorno a la landing.

- [ ] **Step 1: Add the failing test**

  ```js
  test('Casa de los Colores selecciona un paquete, prepara WhatsApp y reinicia', async ({ page }) => {
    await page.goto('/demo-casa-colores/index.html');
    await waitForAlpine(page);
    await page.getByRole('button', { name: 'Elegir Explora' }).click();
    await page.getByLabel('Nombre de quien reserva').fill('Familia QA');
    await page.getByLabel('Edad que celebra').fill('8');
    await page.getByLabel('Cantidad de asistentes').fill('12');
    await page.getByLabel('Fecha preferida').fill('2026-08-15');
    await page.getByRole('button', { name: 'Preparar mensaje por WhatsApp' }).click();
    await expectWhatsAppOpen(page, ['Explora', '8 años', '12 asistentes', '2026-08-15']);
    await page.getByRole('button', { name: 'Restablecer demo' }).click();
    await expect(page.getByText('Explora elegido para tu celebración')).toHaveCount(0);
  });
  ```

- [ ] **Step 2: Run the test and confirm it fails**

  Run: `npx playwright test tests/demo-casa-colores.spec.js`

  Expected: FAIL because the page does not exist yet.

- [ ] **Step 3: Commit the contract**

  ```bash
  git add tests/demo-casa-colores.spec.js
  git commit -m "test: define Casa de los Colores demo contract"
  ```

### Task 2: Build the autonomous four-section demo

**Files:**
- Create: `demo-casa-colores/index.html`
- Create: `demo-casa-colores/app.js`

**Consumes:** Local `../assets/vendor/alpinejs.min.js` and the contract from Task 1.

**Produces:** A responsive demo with `casaColoresApp()`, package selection and WhatsApp handoff.

- [ ] **Step 1: Create semantic page structure**

  Add the local scripts, complete metadata and four `<section>` elements with IDs `inicio`, `paquetes`, `incluye` and `reserva`. Use CSS custom properties `--blue`, `--red`, `--yellow`, `--ink` and `--paper` to construct only geometric blocks and black rules.

- [ ] **Step 2: Implement the state interface**

  In `app.js`, expose `window.casaColoresApp = () => ({ selectedPackage: null, draft: { name: '', age: '', guests: '', date: '' }, choosePackage(plan) { ... }, resetDemo() { ... }, submitReservation() { ... } })`. `submitReservation()` creates `https://wa.me/56999040515?text=${encodeURIComponent(message)}` and calls `window.openWhatsAppWithFallback` when available, otherwise `window.open`.

- [ ] **Step 3: Implement predictable reset behavior**

  `resetDemo()` must set `selectedPackage` to `null`, replace `draft` with empty values and remove only `stax-demo-casa-colores` from localStorage. `submitReservation()` must store the completed reservation in that key and reset the form after opening WhatsApp.

- [ ] **Step 4: Run the contract**

  Run: `npx playwright test tests/demo-casa-colores.spec.js`

  Expected: PASS.

- [ ] **Step 5: Commit the demo**

  ```bash
  git add demo-casa-colores/index.html demo-casa-colores/app.js tests/demo-casa-colores.spec.js
  git commit -m "feat: add Casa de los Colores demo"
  ```

### Task 3: Add the showcase card and release checks

**Files:**
- Modify: `index.html` — add a visible link `./demo-casa-colores/index.html` in `#demos`.
- Modify: `tests/root.spec.js` — include the new route in `demoPaths`.
- Modify: `tests/landing-exhaustive.spec.js` — include the new visible card route.

**Produces:** The demo is discoverable from the landing and covered by file navigation tests.

- [ ] **Step 1: Add the card**

  Add a simple local CSS preview made of the same primary-color blocks, with the text `La Casa de los Colores`, `Celebraciones infantiles` and an explicit `Ver demo en vivo` link. Do not add remote imagery.

- [ ] **Step 2: Update route arrays**

  Add `'./demo-casa-colores/index.html'` to both existing demo route arrays so the root and expanded-catalog tests validate it.

- [ ] **Step 3: Run focused regression**

  Run: `npx playwright test tests/demo-casa-colores.spec.js tests/root.spec.js tests/landing-exhaustive.spec.js`

  Expected: PASS.

- [ ] **Step 4: Commit and publish**

  ```bash
  git add index.html tests/root.spec.js tests/landing-exhaustive.spec.js
  git commit -m "feat: showcase Casa de los Colores demo"
  git push origin main
  ```

### Task 4: Visual and production verification

**Files:** none unless a failed check requires a focused correction.

- [ ] **Step 1: Run gate-equivalent checks**

  Run: `npm run test_root && npx playwright test tests/demo-casa-colores.spec.js tests/landing-exhaustive.spec.js`

  Expected: all tests PASS.

- [ ] **Step 2: Inspect the live demo**

  Load `https://true-deal-studio.vercel.app/demo-casa-colores/index.html` in Playwright at desktop and 390px mobile. Confirm the four sections, visible primary-color geometry, selected package and WhatsApp button are readable without horizontal overflow.

## Plan Self-Review

- **Spec coverage:** Tasks 1–2 implement the page, interaction, reset, local assets, SEO and four sections. Task 3 connects it to the landing. Task 4 covers local and production verification.
- **No placeholders:** Paths, state names, labels, URL shape and commands are explicit.
- **Consistency:** The test labels match `choosePackage`, the form labels and `resetDemo()` defined in Task 2.
