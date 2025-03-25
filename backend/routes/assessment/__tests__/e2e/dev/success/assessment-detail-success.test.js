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
let testAssessmentId;

// Use a different port for tests to avoid conflicts with the running server
const TEST_PORT = 5008;

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
      console.log(`Assessment detail success test server started on port ${TEST_PORT}`);
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

  const response = await request
    .post("/api/assessment/send")
    .set("Authorization", `Bearer ${testToken}`)
    .send(assessmentData);
    
  testAssessmentId = response.body.id;
    
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Assessment detail success test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

describe("Assessment Detail Endpoint - Success Cases", () => {
  // Test getting a specific assessment by ID
  test("GET /api/assessment/:id - should successfully return assessment details", async () => {
    const response = await request
      .get(`/api/assessment/${testAssessmentId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(testAssessmentId);
    expect(response.body).toHaveProperty("userId");
    expect(response.body.userId).toBe(testUserId);
    expect(response.body).toHaveProperty("assessmentData");
    
    // Check assessment data structure
    const { assessmentData } = response.body;
    expect(assessmentData).toHaveProperty("age");
    expect(assessmentData).toHaveProperty("cycleLength");
    expect(assessmentData).toHaveProperty("periodDuration");
    expect(assessmentData).toHaveProperty("flowHeaviness");
    expect(assessmentData).toHaveProperty("painLevel");
    expect(assessmentData).toHaveProperty("symptoms");
  });
}); 