// @ts-check
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';

// Mock the database connection 
vi.mock('../../../../../../db/index.js', () => {
  return {
    default: {
      raw: vi.fn().mockRejectedValue(new Error('Database connection error')),
      client: {
        config: {
          client: 'mssql'
        }
      },
      destroy: vi.fn()
    }
  };
});

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests to avoid conflicts with the running server
const TEST_PORT = 5003;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Error endpoints test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Error endpoints test server closed');
      resolve(true);
    });
  });
  vi.restoreAllMocks();
}, 15000); // Increased timeout to 15 seconds

describe("API Endpoints Error Tests", () => {
  // Test the db-status endpoint for errors
  test("GET /api/setup/database/status - should handle database connection errors", async () => {
    const response = await request.get("/api/setup/database/status");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", "error");
    expect(response.body).toHaveProperty("message");
  });

  // Test the sql-hello endpoint for errors
  test("GET /api/setup/database/hello - should handle database query errors", async () => {
    const response = await request.get("/api/setup/database/hello");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("dbType", "mssql");
    expect(response.body).toHaveProperty("isConnected", false);
  });
}); 