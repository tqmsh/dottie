import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';

// Define the base API URL for production tests
export const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : 'https://dottie-api-zeta.vercel.app';

// Helper function to create a mock token for testing
export const createMockToken = () => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ 
    id: `test-user-${Date.now()}`, 
    email: `test_${Date.now()}@example.com`,
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64');
  const signature = 'mock_signature'; // This won't validate, but it's for structure testing
  return `${header}.${payload}.${signature}`;
};

// Generate a test token
export const testToken = createMockToken();
export const testUserId = `test-user-${Date.now()}`; 