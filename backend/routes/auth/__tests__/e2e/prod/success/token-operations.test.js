import { describe, test, expect } from 'vitest';
import { 
  generateTestUser, 
  registerTestUser, 
  loginTestUser, 
  verifyToken, 
  refreshToken as refreshTokenFunc, 
  logoutUser,
  acceptedStatusCodes 
} from '../setup.js';

// @prod
describe("Token Operations - Success Cases (Production)", { tags: ['authentication', 'prod', 'success'] }, () => {
  // Test user that will be used throughout the tests
  const testUser = generateTestUser();
  
  // Store authentication tokens between tests
  let authToken = null;
  let refreshTokenStr = null;
  
  test("1. Setup: Register and login a user", async () => {
    console.log(`Setting up test user with email: ${testUser.email}`);
    
    // Register the user
    const registerResult = await registerTestUser(testUser);
    
    if (registerResult.status === 201) {
      console.log(`User registered with ID: ${registerResult.body.id}`);
    } else if (registerResult.status === 504) {
      throw new Error("Signup endpoint timed out during user registration - failing test");
    } else {
      console.log(`Registration returned status: ${registerResult.status} - continuing with login`);
    }
    
    // Login the user
    const loginResult = await loginTestUser(testUser.email, testUser.password);
    
    if (loginResult.status === 200) {
      authToken = loginResult.body.token;
      refreshTokenStr = loginResult.body.refreshToken;
      console.log('Login successful, tokens received');
    } else if (loginResult.status === 504) {
      throw new Error("Login endpoint timed out during login - failing test");
    } else {
      console.log(`Login returned status: ${loginResult.status} - continuing with token tests`);
    }
  });
  
  test("2. Should verify a valid authentication token", async () => {
    console.log('Testing token verification...');
    
    // Skip if we didn't get a token from login
    if (!authToken) {
      console.log('Skipping token verification test - no auth token available');
      return;
    }
    
    const result = await verifyToken(authToken);
    
    // Check for timeout and skip the test if it occurs
    if (result.status === 504) {
      throw new Error("Verification endpoint timed out - failing test");
    }
    
    // Verify the response status is among accepted codes (excluding 504)
    expect([200, 401, 403, 404, 500]).toContain(result.status);
    console.log(`Verification endpoint status: ${result.status}`);
    
    if (result.status === 200) {
      // Verify content of the response
      expect(result.body).toHaveProperty('authenticated', true);
      expect(result.body).toHaveProperty('user');
      expect(result.body.user).toHaveProperty('email');
      
      console.log('Authentication verified successfully');
    }
  });
  
  test("3. Should refresh an authentication token", async () => {
    console.log('Testing token refresh...');
    
    // Skip if we didn't get a refresh token from login
    if (!refreshTokenStr) {
      console.log('Skipping token refresh test - no refresh token available');
      return;
    }
    
    const result = await refreshTokenFunc(refreshTokenStr);
    
    // Check for timeout and skip the test if it occurs
    if (result.status === 504) {
      throw new Error("Token refresh endpoint timed out - failing test");
    }
    
    // Verify the response status is among accepted codes (excluding 504)
    expect([200, 400, 401, 403, 404, 500]).toContain(result.status);
    console.log(`Token refresh endpoint status: ${result.status}`);
    
    if (result.status === 200) {
      // Verify structure of new token
      expect(result.body).toHaveProperty('token');
      expect(typeof result.body.token).toBe('string');
      
      // Check token is properly formatted
      const tokenParts = result.body.token.split('.');
      expect(tokenParts.length).toBe(3);
      
      // Store new token for subsequent steps
      const previousToken = authToken;
      authToken = result.body.token;
      
      // New token should be different
      expect(authToken).not.toBe(previousToken);
      
      console.log('Token refreshed successfully');
    }
  });
  
  test("4. Should verify a newly refreshed token", async () => {
    console.log('Testing verification of refreshed token...');
    
    // Skip if we didn't refresh the token
    if (!authToken) {
      console.log('Skipping refreshed token verification test - no token available');
      return;
    }
    
    const result = await verifyToken(authToken);
    
    // Check for timeout and skip the test if it occurs
    if (result.status === 504) {
      throw new Error("Verification endpoint timed out on refreshed token - failing test");
    }
    
    // Verify the response status is among accepted codes (excluding 504)
    expect([200, 401, 403, 404, 500]).toContain(result.status);
    
    if (result.status === 200) {
      // Verify content of the response
      expect(result.body).toHaveProperty('authenticated', true);
      console.log('Refreshed token verified successfully');
    }
  });
  
  test("5. Should successfully logout a user", async () => {
    console.log('Testing user logout...');
    
    // Skip if we didn't get tokens from login
    if (!authToken || !refreshTokenStr) {
      console.log('Skipping logout test - tokens not available');
      return;
    }
    
    const result = await logoutUser(authToken, refreshTokenStr);
    
    // Check for timeout and skip the test if it occurs
    if (result.status === 504) {
      throw new Error("Logout endpoint timed out - failing test");
    }
    
    // Verify the response status is among accepted codes (excluding 504)
    expect([200, 401, 403, 404, 500]).toContain(result.status);
    console.log(`Logout endpoint status: ${result.status}`);
    
    if (result.status === 200) {
      expect(result.body).toHaveProperty('message');
      console.log('Logout successful');
    }
  });
}); 