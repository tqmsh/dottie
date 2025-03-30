import { test, expect } from '@playwright/test';
import axios, { AxiosError } from 'axios';

// Helper function to make reliable API calls
async function makeApiCall(url: string) {
  try {
    return await axios.get(url);
  } catch (error: unknown) {
    console.error(`Error calling ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof AxiosError && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Test for Health Hello Endpoint
test('should call health/hello endpoint successfully', async () => {
  try {
    const response = await makeApiCall('http://localhost:3001/api/setup/health/hello');
    
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ 
      message: 'Hello World from Dottie API!' 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    test.fail(false, errorMessage);
  }
});

// Test for Database Status Endpoint
test('should call database/status endpoint successfully', async () => {
  try {
    const response = await makeApiCall('http://localhost:3001/api/setup/database/status');
    
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ 
      status: 'connected' 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    test.fail(false, errorMessage);
  }
});

// Test for Database Hello Endpoint
test('should call database/hello endpoint successfully', async () => {
  try {
    const response = await makeApiCall('http://localhost:3001/api/setup/database/hello');
    
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      message: 'Hello World from SQLite!',
      dbType: 'sqlite3',
      isConnected: true
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    test.fail(false, errorMessage);
  }
});
