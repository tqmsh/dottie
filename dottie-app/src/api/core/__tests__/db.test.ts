import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../apiClient';
import { checkDbConnection, fetchUserData } from '../db';

// Mock the apiClient
vi.mock('../apiClient', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('Database API functions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('checkDbConnection', () => {
    it('should return status from the API when successful', async () => {
      const mockResponse = {
        data: {
          status: 'connected',
          message: 'Database connection successful'
        }
      };
      
      (apiClient.get as any).mockResolvedValueOnce(mockResponse);
      
      const result = await checkDbConnection();
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/setup/database/status');
      expect(result).toEqual(mockResponse.data);
    });

    it('should return error status when API call fails', async () => {
      const mockError = new Error('Network error');
      (apiClient.get as any).mockRejectedValueOnce(mockError);
      
      const result = await checkDbConnection();
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/setup/database/status');
      expect(result).toEqual({
        status: 'error',
        message: 'Failed to check database connection'
      });
    });
  });

  describe('fetchUserData', () => {
    it('should return user data when API call is successful', async () => {
      const userId = '123';
      const mockUserData = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const mockResponse = {
        data: mockUserData
      };
      
      (apiClient.get as any).mockResolvedValueOnce(mockResponse);
      
      const result = await fetchUserData(userId);
      
      expect(apiClient.get).toHaveBeenCalledWith(`/api/users/${userId}`);
      expect(result).toEqual(mockUserData);
    });

    it('should throw error when API call fails', async () => {
      const userId = '123';
      const mockError = new Error('API error');
      
      (apiClient.get as any).mockRejectedValueOnce(mockError);
      
      await expect(fetchUserData(userId)).rejects.toThrow(mockError);
      expect(apiClient.get).toHaveBeenCalledWith(`/api/users/${userId}`);
    });
  });
}); 