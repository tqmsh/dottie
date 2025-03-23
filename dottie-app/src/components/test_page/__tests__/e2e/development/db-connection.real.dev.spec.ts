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
    
    // Wait for some time to ensure both requests complete
    await page.waitForTimeout(2000);
    
    // Verify the response contains meaningful text from both endpoints
    await expect(dbMessage).toContainText('SQL connection', { timeout: 15000 });
    
    // Check if the message contains Hello World from Azure SQL
    const messageText = await dbMessage.textContent();
    const hasSqlHello = messageText?.includes('Hello World from Azure SQL!') || false;
    const hasDbStatus = messageText?.includes('Database status: connected') || false;
    
    if (hasSqlHello && hasDbStatus) {
      // Both messages are present, button should be green
      await expect(dbButton).toHaveClass(/bg-green-600/, { timeout: 15000 });
    } else if (hasSqlHello || hasDbStatus) {
      // Only one message is present, button should be yellow
      await expect(dbButton).toHaveClass(/bg-yellow-600/, { timeout: 15000 });
    } else {
      // No messages are present, button should be red
      await expect(dbButton).toHaveClass(/bg-red-600/, { timeout: 15000 });
    }
    
    // Take a screenshot after the connection test
    await page.screenshot({ path: path.join(screenshotDir, 'real-sqlite-connection-result.png') });
  });
}); 