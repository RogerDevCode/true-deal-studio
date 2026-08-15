import { test, expect } from '@playwright/test';

test.describe("Adversarial UX/Technical Audit - Devil's Advocate", () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://tuvitrina.lat');
  });

  test('Usability under stress: fast navigation and scroll-margin-top breaking', async ({ page }) => {
    // Navigate fast to anchors to break smooth scroll paints
    await page.click('a[href="#contacto"]');
    await page.waitForTimeout(50); // fast interrupt
    await page.click('a[href="#precios"]');
    await page.waitForTimeout(500); // let it settle
    
    const header = page.locator('header').first();
    const section = page.locator('#precios');
    
    const headerBox = await header.boundingBox();
    const sectionBox = await section.boundingBox();
    
    // The section top should respect the header offset. 
    // If broken, the section slides under the header.
    if (headerBox && sectionBox) {
      expect(sectionBox.y).toBeGreaterThanOrEqual(headerBox.height - 10);
    }
  });

  test('Simultaneous interactions: WhatsApp floating widget vs Modal z-index overlap', async ({ page }) => {
    const contactBtn = page.locator('a[href="#contacto"]').first();
    const wpButton = page.locator('a[href*="wa.me"]').first();
    
    // Simulate user panic clicking both interactions at once
    await Promise.all([
      contactBtn.click(),
      wpButton.focus().then(() => wpButton.click())
    ]);
    
    // Check for multiple layers of overlays/modals blocking the screen.
    // Exclude Tailwind's backdrop-blur utility classes which are just glassmorphism effects, not overlays.
    const overlays = await page.locator('[role="dialog"], [class*="modal"], [class*="overlay"]:not([class*="overflow"])').count();
    expect(overlays).toBeLessThan(3); 
  });

  test('Extreme inputs: breaking Alpine.js layout with kilometer-long strings', async ({ page }) => {
    // Navigate to form
    await page.click('a[href="#contacto"]');
    
    const hugeString = 'A'.repeat(50000);
    const injectString = '<script>alert(1)</script><div x-data="{ open: true }" x-init="alert(\'alpine break\')">test</div>';
    
    const inputs = page.locator('input[type="text"]');
    if (await inputs.count() > 0) {
      const firstInput = inputs.first();
      await firstInput.fill(hugeString);
      
      const secondInput = inputs.nth(1);
      if (secondInput) {
        await secondInput.fill(injectString);
      }
      
      const boundingBox = await firstInput.boundingBox();
      const viewportSize = page.viewportSize();
      
      // The input element must NOT stretch the mobile viewport horizontally
      expect(boundingBox.width).toBeLessThanOrEqual(viewportSize.width);
    }
  });
});
