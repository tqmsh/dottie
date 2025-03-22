import { test } from '@playwright/test';
import { assessmentPaths, debugPage } from './test-utils';

test.describe('Debug Elements', () => {
  test('debug age verification page elements', async ({ page }) => {
    // Go to the age verification page
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    console.log('Age Verification Page:');
    await debugPage(page);
    
    // Let's try different selectors to click the radio button
    const radioDivs = await page.locator('.space-y-4 > div').all();
    console.log(`Found ${radioDivs.length} radio divs`);
    
    if (radioDivs.length > 2) {
      // Click on the third option (18-24 years)
      await radioDivs[2].click();
      await page.waitForTimeout(1000);
      
      // Check if the button is now enabled
      const continueButton = page.locator('button:has-text("Continue")');
      console.log('Continue button disabled:', await continueButton.isDisabled());
      
      // Try to click it if it's enabled
      if (!await continueButton.isDisabled()) {
        await continueButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Go to cycle length page directly
    await page.goto(assessmentPaths.cycleLength);
    await page.waitForLoadState('networkidle');
    console.log('\nCycle Length Page:');
    await debugPage(page);
    
    // Try clicking on the second option (26-30 days)
    const cycleOptions = await page.locator('.space-y-3 > div').all();
    if (cycleOptions.length > 1) {
      await cycleOptions[1].click();
      await page.waitForTimeout(1000);
    }
  });

  test('debug specific pages', async ({ page }) => {
    // Go to the symptoms page directly to check the radio values
    await page.goto(assessmentPaths.symptoms);
    await page.waitForLoadState('networkidle');
    console.log('Symptoms Page:');
    await debugPage(page);
    
    // Log specific radio values on this page
    const radioButtons = await page.locator('button[role="radio"]').all();
    console.log(`Found ${radioButtons.length} radio buttons on symptoms page`);
    
    for (const radio of radioButtons) {
      const value = await radio.getAttribute('value');
      const id = await radio.getAttribute('id');
      console.log(`Radio value: "${value}", id: "${id}"`);
    }
  });
}); 