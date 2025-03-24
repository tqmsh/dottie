import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

// API URL based on environment
export const API_URL = process.env.API_URL || 'http://localhost:3000';

// Test user credentials
export const testUser = {
  email: `test_${Date.now()}@example.com`,
  password: 'Test12345!',
  name: 'Test User'
};

// Generate a test user ID (will be overwritten after signup)
export let testUserId = uuidv4();

// Test token (will be set after login)
export let testToken = '';

// Sample assessment data for testing
export const sampleAssessmentData = {
  userId: testUserId,
  assessmentData: {
    age: "18-24",
    cycleLength: "26-30",
    periodDuration: "4-5",
    flowHeaviness: "moderate",
    painLevel: "moderate",
    symptoms: {
      physical: ["Bloating", "Headaches"],
      emotional: ["Mood swings"]
    }
  }
};

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