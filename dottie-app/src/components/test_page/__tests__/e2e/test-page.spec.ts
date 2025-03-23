import { test, expect } from '@playwright/test';
import path from 'path';

// Test suite for the test page
test.describe('Test Page E2E Tests', () => {
  // Configure screenshot directory
  const screenshotDir = path.join(process.cwd(), 'test_screenshots/test_page');

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');
  });

  test('should display the correct page title with environment', async ({ page }) => {
    // Check that the page title shows the correct environment
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
    
    // Take a screenshot of the initial page state
    await page.screenshot({ path: path.join(screenshotDir, 'initial-state.png') });
  });

  test('should show error message when API connection fails', async ({ page }) => {
    // Intercept the API call and mock a failed response
    await page.route('/api/message', route => route.abort('failed'));
    
    // Click the API test button
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Wait for the error message to appear
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible();
    await expect(apiMessage).toContainText('Could not connect to API');
    
    // Verify the button turns red (has the error class)
    await expect(apiButton).toHaveClass(/bg-red-600/);
    
    // Take a screenshot after the error
    await page.screenshot({ path: path.join(screenshotDir, 'api-connection-error.png') });
  });

  test('should show success message when API connection succeeds', async ({ page }) => {
    // Intercept the API call and mock a successful response
    await page.route('/api/message', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'API is running in DEVELOPMENT mode',
          timestamp: new Date().toISOString()
        })
      });
    });
    
    // Click the API test button
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Wait for the success message to appear
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible();
    await expect(apiMessage).toContainText('API is running in DEVELOPMENT mode');
    
    // Verify the button turns green (has the success class)
    await expect(apiButton).toHaveClass(/bg-green-600/);
    
    // Take a screenshot after the success
    await page.screenshot({ path: path.join(screenshotDir, 'api-connection-success.png') });
  });
}); 