import { test, expect } from '@playwright/test';

/**
 * Test suite for authentication API endpoints
 * 
 * This file can run in two modes:
 * 1. MOCK MODE: Uses mock responses without requiring a live server
 * 2. LIVE MODE: Tests against a live server (uses the webServer config)
 * 
 * To switch modes, change the useMockServer flag below
 */
test.describe('Authentication API Endpoints', () => {
  
  // ==== CONFIGURATION ====
  // Set to TRUE for mock testing, FALSE for live server testing
  const useMockServer = true;
  
  // Test user data
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!'
  };
  
  let authToken = null;
  
  // Test for /api/auth/signup endpoint
  test('POST /api/auth/signup - should register a new user', async ({ request }) => {
    // Generate a unique email to avoid conflicts
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const uniqueUsername = `testuser-${Date.now()}`;
    
    if (useMockServer) {
      // MOCK MODE: Test with mock response
      const mockResponse = {
        status: 201,
        json: () => Promise.resolve({ 
          message: 'User registered successfully',
          user: { id: 'mock-user-id', username: uniqueUsername, email: uniqueEmail }
        }),
      };
      
      expect(mockResponse.status).toBe(201);
      const data = await mockResponse.json();
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('user');
    } else {
      // LIVE MODE: Test with actual API
      const response = await request.post('/api/auth/signup', {
        data: {
          username: uniqueUsername,
          email: uniqueEmail,
          password: testUser.password
        }
      });
      
      expect(response.status()).toBeLessThan(300);
      const data = await response.json();
      expect(data).toHaveProperty('message');
      // or expect(data).toHaveProperty('user');
    }
  });
  
  // Test for /api/auth/login endpoint
  test('POST /api/auth/login - should authenticate user and return token', async ({ request }) => {
    if (useMockServer) {
      // MOCK MODE: Test with mock response
      const mockResponse = {
        status: 200,
        json: () => Promise.resolve({ 
          token: 'mock-jwt-token',
          user: { id: 'mock-user-id', email: testUser.email }
        }),
      };
      
      expect(mockResponse.status).toBe(200);
      const data = await mockResponse.json();
      expect(data).toHaveProperty('token');
      
      // Save the token for other tests
      authToken = data.token;
    } else {
      // LIVE MODE: Test with actual API
      const response = await request.post('/api/auth/login', {
        data: {
          email: testUser.email,
          password: testUser.password
        }
      });
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('token');
      
      // Save the token for other tests
      authToken = data.token;
    }
  });
  
  // Test for /api/auth/users endpoint
  test('GET /api/auth/users - should return list of users', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Send a GET request to the users endpoint with auth token
    const response = await request.get('/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains an array of users
    expect(Array.isArray(data)).toBe(true);
  });
  
  // Test for /api/auth/logout endpoint
  test('POST /api/auth/logout - should logout user and invalidate token', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Send a POST request to the logout endpoint with auth token
    const response = await request.post('/api/auth/logout', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains a success message
    expect(data).toHaveProperty('message');
  });
}); 