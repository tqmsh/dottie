import { test } from '@playwright/test';

/**
 * Main test file for authentication API endpoints
 * 
 * This file imports all the individual endpoint test files
 * to ensure they run in the correct order.
 */

test.describe('Authentication API Endpoints', () => {
  // Import test files in the order they should run
  test.describe.serial('Auth Tests', () => {
    test('Running signup tests', async () => {
      await import('./auth-endpoints/signup.api.pw.spec.js');
    });
    
    test('Running login tests', async () => {
      await import('./auth-endpoints/login.api.pw.spec.js');
    });
    
    test('Running users list tests', async () => {
      await import('./auth-endpoints/users-list.api.pw.spec.js');
    });
    
    test('Running user by ID tests', async () => {
      await import('./auth-endpoints/user-by-id.api.pw.spec.js');
    });
    
    test('Running logout tests', async () => {
      await import('./auth-endpoints/logout.api.pw.spec.js');
    });
  });
}); 