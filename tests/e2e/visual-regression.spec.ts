import { test, expect } from '@playwright/test';

test.describe('Visual Regression & Theme Consistency Suite', () => {
  test('Light Theme (Default White) Visual Layout Snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForSelector('text=LinguTrack', { timeout: 5000 });

    const htmlClass = await page.getAttribute('html', 'class');
    expect(htmlClass).toContain('theme-light');

    await page.screenshot({ path: './tests/visual-snapshots/theme_light_desktop.png' });
  });

  test('Dark Slate Theme Visual Layout Snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.click('button:has-text("White / Light")');
    await page.click('button:has-text("Dark Slate")');
    await page.waitForTimeout(300);

    const htmlClass = await page.getAttribute('html', 'class');
    expect(htmlClass).toContain('theme-dark');

    await page.screenshot({ path: './tests/visual-snapshots/theme_dark_desktop.png' });
  });

  test('Urdu Emerald Theme Visual Layout Snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.click('button:has-text("White / Light")');
    await page.click('button:has-text("Urdu Emerald")');
    await page.waitForTimeout(300);

    const htmlClass = await page.getAttribute('html', 'class');
    expect(htmlClass).toContain('theme-emerald');

    await page.screenshot({ path: './tests/visual-snapshots/theme_emerald_desktop.png' });
  });

  test('Mobile Viewport (375x667) Responsive Drawer Snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('text=LinguTrack', { timeout: 5000 });

    // Open mobile menu drawer
    await page.click('button:has(svg.lucide-menu)');
    await page.waitForSelector('text=Core Modules', { timeout: 3000 });

    await page.screenshot({ path: './tests/visual-snapshots/mobile_drawer_open.png' });
  });
});
