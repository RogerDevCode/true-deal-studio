import { test, expect } from "@playwright/test";

test("VoiceLive Frontend Lead and Handoff Real E2E Test", async ({ page }) => {
  console.log("1. Navegando al widget de VoiceLive...");
  await page.goto("http://127.0.0.1:5173/widget/tuvitrina");

  console.log("2. Iniciando sesión desde el Hero CTA...");
  const heroBtn = page.locator(".hero-voice-start-btn");
  await expect(heroBtn).toBeVisible({ timeout: 10000 });
  await heroBtn.click();

  console.log("3. Esperando la sección de contacto...");
  const contactTools = page.locator(".contact-tools");
  await expect(contactTools).toBeVisible({ timeout: 15000 });

  // 4. Test Lead Form
  console.log("4. Abriendo y llenando formulario 'Dejar datos de contacto'...");
  const leadSummary = page.locator("details summary", { hasText: "Dejar datos de contacto" });
  await leadSummary.click();

  const timeId = Date.now().toString().slice(-5);
  const testName = `Juan Carlos Test ${timeId}`;
  const testEmail = `juancarlos_${timeId}@ejemplo.cl`;
  const testPhone = `+569911${timeId}`;
  const testInterest = `Prueba real de cotización Plan Profesional (${timeId})`;

  const leadDetails = page.locator("details", { hasText: "Dejar datos de contacto" });
  await leadDetails.locator("input").nth(0).fill(testName);
  await leadDetails.locator("input[type='email']").fill(testEmail);
  await leadDetails.locator("input").nth(2).fill(testPhone);
  await leadDetails.locator("textarea").fill(testInterest);
  await leadDetails.locator("input[type='checkbox']").check();

  console.log("5. Enviando datos de contacto...");
  const leadBtn = leadDetails.locator("button[type='submit']");
  await leadBtn.click();

  const notice = page.locator(".form-success");
  await expect(notice).toBeVisible({ timeout: 10000 });
  await expect(notice).toContainText("Solicitud de contacto registrada");
  const leadNoticeText = await notice.textContent();
  console.log("✔ CONFIRMACIÓN FRONTEND (LEAD):", leadNoticeText);

  // 5. Test Human Handoff Form
  console.log("6. Abriendo y llenando formulario 'Solicitar atención de una persona'...");
  const handoffSummaryLabel = page.locator("details summary", { hasText: "Solicitar atención de una persona" });
  await handoffSummaryLabel.click();

  const handoffDetails = page.locator("details", { hasText: "Solicitar atención de una persona" });
  const handoffMsg = `Requiero soporte humano directo para integraciones (${timeId})`;
  await handoffDetails.locator("textarea").fill(handoffMsg);
  await handoffDetails.locator("select").selectOption("high");
  await handoffDetails.locator("input[type='checkbox']").check();

  console.log("7. Enviando solicitud de atención humana...");
  const handoffBtn = handoffDetails.locator("button[type='submit']");
  await handoffBtn.click();

  await expect(notice).toBeVisible({ timeout: 10000 });
  await expect(notice).toContainText("Solicitud de atención humana registrada");
  const handoffNoticeText = await notice.textContent();
  console.log("✔ CONFIRMACIÓN FRONTEND (HANDOFF):", handoffNoticeText);
});
