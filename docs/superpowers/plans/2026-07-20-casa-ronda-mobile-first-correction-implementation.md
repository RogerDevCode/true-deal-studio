# Casa Ronda Mobile-First Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir Casa Ronda para que contraste, jerarquía, copy y composición respondan primero a móvil y permanezcan contenidos en escritorio.

**Architecture:** Conservar la página estática, Alpine y el activo fotográfico. Ampliar primero el contrato Playwright con mediciones visuales reproducibles; después reemplazar la escala CSS y los layouts base por una columna mobile-first, dejando las ampliaciones de escritorio detrás de `min-width`.

**Tech Stack:** HTML, CSS local, Alpine.js local, Playwright, Node.js 22.

## Global Constraints

- Conservar Casa Ronda, la fotografía, cinco secciones y el flujo de WhatsApp.
- Mantener compatibilidad `file://`, recursos locales y cero dependencias nuevas.
- Cada titular comunica una idea y ocupa como máximo dos líneas en 320, 390, 768 y 1440 px.
- En 390 px: `h1 <= 44 px`, `h2 <= 38 px`, títulos de tarjeta `<= 28 px`.
- En 1440 px: `h1 <= 64 px`, `h2 <= 48 px`.
- Todo texto funcional alcanza contraste mínimo `4.5:1`.
- Cero desplazamiento horizontal en 320, 390, 768 y 1440 px.
- Controles táctiles de al menos 44 px; campos de al menos 48 px y texto de entrada de al menos 16 px.
- No usar una sección completa con fondo coral ni texto blanco sobre coral.
- Hacer commit y push después de cada bloque modificado.

---

### Task 1: Definir el contrato visual mobile-first

**Files:**
- Modify: `tests/demo-casa-colores.spec.js`
- Test: `tests/demo-casa-colores.spec.js`

**Interfaces:**
- Consumes: elementos `[data-idea-heading]`, líneas `[data-idea-line]`, `.button-primary`, `.experience-grid`, campos del formulario.
- Produces: pruebas de tamaños, líneas, contraste, controles y ausencia de desborde para cuatro viewports.

- [ ] **Step 1: Añadir helpers de medición**

Agregar funciones que calculen luminancia WCAG, contraste y cantidad de rectángulos de línea mediante `Range#getClientRects()`:

```js
function channelToLinear(value) {
  const channel = value / 255;
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function contrastRatio(first, second) {
  const luminance = ([red, green, blue]) =>
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue);
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
}
```

- [ ] **Step 2: Añadir el test responsive rojo**

Para `320x844`, `390x844`, `768x1024` y `1440x1000`, verificar:

```js
const metrics = await page.evaluate(() => ({
  viewport: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  h1: parseFloat(getComputedStyle(document.querySelector("h1")).fontSize),
  h2: [...document.querySelectorAll("h2")].map((node) => parseFloat(getComputedStyle(node).fontSize)),
  cardTitles: [...document.querySelectorAll(".experience-card h3")].map((node) => parseFloat(getComputedStyle(node).fontSize)),
  fields: [...document.querySelectorAll(".field input, .field textarea")].map((node) => ({
    height: node.getBoundingClientRect().height,
    fontSize: parseFloat(getComputedStyle(node).fontSize),
  })),
  controls: [...document.querySelectorAll("button, .button, summary")].map((node) => node.getBoundingClientRect().height),
  experienceGrid: {
    overflowX: getComputedStyle(document.querySelector(".experience-grid")).overflowX,
    columns: getComputedStyle(document.querySelector(".experience-grid")).gridTemplateColumns,
  },
}));
```

En 320, 390 y 768 px exigir `overflowX !== "auto"` y tres pistas verticales en el flujo, no tarjetas parcialmente visibles.

Para cada `[data-idea-line]`, crear un `Range`, seleccionar su contenido y exigir entre uno y dos rectángulos totales por encabezado y exactamente un rectángulo por bloque de idea.

- [ ] **Step 3: Añadir el test de contraste rojo**

Leer las variables `--cta-bg`, `--cta-text`, `--surface-dark`, `--text-on-dark`, `--surface-light` y `--text-primary`, convertir sus valores RGB y exigir `contrastRatio >= 4.5` para los tres pares funcionales.

- [ ] **Step 4: Ejecutar el contrato rojo**

Run:

```bash
npx playwright test tests/demo-casa-colores.spec.js
```

Expected: `FAIL` porque faltan los atributos de idea, el `h1` móvil supera 44 px, existe el carrusel y el CTA actual mantiene blanco sobre coral.

- [ ] **Step 5: Commit y push del contrato**

```bash
git add tests/demo-casa-colores.spec.js
git commit -m "test: define Casa Ronda mobile-first contract"
git push
```

---

### Task 2: Aplicar el sistema editorial sereno

**Files:**
- Modify: `demo-casa-colores/index.html`
- Test: `tests/demo-casa-colores.spec.js`

**Interfaces:**
- Consumes: el estado existente `window.casaRondaApp` sin cambiar su firma.
- Produces: atributos `[data-idea-heading]` y `[data-idea-line]`, variables de contraste y layout mobile-first.

- [ ] **Step 1: Expresar cada idea con bloques explícitos**

Usar este patrón en los cinco encabezados:

```html
<h1 id="hero-title" data-idea-heading>
  <span data-idea-line>Aquí el cumpleaños</span>
  <span data-idea-line>se vive en ronda.</span>
</h1>
```

Repetir con los textos aprobados:

```text
Elige su manera / de celebrar.
Una tarde con / un plan claro.
Antes de reservar
Revisemos la fecha / contigo.
```

Cambiar el resumen dinámico seleccionado a `Elegiste ${selectedPackage.name}.` y el estado vacío a `Elige una experiencia.`

- [ ] **Step 2: Crear variables cromáticas verificables**

Definir:

```css
--surface-dark:#2d2032;
--surface-light:#fffdf8;
--surface-paper:#f7f1e8;
--surface-coral-soft:#f8e3dd;
--text-primary:#2d2032;
--text-secondary:#5b4d60;
--text-on-dark:#fffdf8;
--cta-bg:#f3c84b;
--cta-text:#2d2032;
```

`.button-primary` usa `var(--cta-bg)` y `var(--cta-text)`. El coral permanece como borde, indicador y selección.

- [ ] **Step 3: Sustituir la escala base por valores móviles**

```css
.section-copy h2{font-size:clamp(2rem,9.5vw,2.375rem);line-height:1}
.hero-copy h1{font-size:clamp(2.5rem,11.25vw,2.75rem);line-height:.98}
[data-idea-line]{display:block;white-space:nowrap}
.experience-card h3,.booking-summary h3{font-size:clamp(1.5rem,7vw,1.75rem);line-height:1}
```

El texto de cuerpo queda en 16 px y la información auxiliar en al menos 13 px.

- [ ] **Step 4: Convertir los componentes base a una columna**

- Hero: texto, acciones, datos, fotografía y nota estática bajo la imagen.
- Experiencias: `display:grid`, tarjetas completas, sin `overflow-x`, `scroll-snap`, rotaciones ni alturas mínimas forzadas.
- Recorrido: fondo coral suave, línea vertical y pasos sin cajas de colores alternadas.
- Preguntas: `details` interactivos en todos los tamaños y `summary` de al menos 44 px.
- Consulta: resumen y formulario apilados; inputs de al menos 48 px con texto de 16 px.

- [ ] **Step 5: Añadir ampliaciones de escritorio**

Dentro de `@media(min-width:900px)`:

```css
.hero-copy h1{font-size:4rem}
.section-copy h2{font-size:3rem}
.experience-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.story-route{grid-template-columns:repeat(5,minmax(0,1fr))}
.booking-shell{grid-template-columns:.78fr 1.22fr}
```

No añadir rotaciones, desplazamientos verticales ni tamaños superiores a los límites.

- [ ] **Step 6: Ejecutar el contrato focalizado**

Run:

```bash
npx playwright test tests/demo-casa-colores.spec.js
```

Expected: todos los tests `PASS`.

- [ ] **Step 7: Capturar e inspeccionar 390 y 1440 px**

Guardar capturas temporales en `/tmp`, verificar que ninguna idea quede fragmentada y corregir cualquier problema visible antes del commit.

- [ ] **Step 8: Commit y push del rediseño**

```bash
git add demo-casa-colores/index.html
git commit -m "fix: make Casa Ronda mobile-first"
git push
```

---

### Task 3: Cerrar QA y validar Vercel

**Files:**
- Modify only if a defect is found: `demo-casa-colores/index.html`, `tests/demo-casa-colores.spec.js`

**Interfaces:**
- Consumes: commit publicado en `main`.
- Produces: evidencia local y pública de la corrección.

- [ ] **Step 1: Ejecutar comprobaciones estáticas y focalizadas**

```bash
git diff --check
npx playwright test tests/demo-casa-colores.spec.js tests/root.spec.js tests/landing-exhaustive.spec.js
```

Expected: todos los tests `PASS`.

- [ ] **Step 2: Ejecutar la puerta completa**

```bash
npm run qa:gate
```

Expected: `PASS` para checks estáticos, suite Node y navegación `file://`.

- [ ] **Step 3: Corregir cualquier defecto y publicar**

Si una prueba o inspección encuentra un defecto, editar únicamente los archivos relacionados, repetir el test afectado y publicar un commit `fix:` focalizado.

- [ ] **Step 4: Esperar evidencia del despliegue**

Sondear `https://true-deal-studio.vercel.app/demo-casa-colores/index.html?release=<commit>` con Playwright hasta observar las variables `--cta-bg` y los atributos `[data-idea-heading]`.

- [ ] **Step 5: Validar el sitio público**

En 390 y 1440 px comprobar:

- HTTP 200;
- título y cinco secciones;
- fotografía cargada;
- tamaños y líneas dentro del contrato;
- cero desborde;
- cero errores de consola;
- selección de experiencia;
- consulta de WhatsApp preparada;
- reset completo.

Expected: toda la evidencia pública coincide con el commit final.

- [ ] **Step 6: Confirmar repositorio limpio**

```bash
git status --short
git log -1 --oneline
```

Expected: sin salida de estado y `HEAD` igual al commit validado en Vercel.
