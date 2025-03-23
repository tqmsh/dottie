import { test, expect } from '@playwright/test';
import path from 'path';

// Mock test suite for both API and SQLite connections
test.describe('Development - Combined Connection Tests (Mocked)', () => {
  // Configure screenshot directories with new structure
  const baseScreenshotDir = path.join(process.cwd(), 'test_screenshots');
  const newScreenshotDir = path.join(baseScreenshotDir, 'development', 'test_page', 'both-connections', 'mock');
  const legacyScreenshotDir = path.join(baseScreenshotDir, 'test_page');

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');

    // Verify we're in development mode
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
  });

  test('should show success for both API and SQLite connections', async ({ page }) => {
    // Take a screenshot of the initial state
    await page.screenshot({ 
      path: path.join(newScreenshotDir, 'initial-state.png') 
    });
    
    // Maintain backward compatibility
    await page.screenshot({ 
      path: path.join(legacyScreenshotDir, 'mock-both-connections-initial.png')
    });
    
    // Mock API hello endpoint
    await page.route('/api/hello', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Hello World from Dottie API!'
        })
      });
    });
    
    // Mock SQL hello endpoint
    await page.route('/api/sql-hello', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Hello World from SQLite!',
          dbType: 'sqlite3',
          isConnected: true
        })
      });
    });
    
    // Mock DB status endpoint
    await page.route('/api/db-status', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'connected'
        })
      });
    });
    
    // STEP 1: Test API Connection first
    // ==================================
    
    // Click the API test button
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Wait for the API success message to appear
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible({ timeout: 5000 });
    await expect(apiMessage).toContainText('API connection successful');
    await expect(apiMessage).toContainText('Hello World from Dottie API!');
    
    // Verify the API button turns green (has the success class)
    await expect(apiButton).toHaveClass(/bg-green-600/);
    
    // Take a screenshot after API test
    await page.screenshot({
      path: path.join(newScreenshotDir, 'api-success.png')
    });
    
    // STEP 2: Test SQLite Connection next
    // ===================================
    
    // Click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Wait for the SQLite success message to appear
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible({ timeout: 5000 });
    await expect(dbMessage).toContainText('SQL connection successful');
    await expect(dbMessage).toContainText('Database status: connected');
    await expect(dbMessage).toContainText('SQLite message retrieved: "Hello World from SQLite!"');
    
    // Verify the SQLite button turns green (has the success class)
    await expect(dbButton).toHaveClass(/bg-green-600/);
    
    // Take a final screenshot showing both connections successful
    await page.screenshot({
      path: path.join(newScreenshotDir, 'both-connections-success.png')
    });
    
    // Maintain backward compatibility
    await page.screenshot({
      path: path.join(legacyScreenshotDir, 'mock-both-connections-success.png')
    });
  });
}); 