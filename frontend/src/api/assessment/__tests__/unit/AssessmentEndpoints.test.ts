import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as tokenManager from '../../../core/tokenManager';

// Mock tokenManager and apiClient
vi.mock('../../../core/tokenManager', () => ({
  getUserData: vi.fn(),
  getAuthToken: vi.fn()
}));

// Mock the apiClient module
vi.mock('../../../core/apiClient', () => ({
  apiClient: {
    put: vi.fn(),
    delete: vi.fn()
  }
}));

// Import after mocking
import { apiClient } from '../../../core/apiClient';
import { putUpdate } from '../../requests/putUpdate/Request';
import { deleteById } from '../../requests/deleteById/Request';

describe('Assessment API Endpoints', () => {
  const mockUserData = { id: 'user-123', email: 'test@example.com' };
  
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(tokenManager.getUserData).mockReturnValue(mockUserData);
    vi.mocked(tokenManager.getAuthToken).mockReturnValue('mock-token');
    vi.mocked(apiClient.put).mockResolvedValue({ data: { message: "Success" } });
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { message: "Success" } });
  });

  describe('PUT update assessment', () => {
    it('should call the correct endpoint with userId and assessmentId', async () => {
      // Arrange
      const assessmentId = "assessment-123";
      const updateData = { flowHeaviness: "heavy" };
      
      // Act
      await putUpdate(assessmentId, updateData);
      
      // Assert - This should pass with our changes
      expect(apiClient.put).toHaveBeenCalledWith(
        `/api/assessment/${mockUserData.id}/${assessmentId}`,
        updateData
      );
    });

    it('should throw error when user data is not available', async () => {
      // Arrange
      const assessmentId = "assessment-123";
      const updateData = { flowHeaviness: "heavy" };
      vi.mocked(tokenManager.getUserData).mockReturnValue(null);
      
      // Act & Assert
      await expect(putUpdate(assessmentId, updateData)).rejects.toThrow('User ID not found');
    });
  });

  describe('DELETE assessment', () => {
    it('should call the correct endpoint with userId and assessmentId', async () => {
      // Arrange
      const assessmentId = "assessment-123";
      
      // Act
      await deleteById(assessmentId);
      
      // Assert - This should pass with our changes
      expect(apiClient.delete).toHaveBeenCalledWith(
        `/api/assessment/${mockUserData.id}/${assessmentId}`
      );
    });

    it('should throw error when user data is not available', async () => {
      // Arrange
      const assessmentId = "assessment-123";
      vi.mocked(tokenManager.getUserData).mockReturnValue(null);
      
      // Act & Assert
      await expect(deleteById(assessmentId)).rejects.toThrow('User ID not found');
    });
  });
}); 