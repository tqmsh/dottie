// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;
let refreshToken;

// Use a different port for tests
const TEST_PORT = 5016;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Refresh token success test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });

  // Create test user and get refresh token
  const testUser = {
    username: `refreshtest_${Date.now()}`,
    email: `refreshtest_${Date.now()}@example.com`,
    password: "Password123!",
    age: "18_24"
  };

  // Register the user
  await request
    .post("/api/auth/signup")
    .send(testUser);
  
  // Login to get refresh token
  const loginResponse = await request
    .post("/api/auth/login")
    .send({
      email: testUser.email,
      password: testUser.password
    });
  
  refreshToken = loginResponse.body.refreshToken;
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Refresh token success test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("Token Refresh - Success Scenarios", () => {
  test("Should refresh token with valid refresh token", async () => {
    const response = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    
    // JWT tokens have 3 parts separated by periods
    const tokenParts = response.body.token.split('.');
    expect(tokenParts.length).toBe(3);
  });

  test("Should return valid token that can be used for authenticated requests", async () => {
    // Get a new token with refresh
    const refreshResponse = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });
    
    const newToken = refreshResponse.body.token;
    
    // Use new token to access protected endpoint
    const verifyResponse = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${newToken}`);
    
    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body).toHaveProperty("authenticated", true);
  });
}); 