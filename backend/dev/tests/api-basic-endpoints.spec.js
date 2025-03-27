import { test, expect } from '@playwright/test';

// Test suite for basic API endpoints
test.describe('Basic API Endpoints', () => {
  
  // Test for /api/hello endpoint
  test('GET /api/hello - should return a greeting message', async ({ request }) => {
    // Send a GET request to the /api/hello endpoint
    const response = await request.get('/api/hello');
    
    // Assert that the response status is 200 OK
    expect(response.status()).toBe(200);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains a message property
    expect(data).toHaveProperty('message');
    // You might want to check the exact message if known
    // expect(data.message).toBe('expected message here');
  });
  
  // Test for /api/db-status endpoint
  test('GET /api/db-status - should return database connection status', async ({ request }) => {
    // Send a GET request to the /api/db-status endpoint
    const response = await request.get('/api/db-status');
    
    // Assert that the response status is 200 OK
    expect(response.status()).toBe(200);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Assert that the response contains a status property
    expect(data).toHaveProperty('status');
    
    // Check if the database is connected or not
    // The actual value depends on your application's implementation
    // expect(data.status).toBe('connected'); or expect(data.status).toBe('disconnected');
  });
}); 