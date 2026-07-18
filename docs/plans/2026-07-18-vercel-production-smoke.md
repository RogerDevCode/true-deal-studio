# Vercel Production Smoke Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validar todas las páginas públicas de True Deal Studio contra el despliegue vigente en Vercel.

**Architecture:** `scripts/production_smoke.js` definirá el inventario de las dieciséis páginas y expondrá `run(fetchImpl, log)` para pruebas aisladas. La entrada CLI seguirá sirviendo a `npm run qa:prod-smoke`.

**Tech Stack:** Node.js 22, Fetch API, CommonJS y Playwright.

## Global Constraints

- URL productiva: `https://true-deal-studio.vercel.app/`.
- Cubrir landing, privacidad y catorce `demo-*/index.html`.
- Validar HTTP, título, `lang="es-CL"`, un `<h1>`, Open Graph, Twitter card, JSON-LD y `Cache-Control`.
- No seguir enlaces ni recursos de terceros.
- Conservar compatibilidad `file://` y los demos existentes.

---

## File Structure

- `scripts/production_smoke.js`: inventario, validación y entrada CLI.
- `tests/production-smoke.spec.js`: contrato aislado, sin red real.
- `index.html`: URL Vercel en el JSON-LD de la landing.
- `README.md`: uso del smoke de producción.

### Task 1: Crear la regresión aislada del smoke

**Files:**

- Create: `tests/production-smoke.spec.js`
- Modify: `scripts/production_smoke.js`

**Interfaces:**

- Consumes: `PROD_URL`, `PAGES` y `run(fetchImpl, log)` de `scripts/production_smoke.js`.
- Produces: cobertura del dominio, inventario y fallo ante título incorrecto.

- [ ] **Step 1: Escribir la prueba que fallará inicialmente**

```js
const { test, expect } = require("@playwright/test");
const { PROD_URL, PAGES, run } = require("../scripts/production_smoke");

function responseFor(title) {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ "cache-control": "public, max-age=0" }),
    text: async () => `<!doctype html><html lang="es-CL"><head><title>${title}</title><meta property="og:title"><meta property="og:description"><meta property="og:image"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">{}</script></head><body><h1>Demo</h1></body></html>`,
  };
}

test("production smoke covers every Vercel public page", async () => {
  const requested = [];
  await run(async (url) => {
    requested.push(url);
    const page = PAGES.find(({ path }) => new URL(path, PROD_URL).toString() === url);
    return responseFor(page.expectedTitle);
  }, () => {});
  expect(PROD_URL).toBe("https://true-deal-studio.vercel.app/");
  expect(PAGES).toHaveLength(16);
  expect(requested).toEqual(PAGES.map(({ path }) => new URL(path, PROD_URL).toString()));
});

test("production smoke rejects an unexpected page title", async () => {
  await expect(run(async () => responseFor("Título incorrecto"), () => {})).rejects.toThrow("Titulo inesperado");
});
```

- [ ] **Step 2: Ejecutar para comprobar el fallo**

Run: `npx playwright test tests/production-smoke.spec.js`

Expected: falla porque el script aún no exporta el contrato.

### Task 2: Actualizar el runner a Vercel y cubrir las páginas públicas

**Files:**

- Modify: `scripts/production_smoke.js:3-58`
- Test: `tests/production-smoke.spec.js`

**Interfaces:**

- Consumes: el dominio Vercel y los títulos de producción.
- Produces: `run(fetchImpl = fetch, log = console.log)` y el inventario de 16 rutas.

- [ ] **Step 1: Definir el origen y todas las rutas con sus títulos exactos**

```js
const PROD_URL = "https://true-deal-studio.vercel.app/";
const PAGES = [
  { path: "", expectedTitle: "STAX | Que te vean. Que te crean." },
  { path: "privacidad.html", expectedTitle: "STAX | Aviso de Privacidad" },
  { path: "demo-agenda/index.html", expectedTitle: "CRM Express | Panel de Control de Agenda y Clientes Demo" },
  { path: "demo-artesanias/index.html", expectedTitle: "Artesanías del Sur | Catálogo & Tienda Online - Chile" },
  { path: "demo-cafe-valparaiso/index.html", expectedTitle: "Café La Ruta | Cafetería de Especialidad & Almuerzos - Valparaíso" },
  { path: "demo-contabilidad/index.html", expectedTitle: "ContaDigital | Asesoría Contable & Tributaria para Pymes - Santiago" },
  { path: "demo-ecommerce-tech/index.html", expectedTitle: "Apex Tech | Tienda Online & Panel de Administración Demo" },
  { path: "demo-fonoaudiologia/index.html", expectedTitle: "Nahovy Gallegos | Fonoaudiología Infantil a Domicilio en Santiago" },
  { path: "demo-plan-premium/index.html", expectedTitle: "Muebles Roble | Demo Plan Premium" },
  { path: "demo-plan-profesional/index.html", expectedTitle: "Remodelaciones Altiplano | Demo Plan Profesional" },
  { path: "demo-propiedades/index.html", expectedTitle: "Cobre & Co. Propiedades — Corretaje Inmobiliario Premium" },
  { path: "demo-propuesta-atencion-ordenada/index.html", expectedTitle: "Sistema Vivo | Propuesta STAX" },
  { path: "demo-propuesta-empezar-simple/index.html", expectedTitle: "Editorial Boutique Viva | Propuesta STAX" },
  { path: "demo-propuesta-impacto-comercial/index.html", expectedTitle: "Impacto Comercial Vivo | Propuesta STAX" },
  { path: "demo-psicologa/index.html", expectedTitle: "Ps. Clara Altieri | Psicología Clínica & Bienestar Emocional" },
  { path: "demo-salon-belleza/index.html", expectedTitle: "Studio Chic | Salón de Alta Peluquería & Estilo - Santiago" },
];
```

- [ ] **Step 2: Inyectar fetch y conservar la entrada CLI**

```js
async function fetchText(url, fetchImpl = fetch) {
  const response = await fetchImpl(url, { headers: { "user-agent": "true-deal-studio-production-smoke/1.0" } });
  assert(response.ok, `HTTP ${response.status} en ${url}`);
  return { headers: response.headers, text: await response.text() };
}

async function run(fetchImpl = fetch, log = console.log) {
  for (const page of PAGES) {
    const url = new URL(page.path, PROD_URL).toString();
    const { headers, text } = await fetchText(url, fetchImpl);
    assert(text.includes(page.expectedTitle), `Titulo inesperado en ${url}`);
    // Mantener las validaciones SEO y de Cache-Control existentes.
    log(`PASS ${url}`);
  }
}

module.exports = { PROD_URL, PAGES, run };

if (require.main === module) {
  run().catch((error) => {
    console.error(`FAIL ${error.message}`);
    process.exitCode = 1;
  });
}
```

- [ ] **Step 3: Ejecutar la prueba aislada y el smoke real**

Run: `npx playwright test tests/production-smoke.spec.js && npm run qa:prod-smoke`

Expected: dos pruebas aprobadas y dieciséis líneas `PASS` contra Vercel.

- [ ] **Step 4: Commit**

```bash
git add scripts/production_smoke.js tests/production-smoke.spec.js
git commit -m "test: cover Vercel production smoke"
```

### Task 3: Sincronizar URL pública y guía de uso

**Files:**

- Modify: `index.html:83`
- Modify: `README.md:89-105`

**Interfaces:**

- Consumes: `https://true-deal-studio.vercel.app/` como dominio validado.
- Produces: JSON-LD y documentación que señalan el despliegue vigente.

- [ ] **Step 1: Actualizar el JSON-LD activo**

```html
"url": "https://true-deal-studio.vercel.app/",
```

- [ ] **Step 2: Añadir el comando a Calidad y pruebas**

```markdown
# Smoke contra el despliegue vigente en Vercel
npm run qa:prod-smoke
```

Añadir: `El smoke comprueba la landing, privacidad y las 14 demostraciones contra https://true-deal-studio.vercel.app/.`

- [ ] **Step 3: Ejecutar validación completa**

Run: `npm run qa:ci`

Expected: gate, E2E, calidad y smoke productivo finalizan correctamente.

- [ ] **Step 4: Commit**

```bash
git add index.html README.md
git commit -m "fix: point production metadata to Vercel"
```

## Self-Review

- Task 1 protege dominio, inventario y error de título; Task 2 implementa el runner; Task 3 sincroniza metadata y guía.
- `PROD_URL`, el test y JSON-LD utilizan el mismo dominio Vercel.
- No quedan marcadores pendientes ni servicios externos en el smoke.

