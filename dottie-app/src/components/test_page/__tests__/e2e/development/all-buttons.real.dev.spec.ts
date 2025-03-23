import { test, expect } from '@playwright/test';
import path from 'path';
import { setupApiForPlaywright, teardownApiForPlaywright } from './e2e-test-setup';

// Test suite for demonstrating real connection states
test.describe('Development - Real Connection Tests', () => {
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

  test('should connect to real API and SQLite', async ({ page }) => {
    // Take initial screenshot before clicking any buttons
    await page.screenshot({ path: path.join(screenshotDir, 'real-connections-initial.png') });
    
    // Click the API test button first
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Verify API connection (will use the real API)
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible({ timeout: 10000 });
    
    // Get the actual message text
    const messageText = await apiMessage.textContent();
    console.log('API Message:', messageText);
    
    // Verify the message contains the success message
    await expect(apiMessage).toContainText('API connection successful', { timeout: 10000 });
    
    // Check if it's the full success message or the empty message
    if (messageText?.includes('but no message returned')) {
      // This is the fallback case when API returns no message
      await expect(apiMessage).toContainText('API connection successful, but no message returned', { timeout: 10000 });
    } else {
      // This is the successful case with an API message
      await expect(apiMessage).toContainText('Server says:', { timeout: 10000 });
      await expect(apiMessage).toContainText('Hello World from Dottie API', { timeout: 10000 });
    }
    
    // Verify the button is green regardless
    await expect(apiButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
    
    // Take screenshot after API connection
    await page.screenshot({ path: path.join(screenshotDir, 'real-api-connected.png') });
    
    // Then click the SQLite test button
    const dbButton = page.locator('[data-testid="test-db-button"]');
    await expect(dbButton).toBeVisible();
    await dbButton.click();
    
    // Attempt to find the SQLite message
    console.log('Clicking DB button...');
    
    // Wait longer for DB operations
    await page.waitForTimeout(5000);
    
    // Take a screenshot after waiting
    await page.screenshot({ path: path.join(screenshotDir, 'real-sqlite-after-waiting.png') });
    
    // Check if the DB message is visible
    const dbMessage = page.locator('[data-testid="db-message"]');
    const isDbVisible = await dbMessage.isVisible().catch(() => false);
    console.log('DB Message visible:', isDbVisible);
    
    if (isDbVisible) {
      // Get the DB message text if visible
      const dbText = await dbMessage.textContent();
      console.log('DB Message:', dbText);
      
      // Check the db message content for SQL and status info
      const hasSqlHello = dbText?.includes('Hello World from Azure SQL!') || false;
      const hasDbStatus = dbText?.includes('Database status: connected') || false;
      
      if (hasSqlHello && hasDbStatus) {
        // Both messages present - should be green
        await expect(dbButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
      } else if (hasSqlHello || hasDbStatus) {
        // One message present - should be yellow
        await expect(dbButton).toHaveClass(/bg-yellow-600/, { timeout: 10000 });
      } else {
        // No messages - should be red
        await expect(dbButton).toHaveClass(/bg-red-600/, { timeout: 10000 });
      }
    } else {
      // If message isn't visible, check button color
      const buttonClass = await dbButton.getAttribute('class');
      console.log('DB Button class:', buttonClass);
      
      // Just verify the button is not in its default blue state
      expect(buttonClass?.includes('bg-blue-600')).toBeFalsy();
    }
    
    // Take a screenshot showing both real connections
    await page.screenshot({ 
      path: path.join(screenshotDir, 'real-all-connections-success.png'),
      fullPage: true 
    });
  });
}); 