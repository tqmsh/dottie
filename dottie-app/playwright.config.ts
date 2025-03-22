import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Create screenshot directory if it doesn't exist
const screenshotDir = path.join(__dirname, 'test_screenshots/test_page');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  // Directory where tests are located
  testDir: path.join(__dirname, 'app/test_page/__tests__/e2e'),
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Reporter to use
  reporter: 'html',
  
  // Shared settings for all projects
  use: {
    // Base URL to use in all tests
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying a test
    trace: 'on-first-retry',
    
    // Screenshot on test completion
    screenshot: 'on',
  },
  
  // Configure projects for different browsers - ONLY SAFARI
  projects: [
    {
      name: 'safari',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  // Setup and teardown for the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120000, // Increase timeout to 2 minutes to ensure API is fully ready
  },
  
  // Screenshot output directory
  outputDir: 'test_screenshots/test_page',
}); 