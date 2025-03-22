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
    
    // Select 18-24 years by clicking the radio button directly
    try {
      await page.locator('button[role="radio"][value="18-24"]').click();
      await page.waitForTimeout(500);
    } catch (e) {
      console.log('Failed to click age option. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-age-selected.png') });
    
    // Click continue button once it's enabled
    await page.waitForSelector('a[href="/assessment/cycle-length"] button', { timeout: 5000 });
    await page.locator('a[href="/assessment/cycle-length"] button').click();
    
    // 2. Cycle Length
    await page.waitForURL(`**${assessmentPaths.cycleLength}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-cycle-length.png') });
    
    // Select 26-30 days
    await page.locator('button[role="radio"][value="26-30"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-cycle-length-selected.png') });
    
    // Click continue
    await page.waitForSelector('a[href="/assessment/period-duration"] button', { timeout: 5000 });
    await page.locator('a[href="/assessment/period-duration"] button').click();
    
    // 3. Period Duration
    await page.waitForURL(`**${assessmentPaths.periodDuration}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-period-duration.png') });
    
    // Select 4-5 days
    await page.locator('button[role="radio"][value="4-5"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-period-duration-selected.png') });
    
    // Click continue
    await page.waitForSelector('a[href="/assessment/flow"] button', { timeout: 5000 });
    await page.locator('a[href="/assessment/flow"] button').click();
    
    // 4. Flow
    await page.waitForURL(`**${assessmentPaths.flow}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-flow.png') });
    
    // Select Moderate
    await page.locator('button[role="radio"][value="moderate"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-flow-selected.png') });
    
    // Click continue
    await page.waitForSelector('a[href="/assessment/pain"] button', { timeout: 5000 });
    await page.locator('a[href="/assessment/pain"] button').click();
    
    // 5. Pain
    await page.waitForURL(`**${assessmentPaths.pain}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-pain.png') });
    
    // Select Mild
    await page.locator('button[role="radio"][value="mild"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-pain-selected.png') });
    
    // Click continue
    await page.waitForSelector('a[href="/assessment/symptoms"] button', { timeout: 5000 });
    await page.locator('a[href="/assessment/symptoms"] button').click();
    
    // 6. Symptoms
    await page.waitForURL(`**${assessmentPaths.symptoms}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-symptoms.png') });
    
    // Select Fatigue - adding additional logging and fallback methods
    console.log('Trying to select symptom: Fatigue');
    
    // Wait for the symptoms page to be fully loaded with its checkboxes
    await page.waitForSelector('button[role="checkbox"]', { timeout: 10000 });
    
    try {
      // First try to click the checkbox directly
      const fatigueCheckbox = page.locator('button[role="checkbox"][id="physical-fatigue"]');
      await fatigueCheckbox.waitFor({ state: 'visible', timeout: 5000 });
      await fatigueCheckbox.click();
    } catch (e) {
      console.log('Failed to click the checkbox directly, trying to click the containing div');
      // Try clicking the label/container instead
      const fatigueContainer = page.locator('label:has-text("Fatigue")').first();
      await fatigueContainer.waitFor({ state: 'visible', timeout: 5000 });
      await fatigueContainer.click();
    }
    
    await page.waitForTimeout(1000); // Longer wait to ensure selection is registered
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-symptoms-selected.png') });
    
    // Ensure the Complete Assessment button is visible and clickable
    const completeButton = page.locator('button:has-text("Complete Assessment")');
    await completeButton.waitFor({ state: 'visible', timeout: 10000 });
    await completeButton.click();
    
    // 7. Results
    await page.waitForURL(`**${assessmentPaths.results}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-results-regular-cycle.png') });
    console.log('Test completed successfully!');
  });
}); 