import { test, expect } from '@playwright/test';

// Test suite for assessment API endpoints
test.describe('Assessment API Endpoints', () => {
  
  // Test user data for authentication
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!'
  };
  
  // Sample assessment data
  const assessmentData = {
    userId: '',
    assessmentData: {
      age: "18_24",
      cycleLength: "26_30",
      periodDuration: "4_5",
      flowHeaviness: "moderate",
      painLevel: "moderate",
      symptoms: {
        physical: ["Bloating", "Headaches"],
        emotional: ["Mood swings", "Irritability"]
      }
    }
  };
  
  let authToken;
  let createdAssessmentId;
  
  // Setup - get auth token
  test.beforeAll(async ({ request }) => {
    // Login to get auth token
    try {
      const response = await request.post('/api/auth/login', {
        data: testUser
      });
      
      if (response.status() === 200) {
        const data = await response.json();
        authToken = data.token;
        
        // If we have a userId from auth, use it
        if (data.user && data.user.id) {
          assessmentData.userId = data.user.id;
        }
      }
    } catch (error) {
      console.log('Setup failed:', error.message);
      // Continue tests anyway, they will be skipped if no token
    }
  });
  
  // Test for /api/assessment/send endpoint
  test('POST /api/assessment/send - should send assessment data', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Send a POST request to the assessment/send endpoint
    const response = await request.post('/api/assessment/send', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: assessmentData
    });
    
    // Assert that the response status is 201 (Created) or 200 (OK)
    expect(response.status()).toBeLessThan(300);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains an assessment ID
    expect(data).toHaveProperty('assessmentId');
    
    // Save the assessment ID for later tests
    createdAssessmentId = data.assessmentId;
  });
  
  // Test for /api/assessment/list endpoint
  test('GET /api/assessment/list - should get list of assessments', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Send a GET request to the assessment/list endpoint
    const response = await request.get('/api/assessment/list', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response is an array
    expect(Array.isArray(data)).toBe(true);
  });
  
  // Test for /api/assessment/:id endpoint - GET
  test('GET /api/assessment/:id - should get assessment by ID', async ({ request }) => {
    // Skip this test if no assessment ID is available
    test.skip(!createdAssessmentId, 'No assessment ID available');
    
    // Send a GET request to get a specific assessment
    const response = await request.get(`/api/assessment/${createdAssessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains the assessment data
    expect(data).toHaveProperty('id', createdAssessmentId);
  });
  
  // Test for /api/assessment/:id endpoint - PUT
  test('PUT /api/assessment/:id - should update assessment', async ({ request }) => {
    // Skip this test if no assessment ID is available
    test.skip(!createdAssessmentId, 'No assessment ID available');
    
    // Updated assessment data
    const updatedData = {
      assessmentData: {
        ...assessmentData.assessmentData,
        flowHeaviness: "heavy",
        painLevel: "severe"
      }
    };
    
    // Send a PUT request to update a specific assessment
    const response = await request.put(`/api/assessment/${createdAssessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updatedData
    });
    
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains a success message or updated assessment
    expect(data).toHaveProperty('message');
    // or expect(data).toHaveProperty('id', createdAssessmentId);
  });
  
  // Test for /api/assessment/:id endpoint - DELETE
  test('DELETE /api/assessment/:id - should delete assessment', async ({ request }) => {
    // Skip this test if no assessment ID is available
    test.skip(!createdAssessmentId, 'No assessment ID available');
    
    // Send a DELETE request to delete a specific assessment
    const response = await request.delete(`/api/assessment/${createdAssessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Assert that the response status is 200 (OK) or 204 (No Content)
    expect(response.status()).toBeLessThan(300);
    
    // Parse the response JSON if not 204
    if (response.status() !== 204) {
      const data = await response.json();
      // Assert that the response contains a success message
      expect(data).toHaveProperty('message');
    }
  });
}); 