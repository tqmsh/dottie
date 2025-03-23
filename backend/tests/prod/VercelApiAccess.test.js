import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';

// This file tests basic access to the Vercel-deployed API
describe('Vercel API Access Tests', () => {
  // Set a longer timeout for these tests since we're dealing with remote servers
  const TEST_TIMEOUT = 15000;
  
  // Define the API URL - update this with your actual URL
  const API_URL = 'https://dottie-api-zeta.vercel.app';
  
  // Test 1: Check basic API access
  it('should be able to reach the API', async () => {
    const response = await fetch(`${API_URL}/api/hello`);
    
    // Check status code - we should at least get a response
    expect(response.status).toBeDefined();
    console.log(`API response status: ${response.status}`);
    
    // If it's a 200 OK, attempt to read the body as text
    if (response.status === 200) {
      const text = await response.text();
      console.log(`API response text: ${text.substring(0, 100)}...`);
    } else if (response.status === 401) {
      // 401 is acceptable for API that requires authentication
      console.log('API requires authentication - this is expected if project is not public');
    } else if (response.status === 404) {
      // 404 means the API doesn't exist or isn't deployed
      throw new Error('API endpoint not found (404) - deployment may not be active');
    } else {
      console.log(`Unexpected status code: ${response.status}`);
      throw new Error(`API returned unexpected status: ${response.status}`);
    }
  }, TEST_TIMEOUT);
  
  // Test 2: Check API access with query parameters
  it('should handle query parameters', async () => {
    const response = await fetch(`${API_URL}/api/hello?test=1`);
    
    expect(response.status).toBeDefined();
    console.log(`API with query params response status: ${response.status}`);
    
    // Fail if the endpoint doesn't exist
    if (response.status === 404) {
      throw new Error('API endpoint not found (404) with query parameters');
    }
  }, TEST_TIMEOUT);
  
  // Test 3: Check the serverless-test endpoint
  it('should access the serverless-test endpoint', async () => {
    const response = await fetch(`${API_URL}/api/serverless-test`);
    
    expect(response.status).toBeDefined();
    console.log(`Serverless test endpoint status: ${response.status}`);
    
    // Fail if the endpoint doesn't exist
    if (response.status === 404) {
      throw new Error('Serverless test endpoint not found (404)');
    }
  }, TEST_TIMEOUT);
}); 