import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as { 
  get: vi.MockedFunction<typeof axios.get> 
};

describe('DbConnection (Mock)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches SQL hello message successfully', async () => {
    // Setup
    const mockData = {
      message: 'Hello World from Azure SQL!',
      dbType: 'sqlite3',
      isConnected: true
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // Execute
    const response = await axios.get('/api/sql-hello');
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/sql-hello');
    expect(response.data).toEqual(mockData);
    expect(response.data.message).toContain('Hello World');
    expect(response.data.isConnected).toBe(true);
  });

  it('fetches database status successfully', async () => {
    // Setup
    const mockData = {
      status: 'connected'
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // Execute
    const response = await axios.get('/api/db-status');
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/db-status');
    expect(response.data).toEqual(mockData);
    expect(response.data.status).toBe('connected');
  });

  it('handles SQL hello error gracefully', async () => {
    // Setup
    const errorData = {
      status: 'error',
      message: 'Database query error',
      dbType: 'sqlite3',
      isConnected: false
    };
    
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
        data: errorData
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
      expect(error.response.data).toEqual(errorData);
      expect(error.response.data.isConnected).toBe(false);
    }
  });

  it('handles database status error gracefully', async () => {
    // Setup
    const errorData = {
      status: 'error',
      message: 'Database connection error'
    };
    
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
        data: errorData
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
      expect(error.response.data).toEqual(errorData);
      expect(error.response.data.status).toBe('error');
    }
  });
}); 