import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Test user credentials
const TEST_USER = {
  email: 'testuser@example.com',
  password: 'TestPassword123!',
  newPassword: 'NewPassword456!',
};

// Store authentication tokens
let authToken;

describe('Password Update API', () => {
  // Set up: Create user and get auth token
  beforeAll(async () => {
    // Sign up test user
    try {
      const signupResponse = await axios.post(`${API_URL}/auth/signup`, {
        email: TEST_USER.email,
        password: TEST_USER.password,
        username: 'testuser',
      });

      expect(signupResponse.status).toBe(201);

      // Login to get token
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      expect(loginResponse.status).toBe(200);
      authToken = loginResponse.data.token;
      expect(authToken).toBeDefined();
    } catch (error) {
      console.error('Setup error:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
      throw error;
    }
  });

  // Clean up: Delete test user
  afterAll(async () => {
    // Delete test user account
    if (authToken) {
      try {
        const deleteResponse = await axios.delete(`${API_URL}/user/me`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        expect(deleteResponse.status).toBe(200);
      } catch (error) {
        console.error('Cleanup error:', error.message);
      }
    }
  });

  test('POST /api/user/pw/update - should update password successfully', async () => {
    // Attempt to update password
    try {
      const updateResponse = await axios.post(`${API_URL}/user/pw/update`, {
        currentPassword: TEST_USER.password,
        newPassword: TEST_USER.newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data).toHaveProperty('message', 'Password updated successfully');

      // Verify can login with new password
      const newLoginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: TEST_USER.email,
        password: TEST_USER.newPassword,
      });

      expect(newLoginResponse.status).toBe(200);
      expect(newLoginResponse.data.token).toBeDefined();
      
      // Update token for cleanup
      authToken = newLoginResponse.data.token;
    } catch (error) {
      console.error('Test error:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
      throw error;
    }
  });

  test('POST /api/user/pw/update - should reject with incorrect current password', async () => {
    try {
      await axios.post(`${API_URL}/user/pw/update`, {
        currentPassword: 'WrongPassword123!',
        newPassword: 'AnotherPassword789!',
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      // Should not reach here
      expect(false).toBe(true);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('error');
      expect(error.response.data.error).toContain('incorrect');
    }
  });

  test('POST /api/user/pw/update - should reject invalid new password format', async () => {
    try {
      await axios.post(`${API_URL}/user/pw/update`, {
        currentPassword: TEST_USER.newPassword,
        newPassword: 'weak',
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      // Should not reach here
      expect(false).toBe(true);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('error');
    }
  });

  test('POST /api/user/pw/update - should reject unauthorized requests', async () => {
    try {
      await axios.post(`${API_URL}/user/pw/update`, {
        currentPassword: TEST_USER.newPassword,
        newPassword: 'AnotherPassword789!',
      });
      
      // Should not reach here
      expect(false).toBe(true);
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });
}); 