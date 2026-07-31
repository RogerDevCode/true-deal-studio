const { test, expect } = require('@playwright/test');
const { attachPageGuards } = require('./helpers');

test.describe('CRM Express integration cards', () => {
  test('shows VoiceLive and Telegram workflow entry points', async ({ page }) => {
    const guards = await attachPageGuards(page);

    await page.goto('/demo-agenda/index.html');

    const section = page.getByTestId('integrations-section');
    const voiceCard = page.getByTestId('voicelive-card');
    const telegramCard = page.getByTestId('telegram-card');

    await expect(section).toBeVisible();
    await expect(section).toContainText('Tu web puede orientar. Tú puedes decidir.');
    await expect(voiceCard).toContainText('VoiceLive');
    await expect(voiceCard).toContainText('Responde preguntas frecuentes por voz');
    await expect(telegramCard).toContainText('Tu bandeja de atención en Telegram');
    await expect(telegramCard).toContainText('Recibe cada consulta resumida');

    const voiceLink = voiceCard.getByRole('link', { name: 'Probar VoiceLive' });
    await expect(voiceLink).toHaveAttribute('href', 'https://voice.stax.ink/widget/stax');
    await expect(voiceLink).toHaveAttribute('target', '_blank');
    await expect(voiceLink).toHaveAttribute('rel', /noopener/);

    await telegramCard.getByRole('button', { name: 'Ver el flujo del dueño' }).click();

    const preview = page.getByTestId('telegram-preview-dialog');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('Demostración conceptual');
    await expect(preview).toContainText('Consulta web o voz');
    await expect(preview).toContainText('Resumen para el dueño en Telegram');
    await expect(preview).toContainText('Responder');
    await expect(preview).toContainText('Agendar');
    await expect(preview).toContainText('Pedir más datos');

    await page.keyboard.press('Escape');
    await expect(preview).toBeHidden();

    await telegramCard.getByRole('button', { name: 'Ver el flujo del dueño' }).click();
    await page.getByTestId('telegram-preview-close').click();
    await expect(preview).toBeHidden();

    await telegramCard.getByRole('button', { name: 'Ver el flujo del dueño' }).click();
    await preview.click({ position: { x: 5, y: 5 } });
    await expect(preview).toBeHidden();

    await guards.assertHealthyContext();
  });
});
