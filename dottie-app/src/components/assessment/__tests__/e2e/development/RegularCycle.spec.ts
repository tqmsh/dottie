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
    
    // Select 18-24 years by clicking the entire option container
    try {
      // Click on the entire radio container for 18-24 years
      await page.locator('div.space-y-4 > div').nth(2).click();
      // Ensure it's selected by waiting for the radio to be checked
      await page.waitForTimeout(500);
    } catch (e) {
      console.log('Failed to click age option. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-age-selected.png') });
    
    // Wait for Continue button to be enabled and click it
    try {
      await page.waitForSelector('button:has-text("Continue"):not([disabled])', { timeout: 5000 });
      await page.locator('button:has-text("Continue")').click();
    } catch (e) {
      console.log('Failed to click continue button. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    // 2. Cycle Length
    try {
      await page.waitForURL(`**${assessmentPaths.cycleLength}**`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-cycle-length.png') });
      
      // Select 26-30 days - click the second option
      await page.locator('div.space-y-3 > div').nth(1).click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-cycle-length-selected.png') });
      
      // Click continue
      await page.waitForSelector('button:has-text("Continue"):not([disabled])', { timeout: 5000 });
      await page.locator('button:has-text("Continue")').click();
    } catch (e) {
      console.log('Failed in cycle length section. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    // 3. Period Duration
    try {
      await page.waitForURL(`**${assessmentPaths.periodDuration}**`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-period-duration.png') });
      
      // Select 4-5 days - click appropriate option
      await page.locator('div:has-text("4-5 days")').nth(0).click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-period-duration-selected.png') });
      
      // Click continue
      await page.waitForSelector('button:has-text("Continue"):not([disabled])', { timeout: 5000 });
      await page.locator('button:has-text("Continue")').click();
    } catch (e) {
      console.log('Failed in period duration section. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    // 4. Flow
    try {
      await page.waitForURL(`**${assessmentPaths.flow}**`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-flow.png') });
      
      // Select Moderate - click appropriate option
      await page.locator('div:has-text("Moderate")').nth(0).click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-flow-selected.png') });
      
      // Click continue
      await page.waitForSelector('button:has-text("Continue"):not([disabled])', { timeout: 5000 });
      await page.locator('button:has-text("Continue")').click();
    } catch (e) {
      console.log('Failed in flow section. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    // 5. Pain
    try {
      await page.waitForURL(`**${assessmentPaths.pain}**`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-pain.png') });
      
      // Select Mild - click appropriate option
      await page.locator('div:has-text("Mild")').nth(0).click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-pain-selected.png') });
      
      // Click continue
      await page.waitForSelector('button:has-text("Continue"):not([disabled])', { timeout: 5000 });
      await page.locator('button:has-text("Continue")').click();
    } catch (e) {
      console.log('Failed in pain section. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    // 6. Symptoms
    try {
      await page.waitForURL(`**${assessmentPaths.symptoms}**`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-symptoms.png') });
      
      // Select Fatigue - click appropriate option
      await page.locator('div:has-text("Fatigue")').nth(0).click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-symptoms-selected.png') });
      
      // Click continue
      await page.waitForSelector('button:has-text("Continue"):not([disabled])', { timeout: 5000 });
      await page.locator('button:has-text("Continue")').click();
    } catch (e) {
      console.log('Failed in symptoms section. Current page state:');
      await debugPage(page);
      throw e;
    }
    
    // 7. Results
    try {
      await page.waitForURL(`**${assessmentPaths.results}**`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-results-regular-cycle.png') });
      console.log('Test completed successfully!');
    } catch (e) {
      console.log('Failed in results section. Current page state:');
      await debugPage(page);
      throw e;
    }
  });
}); 