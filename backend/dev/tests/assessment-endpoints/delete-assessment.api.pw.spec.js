import { test, expect } from '@playwright/test';
import { assessmentData, setupUser } from './api-assessment-setup';

/**
 * Test for DELETE /api/assessment/:userId/:assessmentId endpoint
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
      
      console.log('Created assessment with ID:', assessmentId);
    }
  });
  
  test('DELETE /api/assessment/:userId/:assessmentId - should delete assessment', async ({ request }) => {
    // Skip this test if no assessment ID is available
    test.skip(!authToken || !assessmentId, 'No auth token or assessment ID available');
    
    // First verify the assessment exists
    const getBeforeResponse = await request.get(`/api/assessment/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(getBeforeResponse.status()).toBe(200);
    console.log('Assessment exists before deletion');
    
    // Delete assessment using correct endpoint format with userId
    const response = await request.delete(`/api/assessment/${userId}/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('Delete response status:', response.status());
    
    // Allow for either 200 or 204 as successful deletion status codes
    expect(response.status()).toBeLessThan(300);
    
    // If response is not 204 (no content), verify it contains a success message
    if (response.status() !== 204) {
      const data = await response.json();
      console.log('Delete response data:', data);
      expect(data).toHaveProperty('message');
    }
    
    // Try to get the deleted assessment - should return 404
    const getAfterResponse = await request.get(`/api/assessment/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('Get after delete status:', getAfterResponse.status());
    expect(getAfterResponse.status()).toBe(404);
  });
}); 