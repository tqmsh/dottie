// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../test-server.js';
import { createServer } from 'http';
import db from '../../../../../../db/index.js';
import jwt from 'jsonwebtoken';

// Create a supertest instance
const request = supertest(app);

// Store server instance and test data
let server;
let testUserId;
let testToken;
let testAssessmentId;

// Use a different port for tests
const TEST_PORT = 5004;

// Start server before all tests
beforeAll(async () => {
  try {
    // Initialize test database first
    console.log('Initializing database for assessment send tests...');
    
    // Clear any existing test data
    await db('assessments').where('id', 'like', 'test-%').delete();
    await db('users').where('id', 'like', 'test-%').delete();
    
    console.log('Test database cleared');
    
    // Create a test user directly in the database
    testUserId = `test-user-${Date.now()}`;
    const userData = {
      id: testUserId,
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password_hash: 'test-hash', // Not used for auth in these tests
      age: '18_24',
      created_at: new Date().toISOString()
    };
    
    await db('users').insert(userData);
    console.log('Test user created:', testUserId);
    
    // Create a JWT token for this test user
    // Use the same JWT_SECRET as in the verifyToken middleware
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
    testToken = jwt.sign(
      { 
        userId: testUserId, // Must use userId as expected by verifyToken
        email: userData.email 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Start the server
    server = createServer(app);
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.listen(TEST_PORT, () => {
        console.log(`Assessment send success test server started on port ${TEST_PORT}`);
        resolve(true);
      });
    });
  } catch (error) {
    console.error('Error in test setup:', error);
    throw error;
  }
}, 15000); // Increased timeout for setup

// Close server and cleanup after all tests
afterAll(async () => {
  try {
    // Clean up test data
    if (testAssessmentId) {
      await db('symptoms').where('assessment_id', testAssessmentId).delete();
      await db('assessments').where('id', testAssessmentId).delete();
    }
    await db('users').where('id', testUserId).delete();
    
    // Close the server
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.close(() => {
        console.log('Assessment send success test server closed');
        resolve(true);
      });
    });
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
}, 15000);

describe("Assessment Send Endpoint - Success Cases", () => {
  // Test submitting a complete assessment
  test("POST /api/assessment/send - should successfully send assessment results", async () => {
    // Create assessment data according to the format in README
    const assessmentData = {
      assessmentData: {
        age: "18_24",
        cycleLength: "26_30",
        periodDuration: "4_5",
        flowHeaviness: "moderate",
        painLevel: "moderate",
        symptoms: {
          physical: ["Bloating", "Headaches", "Fatigue"],
          emotional: ["Mood swings", "Irritability"]
        },
        recommendations: [
          {
            title: "Track Your Cycle",
            description: "Keep a record of when your period starts and stops to identify patterns."
          },
          {
            title: "Pain Management",
            description: "Over-the-counter pain relievers like ibuprofen can help with cramps."
          }
        ]
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .set("Authorization", `Bearer ${testToken}`)
      .send(assessmentData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    
    // Save assessment ID for later cleanup
    testAssessmentId = response.body.id;
    
    // Verify the assessment was actually created in the database
    const dbAssessment = await db('assessments').where('id', testAssessmentId).first();
    expect(dbAssessment).toBeTruthy();
    expect(dbAssessment.user_id).toBe(testUserId);
    
    // Check if symptoms were saved
    const symptoms = await db('symptoms').where('assessment_id', testAssessmentId);
    expect(symptoms.length).toBeGreaterThan(0);
  });
}); 