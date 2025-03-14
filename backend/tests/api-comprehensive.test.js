// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API Comprehensive Tests', () => {
  // Test the successful response case
  test('should return Hello World message with correct format', async ({ request }) => {
    // Send a request to the API endpoint
    const response = await request.get('/api/hello');
    
    // Verify the status code is 200 (OK)
    expect(response.status()).toBe(200);
    
    // Verify response headers indicate JSON content type
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
    
    // Parse the response body as JSON
    const responseBody = await response.json();
    
    // Verify the message matches what we expect
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Hello World from Dottie API!');
    expect(Object.keys(responseBody).length).toBe(1); // Only contains 'message' property
  });

  // Test error case - endpoint not found
  test('should return 404 for non-existent endpoint', async ({ request }) => {
    // Send a request to a non-existent API endpoint
    const response = await request.get('/api/non-existent-endpoint');
    
    // Verify the status code is 404 (Not Found)
    expect(response.status()).toBe(404);
  });
}); 