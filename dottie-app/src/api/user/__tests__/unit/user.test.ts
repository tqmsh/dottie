import { vi, describe, it, expect, beforeEach } from 'vitest';
import { userApi } from '../../../user';
import apiClient from '../../../core/apiClient';

// Mock the API client
vi.mock('../../../core/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('User API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch the current user profile', async () => {
      const mockData = { id: '1', name: 'Test User', email: 'test@example.com' };
      (apiClient.get as any).mockResolvedValueOnce({ data: mockData });
      
      const result = await userApi.getProfile();
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/user/me');
      expect(result).toEqual(mockData);
    });
  });

  describe('getUserById', () => {
    it('should fetch a user by ID', async () => {
      const mockId = '1';
      const mockData = { id: mockId, name: 'Test User', email: 'test@example.com' };
      (apiClient.get as any).mockResolvedValueOnce({ data: mockData });
      
      const result = await userApi.getUserById(mockId);
      
      expect(apiClient.get).toHaveBeenCalledWith(`/api/user/${mockId}`);
      expect(result).toEqual(mockData);
    });
  });

  describe('updateUser', () => {
    it('should update a user profile', async () => {
      const mockId = '1';
      const mockInput = { name: 'Updated Name' };
      const mockResponse = { id: mockId, name: 'Updated Name', email: 'test@example.com' };
      (apiClient.put as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await userApi.updateUser(mockId, mockInput);
      
      expect(apiClient.put).toHaveBeenCalledWith(`/api/user/${mockId}`, mockInput);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockId = '1';
      (apiClient.delete as any).mockResolvedValueOnce({});
      
      await userApi.deleteUser(mockId);
      
      expect(apiClient.delete).toHaveBeenCalledWith(`/api/user/${mockId}`);
    });
  });

  describe('resetPassword', () => {
    it('should request a password reset', async () => {
      const mockInput = { email: 'test@example.com' };
      const mockResponse = { message: 'Password reset email sent' };
      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await userApi.resetPassword(mockInput);
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/user/pw/reset', mockInput);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const mockInput = { currentPassword: 'old', newPassword: 'new' };
      const mockResponse = { message: 'Password updated successfully' };
      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await userApi.updatePassword(mockInput);
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/user/pw/update', mockInput);
      expect(result).toEqual(mockResponse);
    });
  });
}); 