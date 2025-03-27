import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestClient, closeTestServer } from '../../../../../test-utilities/setup.js';

// Test data
let server;
let request;

// Setup before all tests
beforeAll(async () => {
  // Setup the test client for local development with a different port
  const setup = await setupTestClient({ port: 5002 });
  server = setup.server;
  request = setup.request;
}, 30000); // Increase timeout

// Cleanup after all tests
afterAll(async () => {
  if (server) {
    await closeTestServer(server);
  }
}, 30000); // Increase timeout

describe('API Health Check (E2E)', () => {
  // Test the API health endpoint
  it('should confirm API is operational', async () => {
    const response = await request.get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('environment');
  });
  
  // Test that authentication is required
  it('should require authentication for user endpoints', async () => {
    // Try to access the users endpoint without authentication
    const response = await request.get('/api/users');
    
    expect(response.status).toBe(401);
  });
}); 