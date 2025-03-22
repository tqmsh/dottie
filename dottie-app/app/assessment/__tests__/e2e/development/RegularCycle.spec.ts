import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage } from './test-utils';

test.describe('Regular Cycle Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Regular Cycle path', async ({ page }) => {
    // 1. Age Verification
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-age-verification.png') });
    
    // Select 18-24 years option
    await page.getByText('18-24 years').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-age-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 2. Cycle Length
    await page.waitForURL(`**${assessmentPaths.cycleLength}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-cycle-length.png') });
    
    // Select 26-30 days
    await page.getByText('26-30 days').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-cycle-length-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 3. Period Duration
    await page.waitForURL(`**${assessmentPaths.periodDuration}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-period-duration.png') });
    
    // Select 4-5 days
    await page.getByText('4-5 days').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-period-duration-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 4. Flow
    await page.waitForURL(`**${assessmentPaths.flow}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-flow.png') });
    
    // Select Moderate
    await page.getByText('Moderate').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-flow-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 5. Pain
    await page.waitForURL(`**${assessmentPaths.pain}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-pain.png') });
    
    // Select Mild
    await page.getByText('Mild').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-pain-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 6. Symptoms
    await page.waitForURL(`**${assessmentPaths.symptoms}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-symptoms.png') });
    
    // Select Fatigue
    await page.getByText('Fatigue').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-symptoms-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 7. Results
    await page.waitForURL(`**${assessmentPaths.results}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-results-regular-cycle.png') });
  });
}); 