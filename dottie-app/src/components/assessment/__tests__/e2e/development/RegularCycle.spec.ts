import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage, debugPage } from './test-utils';

test.describe('Regular Cycle Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Regular Cycle path', async ({ page }) => {
    // 1. Age Verification
    console.log('Navigating to:', assessmentPaths.ageVerification);
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    
    // Debug page state
    console.log('After navigation:');
    await debugPage(page);
    
    // Wait for the page title to be visible
    try {
      await page.waitForSelector('h1:has-text("What is your age range?")', { timeout: 10000 });
    } catch (e) {
      console.log('Failed to find title. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-age-verification.png') });
    
    // Select 18-24 years using the radio button (click on the container)
    try {
      await page.locator('.space-y-4 > div:has-text("18-24 years")').click();
    } catch (e) {
      console.log('Failed to click age option. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-age-selected.png') });
    
    // Click continue button when enabled
    await page.locator('button:has-text("Continue"):not([disabled])').click();
    
    // 2. Cycle Length
    await page.waitForURL(`**${assessmentPaths.cycleLength}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-cycle-length.png') });
    
    // Select 26-30 days
    await page.locator('.space-y-3 > div:has-text("26-30 days")').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-cycle-length-selected.png') });
    
    // Click continue
    await page.locator('button:has-text("Continue"):not([disabled])').click();
    
    // 3. Period Duration
    await page.waitForURL(`**${assessmentPaths.periodDuration}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-period-duration.png') });
    
    // Select 4-5 days
    await page.locator('div:has-text("4-5 days")').filter({ hasText: 'days' }).first().click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-period-duration-selected.png') });
    
    // Click continue
    await page.locator('button:has-text("Continue"):not([disabled])').click();
    
    // 4. Flow
    await page.waitForURL(`**${assessmentPaths.flow}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-flow.png') });
    
    // Select Moderate
    await page.locator('div:has-text("Moderate")').filter({ hasText: 'Moderate' }).first().click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-flow-selected.png') });
    
    // Click continue
    await page.locator('button:has-text("Continue"):not([disabled])').click();
    
    // 5. Pain
    await page.waitForURL(`**${assessmentPaths.pain}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-pain.png') });
    
    // Select Mild
    await page.locator('div:has-text("Mild")').filter({ hasText: 'Mild' }).first().click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-pain-selected.png') });
    
    // Click continue
    await page.locator('button:has-text("Continue"):not([disabled])').click();
    
    // 6. Symptoms
    await page.waitForURL(`**${assessmentPaths.symptoms}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-symptoms.png') });
    
    // Select Fatigue
    await page.locator('div:has-text("Fatigue")').filter({ hasText: 'Fatigue' }).first().click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-symptoms-selected.png') });
    
    // Click continue
    await page.locator('button:has-text("Continue"):not([disabled])').click();
    
    // 7. Results
    await page.waitForURL(`**${assessmentPaths.results}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-results-regular-cycle.png') });
  });
}); 