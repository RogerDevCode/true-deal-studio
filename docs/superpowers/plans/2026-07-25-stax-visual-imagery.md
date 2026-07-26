# STAX Visual Imagery Implementation Plan

> **For agentic workers:** Execute inline and validate each task before continuing.

**Goal:** Añadir riqueza visual a STAX sin competir con la propuesta, aumentar la carga cognitiva ni introducir afirmaciones visuales falsas.

**Architecture:** Integrar activos generados y reutilizar capturas existentes. El Hero recibe una imagen ambiental decorativa; Necesidades usa cinco recortes optimizados derivados de una misma composición; Beneficios incorpora una composición editorial con imágenes reales de demos. Todo conserva `file://`, Alpine local y la jerarquía actual.

**Tech Stack:** HTML estático, CSS/Tailwind compilado existente, Alpine.js local, Playwright, activos WebP.

## Global Constraints

- No usar personas, texto, logos ni pantallas generadas como prueba de autenticidad.
- El simulador sigue siendo el protagonista del Hero.
- No agregar imágenes a Precios, FAQ o Contacto.
- Recursos bajo el primer viewport usan carga diferida cuando corresponda.
- Mantener navegación `file://` y recursos locales.

---

### Task 1: Activos generados

**Files:**
- Create: `assets/visuals/stax-hero-atmosphere.webp`
- Create: `assets/visuals/stax-need-local.webp`
- Create: `assets/visuals/stax-need-delivery.webp`
- Create: `assets/visuals/stax-need-reservations.webp`
- Create: `assets/visuals/stax-need-catalog.webp`
- Create: `assets/visuals/stax-need-online-payment.webp`

- [x] Generar un fondo editorial abstracto sin texto y con espacio negativo.
- [x] Generar una composición con cinco escenas coherentes y derivar sus recortes: local, delivery, reservas, catálogo y cobro.
- [x] Inspeccionar los resultados y descartar cualquier texto, logo o artefacto visual.
- [x] Convertir a WebP sin sobrescribir activos existentes.

### Task 2: Contratos visuales automatizados

**Files:**
- Modify: `tests/landing-exhaustive.spec.js`

- [x] Exigir que el Hero referencie el nuevo fondo local.
- [x] Exigir cinco visuales decorativos dentro de Necesidades.
- [x] Exigir una composición con tres imágenes reales dentro de Beneficios.
- [x] Mantener las verificaciones de overflow móvil y consola.

### Task 3: Integración mínima

**Files:**
- Modify: `index.html`

- [x] Añadir el fondo ambiental detrás del contenido sin reducir contraste.
- [x] Añadir un recorte coherente a cada tarjeta de Necesidades, ocultándolo en móvil para preservar densidad.
- [x] Añadir una franja editorial en Beneficios usando imágenes optimizadas existentes.
- [x] Reservar proporciones y marcar correctamente contenido decorativo.

### Task 4: Validación

- [x] Ejecutar la prueba dirigida de `tests/landing-exhaustive.spec.js`.
- [x] Revisar el comportamiento responsive y conservar la verificación automatizada de overflow.
- [x] Ejecutar `npm run qa:lighthouse` y comparar presupuesto.
- [x] Ejecutar `npm run qa:e2e`.
- [x] Ejecutar `npm run qa:gate` y obtener PASS.
