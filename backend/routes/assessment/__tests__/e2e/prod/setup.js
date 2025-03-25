import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';
import { API_URL, testToken, testUserId } from '../general-setup/setup.js';

// Sample assessment data for testing
export const sampleAssessmentData = {
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

// Export common variables and functions 
export { API_URL, testToken, testUserId };

// Helper function for assessment list requests
export const fetchAssessmentList = async (token = testToken) => {
  return await fetch(`${API_URL}/api/assessment/list`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
};

// Helper function for assessment submission
export const submitAssessment = async (data = sampleAssessmentData, token = testToken) => {
  return await fetch(`${API_URL}/api/assessment/send`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
}; 