import { test, expect } from '@playwright/test';
import path from 'path';

// Mock test suite for the API message functionality
test.describe('Development - API Message Connection Tests (Mocked)', () => {
  // Configure screenshot directory
  const screenshotDir = path.join(process.cwd(), 'test_screenshots/test_page');

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');

    // Verify we're in development mode
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
  });

  test('should display API section with correct button state', async ({ page }) => {
    // Take a screenshot of the initial page
    await page.screenshot({ path: path.join(screenshotDir, 'mock-api-initial-state.png') });
    
    // Check that the API section title is visible
    const apiTitle = page.locator('h2:has-text("API Connection Test")');
    await expect(apiTitle).toBeVisible();
    
    // Check that the test button is visible and has the correct text
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await expect(apiButton).toHaveText('Test API Message');
    
    // Verify button has the default blue style initially
    await expect(apiButton).toHaveClass(/bg-blue-600/);
    
    // Take a screenshot of the API section
    await page.screenshot({ path: path.join(screenshotDir, 'mock-api-section.png') });
  });

  test('should show error message when API connection fails in development', async ({ page }) => {
    // Intercept the API call and mock a failed response
    await page.route('/api/hello', route => route.abort('failed'));
    
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
    await page.screenshot({ path: path.join(screenshotDir, 'mock-api-connection-error.png') });
  });

  test('should show success message when API connection succeeds in development', async ({ page }) => {
    // Intercept the API call and mock a successful response
    await page.route('/api/hello', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Hello World from Dottie API!',
          version: '1.0.0',
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
    await expect(apiMessage).toContainText('Hello World from Dottie API');
    
    // Verify the button turns green (has the success class)
    await expect(apiButton).toHaveClass(/bg-green-600/);
    
    // Take a screenshot after the success
    await page.screenshot({ path: path.join(screenshotDir, 'mock-api-connection-success.png') });
  });
}); 