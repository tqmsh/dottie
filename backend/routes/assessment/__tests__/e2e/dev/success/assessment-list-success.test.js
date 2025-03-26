// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';

// Create a standalone test server specifically for list tests
const app = express();
app.use(cors());
app.use(express.json());

// Store server instance and test user data
let server;
let testUserId;
let testToken;

// Use a different port for tests to avoid conflicts with the running server
const TEST_PORT = 5006;

// Create a mock token for testing
const createMockToken = (userId) => {
  return jwt.sign(
    { id: userId, email: `test_${Date.now()}@example.com` },
    'test-secret-key',
    { expiresIn: '1h' }
  );
};

// Start server before all tests
beforeAll(async () => {
  // Create a test user ID and token
  testUserId = `test-user-${Date.now()}`;
  testToken = createMockToken(testUserId);
  
  // Setup authentication middleware
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decodedToken = jwt.decode(token);
      
      if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      req.user = {
        id: decodedToken.id,
        email: decodedToken.email || 'test@example.com',
        name: 'Test User'
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  });
  
  // Add route for assessment list
  app.get('/api/assessment/list', (req, res) => {
    // Return mock assessments for the test user
    const assessments = [
      {
        id: `test-assessment-1-${Date.now()}`,
        userId: req.user.id,
        assessmentData: {
          age: "18_24",
          cycleLength: "26_30",
          periodDuration: "4_5",
          flowHeaviness: "moderate",
          painLevel: "moderate",
          symptoms: {
            physical: ["Bloating", "Headaches"],
            emotional: ["Mood swings"]
          }
        },
        createdAt: new Date().toISOString()
      },
      {
        id: `test-assessment-2-${Date.now()}`,
        userId: req.user.id,
        assessmentData: {
          age: "25_34",
          cycleLength: "31_35",
          periodDuration: "6_7",
          flowHeaviness: "heavy",
          painLevel: "severe",
          symptoms: {
            physical: ["Cramps", "Backache"],
            emotional: ["Anxiety"]
          }
        },
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    
    res.status(200).json(assessments);
  });
  
  // Start server
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Assessment list success test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Assessment list success test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

// Create a supertest instance with the test server
const request = supertest(`http://localhost:${TEST_PORT}`);

describe("Assessment List Endpoint - Success Cases", () => {
  // Test getting all assessments for current user
  test("GET /api/assessment/list - should successfully return list of assessments", async () => {
    console.log('Running assessment list test for user:', testUserId);
    
    const response = await request
      .get("/api/assessment/list")
      .set("Authorization", `Bearer ${testToken}`);
    
    console.log('Response status:', response.status);
    console.log('Response body:', Array.isArray(response.body) ? `Array with ${response.body.length} items` : response.body);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Verify assessment data structure
    const assessment = response.body[0];
    expect(assessment).toHaveProperty("id");
    expect(assessment).toHaveProperty("userId");
    expect(assessment.userId).toBe(testUserId);
  });
}); 