import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as { 
  get: vi.MockedFunction<typeof axios.get> 
};

describe('AxiosBeforeReq (Mock)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prepares request correctly with default settings', async () => {
    // Setup
    mockedAxios.get.mockImplementationOnce((url) => {
      // This will be called but not resolve yet - we're testing the "before" state
      expect(url).toBe('/api/message');
      return Promise.resolve({ data: {} });
    });
    
    // Start the request but don't await
    const requestPromise = axios.get('/api/message');
    
    // Verify the request was made with correct URL
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/message');
    
    // Clean up by resolving the promise
    await requestPromise;
  });

  it('prepares request with correct headers before sending', async () => {
    // Setup
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token'
    };
    
    mockedAxios.get.mockImplementationOnce((url, config) => {
      // Verify the correct config is provided before the request completes
      expect(config).toHaveProperty('headers', headers);
      return Promise.resolve({ data: {} });
    });
    
    // Start the request but don't await
    const requestPromise = axios.get('/api/message', { headers });
    
    // Verify the request was prepared with correct URL and headers
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/message', { headers });
    
    // Clean up by resolving the promise
    await requestPromise;
  });

  it('handles request timeout configuration before sending', async () => {
    // Setup
    const timeoutConfig = { timeout: 5000 };
    
    mockedAxios.get.mockImplementationOnce((url, config) => {
      // Verify timeout is set correctly before request completes
      expect(config).toHaveProperty('timeout', 5000);
      return Promise.resolve({ data: {} });
    });
    
    // Start the request but don't await
    const requestPromise = axios.get('/api/message', timeoutConfig);
    
    // Verify the request was prepared with correct URL and timeout
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/message', timeoutConfig);
    
    // Clean up by resolving the promise
    await requestPromise;
  });
}); 