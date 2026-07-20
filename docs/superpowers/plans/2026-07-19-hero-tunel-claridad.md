# Hero Túnel de Claridad Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Incorporar al hero de STAX un panel visual accesible que explique cómo una consulta se transforma en una conversación de WhatsApp preparada.

**Architecture:** `index.html` conserva la landing estática y el hero de dos columnas. El mockup derecho se sustituye por un componente HTML `.clarity-tunnel` de cuatro capas de texto; CSS controla su profundidad y una clase `is-visible` inicia una única secuencia mediante `IntersectionObserver` local. Las pruebas Playwright validan estructura, activación y ausencia de overflow.

**Tech Stack:** HTML estático, CSS local, JavaScript local, Alpine.js local existente y Playwright.

## Global Constraints

- Mantener compatibilidad `file://`, recursos locales y rutas explícitas.
- No añadir React, GSAP, CDN, fuentes remotas ni otra dependencia.
- Mantener `lang="es-CL"`, un único `h1`, SEO y JSON-LD de la landing.
- El movimiento debe durar una pasada, no ser decorativo infinito y respetar `prefers-reduced-motion`.
- No modificar CTA, navegación ni el texto de oferta existente.

---

### Task 1: Probar el contrato del panel

**Files:**
- Modify: `tests/landing-exhaustive.spec.js`
- Modify: `index.html:781-970`

**Interfaces:**
- Consumes: La landing servida por el `webServer` de Playwright.
- Produces: El contrato `section#inicio .clarity-tunnel` con cuatro nodos `[data-clarity-step]` y la clase de estado `is-visible`.

- [ ] **Step 1: Escribir la prueba inicialmente fallida**

```js
test("Hero clarity tunnel exposes four readable stages without overflow", async ({ page }) => {
  await page.goto("/");
  const tunnel = page.locator(".clarity-tunnel");
  await expect(tunnel).toBeVisible();
  await expect(tunnel.locator("[data-clarity-step]")).toHaveCount(4);
  await expect(tunnel).toContainText("Consulta suelta");
  await expect(tunnel).toContainText("WhatsApp con contexto");
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
});
```

- [ ] **Step 2: Ejecutar la prueba para confirmar el fallo**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "clarity tunnel" --reporter=line`

Expected: FAIL because `.clarity-tunnel` does not exist.

- [ ] **Step 3: Añadir la estructura semántica mínima al hero**

Reemplazar el mockup derecho por una figura con una etiqueta de lector de pantalla y cuatro artículos en este orden:

```html
<figure class="clarity-tunnel" aria-label="Ruta de claridad: consulta, información, página y WhatsApp con contexto">
  <figcaption class="clarity-tunnel__caption">Ruta de claridad</figcaption>
  <article class="clarity-tunnel__step clarity-tunnel__step--query" data-clarity-step>...</article>
  <article class="clarity-tunnel__step clarity-tunnel__step--details" data-clarity-step>...</article>
  <article class="clarity-tunnel__step clarity-tunnel__step--page" data-clarity-step>...</article>
  <article class="clarity-tunnel__step clarity-tunnel__step--whatsapp" data-clarity-step>...</article>
</figure>
```

Each article contains its named heading and concrete business information; the fourth includes the literal label `WhatsApp con contexto` and final status `Listo para atender`.

- [ ] **Step 4: Ejecutar la prueba para confirmar el contrato**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "clarity tunnel" --reporter=line`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/landing-exhaustive.spec.js
git commit -m "test: cover hero clarity tunnel structure"
```

### Task 2: Diseñar el carril y una animación finita

**Files:**
- Modify: `index.html:510-650` (bloque CSS local)
- Modify: `index.html:850-970` (panel del hero)

**Interfaces:**
- Consumes: `.clarity-tunnel`, sus modificadores de paso y `.clarity-tunnel.is-visible` definidos en Task 1.
- Produces: Panel responsive con recorrido visual, contraste legible y estado estático con reducción de movimiento.

- [ ] **Step 1: Ampliar la prueba con el estado de activación**

```js
await expect(tunnel).toHaveClass(/is-visible/);
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload();
await expect(tunnel.locator("[data-clarity-step]").first()).toBeVisible();
```

- [ ] **Step 2: Ejecutar para confirmar el fallo**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "clarity tunnel" --reporter=line`

Expected: FAIL because no visibility state is assigned.

- [ ] **Step 3: Implementar estilos acotados**

Add `.clarity-tunnel` rules with deep-blue translucent surface, diagonal track pseudo-element, four staggered cards, and keyframes named `clarity-arrive` that run once. Add a mobile media query that resets transforms, places cards in one column, and removes the diagonal track. Extend the existing reduced-motion block with:

```css
@media (prefers-reduced-motion: reduce) {
  .clarity-tunnel__step { animation: none; opacity: 1; transform: none; }
}
```

Use white or near-white foreground text, `#50FA7B` only for the WhatsApp state, and `#D52B1E` only for a small progress accent.

- [ ] **Step 4: Implementar la activación local**

At the bottom inline script, add this isolated initializer after the DOM is available:

```js
const tunnel = document.querySelector('.clarity-tunnel');
if (tunnel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    tunnel.classList.add('is-visible');
    observer.disconnect();
  }, { threshold: 0.35 });
  observer.observe(tunnel);
} else if (tunnel) {
  tunnel.classList.add('is-visible');
}
```

- [ ] **Step 5: Ejecutar la prueba focalizada**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "clarity tunnel" --reporter=line`

Expected: PASS on standard and reduced-motion reload.

- [ ] **Step 6: Capturar revisión visual en dos viewports**

Run:

```bash
npx playwright screenshot --browser chromium --viewport-size="1440,960" http://127.0.0.1:4175 /tmp/stax-tunnel-desktop.png
npx playwright screenshot --browser chromium --viewport-size="390,844" http://127.0.0.1:4175 /tmp/stax-tunnel-mobile.png
```

Expected: no clipped cards, no horizontal overflow and no visual competition with the headline/CTA.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/landing-exhaustive.spec.js
git commit -m "feat: add hero clarity tunnel panel"
```

### Task 3: Ejecutar regresión y publicar

**Files:**
- Verify: `index.html`
- Verify: `tests/landing-exhaustive.spec.js`

**Interfaces:**
- Consumes: Panel y prueba focalizada de Tasks 1–2.
- Produces: Validación de proyecto completa y rama `main` remota actualizada.

- [ ] **Step 1: Ejecutar la suite E2E**

Run: `npm run qa:e2e`

Expected: PASS.

- [ ] **Step 2: Ejecutar la puerta de preproducción**

Run: `npm run qa:gate`

Expected: `PASS Preproduction Gate Summary`.

- [ ] **Step 3: Revisar cambios y publicar**

Run:

```bash
git status --short
git push origin main
git status --short
```

Expected: worktree clean and `main` synchronized with `origin/main`.
