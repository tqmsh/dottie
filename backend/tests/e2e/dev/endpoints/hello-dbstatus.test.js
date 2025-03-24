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
const TEST_PORT = 5002;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Hello endpoints test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Hello endpoints test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

describe("Basic API Endpoints Tests", () => {
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