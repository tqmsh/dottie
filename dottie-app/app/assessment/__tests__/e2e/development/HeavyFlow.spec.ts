import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage } from './test-utils';

test.describe('Heavy Flow Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Heavy Flow path', async ({ page }) => {
    // 1. Age Verification
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    
    // Select 18-24 years option
    await page.getByText('18-24 years').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 2. Cycle Length
    await page.waitForURL(`**${assessmentPaths.cycleLength}**`);
    await page.waitForLoadState('networkidle');
    
    // Select 26-30 days
    await page.getByText('26-30 days').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 3. Period Duration
    await page.waitForURL(`**${assessmentPaths.periodDuration}**`);
    await page.waitForLoadState('networkidle');
    
    // Select 8+ days
    await page.getByText('8+ days').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14-heavy-flow-duration-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 4. Flow
    await page.waitForURL(`**${assessmentPaths.flow}**`);
    await page.waitForLoadState('networkidle');
    
    // Select Heavy
    await page.getByText('Heavy').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15-heavy-flow-selected.png') });
    
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
    
    // Select multiple symptoms
    await page.getByText('Fatigue').click();
    await page.getByText('Bloating').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16-heavy-flow-symptoms-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 7. Results
    await page.waitForURL(`**${assessmentPaths.results}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17-results-heavy-flow.png') });
  });
}); 