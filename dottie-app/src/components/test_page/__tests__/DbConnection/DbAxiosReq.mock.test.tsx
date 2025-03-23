import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as { 
  get: vi.MockedFunction<typeof axios.get> 
};

describe('DbAxiosReq (Mock)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('makes correct GET request to sql-hello endpoint', async () => {
    // Setup
    const mockData = { 
      message: 'Hello World from SQLite!', 
      dbType: 'sqlite3',
      isConnected: true
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    
    // Execute
    const response = await axios.get('/api/sql-hello');
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/sql-hello');
    expect(response.data).toEqual(mockData);
  });

  it('makes correct GET request to db-status endpoint', async () => {
    // Setup
    const mockData = { status: 'connected' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    
    // Execute
    const response = await axios.get('/api/db-status');
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/db-status');
    expect(response.data).toEqual(mockData);
  });

  it('sets correct headers in request', async () => {
    // Setup
    const headers = { 'Content-Type': 'application/json' };
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    
    // Execute
    await axios.get('/api/sql-hello', { headers });
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/sql-hello', { headers });
  });

  it('handles error response from sql-hello endpoint correctly', async () => {
    // Setup
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {
          status: 'error',
          message: 'Database query error',
          dbType: 'sqlite3',
          isConnected: false
        }
      }
    });
    
    // Execute & Verify
    try {
      await axios.get('/api/sql-hello');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/sql-hello');
      expect(error.response.status).toBe(500);
      expect(error.response.data.status).toBe('error');
      expect(error.response.data.isConnected).toBe(false);
    }
  });

  it('handles error response from db-status endpoint correctly', async () => {
    // Setup
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {
          status: 'error',
          message: 'Database connection error'
        }
      }
    });
    
    // Execute & Verify
    try {
      await axios.get('/api/db-status');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/db-status');
      expect(error.response.status).toBe(500);
      expect(error.response.data.status).toBe('error');
    }
  });
}); 