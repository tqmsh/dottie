// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests
const TEST_PORT = 5015;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Verify error test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Verify error test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("Token Verification - Error Scenarios", { tags: ['authentication', 'dev', 'error'] }, () => {
  test("Should reject request with missing token", async () => {
    const response = await request
      .get("/api/auth/verify");
      // No Authorization header

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject request with malformed token", async () => {
    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", "Bearer malformed-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("code", "INVALID_TOKEN");
  });

  test("Should reject request with expired token", async () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { id: 'test-user-expired', email: 'expired@example.com' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '0s' } // Expires immediately
    );

    // Wait a moment to ensure expiration
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("code", "TOKEN_EXPIRED");
  });

  test("Should reject request with token signed with wrong secret", async () => {
    // Create a token with wrong secret
    const wrongToken = jwt.sign(
      { id: 'test-user-wrong', email: 'wrong@example.com' },
      'wrong-secret-key',
      { expiresIn: '1h' }
    );

    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${wrongToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("code", "INVALID_TOKEN");
  });

  test("Should reject request with invalid token format", async () => {
    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", "InvalidFormat token123");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
}); 