// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';
import db from '../../../../../../db/index.js';
import jwt from 'jsonwebtoken';

// Create a supertest instance
const request = supertest(app);

// Store server instance and test data
let server;
let testUserId;
let testToken;
let testAssessmentIds = [];

// Use a different port for tests
const TEST_PORT = 5006;

// Start server before all tests
beforeAll(async () => {
  try {
    // Initialize test database first
    console.log('Initializing database for assessment list tests...');
    
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
    
    // Create two test assessments in the database
    const testAssessment1Id = `test-assessment-1-${Date.now()}`;
    const assessmentData1 = {
      id: testAssessment1Id,
      user_id: testUserId,
      created_at: new Date().toISOString(),
      age: '18_24',
      cycle_length: '26_30',
      period_duration: '4_5',
      flow_heaviness: 'moderate',
      pain_level: 'moderate'
    };
    
    await db('assessments').insert(assessmentData1);
    testAssessmentIds.push(testAssessment1Id);
    
    // Add some symptoms for the first assessment
    const symptoms1 = [
      { assessment_id: testAssessment1Id, symptom_name: 'Bloating', symptom_type: 'physical' },
      { assessment_id: testAssessment1Id, symptom_name: 'Headaches', symptom_type: 'physical' },
      { assessment_id: testAssessment1Id, symptom_name: 'Mood swings', symptom_type: 'emotional' }
    ];
    
    await db('symptoms').insert(symptoms1);
    
    // Create a second assessment
    const testAssessment2Id = `test-assessment-2-${Date.now()}`;
    const assessmentData2 = {
      id: testAssessment2Id,
      user_id: testUserId,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      age: '25_34',
      cycle_length: '31_35',
      period_duration: '6_7',
      flow_heaviness: 'heavy',
      pain_level: 'severe'
    };
    
    await db('assessments').insert(assessmentData2);
    testAssessmentIds.push(testAssessment2Id);
    
    // Add some symptoms for the second assessment
    const symptoms2 = [
      { assessment_id: testAssessment2Id, symptom_name: 'Cramps', symptom_type: 'physical' },
      { assessment_id: testAssessment2Id, symptom_name: 'Backache', symptom_type: 'physical' },
      { assessment_id: testAssessment2Id, symptom_name: 'Anxiety', symptom_type: 'emotional' }
    ];
    
    await db('symptoms').insert(symptoms2);
    
    console.log('Test assessments created:', testAssessmentIds);
    
    // Create a JWT token for this test user
    const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
    testToken = jwt.sign(
      { id: testUserId, email: userData.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Start the server
    server = createServer(app);
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.listen(TEST_PORT, () => {
        console.log(`Assessment list success test server started on port ${TEST_PORT}`);
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
    for (const assessmentId of testAssessmentIds) {
      await db('symptoms').where('assessment_id', assessmentId).delete();
      await db('assessments').where('id', assessmentId).delete();
    }
    await db('users').where('id', testUserId).delete();
    
    // Close the server
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.close(() => {
        console.log('Assessment list success test server closed');
        resolve(true);
      });
    });
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
}, 15000);

describe("Assessment List Endpoint - Success Cases", () => {
  // Test getting all assessments for current user
  test("GET /api/assessment/list - should successfully return list of assessments", async () => {
    console.log('Running assessment list test for user:', testUserId);
    
    const response = await request
      .get("/api/assessment/list")
      .set("Authorization", `Bearer ${testToken}`);
    
    console.log('Response status:', response.status);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Verify the assessment data structure
    const assessment = response.body[0];
    expect(assessment).toHaveProperty("id");
    expect(assessment).toHaveProperty("userId");
    expect(assessment.userId).toBe(testUserId);
    expect(assessment).toHaveProperty("assessmentData");
    
    // Verify all test assessment IDs are in the response
    const responseIds = response.body.map(a => a.id);
    for (const testId of testAssessmentIds) {
      expect(responseIds).toContain(testId);
    }
  });
}); 