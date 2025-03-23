import { describe, it, expect, beforeEach, beforeAll, afterEach } from 'vitest';
import axios from 'axios';
import { isApiRunning, conditionalApiTest } from './api-test-setup';

// Test interceptors to examine requests before they're sent
describe('AxiosBeforeReq (Real API)', () => {
  let apiAvailable = false;
  let requestConfig: any = null;
  
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
    // Reset captured request
    requestConfig = null;
    
    // Create interceptor to capture request config before it's sent
    axios.interceptors.request.use(
      (config) => {
        // Capture the config
        requestConfig = { ...config };
        return config;
      },
      (error) => Promise.reject(error)
    );
  });

  afterEach(() => {
    // Clear all interceptors
    axios.interceptors.request.clear();
  });

  it('prepares real request with correct URL',
    conditionalApiTest('prepares real request with correct URL', async () => {
      // Start the request
      const requestPromise = axios.get('/api/hello');
      
      // Verify request was configured correctly before completion
      expect(requestConfig).not.toBeNull();
      expect(requestConfig.url).toBe('/api/hello');
      expect(requestConfig.method).toBe('get');
      
      // Wait for completion
      await requestPromise;
    })
  );

  it('prepares real request with custom headers',
    conditionalApiTest('prepares real request with custom headers', async () => {
      // Custom headers
      const headers = {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'test-value'
      };
      
      // Start the request with headers
      const requestPromise = axios.get('/api/hello', { headers });
      
      // Verify headers were set correctly before request completion
      expect(requestConfig).not.toBeNull();
      expect(requestConfig.headers['Content-Type']).toBe('application/json');
      expect(requestConfig.headers['X-Custom-Header']).toBe('test-value');
      
      // Wait for completion
      await requestPromise;
    })
  );

  it('configures timeout for real requests',
    conditionalApiTest('configures timeout for real requests', async () => {
      // Start request with timeout
      const requestPromise = axios.get('/api/hello', { timeout: 5000 });
      
      // Verify timeout was set before request completion
      expect(requestConfig).not.toBeNull();
      expect(requestConfig.timeout).toBe(5000);
      
      // Wait for completion
      await requestPromise;
    })
  );
}); 