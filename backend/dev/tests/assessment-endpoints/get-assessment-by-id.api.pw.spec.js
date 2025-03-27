import { test, expect } from '@playwright/test';
import { assessmentData, setupUser } from './api-assessment-setup';

/**
 * Test for GET /api/assessment/:id endpoint
 */
test.describe('Assessment API - Get Assessment by ID', () => {
  let authToken = null;
  let userId = null;
  let assessmentId = null;
  
  // Setup - create user, get auth token, and create an assessment
  test.beforeAll(async ({ request }) => {
    // Setup user
    const setup = await setupUser(request);
    authToken = setup.authToken;
    userId = setup.userId;
    
    // Skip setup if no auth token
    if (!authToken) return;
    
    // Create an assessment to get its ID
    const fullAssessmentData = {
      ...assessmentData,
      userId: userId
    };
    
    const createResponse = await request.post('/api/assessment/send', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: fullAssessmentData
    });
    
    if (createResponse.ok()) {
      const data = await createResponse.json();
      if (data.assessmentId) {
        assessmentId = data.assessmentId;
      } else if (data.id) {
        assessmentId = data.id;
      }
    }
  });
  
  test('GET /api/assessment/:id - should get assessment by ID', async ({ request }) => {
    // Skip this test if no assessment ID is available
    test.skip(!authToken || !assessmentId, 'No auth token or assessment ID available');
    
    // Get specific assessment
    const response = await request.get(`/api/assessment/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response includes correct assessment ID
    const data = await response.json();
    expect(data).toHaveProperty('id', assessmentId);
  });
}); 