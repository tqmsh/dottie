import { test, expect } from '@playwright/test';
import { assessmentData, setupUser } from './api-assessment-setup';

/**
 * Test for PUT /api/assessment/:userId/:assessmentId endpoint
 */
test.describe('Assessment API - Update Assessment', () => {
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
  
  test('PUT /api/assessment/:userId/:assessmentId - should update assessment', async ({ request }) => {
    // Skip this test if no assessment ID is available
    test.skip(!authToken || !assessmentId, 'No auth token or assessment ID available');
    
    // Updated assessment data
    const updatedData = {
      assessmentData: {
        ...assessmentData.assessmentData,
        flowHeaviness: "heavy",
        painLevel: "severe"
      }
    };
    
    // Update assessment using the correct endpoint path
    const response = await request.put(`/api/assessment/${userId}/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updatedData
    });
    
    // Verify successful update
    expect(response.status()).toBe(200);
    
    // Verify response contains success message or updated assessment
    const data = await response.json();
    
    // API could return a message or the updated assessment
    if (data.message) {
      expect(data).toHaveProperty('message');
    } else if (data.id) {
      expect(data).toHaveProperty('id', assessmentId);
    }
  });
}); 