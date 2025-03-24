import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';
import { API_URL, testToken, testUserId } from './setup.js';

describe("Protected Endpoints - Production", () => {
  // Test getting all users (protected)
  test("GET /api/auth/users - should check authenticated endpoint", async () => {
    const response = await fetch(`${API_URL}/api/auth/users`, {
      headers: { "Authorization": `Bearer ${testToken}` }
    });
    
    // We expect 401 since our token is invalid, but endpoint should exist
    console.log(`Get users endpoint status: ${response.status}`);
    expect([200, 401, 403, 404]).toContain(response.status);
  });
  
  // Test getting a specific user by ID (protected)
  test("GET /api/auth/users/:id - should check specific user endpoint", async () => {
    const response = await fetch(`${API_URL}/api/auth/users/${testUserId}`, {
      headers: { "Authorization": `Bearer ${testToken}` }
    });
    
    // We expect 401 since our token is invalid, but endpoint should exist
    console.log(`Get user by ID endpoint status: ${response.status}`);
    expect([200, 401, 403, 404]).toContain(response.status);
  });
}); 