import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestClient, closeTestServer } from '../../../../../test-utilities/setup.js';

// Test data
let server;
let request;

// Setup before all tests
beforeAll(async () => {
  // Setup the test client for local development with a different port
  const setup = await setupTestClient({ port: 5003 });
  server = setup.server;
  request = setup.request;
}, 30000); // Increased timeout

// Cleanup after all tests
afterAll(async () => {
  if (server) {
    await closeTestServer(server);
  }
}, 30000); // Increased timeout

describe('User API Error Handling (E2E)', () => {
  // Test authentication errors
  it('should require authentication for user operations', async () => {
    // Try to get all users without authentication
    const getAllResponse = await request.get('/api/users');
    expect(getAllResponse.status).toBe(401);
    expect(getAllResponse.body).toHaveProperty('error');
    
    // Try to get a specific user without authentication
    const getUserResponse = await request.get('/api/users/test-id');
    expect(getUserResponse.status).toBe(401);
    expect(getUserResponse.body).toHaveProperty('error');
    
    // Try to update a user without authentication
    const updateResponse = await request
      .put('/api/users/test-id')
      .send({ username: 'newname' });
    expect(updateResponse.status).toBe(401);
    expect(updateResponse.body).toHaveProperty('error');
    
    // Try to delete a user without authentication
    const deleteResponse = await request.delete('/api/users/test-id');
    expect(deleteResponse.status).toBe(401);
    expect(deleteResponse.body).toHaveProperty('error');
  });
}); 