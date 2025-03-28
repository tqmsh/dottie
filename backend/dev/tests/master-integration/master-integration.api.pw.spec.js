import { test, expect } from '@playwright/test';

// Import utility modules in order: auth → assessment → user
import * as auth from './runners/auth.js';
import * as assessment from './runners/assessment.js';
import * as user from './runners/user.js';

/**
 * Master Integration Test
 * 
 * This test suite tests all endpoints in sequence to ensure
 * they work together as expected in a real-world scenario.
 * 
 * The test follows this flow:
 * 1. Authentication: Register user and login
 * 2. Assessment: Create and manage assessments
 * 3. User: Update and manage user information
 */

test.describe('Master Integration Test', () => {
  // Global variables to store data between tests
  let authToken;
  let userId;
  let firstAssessmentId;
  let secondAssessmentId;
  let testUser;

  // =====================
  // Authentication Tests
  // =====================
  test('1. Test basic endpoints before starting', async ({ request }) => {
    // Test /api/hello endpoint
    const helloResponse = await request.get('/api/hello');
    expect(helloResponse.status()).toBe(200);
    
    // Test database status endpoint
    const dbStatusResponse = await request.get('/api/setup/database/status');
    expect(dbStatusResponse.status()).toBe(200);
  });

  test('2. Register a new test user', async ({ request }) => {
    // Generate test user data
    testUser = auth.generateTestUser();
    
    // Register the user using the auth module
    const result = await auth.registerUser(request, testUser);
    userId = result.userId;
    authToken = result.token;
    
    console.log(`Created test user with ID: ${userId}`);
    
    // Verify we got a valid user and token
    expect(userId).toBeTruthy();
    expect(authToken).toBeTruthy();
    expect(result.userData.username).toBe(testUser.username);
  });

  test('3. Verify the auth token is valid', async ({ request }) => {
    const isValid = await auth.verifyToken(request, authToken);
    expect(isValid).toBeTruthy();
  });

  // =====================
  // Assessment Tests
  // =====================
  test('4. Create a first assessment', async ({ request }) => {
    // Create a basic assessment
    firstAssessmentId = await assessment.createAssessment(
      request, 
      authToken, 
      userId, 
      assessment.generateDefaultAssessment()
    );
    
    console.log(`Created first assessment with ID: ${firstAssessmentId}`);
    expect(firstAssessmentId).toBeTruthy();
    
    // Verify the assessment was created by fetching it
    const assessmentData = await assessment.getAssessmentById(
      request, 
      authToken, 
      firstAssessmentId
    );
    
    expect(assessmentData.id).toBe(firstAssessmentId);
    expect(assessmentData.userId).toBe(userId);
  });

  test('5. Get list of assessments', async ({ request }) => {
    const assessments = await assessment.getAssessments(request, authToken);
    
    // Should contain at least one assessment
    expect(assessments.length).toBeGreaterThanOrEqual(1);
    
    // Should contain our first assessment
    const hasFirstAssessment = assessments.some(a => a.id === firstAssessmentId);
    expect(hasFirstAssessment).toBeTruthy();
  });

  test('6. Update the first assessment', async ({ request }) => {
    // Update to more severe symptoms
    const updatedAssessment = await assessment.updateAssessment(
      request,
      authToken,
      firstAssessmentId,
      {
        flowHeaviness: 'heavy',
        painLevel: 'severe',
        symptoms: {
          physical: ['Bloating', 'Headaches', 'Cramps'],
          emotional: ['Mood swings', 'Irritability', 'Anxiety']
        }
      }
    );
    
    // Verify the update was successful
    expect(updatedAssessment.id).toBe(firstAssessmentId);
    expect(updatedAssessment.assessmentData.flowHeaviness).toBe('heavy');
    expect(updatedAssessment.assessmentData.painLevel).toBe('severe');
  });

  test('7. Create a second assessment', async ({ request }) => {
    // Create a severe assessment
    secondAssessmentId = await assessment.createAssessment(
      request,
      authToken,
      userId,
      assessment.generateSevereAssessment()
    );
    
    console.log(`Created second assessment with ID: ${secondAssessmentId}`);
    expect(secondAssessmentId).toBeTruthy();
    
    // Verify we now have at least two assessments
    const assessments = await assessment.getAssessments(request, authToken);
    expect(assessments.length).toBeGreaterThanOrEqual(2);
    
    // Both assessments should be in the list
    const hasFirstAssessment = assessments.some(a => a.id === firstAssessmentId);
    const hasSecondAssessment = assessments.some(a => a.id === secondAssessmentId);
    expect(hasFirstAssessment).toBeTruthy();
    expect(hasSecondAssessment).toBeTruthy();
  });

  // =====================
  // User Tests
  // =====================
  test('8. Get user information', async ({ request }) => {
    const userData = await user.getUserById(request, authToken, userId);
    
    // Verify we got the correct user
    expect(userData.id).toBe(userId);
    expect(userData.username).toBe(testUser.username);
    expect(userData.email).toBe(testUser.email);
  });

  test('9. Update user profile information', async ({ request }) => {
    // Generate profile update data
    const profileUpdate = user.generateProfileUpdate();
    
    // Update the profile
    const updatedUser = await user.updateUserProfile(
      request,
      authToken,
      userId,
      profileUpdate
    );
    
    // Verify the update was successful
    expect(updatedUser.id).toBe(userId);
    expect(updatedUser.username).toBe(profileUpdate.username);
    expect(updatedUser.age).toBe(profileUpdate.age);
  });

  test('10. Get all users (admin operation)', async ({ request }) => {
    const allUsers = await user.getAllUsers(request, authToken);
    
    // Should be an array of users
    expect(Array.isArray(allUsers)).toBeTruthy();
    
    // Should contain our test user
    const hasTestUser = allUsers.some(u => u.id === userId);
    expect(hasTestUser).toBeTruthy();
  });

  // =====================
  // Cleanup Tests
  // =====================
  test('11. Delete the second assessment', async ({ request }) => {
    const deleted = await assessment.deleteAssessment(
      request,
      authToken,
      secondAssessmentId
    );
    
    expect(deleted).toBeTruthy();
    
    // Verify it was deleted by trying to fetch it (should fail)
    try {
      await assessment.getAssessmentById(request, authToken, secondAssessmentId);
      // If we reach here, the assessment wasn't deleted
      expect(false).toBeTruthy('Assessment should have been deleted');
    } catch (error) {
      // We expect an error when trying to fetch a deleted assessment
      expect(error.message).toContain('Failed to get assessment: 404');
    }
    
    // Verify the first assessment still exists
    const firstAssessment = await assessment.getAssessmentById(
      request,
      authToken,
      firstAssessmentId
    );
    expect(firstAssessment.id).toBe(firstAssessmentId);
  });

  test('12. Delete the first assessment', async ({ request }) => {
    const deleted = await assessment.deleteAssessment(
      request,
      authToken,
      firstAssessmentId
    );
    
    expect(deleted).toBeTruthy();
    
    // Verify all assessments are deleted
    const assessments = await assessment.getAssessments(request, authToken);
    const hasAnyTestAssessment = assessments.some(
      a => a.id === firstAssessmentId || a.id === secondAssessmentId
    );
    expect(hasAnyTestAssessment).toBeFalsy();
  });

  // Note: Some APIs may not allow deleting users, so we'll mark this as skipped
  test.skip('13. Delete the test user', async ({ request }) => {
    const deleted = await user.deleteUser(request, authToken, userId);
    expect(deleted).toBeTruthy();
    
    // Try to access the user (should fail)
    try {
      await user.getUserById(request, authToken, userId);
      // If we reach here, the user wasn't deleted
      expect(false).toBeTruthy('User should have been deleted');
    } catch (error) {
      // We expect an error when trying to fetch a deleted user
      expect(error.message).toContain('Failed to get user info: 404');
    }
  });

  // =====================
  // Error Tests
  // =====================
  test('14. Test authentication errors', async ({ request }) => {
    // Try to access protected endpoint with invalid token
    const response = await request.get('/api/auth/users', {
      headers: {
        Authorization: 'Bearer invalid-token'
      }
    });
    
    expect(response.status()).toBe(401);
  });
}); 