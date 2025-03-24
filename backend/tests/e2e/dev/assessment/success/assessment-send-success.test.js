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
const TEST_PORT = 5004;

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
      console.log(`Assessment send success test server started on port ${TEST_PORT}`);
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
      console.log('Assessment send success test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

describe("Assessment Send Endpoint - Success Cases", () => {
  // Test submitting a complete assessment
  test("POST /api/assessment/send - should successfully send assessment results", async () => {
    // Create assessment data according to the format in README
    const assessmentData = {
      userId: testUserId,
      assessmentData: {
        age: "18_24",
        cycleLength: "26_30",
        periodDuration: "4_5",
        flowHeaviness: "moderate",
        painLevel: "moderate",
        symptoms: {
          physical: ["Bloating", "Headaches", "Fatigue"],
          emotional: ["Mood swings", "Irritability"]
        },
        recommendations: [
          {
            title: "Track Your Cycle",
            description: "Keep a record of when your period starts and stops to identify patterns."
          },
          {
            title: "Pain Management",
            description: "Over-the-counter pain relievers like ibuprofen can help with cramps."
          }
        ]
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .set("Authorization", `Bearer ${testToken}`)
      .send(assessmentData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    
    // Save assessment ID for later tests
    testAssessmentId = response.body.id;
    
    // Export the test assessment ID and token for use in other test files
    global.testAssessmentId = testAssessmentId;
    global.testToken = testToken;
    global.testUserId = testUserId;
  });
}); 