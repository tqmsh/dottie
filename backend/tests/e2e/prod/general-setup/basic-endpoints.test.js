import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';
import { API_URL } from './setup.js';

describe("Basic Endpoints - Production", () => {
  // Test the hello endpoint
  test("GET /api/hello - should return Hello World message", async () => {
    const response = await fetch(`${API_URL}/api/hello`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty("message");
    expect(data.message).toBe("Hello World from Dottie API!");
  });

  // Test the db-status endpoint - may return 401 in production
  test("GET /api/db-status - should check database status", async () => {
    console.log('Testing database status endpoint - this may time out...');
    const response = await fetch(`${API_URL}/api/db-status`);
    

    
    // In production, this endpoint may require auth
    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty("status");
      console.log(`Database status: ${data.status}`);
    } else if (response.status === 401) {
      console.log('Database status endpoint requires authentication');
    } else {
      console.log(`Unexpected status from database endpoint: ${response.status}`);
    }
    
    // Verify the response status is among accepted codes (excluding 504)
    expect([200, 401]).toContain(response.status);

        // Check for timeout and skip the test if it occurs
    if (response.status === 504) {
      throw new Error("Database status endpoint timed out - failing test");
    }
  });
}); 