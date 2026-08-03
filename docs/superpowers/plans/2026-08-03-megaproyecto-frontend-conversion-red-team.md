# STAX Frontend Conversion and Red-Team Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Convert the approved voice-first STAX design into a fast, accessible customer journey and make VoiceLive and VentaMax IA lead with the next human action.

**Architecture:** Deliver four independent waves: STAX public entry and demos, VoiceLive public widget and tenant workspace, VentaMax IA operator home, then a cross-repository red-team gate. Repositories, databases, credentials and Docker deployments remain separate.

**Tech Stack:** HTML/CSS/Tailwind/Alpine/Playwright; FastAPI/Python/React/Vite/Vitest; Next.js/React/TypeScript/Tailwind/Vitest; local WebM/MP4/WebVTT/WebP; Lighthouse.

## Global Constraints

- Preserve file://, explicit relative routes and local assets in True Deal.
- One main hero action: Hablar ahora con la demo. One secondary action: Ver un ejemplo de mi rubro.
- Every video has poster, captions, controls, lazy loading, static equivalent and reduced-motion behavior.
- No autoplay with sound, decorative loops, CDN media, customer data, invented results or fake testimonials.
- STAX copy to owners may say negocio. Public health/care copy uses atención, acompañamiento, familia and profesional. Beauty uses experiencia, servicio, reserva, salón and equipo.
- VoiceLive identity fields stay optional until reliable identification is needed; explicit consent stays mandatory before transcript creation.
- VoiceLive agenda remains SSOT. Google Calendar remains output only. VentaMax IA remains Telegram-first.
- No test is deleted, skipped, broadly mocked, excluded or weakened to get green.
- The red team can reject release despite passing automation.

---

## Deliverable map

| Wave | Repository | Deliverable | Exit criterion |
| --- | --- | --- | --- |
| 1 | true-deal-studio | Voice-first hero, restrained proof media, demo boundary | npm run qa:gate PASS |
| 2 | voicelive-v2 | Brand-first widget and Today workspace | Backend and frontend gates PASS |
| 3 | venta-max-ia | Daily action operator home | Typecheck, lint, test, build and security PASS |
| 4 | all three | Independent red-team report | No open critical/high risk |

## Interfaces introduced

~~~ts
export interface PublicTenantPreview {
  tenant: PublicTenantBrand;
  assistant: Pick<PublicAssistantInfo, "welcome_message" | "tone" | "voice_enabled" | "appointments_enabled" | "orders_enabled">;
  services: PublicServiceInfo[];
}
export function getPublicTenantPreview(tenantSlug: string): Promise<PublicTenantPreview>;

export interface TodayAction {
  id: "waitlist" | "intent" | "handoff" | "calendar" | "knowledge";
  count: number;
  label: string;
  destination: "continuity" | "appointments" | "operations" | "calendar" | "knowledge";
}

export interface OperatorToday {
  unreadConversations: number;
  pendingOrders: number;
  telegramStatus: "connected" | "reconnect_required" | "unconfigured";
}
~~~

### Task 1: Establish independent red-team baseline

**Files:**
- Create: docs/qa/2026-08-03-frontend-baseline.md
- Create: docs/qa/2026-08-03-media-registry.md
- Create: docs/qa/2026-08-03-red-team-frontend-report.md
- Read-only input: docs/sugerencias-promocion.md and docs/agents/DEVILS_ADVOCATE.md

**Interfaces:**
- Consumes promotional suggestions and the approved design.
- Produces baseline evidence and an initial NO APROBADO verdict.

- [ ] **Step 1: Inventory every surface before editing**

Record route, first action, identity, external dependency, fallback and owner for:

~~~text
STAX: /index.html, all demo-*/index.html, /privacidad.html
VoiceLive: /widget/<slug>, /, tenant workspace
VentaMax: /login, /inbox, /orders, /pipeline, /agent, /lab, /analytics, /settings/*
~~~

- [ ] **Step 2: Capture reproducible baseline**

Run:

~~~bash
cd /home/manager/Sync/python_proyects/true-deal-studio && npm run qa:gate
cd /home/manager/Sync/python_proyects/voicelive-v2 && make ci
cd /home/manager/Sync/python_proyects/venta-max-ia && pnpm typecheck && pnpm lint && pnpm test && pnpm build
~~~

Expected: write exact output, commit and failure status. Existing failures remain risks.

- [ ] **Step 3: Register every medium**

Use this table:

~~~markdown
| ID | Surface | Question answered | Format | Max bytes | Poster/captions | Loading | Static fallback | Test |
| --- | --- | --- | --- | ---: | --- | --- | --- | --- |
~~~

First entry is stax-voice-proof. It answers “¿Qué ocurre cuando una persona pregunta?”, lasts 15–20 seconds, uses synthetic dialogue, poster WebP, captions VTT and static transcript.

- [ ] **Step 4: Start the red-team report as rejected**

~~~markdown
## Veredicto
NO APROBADO

| ID | Severidad | Hallazgo verificable | Corrección exigida |
| --- | --- | --- | --- |
| UX-001 | Medio | La voz no es la acción dominante del hero actual. | Completar wave 1 y journey test. |
~~~

- [ ] **Step 5: Commit**

~~~bash
git add docs/qa/2026-08-03-frontend-baseline.md docs/qa/2026-08-03-media-registry.md docs/qa/2026-08-03-red-team-frontend-report.md
git commit -m "docs: establish frontend conversion red-team baseline"
~~~

### Task 2: Specify strict STAX voice-first tests

**Files:**
- Create: tests/voice-first-hero.spec.js
- Modify: tests/stax-connected-offer.spec.js
- Modify: tests/landing-exhaustive.spec.js
- Modify: scripts/preproduction_gate.js

**Interfaces:**
- Produces test IDs stax-voice-proof, stax-voice-demo-cta, stax-rubro-cta and stax-video-fallback.

- [ ] **Step 1: Write the failing journey test**

~~~js
test("hero makes voice proof the first conversion action", async ({ page }) => {
  await page.goto("/index.html");
  await waitForAlpine(page);
  const hero = page.locator("#inicio");
  await expect(hero.getByTestId("stax-voice-proof")).toBeVisible();
  await expect(hero.getByTestId("stax-voice-demo-cta")).toHaveText(/Hablar ahora con la demo/i);
  await expect(hero.getByTestId("stax-rubro-cta")).toHaveText(/Ver un ejemplo de mi rubro/i);
  await expect(hero.getByTestId("stax-voice-demo-cta"))
    .toHaveAttribute("href", "https://voice.stax.ink/widget/stax");
});
~~~

Also assert muted default, no autoplay, preload none, poster, captions, static fallback, 320px layout and a tunnel-safe alternate action.

- [ ] **Step 2: Verify failure**

Run: npm run qa:e2e -- --grep "voice proof"  
Expected: FAIL because these selectors do not exist.

- [ ] **Step 3: Extend static validation**

Add validateVoiceProofMedia() to scripts/preproduction_gate.js. It rejects remote video, autoplay, absent poster/caption/fallback and assets over the media-registry budget.

- [ ] **Step 4: Commit**

~~~bash
git add tests/voice-first-hero.spec.js tests/stax-connected-offer.spec.js tests/landing-exhaustive.spec.js scripts/preproduction_gate.js
git commit -m "test: define strict voice-first landing contract"
~~~

### Task 3: Implement STAX proof module and hero hierarchy

**Files:**
- Create: assets/visuals/stax-voice-proof.webm
- Create: assets/visuals/stax-voice-proof.mp4
- Create: assets/visuals/stax-voice-proof-poster.webp
- Create: assets/visuals/stax-voice-proof.vtt
- Modify: index.html lines 587–723 and 1210–1405
- Modify: docs/qa/2026-08-03-media-registry.md

**Interfaces:**
- Consumes Task 2 selectors.
- Produces proof media that is understandable even with video, JavaScript or tunnel unavailable.

- [ ] **Step 1: Create sanitised media**

Capture only an isolated synthetic STAX tenant: question → approved orientation → “Consulta con contexto lista para revisar”. Remove audio before encoding. Do not record contact details, secrets, real conversation or private panel.

- [ ] **Step 2: Implement progressive markup**

~~~html
<section data-testid="stax-voice-proof" class="stax-voice-proof" aria-labelledby="stax-voice-proof-title">
  <p class="stax-proof-eyebrow">PRUEBA EN 20 SEGUNDOS</p>
  <h2 id="stax-voice-proof-title">Mira cómo una consulta llega mejor explicada.</h2>
  <video controls muted playsinline preload="none" poster="./assets/visuals/stax-voice-proof-poster.webp" aria-describedby="stax-video-fallback">
    <source src="./assets/visuals/stax-voice-proof.webm" type="video/webm">
    <source src="./assets/visuals/stax-voice-proof.mp4" type="video/mp4">
    <track kind="captions" srclang="es" label="Español" src="./assets/visuals/stax-voice-proof.vtt" default>
  </video>
  <p id="stax-video-fallback" data-testid="stax-video-fallback">Pregunta natural → orientación clara → contexto listo para revisar.</p>
</section>
~~~

Use IntersectionObserver to attach source URLs only near viewport. Add scoped stax-voice-proof styles and reduced-motion fallback.

- [ ] **Step 3: Change CTA order**

~~~html
<a data-testid="stax-voice-demo-cta" href="https://voice.stax.ink/widget/stax">Hablar ahora con la demo</a>
<a data-testid="stax-rubro-cta" href="#demos">Ver un ejemplo de mi rubro</a>
~~~

Keep WhatsApp contact lower in the journey.

- [ ] **Step 4: Verify and commit**

~~~bash
npm run qa:e2e -- --grep "voice proof|connected service offer"
npm run qa:gate
git add index.html assets/visuals/stax-voice-proof.* docs/qa/2026-08-03-media-registry.md tests scripts
git commit -m "feat: make STAX voice proof the hero action"
~~~

Expected: PASS, local assets only, no console/network errors.

### Task 4: Make demo boundaries explicit; implement Fono and Beauty copy first

**Files:**
- Modify: every demo-*/index.html found by rg --files -g index.html demo-*
- Create: tests/demo-identity-boundary.spec.js
- Modify: tests/fono-live-faq.spec.js
- Modify: tests/salon-commercial.spec.js

**Interfaces:**
- Produces data-testid demo-context-bar, data-testid demo-return-stax and data-demo-context before each demo brand.

- [ ] **Step 1: Write cross-demo failing test**

~~~js
for (const demo of ["fonoaudiologia", "salon-belleza", "cafe-valparaiso"]) {
  test(demo + " identifies itself as a STAX reference before its own brand", async ({ page }) => {
    await page.goto("/demo-" + demo + "/index.html");
    const bar = page.getByTestId("demo-context-bar");
    await expect(bar).toContainText(/DEMO STAX/i);
    await expect(bar.getByTestId("demo-return-stax")).toHaveAttribute("href", "../index.html");
  });
}
~~~

At 320px, assert context and return link remain visible and DOM order is boundary → demo brand → demo hero.

- [ ] **Step 2: Verify failure**

Run: npm run qa:e2e -- --grep "STAX reference"  
Expected: FAIL because common test IDs do not exist.

- [ ] **Step 3: Apply common boundary**

Insert before every demo header:

~~~html
<div data-testid="demo-context-bar" data-demo-context="[context]" class="demo-context-bar">
  <div class="demo-context-bar__inner">
    <p>DEMO STAX · [context]</p>
    <a data-testid="demo-return-stax" href="../index.html">← Volver a STAX</a>
  </div>
</div>
~~~

Use context only from: ATENCIÓN FONOAUDIOLÓGICA, ATENCIÓN Y RESERVAS, CATÁLOGO Y PEDIDOS, SERVICIOS Y COORDINACIÓN or PÁGINA COMERCIAL DE REFERENCIA.

- [ ] **Step 4: Apply approved language**

Fono header is Nahovy Gallegos followed by secondary text Fonoaudiología. Supporting text: “Así puede sentirse una primera orientación para tu familia.” Beauty supporting text: “Así puede sentirse una reserva clara y cercana.” Secondary identity: “Belleza y cuidado personal”.

- [ ] **Step 5: Add copy regression**

Assert public Fono/Psychology/Beauty hero, boundary and primary CTA do not match word negocio. STAX owner-facing index.html remains allowed to use it.

- [ ] **Step 6: Verify and commit**

~~~bash
npm run qa:e2e -- --grep "STAX reference|Fono FAQ|Salon"
npm run qa:gate
git add demo-*/index.html tests/demo-identity-boundary.spec.js tests/fono-live-faq.spec.js tests/salon-commercial.spec.js
git commit -m "feat: clarify STAX demo identity boundaries"
~~~

### Task 5: Add safe VoiceLive preview before public consent

**Files:**
- Modify: voicelive-v2/backend/app/public_chat/router.py
- Modify: voicelive-v2/backend/app/conversations/schemas.py
- Modify: voicelive-v2/backend/tests/test_public_chat.py
- Modify: voicelive-v2/frontend/src/api/publicChat.ts
- Modify: voicelive-v2/frontend/src/api/publicChat.test.ts
- Modify: voicelive-v2/frontend/src/public-widget/PublicTextWidget.tsx
- Modify: voicelive-v2/frontend/src/styles/global.css
- Modify: voicelive-v2/frontend/package.json and package-lock.json
- Modify: voicelive-v2/frontend/vite.config.ts
- Create: voicelive-v2/frontend/src/test/setup.ts

**Interfaces:**
- Produces GET /api/v1/public/{tenant_slug}/preview returning PublicTenantPreview; no session token, contact, memory or private setting.

- [ ] **Step 1: Write failing backend privacy tests**

~~~py
def test_public_preview_exposes_only_safe_published_presentation(client):
    response = client.get("/api/v1/public/fonoaudiologia/preview")
    assert response.status_code == 200
    assert response.json()["tenant"]["name"] == "Fonoaudiología"
    assert "session_token" not in response.text
    assert "whatsapp" not in response.json()["tenant"]

def test_public_preview_hides_unavailable_tenant(client):
    response = client.get("/api/v1/public/otro-tenant/preview")
    assert response.status_code == 404
    assert response.json()["detail"]["code"] == "tenant_not_available"
~~~

- [ ] **Step 2: Verify failure**

Run: cd backend && .venv/bin/python -m pytest tests/test_public_chat.py -k preview -q  
Expected: FAIL because the endpoint is absent.

- [ ] **Step 3: Implement preview and initial card**

Resolve tenant through _tenant_or_error, set Cache-Control no-store and return only name, slogan, logo, public colors, active services and feature flags. Do not call create_public_session.

Add getPublicTenantPreview(). Initial widget order: brand, purpose, example question, consent, optional identity note, start. The public H1 never shows the slug. Preview error gives recovery without session creation.

- [ ] **Step 4: Write frontend contract test**

~~~ts
it("loads public branding before creating a consented session", async () => {
  await getPublicTenantPreview("fonoaudiologia");
  expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/v1/public/fonoaudiologia/preview");
});
~~~

Also assert name/WhatsApp remain optional and unavailable preview produces visible recovery copy.

- [ ] **Step 5: Add a browser-like component test environment**

Pin only the needed development dependencies: jsdom, @testing-library/react and @testing-library/user-event.
Configure the public-widget test files to use jsdom and load src/test/setup.ts with cleanup after each test. Add a
PublicTextWidget.test.tsx test that renders a successful preview, verifies the tenant name appears before the consent
checkbox, verifies the slug is absent from the heading, and verifies that no session POST occurs before the user
checks consent and presses begin.

- [ ] **Step 6: Verify and commit**

~~~bash
make backend-test
make frontend-typecheck
make frontend-test
make frontend-build
git add backend/app/public_chat backend/app/conversations backend/tests/test_public_chat.py frontend/src/api/publicChat.* frontend/src/public-widget frontend/src/styles/global.css frontend/src/test/setup.ts frontend/vite.config.ts frontend/package.json frontend/package-lock.json
git commit -m "feat: show VoiceLive tenant context before consent"
~~~

### Task 6: Add VoiceLive Today without hiding current operations

**Files:**
- Create: voicelive-v2/frontend/src/features/today/TodayPanel.tsx
- Create: voicelive-v2/frontend/src/features/today/todayActions.ts
- Create: voicelive-v2/frontend/src/features/today/todayActions.test.ts
- Modify: voicelive-v2/frontend/src/admin/TenantWorkspace.tsx
- Modify: voicelive-v2/frontend/src/styles/global.css

**Interfaces:**
- Consumes getContinuity, listHandoffs, listKnowledgeGaps and getAnalyticsSummary.
- Produces TodayPanel({ tenantId, canEdit, canOperate, onNavigate }) and buildTodayActions(...) with no new write endpoint.

- [ ] **Step 1: Write failing action-priority test**

~~~ts
it("orders actionable work before setup", () => {
  const actions = buildTodayActions({ waitlist: [{ id: "a" }], intents: [] }, [], [], true);
  expect(actions[0]).toMatchObject({ id: "waitlist", count: 1, destination: "continuity" });
  expect(actions.some((action) => action.id === "knowledge")).toBe(true);
});
~~~

Also assert operator cannot receive the owner-only knowledge action and that zero counts produce no fake urgent work.

- [ ] **Step 2: Verify failure**

Run: cd frontend && npm run test -- todayActions.test.ts  
Expected: FAIL because panel and tab do not exist.

- [ ] **Step 3: Implement**

Fetch sources with Promise.allSettled. Pass successful results to buildTodayActions, which maps only waitlist, intent,
handoff, calendar and knowledge action IDs. A failed source renders its own retry card; it cannot erase successful
actions. Add today as default TenantWorkspace tab; preserve every existing tab and permission check.

- [ ] **Step 4: Verify and commit**

~~~bash
make frontend-typecheck && make frontend-test && make frontend-build
git add frontend/src/features/today frontend/src/admin/TenantWorkspace.tsx frontend/src/styles/global.css
git commit -m "feat: prioritize daily VoiceLive tenant actions"
~~~

### Task 7: Add VentaMax daily action home

**Files:**
- Create: venta-max-ia/src/server/operations/today.ts
- Create: venta-max-ia/src/app/api/operations/today/route.ts
- Create: venta-max-ia/src/components/operations/today-client.tsx
- Create: venta-max-ia/src/app/(app)/page.tsx
- Create: venta-max-ia/tests/unit/operator-today.test.ts
- Modify: venta-max-ia/src/app/page.tsx
- Modify: venta-max-ia/src/components/app-nav.tsx

**Interfaces:**
- Produces authenticated GET /api/operations/today returning OperatorToday. Browser never supplies organization ID.

- [ ] **Step 1: Write failing tenant-scoped query test**

~~~ts
it("counts only active organization work", async () => {
  expect(await getOperatorToday(orgA.id)).toEqual({
    unreadConversations: 2,
    pendingOrders: 1,
    telegramStatus: "connected",
  });
  expect(await getOperatorToday(orgB.id)).toEqual({
    unreadConversations: 0,
    pendingOrders: 0,
    telegramStatus: "unconfigured",
  });
});
~~~

Also test reconnect_required and prove no token is selected or returned.

- [ ] **Step 2: Verify failure**

Run: pnpm vitest run tests/unit/operator-today.test.ts  
Expected: FAIL because module and route do not exist.

- [ ] **Step 3: Implement**

Use authenticated server organization context and existing scoped DB. Count unread conversations, orders in pending/confirmed/processing/pending_shipment/shipped/paused and Telegram status only. Cards are conversations, orders and Telegram in that order. Unauthenticated root keeps login/register behavior.

- [ ] **Step 4: Reorder navigation, verify and commit**

Keep Bandeja/Pedidos first; position Agente/Laboratorio/Analytics after Pipeline/Contactos. WhatsApp stays disabled.

~~~bash
pnpm typecheck && pnpm lint
pnpm vitest run tests/unit/operator-today.test.ts tests/unit/telegram-only-surface.test.ts
pnpm test && pnpm build
git add src/server/operations/today.ts src/app/api/operations/today src/components/operations/today-client.tsx src/app/'(app)'/page.tsx src/app/page.tsx src/components/app-nav.tsx tests/unit/operator-today.test.ts
git commit -m "feat: prioritize VentaMax daily operator work"
~~~

### Task 8: Add privacy-safe conversion events

**Files:**
- Create: tests/conversion-events.spec.js
- Create: scripts/validate_conversion_events.js
- Modify: True Deal index.html
- Modify: VoiceLive PublicTextWidget.tsx
- Modify: VentaMax today-client.tsx
- Modify: docs/qa/2026-08-03-media-registry.md

**Interfaces:**
- Produces CustomEvent stax:conversion with only event, surface, optional public slug and ISO timestamp.

- [ ] **Step 1: Write failing privacy test**

~~~js
expect(events).toContainEqual(expect.objectContaining({ event: "voice_demo_opened", surface: "stax-web" }));
expect(JSON.stringify(events)).not.toMatch(/María|569|token|session/i);
~~~

- [ ] **Step 2: Verify failure**

Run: npm run qa:e2e -- --grep "conversion event"  
Expected: FAIL because no event is emitted.

- [ ] **Step 3: Implement approved event list**

~~~text
voice_proof_played
voice_proof_completed
voice_demo_opened
rubro_example_opened
demo_boundary_seen
public_chat_started
contact_prepared
operator_today_action_opened
~~~

No third-party analytics dependency is added.

- [ ] **Step 4: Verify and commit**

Run focused tests plus each application’s native gate. Add event purpose and privacy statement to media registry; commit only changed files.

### Task 9: Execute the independent Devil’s Advocate gate

**Files:**
- Modify: docs/qa/2026-08-03-red-team-frontend-report.md
- Create: docs/qa/2026-08-03-frontend-evidence-ledger.md
- Create: docs/qa/2026-08-03-copy-sensitivity-audit.md
- Create: docs/qa/2026-08-03-journey-test-matrix.md

**Interfaces:**
- Consumes test outputs, source diffs, screenshots, traces and media registry.
- Produces APROBADO, APROBADO CON CONDICIONES or NO APROBADO.

- [ ] **Step 1: Run ten-second comprehension evidence**

At 320×568, 390×844 and 1440×900, without scrolling, answer with selector/screenshot: What is STAX? Where can I try it? What happens next? Is this STAX or a demo? What happens when media/widget fails? Needing inference beyond visible content is failure.

- [ ] **Step 2: Run adversarial recovery**

Block MP4/WebM, block voice.stax.ink, disable JS, enable reduced motion and validate file:// where applicable. Blank media, spinner, inaccessible control or false promise of live human attention blocks release.

- [ ] **Step 3: Run sensitivity audit**

~~~bash
rg -n -i 'negocio' demo-fonoaudiologia demo-psicologa demo-salon-belleza
~~~

Every hit is removed or justified as owner-facing B2B copy.

- [ ] **Step 4: Audit authorization and assertion quality**

Prove Voice preview has no secret/contact/private configuration; Today hides owner-only actions from operators; VentaMax route does not accept org ID or emit Telegram token. Every changed test names the concrete bug it detects. Reject presence-only, generic-success, broad-truthiness, unit-under-test mock and weakened-assertion tests.

- [ ] **Step 5: Issue verdict and commit**

Use the report tables in docs/agents/DEVILS_ADVOCATE.md. Critical/high risks block production. An unavailable external credential is NO VERIFICADO, not PASS.

### Task 10: Run final gates and reconcile decision

**Files:**
- Modify: red-team report and evidence ledger from Task 9.

- [ ] **Step 1: Run STAX**

~~~bash
cd /home/manager/Sync/python_proyects/true-deal-studio
npm run qa:gate
npm run qa:e2e
npm run qa:lighthouse
~~~

- [ ] **Step 2: Run VoiceLive**

~~~bash
cd /home/manager/Sync/python_proyects/voicelive-v2
make ci
make security-audit
curl --fail http://127.0.0.1:8000/api/v1/ready
~~~

The existing VoiceLive 90% coverage gate remains a production blocker until its approved coverage plan closes it.

- [ ] **Step 3: Run VentaMax**

~~~bash
cd /home/manager/Sync/python_proyects/venta-max-ia
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm db:verify && pnpm db:verify-security && pnpm db:test-security
~~~

- [ ] **Step 4: Finalize evidence**

Run git diff --check in each repository. The report says APROBADO only when every high/critical risk has repeatable closure evidence. This plan does not change DNS, tunnels, domains, secrets or deployments.

## Spec coverage self-review

| Design requirement | Task |
| --- | --- |
| Voice-first proof and restrained media | 2–3 |
| Explicit demo identity; Fono/Beauty copy | 4 |
| VoiceLive public brand context | 5 |
| VoiceLive Today actions | 6 |
| VentaMax action-first operation | 7 |
| Privacy-safe conversion evidence | 8 |
| Independent suggestions-driven red team | 1 and 9 |
| Mobile, offline, fallback and failure states | 2–4 and 9–10 |
| No relaxed tests | Global constraints and 2–10 |

## Completion criteria

- All four waves meet their exit criterion.
- STAX makes voice proof visible before product explanation and works without video, JS or a live tunnel.
- Every demo has a clear STAX boundary and own identity.
- Sensitive copy audit passes for health, care and beauty.
- VoiceLive/VentaMax make daily human work visible without weakening authorization.
- Red team documents every changed test and returns an evidence-backed verdict.
