import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';
import { getApiUrl } from '../../../../../../test-utilities/urls.js';

// This test file tests the real Azure SQL connection in production
describe('Vercel Azure SQL Production Integration Tests', () => {
  // Set a longer timeout for these tests
  const TEST_TIMEOUT = 60000; // 60 seconds
  
  // Determine the API URL from our utility
  const apiUrl = getApiUrl('PROD');
  
  beforeAll(() => {
    // Force production testing mode
    process.env.TEST_ENV = 'PROD';
    // Ensure we're not in mock mode
    process.env.USE_MOCKS = 'false';
    
    console.log(`Testing against production URL: ${apiUrl}`);
  });
  
  // Test the SQL Hello endpoint
  it('should connect to the SQL hello endpoint in production', async () => {
    const endpoint = `${apiUrl}/api/sql-hello`;
    console.log(`Testing endpoint: ${endpoint}`);
    
    const response = await fetch(endpoint);
    console.log('API response status:', response.status);
    
    // Check that the endpoint is accessible
    expect(response.status).not.toBe(404);
    
    if (response.status === 200) {
      const data = await response.json();
      expect(data).toBeDefined();
      
      if (data.dbType === 'mssql') {
        expect(data.isConnected).toBe(true);
        expect(data.message).toContain('Azure SQL');
        console.log('Successfully connected to Azure SQL in production');
      } else {
        console.log(`API is using ${data.dbType} - Message: ${data.message}`);
      }
    } else if (response.status === 504) {
      // Log response for debugging
      try {
        const text = await response.text();
        console.error('Response body:', text);
      } catch (error) {
        console.error('Could not read response body');
      }
      
      // Fail the test on timeout to highlight database connection issues
      throw new Error(`SQL hello endpoint returned timeout (504) - Database connection issue detected. Please verify Azure SQL credentials in production environment.`);
    } else if (response.status === 500) {
      // Log response for debugging
      try {
        const text = await response.text();
        console.error('Response body:', text);
      } catch (error) {
        console.error('Could not read response body');
      }
      
      // Fail the test on server error
      throw new Error(`SQL hello endpoint returned server error (500). Please check server logs.`);
    } else {
      // Log response for debugging
      try {
        const text = await response.text();
        console.error('Response body:', text);
      } catch (error) {
        console.error('Could not read response body');
      }
      
      // Fail on any other non-200 status
      throw new Error(`SQL hello endpoint returned unexpected status ${response.status}`);
    }
  }, TEST_TIMEOUT);
  
  // Test the Database Status endpoint
  it('should check database status endpoint in production', async () => {
    const endpoint = `${apiUrl}/api/db-status`;
    console.log(`Testing endpoint: ${endpoint}`);
    
    const response = await fetch(endpoint);
    console.log('DB status response:', response.status);
    
    // Check that the endpoint is accessible
    expect(response.status).not.toBe(404);
    
    if (response.status === 200) {
      const data = await response.json();
      expect(data).toBeDefined();
      
      console.log('Database status:', data.status);
      
      // Verify database is actually connected
      expect(data.status).toBe('connected');
    } else if (response.status === 504) {
      // Log response for debugging
      try {
        const text = await response.text();
        console.error('Response body:', text);
      } catch (error) {
        console.error('Could not read response body');
      }
      
      // Fail the test on timeout to highlight database connection issues
      throw new Error(`DB status endpoint returned timeout (504) - Database connection issue detected. Please verify Azure SQL credentials in production environment.`);
    } else if (response.status === 500) {
      // Log response for debugging
      try {
        const text = await response.text();
        console.error('Response body:', text);
      } catch (error) {
        console.error('Could not read response body');
      }
      
      // Fail the test on server error
      throw new Error(`DB status endpoint returned server error (500). Please check server logs.`);
    } else {
      // Log response for debugging
      try {
        const text = await response.text();
        console.error('Response body:', text);
      } catch (error) {
        console.error('Could not read response body');
      }
      
      // Fail on any other non-200 status
      throw new Error(`DB status endpoint returned unexpected status ${response.status}`);
    }
  }, TEST_TIMEOUT);
}); 