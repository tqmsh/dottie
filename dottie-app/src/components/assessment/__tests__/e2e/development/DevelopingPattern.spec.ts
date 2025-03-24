import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage, setupSessionStorage } from './test-utils';

test.describe('Developing Pattern Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Developing Pattern path', async ({ page }) => {
    // Age Verification
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    
    // Select 13-17 years option
    await page.getByText('13-17 years').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '23-teenage-age-selected.png') });
    
    // Cycle Length - direct navigation
    await page.goto(assessmentPaths.cycleLength);
    await page.waitForLoadState('networkidle');
    
    // Select "I'm not sure"
    await page.getByText("I'm not sure").click();
    
    // Period Duration - direct navigation
    await page.goto(assessmentPaths.periodDuration);
    await page.waitForLoadState('networkidle');
    
    // Select 6-7 days
    await page.getByText('6-7 days').click();
    
    // Flow page - direct navigation
    await page.goto(assessmentPaths.flow);
    await page.waitForLoadState('networkidle');
    
    // Pain page - direct navigation
    await page.goto(assessmentPaths.pain);
    await page.waitForLoadState('networkidle');
    
    // Select Moderate with a more specific selector
    await page.locator('div.font-medium').filter({ hasText: 'Moderate', exact: true }).click();
    
    // Symptoms page - direct navigation
    await page.goto(assessmentPaths.symptoms);
    await page.waitForLoadState('networkidle');
    
    // Select Mood Changes
    await page.getByText('Mood Changes').click();
    
    // Results page - using session storage to simulate completion
    const sessionData = {
      age: '13-17 years',
      cycleLength: "I'm not sure",
      periodDuration: '6-7 days',
      flowLevel: 'Heavy',
      painLevel: 'Moderate',
      symptoms: ['Mood Changes']
    };
    
    await setupSessionStorage(page, sessionData);
    
    await page.goto(assessmentPaths.results);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '24-results-developing-pattern.png') });
  });
}); 