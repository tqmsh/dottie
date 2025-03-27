import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { setupTestServer, closeTestServer } from '../../../../../../test-utilities/testSetup.js';

// Variables to store server instance and request
let server;
let request;
const TEST_PORT = 5017;

// Setup server before tests
beforeAll(async () => {
  const setup = await setupTestServer(TEST_PORT);
  server = setup.server;
  request = supertest(setup.app);
}, 15000);

// Close server after tests
afterAll(async () => {
  await closeTestServer(server);
}, 15000);

// @prod
describe("Assessment List Endpoint (Errors) - Production", { tags: ['assessment', 'prod'] }, () => {
  test("GET /api/assessment/list - should require authentication", async () => {
    // Test without authentication token
    const response = await request.get("/api/assessment/list");
    
    console.log(`Assessment list without auth endpoint status: ${response.status}`);
    
    // Should require authentication
    expect(response.status).toBe(401);
  });
  
  test("GET /api/assessment/list - should reject invalid tokens", async () => {
    // Test with invalid authentication token
    const invalidToken = "invalid.token.format";
    const response = await request
      .get("/api/assessment/list")
      .set("Authorization", `Bearer ${invalidToken}`);
    
    console.log(`Assessment list with invalid token status: ${response.status}`);
    
    // API now rejects invalid tokens with 401
    expect(response.status).toBe(401);
  });
}); 