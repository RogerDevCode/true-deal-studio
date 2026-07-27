# Apex Tech Trustworthy Demo Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present a truthful, stock-aware demo order journey whose checkout and administrative proof remain usable on mobile.

**Architecture:** Preserve the single-file Alpine.js application and incumbent Apex visual system. Add small state helpers for inventory, validation and overlay focus; render mobile administration cards from the same `products` and `orders` arrays used by desktop tables. Keep every route and asset local for `file://` compatibility.

**Tech Stack:** Static HTML, local CSS, Alpine.js, localStorage for demo state, Playwright, Node.js 22.

## Global Constraints

- Keep `lang="es-CL"`, one `<h1>`, complete Open Graph metadata, Twitter card and JSON-LD.
- Keep explicit relative paths and offline compatibility.
- Keep Presencial first and selected by default.
- Use positive, direct Spanish and identify illustrative data.
- Preserve the navy/orange/cyan identity and existing product imagery.
- Add zero remote dependencies and reserve `!important` for `[x-cloak]` and reduced motion.
- Leave `docs/auditoria.md` intact.

---

### Task 1: Commercial truth and guided demo story

**Files:**
- Modify: `demo-ecommerce-tech/index.html`
- Create: `tests/ecommerce-commercial.spec.js`

**Interfaces:**
- Consumes: existing metadata, hero, catalog, scale section and footer.
- Produces: visible `.demo-disclosure`, owner-oriented narrative and truthful order labels used by later tests.

- [ ] **Step 1: Write the failing commercial-truth test**

```js
test('Apex Tech identifies its simulated and production capabilities', async ({ page }) => {
  await page.goto('/demo-ecommerce-tech/index.html');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tu catálogo también puede ordenar pedidos');
  await expect(page.locator('.demo-disclosure').first()).toContainText('Demostración interactiva');
  await expect(page.getByRole('link', { name: 'Probar catálogo' })).toBeVisible();
  await expect(page.locator('body')).toContainText('Las pasarelas de pago se conectan al publicar');
  await expect(page.locator('script[type="application/ld+json"]')).toContainText('WebPage');
  await expect(page.locator('body')).not.toContainText('Pagos digitales listos');
  await expect(page.locator('body')).not.toContainText('Envío Express Hoy mismo');
});
```

- [ ] **Step 2: Verify the test fails**

Run: `npx playwright test tests/ecommerce-commercial.spec.js -g "identifies"`

Expected: FAIL because the current hero and structured data still claim real payments and a real store.

- [ ] **Step 3: Implement truthful metadata and copy**

Use `WebPage` JSON-LD, add a visible demo disclosure, and apply this vocabulary:

```html
<h1 class="hero-title">Tu catálogo también puede ordenar pedidos</h1>
<p class="hero-description">Prueba el catálogo como cliente, crea un pedido demostrativo y revisa cómo llega al panel del negocio.</p>
<a href="#catalogo" class="btn btn-primary">Probar catálogo</a>
```

Rewrite production integrations as configurable future scope and remove urgency or automation claims unsupported by the demo.

- [ ] **Step 4: Verify the commercial test passes**

Run: `npx playwright test tests/ecommerce-commercial.spec.js -g "identifies"`

Expected: PASS.

- [ ] **Step 5: Commit the commercial truth change**

```bash
git add demo-ecommerce-tech/index.html tests/ecommerce-commercial.spec.js
git commit -m "fix: clarify ecommerce demo capabilities"
```

---

### Task 2: Stock-aware cart and contextual checkout

**Files:**
- Modify: `demo-ecommerce-tech/index.html`
- Modify: `tests/ecommerce-commercial.spec.js`
- Modify: `tests/demos-6-to-8-exhaustive.spec.js`

**Interfaces:**
- Consumes: `products`, `cart`, `addToCart`, `increaseQty`, `checkoutMethod`.
- Produces: `getCartItemQty(productId)`, `canAddProduct(product)`, `deliverySummary`, `checkoutError`, `validateCheckout()` and `stockNotice`.

- [ ] **Step 1: Write failing stock and checkout tests**

```js
test('Cart respects stock and checkout explains the demo order', async ({ page }) => {
  await page.goto('/demo-ecommerce-tech/index.html');
  const add = page.getByRole('button', { name: /Agregar al carro.*3 disponibles/i }).first();
  await add.click();
  await page.getByRole('button', { name: /Aumentar cantidad/i }).click();
  await page.getByRole('button', { name: /Aumentar cantidad/i }).click();
  await expect(page.getByRole('button', { name: /Aumentar cantidad/i })).toBeDisabled();
  await page.getByRole('button', { name: 'Revisar pedido demo' }).click();
  await expect(page.getByRole('dialog', { name: 'Crear pedido demo' })).toContainText('$389.970');
  await expect(page.getByRole('dialog', { name: 'Crear pedido demo' })).toContainText('Retiro demostrativo · sin costo de despacho');
});

test('Checkout guides an invalid WhatsApp and preserves the order', async ({ page }) => {
  await page.goto('/demo-ecommerce-tech/index.html');
  await page.getByRole('button', { name: /Agregar al carro/i }).first().click();
  await page.getByRole('button', { name: 'Revisar pedido demo' }).click();
  await page.getByLabel('Nombre completo').fill('Camila Soto');
  await page.getByLabel('WhatsApp').fill('abc');
  await page.getByRole('button', { name: 'Crear pedido demo' }).click();
  await expect(page.getByRole('alert')).toContainText('Escribe un WhatsApp chileno válido');
  await expect(page.getByRole('dialog', { name: 'Crear pedido demo' })).toBeVisible();
});
```

- [ ] **Step 2: Verify both tests fail**

Run: `npx playwright test tests/ecommerce-commercial.spec.js -g "stock|WhatsApp"`

Expected: FAIL because stock is unlimited, the order summary is absent and phone validation is native-only.

- [ ] **Step 3: Implement inventory helpers and accessible controls**

```js
getCartItemQty(productId) {
  return this.cart.find(item => item.id === productId)?.qty || 0;
},
canAddProduct(product) {
  return product.active && product.stock > this.getCartItemQty(product.id);
},
increaseQty(item) {
  const product = this.products.find(candidate => candidate.id === item.id);
  if (product && item.qty < product.stock) item.qty += 1;
  else this.stockNotice = 'Stock máximo agregado.';
},
```

Add stock text and `aria-label` values to product, quantity and remove controls. Disable add/increase at the maximum.

- [ ] **Step 4: Add checkout summary and validation**

```js
validateCheckout() {
  const phone = this.checkoutPhone.replace(/\s|-/g, '');
  if (!this.checkoutName.trim()) return 'Escribe tu nombre para crear el pedido demo.';
  if (!/^(?:\+?56)?9\d{8}$/.test(phone)) return 'Escribe un WhatsApp chileno válido, por ejemplo +56 9 1234 5678.';
  if (this.checkoutMethod === 'despacho' && !this.checkoutAddress.trim()) return 'Escribe la dirección para revisar el despacho.';
  return '';
},
```

Render items, subtotal, delivery condition and total products inside the checkout dialog. Keep Presencial first.

- [ ] **Step 5: Run affected tests**

Run: `npx playwright test tests/ecommerce-commercial.spec.js tests/demos-6-to-8-exhaustive.spec.js`

Expected: PASS.

- [ ] **Step 6: Commit stock and checkout**

```bash
git add demo-ecommerce-tech/index.html tests/ecommerce-commercial.spec.js tests/demos-6-to-8-exhaustive.spec.js
git commit -m "feat: add stock-aware demo checkout"
```

---

### Task 3: Mobile admin proof and overlay accessibility

**Files:**
- Modify: `demo-ecommerce-tech/index.html`
- Modify: `tests/ecommerce-commercial.spec.js`

**Interfaces:**
- Consumes: `products`, `orders`, overlay booleans and existing admin actions.
- Produces: `.admin-mobile-list`, `openOverlay(name, trigger)`, `closeOverlay(name)`, `handleOverlayKeydown(event, name)` and focus restoration.

- [ ] **Step 1: Write failing mobile and keyboard tests**

```js
test.use({ viewport: { width: 390, height: 844 } });

test('Mobile admin exposes complete product actions without clipping', async ({ page }) => {
  await page.goto('/demo-ecommerce-tech/index.html');
  await page.getByRole('button', { name: 'Abrir panel demo' }).click();
  const dialog = page.getByRole('dialog', { name: 'Panel de control demostrativo' });
  await expect(dialog.locator('.admin-mobile-list')).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Editar Auriculares/i })).toBeVisible();
  await expect(dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).resolves.toBe(true);
});

test('Overlays contain focus, close with Escape and restore the trigger', async ({ page }) => {
  await page.goto('/demo-ecommerce-tech/index.html');
  const trigger = page.getByRole('button', { name: 'Abrir carrito demo' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Carro demostrativo' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
```

- [ ] **Step 2: Verify both tests fail**

Run: `npx playwright test tests/ecommerce-commercial.spec.js -g "Mobile admin|Overlays"`

Expected: FAIL because dialog roles, focus logic and mobile admin cards are absent.

- [ ] **Step 3: Implement semantic overlays and focus handling**

Add `role="dialog"`, `aria-modal="true"`, labelled titles, `tabindex="-1"`, Escape handling, focus loop, trigger storage and background inert state. Give close and action controls 44 px targets.

- [ ] **Step 4: Implement mobile admin cards**

Render product cards and order cards with visible image/name, category, price, stock/status and actions. Show existing tables from 769 px upward and cards through 768 px.

- [ ] **Step 5: Remove the duplicate floating showcase control**

Delete the bottom-left inline-styled link. Keep `../demo-nav.js` and the shared STAX top navigation unchanged.

- [ ] **Step 6: Run affected tests**

Run: `npx playwright test tests/ecommerce-commercial.spec.js tests/demos-6-to-8-exhaustive.spec.js tests/modal-regression.spec.js`

Expected: PASS.

- [ ] **Step 7: Commit accessibility and mobile admin**

```bash
git add demo-ecommerce-tech/index.html tests/ecommerce-commercial.spec.js
git commit -m "feat: adapt ecommerce admin for mobile"
```

---

### Task 4: Assets, motion and final verification

**Files:**
- Modify: `demo-ecommerce-tech/index.html`
- Modify: `tests/ecommerce-commercial.spec.js`

**Interfaces:**
- Consumes: existing local images and CSS transitions.
- Produces: stable image geometry and reduced-motion behavior.

- [ ] **Step 1: Add failing asset checks**

```js
test('Apex assets and motion remain production-ready', async ({ page }) => {
  await page.goto('/demo-ecommerce-tech/index.html');
  await expect(page.locator('main')).toHaveCount(1);
  for (const image of await page.locator('main img').all()) {
    await expect(image).toHaveAttribute('width', '1024');
    await expect(image).toHaveAttribute('height', '1024');
  }
  await expect(page.locator('style')).toContainText('prefers-reduced-motion');
});
```

- [ ] **Step 2: Verify the asset test fails**

Run: `npx playwright test tests/ecommerce-commercial.spec.js -g "assets and motion"`

Expected: FAIL because the page lacks `<main>`, dimensions and reduced-motion CSS.

- [ ] **Step 3: Add semantic main, dimensions and loading hints**

Wrap hero, catalog and scale sections in `<main>`. Preload the hero and use `fetchpriority="high"`; give product images `width="1024" height="1024" loading="lazy" decoding="async"`.

- [ ] **Step 4: Add reduced-motion behavior**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Run focused and repository gates**

Run:

```bash
npx playwright test tests/ecommerce-commercial.spec.js tests/demos-6-to-8-exhaustive.spec.js tests/modal-regression.spec.js
node /home/manager/.agents/skills/impeccable/scripts/detect.mjs --json demo-ecommerce-tech/index.html
npm run qa:gate
git diff --check
```

Expected: Playwright PASS, detector output reviewed once after final UI edits, gate PASS and clean diff check.

- [ ] **Step 6: Commit the final verified implementation**

```bash
git add demo-ecommerce-tech/index.html tests/ecommerce-commercial.spec.js
git commit -m "test: verify trustworthy ecommerce demo"
```
