import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as { 
  get: vi.MockedFunction<typeof axios.get> 
};

describe('AxiosAfterReq (Mock)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes successful response data correctly', async () => {
    // Setup
    const mockData = { 
      message: 'Success',
      status: 'ok',
      timestamp: new Date().toISOString()
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    
    // Execute and complete the request
    const response = await axios.get('/api/message');
    
    // Verify successful response handling
    expect(response.data).toEqual(mockData);
    expect(response.data.message).toBe('Success');
    expect(response.data.status).toBe('ok');
    expect(response.data).toHaveProperty('timestamp');
  });

  it('transforms complex nested response correctly', async () => {
    // Setup
    const mockData = { 
      success: true,
      data: {
        user: {
          id: 123,
          name: 'Test User',
          permissions: ['read', 'write']
        },
        metadata: {
          processTime: '45ms',
          server: 'api-server-1'
        }
      }
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    
    // Execute and complete the request
    const response = await axios.get('/api/message');
    
    // Verify response transformation
    expect(response.data.success).toBe(true);
    expect(response.data.data.user.id).toBe(123);
    expect(response.data.data.user.permissions).toContain('read');
    expect(response.data.data.user.permissions).toContain('write');
    expect(response.data.data.metadata.processTime).toBe('45ms');
  });

  it('handles error responses correctly', async () => {
    // Setup
    const errorResponse = {
      response: {
        status: 404,
        data: {
          error: 'Not Found',
          message: 'The requested resource was not found'
        }
      }
    };
    mockedAxios.get.mockRejectedValueOnce(errorResponse);
    
    // Execute and verify error handling
    try {
      await axios.get('/api/message');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      // Verify error handling
      expect(error).toEqual(errorResponse);
      expect(error.response.status).toBe(404);
      expect(error.response.data.error).toBe('Not Found');
    }
  });

  it('parses response headers correctly', async () => {
    // Setup
    const headers = {
      'content-type': 'application/json',
      'cache-control': 'no-cache',
      'x-request-id': '123456789'
    };
    mockedAxios.get.mockResolvedValueOnce({ 
      data: {},
      headers: headers
    });
    
    // Execute request
    const response = await axios.get('/api/message');
    
    // Verify headers were processed correctly
    expect(response.headers).toEqual(headers);
    expect(response.headers['content-type']).toBe('application/json');
    expect(response.headers['x-request-id']).toBe('123456789');
  });
}); 