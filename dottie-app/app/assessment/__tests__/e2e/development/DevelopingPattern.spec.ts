import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage } from './test-utils';

test.describe('Developing Pattern Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Developing Pattern path', async ({ page }) => {
    // 1. Age Verification
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    
    // Select 13-17 years option
    await page.getByText('13-17 years').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '23-teenage-age-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 2. Cycle Length
    await page.waitForURL(`**${assessmentPaths.cycleLength}**`);
    await page.waitForLoadState('networkidle');
    
    // Select "I'm not sure"
    await page.getByText("I'm not sure").click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 3. Period Duration
    await page.waitForURL(`**${assessmentPaths.periodDuration}**`);
    await page.waitForLoadState('networkidle');
    
    // Select 6-7 days
    await page.getByText('6-7 days').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 4. Flow
    await page.waitForURL(`**${assessmentPaths.flow}**`);
    await page.waitForLoadState('networkidle');
    
    // Select Heavy
    await page.getByText('Heavy').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 5. Pain
    await page.waitForURL(`**${assessmentPaths.pain}**`);
    await page.waitForLoadState('networkidle');
    
    // Select Moderate
    await page.getByText('Moderate').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 6. Symptoms
    await page.waitForURL(`**${assessmentPaths.symptoms}**`);
    await page.waitForLoadState('networkidle');
    
    // Select Mood Changes
    await page.getByText('Mood Changes').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 7. Results
    await page.waitForURL(`**${assessmentPaths.results}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '24-results-developing-pattern.png') });
  });
}); 