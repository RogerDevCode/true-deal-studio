const { test, expect } = require("@playwright/test");
const { attachPageGuards, waitForAlpine } = require("./helpers");

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const cases = [
  {
    name: "psicologa",
    path: "/demo-psicologa/index.html",
    selector: "div.inline-block.overflow-hidden.text-left.align-bottom.bg-white.rounded-3xl",
  },
  {
    name: "fonoaudiologia",
    path: "/demo-fonoaudiologia/index.html",
    selector: "div.relative.bg-white.w-full.max-w-lg.rounded-3xl",
  },
  {
    name: "cafe",
    path: "/demo-cafe-valparaiso/index.html",
    selector: ".modal-card",
  },
  {
    name: "salon",
    path: "/demo-salon-belleza/index.html",
    selector: ".modal-card",
  },
  {
    name: "artesanias",
    path: "/demo-artesanias/index.html",
    selector: ".modal-card",
  },
  {
    name: "contabilidad",
    path: "/demo-contabilidad/index.html",
    selector: ".modal-card",
  },
  {
    name: "propiedades",
    path: "/demo-propiedades/index.html",
    selector: ".modal-card",
  },
  {
    name: "plan-premium",
    path: "/demo-plan-premium/index.html",
    selector: ".modal-content",
  },
  {
    name: "plan-profesional",
    path: "/demo-plan-profesional/index.html#catalogo",
    selector: ".modal-content",
  },
];

test("Core conversion modals remain usable across mobile and desktop", async ({ page }) => {
  const guards = await attachPageGuards(page);

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const modalCase of cases) {
      await page.goto(modalCase.path);
      await waitForAlpine(page);
      await page.evaluate((modalName) => {
        const root = document.querySelector("[x-data]");
        const state = root && root._x_dataStack && root._x_dataStack[0];
        if (!state) {
          throw new Error("No se encontro estado Alpine en la pagina.");
        }
        switch (modalName) {
          case "psicologa":
          case "fonoaudiologia":
          case "cafe":
          case "salon":
          case "contabilidad":
            state.bookingModal = true;
            break;
          case "artesanias":
            state.cart = [{ id: 1, name: "Fuente de Greda Pomaire", price: 18500, qty: 1 }];
            state.checkoutModal = true;
            state.cartDrawer = false;
            break;
          case "propiedades":
            state.selectedProperty = state.filteredProperties?.[0] || state.properties?.[0] || null;
            state.isBookingOpen = true;
            break;
          case "plan-premium":
            state.cart = [
              { id: 1, name: "Comedor Roble Escandinavo", price: 490000 },
              { id: 2, name: "Repisa Colgante Avellano", price: 89000 },
            ];
            state.isCheckoutOpen = true;
            state.isCartOpen = false;
            break;
          case "plan-profesional":
            state.cart = [
              { id: 1, name: "Remodelación de Cocina Estándar", price: 1500000 },
              { id: 2, name: "Renovación Completa Baño Principal", price: 990000 },
              { id: 3, name: "Pintura Interior Casa Completa", price: 450000 },
            ];
            state.isCheckoutOpen = true;
            state.isCartOpen = false;
            break;
          default:
            throw new Error(`Caso no soportado: ${modalName}`);
        }
      }, modalCase.name);

      const modal = page.locator(modalCase.selector).first();
      await expect(modal, `${modalCase.name} ${viewport.name}`).toBeVisible();

      const metrics = await modal.evaluate((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return {
          overflowY: style.overflowY,
          clientHeight: node.clientHeight,
          scrollHeight: node.scrollHeight,
          top: rect.top,
          bottom: rect.bottom,
          viewportHeight: innerHeight,
        };
      });

      expect(metrics.top, `${modalCase.name} ${viewport.name}`).toBeGreaterThanOrEqual(0);
      expect(metrics.bottom, `${modalCase.name} ${viewport.name}`).toBeLessThanOrEqual(metrics.viewportHeight);

      if (metrics.scrollHeight > metrics.clientHeight) {
        expect(["auto", "scroll"]).toContain(metrics.overflowY);
        await modal.evaluate((node) => {
          node.scrollTop = node.scrollHeight;
        });
      }
    }
  }

  await guards.assertHealthyContext();
});
