# Orbe FAQ en vivo para Fonoaudiología Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un lanzador de FAQ por voz accesible y verificable al hero de la demo de fonoaudiología.

**Architecture:** El HTML presenta el orbe y un diálogo Alpine. `app.js` conserva el estado de la landing y añade métodos mínimos para abrir/cerrar el diálogo y generar su URL de widget. El cliente VoiceLive existente, alojado en `localhost:5173/widget/empresa-a`, sigue siendo dueño de Gemini, sesión y micrófono dentro de un iframe desmontable.

**Tech Stack:** HTML estático, CSS local, Alpine.js local, Playwright, widget VoiceLive existente.

## Global Constraints

- Mantener compatibilidad `file://`, recursos locales y Alpine.js local.
- No agregar CDN, dependencias ni credenciales.
- Solicitar micrófono solo desde una acción explícita del widget VoiceLive.
- Respetar `prefers-reduced-motion`, foco visible, contraste y navegación por teclado.
- Ejecutar `npm run qa:gate` antes de entregar.

---

### Task 1: Prueba E2E del lanzador y diálogo

**Files:**
- Create: `tests/fono-live-faq.spec.js`

**Interfaces:**
- Consumes: `window.fonoaudiologiaApp()`, `data-testid="fono-live-faq-orb"`, `data-testid="fono-live-faq-dialog"`.
- Produces: Cobertura Playwright de apertura, iframe, cierre y consola limpia.

- [ ] **Step 1: Write the failing test**

```js
const { test, expect } = require("@playwright/test");
const { attachPageGuards, waitForAlpine } = require("./helpers");

test("Fono FAQ en vivo abre y desmonta el widget de voz", async ({ page }) => {
  const guards = await attachPageGuards(page);
  await page.goto("/demo-fonoaudiologia/index.html");
  await waitForAlpine(page);
  const orb = page.getByTestId("fono-live-faq-orb");
  await expect(orb).toHaveAttribute("aria-expanded", "false");
  await orb.click();
  const dialog = page.getByTestId("fono-live-faq-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("iframe")).toHaveAttribute("src", "http://localhost:5173/widget/empresa-a");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(dialog.locator("iframe")).toHaveCount(0);
  await guards.assertHealthyContext();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/fono-live-faq.spec.js`

Expected: FAIL because the live FAQ test id does not exist.

- [ ] **Step 3: Implement the minimal interface**

Add an Alpine-aware native button with `data-testid="fono-live-faq-orb"` and `:aria-expanded="liveFaqOpen.toString()"`. Add a dialog guarded by `x-show="liveFaqOpen"`; its iframe is guarded by `x-if="liveFaqOpen"`, has `src="http://localhost:5173/widget/empresa-a"`, `allow="microphone; autoplay"`, and a close control. Add `@keydown.escape.window="closeLiveFaq()"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test tests/fono-live-faq.spec.js`

Expected: PASS, one test.

- [ ] **Step 5: Commit**

```bash
git add tests/fono-live-faq.spec.js demo-fonoaudiologia/index.html demo-fonoaudiologia/app.js
git commit -m "feat: add fono live FAQ launcher"
```

### Task 2: Estado Alpine, foco y URL configurable

**Files:**
- Modify: `demo-fonoaudiologia/app.js:1-75`
- Modify: `tests/fono-live-faq.spec.js`

**Interfaces:**
- Consumes: `window.FONO_LIVE_FAQ_WIDGET_URL` opcional.
- Produces: `liveFaqOpen`, `liveFaqWidgetUrl`, `openLiveFaq()`, `closeLiveFaq()`, `liveFaqDialogLoaded()`.

- [ ] **Step 1: Extend the failing test**

```js
await page.addInitScript(() => { window.FONO_LIVE_FAQ_WIDGET_URL = "https://voice.example.test/widget/empresa-a"; });
await page.goto("/demo-fonoaudiologia/index.html");
await page.getByTestId("fono-live-faq-orb").click();
await expect(page.getByTestId("fono-live-faq-dialog").locator("iframe"))
  .toHaveAttribute("src", "https://voice.example.test/widget/empresa-a");
await page.getByRole("button", { name: "Cerrar FAQ en vivo" }).click();
await expect(page.getByTestId("fono-live-faq-orb")).toBeFocused();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/fono-live-faq.spec.js`

Expected: FAIL because the URL is hard-coded or focus is not restored.

- [ ] **Step 3: Implement state and focus restoration**

```js
const defaultLiveFaqWidgetUrl = "http://localhost:5173/widget/empresa-a";
const liveFaqWidgetUrl = window.FONO_LIVE_FAQ_WIDGET_URL || defaultLiveFaqWidgetUrl;

openLiveFaq() { this.liveFaqOpen = true; },
closeLiveFaq() {
  this.liveFaqOpen = false;
  requestAnimationFrame(() => document.querySelector('[data-testid="fono-live-faq-orb"]')?.focus());
},
```

Use `:src="liveFaqWidgetUrl"` in the iframe. Do not call `getUserMedia` from this landing.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test tests/fono-live-faq.spec.js`

Expected: PASS, configured URL and restored focus verified.

- [ ] **Step 5: Commit**

```bash
git add demo-fonoaudiologia/app.js demo-fonoaudiologia/index.html tests/fono-live-faq.spec.js
git commit -m "feat: configure fono voice widget launcher"
```

### Task 3: Estilo de orbe, error visible y regresión completa

**Files:**
- Modify: `demo-fonoaudiologia/index.html:44-121, 176-235, final body`
- Modify: `tests/fono-live-faq.spec.js`

**Interfaces:**
- Consumes: estado Alpine de las tareas anteriores.
- Produces: Clases `fono-live-orb`, `is-active`, diálogo responsive y mensaje de recuperación.

- [ ] **Step 1: Extend the failing test for accessibility markup**

```js
await expect(page.getByText("Se pedirá permiso para habilitar el micrófono.")).toBeVisible();
await expect(page.getByTestId("fono-live-faq-orb")).toHaveAttribute("aria-controls", "fono-live-faq-dialog");
await expect(page.getByTestId("fono-live-faq-dialog").locator("iframe"))
  .toHaveAttribute("allow", /microphone/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/fono-live-faq.spec.js`

Expected: FAIL until the copy and iframe permission are present.

- [ ] **Step 3: Add scoped styles and recovery content**

Define the idle halo and active audio bars using CSS keyframes scoped under `.fono-live-orb`, with a `@media (prefers-reduced-motion: reduce)` override. Keep the label `FAQ en vivo`, the exact permission copy and a close button. Add a no-JavaScript fallback link to the widget and a visible `iframe` error message with a link to open `liveFaqWidgetUrl` in a new tab.

- [ ] **Step 4: Run focused and full validation**

Run: `npx playwright test tests/fono-live-faq.spec.js && npm run qa:gate`

Expected: Playwright PASS and QA gate ending in `PASS`.

- [ ] **Step 5: Commit and publish**

```bash
git add demo-fonoaudiologia/index.html tests/fono-live-faq.spec.js
git commit -m "feat: polish accessible fono voice orb"
git push origin main
```

## Self-review

- Spec coverage: Tasks 1–3 cover launcher, visual states, iframe reuse, error/cierre, configurable URL, accessibility, reduced motion and Playwright/QA validation.
- Placeholder scan: no TBD/TODO or unspecified test behavior remains.
- Interface consistency: the test ids, Alpine fields and methods use the same names across every task.
