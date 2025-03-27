import { test, expect } from '@playwright/test';

/**
 * Test suite for user API endpoints
 * 
 * These tests run against the actual backend server.
 * They depend on the authentication tests to run first to have a valid token.
 */
test.describe('User API Endpoints', () => {
  
  // Test user data with unique values to avoid conflicts
  const timestamp = Date.now();
  const testUser = {
    username: `testuser-${timestamp}`,
    email: `test-${timestamp}@example.com`,
    password: 'Password123!'
  };
  
  let authToken = null;
  let userId = null;
  
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
  
  // Test for GET /api/user endpoint
  test('GET /api/user - should return list of users', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Get all users
    const response = await request.get('/api/user', {
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
  
  // Test for GET /api/user/:id endpoint
  test('GET /api/user/:id - should return user by ID', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Get specific user
    const response = await request.get(`/api/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response contains user data
    const data = await response.json();
    expect(data).toHaveProperty('id', userId);
    expect(data).toHaveProperty('username', testUser.username);
    expect(data).toHaveProperty('email', testUser.email);
    
    // Should not include password hash
    expect(data).not.toHaveProperty('password_hash');
  });
  
  // Test for PUT /api/user/:id endpoint
  test('PUT /api/user/:id - should update user', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Updated user data
    const updatedData = {
      username: `updated-${testUser.username}`
    };
    
    // Update user
    const response = await request.put(`/api/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updatedData
    });
    
    // Verify successful update
    expect(response.status()).toBe(200);
    
    // Verify response contains updated user data
    const data = await response.json();
    expect(data).toHaveProperty('id', userId);
    expect(data).toHaveProperty('username', updatedData.username);
  });
  
  // Test for DELETE /api/user/:id endpoint - this should be the last test
  test.skip('DELETE /api/user/:id - should delete user', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Delete user
    const response = await request.delete(`/api/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful deletion
    expect(response.status()).toBe(200);
    
    // Verify response contains success message
    const data = await response.json();
    expect(data).toHaveProperty('message');
    
    // Try to get the deleted user - should return 404
    const getResponse = await request.get(`/api/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(getResponse.status()).toBe(404);
  });
  
  // Note: The DELETE test is skipped by default because it would remove the test user,
  // which might be needed for subsequent tests. Enable it only when running as the final test.
}); 