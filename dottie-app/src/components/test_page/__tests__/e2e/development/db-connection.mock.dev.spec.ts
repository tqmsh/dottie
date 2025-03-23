import { test, expect } from '@playwright/test';
import path from 'path';

// Mock test suite for the SQLite database connection
test.describe('Development - SQLite Database Connection Tests (Mocked)', () => {
  // Configure screenshot directory
  const screenshotDir = path.join(process.cwd(), 'test_screenshots/test_page');

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');

    // Verify we're in development mode
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
  });

  test('should display SQLite section with correct button state', async ({ page }) => {
    // Take a screenshot of the initial page
    await page.screenshot({ path: path.join(screenshotDir, 'mock-sqlite-initial-state.png') });
    
    // Check that the SQLite section title is visible
    const dbTitle = page.locator('h2:has-text("SQLite Connection Test")');
    await expect(dbTitle).toBeVisible();
    
    // Check that the test button is visible and has the correct text
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await expect(dbButton).toHaveText('Test SQLite Connection');
    
    // Verify button has the default blue style initially
    await expect(dbButton).toHaveClass(/bg-blue-600/);
    
    // Take a screenshot of the SQLite section
    await page.screenshot({ path: path.join(screenshotDir, 'mock-sqlite-section.png') });
  });

  test('should show error message when SQLite connection fails in development', async ({ page }) => {
    // Intercept the DB call and mock a failed response
    await page.route('/api/db-status', route => route.abort('failed'));
    
    // Click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Wait for the error message to appear
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible();
    await expect(dbMessage).toContainText('Could not connect to SQLite database');
    
    // Verify the button turns red (has the error class)
    await expect(dbButton).toHaveClass(/bg-red-600/);
    
    // Take a screenshot after the error
    await page.screenshot({ path: path.join(screenshotDir, 'mock-sqlite-connection-error.png') });
  });

  test('should show success message when SQLite connection succeeds in development', async ({ page }) => {
    // Intercept the DB call and mock a successful response
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
    
    // Click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Wait for the success message to appear
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible();
    await expect(dbMessage).toContainText('connected and operational');
    await expect(dbMessage).toContainText('DEVELOPMENT');
    
    // Verify the button turns green (has the success class)
    await expect(dbButton).toHaveClass(/bg-green-600/);
    
    // Take a screenshot after the success
    await page.screenshot({ path: path.join(screenshotDir, 'mock-sqlite-connection-success.png') });
  });
}); 