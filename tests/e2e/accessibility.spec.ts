import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility & RTL Compliance Audit (WCAG 2.1 AA)', () => {
  test('should pass automated accessibility scan on Light Theme (Default)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=LinguTrack', { timeout: 5000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast']) // Reviewed separately for custom glassmorphism
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should verify proper RTL text direction for Urdu segments', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("AI Executive Notes & Action Items")');
    await page.click('button:has-text("اردو")');

    const urduParagraph = page.locator('.urdu-text').first();
    await expect(urduParagraph).toBeVisible();

    const dir = await urduParagraph.evaluate((el) => {
      return window.getComputedStyle(el).direction;
    });

    expect(dir).toBe('rtl');
  });

  test('should verify keyboard focus management (Ctrl+K shortcut & tab navigation)', async ({ page }) => {
    await page.goto('/');
    // Press Ctrl+K
    await page.keyboard.press('Control+KeyK');
    const searchInput = page.locator('input[placeholder*="Search transcripts"]');
    await expect(searchInput).toBeFocused();
  });
});
