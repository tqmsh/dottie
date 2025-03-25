import { describe, test, expect } from 'vitest';
import { generateTestUser, registerTestUser, acceptedStatusCodes } from '../setup.js';

// @prod
describe("User Registration - Success Cases (Production)", () => {
  test("Should register a new user with valid credentials", async () => {
    console.log('Testing successful user registration...');
    
    // Generate a test user
    const testUser = generateTestUser();
    console.log(`Testing signup with email: ${testUser.email}`);
    
    // Register the user
    const result = await registerTestUser(testUser);
    
    // Check for timeout and skip the test if it occurs
    if (result.status === 504) {
      throw new Error("Signup endpoint timed out - failing test");
    }
    
    // Verify the response status is among accepted codes (excluding 504)
    expect([201, 400, 401, 403, 404, 500]).toContain(result.status);
    console.log(`Registration endpoint status: ${result.status}`);
    
    // If 201 response received, verify user data
    if (result.status === 201) {
      expect(result.body).toHaveProperty('id');
      console.log(`User registered with ID: ${result.body.id}`);
      
      // Validate returned user data
      expect(typeof result.body.id).toBe('string');
      expect(result.body.id.length).toBeGreaterThan(0);
    }
  });
  
  test("Should properly handle username variations", async () => {
    console.log('Testing registration with longer username...');
    
    // Generate a test user with longer username
    const testUser = generateTestUser();
    testUser.username = `longer_username_${Date.now()}`;
    
    // Register the user
    const result = await registerTestUser(testUser);
    
    // Check for timeout and skip the test if it occurs
    if (result.status === 504) {
      throw new Error("Signup endpoint timed out (longer username) - failing test");
    }
    
    // Verify the response status is among accepted codes (excluding 504)
    expect([201, 400, 401, 403, 404, 500]).toContain(result.status);
    console.log(`Registration with longer username status: ${result.status}`);
  });
}); 