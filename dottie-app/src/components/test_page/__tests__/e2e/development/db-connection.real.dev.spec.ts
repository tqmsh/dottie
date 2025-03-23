import { test, expect } from '@playwright/test';
import path from 'path';

// Real test suite for the SQLite database connection
test.describe('Development - SQLite Database Connection Tests (Real)', () => {
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
    await page.screenshot({ path: path.join(screenshotDir, 'real-sqlite-initial-state.png') });
    
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
    await page.screenshot({ path: path.join(screenshotDir, 'real-sqlite-section.png') });
  });

  test('should connect to real SQLite database and verify success', async ({ page }) => {
    // Click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Wait for the response to appear (longer timeout for DB operations)
    const dbMessage = page.locator('[data-testid="db-message"]');
    await expect(dbMessage).toBeVisible({ timeout: 15000 });
    
    // Verify some response has appeared (without checking exact content)
    await expect(dbMessage).not.toBeEmpty();
    
    // Check button color (should be green for success or red for failure)
    // We're asserting that the SQLite connection is successful in this test
    await expect(dbButton).toHaveClass(/bg-green-600/, { timeout: 15000 });
    
    // Take a screenshot after the connection test
    await page.screenshot({ path: path.join(screenshotDir, 'real-sqlite-connection-result.png') });
  });
}); 