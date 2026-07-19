# Demo Nido Animal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an offline, photographic premium pet-care demo that prepares and persists a contextual booking.

**Architecture:** `demo-mascotas/index.html` is a self-contained editorial page that consumes five local photographs and Alpine data from `app.js`. `app.js` owns a namespaced `localStorage` record, validation and reset; Playwright verifies the visual-service path and persistent booking behavior.

**Tech Stack:** Static HTML, local CSS, local Alpine.js, JavaScript, browser `localStorage`, locally generated PNG/WebP images, Playwright.

## Global Constraints

- Use `lang="es-CL"`, exactly one `h1`, Open Graph/Twitter metadata and `PetService` JSON-LD.
- Keep every resource local and every route compatible with `file://`; do not add React, a CDN, a backend or a new dependency.
- Use local storage key `stax-demo-nido-animal`; reset only this key.
- Use clear Chilean Spanish and describe care without clinical or guaranteed-outcome claims.
- Respect visible focus, keyboard operation, contrast and `prefers-reduced-motion`.
- Preserve the existing unstaged edit to `demo-servicios-domiciliarios/index.html`.

---

### Task 1: Define the behavioural contract

**Files:**
- Create: `tests/demo-mascotas.spec.js`

**Interfaces:**
- Consumes: page at `/demo-mascotas/index.html`, Alpine initialization from `tests/helpers.js`.
- Produces: regression coverage for `nidoAnimalApp()` and `stax-demo-nido-animal`.

- [ ] **Step 1: Write the failing test**

```js
test('Nido Animal: elige un cuidado, guarda la reserva y reinicia solo su clave', async ({ page }) => {
  await page.goto('/demo-mascotas/index.html');
  await waitForAlpine(page);
  await page.evaluate(() => localStorage.setItem('stax-demo-hogar', 'sentinel'));
  await page.getByRole('button', { name: 'Reservar baño consciente' }).click();
  await page.getByLabel('Nombre de tu mascota').fill('Mora');
  await page.getByLabel('Especie').selectOption('Gato');
  await page.getByLabel('Fecha preferida').fill('2026-08-12');
  await page.getByLabel('Horario').selectOption('11:00');
  await page.getByRole('button', { name: 'Guardar reserva' }).click();
  await expect(page.getByText('Mora · Baño consciente')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Mora · Baño consciente')).toBeVisible();
  await page.getByRole('button', { name: 'Restablecer demo' }).click();
  await expect(page.getByText('Mora · Baño consciente')).toHaveCount(0);
  await expect(page.evaluate(() => localStorage.getItem('stax-demo-hogar'))).resolves.toBe('sentinel');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/demo-mascotas.spec.js`  
Expected: FAIL because `/demo-mascotas/index.html` does not exist.

- [ ] **Step 3: Commit the test scaffold**

```bash
git add tests/demo-mascotas.spec.js
git commit -m "test: cover premium pet booking demo"
```

### Task 2: Add local photographic evidence

**Files:**
- Create: `demo-mascotas/hero-cuidado.png`
- Create: `demo-mascotas/bano-consciente.png`
- Create: `demo-mascotas/peluqueria-raza.png`
- Create: `demo-mascotas/paseo-individual.png`
- Create: `demo-mascotas/hotel-dia.png`

**Interfaces:**
- Produces: five image assets referenced by relative paths in `index.html`.

- [ ] **Step 1: Generate the hero image with image generation**

Use this exact prompt:

```text
Use case: photorealistic-natural
Asset type: premium pet care editorial website hero
Primary request: a calm professional caregiver drying a happy medium-sized dog with a towel in a beautifully lit Chilean pet-care studio
Scene/backdrop: authentic boutique care space, wood, linen and plants, no medical equipment
Style/medium: candid high-end editorial photography
Composition/framing: wide horizontal image, caregiver and dog on the right half, clean negative space on the left, natural crop-safe composition
Lighting/mood: warm morning daylight, gentle, trustworthy, premium
Constraints: realistic fur, no text, no logos, no watermark, no childish props
Avoid: costumes, exaggerated eyes, sterile veterinary clinic, collage, illustration
```

- [ ] **Step 2: Generate four service images**

Use the same photographic direction with these subjects: a cat receiving a calm bath; a groomer trimming a small dog's coat; one handler walking a dog on a quiet urban green path; dogs resting in a light, calm day-care room. Use distinct landscape, portrait, square and wide crops so the gallery is editorial rather than a uniform card grid.

- [ ] **Step 3: Copy final outputs into `demo-mascotas/` and validate local files**

Run: `for image in demo-mascotas/*.png; do test -s "$image"; done`  
Expected: exit code `0`.

- [ ] **Step 4: Commit image assets**

```bash
git add demo-mascotas/*.png
git commit -m "feat: add Nido Animal photo assets"
```

### Task 3: Implement isolated booking state

**Files:**
- Create: `demo-mascotas/app.js`
- Test: `tests/demo-mascotas.spec.js`

**Interfaces:**
- Produces global `nidoAnimalApp()` for `x-data`.
- Storage format: `{ booking: { id, petName, species, service, date, time, note } | null }`.

- [ ] **Step 1: Add the minimal state module**

```js
const NIDO_STORAGE_KEY = 'stax-demo-nido-animal';
const emptyBooking = () => ({ petName: '', species: 'Perro', service: '', date: '', time: '', note: '' });

function nidoAnimalApp() {
  const saved = JSON.parse(localStorage.getItem(NIDO_STORAGE_KEY) || '{"booking":null}');
  return {
    booking: saved.booking,
    draft: emptyBooking(),
    selectedService: null,
    bookingOpen: false,
    openBooking(service) { this.selectedService = service; this.draft.service = service.name; this.bookingOpen = true; },
    closeBooking() { this.bookingOpen = false; this.draft = emptyBooking(); },
    saveBooking() {
      this.booking = { id: Date.now(), ...this.draft };
      localStorage.setItem(NIDO_STORAGE_KEY, JSON.stringify({ booking: this.booking }));
      this.closeBooking();
    },
    resetDemo() { localStorage.removeItem(NIDO_STORAGE_KEY); this.booking = null; this.closeBooking(); }
  };
}
```

- [ ] **Step 2: Run the focused test to verify its next missing page/UI failure**

Run: `npx playwright test tests/demo-mascotas.spec.js`  
Expected: FAIL on the missing page controls, not a JavaScript parse error.

- [ ] **Step 3: Commit the state module**

```bash
git add demo-mascotas/app.js
git commit -m "feat: add Nido Animal booking state"
```

### Task 4: Build the editorial conversion page

**Files:**
- Create: `demo-mascotas/index.html`
- Modify: `demo-mascotas/app.js`
- Test: `tests/demo-mascotas.spec.js`

**Interfaces:**
- Consumes `nidoAnimalApp()`, its `services` array and the five local image paths.
- Produces accessible photo cards, detail panel, booking dialog and saved-booking summary.

- [ ] **Step 1: Declare the four service records in `nidoAnimalApp()`**

```js
services: [
  { name: 'Baño consciente', duration: '75 min', price: '$32.000 desde', image: './bano-consciente.png', alt: 'Gato recibiendo un baño tranquilo con una cuidadora' },
  { name: 'Peluquería de raza', duration: '90 min', price: '$39.000 desde', image: './peluqueria-raza.png', alt: 'Peluquera recortando cuidadosamente el pelaje de un perro pequeño' },
  { name: 'Paseo individual', duration: '50 min', price: '$18.000 desde', image: './paseo-individual.png', alt: 'Cuidadora paseando a un perro por un sendero verde urbano' },
  { name: 'Hotel de día', duration: 'Jornada completa', price: '$28.000 desde', image: './hotel-dia.png', alt: 'Perros descansando en una sala luminosa de cuidado diurno' }
]
```

- [ ] **Step 2: Build the page in this section order**

```html
<header>…marca Nido Animal, navegación ancla y botón Restablecer demo…</header>
<main x-data="nidoAnimalApp()">
  <section id="inicio">…h1 y ./hero-cuidado.png…</section>
  <section id="cuidados">…<template x-for="service in services"> foto, duración, precio y botón :aria-label="`Reservar ${service.name}`" …</template></section>
  <section id="espacios">…tres recortes fotográficos y método recibimos/cuidamos/entregamos…</section>
  <section aria-live="polite" x-show="booking">…resumen x-text="booking.petName + ' · ' + booking.service"…</section>
</main>
<div x-show="bookingOpen" role="dialog" aria-modal="true">…formulario etiquetado…</div>
```

- [ ] **Step 3: Add metadata and structured data**

```html
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"PetService","name":"Nido Animal","areaServed":"Chile"}</script>
```

- [ ] **Step 4: Add the focused CSS system**

Use the approved tokens. The desktop service section must use an uneven 12-column grid (`.service-card--bath { grid-column: span 7 }`, `.service-card--groom { grid-column: span 5 }`, then `span 4` and `span 8`), collapse to one column below 720px, and use only short opacity/transform transitions. Include the mandatory styles:

```css
[x-cloak] { display: none !important; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 5: Run the behavioural test**

Run: `npx playwright test tests/demo-mascotas.spec.js`  
Expected: PASS.

- [ ] **Step 6: Commit the page**

```bash
git add demo-mascotas/index.html demo-mascotas/app.js tests/demo-mascotas.spec.js
git commit -m "feat: add Nido Animal premium pet demo"
```

### Task 5: Validate the public demo and regression suite

**Files:**
- Modify: `scripts/production_smoke.js` only if the demo is publicly deployed and its title is added to the public page list.

- [ ] **Step 1: Run static/offline validation**

Run: `npm run qa:gate`  
Expected: `PASS` and no remote-resource, file-route, metadata or console violation.

- [ ] **Step 2: Run the browser suite**

Run: `npm run qa:e2e`  
Expected: all tests pass, including `tests/demo-mascotas.spec.js`.

- [ ] **Step 3: Inspect desktop and mobile output**

Run: `npx playwright test tests/demo-mascotas.spec.js --project=chromium` and inspect 1440px and 390px screenshots. Confirm every photo has a meaningful alternative, hero text does not cover the hero photo, and the booking dialog remains scrollable.

- [ ] **Step 4: Commit any narrowly scoped validation correction**

```bash
git add demo-mascotas tests/demo-mascotas.spec.js scripts/production_smoke.js
git commit -m "fix: validate Nido Animal demo"
```
