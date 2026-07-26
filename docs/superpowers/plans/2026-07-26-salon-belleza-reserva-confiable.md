# Studio Chic Reliable Reservation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir Studio Chic en una demo premium que permita elegir servicios o pedir orientación, preparar una solicitud confiable por WhatsApp y completar el recorrido con accesibilidad móvil y transparencia comercial.

**Architecture:** Se conserva la página estática y su identidad visual. `index.html` aporta semántica, copy, estados visuales y responsive; `app.js` concentra selección, validación, foco y serialización transitoria. Una suite focalizada nueva define el contrato comercial y accesible, mientras las pruebas existentes se ajustan al formulario más breve.

**Tech Stack:** HTML estático, CSS local, Alpine.js local, JavaScript, Playwright, Chrome Headless y navegación `file://`.

## Global Constraints

- Mantener la composición dividida, paleta negro/champagne, fotografía, tarjetas, comparador y secuencia editorial.
- Mantener recursos locales, Alpine.js y rutas explícitas compatibles con `file://`.
- Usar “Solicitar disponibilidad” y “Preparar solicitud por WhatsApp” como jerarquía verbal.
- Presentar valores como “Desde” y datos del negocio como contenido demostrativo.
- Mantener Presencial como modalidad única y predeterminada.
- Restablecer formulario y selección al cancelar, cerrar o preparar la solicitud.
- Evitar persistencia de datos personales en `localStorage`.
- Reservar `!important` para `[x-cloak]` y `prefers-reduced-motion`.
- Preservar `docs/auditoria.md`.

---

### Task 1: Definir contratos comerciales y de transparencia

**Files:**
- Create: `tests/salon-commercial.spec.js`
- Modify: `demo-salon-belleza/index.html`

**Interfaces:**
- Consumes: ruta `/demo-salon-belleza/index.html` y estado Alpine `salonApp()`.
- Produces: copy unificado, valores “Desde”, orientación visible y página identificada como demo.

- [ ] **Step 1: Escribir pruebas comerciales fallidas**

Crear `tests/salon-commercial.spec.js` con:

```js
const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.beforeEach(async ({ page }) => {
  await page.goto('/demo-salon-belleza/index.html');
  await waitForAlpine(page);
});

test('Studio Chic explains availability, reference prices and demo content', async ({ page }) => {
  const guards = await attachPageGuards(page);
  await expect(page.locator('h1')).toHaveText('Tu cabello habla de ti. Dale voz.');
  await expect(page.getByRole('button', { name: 'Solicitar disponibilidad' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Ver servicios y valores' })).toHaveAttribute('href', '#servicios');
  await expect(page.locator('#servicios')).toContainText('Valores referenciales');
  await expect(page.locator('.service-price')).toHaveCount(4);
  await expect(page.locator('.service-price').evaluateAll((nodes) => nodes.every((node) => node.textContent.trim().startsWith('Desde $')))).resolves.toBe(true);
  await expect(page.getByRole('button', { name: 'Quiero orientación' })).toBeVisible();
  await expect(page.getByText('Demo interactiva · contenido ilustrativo')).toBeVisible();
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(jsonLd['@type']).toBe('WebPage');
  expect(jsonLd.address).toBeUndefined();
  expect(jsonLd.telephone).toBeUndefined();
  await expect(page.locator('footer')).toContainText('información revisada con el salón');
  await guards.assertHealthyContext();
});
```

- [ ] **Step 2: Ejecutar y confirmar el fallo**

Run:

```bash
npx playwright test tests/salon-commercial.spec.js -g "explains availability"
```

Expected: `FAIL` por copy, CTA, JSON-LD y notas todavía ausentes.

- [ ] **Step 3: Implementar la capa comercial mínima**

En `demo-salon-belleza/index.html`:

- Cambiar JSON-LD a `WebPage` demostrativa.
- Añadir “Demo interactiva · contenido ilustrativo”.
- Mantener el H1 y reemplazar badge/bajada/CTA según la especificación.
- Añadir CTA secundario a `#servicios`.
- Reemplazar los cuatro precios por “Desde $…”.
- Ajustar descripciones y añadir la nota de variación.
- Añadir botón “Quiero orientación”.
- Reemplazar credenciales, galería, ubicación y footer por lenguaje demostrativo.

- [ ] **Step 4: Ejecutar prueba y confirmar PASS**

Run:

```bash
npx playwright test tests/salon-commercial.spec.js -g "explains availability"
```

Expected: `PASS`.

- [ ] **Step 5: Commit**

```bash
git add tests/salon-commercial.spec.js demo-salon-belleza/index.html
git commit -m "feat: clarify salon commercial promise"
```

---

### Task 2: Hacer accesibles servicios, comparador, perfiles y móvil

**Files:**
- Modify: `tests/salon-commercial.spec.js`
- Modify: `demo-salon-belleza/index.html`

**Interfaces:**
- Consumes: `toggleService(id, title, price, duration)` y `sliderVal` de Alpine.
- Produces: botones `.service-card[aria-pressed]`, rango `#salon-comparison`, perfiles focusables y barra `.checkout-preview` contenida.

- [ ] **Step 1: Añadir pruebas accesibles y responsive fallidas**

```js
test('Service selection and comparison work with keyboard on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const service = page.getByRole('button', { name: /Corte de autor.*Desde \$35\.000/i });
  await service.focus();
  await page.keyboard.press('Enter');
  await expect(service).toHaveAttribute('aria-pressed', 'true');

  const checkout = page.locator('.checkout-preview');
  await expect(checkout).toBeVisible();
  await expect(checkout).toContainText('Revisar solicitud · $35.000 estimado');
  const box = await checkout.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  await expect(page.locator('#whatsapp-button')).toBeHidden();

  const range = page.locator('#salon-comparison');
  await expect(range).toHaveAttribute('type', 'range');
  await range.focus();
  await page.keyboard.press('Home');
  await expect(range).toHaveValue('0');
  await page.keyboard.press('End');
  await expect(range).toHaveValue('100');

  await expect(page.locator('.team-card').first()).toHaveAttribute('tabindex', '0');
  await expect(page.locator('.stylist-details').first()).toBeVisible();
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).resolves.toBe(true);
});
```

- [ ] **Step 2: Ejecutar y confirmar el fallo**

Run:

```bash
npx playwright test tests/salon-commercial.spec.js -g "keyboard on mobile"
```

Expected: `FAIL` porque las tarjetas y el comparador todavía son `div`, y la barra se recorta.

- [ ] **Step 3: Implementar controles y responsive**

- Convertir cada `.service-card` en `<button type="button">` con `:aria-pressed` y nombre compuesto por título/precio.
- Reemplazar el arrastre por `<input id="salon-comparison" type="range" min="0" max="100" x-model.number="sliderVal">` y conservar el indicador visual como decorativo.
- Añadir `tabindex="0"` a perfiles, estilos `:focus-within` y detalles visibles a ≤992 px.
- En móvil, convertir `.checkout-preview` en una acción de ancho disponible; ocultar `.checkout-info` secundaria y mostrar texto calculado por Alpine.
- Ocultar WhatsApp con `x-show="selectedServices.length === 0 && !bookingModal"`.
- Retirar el retorno flotante inferior al showcase.
- Llevar CTA móvil y cierre a mínimo 44 px.

- [ ] **Step 4: Ejecutar y confirmar PASS**

Run:

```bash
npx playwright test tests/salon-commercial.spec.js -g "keyboard on mobile"
```

Expected: `PASS`.

- [ ] **Step 5: Commit**

```bash
git add tests/salon-commercial.spec.js demo-salon-belleza/index.html
git commit -m "feat: make salon interactions accessible"
```

---

### Task 3: Construir una solicitud breve, veraz y aislada

**Files:**
- Modify: `tests/salon-commercial.spec.js`
- Modify: `tests/forms.spec.js`
- Modify: `tests/whatsapp-submit.spec.js`
- Modify: `demo-salon-belleza/index.html`
- Modify: `demo-salon-belleza/app.js`

**Interfaces:**
- Produces: `openBooking(useGuidance, trigger)`, `closeBooking()`, `chooseGuidance(trigger)`, `handleModalKeydown(event)`, `submitBooking()` y getters `requestSummary`/`checkoutLabel`.
- State: `needsGuidance:boolean`, `formError:string`, `lastTrigger:HTMLElement|null`, `minDate:string`.

- [ ] **Step 1: Añadir pruebas del diálogo y mensaje**

```js
test('Booking dialog contains focus and prepares a truthful WhatsApp request', async ({ page }) => {
  const heroCta = page.getByRole('button', { name: 'Solicitar disponibilidad' }).last();
  await heroCta.click();
  const dialog = page.getByRole('dialog', { name: 'Solicitar disponibilidad' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('#salon-name')).toBeFocused();
  await expect(page.locator('#salon-date')).toHaveAttribute('min', /^\d{4}-\d{2}-\d{2}$/);
  await expect(dialog.getByText('Quiero orientación')).toBeVisible();
  await expect(dialog.locator('label[for]').evaluateAll((labels) => labels.every((label) => document.getElementById(label.htmlFor)))).resolves.toBe(true);

  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Preparar solicitud por WhatsApp' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(heroCta).toBeFocused();

  await page.getByRole('button', { name: /Corte de autor/ }).click();
  await page.locator('.checkout-preview').getByRole('button').click();
  await page.locator('#salon-name').fill('Clienta QA');
  await page.locator('#salon-phone').fill('+56955556666');
  await page.locator('#salon-stylist').selectOption('stylist2');
  await page.locator('#salon-date').fill('2026-07-30');
  await page.locator('#salon-time').fill('16:00');
  await page.locator('#salon-comment').fill('Busco un cambio suave');

  const popupPromise = page.waitForEvent('popup');
  await dialog.getByRole('button', { name: 'Preparar solicitud por WhatsApp' }).click();
  const popup = await popupPromise;
  const url = decodeURIComponent(popup.url());
  expect(url).toContain('Quiero consultar disponibilidad');
  expect(url).toContain('Ariadna Ruiz');
  expect(url).toContain('Desde $35.000');
  expect(url).toContain('horario y el valor final se confirman');
  await expect(page.getByText('Tu solicitud quedó preparada en WhatsApp')).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem('tuwebpro_bookings'))).resolves.toBeNull();
});
```

- [ ] **Step 2: Ejecutar y confirmar el fallo**

Run:

```bash
npx playwright test tests/salon-commercial.spec.js -g "truthful WhatsApp"
```

Expected: `FAIL` por semántica, foco, campos y serialización actuales.

- [ ] **Step 3: Implementar estado y lógica en `app.js`**

- Eliminar `bookingStorageKey`, `saveBooking`, `autoStylist` y `handleDrag`.
- Añadir `needsGuidance`, `formError`, `lastTrigger` y fecha mínima local.
- Hacer que `toggleService` retire orientación y mantenga preferencia manual.
- `openBooking(true, trigger)` activa orientación solo cuando faltan servicios, guarda el disparador y enfoca `#salon-name` con `$nextTick`.
- `chooseGuidance(trigger)` limpia servicios y abre orientación.
- `handleModalKeydown` cierra con Escape y cicla Tab/Shift+Tab entre controles.
- Mapear `stylist1`, `stylist2` y `any` correctamente.
- Rechazar fechas anteriores con error positivo en `aria-live`.
- Serializar valores “Desde”, duración estimada, modalidad presencial y opcionales “Por conversar”.
- Preparar WhatsApp, restablecer estado y mostrar confirmación veraz.

- [ ] **Step 4: Simplificar y etiquetar el formulario**

- Añadir `role="dialog"`, `aria-modal`, `aria-labelledby`, `@keydown` y foco.
- Añadir introducción, servicio/orientación y nota de confirmación.
- Mantener nombre, teléfono, preferencia, fecha, hora y comentario.
- Retirar email y selector online.
- Añadir `id`, `for`, `autocomplete`, `:min="minDate"`, privacidad y `aria-live`.
- Cambiar Cancelar por “Seguir mirando” y submit por “Preparar solicitud por WhatsApp”.
- Aplicar `:inert` al contenido de fondo mientras el modal está abierto.

- [ ] **Step 5: Ajustar pruebas existentes**

En `tests/forms.spec.js`, retirar email y modalidad online del caso Salón; comprobar fecha/hora/comentario y preferencia `any` tras restablecer.

En `tests/whatsapp-submit.spec.js`, retirar email, cambiar `submitName` a `/Preparar solicitud por WhatsApp/i` y mantener nombre/teléfono/fecha/hora/comentario.

- [ ] **Step 6: Ejecutar suites de solicitud**

Run:

```bash
npx playwright test tests/salon-commercial.spec.js tests/forms.spec.js tests/whatsapp-submit.spec.js tests/modal-regression.spec.js
```

Expected: `PASS`.

- [ ] **Step 7: Commit**

```bash
git add demo-salon-belleza/index.html demo-salon-belleza/app.js tests/salon-commercial.spec.js tests/forms.spec.js tests/whatsapp-submit.spec.js
git commit -m "feat: prepare salon availability requests"
```

---

### Task 4: Rendimiento, movimiento y validación integral

**Files:**
- Modify: `tests/salon-commercial.spec.js`
- Modify: `demo-salon-belleza/index.html`

**Interfaces:**
- Produces: imágenes dimensionadas/diferidas, mapa nombrado y movimiento reducido.

- [ ] **Step 1: Añadir contrato de terminación**

```js
test('Salon assets and motion stay production-ready', async ({ page }) => {
  await expect(page.locator('.sidebar-cover')).toBeVisible();
  await expect(page.locator('.sidebar-bg')).toHaveCSS('animation-name', 'kenBurns');
  await expect(page.locator('.map-wrapper iframe')).toHaveAttribute('title', 'Ubicación demostrativa de Studio Chic en Providencia');
  const contentImages = page.locator('main img');
  await expect(contentImages.evaluateAll((images) => images.every((image) => image.hasAttribute('width') && image.hasAttribute('height')))).resolves.toBe(true);
  await expect(contentImages.evaluateAll((images) => images.every((image) => image.loading === 'lazy'))).resolves.toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.sidebar-bg')).toHaveCSS('animation-name', 'none');
});
```

- [ ] **Step 2: Implementar terminación**

- Añadir dimensiones `1024×1024`, `loading="lazy"` y `decoding="async"` a imágenes de contenido.
- Mantener hero como fondo prioritario mediante preload local de `hero.png`.
- Añadir título al iframe.
- Añadir `@media (prefers-reduced-motion: reduce)` para detener Ken Burns y reducir transiciones.
- Sustituir el halo de `.btn-luxury:hover` por sombra oscura con offset.
- Corregir atributo `class` duplicado.

- [ ] **Step 3: Ejecutar suite focalizada completa**

Run:

```bash
npx playwright test tests/salon-commercial.spec.js tests/demos-1-to-5-exhaustive.spec.js tests/forms.spec.js tests/whatsapp-submit.spec.js tests/modal-regression.spec.js
```

Expected: `PASS`.

- [ ] **Step 4: Ejecutar detector una vez tras los últimos cambios UI**

Run:

```bash
node /home/manager/.agents/skills/impeccable/scripts/detect.mjs --json demo-salon-belleza/index.html
```

Expected: `[]`.

- [ ] **Step 5: Ejecutar gate integral**

Run:

```bash
npm run qa:gate
```

Expected: `PASS` en checks estáticos, pruebas Node y navegación `file://`.

- [ ] **Step 6: Revisar diff y commit final**

```bash
git diff --check
git status --short
git add demo-salon-belleza/index.html tests/salon-commercial.spec.js
git commit -m "perf: finish salon booking experience"
```

