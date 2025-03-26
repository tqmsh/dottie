// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests
const TEST_PORT = 5011;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Signup error test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Signup error test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("User Signup - Error Scenarios", { tags: ['authentication', 'dev', 'error'] }, () => {
  test("Should reject signup with missing required fields", async () => {
    const incompleteUserData = {
      username: `testuser_${Date.now()}`,
      // Missing email
      password: "Password123!"
      // Missing age
    };

    const response = await request
      .post("/api/auth/signup")
      .send(incompleteUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject signup with invalid email format", async () => {
    const userData = {
      username: `testuser_${Date.now()}`,
      email: "not-an-email",
      password: "Password123!",
      age: "18_24"
    };

    const response = await request
      .post("/api/auth/signup")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject signup with weak password", async () => {
    const userData = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: "weak",
      age: "18_24"
    };

    const response = await request
      .post("/api/auth/signup")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject signup for duplicate email", async () => {
    // First create a user
    const email = `duplicate_${Date.now()}@example.com`;
    const firstUserData = {
      username: `first_user_${Date.now()}`,
      email,
      password: "Password123!",
      age: "18_24"
    };

    await request
      .post("/api/auth/signup")
      .send(firstUserData);

    // Try to create another user with the same email
    const duplicateUserData = {
      username: `second_user_${Date.now()}`,
      email,
      password: "Password123!",
      age: "25_34"
    };

    const response = await request
      .post("/api/auth/signup")
      .send(duplicateUserData);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
  });
}); 