const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Tu Vitrina voice proof', () => {
  test('makes an audible local response and the live demo the first conversion path', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/index.html');
    await waitForAlpine(page);

    const hero = page.locator('#inicio');
    const proof = hero.getByTestId('tu-vitrina-voice-proof');
    const voiceCta = hero.getByTestId('stax-voice-demo-cta');
    const rubroCta = hero.getByTestId('stax-rubro-cta');
    const audio = proof.locator('audio');

    await expect(proof).toBeVisible();
    await expect(voiceCta).toHaveText(/Hablar ahora con la demo/i);
    await expect(voiceCta).toHaveAttribute('href', 'https://voice.tuvitrina.lat/widget/tuvitrina');
    await expect(voiceCta).toHaveAttribute('target', '_blank');
    await expect(voiceCta).toHaveAttribute('rel', /noopener/);
    await expect(rubroCta).toHaveText(/Ver un ejemplo de mi rubro/i);
    await expect(rubroCta).toHaveAttribute('href', '#demos');
    await expect(proof.getByRole('heading', { name: 'Escucha cómo responde Tu Vitrina Voz.' })).toBeVisible();
    await expect(proof.getByText('¿Puedo preguntar con mis propias palabras?', { exact: true })).toBeVisible();
    await expect(audio).toHaveAttribute('controls', '');
    await expect(audio).not.toHaveAttribute('autoplay');
    await expect(audio).toHaveAttribute('preload', 'metadata');
    await expect(audio.locator('source')).toHaveCount(2);
    await expect(audio.locator('source').evaluateAll((sources) => sources.every((source) => source.src.startsWith('file:') || source.getAttribute('src')?.startsWith('./')))).resolves.toBe(true);
  await expect(proof.getByTestId('tu-vitrina-voice-transcript')).toBeVisible();
  await expect(proof.getByTestId('tu-vitrina-voice-transcript').locator('p')).toBeHidden();
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await guards.assertHealthyContext();
  });
});
