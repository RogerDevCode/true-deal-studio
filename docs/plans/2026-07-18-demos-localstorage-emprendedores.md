# Demos locales para emprendedores chilenos — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar cuatro demos offline, con estado JSON persistido en `localStorage`, que presenten flujos claros para servicios domiciliarios, mascotas, floristería y banquetería/pastelería.

**Architecture:** Cada demo será una página estática independiente con `index.html` y `app.js`, usando Alpine.js local. El objeto seed, la clave de `localStorage`, las operaciones de persistencia y el reset viven dentro de cada `app.js`; la estructura de interacción se repite, pero ninguna demo comparte una plantilla visual o datos de negocio.

**Tech Stack:** HTML5, CSS local/Tailwind compilado, Alpine.js local, JavaScript ES2022, `localStorage`, Playwright y Chrome Headless.

## Global Constraints

- Mantener compatibilidad con `file://`, rutas explícitas y recursos locales.
- Cada página: `lang="es-CL"`, un único `<h1>`, Open Graph, Twitter card, JSON-LD y enlace `../index.html`.
- Cada demo guarda solo una clave propia: `stax-demo-hogar`, `stax-demo-mascotas`, `stax-demo-floristeria` o `stax-demo-banquetes`.
- `Restablecer demo` borra solamente la clave de la demo actual y restituye el seed.
- Formularios accesibles, con validación nativa, mensaje WhatsApp prellenado y sin envíos reales durante tests.
- No añadir backend, CDN, pagos, credenciales o dependencias remotas.
- Preservar estado de modal al cancelar, cerrar o enviar; **Presencial** va primero si se presenta modalidad.
- Cada demo usa una diagramación propia: tablero de atención (hogar), agenda de cuidado (mascotas), composición editorial guiada (floristería) y mapa de celebración (banquetería). No reutilizar una secuencia hero + tarjetas + catálogo + formulario.

---

## File Structure

- `demo-servicios-domiciliarios/index.html`, `app.js`: diagnóstico, cobertura y tablero de solicitudes.
- `demo-mascotas/index.html`, `app.js`: agenda y fichas de mascotas.
- `demo-floristeria/index.html`, `app.js`: pedido guiado y entregas.
- `demo-banqueteria/index.html`, `app.js`: cotizador de eventos y consultas.
- `index.html`: cuatro tarjetas adicionales dentro de la galería de demos.
- `tests/demos-15-to-18-exhaustive.spec.js`: pruebas Playwright de comportamiento para los cuatro rubros.
- `tests/root.spec.js`, `tests/landing-exhaustive.spec.js`: inventario de enlaces de la landing.

### Task 1: Crear el patrón de estado local verificable

**Files:**

- Create: `demo-servicios-domiciliarios/app.js`
- Test: `tests/demos-15-to-18-exhaustive.spec.js`

**Interfaces:**

- Consumes: Alpine local y `window.localStorage`.
- Produces: `serviciosDomiciliariosApp()` con `requests`, `saveRequest`, `resetDemo`, `storageKey` y `whatsappHref`.

- [ ] **Step 1: Escribir la regresión de persistencia y aislamiento**

Crear una prueba que abra `/demo-servicios-domiciliarios/index.html`, envíe una solicitud válida, recargue la página y confirme que aparece en el tablero. Ejecutar `localStorage.setItem("stax-demo-mascotas", "sentinel")`, pulsar **Restablecer demo** y comprobar que `stax-demo-hogar` vuelve al seed mientras la clave sentinel se conserva.

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx playwright test tests/demos-15-to-18-exhaustive.spec.js -g "Servicios domiciliarios"`

Expected: falla porque la ruta no existe.

- [ ] **Step 3: Implementar el contrato de estado**

Usar esta forma de datos y operaciones en el nuevo `app.js`:

```js
const storageKey = "stax-demo-hogar";
const seed = {
  requests: [
    { id: 1, customer: "Camila Soto", commune: "Ñuñoa", service: "Gasfitería", urgency: "Hoy", status: "Por revisar", note: "Revisión de filtración bajo lavaplatos." },
  ],
};

function readState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}

function serviciosDomiciliariosApp() {
  const state = readState();
  return {
    storageKey, ...state, modalOpen: false,
    persist() { localStorage.setItem(storageKey, JSON.stringify({ requests: this.requests })); },
    saveRequest() { /* validar, agregar solicitud, persistir, preparar WhatsApp y cerrar modal */ },
    resetDemo() { localStorage.removeItem(storageKey); this.requests = structuredClone(seed).requests; },
  };
}
```

- [ ] **Step 4: Implementar `index.html` de servicios domiciliarios como tablero de atención**

Incluir hero compacto “Resuelve lo urgente. Ordena lo importante.”, selector de urgencia y servicio en la primera vista, cobertura/franja horaria en un panel operativo, y solicitudes apiladas por prioridad con estados **Por revisar**, **Coordinando** y **Confirmado**. El modal usa `comuna`, `servicio`, `urgencia`, `horario` y `detalle`; añadir **Restablecer demo**, metas y JSON-LD `HomeAndConstructionBusiness`.

- [ ] **Step 5: Ejecutar test focalizado y commit**

Run: `npx playwright test tests/demos-15-to-18-exhaustive.spec.js -g "Servicios domiciliarios"`

Expected: PASS.

```bash
git add demo-servicios-domiciliarios tests/demos-15-to-18-exhaustive.spec.js
git commit -m "feat: add home services demo"
```

### Task 2: Implementar demo de mascotas

**Files:**

- Create: `demo-mascotas/index.html`
- Create: `demo-mascotas/app.js`
- Modify: `tests/demos-15-to-18-exhaustive.spec.js`

**Interfaces:**

- Consumes: `stax-demo-mascotas` y el patrón local de Task 1.
- Produces: `mascotasApp()`, agenda persistente y reset aislado.

- [ ] **Step 1: Escribir la prueba de ficha, agenda y reset**

La prueba selecciona tamaño y servicio, completa nombre de mascota, dirección y observaciones, envía la solicitud simulada, verifica una ficha nueva en **Próximas visitas**, recarga y confirma persistencia; después resetea y confirma que desaparece solo la nueva ficha.

- [ ] **Step 2: Implementar seed y acciones**

Definir `storageKey = "stax-demo-mascotas"`, una visita seed y métodos `saveVisit()`, `resetDemo()`, `whatsappHref()`. El seed tiene campos `petName`, `species`, `size`, `service`, `address`, `preferredDate`, `careNotes` y `status`.

- [ ] **Step 3: Construir la experiencia visual y accesible como agenda de cuidado**

Crear fichas de mascota como centro de la pantalla, preparación previa en una columna secundaria, selector de tamaño y servicio, agenda modal y estados **Por confirmar / Preparada / En ruta**. No añadir un catálogo o hero de marketing convencional. Usar un único h1, JSON-LD `PetStore`, metas sociales, recursos locales y navegación de retorno.

- [ ] **Step 4: Ejecutar test focalizado y commit**

Run: `npx playwright test tests/demos-15-to-18-exhaustive.spec.js -g "Mascotas"`

Expected: PASS.

```bash
git add demo-mascotas tests/demos-15-to-18-exhaustive.spec.js
git commit -m "feat: add pet care demo"
```

### Task 3: Implementar demo de floristería

**Files:**

- Create: `demo-floristeria/index.html`
- Create: `demo-floristeria/app.js`
- Modify: `tests/demos-15-to-18-exhaustive.spec.js`

**Interfaces:**

- Consumes: `stax-demo-floristeria`.
- Produces: `floristeriaApp()`, pedido persistente, resumen y reset aislado.

- [ ] **Step 1: Escribir la prueba de composición de pedido**

La prueba escoge ocasión, arreglo, presupuesto, comuna, bloque de entrega y dedicatoria; verifica que el resumen incorpora esos valores, guarda, recarga y encuentra el pedido en el tablero por fecha. Después confirma que reset no borra `stax-demo-hogar`.

- [ ] **Step 2: Implementar el estado local**

Definir seed de pedidos y campos `occasion`, `arrangement`, `budget`, `deliveryDate`, `commune`, `deliveryWindow`, `message` y `status`. Exponer `saveOrder()`, `resetDemo()` y `formatCurrency()`.

- [ ] **Step 3: Construir la experiencia como composición editorial guiada**

Usar el orden visual **ocasión → arreglo → entrega → dedicatoria**, con el resumen vivo y la dedicatoria ocupando el panel principal. Limitar a seis arreglos, dejar condiciones de despacho/retiro como cierre y listar pedidos por fecha sin repetir tarjetas de las otras demos. Incluir `Florist` en JSON-LD, h1 único, metas, focus visible y botón WhatsApp prellenado.

- [ ] **Step 4: Ejecutar test focalizado y commit**

Run: `npx playwright test tests/demos-15-to-18-exhaustive.spec.js -g "Floristería"`

Expected: PASS.

```bash
git add demo-floristeria tests/demos-15-to-18-exhaustive.spec.js
git commit -m "feat: add florist demo"
```

### Task 4: Implementar demo de banquetería y pastelería

**Files:**

- Create: `demo-banqueteria/index.html`
- Create: `demo-banqueteria/app.js`
- Modify: `tests/demos-15-to-18-exhaustive.spec.js`

**Interfaces:**

- Consumes: `stax-demo-banquetes`.
- Produces: `banqueteriaApp()`, cotizaciones persistentes y reset aislado.

- [ ] **Step 1: Escribir la prueba de cotización**

La prueba combina tipo de evento, asistentes, formato, rango de presupuesto, comuna y una restricción alimentaria. Verifica una advertencia de confirmación humana, persiste la solicitud y asegura que reset elimina solo esa cotización.

- [ ] **Step 2: Implementar seed y cálculo referencial**

Definir campos `eventType`, `date`, `guests`, `format`, `budget`, `commune`, `dietaryNotes` y `status`. Implementar `estimatedRange()` para presentar un rango orientativo por persona, nunca un precio final o disponibilidad garantizada.

- [ ] **Step 3: Construir el cotizador como mapa de celebración**

Ubicar formato, asistentes, presupuesto y restricciones como un mapa de decisión visual antes del menú. Presentar formatos de celebración, aclaración de agenda/logística, modal accesible y un tablero por fecha con etiquetas de asistentes y restricciones, sin secuencia de catálogo convencional. Incluir JSON-LD `FoodEstablishment`, metas y retorno offline.

- [ ] **Step 4: Ejecutar test focalizado y commit**

Run: `npx playwright test tests/demos-15-to-18-exhaustive.spec.js -g "Banquetería"`

Expected: PASS.

```bash
git add demo-banqueteria tests/demos-15-to-18-exhaustive.spec.js
git commit -m "feat: add catering demo"
```

### Task 5: Integrar las demos en la landing y en el inventario

**Files:**

- Modify: `index.html:1020-1198`
- Modify: `tests/root.spec.js:4-17`
- Modify: `tests/landing-exhaustive.spec.js:79-98`

**Interfaces:**

- Consumes: las rutas explícitas de las cuatro demos.
- Produces: tarjetas navegables desde la landing y regresiones de sus enlaces.

- [ ] **Step 1: Añadir cuatro tarjetas de demostración**

Añadir tarjetas con rutas exactas `./demo-servicios-domiciliarios/index.html`, `./demo-mascotas/index.html`, `./demo-floristeria/index.html` y `./demo-banqueteria/index.html`; describir qué ordena cada una y que el dueño puede revisar solicitudes. Actualizar el contador visible del botón de demos al total resultante, manteniendo su texto accesible.

- [ ] **Step 2: Extender ambos inventarios de enlaces**

Incorporar las cuatro rutas al array `demoPaths` de `tests/root.spec.js` y de `tests/landing-exhaustive.spec.js`. La expectativa debe exigir que cada enlace sea visible tras expandir la galería y que cada demo exponga el enlace de retorno.

- [ ] **Step 3: Ejecutar regresiones de landing**

Run: `npm run test_root && npx playwright test tests/landing-exhaustive.spec.js`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add index.html tests/root.spec.js tests/landing-exhaustive.spec.js
git commit -m "feat: link new local demos"
```

### Task 6: Validar la colección completa

**Files:**

- Verify: `tests/demos-15-to-18-exhaustive.spec.js`
- Verify: todas las nuevas demos y la landing.

- [ ] **Step 1: Ejecutar la suite focalizada**

Run: `npx playwright test tests/demos-15-to-18-exhaustive.spec.js`

Expected: cuatro pruebas pasan sin errores de consola/red.

- [ ] **Step 2: Ejecutar preproducción y suite completa**

Run: `npm run qa:gate && npm run qa:e2e`

Expected: PASS, con las rutas offline, metadatos, formularios y navegación protegidos.

- [ ] **Step 3: Revisar el flujo móvil**

Abrir cada demo en viewport móvil y desktop; comprobar modal, foco, contraste, no desborde de tarjetas y visibilidad de **Restablecer demo**.

## Self-Review

- Cada demo es una tarea independiente con flujo, estado, datos y pruebas concretas.
- Las claves de localStorage y los métodos de persistencia son aislados por rubro.
- La integración en landing ocurre después de que las cuatro rutas existen y sus pruebas focalizadas pasan.
- No se añaden servicios externos, inventario real ni promesas comerciales.
