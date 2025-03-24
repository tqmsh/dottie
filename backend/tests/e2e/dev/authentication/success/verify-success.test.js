// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;
let testToken;
let testUserId;

// Use a different port for tests
const TEST_PORT = 5014;

// Helper to create a valid token
const createToken = (userId) => {
  return jwt.sign(
    { id: userId, email: `verify_${Date.now()}@example.com` },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Verify success test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });

  // Create test user
  const testUser = {
    username: `verifytest_${Date.now()}`,
    email: `verifytest_${Date.now()}@example.com`,
    password: "Password123!",
    age: "18_24"
  };

  const response = await request
    .post("/api/auth/signup")
    .send(testUser);

  testUserId = response.body.id;
  
  // Generate token
  testToken = createToken(testUserId);
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Verify success test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("Token Verification - Success Scenarios", () => {
  test("Should verify valid token and return user info", async () => {
    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("authenticated", true);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
  });

  test("Should verify token from login", async () => {
    // Login to get a real token
    const testUser = {
      username: `login_verify_${Date.now()}`,
      email: `login_verify_${Date.now()}@example.com`,
      password: "Password123!",
      age: "18_24"
    };

    // Create the user
    await request
      .post("/api/auth/signup")
      .send(testUser);
    
    // Login to get token
    const loginResponse = await request
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    const loginToken = loginResponse.body.token;
    
    // Verify the token
    const verifyResponse = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${loginToken}`);
    
    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body).toHaveProperty("authenticated", true);
    expect(verifyResponse.body.user).toHaveProperty("email", testUser.email);
  });
}); 