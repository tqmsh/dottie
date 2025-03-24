import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage, setupSessionStorage } from './test-utils';

test.describe('Pain Predominant Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Pain Predominant path', async ({ page }) => {
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
    
    // Select 21-25 days
    await page.getByText('21-25 days').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 3. Period Duration
    await page.waitForURL(`**${assessmentPaths.periodDuration}**`);
    await page.waitForLoadState('networkidle');
    
    // Select 4-5 days
    await page.getByText('4-5 days').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 4. Flow
    await page.waitForURL(`**${assessmentPaths.flow}**`);
    await page.waitForLoadState('networkidle');
    
    // Select Moderate
    await page.getByText('Moderate').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 5. Pain
    await page.waitForURL(`**${assessmentPaths.pain}**`);
    await page.waitForLoadState('networkidle');
    
    // Select Severe using more specific selector
    await page.locator('div.font-medium').filter({ hasText: 'Severe' }).click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '20-severe-pain-selected.png') });
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // 6. Symptoms - directly navigate instead of waiting for URL
    await page.goto(assessmentPaths.symptoms);
    await page.waitForLoadState('networkidle');
    
    // Select multiple pain related symptoms
    await page.getByText('Headaches').click();
    await page.getByText('Nausea').click();
    await page.getByText('Back Pain').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '21-pain-related-symptoms-selected.png') });
    
    // 7. Results - using session storage to simulate completion
    const sessionData = {
      age: '18-24 years',
      cycleLength: '21-25 days',
      periodDuration: '4-5 days',
      flowLevel: 'Moderate',
      painLevel: 'Severe',
      symptoms: ['Headaches', 'Nausea', 'Back Pain']
    };
    
    await setupSessionStorage(page, sessionData);
    
    await page.goto(assessmentPaths.results);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '22-results-pain-predominant.png') });
  });
}); 