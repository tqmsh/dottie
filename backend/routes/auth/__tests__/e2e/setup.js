// Common test setup for E2E tests
import { resolve } from 'path';

// API URL for tests
export const API_URL = process.env.API_URL || 'http://localhost:5000';

// Test ports
export const TEST_PORTS = {
  dev: {
    success: 5020,
    error: 5021,
    resetSuccess: 5022,
    resetError: 5023
  },
  prod: {
    success: 5030,
    error: 5031,
    resetSuccess: 5032,
    resetError: 5033
  }
};

// Helper function for resolving paths
export const resolvePath = (path) => resolve(__dirname, path); 