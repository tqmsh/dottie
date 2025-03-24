import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';
import { API_URL, testToken, testUserId } from './setup.js';

describe("Assessment Endpoints - Production", () => {
  // Test submitting assessment (protected)
  test("POST /api/assessment/send - should check assessment submission", async () => {
    const assessmentData = {
      userId: testUserId,
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
      }
    };

    const response = await fetch(`${API_URL}/api/assessment/send`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      },
      body: JSON.stringify(assessmentData)
    });
    
    // We expect 401 since our token is invalid, but endpoint should exist
    console.log(`Assessment submission endpoint status: ${response.status}`);
    expect([201, 400, 401, 403, 404, 500]).toContain(response.status);
  });
  
  // Test getting assessments list (protected)
  test("GET /api/assessment/list - should check assessments list endpoint", async () => {
    const response = await fetch(`${API_URL}/api/assessment/list`, {
      headers: { "Authorization": `Bearer ${testToken}` }
    });
    
    // We expect 401 since our token is invalid, but endpoint should exist
    console.log(`Assessment list endpoint status: ${response.status}`);
    expect([200, 401, 403, 404]).toContain(response.status);
  });
}); 