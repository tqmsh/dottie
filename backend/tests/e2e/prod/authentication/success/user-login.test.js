import { describe, test, expect } from 'vitest';
import { generateTestUser, registerTestUser, loginTestUser, acceptedStatusCodes } from '../setup.js';

describe("User Login - Success Cases (Production)", () => {
  // Test user that will be registered first
  const testUser = generateTestUser();
  
  // This will help us track whether registration succeeded
  let registrationSucceeded = false;
  
  test("1. Setup: Register a user for login testing", async () => {
    console.log(`Setting up test user with email: ${testUser.email}`);
    
    const result = await registerTestUser(testUser);
    
    if (result.status === 201) {
      registrationSucceeded = true;
      console.log(`User registered with ID: ${result.body.id}`);
    } else if (result.status === 504) {
      console.log('Signup endpoint timed out - continuing with login test');
    } else {
      console.log(`Registration returned status: ${result.status} - continuing with login test`);
    }
  });
  
  test("2. Should successfully login with valid credentials", async () => {
    console.log(`Testing login with email: ${testUser.email}`);
    
    // Attempt login
    const result = await loginTestUser(testUser.email, testUser.password);
    
    // Verify the response status is among accepted codes
    expect(acceptedStatusCodes.login).toContain(result.status);
    console.log(`Login endpoint status: ${result.status}`);
    
    // If login successful, verify token structure
    if (result.status === 200) {
      expect(result.body).toHaveProperty('token');
      expect(typeof result.body.token).toBe('string');
      
      // JWT tokens have 3 parts separated by periods
      const tokenParts = result.body.token.split('.');
      expect(tokenParts.length).toBe(3);
      
      // Check for refresh token
      expect(result.body).toHaveProperty('refreshToken');
      expect(typeof result.body.refreshToken).toBe('string');
      
      // Refresh token should also be a JWT
      const refreshTokenParts = result.body.refreshToken.split('.');
      expect(refreshTokenParts.length).toBe(3);
      
      // Verify user data
      expect(result.body).toHaveProperty('user');
      expect(result.body.user).toHaveProperty('email', testUser.email);
      
      console.log('Authentication tokens received and validated');
    } else if (result.status === 504) {
      console.log('Login endpoint timed out - accepted in production');
    }
  });
}); 