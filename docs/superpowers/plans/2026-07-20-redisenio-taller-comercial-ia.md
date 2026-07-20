# Rediseño STAX: Taller Comercial Chileno e IA con Criterio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar la landing de STAX en una experiencia clara, sobria y cercana para PYMEs chilenas, donde el aporte humano frente a la IA sea verificable.

**Architecture:** El cambio permanece concentrado en `index.html`: las reglas CSS locales definen el sistema “cuaderno de negocio” y el HTML reutiliza las secciones existentes. `tests/landing-exhaustive.spec.js` mantiene contratos de texto, accesibilidad, reducción de movimiento y ausencia de desborde; no se agregan dependencias ni recursos externos.

**Tech Stack:** HTML estático, CSS local dentro de `index.html`, Tailwind CSS compilado, Alpine.js local y Playwright.

## Global Constraints

- Mantener compatibilidad con `file://`, rutas explícitas y recursos locales.
- No agregar CDN, fuentes remotas ni dependencias.
- Mantener `lang="es-CL"`, un único `<h1>`, metadatos, JSON-LD, accesibilidad, foco visible y `prefers-reduced-motion`.
- Mantener rutas de demos, formularios, validaciones, WhatsApp y sus fallbacks.
- La marca pública es `STAX`; mostrar “Atención desde Biobío para negocios de todo Chile” sin afirmar oficina, dirección, rostro, equipo, clientes ni resultados inexistentes.
- No prometer ventas, conversiones ni resultados garantizados.
- La IA se describe como apoyo para borradores y tareas; STAX comunica criterio, orden, revisión y entrega de control.
- Cada modificación se registra con commit focalizado y se publica en `origin/main`.

---

## File Structure

- Modify: `index.html` — tokens, trama, estilos de tarjetas y botones, hero, sección `#ia-practica` y copy de cercanía.
- Modify: `tests/landing-exhaustive.spec.js` — contratos de cercanía, IA centrada en criterio, tema claro/oscuro y overflow.
- Reuse: `assets/optimized/santiago-hero.webp` — imagen local existente; no crear ni descargar assets.

### Task 1: Establecer contratos de contenido y tema antes del rediseño

**Files:**
- Modify: `tests/landing-exhaustive.spec.js:10-95`

**Interfaces:**
- Consumes: `#inicio`, `#ia-practica`, `.hero-photo-bg` y los textos visibles de `index.html`.
- Produces: pruebas que el HTML debe satisfacer durante las tareas 2–4.

- [ ] **Step 1: Escribir la prueba que falla**

Añadir después de la prueba del hero:

```js
  test('Commercial redesign keeps local reach and human criteria visible', async ({ page }) => {
    const guards = await attachPageGuards(page);
    const hero = page.locator('#inicio');
    const ia = page.locator('#ia-practica');

    await expect(hero.getByText('Atención desde Biobío para negocios de todo Chile', { exact: true })).toBeVisible();
    await expect(ia.getByRole('heading', { name: 'La herramienta acelera. STAX se hace cargo del criterio.' })).toBeVisible();
    await expect(ia.getByText('Escuchamos cómo atiendes', { exact: true })).toBeVisible();
    await expect(ia.getByText('Ordenamos tu información', { exact: true })).toBeVisible();
    await expect(ia.getByText('Revisamos que funcione de verdad', { exact: true })).toBeVisible();
    await expect(ia.getByText('Te entregamos control', { exact: true })).toBeVisible();
    await expect(page.locator('.business-notebook-pattern')).toHaveCount(1);
    await guards.assertHealthyContext();
  });
```

- [ ] **Step 2: Ejecutar la prueba y verificar que falla**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "Commercial redesign keeps"`

Expected: FAIL porque aún no existen el texto de cercanía, el nuevo titular de IA ni `.business-notebook-pattern`.

- [ ] **Step 3: Añadir contrato visual de móvil y tema claro**

Dentro de la misma prueba, después de la comprobación de la trama, añadir:

```js
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await page.evaluate(() => document.documentElement.classList.add('light-theme'));
    await expect(page.locator('.business-notebook-pattern').evaluate((node) => getComputedStyle(node).backgroundImage)).resolves.not.toBe('none');
```

- [ ] **Step 4: Ejecutar la prueba y verificar que sigue fallando solo por la implementación ausente**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "Commercial redesign keeps"`

Expected: FAIL por contenido o clase faltante; no por errores de sintaxis de la prueba.

- [ ] **Step 5: Commit y push del contrato de prueba**

```bash
git add tests/landing-exhaustive.spec.js
git commit -m "test: define commercial redesign contracts"
git push origin main
```

### Task 2: Implementar la trama “cuaderno de negocio” y reducir acabados tecnológicos

**Files:**
- Modify: `index.html:394-525`
- Modify: `index.html:740-825`

**Interfaces:**
- Consumes: `.band-white`, `.band-lino`, `.band-dark`, `.band-navy`, `.hero-photo-bg`, `.btn-glow` y tokens existentes de azul, rojo y verde.
- Produces: `.business-notebook-pattern`, `.business-card` y acabados de sombra que las tareas 3 y 4 reutilizan.

- [ ] **Step 1: Añadir la trama y las tarjetas sobrias**

Insertar antes de `/* Glassmorphism */`:

```css
    .business-notebook-pattern {
      background-color: #F5F1E8;
      background-image:
        linear-gradient(rgba(32, 61, 91, 0.055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(32, 61, 91, 0.055) 1px, transparent 1px),
        radial-gradient(circle at 18% 15%, rgba(180, 67, 43, 0.07), transparent 24rem);
      background-size: 28px 28px, 28px 28px, auto;
    }

    .business-card {
      background: rgba(255, 253, 248, 0.94);
      border: 1px solid rgba(32, 61, 91, 0.14);
      box-shadow: 0 14px 30px rgba(33, 42, 52, 0.10);
    }

    html:not(.light-theme) .business-notebook-pattern {
      background-color: #182233;
      background-image:
        linear-gradient(rgba(225, 232, 240, 0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(225, 232, 240, 0.07) 1px, transparent 1px),
        radial-gradient(circle at 18% 15%, rgba(200, 91, 64, 0.15), transparent 24rem);
    }

    html:not(.light-theme) .business-card {
      background: rgba(24, 34, 51, 0.94);
      border-color: rgba(225, 232, 240, 0.16);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.20);
    }
```

- [ ] **Step 2: Reemplazar el brillo de botones por una elevación discreta**

Reemplazar las reglas `.btn-glow`, `.btn-glow::after` y `.btn-glow:hover::after` por:

```css
    .btn-glow {
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 18px rgba(10, 49, 97, 0.18);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .btn-glow:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(10, 49, 97, 0.24);
    }
```

- [ ] **Step 3: Suavizar el fondo del hero sin alterar el asset local**

Reemplazar el gradiente de `.hero-photo-bg` por:

```css
    .hero-photo-bg {
      background-image:
        linear-gradient(90deg, rgba(11, 31, 74, 0.90) 0%, rgba(11, 31, 74, 0.78) 52%, rgba(88, 42, 31, 0.58) 100%),
        url('./assets/optimized/santiago-hero.webp');
      background-size: cover;
      background-position: center 30%;
      background-repeat: no-repeat;
    }
```

- [ ] **Step 4: Aplicar la trama a los bloques claros sin cambiar estructura**

En los `section` de `#necesidades`, `#demos`, `#precios` y `#faq`, añadir `business-notebook-pattern`; en sus tarjetas principales reemplazar `bg-drac-bg/80` o `bg-drac-bg/60` por `business-card` manteniendo bordes, `reveal` e interacciones existentes.

- [ ] **Step 5: Ejecutar la prueba del contrato y verificar que pasa**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "Commercial redesign keeps"`

Expected: PASS.

- [ ] **Step 6: Commit y push de la base visual**

```bash
git add index.html tests/landing-exhaustive.spec.js
git commit -m "feat: add commercial notebook visual system"
git push origin main
```

### Task 3: Incorporar cercanía nacional desde Biobío en el hero

**Files:**
- Modify: `index.html:1000-1065`
- Test: `tests/landing-exhaustive.spec.js:10-55`

**Interfaces:**
- Consumes: el CTA principal `Revisar lo que explico por WhatsApp`, `#contacto`, `.editorial-bar` y la prueba de la tarea 1.
- Produces: un bloque de alcance visible dentro de `#inicio` y una experiencia de hero compatible con celular.

- [ ] **Step 1: Añadir el alcance sin afirmar una oficina**

Después del párrafo principal del hero y antes de los botones, insertar:

```html
            <p class="mt-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
              Atención desde Biobío para negocios de todo Chile
            </p>
```

- [ ] **Step 2: Cambiar el rótulo superior del hero**

Reemplazar el contenido del `premium-note` por:

```html
              STAX para negocios que atienden personas todos los días
```

- [ ] **Step 3: Simplificar los acentos decorativos del hero**

Eliminar los tres `div` decorativos inmediatamente después de `<section id="inicio" ...>` que usan `animate-pulse-soft` y `blur-[...]`. No eliminar el hero, el fondo fotográfico ni `.clarity-tunnel`.

- [ ] **Step 4: Ejecutar la prueba de hero y el contrato comercial**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "Hero section elements|Commercial redesign keeps"`

Expected: 2 passed.

- [ ] **Step 5: Commit y push de cercanía y hero**

```bash
git add index.html tests/landing-exhaustive.spec.js
git commit -m "feat: add Biobio reach to commercial hero"
git push origin main
```

### Task 4: Reemplazar la sección de IA por evidencia de criterio humano

**Files:**
- Modify: `index.html:1899-1920`
- Test: `tests/landing-exhaustive.spec.js:55-100`

**Interfaces:**
- Consumes: `#ia-practica`, `.business-card`, `.reveal` y el contrato de textos de la tarea 1.
- Produces: cuatro acciones humanas visibles y una explicación honesta del rol de la IA.

- [ ] **Step 1: Reemplazar el contenido interno de `#ia-practica`**

Mantener el `section id="ia-practica"`, pero sustituir su contenido por:

```html
      <div class="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div class="reveal max-w-3xl">
          <p class="text-xs font-black uppercase tracking-[0.18em] text-chile-blueLight">Criterio aplicado a tu negocio</p>
          <h2 class="mt-3 font-display text-3xl font-black text-drac-fg sm:text-4xl">La herramienta acelera.<span class="block">STAX se hace cargo del criterio.</span></h2>
          <p class="mt-4 text-base leading-relaxed text-drac-comment">Podemos usar herramientas para avanzar más rápido. El trabajo que importa es entender tu atención, ordenar lo esencial y revisar que cada paso funcione para tus clientes.</p>
        </div>
        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article class="business-card reveal rounded-2xl p-6"><p class="text-sm font-black text-chile-blueLight">01</p><h3 class="mt-4 text-lg font-bold text-drac-fg">Escuchamos cómo atiendes</h3><p class="mt-3 text-sm leading-relaxed text-drac-comment">Identificamos preguntas repetidas, datos faltantes y qué conviene mostrar primero.</p></article>
          <article class="business-card reveal rounded-2xl p-6" style="transition-delay: .06s"><p class="text-sm font-black text-chile-blueLight">02</p><h3 class="mt-4 text-lg font-bold text-drac-fg">Ordenamos tu información</h3><p class="mt-3 text-sm leading-relaxed text-drac-comment">Convertimos servicios, valores, horarios y condiciones en mensajes fáciles de entender.</p></article>
          <article class="business-card reveal rounded-2xl p-6" style="transition-delay: .12s"><p class="text-sm font-black text-chile-blueLight">03</p><h3 class="mt-4 text-lg font-bold text-drac-fg">Revisamos que funcione de verdad</h3><p class="mt-3 text-sm leading-relaxed text-drac-comment">Comprobamos lectura móvil, botones, contacto y los pasos de reserva o pedido.</p></article>
          <article class="business-card reveal rounded-2xl p-6" style="transition-delay: .18s"><p class="text-sm font-black text-chile-blueLight">04</p><h3 class="mt-4 text-lg font-bold text-drac-fg">Te entregamos control</h3><p class="mt-3 text-sm leading-relaxed text-drac-comment">Tus contenidos, dominio y accesos quedan organizados para que sigas avanzando.</p></article>
        </div>
      </div>
```

- [ ] **Step 2: Confirmar reducción de movimiento y accesibilidad**

No añadir intervalos ni animaciones nuevas. Las cuatro tarjetas usan la clase existente `reveal`; con `prefers-reduced-motion`, el CSS global debe mostrarlas estáticas. Mantener `<h2>` único dentro de la sección y su `span.block` para separar ideas completas.

- [ ] **Step 3: Ejecutar pruebas focalizadas**

Run: `npx playwright test tests/landing-exhaustive.spec.js -g "Commercial redesign keeps|Hero section elements|Contact section explains"`

Expected: 3 passed.

- [ ] **Step 4: Ejecutar validación completa**

Run: `npm run qa:gate`

Expected: `PASS` y sin enlaces, metadatos, consola, formularios ni navegación `file://` regresivos.

- [ ] **Step 5: Hacer revisión visual local**

Run:

```bash
npm run serve
npx playwright screenshot --browser chromium --viewport-size="1440,1000" http://127.0.0.1:4173 /tmp/stax-commercial-desktop.png
npx playwright screenshot --browser chromium --viewport-size="390,844" http://127.0.0.1:4173 /tmp/stax-commercial-mobile.png
```

Expected: trama legible pero tenue, tarjetas sobrias, ninguna sombra neón, texto de IA y CTA legibles, sin overflow horizontal.

- [ ] **Step 6: Commit y push final**

```bash
git add index.html tests/landing-exhaustive.spec.js
git commit -m "feat: show STAX human criteria behind AI"
git push origin main
```

## Self-Review

- La tarea 2 implementa fondo, colores, tarjetas y reducción de brillo definidos en la especificación.
- La tarea 3 implementa la referencia desde Biobío sin crear una identidad personal ni limitar el alcance nacional.
- La tarea 4 cubre las cuatro acciones humanas aprobadas y mantiene la IA como apoyo.
- Las tareas 1 y 4 cubren contratos visuales, contenido, tema, móvil, overflow y la puerta de calidad completa.
- No se crean recursos externos, rutas nuevas, dependencias ni promesas de resultado.
