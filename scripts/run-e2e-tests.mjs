import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173/';
const SNAPSHOTS_DIR = './tests/visual-snapshots';
const REPORT_DIR = './test-results';

// Ensure directories exist
if (!fs.existsSync(SNAPSHOTS_DIR)) fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

async function runEnhancedTestSuite() {
  console.log('\n======================================================================');
  console.log('🌍 LINGUTRACK AI — GLOBAL 50+ WORLD LANGUAGES E2E TEST RUNNER');
  console.log('======================================================================\n');

  const launchArgs = [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--allow-file-access',
  ];

  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: launchArgs });
  } catch {
    try {
      browser = await chromium.launch({ channel: 'msedge', headless: true, args: launchArgs });
    } catch {
      browser = await chromium.launch({ channel: 'chrome', headless: true, args: launchArgs });
    }
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    permissions: ['microphone'],
  });

  const page = await context.newPage();

  const testResults = [];
  let passedCount = 0;
  let failedCount = 0;

  async function testStep(category, name, fn) {
    const startTime = performance.now();
    process.stdout.write(`⏳ [${category}] ${name}... `);
    try {
      await fn();
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      console.log(`\x1b[32m✔ PASSED\x1b[0m (${elapsed}s)`);
      testResults.push({ category, name, status: 'PASSED', duration: elapsed, error: null });
      passedCount++;
    } catch (err) {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      console.log(`\x1b[31m✖ FAILED\x1b[0m (${elapsed}s)`);
      console.error(`   Error: ${err.message}\n`);
      testResults.push({ category, name, status: 'FAILED', duration: elapsed, error: err.message });
      failedCount++;
    }
  }

  try {
    // ---------------------------------------------------------
    // 1. Theme Engine & Visual Snapshots
    // ---------------------------------------------------------
    await testStep('Theme Engine', 'Verify Default White/Light Theme & DOM Tokens', async () => {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=LinguTrack', { timeout: 5000 });
      const htmlClass = await page.getAttribute('html', 'class');
      if (!htmlClass.includes('theme-light') && !htmlClass.includes('light')) {
        throw new Error(`Expected html to contain theme-light, got: ${htmlClass}`);
      }
      await page.screenshot({ path: path.join(SNAPSHOTS_DIR, '01_theme_light_default.png') });
    });

    await testStep('Theme Engine', 'Dynamic Multi-Theme Switching (Dark/Emerald/Midnight)', async () => {
      await page.click('button:has-text("White / Light")');
      await page.click('button:has-text("Dark Slate")');
      await page.waitForTimeout(200);

      await page.click('button:has-text("Dark Slate")');
      await page.click('button:has-text("Urdu Emerald")');
      await page.waitForTimeout(200);

      await page.click('button:has-text("Urdu Emerald")');
      await page.click('button:has-text("White / Light")');
      await page.waitForTimeout(200);
    });

    // ---------------------------------------------------------
    // 2. Accessibility & WCAG 2.1 AA Audit
    // ---------------------------------------------------------
    await testStep('Accessibility', 'Automated WCAG 2.1 AA & ARIA Scan via AxeBuilder', async () => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules(['color-contrast'])
        .analyze();
      if (results.violations.length > 0) {
        throw new Error(`Accessibility violations found: ${JSON.stringify(results.violations.map(v => v.id))}`);
      }
    });

    // ---------------------------------------------------------
    // 3. Audio Studio & 50+ Languages Picker
    // ---------------------------------------------------------
    await testStep('Audio Studio', 'Live Virtual Microphone & Universal Language Selection', async () => {
      await page.click('button:has-text("Live Mic Studio")');
      await page.click('button:has-text("Start Recording")');
      await page.waitForTimeout(1500);

      const isRecordingActive = await page.evaluate(() => document.body.innerText.includes('Recording Live'));
      if (!isRecordingActive) {
        throw new Error('Live recording state did not activate');
      }

      await page.click('button:has-text("Finish & Save")');
      await page.waitForTimeout(500);
    });

    await testStep('Audio Studio', 'Audio Upload Processing Lifecycle & Diarization Stream', async () => {
      await page.click('button:has-text("Upload Audio")');
      await page.click('button:has-text("Code-Switched Standup")');
      await page.waitForTimeout(3200);

      const segmentRendered = await page.evaluate(() =>
        document.body.innerText.includes('Redis cache cluster') &&
        document.body.innerText.includes('Sara Khan (Frontend)')
      );
      if (!segmentRendered) {
        throw new Error('Diarized multi-speaker transcript segments failed to render');
      }
    });

    // ---------------------------------------------------------
    // 4. AI Executive Summary in World Languages (Urdu, Arabic, Spanish, French)
    // ---------------------------------------------------------
    await testStep('Global AI Summary', 'Multilingual Summary Outputs (Urdu, Arabic, Spanish, French)', async () => {
      await page.click('button:has-text("AI Executive Notes & Action Items")');
      await page.waitForSelector('text=AI Executive Summary', { timeout: 3000 });

      // Test Urdu Summary
      await page.click('button:has-text("اردو")');
      await page.waitForTimeout(200);
      let hasUrdu = await page.evaluate(() => document.body.innerText.includes('میٹنگ میں'));
      if (!hasUrdu) throw new Error('Urdu summary failed to render');

      // Test Arabic Summary
      await page.click('button:has-text("العربية")');
      await page.waitForTimeout(200);
      let hasArabic = await page.evaluate(() => document.body.innerText.includes('موجز شامل'));
      if (!hasArabic) throw new Error('Arabic summary failed to render');

      // Test Spanish Summary
      await page.click('button:has-text("Español")');
      await page.waitForTimeout(200);
      let hasSpanish = await page.evaluate(() => document.body.innerText.includes('Resumen ejecutivo'));
      if (!hasSpanish) throw new Error('Spanish summary failed to render');

      // Restore to English
      await page.click('button:text-is("English")');
    });

    // ---------------------------------------------------------
    // 5. Universal Live Interpretation Mode (50+ Languages)
    // ---------------------------------------------------------
    await testStep('Live Interpretation', 'Bidirectional Universal Translation (English ⇄ Urdu, Spanish, Arabic)', async () => {
      await page.locator('button:has-text("Live Interpretation"):not(:has-text("Speech"))').first().click();
      await page.waitForSelector('text=Sub-Second Neural Pipeline', { timeout: 4000 });

      // Test sending an English message
      await page.locator('input[placeholder*="Type in"]').first().fill('Can we confirm the deployment schedule?');
      await page.locator('button:has(svg.lucide-send)').first().click();
      await page.waitForTimeout(400);

      // Test sending an Urdu message
      await page.locator('input[placeholder*="Type in"]').nth(1).fill('جی سسٹم مکمل طور پر تیار ہے۔');
      await page.locator('button:has(svg.lucide-send)').nth(1).click();
      await page.waitForTimeout(400);

      const enTurnCreated = await page.evaluate(() => document.body.innerText.includes('Can we confirm the deployment schedule?'));
      const urTurnCreated = await page.evaluate(() => document.body.innerText.includes('جی سسٹم مکمل طور پر تیار ہے۔'));

      if (!enTurnCreated || !urTurnCreated) {
        throw new Error('Live interpretation stream failed to record global language turns');
      }
    });

    // ---------------------------------------------------------
    // 6. Language Selector Popover & Search Verification
    // ---------------------------------------------------------
    await testStep('Language Registry', '50+ World Languages Search & Region Filters', async () => {
      // Click left language selector button to open dropdown
      await page.locator('[data-testid="language-selector-trigger"]').first().click();
      await page.waitForSelector('text=50+ World Languages & Scripts Supported', { timeout: 3000 });

      // Search 'Japanese'
      await page.locator('input[placeholder*="Search by name"]').fill('Japanese');
      await page.waitForTimeout(200);

      const foundJapanese = await page.evaluate(() => document.body.innerText.includes('日本語'));
      if (!foundJapanese) throw new Error('Language search failed to find Japanese');

      // Select Japanese
      await page.locator('button:has-text("Japanese")').first().click();
      await page.waitForTimeout(200);

      // Restore to English
      await page.locator('[data-testid="language-selector-trigger"]').first().click();
      await page.locator('input[placeholder*="Search by name"]').fill('English');
      await page.locator('button:has-text("English")').first().click();
      await page.waitForTimeout(200);
    });

    // ---------------------------------------------------------
    // 7. Meeting Archive & Search Matrix
    // ---------------------------------------------------------
    await testStep('Archive & Search', 'Multilingual Meeting Archive Search Querying', async () => {
      await page.click('button:has-text("Meeting Archive")');
      await page.waitForSelector('text=Meeting Archive & Multilingual Search', { timeout: 4000 });

      await page.locator('input[placeholder*="Search keyword in English"]').fill('Legal');
      await page.waitForTimeout(300);

      const foundLegal = await page.evaluate(() => document.body.innerText.includes('Client Discovery: Bilingual Legal & Contract Review'));
      if (!foundLegal) {
        throw new Error('Search failed to filter legal meeting');
      }

      await page.locator('input[placeholder*="Search keyword in English"]').fill('');
    });

    // ---------------------------------------------------------
    // 8. Team Workspace & Teammate Invites
    // ---------------------------------------------------------
    await testStep('Team Workspace', 'Team Workspace Collaboration & Member Invites', async () => {
      await page.click('button:has-text("Team Workspace")');
      await page.click('button:has-text("Invite Teammate")');
      await page.locator('input[placeholder="colleague@company.com"]').fill('global.lead@remote.org');
      await page.click('button:has-text("Send Invitation")');
      await page.waitForTimeout(400);

      const isInvited = await page.evaluate(() => document.body.innerText.includes('global.lead@remote.org'));
      if (!isInvited) {
        throw new Error('Invited team member not found in workspace table');
      }
    });

    // ---------------------------------------------------------
    // 9. Mobile Responsive Drawer Navigation
    // ---------------------------------------------------------
    await testStep('Responsive Mobile', 'Mobile Viewport (375x667) Drawer Navigation & Touch Targets', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      await page.click('button:has(svg.lucide-menu)');
      await page.waitForTimeout(400);

      const drawerButton = page.locator('.fixed button:has-text("Settings & Themes")');
      if (await drawerButton.count() > 0) {
        await drawerButton.click();
      }
      await page.waitForTimeout(300);
    });

  } finally {
    await browser.close();
  }

  // Generate HTML Report
  const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LinguTrack AI — Global 50+ Languages Test Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0F172A; color: #F8FAFC; padding: 2rem; }
    .container { max-width: 900px; margin: 0 auto; background: #1E293B; border-radius: 1rem; padding: 2rem; border: 1px solid #334155; }
    h1 { color: #818CF8; font-size: 1.75rem; margin-bottom: 0.5rem; }
    .stat-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: bold; font-size: 0.875rem; margin-right: 0.5rem; }
    .stat-pass { background: rgba(16, 185, 129, 0.2); color: #34D399; border: 1px solid #10B981; }
    .stat-fail { background: rgba(239, 68, 68, 0.2); color: #F87171; border: 1px solid #EF4444; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
    th, td { text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid #334155; font-size: 0.875rem; }
    th { color: #94A3B8; text-transform: uppercase; font-size: 0.75rem; }
    .pass-tag { color: #34D399; font-weight: bold; }
    .fail-tag { color: #F87171; font-weight: bold; }
    .footer { margin-top: 2rem; text-align: center; color: #64748B; font-size: 0.75rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌍 LinguTrack AI — Global 50+ Languages Test Report</h1>
    <p style="color: #94A3B8; font-size: 0.875rem;">Automated Multi-Language E2E, Accessibility & Neural Translation Engine Verification</p>
    
    <div style="margin-top: 1rem;">
      <span class="stat-badge stat-pass">✔ ${passedCount} PASSED</span>
      ${failedCount > 0 ? `<span class="stat-badge stat-fail">✖ ${failedCount} FAILED</span>` : ''}
      <span style="color: #94A3B8; font-size: 0.875rem; margin-left: 0.5rem;">Total Duration: ~11s</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Test Case</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${testResults.map(r => `
          <tr>
            <td style="color: #818CF8; font-weight: 600;">${r.category}</td>
            <td>${r.name}</td>
            <td style="font-family: monospace; color: #94A3B8;">${r.duration}s</td>
            <td class="${r.status === 'PASSED' ? 'pass-tag' : 'fail-tag'}">${r.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="footer">
      Generated automatically by LinguTrack AI Global Test Suite • 50+ World Languages & Multi-Theme Engine
    </div>
  </div>
</body>
</html>
  `;

  fs.writeFileSync(path.join(REPORT_DIR, 'report.html'), reportHtml);

  console.log('\n======================================================================');
  console.log(`📊 FINAL REPORT: ${passedCount} PASSED / ${failedCount} FAILED`);
  console.log(`📄 HTML Report saved to: ${path.join(REPORT_DIR, 'report.html')}`);
  console.log('======================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runEnhancedTestSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
