const { test, expect } = require('@playwright/test');
const { attachPageGuards, waitForAlpine } = require('./helpers');

test.describe('Voice-first hero', () => {
  test('makes a local proof and the voice demo the first conversion path', async ({ page }) => {
    const guards = await attachPageGuards(page);
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/index.html');
    await waitForAlpine(page);

    const hero = page.locator('#inicio');
    const proof = hero.getByTestId('stax-voice-proof');
    const voiceCta = hero.getByTestId('stax-voice-demo-cta');
    const rubroCta = hero.getByTestId('stax-rubro-cta');
    const video = proof.locator('video');

    await expect(proof).toBeVisible();
    await expect(voiceCta).toHaveText(/Hablar ahora con la demo/i);
    await expect(voiceCta).toHaveAttribute('href', 'https://voice.stax.ink/widget/stax');
    await expect(voiceCta).toHaveAttribute('target', '_blank');
    await expect(voiceCta).toHaveAttribute('rel', /noopener/);
    await expect(rubroCta).toHaveText(/Ver un ejemplo de mi rubro/i);
    await expect(rubroCta).toHaveAttribute('href', '#demos');
    await expect(video).toHaveAttribute('muted', '');
    await expect(video).not.toHaveAttribute('autoplay');
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).toHaveAttribute('poster', './assets/visuals/stax-voice-proof-poster.webp');
    await expect(video.locator('track[kind="captions"]')).toHaveAttribute('src', './assets/visuals/stax-voice-proof.vtt');
    await expect(proof.getByTestId('stax-video-fallback')).toContainText('Pregunta natural');
    await expect(video.locator('source')).toHaveCount(2);
    await expect(video.locator('source').evaluateAll((sources) => sources.every((source) => source.src.startsWith('file:') || source.getAttribute('src')?.startsWith('./')))).resolves.toBe(true);
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    await guards.assertHealthyContext();
  });
});
