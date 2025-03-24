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
const TEST_PORT = 5006;

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
      console.log(`Assessment list success test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });

  // Create a test user ID and token
  testUserId = `test-user-${Date.now()}`;
  testToken = createMockToken(testUserId);
  
  // Create a test assessment first
  const assessmentData = {
    userId: testUserId,
    assessmentData: {
      age: "18_24",
      cycleLength: "26_30",
      periodDuration: "4_5",
      flowHeaviness: "moderate",
      painLevel: "moderate",
      symptoms: {
        physical: ["Bloating", "Headaches"],
        emotional: ["Mood swings"]
      }
    }
  };

  await request
    .post("/api/assessment/send")
    .set("Authorization", `Bearer ${testToken}`)
    .send(assessmentData);
    
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Assessment list success test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

describe("Assessment List Endpoint - Success Cases", () => {
  // Test getting all assessments for current user
  test("GET /api/assessment/list - should successfully return list of assessments", async () => {
    const response = await request
      .get("/api/assessment/list")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Verify assessment data structure
    const assessment = response.body[0];
    expect(assessment).toHaveProperty("id");
    expect(assessment).toHaveProperty("userId");
    expect(assessment.userId).toBe(testUserId);
  });
}); 