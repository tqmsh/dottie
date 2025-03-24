// @ts-check
import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests
const TEST_PORT = 5018;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Logout success test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Logout success test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("User Logout - Success Scenarios", () => {
  // Variables to store auth data
  let token;
  let refreshToken;
  
  // Set up a new user and login for each test
  beforeEach(async () => {
    // Create a unique test user
    const testUser = {
      username: `logouttest_${Date.now()}`,
      email: `logouttest_${Date.now()}@example.com`,
      password: "Password123!",
      age: "18_24"
    };
    
    // Register the user
    await request
      .post("/api/auth/signup")
      .send(testUser);
    
    // Login to get tokens
    const loginResponse = await request
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    token = loginResponse.body.token;
    refreshToken = loginResponse.body.refreshToken;
  });

  test("Should successfully log out user with valid tokens", async () => {
    const response = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("logged out");
  });

  test("Should invalidate refresh token after logout", async () => {
    // First logout
    await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    
    // Try to use the refresh token after logout
    const refreshResponse = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });
    
    // Should be rejected
    expect([401, 403]).toContain(refreshResponse.status);
  });

  test("Should allow re-login after logout", async () => {
    // Create a user with known credentials
    const username = `relogin_${Date.now()}`;
    const email = `relogin_${Date.now()}@example.com`;
    const password = "Password123!";
    
    const testUser = {
      username,
      email,
      password,
      age: "18_24"
    };
    
    // Register the user
    await request
      .post("/api/auth/signup")
      .send(testUser);
    
    // Login first time
    const firstLogin = await request
      .post("/api/auth/login")
      .send({
        email,
        password
      });
    
    const firstToken = firstLogin.body.token;
    const firstRefreshToken = firstLogin.body.refreshToken;
    
    // Logout
    await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({ refreshToken: firstRefreshToken });
    
    // Login again with same credentials
    const secondLogin = await request
      .post("/api/auth/login")
      .send({
        email,
        password
      });
    
    expect(secondLogin.status).toBe(200);
    expect(secondLogin.body).toHaveProperty("token");
    expect(secondLogin.body).toHaveProperty("refreshToken");
    
    // Verify tokens are different
    expect(secondLogin.body.token).not.toBe(firstToken);
    expect(secondLogin.body.refreshToken).not.toBe(firstRefreshToken);
  });
}); 