import { test, expect } from '@playwright/test';
import { assessmentData, setupUser } from './api-assessment-setup';

/**
 * Test for DELETE /api/assessment/:id endpoint
 */
test.describe('Assessment API - Delete Assessment', () => {
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
  
  test('DELETE /api/assessment/:id - should delete assessment', async ({ request }) => {
    // Skip this test if no assessment ID is available
    test.skip(!authToken || !assessmentId, 'No auth token or assessment ID available');
    
    // Delete assessment
    const response = await request.delete(`/api/assessment/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful deletion (200 OK or 204 No Content)
    expect(response.status()).toBeLessThan(300);
    
    // If response is not 204, verify it contains a success message
    if (response.status() !== 204) {
      const data = await response.json();
      expect(data).toHaveProperty('message');
    }
    
    // Try to get the deleted assessment - should return 404
    const getResponse = await request.get(`/api/assessment/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(getResponse.status()).toBe(404);
  });
}); 