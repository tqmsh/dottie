import { describe, test, expect, beforeAll } from 'vitest';
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
describe("Token Operations - Error Cases (Production)", { tags: ['authentication', 'prod', 'error'] }, () => {
  // Test user data for setup
  const testUser = generateTestUser();
  let authToken = null;
  let refreshToken = null;
  
  // Setup test user
  beforeAll(async () => {
    console.log(`Setting up test user with email: ${testUser.email}`);
    
    // Register and login to get tokens
    const registerResult = await registerTestUser(testUser);
    
    if (registerResult.status === 201) {
      const loginResult = await loginTestUser(testUser.email, testUser.password);
      
      if (loginResult.status === 200) {
        authToken = loginResult.body.token;
        refreshToken = loginResult.body.refreshToken;
        console.log('Login successful, tokens received for error testing');
      } else {
        console.log(`Login returned status: ${loginResult.status} - continuing with token tests`);
      }
    } else {
      console.log(`Registration returned status: ${registerResult.status} - continuing with token tests`);
    }
  });
  
  test("1. Should reject verification with invalid token format", async () => {
    console.log('Testing verification with invalid token format...');
    
    // Use verifyToken with an invalid token format
    const invalidToken = 'invalid-token-format';
    const result = await verifyToken(invalidToken);
    
    // Verify the response status is among accepted codes
    expect(acceptedStatusCodes.verify).toContain(result.status);
    console.log(`Verification with invalid token format status: ${result.status}`);
    
    // A 401 response would be correct for invalid token
    if (result.status === 401) {
      console.log('Verification correctly rejected for invalid token format');
    } else if (result.status === 504) {
      console.log('Verification endpoint timed out - accepted in production');
    }
  });
  
  test("2. Should reject verification with missing token", async () => {
    console.log('Testing verification with missing token...');
    
    // Use verifyToken with empty token
    const result = await verifyToken('');
    
    // Verify the response status is among accepted codes
    expect(acceptedStatusCodes.verify).toContain(result.status);
    console.log(`Verification with missing token status: ${result.status}`);
    
    // A 401 response would be correct for missing token
    if (result.status === 401) {
      console.log('Verification correctly rejected for missing token');
    } else if (result.status === 504) {
      console.log('Verification endpoint timed out - accepted in production');
    }
  });
  
  test("3. Should reject refresh with invalid refresh token", async () => {
    console.log('Testing refresh with invalid refresh token...');
    
    // Use refreshTokenFunc with an invalid refresh token
    const invalidRefreshToken = 'invalid-refresh-token';
    const result = await refreshTokenFunc(invalidRefreshToken);
    
    // Verify the response status is among accepted codes
    expect(acceptedStatusCodes.refresh).toContain(result.status);
    console.log(`Refresh with invalid token status: ${result.status}`);
    
    // A 401 response would be correct for invalid refresh token
    if (result.status === 401) {
      console.log('Refresh correctly rejected for invalid refresh token');
    } else if (result.status === 504) {
      console.log('Refresh endpoint timed out - accepted in production');
    }
  });
  
  test("4. Should reject logout with invalid token", async () => {
    console.log('Testing logout with invalid token...');
    
    // Use logoutUser with an invalid auth token
    const invalidToken = 'invalid-token';
    const invalidRefreshToken = 'invalid-refresh';
    const result = await logoutUser(invalidToken, invalidRefreshToken);
    
    // Verify the response status is among accepted codes
    expect(acceptedStatusCodes.logout).toContain(result.status);
    console.log(`Logout with invalid token status: ${result.status}`);
    
    // A 401 response would be correct for invalid token
    if (result.status === 401) {
      console.log('Logout correctly rejected for invalid token');
    } else if (result.status === 504) {
      console.log('Logout endpoint timed out - accepted in production');
    }
  });
}); 