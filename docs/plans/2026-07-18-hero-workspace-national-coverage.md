# Hero de espacio de trabajo y cobertura nacional Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el hero asociado a Santiago por una imagen profesional y neutra de un espacio de trabajo, y comunicar la atención en todo Chile en la landing principal.

**Architecture:** La landing seguirá siendo una página estática y compatible con `file://`. Un único recurso WebP local sustituirá las referencias activas al hero anterior en el preload y en CSS; el HTML conservará sus capas de gradiente y contraste. Las ubicaciones ficticias que viven dentro de cada demo se preservarán, mientras que el índice principal quedará libre de nombres de ciudades.

**Tech Stack:** HTML5, CSS, Tailwind CDN, Alpine.js, WebP, Playwright, Node.js.

## Global Constraints

- Usar la fotografía horizontal aprobada: espacio de trabajo de pequeña empresa, sin personas identificables, logos, texto, letreros, skyline, hitos ni referencias geográficas.
- Guardar el nuevo asset en `assets/optimized/hero-workspace.webp`; conservar `assets/optimized/santiago-hero.webp` sin referencias activas.
- Mantener los enlaces explícitos a `index.html` para compatibilidad `file://`.
- Usar la frase exacta **“Atención en todo Chile”** en la señal de confianza y en el pie de página de `index.html`.
- Mantener las ciudades que pertenecen al contenido interno de las demos; eliminar toda aparición de Santiago o Concepción de `index.html`.
- No usar `!important`, excepto las excepciones documentadas en `AGENTS.md`.
- Excluir `.superpowers/` del control de versiones.

---

## File Structure

- `assets/optimized/hero-workspace.webp`: nuevo fondo fotográfico horizontal para el hero.
- `index.html`: preload, CSS de fondo, copy de cobertura y descripción de la tarjeta de demo sin ciudad.
- `.gitignore`: exclusión de los artefactos locales del companion visual.
- `tests/root.spec.js`: regresión de la promesa nacional y ausencia de ciudades en la landing.

### Task 1: Añadir el recurso hero local y excluir artefactos de diseño

**Files:**
- Create: `assets/optimized/hero-workspace.webp`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: imagen generada según `docs/superpowers/specs/2026-07-18-hero-workspace-chile-design.md`.
- Produces: `./assets/optimized/hero-workspace.webp`, disponible tanto para el preload HTML como para `background-image` CSS.

- [ ] **Step 1: Generar la imagen horizontal aprobada**

Generar una fotografía editorial WebP de un espacio de trabajo de una pequeña empresa: escritorio ordenado, cuaderno, teléfono y materiales de negocio, luz natural, interés visual hacia la derecha y espacio limpio hacia la izquierda. Excluir texto, logos, letreros, personas identificables, skyline y cualquier referencia geográfica.

- [ ] **Step 2: Guardar el asset en la ruta estable**

Mover el resultado generado a `assets/optimized/hero-workspace.webp` y comprobar que sea un archivo WebP legible:

```bash
file assets/optimized/hero-workspace.webp
```

Expected: salida que identifique un archivo `Web/P image`.

- [ ] **Step 3: Ignorar el companion local**

Agregar esta línea al final de `.gitignore`:

```gitignore
# Local visual companion artifacts
.superpowers/
```

- [ ] **Step 4: Verificar el estado de los archivos**

Run:

```bash
git status --short
```

Expected: `assets/optimized/hero-workspace.webp` aparece como nuevo y `.superpowers/` deja de aparecer como no rastreado.

- [ ] **Step 5: Commit**

```bash
git add .gitignore assets/optimized/hero-workspace.webp
git commit -m "feat: add neutral workspace hero"
```

### Task 2: Conectar el hero y comunicar cobertura nacional

**Files:**
- Modify: `index.html:18`
- Modify: `index.html:514-526`
- Modify: `index.html:823`
- Modify: `index.html:1028`
- Modify: `index.html:2536`

**Interfaces:**
- Consumes: `./assets/optimized/hero-workspace.webp` producido en Task 1.
- Produces: una landing principal con hero neutro, la frase nacional exacta y ninguna aparición de `Santiago` o `Concepción`.

- [ ] **Step 1: Actualizar preload y fondo CSS**

Reemplazar las dos rutas activas de `santiago-hero.webp` por la misma ruta local:

```html
<link rel="preload" as="image" href="./assets/optimized/hero-workspace.webp" fetchpriority="high" />
```

```css
url('./assets/optimized/hero-workspace.webp');
```

- [ ] **Step 2: Cambiar la señal de confianza y el pie**

Sustituir ambos textos territoriales del índice por esta frase exacta:

```html
Atención en todo Chile
```

- [ ] **Step 3: Neutralizar la descripción de tarjeta que nombra una ciudad**

Reemplazar el texto de la tarjeta de fonoaudiología por:

```html
Sitio web cálido y profesional para fonoaudiología infantil a domicilio. Integra un diseño acogedor centrado en el juego, acompañamiento familiar y agenda de visitas.
```

- [ ] **Step 4: Revisar las referencias activas del índice**

Run:

```bash
rg -n -i "santiago|concepcion|santiago-hero" index.html
```

Expected: sin coincidencias.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: present national coverage in landing"
```

### Task 3: Proteger el cambio y ejecutar la validación completa

**Files:**
- Modify: `tests/root.spec.js:15-17`

**Interfaces:**
- Consumes: hero y copy nacional de Task 2.
- Produces: una prueba que detecta regresiones en la cobertura nacional y en nombres de ciudad de la landing.

- [ ] **Step 1: Escribir la prueba de regresión**

Después de comprobar el único `h1`, agregar estas aserciones a `tests/root.spec.js`:

```js
await expect(page.getByText("Atención en todo Chile", { exact: true })).toHaveCount(2);
await expect(page.locator("body")).not.toContainText(/Santiago|Concepción/i);
```

- [ ] **Step 2: Ejecutar la prueba específica**

Run:

```bash
npx playwright test tests/root.spec.js
```

Expected: PASS.

- [ ] **Step 3: Inspeccionar visualmente los viewports clave**

Abrir `index.html` en desktop y móvil; confirmar que el lado izquierdo conserva legibilidad para el titular, que el fondo no muestra un hito urbano y que el encuadre no tapa la señal de confianza.

- [ ] **Step 4: Ejecutar el gate de producción**

Run:

```bash
npm run qa:gate
```

Expected: resumen final `PASS`, sin errores de consola, enlaces locales inválidos ni fallos de navegación `file://`.

- [ ] **Step 5: Commit y publicar**

```bash
git add tests/root.spec.js
git commit -m "test: cover national landing messaging"
git push origin HEAD:refs/heads/main
```

## Self-Review

- Cobertura de spec: Task 1 genera y ubica el asset, conserva el asset anterior y excluye el companion; Task 2 actualiza las dos referencias del hero y toda ciudad del índice; Task 3 protege el copy, la ausencia de ciudades y el gate `file://`.
- Placeholder scan: no contiene `TBD`, `TODO`, “implement later”, ni referencias indefinidas.
- Consistencia: la ruta producida por Task 1 (`./assets/optimized/hero-workspace.webp`) coincide con las dos rutas consumidas en Task 2. Las dos apariciones esperadas de la frase nacional coinciden con la aserción exacta de Task 3.
