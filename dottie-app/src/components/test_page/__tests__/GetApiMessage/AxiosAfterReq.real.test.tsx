import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import axios from 'axios';
import { isApiRunning, conditionalApiTest } from './api-test-setup';

describe('AxiosAfterReq (Real API)', () => {
  let apiAvailable = false;

  beforeAll(async () => {
    // Check if API is available before running tests
    apiAvailable = await isApiRunning();
    if (!apiAvailable) {
      console.log('⚠️ API is not available. Some tests will be skipped.');
    } else {
      console.log('✅ API is available. Running real API tests.');
    }
  });
  
  beforeEach(() => {
    // No mocks to clear
  });

  it('processes successful response data from real API correctly',
    conditionalApiTest('processes successful response data from real API correctly', async () => {
      // Make a real API call
      const response = await axios.get('/api/hello');
      
      // Verify successful response
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(typeof response.data.message).toBe('string');
      
      // Log actual response for debugging
      console.log('API response:', response.data);
    })
  );

  it('processes complex nested response from real API',
    conditionalApiTest('processes complex nested response from real API', async () => {
      // The SQL hello endpoint returns a more complex response
      const response = await axios.get('/api/sql-hello');
      
      // Verify response structure
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('dbType');
      expect(response.data).toHaveProperty('isConnected');
      
      // Log actual response for debugging
      console.log('SQL response:', response.data);
    })
  );

  it('handles real API error responses correctly',
    conditionalApiTest('handles real API error responses correctly', async () => {
      try {
        // Make a call to a non-existent endpoint
        await axios.get('/api/non-existent-endpoint');
        
        // Should not reach here if API returns proper error
        expect(true).toBe(false);
      } catch (error: any) {
        // Verify error handling
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(404);
        
        // Log actual error for debugging
        console.log('Expected 404 error status:', error.response.status);
      }
    })
  );

  it('receives and processes headers from real API',
    conditionalApiTest('receives and processes headers from real API', async () => {
      // Make a real API call
      const response = await axios.get('/api/hello');
      
      // Verify headers exist
      expect(response.headers).toBeDefined();
      
      // Common headers we expect to see
      expect(response.headers['content-type']).toContain('application/json');
      
      // Log actual headers for debugging
      console.log('Response headers:', Object.keys(response.headers).join(', '));
    })
  );
}); 