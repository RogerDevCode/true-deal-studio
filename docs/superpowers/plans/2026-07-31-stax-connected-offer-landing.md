# STAX Connected Offer Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `tuvitrina.lat` the commercial entry point for STAX Vitrina, STAX Atención Ordenada and STAX Voz, with direct proof links and an explicit WhatsApp diagnostic interest.

**Architecture:** Modify only the static landing and its Playwright coverage. A new `#atencion-asistida` section follows the existing demos and links to the already deployed VoiceLive widget plus the local CRM Express workflow preview. The existing contact form gains an interest selector that is included in the prepared WhatsApp message; no bot, webhook, VPS, DNS or secrets are configured here.

**Tech Stack:** Static HTML, local Tailwind CSS, local Alpine.js, Playwright, Chrome Headless, Vercel static hosting, `file://` support.

## Global Constraints

- Keep STAX as the public brand; do not start a True Deal public rebrand.
- Preserve `file://` compatibility, local resources and existing demo paths.
- Keep the landing in Vercel; VoiceLive and chatbot deployments remain outside this repository.
- Reuse `https://voice.tuvitrina.lat/widget/tuvitrina` as the current public VoiceLive destination.
- Use `./demo-agenda/index.html` as the local proof route for the owner workflow.
- Present results and human control; do not promise automatic sales, reservations, messages or a replacement for human attention.
- Preserve focus visibility, responsive behavior, `prefers-reduced-motion`, `lang="es-CL"`, one `h1`, SEO metadata and current form fallback behavior.
- Do not add CDNs, remote fonts, dependencies, tokens, webhook URLs or credentials.
- Do not modify the pre-existing `Dockerfile` and `compose.local.yaml` worktree changes.

## Scope Boundary

This plan deliberately excludes the VPS deployment. The future operations work must happen in the VoiceLive/chatbot repositories and the authorized VPS environment, where the exact image names, storage requirements, health endpoints, proxy choice and secret provider are known. That work needs a separate execution plan after receiving those repository paths and server access.

---

### Task 1: Define failing coverage for the connected STAX offer

**Files:**
- Create: `tests/stax-connected-offer.spec.js`
- Reference: `tests/helpers.js`
- Reference: `tests/landing-exhaustive.spec.js`

**Interfaces:**
- Consumes: future `data-testid` values `assisted-attention`, `stax-voice-offer`, `stax-owner-workflow`, and form field `form-interes`.
- Produces: regression coverage for public proof links, owner workflow route and WhatsApp interest context.

- [ ] **Step 1: Write the failing Playwright test**

Create `tests/stax-connected-offer.spec.js`:

```js
const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('STAX connected service offer', () => {
  test('presents voice and ordered attention, then prepares a contextual diagnostic', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await page.addInitScript(() => {
      window.__openedWhatsAppUrl = '';
      window.open = (url) => {
        window.__openedWhatsAppUrl = String(url);
        return { focus() {} };
      };
    });

    await page.goto('/index.html');
    await waitForAlpine(page);

    const section = page.getByTestId('assisted-attention');
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { name: /Tu web puede orientar/i })).toBeVisible();

    const voice = page.getByTestId('stax-voice-offer');
    await expect(voice).toContainText('STAX Voz');
    const voiceLink = voice.getByRole('link', { name: 'Probar atención por voz' });
    await expect(voiceLink).toHaveAttribute('href', 'https://voice.tuvitrina.lat/widget/tuvitrina');
    await expect(voiceLink).toHaveAttribute('target', '_blank');
    await expect(voiceLink).toHaveAttribute('rel', /noopener/);

    const workflow = page.getByTestId('stax-owner-workflow');
    await expect(workflow).toContainText('STAX Atención Ordenada');
    const workflowLink = workflow.getByRole('link', { name: 'Ver cómo llega una consulta ordenada' });
    await expect(workflowLink).toHaveAttribute('href', './demo-agenda/index.html');
    await expect(workflowLink).toHaveAttribute('target', '_blank');
    await expect(workflowLink).toHaveAttribute('rel', /noopener/);

    await section.getByRole('link', { name: 'Revisar mi atención actual por WhatsApp' }).click();
    await expect.poll(async () => page.locator('#contacto').evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(72);

    await page.locator('#form-nombre').fill('Camila Pérez');
    await page.locator('#form-negocio').fill('Taller de bicicletas');
    await page.locator('#form-interes').selectOption('STAX Voz');
    await page.locator('#form-mensaje').fill('Horarios, mantenciones y presupuesto.');
    await page.locator('#contacto form').getByRole('button', { name: 'Preparar mi consulta por WhatsApp' }).click();

    await expect.poll(async () => page.evaluate(() => decodeURIComponent(window.__openedWhatsAppUrl))).toContain('Quiero revisar primero: STAX Voz.');
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await guards.assertHealthyContext();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node scripts/run_clean_env.js npx playwright test tests/stax-connected-offer.spec.js --reporter=line
```

Expected: FAIL because the `assisted-attention` test id and `form-interes` field do not exist.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/stax-connected-offer.spec.js
git commit -m "test: define STAX connected offer behavior"
```

### Task 2: Add the STAX assisted-attention section after the demos

**Files:**
- Modify: `index.html` immediately after the closing `</section>` for `#demos` and before `#beneficios`.
- Test: `tests/stax-connected-offer.spec.js`

**Interfaces:**
- Consumes: existing `premium-quiet-cta`, local Tailwind utilities, VoiceLive URL and demo agenda route.
- Produces: `section#atencion-asistida[data-testid="assisted-attention"]`, `article[data-testid="stax-voice-offer"]`, and `article[data-testid="stax-owner-workflow"]`.

- [ ] **Step 1: Insert the section markup**

Add this section between `#demos` and `#beneficios`:

```html
    <section id="atencion-asistida" data-testid="assisted-attention" class="relative overflow-hidden border-y border-drac-current/30 bg-drac-darker/50">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <span class="inline-flex items-center rounded-full border border-drac-cyan/25 bg-drac-cyan/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-drac-cyan">Atención asistida</span>
          <h2 class="mt-6 font-display text-3xl font-black leading-tight text-drac-fg sm:text-4xl lg:text-5xl">Tu web puede orientar.<span class="block text-drac-cyan">Tú decides el siguiente paso.</span></h2>
          <p class="mt-6 text-lg leading-relaxed text-drac-comment">La página explica lo esencial. La voz orienta dudas aprobadas. Tú recibes una consulta con contexto para responder, agendar o pedir más información.</p>
        </div>

        <div class="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          <article data-testid="stax-voice-offer" class="rounded-[1.75rem] border border-drac-cyan/30 bg-drac-bg/80 p-6 shadow-card sm:p-8">
            <p class="text-xs font-black uppercase tracking-[0.16em] text-drac-cyan">STAX Voz</p>
            <h3 class="mt-4 text-2xl font-bold text-drac-fg">Orienta antes de que la persona escriba.</h3>
            <p class="mt-4 leading-relaxed text-drac-comment">VoiceLive responde preguntas frecuentes con la información aprobada por tu negocio y deriva los casos que necesitan una persona.</p>
            <a href="https://voice.tuvitrina.lat/widget/tuvitrina" target="_blank" rel="noopener" class="premium-quiet-cta mt-6 inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-3 text-sm font-bold text-drac-fg transition-all hover:-translate-y-0.5">Probar atención por voz<span class="ml-2" aria-hidden="true">↗</span><span class="sr-only"> (abre en una pestaña nueva)</span></a>
          </article>

          <article data-testid="stax-owner-workflow" class="rounded-[1.75rem] border border-drac-green/30 bg-drac-bg/80 p-6 shadow-card sm:p-8">
            <p class="text-xs font-black uppercase tracking-[0.16em] text-drac-green">STAX Atención Ordenada</p>
            <h3 class="mt-4 text-2xl font-bold text-drac-fg">Recibe una consulta lista para revisar.</h3>
            <p class="mt-4 leading-relaxed text-drac-comment">Servicio, comuna, horario y siguiente paso quedan ordenados para que el dueño continúe desde su canal de atención.</p>
            <a href="./demo-agenda/index.html" target="_blank" rel="noopener" class="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-drac-green/35 bg-drac-green/10 px-5 py-3 text-sm font-bold text-drac-green transition-all hover:-translate-y-0.5 hover:bg-drac-green/20">Ver cómo llega una consulta ordenada<span class="ml-2" aria-hidden="true">↗</span><span class="sr-only"> (abre en una pestaña nueva)</span></a>
          </article>
        </div>

        <div class="mt-10 text-center">
          <a href="#contacto" class="inline-flex min-h-11 items-center justify-center rounded-full bg-drac-green px-6 py-3 text-sm font-bold text-drac-darker shadow-lg shadow-drac-green/20 transition-all hover:-translate-y-0.5 hover:shadow-xl">Revisar mi atención actual por WhatsApp</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Run the focused test**

Run:

```bash
node scripts/run_clean_env.js npx playwright test tests/stax-connected-offer.spec.js --reporter=line
```

Expected: the proof-link assertions pass and the test fails only when it tries to select `#form-interes`.

- [ ] **Step 3: Commit the commercial section**

```bash
git add index.html
git commit -m "feat: present STAX connected attention offer"
```

### Task 3: Include the chosen service interest in the WhatsApp diagnostic

**Files:**
- Modify: `index.html` in the Alpine `x-data` object for the `#contacto form`.
- Modify: `index.html` before the `#form-mensaje` field.
- Modify: `index.html` in `window.landingApp().buildWhatsAppMessage`.
- Test: `tests/stax-connected-offer.spec.js`

**Interfaces:**
- Consumes: `formInteres` from the contact form.
- Produces: a `form-interes` select whose selected value becomes `Quiero revisar primero: <servicio>.` in the existing WhatsApp message.

- [ ] **Step 1: Extend the form state and submit call**

Inside the contact form `x-data` object, add the initial state after `formMensaje`:

```js
                    formInteres: 'STAX Vitrina',
```

Pass the value into the existing message builder in `handleSubmit()`:

```js
                          details: this.formMensaje,
                          interest: this.formInteres
```

Reset it in `resetForm()`:

```js
                        this.formInteres = 'STAX Vitrina';
```

- [ ] **Step 2: Add the explicit interest selector before `#form-mensaje`**

```html
                    <div class="mt-4">
                      <label for="form-interes" class="mb-2 block text-sm font-bold text-drac-fg">¿Qué quieres revisar primero?</label>
                      <select id="form-interes" x-model="formInteres" class="w-full rounded-xl border border-drac-current/50 bg-drac-darker/60 px-4 py-3 text-sm text-drac-fg outline-none transition focus:border-chile-blue focus:ring-2 focus:ring-chile-blue/20">
                        <option value="STAX Vitrina">STAX Vitrina: mi web y la información principal</option>
                        <option value="STAX Atención Ordenada">STAX Atención Ordenada: consultas con más contexto</option>
                        <option value="STAX Voz">STAX Voz: orientación por voz</option>
                      </select>
                    </div>
```

- [ ] **Step 3: Extend the global message builder**

Change the signature:

```js
        buildWhatsAppMessage({ name, business, phone, details, interest }) {
```

Add this line immediately after the initial `parts` array declaration:

```js
          if (interest) parts.push(`Quiero revisar primero: ${interest}.`);
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run:

```bash
node scripts/run_clean_env.js npx playwright test tests/stax-connected-offer.spec.js --reporter=line
```

Expected: PASS; the form opens WhatsApp with the selected STAX service in its prepared text.

- [ ] **Step 5: Commit the diagnostic context**

```bash
git add index.html tests/stax-connected-offer.spec.js
git commit -m "feat: add STAX service interest to WhatsApp diagnostic"
```

### Task 4: Run full landing and offline regression checks

**Files:**
- Modify: `tests/stax-connected-offer.spec.js` only if a verified regression requires a more precise selector.

**Interfaces:**
- Consumes: completed section, proof links and WhatsApp interest field.
- Produces: a landing that preserves existing demos, console behavior, offline navigation and contact fallback.

- [ ] **Step 1: Run focused and landing coverage**

```bash
node scripts/run_clean_env.js npx playwright test tests/stax-connected-offer.spec.js tests/landing-exhaustive.spec.js --reporter=line
```

Expected: PASS for the new offer behavior and all existing landing contracts.

- [ ] **Step 2: Run console checks and the preproduction gate**

```bash
npm run check_consoles
npm run qa:gate
```

Expected: both commands exit with code `0`; the gate reports `PASS` for static checks, Playwright and `file://` navigation.

- [ ] **Step 3: Inspect responsive layouts**

```bash
npm run serve
```

Open `http://127.0.0.1:4173/index.html` at `390x844` and `1440x900`. Confirm the two offer cards stack on mobile, each CTA remains legible, the heading keeps its two ideas on separate lines, the external VoiceLive link is visually distinct from the local owner-workflow proof link, and `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 4: Check final worktree and commit verified corrections**

```bash
git diff --check
git status --short
```

Expected: only the intended `index.html` and `tests/stax-connected-offer.spec.js` changes are present besides the pre-existing `Dockerfile` and `compose.local.yaml` changes. If an implementation correction was required, commit it with:

```bash
git add index.html tests/stax-connected-offer.spec.js
git commit -m "test: harden STAX connected offer"
```
