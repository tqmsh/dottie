/**
 * User Utilities for Integration Tests
 * 
 * This file contains helper functions for user-related operations
 * in integration tests, such as getting user info, updating profiles, etc.
 */

/**
 * Get user information by ID
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export async function getUserById(request, token, userId) {
  console.log('Getting user info for ID:', userId);
  
  const response = await request.get(`/api/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  console.log('Get user response status:', response.status());
  const data = await response.json();
  console.log('Get user response:', data);
  
  if (response.status() !== 200) {
    throw new Error(`Failed to get user info: ${response.status()}`);
  }
  
  return data;
}

/**
 * Get all users (admin operation)
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of users
 */
export async function getAllUsers(request, token) {
  console.log('Getting all users');
  
  const response = await request.get('/api/auth/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  console.log('Get all users response status:', response.status());
  const data = await response.json();
  console.log('Get all users response:', data);
  
  if (response.status() !== 200) {
    throw new Error(`Failed to get all users: ${response.status()}`);
  }
  
  return data;
}

/**
 * Update user profile information
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUserProfile(request, token, userId, profileData) {
  console.log('Updating user profile for ID:', userId);
  console.log('Profile update data:', profileData);
  
  const response = await request.put(`/api/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: profileData
  });
  
  console.log('Update user response status:', response.status());
  const responseText = await response.text();
  console.log('Update user response text:', responseText);
  
  if (response.status() !== 200) {
    throw new Error(`Failed to update user profile: ${response.status()}`);
  }
  
  // Parse the JSON response
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new Error(`Failed to parse update response: ${error.message}`);
  }
}

/**
 * Delete a user account
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteUser(request, token, userId) {
  console.log('Deleting user with ID:', userId);
  
  const response = await request.delete(`/api/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  console.log('Delete user response status:', response.status());
  try {
    const responseText = await response.text();
    console.log('Delete user response:', responseText);
  } catch (error) {
    console.error('Failed to get delete response text:', error);
  }
  
  return response.status() === 200;
}

/**
 * Generate random profile data for updating user
 * @param {string} usernamePrefix - Prefix for username
 * @returns {Object} Profile update data
 */
export function generateProfileUpdate(usernamePrefix = 'updated') {
  const timestamp = Date.now();
  return {
    username: `${usernamePrefix}_${timestamp}`,
    age: '25_34'
  };
} 