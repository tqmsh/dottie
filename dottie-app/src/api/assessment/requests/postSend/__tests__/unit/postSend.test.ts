import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { postSend } from '../../Request';
import { apiClient } from '../../../../../core/apiClient';

// Mock the apiClient
vi.mock('../../../../../core/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('postSend request', () => {
  const mockAssessmentData = {
    date: '2023-04-15',
    pattern: 'Regular',
    age: '25',
    cycleLength: '28',
    periodDuration: '5',
    flowHeaviness: 'Medium',
    painLevel: 'Low',
    symptoms: {
      physical: ['Cramps', 'Bloating'],
      emotional: ['Mood swings'],
    },
    recommendations: [
      {
        title: 'Exercise',
        description: 'Regular exercise can help reduce period pain',
      },
    ],
  };

  const mockAssessmentResponse = {
    ...mockAssessmentData,
    id: '123'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should send assessment data successfully', async () => {
    // Arrange
    const mockResponse = { data: mockAssessmentResponse };
    (apiClient.post as any).mockResolvedValueOnce(mockResponse);
    
    // Act
    const result = await postSend(mockAssessmentData);
    
    // Assert
    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith('/api/assessment/send', mockAssessmentData);
    expect(result).toEqual(mockAssessmentResponse);
    expect(result.id).toBe('123');
  });

  it('should throw an error when the request fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (apiClient.post as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    await expect(postSend(mockAssessmentData)).rejects.toThrow('Network error');
    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith('/api/assessment/send', mockAssessmentData);
  });

  it('should propagate the original error', async () => {
    // Arrange
    const mockError = new Error('API error');
    (apiClient.post as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    try {
      await postSend(mockAssessmentData);
      // Force test to fail if no error is thrown
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
}); 