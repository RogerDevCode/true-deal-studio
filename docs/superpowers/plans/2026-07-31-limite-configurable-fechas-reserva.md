# Configurable Booking Date Limits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep every booking date within a configurable 90-day window and make booking tests independent of calendar dates.

**Architecture:** Add one local, dependency-free date-range helper under `assets/js/` and load it before each booking demo app. Café, salón, contabilidad and propiedades use the helper for their date input and submit guard; psicología keeps its three generated appointment slots within its declared horizon. Playwright derives a valid date from the browser clock instead of hard-coding a calendar day.

**Tech Stack:** Static HTML, local JavaScript, Alpine.js, Playwright.

## Global Constraints

- Preserve `file://` compatibility and use only local assets.
- `bookingLeadDays` defaults to exactly `90` and is declared by each demo that accepts a booking.
- A date before today or after the configured maximum must not prepare a WhatsApp message.
- Preserve Presencial as the default modality and all existing reset, accessibility and WhatsApp fallback behavior.
- Do not change domains, APIs, VoiceLive, chatbot, secrets or infrastructure.
- Do not stage the existing `Dockerfile` or `compose.local.yaml` changes.

---

### Task 1: Add the reusable local booking-date range contract

**Files:**
- Create: `assets/js/booking-date-range.js`
- Modify: `demo-cafe-valparaiso/index.html`, `demo-salon-belleza/index.html`, `demo-contabilidad/index.html`, `demo-propiedades/index.html`, `demo-psicologa/index.html`

**Interfaces:**
- Produces `window.STAXBookingDateRange.create(leadDays)` with `{ minDate, maxDate, includes(value) }`.
- `leadDays` is a non-negative integer and defaults to `90`.

- [ ] **Step 1: Write a failing browser assertion**

Add to `tests/forms.spec.js` a test that opens café, salón, contabilidad and propiedades and asserts each booking input exposes a minimum date, maximum date and an exact 90-day interval. Use this helper in the test:

```js
async function bookingDateRange(page, selector) {
  return page.locator(selector).evaluate((input) => ({
    min: input.min,
    max: input.max,
  }));
}
```

- [ ] **Step 2: Verify the test fails**

Run:

```bash
node scripts/run_clean_env.js npx playwright test tests/forms.spec.js --reporter=line
```

Expected: FAIL because café, contabilidad and propiedades do not expose date bounds.

- [ ] **Step 3: Create the local helper**

Create `assets/js/booking-date-range.js`:

```js
window.STAXBookingDateRange = (() => {
  function toLocalIsoDate(date) {
    const local = new Date(date);
    local.setHours(12, 0, 0, 0);
    return local.toISOString().slice(0, 10);
  }

  function create(leadDays = 90) {
    const normalizedLeadDays = Number.isInteger(leadDays) && leadDays >= 0 ? leadDays : 90;
    const today = new Date();
    const minDate = toLocalIsoDate(today);
    const maximum = new Date(today);
    maximum.setDate(maximum.getDate() + normalizedLeadDays);
    const maxDate = toLocalIsoDate(maximum);

    return {
      minDate,
      maxDate,
      includes(value) {
        return Boolean(value) && value >= minDate && value <= maxDate;
      },
    };
  }

  return { create };
})();
```

Load it before each corresponding local `app.js`, using the demo-relative path `../assets/js/booking-date-range.js` only where that exact relative location resolves from the demo folder.

- [ ] **Step 4: Run the range assertion**

Run the command from Step 2.

Expected: PASS after the input bindings in Task 2 are complete.

- [ ] **Step 5: Commit the reusable contract**

```bash
git add assets/js/booking-date-range.js demo-*/index.html tests/forms.spec.js
git commit -m "feat: add local configurable booking date range"
```

### Task 2: Enforce each demo's 90-day horizon before WhatsApp

**Files:**
- Modify: `demo-cafe-valparaiso/app.js`, `demo-cafe-valparaiso/index.html`
- Modify: `demo-salon-belleza/app.js`, `demo-salon-belleza/index.html`
- Modify: `demo-contabilidad/app.js`, `demo-contabilidad/index.html`
- Modify: `demo-propiedades/app.js`, `demo-propiedades/index.html`
- Modify: `demo-psicologa/app.js`

**Interfaces:**
- Each application exposes `bookingLeadDays: 90`, `minDate`, `maxDate`, and `isBookingDateAllowed(value)` from `STAXBookingDateRange.create(this.bookingLeadDays)`.
- Café, salón and contabilidad bind `:min="minDate"` and `:max="maxDate"` to `formDate` inputs.
- Propiedades stores booking modal fields in `corredoraApp`, so the parent application can validate and bind the same range.

- [ ] **Step 1: Write failing submit-guard coverage**

Add one salon test that sets the selected date to the day after `max`, clicks `Preparar solicitud por WhatsApp`, and asserts the popup probe stays empty and the dialog explains that the maximum is 90 days. Repeat the same public behavior through the common booking flow for café, contabilidad and propiedades.

```js
const outsideRange = await page.evaluate(() => {
  const date = new Date(document.querySelector('#salon-date').max + 'T12:00:00');
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
});
```

- [ ] **Step 2: Verify it fails**

Run:

```bash
node scripts/run_clean_env.js npx playwright test tests/salon-commercial.spec.js tests/whatsapp-submit.spec.js --reporter=line
```

Expected: FAIL because dates after the configured horizon are accepted.

- [ ] **Step 3: Add the common state and guards**

Use this pattern in café, salón and contabilidad:

```js
bookingLeadDays: 90,
dateRange: window.STAXBookingDateRange.create(90),
get minDate() { return this.dateRange.minDate; },
get maxDate() { return this.dateRange.maxDate; },
isBookingDateAllowed(value) { return this.dateRange.includes(value); },
```

Before `saveBooking()` in each submit method, add:

```js
if (!this.isBookingDateAllowed(this.formDate)) {
  this.formError = `Elige una fecha entre hoy y los próximos ${this.bookingLeadDays} días.`;
  document.querySelector('input[x-model="formDate"]')?.focus();
  return;
}
```

For café and contabilidad, render `formError` with `role="alert"` inside their booking modal. For salón, reuse its existing `formError` region. Bind the date fields with:

```html
<input type="date" x-model="formDate" :min="minDate" :max="maxDate" required class="form-input">
```

Move the five booking fields from the nested property modal `x-data` object into `corredoraApp`; set `bookingLeadDays: 90`, create the same `dateRange`, bind `bookingDate` to `:min="minDate" :max="maxDate"`, and make `sendBookingToWhatsApp()` reject an out-of-range date before `saveBooking()`.

For psicología, set `bookingLeadDays: 90` and generate its fixed slot offsets through `filter((offset) => offset <= this.bookingLeadDays)`. Its interface presents only four generated slots, so it cannot submit an arbitrary date outside the configured horizon.

- [ ] **Step 4: Run focused coverage**

Run the command from Step 2.

Expected: PASS; valid dates open WhatsApp and dates after `maxDate` are rejected without opening it.

- [ ] **Step 5: Commit submit protections**

```bash
git add demo-cafe-valparaiso demo-salon-belleza demo-contabilidad demo-propiedades demo-psicologa tests/salon-commercial.spec.js tests/whatsapp-submit.spec.js
git commit -m "feat: limit booking dates by configurable horizon"
```

### Task 3: Make booking fixtures calendar-safe and run the regression gate

**Files:**
- Modify: `tests/helpers.js`
- Modify: `tests/forms.spec.js`, `tests/salon-commercial.spec.js`, `tests/whatsapp-submit.spec.js`

**Interfaces:**
- `futureBookingDate(page, days = 7)` returns a browser-local ISO date inside the 90-day horizon.

- [ ] **Step 1: Add the dynamic fixture helper**

Add to `tests/helpers.js` and export it:

```js
async function futureBookingDate(page, days = 7) {
  return page.evaluate((offset) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  }, days);
}
```

- [ ] **Step 2: Replace fixed booking dates**

In each affected test, obtain `const bookingDate = await futureBookingDate(page);` after navigation and replace all fixed `2026-...` values used for date inputs with `bookingDate`. Keep only assertions that intentionally inspect a literal date string, updating them to the dynamic variable.

- [ ] **Step 3: Run all affected tests**

Run:

```bash
node scripts/run_clean_env.js npx playwright test tests/forms.spec.js tests/salon-commercial.spec.js tests/whatsapp-submit.spec.js --reporter=line
npm run qa:gate
```

Expected: all affected tests pass and the gate ends in `PASS`.

- [ ] **Step 4: Commit the stable fixtures**

```bash
git add tests/helpers.js tests/forms.spec.js tests/salon-commercial.spec.js tests/whatsapp-submit.spec.js
git commit -m "test: derive booking dates from local time"
```
