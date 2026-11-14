import { expect, test } from '@playwright/test';

test.describe('pointer effect', () => {
  test('follows the mouse on a fine pointer, grows while pressed', async ({ page, isMobile }) => {
    test.skip(isMobile, 'touch-only devices have no pointer effect');
    await page.goto('/');
    const fx = page.getByTestId('pointer-fx');
    await expect(fx).toHaveAttribute('data-ready', '');
    await page.mouse.move(300, 300);
    await page.mouse.move(420, 360, { steps: 6 });
    await expect(fx).toHaveAttribute('data-active', '');
    const dot = fx.locator('.pointer-dot');
    await expect.poll(async () => (await dot.boundingBox())?.x ?? 0).toBeGreaterThan(380);
    const before = (await dot.boundingBox())!.width;
    await page.mouse.down();
    await expect.poll(async () => (await dot.boundingBox())!.width).toBeGreaterThan(before + 10);
    await page.mouse.up();
  });

  test('adapts pointer color between light and dark themes', async ({ page, isMobile }) => {
    test.skip(isMobile, 'touch-only devices have no pointer effect');
    await page.goto('/');
    const dot = page.getByTestId('pointer-fx').locator('.pointer-dot');
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    const lightBg = await dot.evaluate((el) => getComputedStyle(el).backgroundColor);
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    const darkBg = await dot.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(lightBg).not.toBe('rgb(255, 255, 255)');
    expect(darkBg).toBe('rgb(255, 255, 255)');
  });

  test('is off under reduced motion', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.mouse.move(200, 200);
    await page.mouse.move(300, 300, { steps: 4 });
    await expect(page.getByTestId('pointer-fx')).not.toHaveAttribute('data-ready', '');
    await expect(page.getByTestId('pointer-fx')).toBeHidden();
    await ctx.close();
  });

  test('is off on touch-only devices', async ({ browser }) => {
    const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.getByTestId('pointer-fx')).not.toHaveAttribute('data-ready', '');
    await expect(page.getByTestId('pointer-fx')).toBeHidden();
    await ctx.close();
  });
});
