/**
 * Assessment Utilities for Integration Tests
 * 
 * This file contains helper functions for assessment-related operations
 * in integration tests, such as creating, retrieving, updating and deleting assessments.
 */

/**
 * Create a new assessment
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {Object} assessmentData - Assessment data
 * @returns {Promise<string>} Assessment ID
 */
export async function createAssessment(request, token, userId, assessmentData = null) {
  console.log('Creating assessment for user:', userId);
  
  // If no assessment data provided, use default test data
  const data = assessmentData || generateDefaultAssessment();
  
  const payload = {
    userId: userId,
    assessmentData: data
  };
  
  const response = await request.post('/api/assessment/send', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: payload
  });
  
  if (response.status() !== 201) {
    throw new Error(`Failed to create assessment: ${response.status()}`);
  }
  
  const result = await response.json();
  return result.id;
}

/**
 * Get all assessments for a user
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of assessments
 */
export async function getAssessments(request, token) {
  console.log('Getting all assessments');
  
  const response = await request.get('/api/assessment/list', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (response.status() !== 200) {
    throw new Error(`Failed to get assessments: ${response.status()}`);
  }
  
  return response.json();
}

/**
 * Get a specific assessment by ID
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<Object>} Assessment data
 */
export async function getAssessmentById(request, token, assessmentId) {
  console.log('Getting assessment by ID:', assessmentId);
  
  const response = await request.get(`/api/assessment/${assessmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (response.status() !== 200) {
    throw new Error(`Failed to get assessment: ${response.status()}`);
  }
  
  return response.json();
}

/**
 * Update an existing assessment
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} assessmentId - Assessment ID
 * @param {Object} updateData - Updated assessment data
 * @returns {Promise<Object>} Updated assessment
 */
export async function updateAssessment(request, token, assessmentId, updateData) {
  console.log('Updating assessment:', assessmentId);
  
  const response = await request.put(`/api/assessment/${assessmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      assessmentData: updateData
    }
  });
  
  if (response.status() !== 200) {
    throw new Error(`Failed to update assessment: ${response.status()}`);
  }
  
  return response.json();
}

/**
 * Delete an assessment
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteAssessment(request, token, assessmentId) {
  console.log('Deleting assessment:', assessmentId);
  
  const response = await request.delete(`/api/assessment/${assessmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.status() === 200;
}

/**
 * Generate default assessment data for testing
 * @returns {Object} Default assessment data
 */
export function generateDefaultAssessment() {
  return {
    age: '25_34',
    cycleLength: '26_30',
    periodDuration: '4_5',
    flowHeaviness: 'moderate',
    painLevel: 'moderate',
    symptoms: {
      physical: ['Bloating', 'Headaches'],
      emotional: ['Mood swings', 'Irritability']
    }
  };
}

/**
 * Generate a more severe assessment profile
 * @returns {Object} Severe assessment data
 */
export function generateSevereAssessment() {
  return {
    age: '25_34',
    cycleLength: '21_25',
    periodDuration: '6_7',
    flowHeaviness: 'heavy',
    painLevel: 'severe',
    symptoms: {
      physical: ['Cramps', 'Headaches', 'Fatigue', 'Nausea'],
      emotional: ['Irritability', 'Anxiety', 'Depression']
    }
  };
} 