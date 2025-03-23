import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import axios from 'axios';
import { isApiRunning, conditionalApiTest } from './api-test-setup';

describe('GetApiMessage (Real API)', () => {
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

  it('fetches real API message successfully',
    conditionalApiTest('fetches real API message successfully', async () => {
      // Make a real API call
      const response = await axios.get('/api/hello');
      
      // Verify real response structure
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(typeof response.data.message).toBe('string');
      console.log('API response message:', response.data.message);
    })
  );

  it('handles real API error cases gracefully',
    conditionalApiTest('handles real API error cases gracefully', async () => {
      try {
        // Make a call to a non-existent endpoint to test error handling
        await axios.get('/api/non-existent-endpoint');
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        // We expect this to fail with 404
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(404);
      }
    })
  );

  it('gets API status and health information',
    conditionalApiTest('gets API status and health information', async () => {
      // Make a real API call to check DB status
      const response = await axios.get('/api/db-status');
      
      // Verify real DB status response
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status');
      
      // Log actual status for debugging
      console.log('DB connection status:', response.data.status);
    })
  );
}); 