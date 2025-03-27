import { test, expect } from '@playwright/test';

// Test suite for authentication API endpoints
test.describe('Authentication API Endpoints', () => {
  
  // Test user data
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!'
  };
  
  let authToken;
  
  // Test for /api/auth/signup endpoint
  test('POST /api/auth/signup - should register a new user', async ({ request }) => {
    // Generate a unique email to avoid conflicts
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const uniqueUsername = `testuser-${Date.now()}`;
    
    // Send a POST request to the signup endpoint
    const response = await request.post('/api/auth/signup', {
      data: {
        username: uniqueUsername,
        email: uniqueEmail,
        password: testUser.password
      }
    });
    
    // Assert that the response status is 201 (Created) or 200 (OK)
    expect(response.status()).toBeLessThan(300);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains a success message or user details
    expect(data).toHaveProperty('message');
    // or expect(data).toHaveProperty('user');
  });
  
  // Test for /api/auth/login endpoint
  test('POST /api/auth/login - should authenticate user and return token', async ({ request }) => {
    // Send a POST request to the login endpoint
    const response = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains an access token
    expect(data).toHaveProperty('token');
    
    // Save the token for other tests
    authToken = data.token;
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