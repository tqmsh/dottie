import { test, expect } from '@playwright/test';

/**
 * Test suite for assessment API endpoints
 * 
 * These tests run against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */
test.describe('Assessment API Endpoints', () => {
  
  // Test user data with unique values to avoid conflicts
  const timestamp = Date.now();
  const testUser = {
    username: `assessuser-${timestamp}`,
    email: `assess-${timestamp}@example.com`,
    password: 'Password123!'
  };
  
  // Sample assessment data
  const assessmentData = {
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
  
  let authToken = null;
  let userId = null;
  let assessmentId = null;
  
  // Setup - create user and get auth token
  test.beforeAll(async ({ request }) => {
    // Create a new user
    const signupResponse = await request.post('/api/auth/signup', {
      data: testUser
    });
    
    if (signupResponse.ok()) {
      const signupData = await signupResponse.json();
      if (signupData.user && signupData.user.id) {
        userId = signupData.user.id;
      }
      
      // Login to get auth token
      const loginResponse = await request.post('/api/auth/login', {
        data: {
          email: testUser.email,
          password: testUser.password
        }
      });
      
      if (loginResponse.ok()) {
        const loginData = await loginResponse.json();
        authToken = loginData.token;
        
        if (loginData.user && loginData.user.id && !userId) {
          userId = loginData.user.id;
        }
      }
    }
  });
  
  // Test for /api/assessment/send endpoint
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
    
    // Verify response includes assessment ID
    const data = await response.json();
    expect(data).toHaveProperty('assessmentId');
    
    // Save assessment ID for subsequent tests
    assessmentId = data.assessmentId;
  });
  
  // Test for /api/assessment/list endpoint
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
  
  // Test for /api/assessment/:id endpoint - GET
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
  
  // Test for /api/assessment/:id endpoint - PUT
  test('PUT /api/assessment/:id - should update assessment', async ({ request }) => {
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
    
    // Update assessment
    const response = await request.put(`/api/assessment/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updatedData
    });
    
    // Verify successful update
    expect(response.status()).toBe(200);
    
    // Verify response contains success message or updated assessment
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });
  
  // Test for /api/assessment/:id endpoint - DELETE
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
  });
}); 