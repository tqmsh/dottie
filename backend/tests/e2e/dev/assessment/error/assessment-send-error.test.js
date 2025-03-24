// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Create a supertest instance
const request = supertest(app);

// Store server instance and test user data
let server;
let testUserId;
let testToken;

// Use a different port for tests to avoid conflicts with the running server
const TEST_PORT = 5010;

// Create a mock token for testing
const createMockToken = (userId) => {
  return jwt.sign(
    { id: userId, email: `test_${Date.now()}@example.com` },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Assessment send error test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });

  // Create a test user ID and token
  testUserId = `test-user-${Date.now()}`;
  testToken = createMockToken(testUserId);
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Assessment send error test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

describe("Assessment Send Endpoint - Error Cases", () => {
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