import { test, expect } from '@playwright/test';
import path from 'path';
import { setupApiForPlaywright, teardownApiForPlaywright } from './e2e-test-setup';

// Real test suite for both API and SQLite connections
test.describe('Development - Combined Connection Tests (Real)', () => {
  // Configure screenshot directories with new structure
  const baseScreenshotDir = path.join(process.cwd(), 'test_screenshots');
  const newScreenshotDir = path.join(baseScreenshotDir, 'development', 'test_page', 'both-connections', 'real');
  const legacyScreenshotDir = path.join(baseScreenshotDir, 'test_page');

  // Setup API server before all tests
  test.beforeAll(async () => {
    await setupApiForPlaywright();
  });

  // Cleanup after all tests
  test.afterAll(async () => {
    await teardownApiForPlaywright();
  });

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');

    // Verify we're in development mode
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
  });

  test('should connect to real API and database successfully', async ({ page }) => {
    // Enable console logging from the page
    page.on('console', msg => console.log(`PAGE LOG: ${msg.text()}`));
    
    // Monitor network requests for debugging
    await page.route('**/api/hello', route => {
      console.log('API Hello Request intercepted:', route.request().url());
      route.continue();
    });
    
    await page.route('**/api/sql-hello', route => {
      console.log('SQL Hello Request intercepted:', route.request().url());
      route.continue();
    });
    
    await page.route('**/api/db-status', route => {
      console.log('DB Status Request intercepted:', route.request().url());
      route.continue();
    });
    
    // Take a screenshot of the initial state
    await page.screenshot({ 
      path: path.join(newScreenshotDir, 'initial-state.png') 
    });
    
    // Maintain backward compatibility
    await page.screenshot({ 
      path: path.join(legacyScreenshotDir, 'real-both-connections-initial.png')
    });
    
    // STEP 1: Test API Connection first
    // =================================
    
    // Click the API test button
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Wait for the API success message to appear
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible({ timeout: 10000 });
    await expect(apiMessage).toContainText('API connection successful', { timeout: 10000 });
    await expect(apiMessage).toContainText('Hello World from Dottie API!', { timeout: 10000 });
    
    // Verify the API button turns green (has the success class)
    await expect(apiButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
    
    // Take a screenshot after API test
    await page.screenshot({
      path: path.join(newScreenshotDir, 'api-success.png')
    });
    
    // Get the actual message text for logging
    const apiMessageText = await apiMessage.textContent();
    console.log('API Message:', apiMessageText);
    
    // STEP 2: Test SQLite Connection next
    // ==================================
    
    // Click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Wait for the SQLite success message to appear
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible({ timeout: 10000 });
    await expect(dbMessage).toContainText('SQL connection successful', { timeout: 10000 });
    await expect(dbMessage).toContainText('Database status: connected', { timeout: 10000 });
    await expect(dbMessage).toContainText('SQLite message retrieved: "Hello World from SQLite!"', { timeout: 10000 });
    
    // Verify the SQLite button turns green (has the success class)
    await expect(dbButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
    
    // Get the actual message text for logging
    const dbMessageText = await dbMessage.textContent();
    console.log('DB Message:', dbMessageText);
    
    // Take a final screenshot showing both connections successful
    await page.screenshot({
      path: path.join(newScreenshotDir, 'both-connections-success.png')
    });
    
    // Maintain backward compatibility
    await page.screenshot({
      path: path.join(legacyScreenshotDir, 'real-both-connections-success.png')
    });
  });
}); 