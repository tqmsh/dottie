import { v4 as uuidv4 } from 'uuid';

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

// Function to create a test user
export const createTestUser = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (response.status !== 201) {
      throw new Error(`Failed to create test user: ${response.status}`);
    }

    const data = await response.json();
    testUserId = data.userId;
    return data;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

// Function to login a test user
export const loginTestUser = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (response.status !== 200) {
      throw new Error(`Failed to login test user: ${response.status}`);
    }

    const data = await response.json();
    testToken = data.token;
    return data;
  } catch (error) {
    console.error('Error logging in test user:', error);
    throw error;
  }
}; 