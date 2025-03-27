import { test, expect } from '@playwright/test';
import { setupUser } from './api-assessment-setup';

/**
 * Test for GET /api/assessment/list endpoint
 */
test.describe('Assessment API - List Assessments', () => {
  let authToken = null;
  
  // Setup - create user and get auth token
  test.beforeAll(async ({ request }) => {
    const setup = await setupUser(request);
    authToken = setup.authToken;
  });
  
  test('GET /api/assessment/list - should get list of assessments', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Get assessment list
    const response = await request.get('/api/assessment/list', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response is an array
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
}); 