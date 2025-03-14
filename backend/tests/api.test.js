// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API Tests', () => {
  test('should return Hello World message', async ({ request }) => {
    // Send a request to the API endpoint
    const response = await request.get('/api/hello');
    
    // Verify the status code is 200 (OK)
    expect(response.status()).toBe(200);
    
    // Parse the response body as JSON
    const responseBody = await response.json();
    
    // Verify the message matches what we expect
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Hello World from Dottie API!');
  });
}); 