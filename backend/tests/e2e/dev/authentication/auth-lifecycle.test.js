// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests to avoid conflicts with the running server
const TEST_PORT = 5004; // Using a different port than the main auth-lifecycle test

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Authentication lifecycle test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Authentication lifecycle test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

describe("Authentication Lifecycle Tests - Development", () => {
  // Generate unique test user for this test run
  const testUser = {
    username: `lifecycle_user_${Date.now()}`,
    email: `lifecycle_${Date.now()}@example.com`,
    password: "SecurePass123!",
    age: "25_34"
  };
  
  // Store tokens between tests
  let authToken = null;
  let refreshToken = null;
  let userId = null;
  
  test("1. User Registration - POST /api/auth/signup", async () => {
    console.log(`Testing signup with email: ${testUser.email}`);
    
    const response = await request
      .post("/api/auth/signup")
      .send(testUser);
    
    // In development, we expect successful registration
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    
    // Store the user ID for later tests
    userId = response.body.id;
    console.log(`User registered with ID: ${userId}`);
  });
  
  test("2. User Login - POST /api/auth/login", async () => {
    console.log(`Testing login with email: ${testUser.email}`);
    
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    
    const response = await request
      .post("/api/auth/login")
      .send(loginData);
    
    // In development, we expect successful login
    expect(response.status).toBe(200);
    
    // Verify token structure
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    
    // JWT tokens have 3 parts separated by periods
    const tokenParts = response.body.token.split('.');
    expect(tokenParts.length).toBe(3);
    
    // Check for refresh token
    expect(response.body).toHaveProperty("refreshToken");
    expect(typeof response.body.refreshToken).toBe("string");
    
    // Refresh token should also be a JWT
    const refreshTokenParts = response.body.refreshToken.split('.');
    expect(refreshTokenParts.length).toBe(3);
    
    // Store tokens for subsequent tests
    authToken = response.body.token;
    refreshToken = response.body.refreshToken;
    
    // Verify user data
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", testUser.email);
    
    console.log("Authentication tokens received and validated");
  });
  
  test("3. Verify Authentication - GET /api/auth/verify", async () => {
    console.log("Testing token verification");
    
    // This test should be skipped if login failed
    expect(authToken).not.toBeNull();
    
    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${authToken}`);
    
    // In development, we expect successful verification
    expect(response.status).toBe(200);
    
    // Verify content of the response
    expect(response.body).toHaveProperty("authenticated", true);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).toHaveProperty("email");
    
    console.log("Authentication verified successfully");
  });
  
  test("4. Request Password Reset - POST /api/auth/reset-password", async () => {
    console.log("Testing password reset request");
    
    const resetData = {
      email: testUser.email
    };
    
    const response = await request
      .post("/api/auth/reset-password")
      .send(resetData);
    
    // The reset-password endpoint now exists and returns 200
    expect(response.status).toBe(200);
    
    console.log(`Password reset endpoint status: ${response.status}`);
  });
  
  test("5. Token Refresh - POST /api/auth/refresh", async () => {
    console.log("Testing token refresh");
    
    // This test should be skipped if login failed
    expect(refreshToken).not.toBeNull();
    
    const response = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });
    
    // In development, we expect successful token refresh
    expect(response.status).toBe(200);
    
    // Verify new token
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    
    // Check token is properly formatted
    const tokenParts = response.body.token.split('.');
    expect(tokenParts.length).toBe(3);
    
    // Store new token and verify it's different
    const previousToken = authToken;
    authToken = response.body.token;
    expect(authToken).not.toBe(previousToken);
    
    console.log("Token refreshed successfully");
    
    // Verify the new token works
    const verifyResponse = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${authToken}`);
    
    expect(verifyResponse.status).toBe(200);
    console.log("New token verified successfully");
  });
  
  test("6. User Logout - POST /api/auth/logout", async () => {
    console.log("Testing user logout");
    
    // This test should be skipped if login failed
    expect(authToken).not.toBeNull();
    
    const response = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ refreshToken });
    
    // In development, we expect successful logout
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    
    console.log("Logout successful");
    
    // Verify refresh token is invalidated
    const refreshResponse = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });
    
    // After logout, refresh token should be rejected
    expect([401, 403]).toContain(refreshResponse.status);
    console.log("Refresh token invalidated successfully");
  });
  
  test("7. Account Cleanup - DELETE /api/auth/users/:id", async () => {
    console.log("Cleaning up test user account");
    
    // We need a fresh token to delete the user
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    
    const loginResponse = await request
      .post("/api/auth/login")
      .send(loginData);
    
    if (loginResponse.status === 200) {
      const cleanupToken = loginResponse.body.token;
      
      const response = await request
        .delete(`/api/auth/users/${userId}`)
        .set("Authorization", `Bearer ${cleanupToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      console.log("Test user account deleted successfully");
    } else {
      console.log("Could not get token to delete test user - manual cleanup may be needed");
    }
  });
}); 