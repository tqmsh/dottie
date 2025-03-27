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
const TEST_PORT = 5008;

// Start server before all tests
beforeAll(async () => {
  try {
    // Initialize test database first
    console.log('Initializing database for assessment detail tests...');
    
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
    
    // Create a test assessment in the database
    testAssessmentId = `test-assessment-${Date.now()}`;
    const assessmentData = {
      id: testAssessmentId,
      user_id: testUserId,
      created_at: new Date().toISOString(),
      age: '18_24',
      cycle_length: '26_30',
      period_duration: '4_5',
      flow_heaviness: 'moderate',
      pain_level: 'moderate'
    };
    
    await db('assessments').insert(assessmentData);
    
    // Add some symptoms for this assessment
    const symptoms = [
      { assessment_id: testAssessmentId, symptom_name: 'Bloating', symptom_type: 'physical' },
      { assessment_id: testAssessmentId, symptom_name: 'Headaches', symptom_type: 'physical' },
      { assessment_id: testAssessmentId, symptom_name: 'Mood swings', symptom_type: 'emotional' }
    ];
    
    await db('symptoms').insert(symptoms);
    
    console.log('Test assessment created:', testAssessmentId);
    
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
        console.log(`Assessment detail success test server started on port ${TEST_PORT}`);
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
    await db('symptoms').where('assessment_id', testAssessmentId).delete();
    await db('assessments').where('id', testAssessmentId).delete();
    await db('users').where('id', testUserId).delete();
    
    // Close the server
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.close(() => {
        console.log('Assessment detail success test server closed');
        resolve(true);
      });
    });
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
}, 15000);

describe("Assessment Detail Endpoint - Success Cases", () => {
  // Test getting a specific assessment by ID
  test("GET /api/assessment/:id - should successfully return assessment details", async () => {
    console.log('Running test with assessment ID:', testAssessmentId);
    
    const response = await request
      .get(`/api/assessment/${testAssessmentId}`)
      .set("Authorization", `Bearer ${testToken}`);
    
    console.log('Response status:', response.status);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(testAssessmentId);
    expect(response.body).toHaveProperty("userId");
    expect(response.body.userId).toBe(testUserId);
    
    // Check for assessment data properties
    expect(response.body).toHaveProperty("assessmentData");
    expect(response.body.assessmentData).toHaveProperty("age");
    expect(response.body.assessmentData).toHaveProperty("cycleLength");
    expect(response.body.assessmentData).toHaveProperty("periodDuration");
    expect(response.body.assessmentData).toHaveProperty("flowHeaviness");
    expect(response.body.assessmentData).toHaveProperty("painLevel");
    expect(response.body.assessmentData).toHaveProperty("symptoms");
  });
}); 