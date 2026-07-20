# Casa Ronda Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar Casa de los Colores por Casa Ronda, una demostración editorial y comercial que permite imaginar una celebración, entender cómo se organiza y consultar por WhatsApp sin compromiso.

**Architecture:** Mantener HTML estático, CSS local y Alpine.js, pero actualizar el estado de paquetes y el mensaje en `app.js`. Crear una fotografía conceptual local, reconstruir la página en cinco actos y actualizar la tarjeta de la landing sin alterar las otras demostraciones.

**Tech Stack:** HTML, CSS, SVG, WebP local, Alpine.js local, Playwright, Node.js 22.

## Global Constraints

- Mantener honestidad comercial, accesibilidad, funcionamiento offline y el flujo esencial de elegir una experiencia y preparar una consulta por WhatsApp.
- Usar la marca `Casa Ronda` y la promesa `Aquí el cumpleaños se vive en ronda.`
- Público principal: madres, padres y apoderados chilenos de niños de 4 a 10 años.
- Usar únicamente recursos locales y rutas compatibles con `file://`.
- No agregar CDN, fuentes remotas ni dependencias.
- Usar Archivo Black, Newsreader y DM Sans desde `../assets/fonts/`.
- Mantener `lang="es-CL"`, un único `h1`, foco visible, contraste WCAG AA y `prefers-reduced-motion`.
- No inventar dirección, testimonios, ventas, valoraciones, certificaciones ni garantías.
- Presentar valores `desde` y aclarar que consultar no cobra ni confirma automáticamente una reserva.
- Hacer commit y push después de cada bloque modificado.

---

### Task 1: Crear la fotografía conceptual de Casa Ronda

**Files:**
- Create: `demo-casa-colores/assets/casa-ronda-hero.webp`

**Interfaces:**
- Consumes: paleta berenjena, coral, caléndula, verde agua, azul y porcelana.
- Produces: imagen WebP local usada por `<img class="hero-photo">` con ruta `./assets/casa-ronda-hero.webp`.

- [ ] **Step 1: Generar la imagen**

Usar la skill `imagegen` con este prompt completo:

```text
Editorial overhead photograph for a fictional Chilean children's birthday venue called Casa Ronda. A beautifully prepared shared craft table seen strictly from above, warm late-afternoon natural light, children's hands only with no faces or identifiable people, hands drawing and cutting colorful paper circles, simple homemade birthday cake, ceramic plates, pencils, paper garland, linen napkins, subtle confetti. Sophisticated but joyful art direction for parents of children age 4 to 10. Color palette: deep aubergine, living coral, marigold yellow, muted aqua, porcelain white, restrained cobalt accents. Real tactile materials, candid editorial photography, gentle shadows, generous negative space on the upper-left for overlaid copy. No text, no logos, no brands, no licensed characters, no balloons blocking the table, no plastic stock-photo look, no oversaturation. Landscape 4:3 composition, high detail.
```

- [ ] **Step 2: Guardar y optimizar**

Guardar el resultado como:

```text
demo-casa-colores/assets/casa-ronda-hero.webp
```

Comprobar:

```bash
file demo-casa-colores/assets/casa-ronda-hero.webp
du -h demo-casa-colores/assets/casa-ronda-hero.webp
```

Expected: formato WebP y tamaño menor a 900 KB. Si el resultado no es WebP, convertir el archivo generado con la herramienta local disponible sin alterar la relación 4:3.

- [ ] **Step 3: Inspeccionar visualmente**

Abrir el activo y verificar:

- vista cenital;
- no hay rostros ni texto;
- manos anatómicamente plausibles;
- espacio negativo suficiente;
- materiales y comida no se ven sintéticos;
- paleta alineada con Casa Ronda.

- [ ] **Step 4: Commit del activo**

```bash
git add demo-casa-colores/assets/casa-ronda-hero.webp
git commit -m "feat: add Casa Ronda hero art"
git push origin main
```

---

### Task 2: Definir el contrato funcional Casa Ronda

**Files:**
- Modify: `tests/demo-casa-colores.spec.js`
- Test: `tests/demo-casa-colores.spec.js`

**Interfaces:**
- Consumes: página `/demo-casa-colores/index.html`.
- Produces: contrato para marca, cinco secciones, paquetes, preguntas, necesidad opcional, WhatsApp y reset.

- [ ] **Step 1: Sustituir el contrato anterior**

Mantener `installWindowOpenProbe` y reemplazar el test principal por:

```js
test("Casa Ronda prepara una consulta familiar de bajo riesgo y reinicia", async ({ page }) => {
  await installWindowOpenProbe(page);
  await page.goto("/demo-casa-colores/index.html");
  await waitForAlpine(page);
  const guards = await attachPageGuards(page);

  await expect(page).toHaveTitle("Casa Ronda | Celebraciones infantiles");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main > section")).toHaveCount(5);
  await expect(page.getByRole("heading", {
    level: 1,
    name: "Aquí el cumpleaños se vive en ronda.",
  })).toBeVisible();
  await expect(page.getByText("Consultar no tiene costo", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Antes de reservar" })).toBeVisible();
  await expect(page.getByText("¿Consultar significa pagar?", { exact: true })).toBeVisible();
  await expect(page.getByText("No. Preparar y enviar la consulta no realiza cobros ni confirma automáticamente una reserva.", { exact: true })).toBeVisible();
  await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(0);
  await expect(page.locator('img[src="./assets/casa-ronda-hero.webp"]')).toHaveCount(1);

  const planButton = page.getByRole("button", { name: "Elegir Ronda Pequeña" });
  await planButton.click();
  await expect(planButton).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Ronda Pequeña elegida para tu celebración")).toBeVisible();

  await page.getByLabel("Nombre de quien reserva").fill("Familia QA");
  await page.getByLabel("Edad que celebra").fill("7");
  await page.getByLabel("Cantidad de asistentes").fill("11");
  await page.getByLabel("Fecha preferida").fill("2026-08-15");
  await page.getByLabel("Necesidad que debemos conversar").fill("Alergia a los frutos secos");
  await page.getByRole("button", { name: "Preparar consulta por WhatsApp" }).click();

  const opened = decodeURIComponent(await page.evaluate(() => window.__lastOpenedUrl));
  expect(opened).toContain("https://wa.me/");
  expect(opened).toContain("Ronda Pequeña");
  expect(opened).toContain("7 años");
  expect(opened).toContain("11 asistentes");
  expect(opened).toContain("2026-08-15");
  expect(opened).toContain("Alergia a los frutos secos");

  await page.getByRole("button", { name: "Restablecer demo" }).click();
  await expect(page.getByText("Ronda Pequeña elegida para tu celebración")).toHaveCount(0);
  await expect(page.locator("#reserva-nombre")).toHaveValue("");
  await expect(page.locator("#reserva-necesidad")).toHaveValue("");
  await guards.assertHealthyContext();
});
```

- [ ] **Step 2: Ejecutar el contrato rojo**

Run:

```bash
npx playwright test tests/demo-casa-colores.spec.js
```

Expected: `FAIL` por el título `Casa Ronda | Celebraciones infantiles`.

- [ ] **Step 3: Commit del contrato**

```bash
git add tests/demo-casa-colores.spec.js
git commit -m "test: define Casa Ronda conversion contract"
git push origin main
```

---

### Task 3: Actualizar estado, paquetes y mensaje

**Files:**
- Modify: `demo-casa-colores/app.js`
- Test: `tests/demo-casa-colores.spec.js`

**Interfaces:**
- Produces: `window.casaRondaApp(): AlpineState`.
- State:

```js
{
  selectedPackage: null | Package,
  sent: boolean,
  packages: Package[],
  draft: {
    name: string,
    age: string,
    guests: string,
    date: string,
    needs: string,
  },
  choosePackage(plan: Package): void,
  resetDemo(): void,
  submitReservation(): void,
}
```

- [ ] **Step 1: Reemplazar paquetes y estado**

Usar:

```js
window.casaRondaApp = () => ({
  selectedPackage: null,
  sent: false,
  packages: [
    {
      name: "Ronda Pequeña",
      age: "4 a 7 años",
      duration: "2 horas",
      guests: "Hasta 12 niños",
      price: "$149.000",
      situation: "Un cumpleaños tranquilo con su grupo más cercano",
      tone: "small",
    },
    {
      name: "Manos a la Obra",
      age: "6 a 10 años",
      duration: "3 horas",
      guests: "Hasta 18 niños",
      price: "$189.000",
      situation: "Juego, materiales y una creación para llevar",
      tone: "create",
    },
    {
      name: "La Gran Ronda",
      age: "7 a 10 años",
      duration: "3 horas",
      guests: "Hasta 24 invitados",
      price: "$239.000",
      situation: "Más invitados y varios momentos para compartir",
      tone: "large",
    },
  ],
  draft: { name: "", age: "", guests: "", date: "", needs: "" },
```

- [ ] **Step 2: Mantener selección y ampliar reset**

```js
choosePackage(plan) {
  this.selectedPackage = plan;
  this.sent = false;
  document.getElementById("reserva")?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
},
resetDemo() {
  this.selectedPackage = null;
  this.sent = false;
  this.draft = { name: "", age: "", guests: "", date: "", needs: "" };
  localStorage.removeItem("stax-demo-casa-ronda");
},
```

- [ ] **Step 3: Construir el mensaje condicional**

```js
submitReservation() {
  const plan = this.selectedPackage;
  const needLine = this.draft.needs.trim()
    ? ` Necesitamos conversar: ${this.draft.needs.trim()}.`
    : "";
  const message = `Hola, soy ${this.draft.name}. Quiero consultar por ${plan.name} para un cumpleaños de ${this.draft.age} años, con ${this.draft.guests} asistentes, idealmente el ${this.draft.date}.${needLine}`;
  const url = `https://wa.me/56999040515?text=${encodeURIComponent(message)}`;
  localStorage.setItem("stax-demo-casa-ronda", JSON.stringify({
    plan: plan.name,
    ...this.draft,
  }));
  const opened = window.openWhatsAppWithFallback
    ? window.openWhatsAppWithFallback(url)
    : !!window.open(url, "_blank");
  if (opened) this.sent = true;
},
```

Cerrar el objeto y mantener un alias temporal para compatibilidad:

```js
window.casaColoresApp = window.casaRondaApp;
```

- [ ] **Step 4: Comprobar sintaxis**

```bash
node --check demo-casa-colores/app.js
```

Expected: sin salida y código 0.

- [ ] **Step 5: Commit del estado**

```bash
git add demo-casa-colores/app.js
git commit -m "feat: model Casa Ronda consultation"
git push origin main
```

---

### Task 4: Reconstruir la página Casa Ronda

**Files:**
- Modify: `demo-casa-colores/index.html`
- Consume: `demo-casa-colores/assets/casa-ronda-hero.webp`
- Consume: `demo-casa-colores/app.js`
- Test: `tests/demo-casa-colores.spec.js`

**Interfaces:**
- Body: `x-data="casaRondaApp()"`.
- Selection: `selectedPackage`, `choosePackage(plan)`.
- Form: `draft.name`, `draft.age`, `draft.guests`, `draft.date`, `draft.needs`.
- Main: cinco elementos `section` directos.

- [ ] **Step 1: Actualizar SEO, fuentes y marca**

Usar:

```html
<title>Casa Ronda | Celebraciones infantiles</title>
<meta name="description" content="Demo de celebraciones para niños de 4 a 10 años: experiencias claras, momentos acompañados y consulta sin costo por WhatsApp.">
<meta name="theme-color" content="#FFFDF8">
<meta property="og:title" content="Casa Ronda | Celebraciones infantiles">
<meta property="og:description" content="Aquí el cumpleaños se vive en ronda. Conoce el plan antes de consultar una fecha.">
<meta property="og:image" content="./assets/casa-ronda-hero.webp">
```

Definir `@font-face` para:

```css
Archivo Black: ../assets/fonts/archivo-black-400.ttf
Newsreader 500: ../assets/fonts/newsreader-500.ttf
Newsreader 700: ../assets/fonts/newsreader-700.ttf
DM Sans 400: ../assets/fonts/dm-sans-400.ttf
DM Sans 500: ../assets/fonts/dm-sans-500.ttf
DM Sans 700: ../assets/fonts/dm-sans-700.ttf
```

- [ ] **Step 2: Implementar sistema visual**

Tokens:

```css
:root {
  --aubergine: #2d2032;
  --coral: #f06459;
  --marigold: #f3c84b;
  --aqua: #a8d7cc;
  --play-blue: #4464ad;
  --porcelain: #fffdf8;
  --paper: #f7f1e8;
  --display: "Newsreader", Georgia, serif;
  --brand: "Archivo Black", system-ui, sans-serif;
  --body: "DM Sans", system-ui, sans-serif;
}
```

Reglas estructurales:

```css
.hero-layout { display:grid; min-height:calc(100dvh - 5rem); align-items:center; }
.hero-photo-frame { aspect-ratio:1; overflow:hidden; border-radius:50%; }
.hero-photo { width:100%; height:100%; object-fit:cover; }
.experience-card.is-selected { border-color:var(--coral); }
.story-route { display:grid; }
.questions-grid { display:grid; }
.booking-shell { display:grid; }
@media (min-width: 900px) {
  .hero-layout { grid-template-columns:.92fr 1.08fr; }
  .experience-grid { grid-template-columns:repeat(3,1fr); }
  .story-route { grid-template-columns:repeat(5,1fr); }
  .questions-grid { grid-template-columns:1fr 1fr; }
  .booking-shell { grid-template-columns:.8fr 1.2fr; }
}
```

- [ ] **Step 3: Crear hero**

Contenido:

```html
<section id="inicio" class="hero-section" aria-labelledby="hero-title">
  <div class="wrap hero-layout">
    <div class="hero-copy">
      <p class="brand-kicker">CASA RONDA · CELEBRACIONES</p>
      <h1 id="hero-title"><span>Aquí el cumpleaños</span><span>se vive en ronda.</span></h1>
      <p>Juegos, creación, comida y tiempo compartido para niños de 4 a 10 años. Conoce el plan antes de reservar.</p>
      <div class="hero-actions">
        <a href="#experiencias" class="button button-primary">Elegir una experiencia</a>
        <a href="#reserva" class="text-link">Consultar una fecha</a>
      </div>
      <ul class="hero-facts">
        <li>4 a 10 años</li>
        <li>Hasta 24 invitados</li>
        <li>Consultar no tiene costo</li>
      </ul>
    </div>
    <figure class="hero-photo-composition">
      <div class="hero-photo-frame">
        <img class="hero-photo" src="./assets/casa-ronda-hero.webp" alt="Mesa conceptual de celebración con pastel, papeles de colores y manos preparando una actividad creativa">
      </div>
      <figcaption><strong>Un plan claro para la familia</strong><span>Actividad, mesa y próximos pasos conversados antes de confirmar.</span></figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 4: Crear experiencias**

Usar `template x-for`:

```html
<article
  class="experience-card"
  :class="[`experience-card--${plan.tone}`, { 'is-selected': selectedPackage?.name === plan.name }]"
>
  <p x-text="plan.situation"></p>
  <h3 x-text="plan.name"></h3>
  <p x-text="plan.age"></p>
  <dl>
    <div><dt>Duración</dt><dd x-text="plan.duration"></dd></div>
    <div><dt>Grupo</dt><dd x-text="plan.guests"></dd></div>
    <div><dt>Valor desde</dt><dd x-text="plan.price"></dd></div>
  </dl>
  <button
    type="button"
    :aria-label="`Elegir ${plan.name}`"
    :aria-pressed="selectedPackage?.name === plan.name ? 'true' : 'false'"
    @click="choosePackage(plan)"
  >Elegir esta experiencia</button>
</article>
```

- [ ] **Step 5: Crear recorrido observable**

Implementar los cinco momentos exactos:

```text
Nos encontramos
Jugamos juntos
Creamos algo
Compartimos la mesa
Cerramos con calma
```

Cada momento usa un artículo semántico, un verbo y la descripción de la especificación. Conectar mediante una única ruta SVG decorativa con `aria-hidden="true"`.

- [ ] **Step 6: Crear “Antes de reservar”**

Usar cinco elementos `details`, el primero abierto. Mantener las respuestas textuales exactas de la especificación. En escritorio, CSS puede mostrar todo el contenido sin ocultarlo:

```css
@media (min-width: 800px) {
  .question details:not([open]) > :not(summary) { display:block; }
  .question summary { pointer-events:none; }
}
```

Agregar los compromisos:

```text
Información acordada antes de confirmar
Espacio preparado para recibir al grupo
Cierre y próximos pasos informados
```

- [ ] **Step 7: Crear consulta**

Mantener IDs actuales y agregar:

```html
<label for="reserva-necesidad">
  Necesidad que debemos conversar
  <textarea id="reserva-necesidad" x-model="draft.needs" maxlength="240" placeholder="Ej: alergia alimentaria, accesibilidad u otra consideración"></textarea>
</label>
```

Antes del CTA:

```html
<p class="no-risk-note">Consultar una fecha no realiza ningún cobro ni confirma la reserva.</p>
<button type="submit" :disabled="!selectedPackage">Preparar consulta por WhatsApp</button>
```

Mantener el resumen exacto:

```html
<h3 x-text="`${selectedPackage.name} elegida para tu celebración`"></h3>
```

- [ ] **Step 8: Declarar demo ficticio**

Footer:

```html
<p>Casa Ronda · Demo ficticio creado para mostrar una Vitrina Express.</p>
<a href="../index.html">Volver al portafolio STAX</a>
```

- [ ] **Step 9: Ejecutar contrato y revisión estática**

```bash
npx playwright test tests/demo-casa-colores.spec.js
rg -n 'https://fonts|fonts.googleapis|fonts.gstatic|cdn\\.' demo-casa-colores/index.html
git diff --check -- demo-casa-colores/index.html demo-casa-colores/app.js
```

Expected: test `passed`, `rg` sin resultados y `git diff --check` sin salida.

- [ ] **Step 10: Commit de Casa Ronda**

```bash
git add demo-casa-colores/index.html demo-casa-colores/app.js
git commit -m "feat: launch Casa Ronda celebration demo"
git push origin main
```

---

### Task 5: Actualizar la vitrina STAX

**Files:**
- Modify: `index.html`
- Modify: `tests/root.spec.js`
- Modify: `tests/landing-exhaustive.spec.js`

**Interfaces:**
- Consumes: ruta `./demo-casa-colores/index.html`.
- Produces: tarjeta Casa Ronda y textos consistentes con la nueva marca.

- [ ] **Step 1: Actualizar tarjeta**

Reemplazar:

```text
La Casa de los Colores
Celebraciones infantiles
```

Por:

```text
Casa Ronda
Celebraciones para niños
```

Actualizar descripción:

```text
Una vitrina que permite imaginar la celebración, comparar experiencias y consultar una fecha con el contexto familiar preparado.
```

La miniatura CSS usa un círculo coral, uno caléndula y un arco verde agua; no conserva el mosaico geométrico anterior.

- [ ] **Step 2: Actualizar aserciones de landing**

Agregar:

```js
await expect(page.getByText("Casa Ronda", { exact: true })).toBeAttached();
```

Mantener la ruta y el conteo actual de demos.

- [ ] **Step 3: Ejecutar regresión**

```bash
npx playwright test tests/root.spec.js tests/landing-exhaustive.spec.js
```

Expected: todos los tests `passed`.

- [ ] **Step 4: Commit de landing**

```bash
git add index.html tests/root.spec.js tests/landing-exhaustive.spec.js
git commit -m "feat: present Casa Ronda in STAX showcase"
git push origin main
```

---

### Task 6: Validación visual, QA y producción

**Files:**
- Modify only if defects exist: `demo-casa-colores/index.html`
- Test: `tests/demo-casa-colores.spec.js`
- Test: `tests/root.spec.js`

**Interfaces:**
- Consumes: Casa Ronda y landing desplegadas desde `main`.
- Produces: evidencia local y pública de diseño, interacción, offline y ausencia de regresiones.

- [ ] **Step 1: Capturar local**

Guardar:

```text
/tmp/casa-ronda-desktop.png  — 1440 × 1000
/tmp/casa-ronda-mobile.png   — 390 × 844
```

Verificar:

- CTA visible en el primer viewport móvil;
- fotografía sin recortes problemáticos;
- titular sin palabras huérfanas;
- cinco secciones con ritmo distinto;
- preguntas legibles;
- consulta sin sensación de compromiso;
- cero overflow horizontal.

- [ ] **Step 2: Ejecutar pruebas focalizadas**

```bash
npx playwright test tests/demo-casa-colores.spec.js tests/root.spec.js tests/landing-exhaustive.spec.js
```

Expected: todos los tests `passed`.

- [ ] **Step 3: Ejecutar gate**

```bash
npm run qa:gate
```

Expected: `PASS` en Static Repo Checks, Existing Node Test Suite, Headless file:// Navigation y Summary.

- [ ] **Step 4: Corregir defectos observados**

Modificar solo los archivos afectados, repetir capturas, pruebas y gate. No declarar éxito con evidencia parcial.

- [ ] **Step 5: Commit de correcciones, si corresponde**

```bash
git add demo-casa-colores/index.html demo-casa-colores/app.js index.html tests/demo-casa-colores.spec.js tests/root.spec.js tests/landing-exhaustive.spec.js
git commit -m "fix: polish Casa Ronda purchase journey"
git push origin main
```

Omitir este commit cuando no existan cambios.

- [ ] **Step 6: Validar Vercel**

Abrir:

```text
https://true-deal-studio.vercel.app/demo-casa-colores/index.html?release=<commit>
```

Comprobar:

- título `Casa Ronda | Celebraciones infantiles`;
- hero Casa Ronda;
- cinco secciones;
- imagen local cargada;
- selección `Ronda Pequeña`;
- pregunta de pago;
- campo de necesidad;
- cero overflow;
- consola y red limpias.

- [ ] **Step 7: Auditar Git**

```bash
git status --short
git log -6 --oneline
```

Expected: repositorio limpio y todos los commits publicados en `origin/main`.
