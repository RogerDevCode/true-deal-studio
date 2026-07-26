# Benefits Demo Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir las tres evidencias visuales de “Tu oferta preparada para cada conversación” en enlaces claros hacia sus demostraciones correspondientes.

**Architecture:** La cuadrícula conservará su estructura y sus imágenes, mientras cada elemento directo pasará de `figure` a un enlace semántico. Una clase CSS específica mantendrá el ajuste horizontal móvil y añadirá foco visible; Playwright verificará destinos, apertura en la misma pestaña y navegación real.

**Tech Stack:** HTML estático, CSS local, Playwright, Chrome Headless y rutas relativas compatibles con `file://`.

## Global Constraints

- Mantener compatibilidad con `file://` mediante rutas explícitas `./demo-nombre/index.html`.
- Conservar recursos locales, imágenes, estructura de tres columnas y estilos temáticos existentes.
- Abrir las tres demostraciones en la misma pestaña.
- Mantener foco visible, texto alternativo útil y nombres accesibles.
- Mantener los cambios limitados a la evidencia visual y sus pruebas automatizadas.

---

### Task 1: Enlazar las evidencias visuales con sus demos

**Files:**
- Modify: `tests/landing-exhaustive.spec.js:82`
- Modify: `index.html:700-710`
- Modify: `index.html:1702-1715`

**Interfaces:**
- Consumes: el contenedor estable `[data-testid="benefits-visual-evidence"]` y las rutas públicas de las tres demos.
- Produces: tres enlaces `.benefits-demo-link` con `href` explícito, nombre accesible y navegación en la misma pestaña.

- [ ] **Step 1: Escribir la prueba que define destinos y navegación**

Agregar una prueba focalizada después de la prueba principal del hero en `tests/landing-exhaustive.spec.js`:

```js
test('Visual evidence links to corresponding demos with low-friction navigation', async ({ page }) => {
  const guards = await attachPageGuards(page);
  const visualEvidence = page.getByTestId('benefits-visual-evidence');
  const evidenceLinks = visualEvidence.locator('a.benefits-demo-link');

  await expect(evidenceLinks).toHaveCount(3);
  await expect(evidenceLinks.nth(0)).toHaveAttribute('href', './demo-fonoaudiologia/index.html');
  await expect(evidenceLinks.nth(1)).toHaveAttribute('href', './demo-salon-belleza/index.html');
  await expect(evidenceLinks.nth(2)).toHaveAttribute('href', './demo-ecommerce-tech/index.html');
  await expect(evidenceLinks.evaluateAll((links) => links.every((link) => link.target === ''))).resolves.toBe(true);

  await evidenceLinks.nth(0).click();
  await expect(page).toHaveURL(/\/demo-fonoaudiologia\/index\.html$/);
  await page.goBack();
  await waitForAlpine(page);
  await expect(visualEvidence).toBeVisible();
  await guards.assertHealthyContext();
});
```

- [ ] **Step 2: Ejecutar la prueba y confirmar el contrato pendiente**

Run:

```bash
npx playwright test tests/landing-exhaustive.spec.js -g "Visual evidence links"
```

Expected: `FAIL` porque la evidencia visual todavía contiene cero enlaces `.benefits-demo-link`.

- [ ] **Step 3: Añadir el patrón CSS accesible**

Reemplazar el selector de ajuste móvil y añadir el foco específico en `index.html`:

```css
.benefits-evidence > .benefits-demo-link {
  scroll-snap-align: start;
}
.benefits-demo-link:focus-visible {
  outline: 3px solid rgb(var(--drac-cyan));
  outline-offset: -3px;
}
```

- [ ] **Step 4: Convertir los tres elementos en enlaces semánticos**

Usar este patrón para cada elemento, cambiando ruta, nombre accesible, imagen y leyenda según su demo:

```html
<a href="./demo-fonoaudiologia/index.html" aria-label="Ver demo de fonoaudiología infantil: servicios y reservas" class="benefits-demo-link group relative min-h-44 overflow-hidden border-b border-drac-current/20 sm:border-b-0 sm:border-r">
  <img src="./assets/optimized/fonoaudiologia-card.webp" alt="Ejemplo de página para presentar servicios y facilitar una reserva" loading="lazy" decoding="async" class="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
  <span class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#172B4D] via-[#172B4D]/80 to-transparent px-5 pb-4 pt-10 text-sm font-bold text-white">
    <span>Servicios y reservas</span>
    <span aria-hidden="true" class="shrink-0 text-xs uppercase tracking-wider">Ver demo →</span>
  </span>
</a>
```

Aplicar el mismo patrón con estas correspondencias exactas:

```text
./demo-salon-belleza/index.html  | Ver demo de salón de belleza: atención en un local | Atención en un local
./demo-ecommerce-tech/index.html | Ver demo de tienda en línea: catálogo y productos  | Catálogo y productos
```

- [ ] **Step 5: Ejecutar la prueba focalizada y confirmar el recorrido**

Run:

```bash
npx playwright test tests/landing-exhaustive.spec.js -g "Visual evidence links"
```

Expected: `PASS`; los tres destinos son correctos, permanecen en la misma pestaña y el primer enlace navega a la demo de fonoaudiología.

- [ ] **Step 6: Ejecutar validación integral**

Run:

```bash
npm run qa:gate
```

Expected: `PASS` en comprobaciones estáticas, pruebas Node y navegación Headless bajo `file://`.

- [ ] **Step 7: Revisar formato y estado del worktree**

Run:

```bash
git diff --check
git status --short
```

Expected: `git diff --check` sin salida; `git status --short` muestra únicamente `index.html`, `tests/landing-exhaustive.spec.js` y el archivo preexistente `docs/auditoria.md`.

- [ ] **Step 8: Crear el commit focalizado**

```bash
git add index.html tests/landing-exhaustive.spec.js
git commit -m "feat: link visual evidence to demos"
```
