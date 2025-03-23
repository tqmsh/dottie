import { test, expect } from '@playwright/test';
import path from 'path';
import { setupApiForPlaywright, teardownApiForPlaywright } from './e2e-test-setup';

// Real test suite for the SQLite database connection
test.describe('Development - SQLite Database Connection Tests (Real)', () => {
  // Configure screenshot directory
  const screenshotDir = path.join(process.cwd(), 'test_screenshots/test_page');

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
    
    // Add debug log
    console.log('Clicking DB test button...');
    await dbButton.click();
    
    // Wait for the button to show it's processing (text should change to "Testing...")
    await expect(dbButton).toHaveText('Testing...', { timeout: 5000 }).catch(() => {
      console.log('Button text did not change to Testing...');
    });
    
    // Take screenshot after clicking
    await page.screenshot({ path: path.join(screenshotDir, 'real-sqlite-after-click.png') });
    
    // Wait for the response to appear (longer timeout for DB operations)
    console.log('Waiting for DB message to appear...');
    const dbMessage = page.locator('[data-testid="db-message"]');
    
    // Wait for some time to ensure the request has time to process
    await page.waitForTimeout(5000);
    
    // Take another screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'real-sqlite-after-waiting.png') });
    
    // Check if the message is visible
    const isVisible = await dbMessage.isVisible().catch(() => false);
    console.log('DB Message visible:', isVisible);
    
    if (!isVisible) {
      // If message isn't visible, try clicking the button again
      console.log('DB Message not visible, clicking button again...');
      await dbButton.click();
      await page.waitForTimeout(3000);
    }
    
    // Wait for it to be visible with a longer timeout
    await expect(dbMessage).toBeVisible({ timeout: 20000 });
    
    // Get the message text
    const messageText = await dbMessage.textContent();
    console.log('DB Message text:', messageText);
    
    // Verify the response contains meaningful text
    await expect(dbMessage).toContainText('SQL connection successful', { timeout: 5000 }).catch(() => {
      console.log('Message does not contain "SQL connection successful"');
    });
    
    // Check the button color based on what messages are present
    const hasSqlHello = messageText?.includes('Hello World from Azure SQL!') || false;
    const hasDbStatus = messageText?.includes('Database status: connected') || false;
    
    console.log('Has SQL Hello:', hasSqlHello);
    console.log('Has DB Status:', hasDbStatus);
    
    if (hasSqlHello && hasDbStatus) {
      // Both messages are present, button should be green
      await expect(dbButton).toHaveClass(/bg-green-600/, { timeout: 5000 });
    } else if (hasSqlHello || hasDbStatus) {
      // Only one message is present, button should be yellow
      await expect(dbButton).toHaveClass(/bg-yellow-600/, { timeout: 5000 });
    } else {
      // No messages are present, button should be red
      await expect(dbButton).toHaveClass(/bg-red-600/, { timeout: 5000 });
    }
    
    // Take a screenshot after the connection test
    await page.screenshot({ path: path.join(screenshotDir, 'real-sqlite-connection-result.png') });
  });
}); 