# Hero de confianza visible Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el titular del hero por “Que te vean. Que te crean.” y explicar el rol de la página como preparación para una conversación por WhatsApp.

**Architecture:** El cambio se limita al copy activo de la landing, sus metadatos y la documentación operativa. `index.html` conserva la estructura de dos líneas del `<h1>` y el gradiente de la segunda frase; las pruebas Playwright verificarán el nuevo título, el nuevo titular y la ausencia de la promesa anterior.

**Tech Stack:** HTML5, CSS, Alpine.js, Playwright, Node.js.

## Global Constraints

- Titular visual exacto en dos líneas: **“Que te vean”** y **“Que te crean”**.
- Texto de apoyo exacto: **“Una página clara para que tus clientes conozcan lo que ofreces antes de escribirte por WhatsApp.”**
- Mantener STAX como marca pública actual.
- Mantener un solo `<h1>`, `lang="es-CL"`, SEO existente y compatibilidad `file://`.
- No modificar precios, CTA, estructura del hero, imagen, demos ni flujo de WhatsApp.
- Actualizar solo referencias activas; las especificaciones históricas conservan el registro de decisiones anteriores.

---

## File Structure

- `index.html`: titular, texto de apoyo, título del documento y metadatos sociales.
- `README.md`: resumen comercial vigente para GitHub.
- `AGENTS.md`: propuesta comercial vigente para futuros mantenedores.
- `tests/root.spec.js`: título de página esperado durante navegación de demos.
- `tests/landing-exhaustive.spec.js`: título y texto del hero esperados.

### Task 1: Reemplazar el copy activo de la landing

**Files:**
- Modify: `index.html:6-15`
- Modify: `index.html:799-805`
- Modify: `README.md:3`
- Modify: `AGENTS.md:7`

**Interfaces:**
- Consumes: copy aprobado en `docs/superpowers/specs/2026-07-18-hero-confianza-visible-design.md`.
- Produces: el mismo mensaje de confianza en navegador, SEO, compartidos y documentación operativa.

- [ ] **Step 1: Actualizar título y metadatos**

Usar las siguientes cadenas en `index.html`; la puntuación se mantiene en metadatos para una lectura natural fuera del hero:

```html
<title>STAX | Que te vean. Que te crean.</title>
<meta property="og:title" content="Que te vean. Que te crean. | STAX" />
<meta name="twitter:title" content="Que te vean. Que te crean. | STAX" />
```

- [ ] **Step 2: Actualizar titular y texto de apoyo**

Forzar un bloque para la segunda frase, eliminando los puntos visuales:

```html
Que te vean
<span class="block bg-gradient-to-r from-orange-300 via-yellow-200 to-white bg-clip-text text-transparent">Que te crean</span>
```

Reemplazar el párrafo siguiente por:

```html
Una página clara para que tus clientes conozcan lo que ofreces antes de escribirte por WhatsApp.
```

- [ ] **Step 3: Actualizar documentación operativa**

En `README.md` y `AGENTS.md`, reemplazar la propuesta anterior por:

```markdown
**Que te vean. Que te crean.**
```

- [ ] **Step 4: Comprobar la eliminación del copy activo anterior**

Run:

```bash
rg -n -i "Muestra lo que haces|Atiende mejor por WhatsApp" index.html README.md AGENTS.md
```

Expected: sin coincidencias.

- [ ] **Step 5: Commit**

```bash
git add index.html README.md AGENTS.md
git commit -m "feat: strengthen hero trust message"
```

### Task 2: Actualizar regresiones y validar la landing

**Files:**
- Modify: `tests/root.spec.js:22,40`
- Modify: `tests/landing-exhaustive.spec.js:12-14`

**Interfaces:**
- Consumes: título `STAX | Que te vean. Que te crean.` y `<h1>` producido por Task 1.
- Produces: pruebas que rechazan una vuelta accidental a la promesa anterior.

- [ ] **Step 1: Cambiar expectativas de título en la prueba raíz**

En ambas aserciones de `tests/root.spec.js`, usar:

```js
await expect(page).toHaveTitle("STAX | Que te vean. Que te crean.");
```

- [ ] **Step 2: Cambiar expectativas exhaustivas del hero**

En `tests/landing-exhaustive.spec.js`, usar:

```js
await expect(page).toHaveTitle(/Que te vean\. Que te crean\./);
await expect(page.locator('h1')).toContainText('Que te vean Que te crean');
await expect(page.locator('h1 > span')).toHaveClass(/\bblock\b/);
await expect(page.locator('h1')).not.toContainText('Muestra lo que haces.');
```

- [ ] **Step 3: Ejecutar pruebas de regresión**

Run:

```bash
npm run test_root
npx playwright test tests/landing-exhaustive.spec.js
```

Expected: ambas ejecuciones finalizan en PASS.

- [ ] **Step 4: Ejecutar gate y revisión visual**

Run:

```bash
npm run qa:gate
```

Expected: resumen final `PASS`. Revisar la landing en viewport desktop y móvil para confirmar que las dos líneas del nuevo titular conservan contraste y no desbordan.

- [ ] **Step 5: Commit y publicar**

```bash
git add tests/root.spec.js tests/landing-exhaustive.spec.js
git commit -m "test: cover visible trust hero"
git push origin HEAD:refs/heads/main
```

## Self-Review

- Cobertura de spec: Task 1 actualiza título, metas, titular, texto de apoyo y documentación; Task 2 protege los cambios con pruebas, gate y revisión visual.
- Placeholder scan: no contiene `TBD`, `TODO`, “implement later” ni instrucciones incompletas.
- Consistencia: el titular y texto exactos se repiten de forma idéntica en restricciones, pasos y aserciones.
