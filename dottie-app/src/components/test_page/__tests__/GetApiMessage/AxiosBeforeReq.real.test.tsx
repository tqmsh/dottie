import { describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';

// Test interceptors to examine requests before they're sent
describe('AxiosBeforeReq (Real API)', () => {
  // Store original adapter to restore after tests
  const originalAdapter = axios.defaults.adapter;
  let requestConfig: any = null;
  
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

  it('prepares real request with correct URL', async () => {
    try {
      // Start the request
      const requestPromise = axios.get('/api/hello');
      
      // Verify request was configured correctly before completion
      expect(requestConfig).not.toBeNull();
      expect(requestConfig.url).toBe('/api/hello');
      expect(requestConfig.method).toBe('get');
      
      // Wait for completion
      await requestPromise;
    } catch (error) {
      console.error('API request failed:', error);
      // Fail test if API is not available
      expect(error).toBeFalsy();
    }
  });

  it('prepares real request with custom headers', async () => {
    try {
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
    } catch (error) {
      console.error('API request with headers failed:', error);
      // Fail test if API is not available
      expect(error).toBeFalsy();
    }
  });

  it('configures timeout for real requests', async () => {
    try {
      // Start request with timeout
      const requestPromise = axios.get('/api/hello', { timeout: 5000 });
      
      // Verify timeout was set before request completion
      expect(requestConfig).not.toBeNull();
      expect(requestConfig.timeout).toBe(5000);
      
      // Wait for completion
      await requestPromise;
    } catch (error) {
      console.error('API request with timeout failed:', error);
      // Fail test if API is not available
      expect(error).toBeFalsy();
    }
  });
}); 