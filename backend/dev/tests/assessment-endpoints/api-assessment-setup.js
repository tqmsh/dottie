import { test, expect } from '@playwright/test';

/**
 * Common setup and utilities for assessment API endpoint tests
 */

// Test user data with unique values to avoid conflicts
const timestamp = Date.now();
const testUser = {
  username: `assessuser-${timestamp}`,
  email: `assess-${timestamp}@example.com`,
  password: 'Password123!'
};

// Sample assessment data
const assessmentData = {
  assessmentData: {
    age: "18_24",
    cycleLength: "26_30",
    periodDuration: "4_5",
    flowHeaviness: "moderate",
    painLevel: "moderate",
    symptoms: {
      physical: ["Bloating", "Headaches"],
      emotional: ["Mood swings", "Irritability"]
    }
  }
};

/**
 * Setup function to create a user and get auth token
 */
async function setupUser(request) {
  let authToken = null;
  let userId = null;
  
  // Create a new user
  const signupResponse = await request.post('/api/auth/signup', {
    data: testUser
  });
  
  if (signupResponse.ok()) {
    const signupData = await signupResponse.json();
    if (signupData.id) {
      userId = signupData.id;
    } else if (signupData.user && signupData.user.id) {
      userId = signupData.user.id;
    }
    
    // Login to get auth token
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    
    if (loginResponse.ok()) {
      const loginData = await loginResponse.json();
      authToken = loginData.token;
      
      if (loginData.user && loginData.user.id && !userId) {
        userId = loginData.user.id;
      }
    }
  }
  
  return { authToken, userId };
}

export { testUser, assessmentData, setupUser }; 