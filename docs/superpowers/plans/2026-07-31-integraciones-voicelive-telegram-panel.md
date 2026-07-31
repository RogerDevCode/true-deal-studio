# VoiceLive and Telegram Panel Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two evidence-led integration cards to the local CRM Express panel, linking VoiceLive and opening an offline Telegram workflow preview without configuring a real bot.

**Architecture:** Keep the feature isolated in `demo-agenda/index.html`. Reuse the existing dark glass-card visual language, add scoped CSS for two lightweight HTML visual previews, and add one Alpine boolean state for an accessible Telegram preview dialog. Add a focused Playwright test that verifies copy, external VoiceLive metadata, preview behavior, Escape/click-away closing, and clean browser context.

**Tech Stack:** Static HTML, local Tailwind CSS, local Alpine.js, scoped inline CSS, Playwright, Chrome Headless, `file://`-compatible relative navigation.

## Global Constraints

- Maintain compatibility with `file://`.
- Keep resources local; do not add CDN, remote fonts, or new runtime dependencies.
- Use explicit relative paths for local destinations.
- Preserve visible focus, responsive behavior, accessible names, and `prefers-reduced-motion`.
- Treat VoiceLive and Telegram as demonstrated extensions, not guaranteed automation or a replacement for human attention.
- Do not configure tunnels, Telegram bots, webhooks, credentials, hosting, or external services.
- Use `!important` only for `[x-cloak]` and reduced-motion exceptions when required.
- Preserve unrelated existing worktree changes in `Dockerfile` and `compose.local.yaml`.

---

### Task 1: Add failing coverage for the panel integration cards

**Files:**
- Create: `tests/agenda-integrations.spec.js`
- Reference: `tests/helpers.js`
- Reference: `playwright.config.js`

**Interfaces:**
- Consumes: the future `data-testid` contracts `integrations-section`, `voicelive-card`, `telegram-card`, `telegram-preview-dialog`, and `telegram-preview-close`.
- Produces: a focused regression test for the cards and preview behavior.

- [ ] **Step 1: Write the focused Playwright test**

Create `tests/agenda-integrations.spec.js` with this exact contract:

```js
const { test, expect } = require('@playwright/test');
const { attachPageGuards } = require('./helpers');

test.describe('CRM Express integration cards', () => {
  test('shows VoiceLive and Telegram workflow entry points', async ({ page }) => {
    const guards = await attachPageGuards(page);

    await page.goto('/demo-agenda/index.html');

    const section = page.getByTestId('integrations-section');
    const voiceCard = page.getByTestId('voicelive-card');
    const telegramCard = page.getByTestId('telegram-card');

    await expect(section).toBeVisible();
    await expect(section).toContainText('Tu web puede orientar. Tú puedes decidir.');
    await expect(voiceCard).toContainText('VoiceLive');
    await expect(voiceCard).toContainText('Responde preguntas frecuentes por voz');
    await expect(telegramCard).toContainText('Tu bandeja de atención en Telegram');
    await expect(telegramCard).toContainText('Recibe cada consulta resumida');

    const voiceLink = voiceCard.getByRole('link', { name: 'Probar VoiceLive' });
    await expect(voiceLink).toHaveAttribute('href', 'https://voice.stax.ink/widget/stax');
    await expect(voiceLink).toHaveAttribute('target', '_blank');
    await expect(voiceLink).toHaveAttribute('rel', /noopener/);

    await telegramCard.getByRole('button', { name: 'Ver el flujo del dueño' }).click();

    const preview = page.getByTestId('telegram-preview-dialog');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('Demostración conceptual');
    await expect(preview).toContainText('Consulta web o voz');
    await expect(preview).toContainText('Resumen para el dueño en Telegram');
    await expect(preview).toContainText('Responder');
    await expect(preview).toContainText('Agendar');
    await expect(preview).toContainText('Pedir más datos');

    await page.keyboard.press('Escape');
    await expect(preview).toBeHidden();

    await telegramCard.getByRole('button', { name: 'Ver el flujo del dueño' }).click();
    await page.getByTestId('telegram-preview-close').click();
    await expect(preview).toBeHidden();

    await guards.assertHealthyContext();
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```bash
node scripts/run_clean_env.js playwright test tests/agenda-integrations.spec.js --reporter=line
```

Expected: FAIL because the new integration section and its `data-testid` contracts do not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/agenda-integrations.spec.js
git commit -m "test: define panel integration card behavior"
```

### Task 2: Add the visual cards and local motion preview

**Files:**
- Modify: `demo-agenda/index.html:36-71` for scoped styles.
- Modify: `demo-agenda/index.html:402-435` for the integration block.

**Interfaces:**
- Consumes: the existing `.glass-card`, Tailwind tokens, and the approved VoiceLive/Telegram copy.
- Produces: visible `data-testid="integrations-section"`, `data-testid="voicelive-card"`, and `data-testid="telegram-card"` elements; a local HTML visual that can later be replaced by an MP4/poster without changing the card contract.

- [ ] **Step 1: Add scoped CSS immediately before the existing mobile accessibility media query**

Add this CSS inside the existing `<style>` element:

```css
    [x-cloak] { display: none !important; }
    .integration-visual {
      position: relative;
      min-height: 170px;
      overflow: hidden;
      border: 1px solid rgba(148, 163, 184, 0.16);
      border-radius: 1rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.72));
    }
    .integration-visual__label {
      position: absolute;
      top: 1rem;
      left: 1rem;
      color: #cbd5e1;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .integration-visual__orb {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5rem;
      height: 5rem;
      border: 1px solid rgba(56, 189, 248, 0.8);
      border-radius: 999px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.3), rgba(56, 189, 248, 0.04) 62%, transparent 63%);
      box-shadow: 0 0 0 1rem rgba(56, 189, 248, 0.04), 0 0 3rem rgba(56, 189, 248, 0.24);
      transform: translate(-50%, -50%);
      animation: integration-voice-pulse 5s ease-in-out infinite;
    }
    .integration-visual__orb::after {
      position: absolute;
      inset: 1.45rem;
      border-radius: inherit;
      background: #38bdf8;
      box-shadow: 0 0 1.5rem rgba(56, 189, 248, 0.75);
      content: "";
    }
    .integration-visual__caption {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      left: 1rem;
      color: #e2e8f0;
      font-size: 0.85rem;
      text-align: center;
    }
    .integration-visual__telegram-card {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      left: 1rem;
      padding: 0.8rem;
      border: 1px solid rgba(56, 189, 248, 0.22);
      border-radius: 0.9rem;
      background: rgba(15, 23, 42, 0.88);
      box-shadow: 0 1rem 2rem rgba(2, 6, 23, 0.22);
      animation: integration-telegram-arrive 5s ease-in-out infinite;
    }
    .integration-visual__telegram-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      color: #f8fafc;
      font-size: 0.78rem;
      font-weight: 800;
    }
    .integration-visual__telegram-copy {
      margin-top: 0.45rem;
      color: #94a3b8;
      font-size: 0.72rem;
      line-height: 1.4;
    }
    .integration-visual__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.65rem;
    }
    .integration-visual__action {
      padding: 0.25rem 0.45rem;
      border: 1px solid rgba(56, 189, 248, 0.24);
      border-radius: 999px;
      color: #7dd3fc;
      font-size: 0.68rem;
      font-weight: 700;
    }
    @keyframes integration-voice-pulse {
      0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.94); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.04); }
    }
    @keyframes integration-telegram-arrive {
      0%, 12% { opacity: 0.48; transform: translateY(0.45rem); }
      28%, 100% { opacity: 1; transform: translateY(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .integration-visual__orb,
      .integration-visual__telegram-card { animation: none; }
    }
```

- [ ] **Step 2: Insert the integration section below the existing sales pitch card**

Insert this block immediately after the existing sales pitch `</div>` and before the `<!-- Clear Cache button -->` comment:

```html
        <section class="space-y-4" data-testid="integrations-section" aria-labelledby="integrations-title">
          <div>
            <p class="info-badge inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300 border border-sky-500/20">Extensiones conectables</p>
            <h2 id="integrations-title" class="mt-3 font-display text-xl font-bold leading-tight text-white">Tu web puede orientar. Tú puedes decidir.</h2>
            <p class="mt-2 text-sm leading-relaxed text-slate-400">Explora extensiones que pueden adaptarse a una web nueva o a una que ya tienes.</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <article class="glass-card rounded-2xl p-4 transition-colors hover:border-sky-500/30" data-testid="voicelive-card">
              <div class="integration-visual" role="img" aria-label="Vista previa visual de una consulta atendida por voz">
                <span class="integration-visual__label">Atención por voz</span>
                <span class="integration-visual__orb" aria-hidden="true"></span>
                <span class="integration-visual__caption">¿En qué te orientamos?</span>
              </div>
              <h3 class="mt-4 text-lg font-bold text-white">VoiceLive</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-400">Responde preguntas frecuentes por voz y orienta al visitante antes de que escriba.</p>
              <a href="https://voice.stax.ink/widget/stax" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex min-h-11 items-center rounded-xl border border-sky-400/40 px-4 py-2 text-sm font-bold text-sky-300 transition-colors hover:border-sky-300 hover:bg-sky-400/10 focus:outline-none focus:ring-2 focus:ring-sky-400" aria-label="Probar VoiceLive en una nueva pestaña">Probar VoiceLive <span aria-hidden="true">↗</span></a>
            </article>

            <article class="glass-card rounded-2xl p-4 transition-colors hover:border-sky-500/30" data-testid="telegram-card">
              <div class="integration-visual" role="img" aria-label="Vista previa de una consulta que llega resumida a Telegram">
                <span class="integration-visual__label">Control para el dueño</span>
                <div class="integration-visual__telegram-card" aria-hidden="true">
                  <div class="integration-visual__telegram-title"><span>Telegram · Nueva consulta</span><span>•</span></div>
                  <p class="integration-visual__telegram-copy">Servicio solicitado · comuna · horario preferido</p>
                  <div class="integration-visual__actions"><span class="integration-visual__action">Responder</span><span class="integration-visual__action">Agendar</span><span class="integration-visual__action">Pedir datos</span></div>
                </div>
              </div>
              <h3 class="mt-4 text-lg font-bold text-white">Tu bandeja de atención en Telegram</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-400">Recibe cada consulta resumida y decide el siguiente paso desde tu celular.</p>
              <button type="button" @click="openIntegrationPreview()" class="mt-4 inline-flex min-h-11 items-center rounded-xl border border-sky-400/40 px-4 py-2 text-sm font-bold text-sky-300 transition-colors hover:border-sky-300 hover:bg-sky-400/10 focus:outline-none focus:ring-2 focus:ring-sky-400" aria-label="Ver el flujo del dueño en Telegram">Ver el flujo del dueño <span aria-hidden="true">→</span></button>
            </article>
          </div>
        </section>
```

- [ ] **Step 3: Run the focused test and verify only the behavior test remains blocked on the modal**

Run:

```bash
node scripts/run_clean_env.js playwright test tests/agenda-integrations.spec.js --reporter=line
```

Expected: the card assertions pass; the test fails at the Telegram preview because the Alpine state and dialog have not been added.

- [ ] **Step 4: Commit the static card work**

```bash
git add demo-agenda/index.html
git commit -m "feat: add VoiceLive and Telegram panel cards"
```

### Task 3: Add the offline Telegram workflow preview

**Files:**
- Modify: `demo-agenda/index.html` after `</main>` and before the script block for the dialog markup.
- Modify: `demo-agenda/index.html` inside `dashboardApp()` for `integrationPreviewOpen`, `openIntegrationPreview()`, and `closeIntegrationPreview()`.

**Interfaces:**
- Consumes: `openIntegrationPreview()` from the Telegram card and the existing Alpine root state.
- Produces: `data-testid="telegram-preview-dialog"`, `data-testid="telegram-preview-close"`, Escape closing, click-away closing, and a clearly labeled conceptual flow with no network or storage side effects.

- [ ] **Step 1: Add the dialog markup before the script block**

Insert this block after `</main>` and before `<!-- Script block -->`:

```html
  <div x-show="integrationPreviewOpen" x-cloak x-transition.opacity @keydown.escape.window="closeIntegrationPreview()" @click.self="closeIntegrationPreview()" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-labelledby="telegram-preview-title" data-testid="telegram-preview-dialog">
    <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6" @click.stop>
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">Demostración conceptual</span>
          <h2 id="telegram-preview-title" class="mt-3 text-xl font-bold text-white">De la consulta al siguiente paso</h2>
        </div>
        <button type="button" @click="closeIntegrationPreview()" class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-2xl text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400" aria-label="Cerrar vista previa de Telegram" data-testid="telegram-preview-close">×</button>
      </div>
      <p class="mt-3 text-sm leading-relaxed text-slate-300">El cliente consulta desde una web o por voz. El dueño recibe la información ordenada en Telegram y decide cómo continuar.</p>
      <ol class="mt-5 grid gap-3 text-sm text-slate-300">
        <li class="rounded-xl border border-slate-700 bg-slate-950/60 p-3"><strong class="text-sky-300">01 · Consulta web o voz</strong><span class="mt-1 block text-slate-400">La persona explica lo que necesita desde el canal que ya está usando.</span></li>
        <li class="rounded-xl border border-slate-700 bg-slate-950/60 p-3"><strong class="text-sky-300">02 · Datos relevantes ordenados</strong><span class="mt-1 block text-slate-400">Servicio, comuna y horario quedan listos para revisar.</span></li>
        <li class="rounded-xl border border-slate-700 bg-slate-950/60 p-3"><strong class="text-sky-300">03 · Resumen para el dueño en Telegram</strong><span class="mt-1 block text-slate-400">La consulta llega en una ficha breve, sin obligarte a reconstruir el contexto.</span></li>
      </ol>
      <div class="mt-5 flex flex-wrap gap-2" aria-label="Acciones representadas en la demostración"><span class="rounded-full border border-sky-400/30 px-3 py-1.5 text-xs font-bold text-sky-300">Responder</span><span class="rounded-full border border-sky-400/30 px-3 py-1.5 text-xs font-bold text-sky-300">Agendar</span><span class="rounded-full border border-sky-400/30 px-3 py-1.5 text-xs font-bold text-sky-300">Pedir más datos</span></div>
      <p class="mt-5 border-t border-slate-800 pt-4 text-xs leading-relaxed text-slate-500">La conexión real se configura según el negocio, sus canales y la información que apruebe. Esta vista no envía mensajes ni usa datos reales.</p>
    </div>
  </div>
```

- [ ] **Step 2: Add the Alpine state and methods**

Add the boolean beside the existing filter state:

```js
        integrationPreviewOpen: false,
```

Add these methods before `initDashboard()`:

```js
        openIntegrationPreview() {
          this.integrationPreviewOpen = true;
        },

        closeIntegrationPreview() {
          this.integrationPreviewOpen = false;
        },

```

- [ ] **Step 3: Run the focused test and verify it passes**

Run:

```bash
node scripts/run_clean_env.js playwright test tests/agenda-integrations.spec.js --reporter=line
```

Expected: PASS for the integration card and preview test, with no console or network guard failures.

- [ ] **Step 4: Commit the preview behavior**

```bash
git add demo-agenda/index.html
git commit -m "feat: add Telegram workflow preview to agenda panel"
```

### Task 4: Validate local navigation, responsive layout, and release gate

**Files:**
- Modify: `tests/agenda-integrations.spec.js` only if a real assertion failure identifies an incorrect selector or behavior.
- Reference: `docs/superpowers/specs/2026-07-31-integraciones-voicelive-telegram-panel-design.md`.

**Interfaces:**
- Consumes: the completed panel cards, local preview dialog, and existing QA gate.
- Produces: verified local behavior at desktop and mobile sizes, with no changes to external Telegram infrastructure.

- [ ] **Step 1: Run the focused test and core console test**

```bash
node scripts/run_clean_env.js playwright test tests/agenda-integrations.spec.js tests/console.spec.js --reporter=line
```

Expected: PASS; console/network guards remain clean for the panel and core pages.

- [ ] **Step 2: Run the complete preproduction gate**

```bash
npm run qa:gate
```

Expected: `PASS` from static checks, Playwright checks, `file://` navigation, resource checks, and console/network validation.

- [ ] **Step 3: Inspect responsive screenshots locally**

Run:

```bash
npm run serve
```

In a second terminal, use the configured Chrome/Playwright environment to inspect `http://127.0.0.1:4173/demo-agenda/index.html` at `390x844` and `1440x900`. Confirm that the two cards stack cleanly on mobile, the CTA remains reachable, the dialog fits within the viewport, and no horizontal overflow appears.

- [ ] **Step 4: Check the final worktree and commit test-only corrections if needed**

```bash
git diff --check
git status --short
```

Expected: only the intended panel/test changes are present in addition to the pre-existing `Dockerfile` and `compose.local.yaml` changes. If a correction was required, commit it with:

```bash
git add demo-agenda/index.html tests/agenda-integrations.spec.js
git commit -m "test: harden panel integration preview"
```
