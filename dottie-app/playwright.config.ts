import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create screenshot directories if they don't exist
const testPageDir = path.join(__dirname, 'test_screenshots/test_page');
const assessmentDir = path.join(__dirname, 'test_screenshots/assessment');

if (!fs.existsSync(testPageDir)) {
  fs.mkdirSync(testPageDir, { recursive: true });
}

if (!fs.existsSync(assessmentDir)) {
  fs.mkdirSync(assessmentDir, { recursive: true });
}

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  // Directory where tests are located - include both paths
  testDir: './app',
  testMatch: '**/__tests__/e2e/**/*.spec.ts',
  
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
  
  // Screenshot output directory is configured in the test files
}); 