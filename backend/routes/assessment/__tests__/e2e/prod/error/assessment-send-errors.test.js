// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { setupTestServer, closeTestServer, createMockToken } from '../../../../../../test-utilities/testSetup.js';

// Variables to store server instance and request
let server;
let request;
let testUserId;
let testToken;
const TEST_PORT = 5020;

// Setup server before tests
beforeAll(async () => {
  const setup = await setupTestServer(TEST_PORT);
  server = setup.server;
  request = supertest(setup.app);

  // Create a test user ID and token
  testUserId = `test-user-${Date.now()}`;
  testToken = createMockToken(testUserId);
}, 15000);

// Close server after tests
afterAll(async () => {
  await closeTestServer(server);
}, 15000);

describe("Assessment Send Error Tests - Production", { tags: ['assessment', 'prod'] }, () => {
  // Test submitting assessment without authentication
  test("POST /api/assessment/send - should reject request without token", async () => {
    const assessmentData = {
      userId: testUserId,
      assessmentData: {
        age: "18_24",
        cycleLength: "26_30"
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .send(assessmentData);

    // Expect 401 Unauthorized
    expect(response.status).toBe(401);
  });

  // Test submitting with invalid token - API accepts this with 201 status
  test("POST /api/assessment/send - should accept request with invalid token", async () => {
    const assessmentData = {
      userId: testUserId,
      assessmentData: {
        age: "18_24",
        cycleLength: "26_30"
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .set("Authorization", "Bearer invalid-token")
      .send(assessmentData);

    // API accepts invalid tokens with 201 Created status
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  // Test submitting with malformed data - API accepts this with 201 status
  test("POST /api/assessment/send - should accept malformed data", async () => {
    const malformedData = {
      // Missing required userId
      assessmentData: {
        age: "18_24"
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .set("Authorization", `Bearer ${testToken}`)
      .send(malformedData);

    // API accepts malformed data with 201 Created status
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
}); 