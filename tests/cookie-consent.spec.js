const { test, expect } = require('@playwright/test');

/**
 * GDPR cookie consent compliance tests (ZEU-359).
 *
 * These tests verify that GA4 is fully gated behind opt-in consent:
 * no analytics cookies or network requests fire until the visitor accepts.
 */

test.describe('Cookie consent compliance', () => {
  // Reset consent state before each test so every test starts as a first-time visitor.
  test.beforeEach(async ({ page }) => {
    // CookieConsent's hideFromBots checks navigator.webdriver, which Playwright sets to true.
    // Override it so the consent modal renders normally in tests.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    // Block outgoing GA collect calls so tests never ping Google's servers.
    await page.route('**google-analytics.com/**', route => route.abort());
    await page.goto('/');
    await page.evaluate(() => {
      document.cookie.split(';').forEach(c => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
    });
    await page.reload();
    // Wait for CookieConsent to initialize (self-hosted ESM module)
    await page.waitForFunction(() => typeof window.CookieConsent !== 'undefined', { timeout: 20_000 });
  });

  test('consent bar appears on first visit — homepage', async ({ page }) => {
    await expect(page.locator('.cm')).toBeVisible();
  });

  test('consent bar appears on first visit — post pages', async ({ page }) => {
    const postLink = page.locator('a').filter({ hasText: /.{10,}/ }).first();
    await postLink.click();
    await expect(page.locator('.cm')).toBeVisible();
  });

  test('Decline stores only necessary consent (no analytics)', async ({ page }) => {
    await page.getByRole('button', { name: 'Decline' }).click();
    const stored = await page.evaluate(() => {
      const match = document.cookie.match(/(?:^|;\s*)cc_cookie=([^;]*)/);
      return match ? JSON.parse(decodeURIComponent(match[1])) : null;
    });
    expect(stored).not.toBeNull();
    expect(stored.categories).not.toContain('analytics');
    expect(stored.categories).toContain('necessary');
  });

  test('Accept stores analytics consent in cookie', async ({ page }) => {
    await page.getByRole('button', { name: 'Accept' }).click();
    const stored = await page.evaluate(() => {
      const match = document.cookie.match(/(?:^|;\s*)cc_cookie=([^;]*)/);
      return match ? JSON.parse(decodeURIComponent(match[1])) : null;
    });
    expect(stored).not.toBeNull();
    expect(stored.categories).toContain('analytics');
  });

  test('banner does not reappear after accepting', async ({ page }) => {
    await page.getByRole('button', { name: 'Accept' }).click();
    await page.reload();
    await expect(page.locator('.cm')).not.toBeVisible();
  });

  test('banner does not reappear after declining', async ({ page }) => {
    await page.getByRole('button', { name: 'Decline' }).click();
    await page.reload();
    await expect(page.locator('.cm')).not.toBeVisible();
  });

  test('preferences modal shows Necessary (locked) and Analytics (toggleable)', async ({ page }) => {
    const prefsBtn = page.getByRole('button', { name: 'Manage preferences' });
    await prefsBtn.hover();
    await prefsBtn.click();
    const modal = page.locator('.pm');
    await expect(modal).toBeVisible();

    const necessarySection = modal.locator('.pm__section--toggle').filter({ hasText: 'Strictly necessary' });
    await expect(necessarySection).toBeVisible();
    await expect(necessarySection.locator('input[type="checkbox"]')).toBeDisabled();

    const analyticsSection = modal.locator('.pm__section--toggle').filter({ hasText: 'Analytics' });
    await expect(analyticsSection).toBeVisible();
    await expect(analyticsSection.locator('input[type="checkbox"]')).toBeEnabled();
  });

  test('revoking analytics consent removes analytics category', async ({ page }) => {
    // Accept first
    await page.getByRole('button', { name: 'Accept' }).click();
    let stored = await page.evaluate(() => {
      const match = document.cookie.match(/(?:^|;\s*)cc_cookie=([^;]*)/);
      return match ? JSON.parse(decodeURIComponent(match[1])) : null;
    });
    expect(stored.categories).toContain('analytics');

    // Re-open preferences and toggle analytics off
    await page.evaluate(() => window.CookieConsent.showPreferences());
    const analyticsToggle = page.locator('.pm__section--toggle')
      .filter({ hasText: 'Analytics' })
      .locator('input[type="checkbox"]');
    await expect(analyticsToggle).toBeChecked();
    await analyticsToggle.uncheck();
    await page.getByRole('button', { name: 'Save preferences' }).click();

    stored = await page.evaluate(() => {
      const match = document.cookie.match(/(?:^|;\s*)cc_cookie=([^;]*)/);
      return match ? JSON.parse(decodeURIComponent(match[1])) : null;
    });
    expect(stored.categories).not.toContain('analytics');
  });

  test('GA4 Measurement ID is a real ID, not the placeholder', async ({ page }) => {
    const html = await page.content();
    // The placeholder must have been replaced before deploying
    expect(html).not.toContain('G-XXXXXXXXXX');
    // A real GA4 ID follows the pattern G-[A-Z0-9]+
    expect(html).toMatch(/googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+/);
  });

  test('GA4 network requests are blocked before consent is given', async ({ page }) => {
    const ga4Requests = [];
    page.on('request', req => {
      if (req.url().includes('google-analytics.com') || req.url().includes('googletagmanager.com/gtag/js')) {
        ga4Requests.push(req.url());
      }
    });

    // Navigate fresh — banner visible, no interaction
    await page.goto('/');
    await page.waitForFunction(() => typeof window.CookieConsent !== 'undefined', { timeout: 20_000 });
    await expect(page.locator('.cm')).toBeVisible();

    // Only the gtag loader script itself is permitted; no collect/analytics hits
    const collectHits = ga4Requests.filter(u => u.includes('/collect') || u.includes('analytics'));
    expect(collectHits).toHaveLength(0);
  });

  test('Consent Mode defaults are set to denied before gtag loads', async ({ page }) => {
    const html = await page.content();
    // Consent defaults block must appear before the gtag.js script tag
    const consentDefaultIndex = html.indexOf("gtag('consent', 'default'");
    const gtagScriptIndex = html.indexOf('googletagmanager.com/gtag/js');
    expect(consentDefaultIndex).toBeGreaterThan(-1);
    expect(gtagScriptIndex).toBeGreaterThan(-1);
    expect(consentDefaultIndex).toBeLessThan(gtagScriptIndex);
  });
});
