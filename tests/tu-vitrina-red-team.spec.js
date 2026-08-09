const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Tu Vitrina public rebrand red team', () => {
  test('does not leak the retired brand or domain into visitor-facing landing content', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await page.goto('/index.html');
    await waitForAlpine(page);

    await expect(page.getByRole('link', { name: 'Inicio' })).toContainText('Tu Vitrina');
    await expect(page.locator('body')).not.toContainText(/\bSTAX\b/i);

    const voiceLinks = page.locator('a[href*="voice."]');
    await expect(voiceLinks).toHaveCount(2);
    await expect(voiceLinks.evaluateAll((links) => links.every((link) => link.href.startsWith('https://voice.tuvitrina.lat/')))).resolves.toBe(true);
    await guards.assertHealthyContext();
  });

  test('keeps the audio proof deliberate and the transcript out of the visual path', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/index.html');
    await waitForAlpine(page);

    const proof = page.getByTestId('tu-vitrina-voice-proof');
    const audio = proof.locator('audio');
    await expect(audio).not.toHaveAttribute('autoplay');
    await expect(proof.getByTestId('tu-vitrina-voice-transcript')).toBeVisible();
    await expect(proof.getByTestId('tu-vitrina-voice-transcript').locator('p')).toBeHidden();
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await guards.assertHealthyContext();
  });

  test('uses one useful local visual in each demo that previously began as text-only', async ({ page }) => {
    const demos = [
      ['/demo-agenda/index.html', 'Espacio de trabajo ordenado para gestionar solicitudes'],
      ['/demo-plan-profesional/index.html', 'Espacio de trabajo para proyectos de remodelación'],
      ['/demo-propiedades/index.html', 'Vista arquitectónica de una propiedad residencial'],
    ];

    await page.setViewportSize({ width: 320, height: 720 });
    for (const [path, alt] of demos) {
      await page.goto(path);
      const visual = page.locator('figure.tu-vitrina-context-visual');
      const image = visual.locator('img');
      await expect(visual).toHaveCount(1);
      await expect(image).toHaveAttribute('src', /\.\.\/assets\/optimized\/.+\.webp$/);
      await expect(image).toHaveAttribute('alt', alt);
      await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    }
  });
});
