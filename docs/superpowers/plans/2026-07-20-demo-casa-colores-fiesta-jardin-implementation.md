# Fiesta Jardín Demo Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir Casa de los Colores en una vitrina cálida, orgánica y confiable para apoderados chilenos de niños de 4 a 10 años, preservando su reserva por WhatsApp.

**Architecture:** Mantener la página estática y el estado Alpine existente. Reemplazar en `index.html` la capa visual neo-brutalista por un sistema Fiesta Jardín con fuentes locales, una escena SVG decorativa y cuatro secciones semánticas; `app.js` conserva su API y solo entrega el estado ya disponible a las nuevas clases.

**Tech Stack:** HTML estático, CSS local, SVG inline, Alpine.js local, Playwright.

## Global Constraints

- Mantener `lang="es-CL"`, un único `h1`, cuatro hijos `section` directos dentro de `main` y el enlace `../index.html`.
- Conservar `window.casaColoresApp`, los nombres de paquetes, el enlace `wa.me`, la clave `stax-demo-casa-colores` y el restablecimiento completo.
- Usar únicamente recursos locales y mantener funcionamiento bajo `file://`.
- No agregar CDN, Google Fonts ni nuevas dependencias.
- Cargar `Instrument Serif` y `DM Sans` desde `../assets/fonts/`.
- Mantener foco visible, contraste WCAG AA y `prefers-reduced-motion`.
- No usar `!important` excepto en `[x-cloak]` y las reglas de movimiento reducido.
- No inventar testimonios, certificaciones, protocolos ni resultados.
- Preservar las modificaciones pendientes del archivo solo cuando sean compatibles con Fiesta Jardín; reemplazar deliberadamente la capa Mondrian rechazada.

---

### Task 1: Fijar el contrato visual y funcional

**Files:**
- Modify: `tests/demo-casa-colores.spec.js`
- Test: `tests/demo-casa-colores.spec.js`

**Interfaces:**
- Consumes: página `/demo-casa-colores/index.html` y `window.casaColoresApp`.
- Produces: contrato Playwright para la promesa Fiesta Jardín, recursos locales, selección, WhatsApp y reset.

- [ ] **Step 1: Añadir aserciones que fallen con el diseño actual**

Agregar dentro del test existente, después de `attachPageGuards(page)`:

```js
await expect(page.getByRole("heading", {
  level: 1,
  name: "Su día para jugar. Tu tranquilidad para disfrutarlo.",
})).toBeVisible();
await expect(page.getByText("4 a 10 años", { exact: true })).toBeVisible();
await expect(page.getByText("Grupos acotados", { exact: true })).toBeVisible();
await expect(page.getByRole("link", { name: "Consultar una fecha" })).toHaveAttribute("href", "#reserva");
await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(0);
await expect(page.locator('link[href*="fonts.gstatic.com"]')).toHaveCount(0);
await expect(page.locator(".celebration-scene")).toHaveCount(1);
await expect(page.getByText("Colación conversada", { exact: true })).toBeVisible();
```

Mantener sin cambios las aserciones de un `h1`, cuatro secciones, selección de Explora, contenido del mensaje, reset y guardas.

- [ ] **Step 2: Ejecutar el test y verificar el fallo esperado**

Run:

```bash
npx playwright test tests/demo-casa-colores.spec.js
```

Expected: `FAIL` porque el `h1` Fiesta Jardín y `.celebration-scene` todavía no existen.

- [ ] **Step 3: Revisar que el test no dependa de decoración frágil**

El test puede consultar `.celebration-scene` como firma visual, pero no debe comprobar coordenadas SVG, colores exactos, radios ni número de confetis.

- [ ] **Step 4: Commit del contrato rojo**

```bash
git add tests/demo-casa-colores.spec.js
git commit -m "test: define Fiesta Jardin demo contract"
git push origin main
```

Expected: solo `tests/demo-casa-colores.spec.js` en el commit.

---

### Task 2: Sustituir la identidad Mondrian por Fiesta Jardín

**Files:**
- Modify: `demo-casa-colores/index.html`
- Preserve: `demo-casa-colores/app.js`
- Test: `tests/demo-casa-colores.spec.js`

**Interfaces:**
- Consumes: `packages`, `selectedPackage`, `draft`, `choosePackage`, `submitReservation` y `resetDemo` desde `casaColoresApp()`.
- Produces: clases `.celebration-scene`, `.experience-card`, `.care-path` y `.booking-shell`; mantiene todos los nombres accesibles usados por Playwright.

- [ ] **Step 1: Eliminar recursos y tokens rechazados**

Quitar:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk..." rel="stylesheet">
```

Reemplazar los tokens por:

```css
@font-face {
  font-family: "Instrument Serif";
  src: url("../assets/fonts/instrument-serif-400.ttf") format("truetype");
  font-display: swap;
}
@font-face {
  font-family: "DM Sans";
  src: url("../assets/fonts/dm-sans-400.ttf") format("truetype");
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "DM Sans";
  src: url("../assets/fonts/dm-sans-500.ttf") format("truetype");
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: "DM Sans";
  src: url("../assets/fonts/dm-sans-700.ttf") format("truetype");
  font-weight: 700;
  font-display: swap;
}
:root {
  --cloud: #fff9f3;
  --surface: #fffefd;
  --plum: #352b38;
  --berry: #b83f68;
  --sky: #78b7c4;
  --leaf: #6e8b72;
  --peach: #f2a27f;
  --line: rgba(53, 43, 56, 0.16);
  --display: "Instrument Serif", Georgia, serif;
  --body: "DM Sans", system-ui, sans-serif;
}
```

- [ ] **Step 2: Reconstruir header y hero**

Usar un enlace para saltar al contenido, navegación local y este contenido:

```html
<section id="inicio" class="hero garden-section" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="eyebrow">Celebraciones para niños de 4 a 10 años</p>
    <h1 id="hero-title">
      <span>Su día para jugar.</span>
      <span>Tu tranquilidad para disfrutarlo.</span>
    </h1>
    <p class="hero-lead">Preparamos el espacio, una actividad y los momentos principales para que la familia sepa qué esperar antes de reservar.</p>
    <div class="hero-actions">
      <a class="button button-primary" href="#paquetes">Ver experiencias</a>
      <a class="text-link" href="#reserva">Consultar una fecha</a>
    </div>
    <ul class="trust-list" aria-label="Datos principales">
      <li>4 a 10 años</li>
      <li>Grupos acotados</li>
      <li>Consulta por WhatsApp</li>
    </ul>
  </div>
  <div class="celebration-scene" aria-hidden="true">
    <svg viewBox="0 0 620 540" role="presentation">
      <path class="garland-line" d="M36 92 Q170 12 306 88 T584 72"/>
      <path class="garland-leaf" d="M96 61c24 5 33 23 21 41-22-4-31-22-21-41Z"/>
      <path class="garland-leaf" d="M266 61c22 8 28 27 13 43-21-7-27-25-13-43Z"/>
      <path class="garland-leaf" d="M455 53c24 4 34 21 23 40-23-3-33-21-23-40Z"/>
      <ellipse class="scene-rug" cx="316" cy="454" rx="248" ry="55"/>
      <path class="scene-table" d="M150 304h330l-28 148H178Z"/>
      <path class="scene-cake" d="M258 250h118v56H258Z"/>
      <path class="scene-cake-top" d="M246 250c26-30 112-30 142 0Z"/>
      <circle class="scene-child scene-child-one" cx="122" cy="302" r="48"/>
      <circle class="scene-child scene-child-two" cx="506" cy="293" r="52"/>
    </svg>
    <p class="scene-note"><strong>Espacio preparado</strong><span>Actividad, colación y acompañamiento</span></p>
  </div>
</section>
```

CSS obligatorio:

```css
.hero {
  display: grid;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
  min-height: calc(100dvh - 5rem);
  padding: clamp(4rem, 8vw, 7rem) 0;
}
.hero h1 {
  max-width: 11ch;
  font-family: var(--display);
  font-size: clamp(3.5rem, 7vw, 7.3rem);
  font-weight: 400;
  line-height: .88;
  letter-spacing: -.045em;
  text-wrap: balance;
}
.hero h1 span { display: block; }
.celebration-scene {
  position: relative;
  min-height: 32rem;
  border-radius: 46% 54% 42% 58% / 55% 42% 58% 45%;
  background: color-mix(in srgb, var(--sky) 22%, white);
  box-shadow: 0 2rem 5rem rgba(103, 65, 83, .16);
}
@media (min-width: 900px) {
  .hero { grid-template-columns: .9fr 1.1fr; }
}
```

- [ ] **Step 3: Reconstruir experiencias con composición escalonada**

Mantener el `template x-for` y usar:

```html
<article
  class="experience-card"
  :class="{ 'is-selected': selectedPackage?.name === plan.name }"
>
  <p class="experience-fit" x-text="plan.fit"></p>
  <h3 x-text="plan.name"></h3>
  <p class="experience-age" x-text="plan.age"></p>
  <dl>
    <div><dt>Duración</dt><dd x-text="plan.duration"></dd></div>
    <div><dt>Grupo</dt><dd x-text="plan.guests"></dd></div>
    <div><dt>Valor desde</dt><dd x-text="plan.price"></dd></div>
  </dl>
  <button type="button" :aria-label="`Elegir ${plan.name}`" @click="choosePackage(plan)" x-text="selectedPackage?.name === plan.name ? `${plan.name} elegido` : `Elegir ${plan.name}`"></button>
</article>
```

No añadir `fit` a `app.js`; resolverlo en HTML con un mapa local Alpine:

```html
<p class="experience-fit" x-text="{
  Explora: 'Una celebración pequeña para jugar con calma',
  Crea: 'Actividad manual y un recuerdo para llevar',
  Celebra: 'Más espacio para compartir con el curso o la familia'
}[plan.name]"></p>
```

En escritorio, usar columnas `.84fr 1.08fr .9fr` con desplazamientos verticales diferentes. En móvil, usar `display:flex`, `overflow-x:auto`, `scroll-snap-type:x mandatory` y tarjetas de `min-width:min(84vw, 21rem)`.

- [ ] **Step 4: Reconstruir “Qué cuidamos” como recorrido**

Usar un solo contenedor `.care-path` con cuatro artículos alternados y una línea SVG decorativa:

```html
<div class="care-path">
  <svg class="care-route" viewBox="0 0 1000 260" aria-hidden="true"><path d="M40 130 C180 20 280 230 430 120 S700 20 960 132"/></svg>
  <article><span aria-hidden="true">✦</span><h3>Juegos acompañados</h3><p>Actividades pensadas para la edad y el tamaño del grupo.</p></article>
  <article><span aria-hidden="true">◌</span><h3>Momento creativo</h3><p>Materiales preparados para crear algo que puedan llevar.</p></article>
  <article><span aria-hidden="true">❋</span><h3>Colación conversada</h3><p>Revisamos alternativas y restricciones antes de confirmar.</p></article>
  <article><span aria-hidden="true">⌁</span><h3>Adultos informados</h3><p>Horario, capacidad y próximos pasos claros para la familia.</p></article>
</div>
<p class="care-note">La disponibilidad, el menú y cualquier necesidad específica se confirman por WhatsApp antes de reservar.</p>
```

- [ ] **Step 5: Rediseñar reserva sin cambiar el contrato**

Conservar todos los `for`, `id`, `x-model`, `required`, límites y textos usados por Playwright. Envolver el resumen y el formulario en `.booking-shell`; usar fondo hoja muy claro en el resumen y superficie blanca en el formulario.

El texto con selección debe seguir siendo:

```html
<h3 x-text="`${selectedPackage.name} elegido para tu celebración`"></h3>
```

El botón debe seguir siendo:

```html
<button class="button button-primary" type="submit" :disabled="!selectedPackage">
  Preparar mensaje por WhatsApp
</button>
```

- [ ] **Step 6: Ejecutar la prueba focalizada**

Run:

```bash
npx playwright test tests/demo-casa-colores.spec.js
```

Expected: `1 passed`.

- [ ] **Step 7: Revisar recursos remotos y rutas**

Run:

```bash
rg -n 'https://fonts|fonts.googleapis|fonts.gstatic|cdn\\.' demo-casa-colores/index.html
```

Expected: sin resultados.

Run:

```bash
git diff --check -- demo-casa-colores/index.html
```

Expected: sin salida.

- [ ] **Step 8: Commit del rediseño**

```bash
git add demo-casa-colores/index.html
git commit -m "feat: redesign Casa de los Colores for families"
git push origin main
```

---

### Task 3: Validación visual, regresión y producción

**Files:**
- Modify only if validation finds a defect: `demo-casa-colores/index.html`
- Test: `tests/demo-casa-colores.spec.js`
- Test: `tests/root.spec.js`

**Interfaces:**
- Consumes: demo Fiesta Jardín completo y despliegue Vercel de `main`.
- Produces: evidencia local y pública de responsive, navegación, interacción y ausencia de errores.

- [ ] **Step 1: Capturar escritorio y móvil**

Ejecutar Playwright con un servidor local y guardar:

```text
/tmp/casa-colores-fiesta-jardin-desktop.png  (1440 × 1000)
/tmp/casa-colores-fiesta-jardin-mobile.png   (390 × 844)
```

Revisar visualmente:

- ausencia de bloques negros o colores neón;
- hero cálido y asimétrico;
- titulares sin palabras huérfanas;
- paquetes legibles y selección visible;
- sin desbordamiento horizontal;
- CTA principal visible en el primer viewport móvil.

- [ ] **Step 2: Ejecutar regresión de demo y landing**

Run:

```bash
npx playwright test tests/demo-casa-colores.spec.js tests/root.spec.js
```

Expected: todos los tests `passed`.

- [ ] **Step 3: Ejecutar gate de preproducción**

Run:

```bash
npm run qa:gate
```

Expected: salida final `PASS`. Si el proceso no entrega resultado, registrar el fallo real y no afirmar que pasó.

- [ ] **Step 4: Corregir únicamente defectos observados**

Aplicar cambios focalizados en `demo-casa-colores/index.html`, repetir Steps 1–3 y comprobar:

```bash
git diff --check
git status --short
```

- [ ] **Step 5: Commit de correcciones, si existen**

```bash
git add demo-casa-colores/index.html tests/demo-casa-colores.spec.js
git commit -m "fix: polish Fiesta Jardin responsive layout"
git push origin main
```

Omitir el commit si no existen cambios.

- [ ] **Step 6: Validar Vercel**

Abrir:

```text
https://true-deal-studio.vercel.app/demo-casa-colores/index.html?release=<commit>
```

Comprobar con Playwright:

- título `La Casa de los Colores | Celebraciones infantiles`;
- un `h1`;
- cuatro secciones;
- texto `Su día para jugar. Tu tranquilidad para disfrutarlo.`;
- selección de `Explora`;
- ausencia de errores de consola y red.

- [ ] **Step 7: Confirmar estado Git**

Run:

```bash
git status --short
git log -3 --oneline
```

Expected: sin cambios generados por esta implementación; cualquier cambio previo ajeno debe identificarse de forma explícita.
