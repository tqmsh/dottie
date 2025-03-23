import { test, expect } from '@playwright/test';
import path from 'path';
import { setupApiForPlaywright, teardownApiForPlaywright } from '../../../e2e/development/e2e-test-setup';

// Real test suite for the database connection functionality
test.describe('Development - SQLite Database Connection Tests (Real)', () => {
  // Configure screenshot directory with new structure
  const baseScreenshotDir = path.join(process.cwd(), 'test_screenshots');
  const newScreenshotDir = path.join(baseScreenshotDir, 'development', 'test_page', 'database-connection', 'real');
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

  test('should display SQLite section with correct button state', async ({ page }) => {
    // Take a screenshot of the initial page using new path structure
    await page.screenshot({ 
      path: path.join(newScreenshotDir, 'initial-state.png')
    });
    
    // Maintain backward compatibility for now
    await page.screenshot({ 
      path: path.join(legacyScreenshotDir, 'real-db-initial-state.png')
    });
    
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
    await page.screenshot({ 
      path: path.join(newScreenshotDir, 'section.png')
    });
    
    // Maintain backward compatibility for now
    await page.screenshot({ 
      path: path.join(legacyScreenshotDir, 'real-db-section.png')
    });
  });

  test('should connect to real database and verify success', async ({ page }) => {
    // Enable console logging from the page to see the API responses
    page.on('console', msg => console.log(`PAGE LOG: ${msg.text()}`));
    
    // Monitor network requests for both database endpoints
    await page.route('**/api/sql-hello', route => {
      console.log('SQL Hello Request intercepted:', route.request().url());
      route.continue();
    });
    
    await page.route('**/api/db-status', route => {
      console.log('DB Status Request intercepted:', route.request().url());
      route.continue();
    });
    
    // Click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Wait for the response to appear
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible({ timeout: 10000 });
    
    // Get the actual message text
    const messageText = await dbMessage.textContent();
    console.log('DB Message:', messageText);
    
    // Verify the specific messages are displayed
    await expect(dbMessage).toContainText('SQL connection successful', { timeout: 10000 });
    await expect(dbMessage).toContainText('Hello World from Azure SQL!', { timeout: 10000 });
    await expect(dbMessage).toContainText('Database status: connected', { timeout: 10000 });
    
    // Check button color (should be green for success)
    await expect(dbButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
    
    // Take a screenshot after the connection test - new path
    await page.screenshot({ 
      path: path.join(newScreenshotDir, 'connection-result.png')
    });
    
    // Maintain backward compatibility for now
    await page.screenshot({ 
      path: path.join(legacyScreenshotDir, 'real-db-connection-result.png')
    });
  });
}); 