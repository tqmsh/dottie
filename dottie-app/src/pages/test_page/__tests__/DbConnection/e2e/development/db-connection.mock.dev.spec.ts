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
    // Intercept both DB calls and mock failed responses
    await page.route('/api/sql-hello', route => route.abort('failed'));
    await page.route('/api/db-status', route => route.abort('failed'));
    
    // Click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Wait for the error message to appear
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible();
    await expect(dbMessage).toContainText('Could not connect to SQL database');
    await expect(dbMessage).toContainText('Could not get database status');
    
    // Verify the button turns red (has the error class)
    await expect(dbButton).toHaveClass(/bg-red-600/);
    
    // Take a screenshot after the error
    await page.screenshot({ path: path.join(screenshotDir, 'mock-sqlite-connection-error.png') });
  });

  test('should show success message when SQLite connection succeeds in development', async ({ page }) => {
    // Intercept the API/sql-hello call with the expected message
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
    
    // Intercept the API/db-status call
    await page.route('/api/db-status', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'connected'
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
    
    // Verify the specific messages are displayed in the correct order
    await expect(dbMessage).toContainText('SQL connection successful', { timeout: 10000 });
    await expect(dbMessage).toContainText('Database status: connected', { timeout: 10000 });
    await expect(dbMessage).toContainText('SQLite message retrieved: "Hello World from SQLite!"', { timeout: 10000 });
    
    // Verify the button turns green (has the success class)
    await expect(dbButton).toHaveClass(/bg-green-600/);
    
    // Take a screenshot after the success
    await page.screenshot({ path: path.join(screenshotDir, 'mock-sqlite-connection-success.png') });
  });
}); 