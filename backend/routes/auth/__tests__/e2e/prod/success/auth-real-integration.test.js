// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';
import { URLS } from '../../../../../../test-utilities/urls.js';

// Constants - Use the real production URL from the urls.js file
const REAL_PROD_API_URL = process.env.REAL_PROD_API_URL || URLS.PROD;

console.log(`Using API URL: ${REAL_PROD_API_URL}`);

// Test data storage
let testUserId;
let testUserEmail;
let testToken;
let testRefreshToken;

// Generate a test user for the real environment
const generateRealTestUser = () => {
  const timestamp = Date.now();
  const username = `testuser_${timestamp}`;
  const email = `test_${timestamp}@example.com`;
  
  return {
    username,
    email,
    password: "TestPassword123!",
    age: "25_34"
  };
};

// Setup before all tests
beforeAll(async () => {
  console.log(`Auth integration test starting - REAL Production environment: ${REAL_PROD_API_URL}`);
}, 5000);

// Cleanup after all tests
afterAll(async () => {
  // Delete the test user if possible
  if (testUserId && testToken) {
    try {
      const response = await fetch(`${REAL_PROD_API_URL}/api/user/${testUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        console.log(`Test user ${testUserEmail} successfully deleted for cleanup`);
      } else {
        console.log(`Failed to delete test user: ${response.status}`);
      }
    } catch (error) {
      console.log(`Error during test user cleanup: ${error.message}`);
    }
  }
  
  console.log('Auth integration test completed - REAL Production environment');
}, 10000);

// Helper to safely parse JSON response
async function getResponseBody(response) {
  try {
    return await response.json();
  } catch (error) {
    console.log('Failed to parse response body as JSON');
    return { error: 'Invalid JSON response' };
  }
}

describe("Auth Success Integration Tests - REAL Production", { tags: ['authentication', 'real-prod', 'integration'] }, () => {
  // Step 1: Register a new user on the real production site
  test("1. Register New User - POST /api/auth/signup", async () => {
    const testUser = generateRealTestUser();
    testUserEmail = testUser.email;
    
    console.log(`Testing signup with email: ${testUserEmail} on real production environment`);
    console.log(`Request URL: ${REAL_PROD_API_URL}/api/auth/signup`);
    console.log(`Request body: ${JSON.stringify(testUser)}`);
    
    let response;
    try {
      response = await fetch(`${REAL_PROD_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      
      console.log(`Signup response status: ${response.status}`);
      
      // Check if we got an error response
      if (response.status !== 201) {
        const errorBody = await getResponseBody(response);
        console.log(`Signup error details:`, errorBody);
        throw new Error(`Signup failed with status ${response.status}: ${JSON.stringify(errorBody)}`);
      }
      
      const data = await getResponseBody(response);
      console.log(`Signup response body:`, data);
      
      testUserId = data.id;
      console.log(`User registered with ID: ${testUserId}`);
      
      expect(data).toHaveProperty('id');
      expect(typeof data.id).toBe('string');
      expect(data.id.length).toBeGreaterThan(0);
    } catch (error) {
      console.error(`Signup request failed: ${error.message}`);
      throw error;
    }
  }, 30000);
  
  // Step 2: Login with the newly created user
  test("2. Login User - POST /api/auth/login", async () => {
    // Skip if user creation failed
    if (!testUserId) {
      console.log('Skipping login test as user creation failed');
      return;
    }
    
    const testUser = {
      email: testUserEmail,
      password: "TestPassword123!"
    };
    
    console.log(`Testing login with email: ${testUserEmail} on real production environment`);
    console.log(`Request URL: ${REAL_PROD_API_URL}/api/auth/login`);
    console.log(`Request body: ${JSON.stringify(testUser)}`);
    
    let response;
    try {
      response = await fetch(`${REAL_PROD_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      
      console.log(`Login response status: ${response.status}`);
      
      // Check if we got an error response
      if (response.status !== 200) {
        const errorBody = await getResponseBody(response);
        console.log(`Login error details:`, errorBody);
        throw new Error(`Login failed with status ${response.status}: ${JSON.stringify(errorBody)}`);
      }
      
      const data = await getResponseBody(response);
      console.log(`Login response body:`, data);
      
      testToken = data.token;
      testRefreshToken = data.refreshToken;
      
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('refreshToken');
      expect(typeof testToken).toBe('string');
      expect(testToken.length).toBeGreaterThan(0);
    } catch (error) {
      console.error(`Login request failed: ${error.message}`);
      throw error;
    }
  }, 30000);
  
  // Run remaining tests only if login succeeded
  test.runIf(() => !!testToken)("3. Verify Token - GET /api/auth/verify", async () => {
    console.log('Testing token verification on real production environment');
    console.log(`Request URL: ${REAL_PROD_API_URL}/api/auth/verify`);
    console.log(`Authorization: Bearer ${testToken}`);
    
    let response;
    try {
      response = await fetch(`${REAL_PROD_API_URL}/api/auth/verify`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Verify response status: ${response.status}`);
      
      const data = await getResponseBody(response);
      console.log(`Verify response body:`, data);
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('authenticated', true);
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('id', testUserId);
    } catch (error) {
      console.error(`Verify request failed: ${error.message}`);
      throw error;
    }
  }, 10000);
  
  test.runIf(() => !!testToken && !!testRefreshToken)("4. Refresh Token - POST /api/auth/refresh", async () => {
    console.log('Testing token refresh on real production environment');
    console.log(`Request URL: ${REAL_PROD_API_URL}/api/auth/refresh`);
    console.log(`Request body: { refreshToken: "${testRefreshToken.substring(0, 10)}..." }`);
    
    let response;
    try {
      response = await fetch(`${REAL_PROD_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: testRefreshToken })
      });
      
      console.log(`Refresh response status: ${response.status}`);
      
      const data = await getResponseBody(response);
      console.log(`Refresh response body:`, data);
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('token');
      
      // Update token for subsequent tests
      if (data.token) {
        testToken = data.token;
      }
    } catch (error) {
      console.error(`Refresh request failed: ${error.message}`);
      throw error;
    }
  }, 10000);
  
  test.runIf(() => !!testToken && !!testRefreshToken)("5. Logout User - POST /api/auth/logout", async () => {
    console.log('Testing user logout on real production environment');
    console.log(`Request URL: ${REAL_PROD_API_URL}/api/auth/logout`);
    console.log(`Authorization: Bearer ${testToken}`);
    
    let response;
    try {
      response = await fetch(`${REAL_PROD_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: testRefreshToken })
      });
      
      console.log(`Logout response status: ${response.status}`);
      
      const data = await getResponseBody(response);
      console.log(`Logout response body:`, data);
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('message');
    } catch (error) {
      console.error(`Logout request failed: ${error.message}`);
      throw error;
    }
  }, 10000);
}); 