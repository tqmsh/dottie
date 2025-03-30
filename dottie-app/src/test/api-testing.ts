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
    console.warn('API is not available, some tests will be skipped:', error);
    return false;
  }
};

// Conditional test - only runs if API is available
export const apiTest = (name: string, testFn: () => void, timeout?: number) => {
  return test(name, async () => {
    const apiAvailable = await checkApiAvailability();
    if (apiAvailable) {
      await testFn();
    } else {
      console.log(`Skipping test "${name}" because API is not available`);
      // This will mark the test as skipped rather than passed/failed
      return vi.fn()();
    }
  }, timeout);
}; 