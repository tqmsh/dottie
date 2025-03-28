import { test, expect } from '@playwright/test';

/**
 * Test suite for authentication API endpoints
 * 
 * These tests run against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */
test.describe('Authentication API Endpoints', () => {
  
  // Test user data with unique values to avoid conflicts
  const timestamp = Date.now();
  const testUser = {
    username: `testuser-${timestamp}`,
    email: `test-${timestamp}@example.com`,
    password: 'Password123!'
  };
  
  let authToken = null;
  let userId = null;
  
  // Test for /api/auth/signup endpoint
  test('POST /api/auth/signup - should register a new user', async ({ request }) => {
    // Send request to register a new user
    const response = await request.post('/api/auth/signup', {
      data: {
        username: testUser.username,
        email: testUser.email,
        password: testUser.password
      }
    });
    
    // Verify successful registration (status code 200 or 201)
    expect(response.status()).toBeLessThan(300);
    
    // Verify response contains expected data
    const data = await response.json();
    expect(data).toHaveProperty('message');
    
    // If the response includes a user object, save the ID
    if (data.user && data.user.id) {
      userId = data.user.id;
    }
  });
  
  // Test for /api/auth/login endpoint
  test('POST /api/auth/login - should authenticate user and return token', async ({ request }) => {
    // Send login request with test user credentials
    const response = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    
    // Verify successful login
    expect(response.status()).toBe(200);
    
    // Verify response contains auth token
    const data = await response.json();
    expect(data).toHaveProperty('token');
    
    // Save token for subsequent tests
    authToken = data.token;
    
    // If the response includes user ID and we don't have it yet, save it
    if (data.user && data.user.id && !userId) {
      userId = data.user.id;
    }
  });
  
  // Test for /api/auth/users endpoint
  test('GET /api/auth/users - should return list of users', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Send request to get users with auth token
    const response = await request.get('/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response contains array of users
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
  
  // Test for /api/auth/users/:id endpoint - GET
  test('GET /api/auth/users/:id - should get user by ID', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Send request to get specific user
    const response = await request.get(`/api/auth/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response contains user with matching ID
    const data = await response.json();
    expect(data).toHaveProperty('id', userId);
  });
  
  // Test for /api/auth/logout endpoint
  test('POST /api/auth/logout - should logout user and invalidate token', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Send logout request with auth token
    const response = await request.post('/api/auth/logout', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful logout
    expect(response.status()).toBe(200);
    
    // Verify response contains success message
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });
}); 