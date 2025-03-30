import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Get Setup Health Hello Endpoint E2E Test with Real API', () => {
  // Configure screenshot directories
  const baseScreenshotDir = path.join(process.cwd(), 'test_screenshots');
  const screenShotDir = path.join(
    baseScreenshotDir, 
    'development',
    'test_page',
    'api-connection',
    'real'
  );
  
  // Create directory if it doesn't exist
  test.beforeAll(() => {
    if (!fs.existsSync(screenShotDir)) {
      fs.mkdirSync(screenShotDir, { recursive: true });
    }
  });
  
  test('health hello endpoint returns success message', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Find the setup category
    const setupSection = page.getByText('Setup Endpoints');
    await setupSection.scrollIntoViewIfNeeded();
    
    // Take screenshot of the initial state
    await page.screenshot({ 
      path: path.join(screenShotDir, 'setup-health-hello-before-click.png'),
      fullPage: false 
    });
    
    // Find and click the health/hello endpoint button
    const healthHelloButton = page.getByRole('button', { name: /GET \/api\/setup\/health\/hello/i });
    await healthHelloButton.scrollIntoViewIfNeeded();
    await healthHelloButton.click();
    
    // Wait for the response
    await page.waitForSelector('text="Hello World from Dottie API!"', { timeout: 10000 });
    
    // Verify success message is displayed
    const successMessage = page.locator('text="success"');
    await expect(successMessage).toBeVisible();
    
    // Verify the response contains expected message
    const responseText = page.locator('text="Hello World from Dottie API!"');
    await expect(responseText).toBeVisible();
    
    // Take screenshot of the result
    await page.screenshot({ 
      path: path.join(screenShotDir, 'setup-health-hello-after-click.png'),
      fullPage: false 
    });
  });
}); 