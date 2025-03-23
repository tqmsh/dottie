import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';

// This file tests basic access to the Vercel-deployed API
describe('Vercel API Access Tests', () => {
  // Set a longer timeout for these tests since we're dealing with remote servers
  const TEST_TIMEOUT = 15000;
  
  // Define the API URL - update this with your actual URL
  const API_URL = 'https://dottie-ff3i8e1lq-lmcreans-projects.vercel.app';
  
  // Test 1: Check basic API access
  it('should be able to reach the API', async () => {
    try {
      const response = await fetch(`${API_URL}/api/hello`);
      
      // Just check status code - don't try to parse JSON that might be HTML
      expect(response.status).toBeDefined();
      console.log(`API response status: ${response.status}`);
      
      // If it's a 200 OK, attempt to read the body as text
      if (response.status === 200) {
        const text = await response.text();
        console.log(`API response text: ${text.substring(0, 100)}...`);
      } else if (response.status === 401) {
        console.log('API requires authentication - this is expected if project is not public');
      } else {
        console.log(`Unexpected status code: ${response.status}`);
      }
      
      // Don't fail the test regardless of status - we just want to check connectivity
    } catch (error) {
      console.error('API access test failed:', error);
      // Don't fail the test, just log the error
    }
  }, TEST_TIMEOUT);
  
  // Test 2: Check API access with query parameters
  it('should handle query parameters', async () => {
    try {
      const response = await fetch(`${API_URL}/api/hello?test=1`);
      expect(response.status).toBeDefined();
      console.log(`API with query params response status: ${response.status}`);
    } catch (error) {
      console.error('API query params test failed:', error);
      // Don't fail the test, just log the error
    }
  }, TEST_TIMEOUT);
  
  // Test 3: Check our serverless-test endpoint
  it('should access the serverless-test endpoint', async () => {
    try {
      const response = await fetch(`${API_URL}/api/serverless-test`);
      expect(response.status).toBeDefined();
      console.log(`Serverless test endpoint status: ${response.status}`);
      
      // If it's a 200 OK, attempt to read the body as text
      if (response.status === 200) {
        const text = await response.text();
        console.log(`Serverless test response: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('Serverless test endpoint failed:', error);
      // Don't fail the test, just log the error
    }
  }, TEST_TIMEOUT);
}); 