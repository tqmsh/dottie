// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { setupTestServer, closeTestServer, createMockToken } from '../../../../../../test-utilities/testSetup.js';

// Variables to store server instance and request
let server;
let request;
let testUserId;
let testToken;
const TEST_PORT = 5010;

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

describe("Assessment Send Endpoint - Error Cases", { tags: ['assessment', 'dev'] }, () => {
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

    expect(response.status).toBe(401);
  });

  // Test submitting incomplete assessment data
  test("POST /api/assessment/send - should accept incomplete assessment data", async () => {
    const incompleteData = {
      userId: testUserId,
      assessmentData: {
        // Missing required fields
        age: "18_24"
        // Missing cycleLength, periodDuration, etc.
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .set("Authorization", `Bearer ${testToken}`)
      .send(incompleteData);

    // API accepts incomplete data
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  // Test submitting with invalid data types
  test("POST /api/assessment/send - should accept non-standard data types", async () => {
    const nonStandardData = {
      userId: testUserId,
      assessmentData: {
        age: 25, // Numeric instead of string
        cycleLength: "invalid_value",
        periodDuration: "4_5",
        flowHeaviness: "moderate",
        painLevel: "moderate"
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .set("Authorization", `Bearer ${testToken}`)
      .send(nonStandardData);

    // API accepts non-standard data types
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
}); 