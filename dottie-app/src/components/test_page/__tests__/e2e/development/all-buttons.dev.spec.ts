import { test, expect } from '@playwright/test';
import path from 'path';

// Test suite for demonstrating real connection states
test.describe('Development - Real Connection Tests', () => {
  // Configure screenshot directory
  const screenshotDir = path.join(process.cwd(), 'test_screenshots/test_page');

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');

    // Verify we're in development mode
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
  });

  test('should connect to real API and SQLite', async ({ page }) => {
    // Take initial screenshot before clicking any buttons
    await page.screenshot({ path: path.join(screenshotDir, 'real-connections-initial.png') });
    
    // Click the API test button first
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Verify API connection (will use the real API)
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible({ timeout: 10000 });
    // We don't check for exact message text since it may vary in the real API
    await expect(apiButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
    
    // Take screenshot after API connection
    await page.screenshot({ path: path.join(screenshotDir, 'real-api-connected.png') });
    
    // Then click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Verify SQLite connection (will use the real database)
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible({ timeout: 10000 });
    // We don't check for exact message text since it may vary in the real response
    await expect(dbButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
    
    // Take a screenshot showing both real connections
    await page.screenshot({ 
      path: path.join(screenshotDir, 'real-all-connections-success.png'),
      fullPage: true 
    });
  });
});
