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

// Mock the API client for testing
export const setupApiMock = () => {
  // Backup the original methods
  const originalGet = apiClient.get;
  const originalPost = apiClient.post;
  const originalPut = apiClient.put;
  const originalDelete = apiClient.delete;

  // Replace with mocks
  apiClient.get = vi.fn().mockImplementation((url) => {
    console.log(`Mocking GET request to ${url}`);
    
    // Return appropriate mock responses based on the endpoint
    if (url === '/api/setup/health/hello') {
      return Promise.resolve({ data: { message: "Hello World from Dottie API!" } });
    }
    
    // Default mock response
    return Promise.resolve({ data: { mocked: true, url } });
  });
  
  apiClient.post = vi.fn().mockImplementation((url) => {
    console.log(`Mocking POST request to ${url}`);
    return Promise.resolve({ data: { success: true, mocked: true, url } });
  });
  
  apiClient.put = vi.fn().mockImplementation((url) => {
    console.log(`Mocking PUT request to ${url}`);
    return Promise.resolve({ data: { success: true, mocked: true, url } });
  });
  
  apiClient.delete = vi.fn().mockImplementation((url) => {
    console.log(`Mocking DELETE request to ${url}`);
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

// Test that always runs (with real API or mock)
export const apiTest = (name: string, testFn: () => void, timeout?: number) => {
  return test(name, async () => {
    const apiAvailable = await checkApiAvailability();
    
    // If API is not available, set up mocks
    let restoreApi: (() => void) | null = null;
    if (!apiAvailable) {
      console.log(`API not available for test "${name}", using mock responses`);
      restoreApi = setupApiMock();
    }
    
    try {
      // Run the test with either real API or mocks
      await testFn();
    } finally {
      // Restore original API methods if we mocked them
      if (restoreApi) {
        restoreApi();
      }
    }
  }, timeout);
}; 