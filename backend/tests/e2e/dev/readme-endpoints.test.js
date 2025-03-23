// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../server.js';
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
const TEST_PORT = 5002;

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
      // Keep this log for server start notification
      console.log(`README endpoints test server started on port ${TEST_PORT}`);
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
      // Keep this log for server close notification
      console.log('README endpoints test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

describe("README API Endpoints Tests", () => {
  // Test Group 1: Testing endpoints
  describe("Testing Endpoints", () => {
    // Test the hello endpoint
    test("GET /api/hello - should return Hello World message", async () => {
      const response = await request.get("/api/hello");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Hello World from Dottie API!");
    });

    // Test the db-status endpoint
    test("GET /api/db-status - should return database status", async () => {
      const response = await request.get("/api/db-status");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status");
      // The exact status message might vary, but it should be defined
      expect(response.body.status).toBeDefined();
    });
  });

  // Test Group 2: User Authentication
  describe("User Authentication Endpoints", () => {
    // Test user signup
    test("POST /api/auth/signup - should create a new user", async () => {
      const userData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: "Password123!",
        age: "18_24"
      };

      const response = await request
        .post("/api/auth/signup")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    // Test user login
    test("POST /api/auth/login - should authenticate user and return token", async () => {
      const loginData = {
        email: `test_${Date.now()}@example.com`,
        password: "Password123!"
      };

      const response = await request
        .post("/api/auth/login")
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    // Test get all users
    test("GET /api/auth/users - should return list of users", async () => {
      const response = await request
        .get("/api/auth/users")
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    // Test get user by ID
    test("GET /api/auth/users/:id - should return user by ID", async () => {
      const response = await request
        .get(`/api/auth/users/${testUserId}`)
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
    });

    // Test update user
    test("PUT /api/auth/users/:id - should update user", async () => {
      const updateData = {
        username: `updated_user_${Date.now()}`
      };

      const response = await request
        .put(`/api/auth/users/${testUserId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("username");
    });

    // Test user logout
    test("POST /api/auth/logout - should log out user", async () => {
      const response = await request
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      // Might have a success message
      expect(response.body).toHaveProperty("message");
    });
  });

  // Test Group 3: Assessment
  describe("Assessment Endpoints", () => {
    // Test submitting a complete assessment
    test("POST /api/assessment/send - should send assessment results", async () => {
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
    });

    // Test getting all assessments for current user
    test("GET /api/assessment/list - should return list of assessments", async () => {
      const response = await request
        .get("/api/assessment/list")
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    // Test getting a specific assessment by ID
    test("GET /api/assessment/:id - should return assessment details", async () => {
      const response = await request
        .get(`/api/assessment/${testAssessmentId}`)
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("assessmentData");
    });

    // Test deleting a user
    test("DELETE /api/auth/users/:id - should delete user", async () => {
      const response = await request
        .delete(`/api/auth/users/${testUserId}`)
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });
  });
}); 