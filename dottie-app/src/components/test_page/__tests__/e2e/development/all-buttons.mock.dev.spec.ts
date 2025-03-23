import { test, expect } from '@playwright/test';
import path from 'path';

// Test suite for demonstrating successful connection states using mocks
test.describe('Development - All Connection Success States (Mocked)', () => {
  // Configure screenshot directory
  const screenshotDir = path.join(process.cwd(), 'test_screenshots/test_page');

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');

    // Verify we're in development mode
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
  });

  test('should display successful connections for both API and SQLite using mocks', async ({ page }) => {
    // Intercept API call with success
    await page.route('/api/message', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'API is running in DEVELOPMENT mode (MOCKED)',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        })
      });
    });
    
    // Intercept DB call with success
    await page.route('/api/db-status', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'SQLite database is connected and operational in DEVELOPMENT mode (MOCKED)',
          status: 'healthy',
          data: {
            id: 1,
            name: 'test_record',
            created_at: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        })
      });
    });
    
    // Take initial screenshot before clicking any buttons
    await page.screenshot({ path: path.join(screenshotDir, 'mock-all-buttons-initial.png') });
    
    // Click the API test button first
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Verify API success
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible();
    await expect(apiMessage).toContainText('API is running in DEVELOPMENT mode');
    await expect(apiButton).toHaveClass(/bg-green-600/);
    
    // Take screenshot after first success
    await page.screenshot({ path: path.join(screenshotDir, 'mock-api-success-only.png') });
    
    // Then click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Verify SQLite success
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible();
    await expect(dbMessage).toContainText('SQLite database is connected and operational');
    await expect(dbButton).toHaveClass(/bg-green-600/);
    
    // Take a high-quality screenshot showing both successful connections
    // Useful for sharing with peers to demonstrate successful environment setup
    await page.screenshot({ 
      path: path.join(screenshotDir, 'mock-all-connections-success.png'),
      fullPage: true 
    });
  });
}); 