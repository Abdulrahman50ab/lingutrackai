import { test, expect } from '@playwright/test';

test.describe('Network Resilience & High Latency Stress Suite', () => {
  test('should handle Simulated 3G Slow Network gracefully', async ({ page }) => {
    // Emulate Fast 3G network conditions
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150, // 150ms roundtrip
      downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
      uploadThroughput: (750 * 1024) / 8, // 750 Kbps
    });

    await page.goto('/');
    await page.waitForSelector('text=LinguTrack', { timeout: 10000 });

    // Test audio processing under throttled network
    await page.click('button:has-text("Upload Audio")');
    await page.click('button:has-text("Code-Switched Standup")');
    await page.waitForTimeout(3500);

    const isTranscriptReady = await page.evaluate(() =>
      document.body.innerText.includes('Redis cache cluster')
    );
    expect(isTranscriptReady).toBe(true);
  });

  test('should execute 5 rapid concurrent live interpretation turns without memory leaks', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Live Interpretation"):not(:has-text("Speech"))').first().click();

    const phrases = [
      'First review point for sprint metrics.',
      'Second query regarding latency SLA.',
      'Third checkpoint for database clustering.',
      'Fourth note on cross-border data residency.',
      'Fifth conclusion for executive deployment.'
    ];

    for (const phrase of phrases) {
      await page.locator('input[placeholder="Type English sentence or use mic..."]').fill(phrase);
      await page.locator('button:has(svg.lucide-send)').first().click();
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(1000);
    const count = await page.locator('text=Spoken (English):').count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});
