/**
 * Authentication Utilities for Integration Tests
 * 
 * This file contains helper functions for authentication-related operations
 * in integration tests, like user registration, login, and token management.
 */

/**
 * Register a new user
 * @param {Object} request - Playwright request object
 * @param {Object} userData - User data for registration
 * @returns {Promise<Object>} Result with user ID and token
 */
export async function registerUser(request, userData) {
  console.log('Registering user:', userData.username);
  
  const response = await request.post('/api/auth/signup', {
    data: userData
  });
  
  if (response.status() !== 201) {
    throw new Error(`Failed to register user: ${response.status()}`);
  }
  
  const data = await response.json();
  
  return {
    userId: data.user.id,
    token: data.token,
    userData: data.user
  };
}

/**
 * Login with existing user credentials
 * @param {Object} request - Playwright request object
 * @param {Object} credentials - Login credentials
 * @returns {Promise<string>} Authentication token
 */
export async function loginUser(request, credentials) {
  console.log('Logging in user:', credentials.email);
  
  const response = await request.post('/api/auth/login', {
    data: {
      email: credentials.email,
      password: credentials.password
    }
  });
  
  if (response.status() !== 200) {
    throw new Error(`Failed to login: ${response.status()}`);
  }
  
  const data = await response.json();
  return data.token;
}

/**
 * Verify authentication token is valid
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} True if token is valid
 */
export async function verifyToken(request, token) {
  // Try to access a protected endpoint to verify the token
  const response = await request.get('/api/auth/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.status() === 200;
}

/**
 * Generate unique test user data
 * @returns {Object} User data for registration
 */
export function generateTestUser() {
  const timestamp = Date.now();
  return {
    username: `testuser-${timestamp}`,
    email: `test-${timestamp}@example.com`,
    password: 'TestPassword123!'
  };
} 