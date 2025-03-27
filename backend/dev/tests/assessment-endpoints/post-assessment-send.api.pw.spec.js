import { test, expect } from '@playwright/test';
import { testUser, assessmentData, setupUser } from './api-assessment-setup';

/**
 * Test for POST /api/assessment/send endpoint
 */
test.describe('Assessment API - Send Assessment', () => {
  let authToken = null;
  let userId = null;
  let assessmentId = null;
  
  // Setup - create user and get auth token
  test.beforeAll(async ({ request }) => {
    const setup = await setupUser(request);
    authToken = setup.authToken;
    userId = setup.userId;
  });
  
  test('POST /api/assessment/send - should send assessment data', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Add user ID to assessment data
    const fullAssessmentData = {
      ...assessmentData,
      userId: userId
    };
    
    // Send assessment data
    const response = await request.post('/api/assessment/send', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: fullAssessmentData
    });
    
    // Verify successful submission
    expect(response.status()).toBeLessThan(300);
    
    // Verify response includes assessment ID (could be 'id' or 'assessmentId')
    const data = await response.json();
    
    if (data.assessmentId) {
      // If API returns assessmentId
      expect(data).toHaveProperty('assessmentId');
      assessmentId = data.assessmentId;
    } else if (data.id) {
      // If API returns id
      expect(data).toHaveProperty('id');
      assessmentId = data.id;
    } else {
      // If neither property exists, fail test
      expect(data).toHaveProperty('id');
    }
  });
}); 