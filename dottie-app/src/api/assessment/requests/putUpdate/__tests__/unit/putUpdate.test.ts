import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { putUpdate } from '../../Request';
import { apiClient } from '../../../../../core/apiClient';

// Mock the apiClient
vi.mock('../../../../../core/apiClient', () => ({
  apiClient: {
    put: vi.fn(),
  },
}));

describe('putUpdate request', () => {
  const assessmentId = '123';
  
  const mockAssessmentData = {
    flowHeaviness: 'Heavy',
    painLevel: 'High',
    symptoms: {
      physical: ['Cramps', 'Bloating', 'Headache'],
      emotional: ['Mood swings', 'Irritability'],
    },
  };

  const mockUpdatedAssessment = {
    id: assessmentId,
    date: '2023-04-15',
    pattern: 'Regular',
    age: '25',
    cycleLength: '28',
    periodDuration: '5',
    ...mockAssessmentData,
    recommendations: [
      {
        title: 'Rest',
        description: 'Ensure you get adequate rest during this time',
      },
      {
        title: 'Pain management',
        description: 'Consider over-the-counter pain relievers if needed',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should update assessment successfully', async () => {
    // Arrange
    const mockResponse = { data: mockUpdatedAssessment };
    (apiClient.put as any).mockResolvedValueOnce(mockResponse);
    
    // Act
    const result = await putUpdate(assessmentId, mockAssessmentData);
    
    // Assert
    expect(apiClient.put).toHaveBeenCalledTimes(1);
    expect(apiClient.put).toHaveBeenCalledWith(`/api/assessment/${assessmentId}`, mockAssessmentData);
    expect(result).toEqual(mockUpdatedAssessment);
    expect(result.flowHeaviness).toBe('Heavy');
    expect(result.symptoms.physical).toContain('Headache');
  });

  it('should throw an error when the request fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (apiClient.put as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    await expect(putUpdate(assessmentId, mockAssessmentData)).rejects.toThrow('Network error');
    expect(apiClient.put).toHaveBeenCalledTimes(1);
    expect(apiClient.put).toHaveBeenCalledWith(`/api/assessment/${assessmentId}`, mockAssessmentData);
  });

  it('should propagate the original error', async () => {
    // Arrange
    const mockError = new Error('API error');
    (apiClient.put as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    try {
      await putUpdate(assessmentId, mockAssessmentData);
      // Force test to fail if no error is thrown
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
}); 