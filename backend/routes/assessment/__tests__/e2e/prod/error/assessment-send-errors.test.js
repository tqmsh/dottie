import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';
import { API_URL, testToken, sampleAssessmentData } from '../setup.js';

// @prod
describe("Assessment Send Endpoint (Errors) - Production", { tags: ['assessment', 'prod'] }, () => {
  test("POST /api/assessment/send - should require authentication", async () => {
    // Test without authentication token
    const response = await fetch(`${API_URL}/api/assessment/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleAssessmentData)
    });
    
    console.log(`Assessment submission without auth status: ${response.status}`);
    
    // Should require authentication
    expect(response.status).toBe(401);
  });
  
  test("POST /api/assessment/send - should reject invalid tokens", async () => {
    // Test with invalid authentication token
    const invalidToken = "invalid.token.format";
    const response = await fetch(`${API_URL}/api/assessment/send`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${invalidToken}`
      },
      body: JSON.stringify(sampleAssessmentData)
    });
    
    console.log(`Assessment submission with invalid token status: ${response.status}`);
    
    // Should reject invalid token with 401 Unauthorized
    expect(response.status).toBe(401);
  });
  
  test("POST /api/assessment/send - should validate input data", async () => {
    // Test with invalid assessment data
    const invalidData = {
      userId: "test-user",
      assessmentData: {
        // Missing required fields
      }
    };
    
    const response = await fetch(`${API_URL}/api/assessment/send`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      },
      body: JSON.stringify(invalidData)
    });
    
    console.log(`Assessment submission with invalid data status: ${response.status}`);
    
    // Should validate data and return 400 Bad Request
    expect(response.status).toBe(400);
  });
}); 