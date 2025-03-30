import { vi, test } from 'vitest';
import { apiClient } from '../api';

/**
 * Utility functions for testing with the real API
 */

// Configure longer timeout for API tests
export const configureApiTestTimeout = (timeout = 10000) => {
  vi.setConfig({ testTimeout: timeout });
};

// Helper to safely make API calls in tests
export const makeApiCall = async (apiCallFn: () => Promise<any>) => {
  try {
    return await apiCallFn();
  } catch (error) {
    console.error('API call failed:', error);
    return { error };
  }
};

// Check if API is available (can be used in beforeAll)
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    await apiClient.get('/api/setup/health/hello');
    return true;
  } catch (error) {
    console.warn('API is not available, tests will use mock responses:', error);
    return false;
  }
};

// Check if API is available and throw error if not
export const requireRealApi = async (): Promise<void> => {
  try {
    await apiClient.get('/api/setup/health/hello');
    console.log('✅ Real API is available and will be used for tests');
  } catch (error) {
    console.error('❌ Real API is NOT available - tests will fail');
    throw new Error('Real API is not available. These tests require a real API connection.');
  }
};

// Mock the API client for testing
export const setupApiMock = () => {
  // Backup the original methods
  const originalGet = apiClient.get;
  const originalPost = apiClient.post;
  const originalPut = apiClient.put;
  const originalDelete = apiClient.delete;

  // Replace with mocks
  apiClient.get = vi.fn().mockImplementation((url) => {
    console.log(`[MOCK] GET request to ${url}`);
    
    // Return appropriate mock responses based on the endpoint
    if (url === '/api/setup/health/hello') {
      return Promise.resolve({ data: { message: "Hello World from Dottie API!" } });
    }
    
    // Default mock response
    return Promise.resolve({ data: { mocked: true, url } });
  });
  
  apiClient.post = vi.fn().mockImplementation((url) => {
    console.log(`[MOCK] POST request to ${url}`);
    return Promise.resolve({ data: { success: true, mocked: true, url } });
  });
  
  apiClient.put = vi.fn().mockImplementation((url) => {
    console.log(`[MOCK] PUT request to ${url}`);
    return Promise.resolve({ data: { success: true, mocked: true, url } });
  });
  
  apiClient.delete = vi.fn().mockImplementation((url) => {
    console.log(`[MOCK] DELETE request to ${url}`);
    return Promise.resolve({ data: { success: true, mocked: true, url } });
  });
  
  // Return function to restore original methods
  return () => {
    apiClient.get = originalGet;
    apiClient.post = originalPost;
    apiClient.put = originalPut;
    apiClient.delete = originalDelete;
  };
};

// Test that runs with real API or uses mocks with clear indication
export const apiTest = (name: string, testFn: () => void, timeout?: number) => {
  return test(`${name} [API TEST]`, async () => {
    const apiAvailable = await checkApiAvailability();
    
    // If API is not available, set up mocks and clearly indicate in console
    let restoreApi: (() => void) | null = null;
    if (!apiAvailable) {
      console.log(`⚠️ USING MOCK API for "${name}" - Test is passing with mocks, not real API`);
      restoreApi = setupApiMock();
      
      // Add a test-only property to the global object to indicate mock usage
      // This can be checked in test reports or CI
      (global as any).__USING_API_MOCK__ = true;
    } else {
      console.log(`✓ Using REAL API for "${name}"`);
      (global as any).__USING_API_MOCK__ = false;
    }
    
    try {
      // Run the test with either real API or mocks
      await testFn();
      
      // After test completes, log mock status again for clarity in reports
      if (!apiAvailable) {
        console.log(`⚠️ TEST PASSED WITH MOCKS: "${name}" - Still needs verification with real API`);
      }
    } finally {
      // Restore original API methods if we mocked them
      if (restoreApi) {
        restoreApi();
      }
    }
  }, timeout);
};

// Test that ONLY runs with real API, fails if not available
export const realApiTest = (name: string, testFn: () => void, timeout?: number) => {
  return test(`${name} [REAL API REQUIRED]`, async () => {
    // Check API availability - will throw error if not available
    await requireRealApi();
    
    // If we get here, the real API is available
    console.log(`Running test "${name}" with REAL API`);
    
    // Run the test with real API
    await testFn();
    
    console.log(`Completed test "${name}" with REAL API`);
  }, timeout);
}; 