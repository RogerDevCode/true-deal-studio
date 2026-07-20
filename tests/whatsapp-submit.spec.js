const { test, expect } = require("@playwright/test");
const { attachPageGuards, waitForAlpine } = require("./helpers");

async function installWindowOpenProbe(page) {
  await page.addInitScript(() => {
    window.__lastOpenedUrl = null;
    const originalOpen = window.open.bind(window);
    window.open = (url, ...args) => {
      window.__lastOpenedUrl = String(url);
      return {
        focus() {},
        close() {},
      };
    };
    window.__restoreOpen = () => {
      window.open = originalOpen;
    };
  });
}

async function expectWhatsAppOpen(page, expectedParts) {
  const opened = await page.evaluate(() => window.__lastOpenedUrl);
  expect(opened).toContain("https://wa.me/");
  for (const part of expectedParts) {
    expect(decodeURIComponent(opened)).toContain(part);
  }
}

test("Core booking forms submit to WhatsApp", async ({ browser }) => {
  const cases = [
    {
      path: "/demo-psicologa/index.html",
      open: () => document.body._x_dataStack[0].bookingModal = true,
      fill: async (page) => {
        await page.locator("#name").fill("Paciente QA");
        await page.locator("#phone").fill("+56933334444");
        await page.locator("#email").fill("qa@example.com");
        await page.locator("#motivo").fill("Consulta inicial");
      },
      submitName: /Solicitar hora|Enviar solicitud/i,
      expectedParts: ["Paciente QA", "Consulta inicial"],
    },
    {
      path: "/demo-cafe-valparaiso/index.html",
      open: () => document.body._x_dataStack[0].openBooking(),
      fill: async (page) => {
        await page.locator('input[x-model="formName"]').fill("Reserva QA");
        await page.locator('input[x-model="formPhone"]').fill("+56944445555");
        await page.locator('input[x-model="formEmail"]').fill("cafe@example.com");
        await page.locator('input[x-model="formDate"]').fill("2026-07-30");
        await page.locator('input[x-model="formTime"]').fill("13:30");
        await page.locator('textarea[x-model="formComment"]').fill("Mesa para dos");
      },
      submitName: /Enviar Solicitud/i,
      expectedParts: ["Reserva QA", "Mesa para dos"],
    },
    {
      path: "/demo-salon-belleza/index.html",
      open: () => document.body._x_dataStack[0].openBooking(),
      fill: async (page) => {
        await page.locator('input[x-model="formName"]').fill("Clienta QA");
        await page.locator('input[x-model="formPhone"]').fill("+56955556666");
        await page.locator('input[x-model="formEmail"]').fill("salon@example.com");
        await page.locator('input[x-model="formDate"]').fill("2026-07-30");
        await page.locator('input[x-model="formTime"]').fill("16:00");
        await page.locator('textarea[x-model="formComment"]').fill("Coloracion");
      },
      submitName: /Enviar Solicitud/i,
      expectedParts: ["Clienta QA", "Coloracion"],
    },
    {
      path: "/demo-contabilidad/index.html",
      open: () => document.body._x_dataStack[0].openBooking(),
      fill: async (page) => {
        await page.locator('input[x-model="formName"]').fill("Empresa QA");
        await page.locator('input[x-model="formPhone"]').fill("+56977778888");
        await page.locator('input[x-model="formEmail"]').fill("empresa@example.com");
        await page.locator('input[x-model="formDate"]').fill("2026-07-30");
        await page.locator('input[x-model="formTime"]').fill("09:30");
        await page.locator('textarea[x-model="formComment"]').fill("Diagnostico tributario");
      },
      submitName: /Agendar Reunión/i,
      expectedParts: ["Empresa QA", "Diagnostico tributario"],
    },
    {
      path: "/demo-propiedades/index.html",
      open: () => {
        const state = document.querySelector("[x-data]")._x_dataStack[0];
        state.openBooking(state.filteredProperties?.[0] || state.properties[0]);
      },
      fill: async (page) => {
        await page.locator("#booking-name").fill("Comprador QA");
        await page.locator("#booking-phone").fill("+56988889999");
        await page.locator("#booking-date").fill("2026-08-01");
      },
      submitName: /Confirmar Visita/i,
      expectedParts: ["Comprador QA", "Departamento Dúplex en Providencia"],
    },
  ];

  for (const current of cases) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await installWindowOpenProbe(page);
    const guards = await attachPageGuards(page);

    await page.goto(current.path);
    await waitForAlpine(page);
    await page.evaluate(current.open);
    await current.fill(page);
    await page.getByRole("button", { name: current.submitName }).click();
    await expectWhatsAppOpen(page, current.expectedParts);
    await guards.assertHealthyContext();
    await context.close();
  }
});

test("Landing contact form names Plan Vitrina Express in WhatsApp", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await installWindowOpenProbe(page);
  const guards = await attachPageGuards(page);

  await page.goto("/index.html");
  await waitForAlpine(page);
  await page.locator("#form-nombre").fill("PYME QA");
  await page.locator("#form-negocio").fill("Taller QA");
  await page.locator("#form-telefono").fill("+56911112222");
  await page.locator("#form-mensaje").fill("Valores y horarios");
  await page.locator("#contacto form").getByRole("button", { name: "Quiero mi vitrina en 3 días" }).click();

  await expectWhatsAppOpen(page, ["PYME QA", "Plan Vitrina Express", "Valores y horarios"]);
  await guards.assertHealthyContext();
  await context.close();
});
