// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Create a supertest instance
const request = supertest(app);

// Store server instance and test user data
let server;
let testUserId;
let testToken;
let testRefreshToken;

// Use a different port for tests to avoid conflicts
const TEST_PORT = 5030;

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
      console.log(`Auth endpoints test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });

  // Create a test user ID and token
  testUserId = `test-user-${Date.now()}`;
  testToken = createMockToken(testUserId);
  testRefreshToken = createMockToken(testUserId);
  
  // Register the refresh token in the middleware
  import('../../../../routes/auth/middleware.js').then(middleware => {
    middleware.refreshTokens.add(testRefreshToken);
  });
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Auth endpoints test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

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
      .set("Authorization", `Bearer ${testToken}`)
      .send({ refreshToken: testRefreshToken });

    expect(response.status).toBe(200);
    // Check for a success message
    expect(response.body).toHaveProperty("message");
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